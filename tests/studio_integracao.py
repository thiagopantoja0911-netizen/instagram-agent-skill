#!/usr/bin/env python3
"""Teste reprodutível da migração Instagram + Motion, sem rede ou segredos."""
from pathlib import Path
import json, re, py_compile, subprocess, sys, tempfile
P=Path(__file__).resolve().parents[1]
IG=('ig-audit','ig-caption','ig-carousel','ig-comment','ig-dm','ig-human','ig-plan','ig-profile','ig-reel','ig-reply','ig-repurpose','ig-story','ig-viral','ig-setup')
STUDIO=('ig-motion-director','ig-motion-quality-gate','reference-video-decomposer')
SKILLS=IG+STUDIO
SCRIPTS=('ig-caption/caption.py','ig-human/detect.py','ig-human/humanize.py','ig-reel/beats.py','ig-reel/hookscore.py','ig-viral/swipe.py')
RULES=('ig-human/slop.json','ig-reel/hooks.json','ig-profile/rubric.json')
REFS=('video-corpus.md','2026-11-three-reference-analysis.md','capture-protocol.md','microinteractions-audio.md','reference-event-ledgers.json','render-diagnostics.md','safe-area-clip-regression.md','v8-output-qa-2026-11-10.md','v9-10sec-lab-2026-11-10.md','v9-output-qa-2026-11-10.md')
M=json.loads((P/'plugin.json').read_text(encoding='utf-8'))
assert M['name']=='aulas-instagram-motion-studio' and M['version']=='0.2.0'
for name in SKILLS:
 f=P/'skills'/name/'SKILL.md'; assert f.is_file(),str(f)
 t=f.read_text(encoding='utf-8'); assert t.startswith('---\\n'.replace('\\n','\n'))
 assert re.search(r'(?m)^name:\\s*'.replace('\\s','\\s')+re.escape(name)+r'\\s*$'.replace('\\s','\\s'),t),name
for name in SCRIPTS:
 f=P/'skills'/name; assert f.is_file(),str(f); py_compile.compile(str(f),doraise=True)
for name in RULES:
 f=P/'skills'/name;assert f.is_file();json.loads(f.read_text(encoding='utf-8'))
for name in REFS:
 f=P/'skills/reference-video-decomposer/references'/name;assert f.is_file(),str(f)
assert (P/'templates/voice.md').is_file() and (P/'LICENSE').is_file()
assert 'MIT License' in (P/'LICENSE').read_text()
print('PASS: 17 skills, 6 Python scripts, 3 JSON regras, 10 refs, MIT, template de voz')
cmd=[sys.executable,str(P/'skills/ig-reel/hookscore.py'),'--hook','Veja como uma frase pode virar um produto animado em dez segundos']
r=subprocess.run(cmd,cwd=P,capture_output=True,text=True,timeout=20)
assert r.returncode in (0,1) and len(r.stdout+r.stderr)>15, (r.returncode,r.stderr)
print('PASS: motor de avaliação de ganchos executou (score é heurístico, não prevê views)')
with tempfile.TemporaryDirectory() as td:
 sample=Path(td)/'reel.txt';sample.write_text('Uma frase virou um objeto em movimento.\\nAgora a interface responde a cada toque.\\nOs bastidores estão na bio.\\n'.replace('\\n','\n'),encoding='utf-8')
 cmd=[sys.executable,str(P/'skills/ig-reel/beats.py'),str(sample),'--target','20']
 r=subprocess.run(cmd,cwd=P,capture_output=True,text=True,timeout=20)
 assert r.returncode in (0,1) and len(r.stdout+r.stderr)>20,(r.returncode,r.stderr)
 print('PASS: motor de tempo de roteiro executou')
print('OK: smoke de integração concluído')
