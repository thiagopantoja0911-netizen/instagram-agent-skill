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


if __name__ == "__main__":
    test_no_config()
    asyncio.run(test_unauthorized())
    print("REMOTE SECURITY SMOKE TESTS PASSED")
