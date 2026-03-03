import re

path = r"C:\Users\kamil\.gemini\antigravity\scratch\educational-sales-site\lib\translations.ts"
with open(path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if re.search(r'"[a-z]{2}": {', line):
            print(f"{i}: {line.strip()}")
