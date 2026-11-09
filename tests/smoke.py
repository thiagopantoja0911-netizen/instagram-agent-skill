#!/usr/bin/env python3
"""Smoke tests for all 6 original executable scripts (no external dependencies)."""
import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent

def run(path, text, *args):
    p = subprocess.run([sys.executable, str(ROOT/path), "-", "--json", *args],
                       input=text, capture_output=True, text=True, timeout=20, cwd=ROOT)
    if p.returncode not in (0, 1):
        raise AssertionError(f"{path}: return {p.returncode}: {p.stderr}")
    result = json.loads(p.stdout)
    print("PASS", path)
    return result

if __name__ == "__main__":
    a=run("skills/ig-reel/hookscore.py", "I lost $18,000 because of one missing contract.\n")
    assert "score" in a
    b=run("skills/ig-reel/beats.py", "I lost $18,000 because of one missing contract.\nCheck the clause before you sign.\n", "--target","30")
    assert "total_seconds" in b
    c=run("skills/ig-caption/caption.py", "This contract clause cost $18,000.\nRead it before you sign. #contracts")
    assert "verdict" in c
    d=run("skills/ig-human/humanize.py", "In today's fast-paced world—check this clause.")
    assert "text" in d and "report" in d
    e=run("skills/ig-human/detect.py", "I lost $18,000 because of one missing contract.")
    assert "human_score" in e
    tsv="account\tfollowers\tmedian\tviews\thook\n@a\t12000\t1000\t12000\tnobody tells you what matters\n@b\t9000\t2000\t5000\tmy client lost three invoices\n"
    f=run("skills/ig-viral/swipe.py",tsv)
    assert "reels" in f
    print("ALL SIX SCRIPTS PASS")
