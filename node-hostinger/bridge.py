"""Runs the unchanged Instagram Python algorithms under Pyodide within Node.

Avoid shell execution, dynamic imports from callers and user-controlled file paths.
"""
import io
import json
import sys

import hookscore
import beats
import caption
import humanize
import detect
import swipe

LEXICON = humanize.load_lexicon()
FORMULAS = swipe.load_formulas(swipe.HOOKS)


def invoke(name, params):
    if name == "score_hooks":
        hooks = params.get("hooks")
        if not isinstance(hooks, list) or not 1 <= len(hooks) <= 40:
            raise ValueError("Forneça de 1 a 40 ganchos.")
        records = []
        for hook in hooks:
            if not isinstance(hook, str) or not hook.strip():
                raise ValueError("Um gancho está vazio ou não é texto.")
            results, overall, verdict, flags = hookscore.run(hook.replace("\n", " "))
            records.append({
                "hook": hook.replace("\n", " "),
                "checks": {key: {"score": round(v[0], 1), "detail": v[1]} for key, v in results.items()},
                "weakest": min(hookscore.CHECKS, key=lambda key: results[key][0]),
                "flags": flags,
                "score": round(overall, 1),
                "verdict": verdict,
            })
        return records[0] if len(records) == 1 else records

    if name == "build_beats":
        raw = params["script"]
        target = params.get("target_seconds", 30)
        wpm = params.get("wpm", 165)
        if not isinstance(raw, str) or not raw.strip() or not isinstance(wpm, (int, float)) or not isinstance(target, (int, float)) or wpm <= 0 or target <= 0:
            raise ValueError("Roteiro e durações válidas são obrigatórios.")
        return beats.analyse(raw, wpm=wpm, target=target)

    if name == "lint_caption":
        raw = params["caption"]
        keywords = params.get("keywords") or []
        if not isinstance(raw, str) or not all(isinstance(v, str) for v in keywords):
            raise ValueError("Legenda ou palavras-chave inválidas.")
        return caption.analyse(raw, keywords=[v.replace(",", " ").replace("\n", " ") for v in keywords])

    if name == "humanize_text":
        raw = params["text"]
        if not isinstance(raw, str):
            raise ValueError("Texto inválido.")
        text, report = humanize.humanize(raw, LEXICON)
        return {"text": text, "report": report}

    if name == "detect_human_score":
        raw = params["text"]
        if not isinstance(raw, str):
            raise ValueError("Texto inválido.")
        results, overall, verdict = detect.run(raw, LEXICON)
        return {
            "source": "-",
            "checks": {key: {"score": round(v[0], 1), "detail": v[1]} for key, v in results.items()},
            "human_score": round(overall, 1),
            "verdict": verdict,
        }

    if name == "analyze_swipe_file":
        raw = params["tsv"]
        if not isinstance(raw, str):
            raise ValueError("TSV inválido.")
        old_stdin = sys.stdin
        try:
            sys.stdin = io.StringIO(raw)
            rows = swipe.read_rows("-")
        finally:
            sys.stdin = old_stdin
        if not rows:
            raise ValueError("Nenhuma linha válida no TSV: informe visualizações e gancho.")
        return swipe.analyse(rows, FORMULAS)

    raise ValueError("Ferramenta MCP desconhecida.")


def invoke_json(name, input_json):
    params = json.loads(input_json)
    return json.dumps(invoke(name, params), ensure_ascii=False, allow_nan=False)
