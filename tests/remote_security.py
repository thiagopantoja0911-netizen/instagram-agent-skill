#!/usr/bin/env python3
"""Security smoke checks for the remote MCP ASGI resource server.

No real tokens are used. Tests startup fail-closed and anonymous request denial.
"""
import asyncio
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))


def test_no_config() -> None:
    env = dict(os.environ)
    for k in list(env):
        if k.startswith("MCP_"):
            del env[k]
    process = subprocess.run(
        [sys.executable, "-c", "import server.remote_app"],
        cwd=str(ROOT), env=env, text=True,
        capture_output=True, timeout=20,
    )
    assert process.returncode != 0, "Remote app must refuse to boot without OAuth config"
    assert "MCP_PUBLIC_RESOURCE_URL" in process.stderr, process.stderr
    print("PASS remote auth: missing configuration prevents boot")


async def test_unauthorized() -> None:
    env = {
        "MCP_PUBLIC_RESOURCE_URL": "https://mcp.example.com/mcp",
        "MCP_OAUTH_ISSUER_URL": "https://accounts.example.com",
        "MCP_OAUTH_INTROSPECTION_URL": "https://accounts.example.com/introspect",
        "MCP_OAUTH_CLIENT_ID": "integration-test",
        "MCP_OAUTH_CLIENT_SECRET": "test-placeholder-not-a-real-secret",
        "MCP_ALLOWED_ORIGINS": "https://chatgpt.com",
        "MCP_REQUIRED_SCOPE": "instagram:analyze",
    }
    os.environ.update(env)
    from server.remote_app import app

    import httpx
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="https://mcp.example.com") as client:
        response = await client.post(
            "/mcp",
            headers={
                "Accept": "application/json, text/event-stream",
                "Content-Type": "application/json",
            },
            json={"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}},
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}: {response.text}"
    print("PASS remote auth: anonymous MCP tools/list denied (401)")



async def test_token_introspection() -> None:
    """Accept only an active, unexpired token for the correct issuer/audience/scope."""
    from unittest.mock import patch
    import httpx
    from server.remote_app import IntrospectionVerifier

    resource = "https://mcp.example.com/mcp"
    issuer = "https://accounts.example.com"
    future = __import__("time").time() + 300
    good = {
        "active": True,
        "client_id": "authorized-chatgpt",
        "iss": issuer,
        "aud": resource,
        "scope": "instagram:analyze",
        "exp": future,
        "sub": "test-user",
    }

    class FakeClient:
        def __init__(self, **kwargs):
            pass

        async def __aenter__(self):
            return self

        async def __aexit__(self, *args):
            pass

        async def post(self, url, **kwargs):
            token = kwargs["data"]["token"]
            if token == "valid":
                return httpx.Response(200, json=good)
            if token == "bad-audience":
                return httpx.Response(200, json={**good, "aud": "https://other.example/mcp"})
            if token == "expired":
                return httpx.Response(200, json={**good, "exp": 1})
            if token == "no-scope":
                return httpx.Response(200, json={**good, "scope": "profile:read"})
            return httpx.Response(200, json={"active": False})

    verifier = IntrospectionVerifier(
        endpoint=f"{issuer}/introspect",
        issuer=issuer,
        resource=resource,
        client_id="introspection-client",
        client_secret="fake-test-secret",
        scope="instagram:analyze",
    )
    with patch("server.remote_app.httpx.AsyncClient", FakeClient):
        valid = await verifier.verify_token("valid")
        assert valid is not None
        assert str(valid.resource) == resource
        for invalid in ("bad-audience", "expired", "no-scope", "revoked"):
            assert await verifier.verify_token(invalid) is None, invalid
    print("PASS OAuth introspection: correct token accepted; wrong tokens denied")


if __name__ == "__main__":
    test_no_config()
    asyncio.run(test_unauthorized())
    asyncio.run(test_token_introspection())
    print("REMOTE SECURITY SMOKE TESTS PASSED")
