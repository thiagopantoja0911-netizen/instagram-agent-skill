#!/usr/bin/env python3
"""Fail-closed remote ASGI entrypoint for the Instagram Agent MCP server.

This is a resource server, not an authorization server. Supply an OAuth 2.1
identity provider that supports RFC 7662 introspection before deploying.
No credentials or permissive/demo tokens are embedded in the repository.
"""
from __future__ import annotations

import os
import time
from urllib.parse import urlparse

import httpx
from pydantic import AnyHttpUrl
from mcp.server.auth.provider import AccessToken, TokenVerifier
from mcp.server.auth.settings import AuthSettings
from mcp.server.mcpserver import MCPServer
from mcp.server.transport_security import TransportSecuritySettings
from server import instagram_agent_mcp as local

TOOLS = (
    local.score_hooks,
    local.build_beats,
    local.lint_caption,
    local.humanize_text,
    local.detect_human_score,
    local.analyze_swipe_file,
)


def _https_url(name: str, *, allow_path: bool = True) -> str:
    value = os.getenv(name, "").strip()
    parsed = urlparse(value)
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
        raise RuntimeError(f"{name} deve ser uma URL HTTPS válida, sem credenciais.")
    if parsed.query or parsed.fragment or (not allow_path and parsed.path not in ("", "/")):
        raise RuntimeError(f"{name} contém partes não permitidas.")
    return value.rstrip("/")


class IntrospectionVerifier(TokenVerifier):
    """Validate bearer tokens against a trusted RFC 7662 introspection endpoint."""

    def __init__(self, *, endpoint: str, issuer: str, resource: str,
                 client_id: str, client_secret: str, scope: str):
        self.endpoint = endpoint
        self.issuer = issuer
        self.resource = resource
        self.client_id = client_id
        self.client_secret = client_secret
        self.scope = scope

    async def verify_token(self, token: str) -> AccessToken | None:
        # All network and payload failures deny access.
        if not token or len(token) > 8192:
            return None
        try:
            async with httpx.AsyncClient(timeout=5.0, follow_redirects=False) as client:
                response = await client.post(
                    self.endpoint,
                    data={"token": token},
                    auth=(self.client_id, self.client_secret),
                    headers={"Accept": "application/json"},
                )
            if response.status_code != 200:
                return None
            data = response.json()
            if not isinstance(data, dict) or data.get("active") is not True:
                return None
            if data.get("iss") != self.issuer:
                return None
            audience = data.get("aud", data.get("resource", []))
            audiences = [audience] if isinstance(audience, str) else audience
            if not isinstance(audiences, list) or self.resource not in audiences:
                return None
            exp = data.get("exp")
            if not isinstance(exp, (int, float)) or exp <= time.time():
                return None
            raw_scopes = data.get("scope", "")
            scopes = raw_scopes.split() if isinstance(raw_scopes, str) else raw_scopes
            if not isinstance(scopes, list) or not all(isinstance(s, str) for s in scopes):
                return None
            if self.scope not in scopes or not isinstance(data.get("client_id"), str):
                return None
            return AccessToken(
                token=token,
                client_id=data["client_id"],
                scopes=scopes,
                resource=self.resource,
                expires_at=int(exp),
                subject=data.get("sub") if isinstance(data.get("sub"), str) else None,
            )
        except (httpx.HTTPError, ValueError, TypeError, KeyError):
            return None


def build_app():
    """Create a protected Streamable HTTP app; abort on missing security config."""
    resource = _https_url("MCP_PUBLIC_RESOURCE_URL")
    issuer = _https_url("MCP_OAUTH_ISSUER_URL")
    introspection = _https_url("MCP_OAUTH_INTROSPECTION_URL")

    if not resource.endswith("/mcp"):
        raise RuntimeError("MCP_PUBLIC_RESOURCE_URL deve terminar em /mcp.")
    parsed = urlparse(resource)
    if not issuer or not introspection:
        raise RuntimeError("OAuth issuer/introspection endpoint ausente.")

    client_id = os.getenv("MCP_OAUTH_CLIENT_ID", "").strip()
    client_secret = os.getenv("MCP_OAUTH_CLIENT_SECRET", "")
    if not client_id or len(client_secret) < 12:
        raise RuntimeError("Credenciais de introspecção OAuth não configuradas.")
    scope = os.getenv("MCP_REQUIRED_SCOPE", "instagram:analyze").strip()
    if not scope or " " in scope:
        raise RuntimeError("MCP_REQUIRED_SCOPE deve conter um escopo único válido.")

    origins_str = os.getenv("MCP_ALLOWED_ORIGINS", "").strip()
    origins = [x.strip() for x in origins_str.split(",") if x.strip()]
    if not origins or any(urlparse(o).scheme != "https" for o in origins):
        raise RuntimeError("Configure MCP_ALLOWED_ORIGINS com origens HTTPS permitidas.")
    if any(urlparse(o).path not in ("", "/") for o in origins):
        raise RuntimeError("MCP_ALLOWED_ORIGINS deve conter apenas origens, sem caminhos.")

    verifier = IntrospectionVerifier(
        endpoint=introspection,
        issuer=issuer,
        resource=resource,
        client_id=client_id,
        client_secret=client_secret,
        scope=scope,
    )
    server = MCPServer(
        "Instagram Agent",
        token_verifier=verifier,
        auth=AuthSettings(
            issuer_url=AnyHttpUrl(issuer),
            resource_server_url=AnyHttpUrl(resource),
            required_scopes=[scope],
            validate_token_resource=True,
        ),
    )
    for tool in TOOLS:
        server.tool()(tool)

    security = TransportSecuritySettings(
        enable_dns_rebinding_protection=True,
        allowed_hosts=[parsed.netloc],
        allowed_origins=origins,
    )
    return server.streamable_http_app(
        streamable_http_path="/mcp",
        json_response=True,
        stateless_http=True,
        max_request_body_size=256 * 1024,
        transport_security=security,
        host=parsed.hostname,
    )


# A hosting platform imports "app". Missing OAuth configuration fails startup:
# the server must never become public without authentication.
app = build_app()
