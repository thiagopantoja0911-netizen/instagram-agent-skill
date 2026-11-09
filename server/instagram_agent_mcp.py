#!/usr/bin/env python3
"""Six MCP tools backed by the original unmodified Instagram Python scripts.

No storage, posting, Instagram login, or background scraping. Local development only:
secure the service before exposing it through an authenticated HTTPS endpoint.
"""
from __future__ import annotations
import json
import os
from pathlib import Path
import subprocess
import sys
from mcp.server.mcpserver import MCPServer

ROOT = Path(__file__).resolve().parent.parent
mcp = MCPServer("Instagram Agent")
MAX_CHARS = 200_000


def _script(path: str, content: str, opts: list[str] | None = None) -> dict | list:
    if not isinstance(content, str) or not content.strip():
        raise ValueError("Entrada vazia.")
    if len(content) > MAX_CHARS:
        raise ValueError("Entrada ultrapassa 200.000 caracteres.")
    command = [sys.executable, str(ROOT / path), "-", "--json", *(opts or [])]
    proc = subprocess.run(command, input=content, capture_output=True, text=True,
                          timeout=20, cwd=str(ROOT), encoding="utf-8", check=False)
    # The original linters exit 1 when they flag a draft, but still emit valid JSON.
    if proc.returncode not in (0, 1):
        raise ValueError(f"Script {path} retornou {proc.returncode}: {proc.stderr[:500]}")
    try:
        return json.loads(proc.stdout)
    except json.JSONDecodeError as error:
        raise RuntimeError(f"Saída JSON inválida de {path}") from error


@mcp.tool()
def score_hooks(hooks: list[str]) -> dict | list:
    """Score 1-40 Reel hooks using the original five-check hookscore.py."""
    if not 1 <= len(hooks) <= 40:
        raise ValueError("Forneça entre 1 e 40 ganchos.")
    return _script("skills/ig-reel/hookscore.py", "\n".join(h.replace("\n", " ") for h in hooks))


@mcp.tool()
def build_beats(script: str, target_seconds: float = 30, wpm: float = 165) -> dict:
    """Calculate a time-coded Reel beat sheet using original beats.py."""
    if target_seconds <= 0 or wpm <= 0:
        raise ValueError("Duração e palavras/minuto devem ser positivas.")
    return _script("skills/ig-reel/beats.py", script,
                   ["--target", str(target_seconds), "--wpm", str(wpm)])


@mcp.tool()
def lint_caption(caption: str, keywords: list[str] | None = None) -> dict:
    """Lint an Instagram caption, including preview, length, CTA and keywords."""
    terms = [t.replace(",", " ").replace("\n", " ") for t in (keywords or [])]
    return _script("skills/ig-caption/caption.py", caption, ["--keywords", ",".join(terms)])


@mcp.tool()
def humanize_text(text: str) -> dict:
    """Apply the unchanged humanize.py lexicon and typography cleanup."""
    return _script("skills/ig-human/humanize.py", text)


@mcp.tool()
def detect_human_score(text: str) -> dict:
    """Run original local heuristics; not an external AI detector."""
    return _script("skills/ig-human/detect.py", text)


@mcp.tool()
def analyze_swipe_file(tsv: str) -> dict:
    """Classify user-supplied TSV reels; does not scrape Instagram."""
    return _script("skills/ig-viral/swipe.py", tsv)


if __name__ == "__main__":
    transport = os.environ.get("INSTAGRAM_AGENT_TRANSPORT", "stdio")
    if transport == "stdio":
        mcp.run()
    elif transport == "streamable-http":
        # Loopback only: no remote exposure before HTTPS and user authentication.
        mcp.run(transport="streamable-http", host="127.0.0.1",
                port=int(os.environ.get("PORT", "8000")),
                json_response=True, stateless_http=True)
    else:
        raise SystemExit("Set INSTAGRAM_AGENT_TRANSPORT to stdio or streamable-http.")
