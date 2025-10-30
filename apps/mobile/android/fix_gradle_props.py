# -*- coding: utf-8 -*-
from pathlib import Path

path = Path('gradle.properties')
lines = path.read_text(encoding='utf-8').splitlines()
new_lines = []
for line in lines:
    if line.strip().startswith('android.enableJetifier='):
        new_lines.append('android.enableJetifier=false')
        new_lines.append('# ���м������ɿⱨ���ɸ�Ϊ true ����')
    else:
        new_lines.append(line)
path.write_text('\n'.join(new_lines) + '\n', encoding='utf-8')
