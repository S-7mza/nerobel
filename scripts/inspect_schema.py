import urllib.request
import json

req = urllib.request.Request('http://localhost:8099/api/public/sav-requests?serviceId=6', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))

print("Service:", data.get("serviceName"), "Default ID:", data.get("defaultTicketTypeId"))
for t in data.get("ticketTypes", []):
    print(f"\n=== TicketType {t['id']}: {t['name']} ===")
    for f in t.get("fields", []):
        print(f"  Field {f['id']}: {f['name']} | Type: {f['fieldType']} | Step: {f.get('stepName')} | Req: {f.get('required')} | Map: {f.get('mappingTarget')}")
        if f.get('options'):
            print(f"      Options: {f['options']}")
        if f.get('validators'):
            print(f"      Validators: {f['validators']}")
        if f.get('helpMediaUrl'):
            print(f"      HelpMedia: {f['helpMediaUrl']}")
