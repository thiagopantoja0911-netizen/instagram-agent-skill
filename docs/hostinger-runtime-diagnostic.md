# Hostinger diagnostic log — 2026-11-09

The isolated Instagram MCP site was provisioned under `instagram-mcp.secretssystem.online`, using the active Hostinger plan, without changing the existing Secrets audit server.

- Python/Node Pyodide parity tests passed in GitHub Actions for all six original scripts.
- Hostinger Git deploy, npm dependency installation, build and Node app restart succeeded.
- SSL became active, HTTPS redirect enabled and CDN disabled.
- External check of the protected MCP app returned unexpected 503 **on /health** (the health endpoint should respond 200 even while OAuth is locked), so the real application must not be advertised as operational.
- Hostinger runtime-log API returned HTTP 500 on both the new site and existing MCP site, making that channel unsuitable for diagnosis.
- A separate temporary `diag/instagram-hostinger` branch contains a tiny locked Node HTTP listener. Temporarily deploying it to the Instagram-only site distinguishes Hostinger runtime capacity/network issues from the full MCP app. The diagnostic exposes no tools and returns 503 on /mcp.
- After diagnosis, restore deployment to `deploy/instagram-hostinger` with the reviewed fixes; never switch the existing audit site.

Do not connect ChatGPT MCP until HTTPS health checks and authenticated/unauthenticated MCP protocol checks pass.
