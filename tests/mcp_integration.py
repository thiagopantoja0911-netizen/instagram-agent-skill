#!/usr/bin/env python3
"""MCP v2 end-to-end integration checks using the official in-memory Client.

This verifies discovery, tool schemas and actual protocol calls through MCPServer,
not just direct execution of the six Python files.
"""
from __future__ import annotations

import asyncio
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from mcp import Client
from server.instagram_agent_mcp import mcp

EXPECTED = {
    "score_hooks",
    "build_beats",
    "lint_caption",
    "humanize_text",
    "detect_human_score",
    "analyze_swipe_file",
}

TSV = (
    "account\tfollowers\tmedian\tviews\thook\n"
    "@a\t12000\t1000\t12000\tnobody tells you what matters\n"
    "@b\t9000\t2000\t5000\tmy client lost three invoices\n"
)


async def main() -> None:
    async with Client(mcp, raise_exceptions=True) as client:
        discovered = await client.list_tools()
        tools = discovered.tools if hasattr(discovered, "tools") else discovered
        names = {tool.name for tool in tools}
        assert names == EXPECTED, f"Tools mismatch: {names ^ EXPECTED}"
        print("PASS tools/list:", ", ".join(sorted(names)))

        cases = [
            ("score_hooks", {"hooks": ["I lost $18,000 because of one missing contract."]}, "score"),
            (
                "build_beats",
                {"script": "I lost $18,000 because of one missing contract.\nCheck the clause before you sign.\n"},
                "total_seconds",
            ),
            ("lint_caption", {"caption": "Read this contract clause. #contracts"}, "verdict"),
            ("humanize_text", {"text": "In today's fast-paced world—check this clause."}, "report"),
            ("detect_human_score", {"text": "I lost $18,000 because of one missing contract."}, "human_score"),
            ("analyze_swipe_file", {"tsv": TSV}, "reels"),
        ]

        for tool_name, arguments, key in cases:
            response = await client.call_tool(tool_name, arguments)
            assert not response.is_error, f"{tool_name} returned MCP error: {response.content}"
            structured = response.structured_content
            if structured is not None:
                body = structured.get("result", structured) if isinstance(structured, dict) else structured
            else:
                assert response.content, f"No content: {tool_name}"
                body = json.loads(response.content[0].text)
            assert isinstance(body, dict) and key in body, f"Missing {key}: {tool_name}: {body}"
            print(f"PASS MCP tools/call: {tool_name}")

        # A semantic failure must never be misrepresented as a successful score.
        invalid = await client.call_tool("score_hooks", {"hooks": []})
        assert invalid.is_error, "Expected invalid hooks to return an MCP tool error"
        print("PASS MCP validation: empty hooks rejected")

    print("MCP v2 INTEGRATION TESTS PASSED")


if __name__ == "__main__":
    asyncio.run(main())
