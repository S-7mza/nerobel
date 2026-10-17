import json
with open('C:/Users/7mza/.gemini/antigravity-ide/brain/e183438f-fd04-41d9-89de-50230a48c4ec/.system_generated/logs/transcript.jsonl', 'r', encoding='utf-8') as tf:
    for line in tf:
        data = json.loads(line)
        idx = data.get('step_index', 0)
        if idx == 161:
            for tc in data.get('tool_calls', []):
                print(tc.get('args', {}).get('CommandLine'))
