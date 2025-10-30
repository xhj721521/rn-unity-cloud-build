from pathlib import Path

path = Path('build.gradle')
text = path.read_text(encoding='utf-8')
marker_start = '// \u7edf\u4e00\u4ed3\u5e93'
if marker_start not in text:
    marker_start = '// \u7edf\u4e00\u4ed3\u5e93\uff08\u542b\u672c\u5730 maven \u6e90\uff09'
if marker_start not in text:
    raise SystemExit('marker not found')
start_idx = text.index(marker_start)
end_block = '}

// \u26a0\ufe0f'
end_idx = text.index(end_block, start_idx)
new_text = text[:start_idx] + end_block + text[end_idx + len(end_block):]
path.write_text(new_text, encoding='utf-8')
