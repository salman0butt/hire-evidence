#!/usr/bin/env python3
from pathlib import Path
import re, sys

ROOT=Path(__file__).resolve().parents[1]
prd=ROOT/'docs/product/PRD.md'
catdir=ROOT/'docs/product/categories'

pat=re.compile(r'^#\s+(\d+)\.\s+', re.M)
master_nums=[int(x) for x in pat.findall(prd.read_text(encoding='utf-8'))]
expected=list(range(1,243))

errors=[]
if master_nums != expected:
    missing=[n for n in expected if n not in master_nums]
    dup=sorted({n for n in master_nums if master_nums.count(n)>1})
    errors.append(f'master PRD mismatch: count={len(master_nums)} missing={missing} duplicates={dup}')

cat_nums=[]
for p in sorted(catdir.glob('*.md')):
    cat_nums += [int(x) for x in pat.findall(p.read_text(encoding='utf-8'))]
missing=[n for n in expected if n not in cat_nums]
dup=sorted({n for n in cat_nums if cat_nums.count(n)>1})
extra=sorted({n for n in cat_nums if n not in expected})
if sorted(cat_nums) != expected or dup or extra:
    errors.append(f'categorized corpus mismatch: count={len(cat_nums)} missing={missing} duplicates={dup} extra={extra}')

# Verify milestone section definitions M00-M15 exist in master via sections 195-210.
for m,section in enumerate(range(195,211)):
    if section not in master_nums:
        errors.append(f'missing milestone section {section} for M{m:02d}')

if errors:
    print('FAIL')
    for e in errors: print('-',e)
    sys.exit(1)
print('PASS: master PRD contains sections 1-242 exactly once')
print('PASS: categorized corpus contains sections 1-242 exactly once')
print('PASS: milestone definition sections 195-210 (M00-M15) are present')
