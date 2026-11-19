import subprocess
import re

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
url = "http://localhost:8000/verify_tests.html"

res = subprocess.run(
    [edge_path, "--headless=new", "--disable-gpu", "--dump-dom", url],
    capture_output=True,
    text=True,
    encoding="utf-8",
    errors="ignore"
)

dom = res.stdout

# Extract tests
rows = re.findall(r'<div class="test-row">\s*<span>(.*?)</span>\s*<span class="(pass|fail)">(PASS|FAIL)</span>\s*</div>', dom)

print("\n================ FINDIT TEST RESULTS ================")
for msg, cls, status in rows:
    icon = "✓" if status == "PASS" else "✗"
    print(f"[{status}] {icon} {msg}")

print("=====================================================")
if 'data-test-status="ALL_PASSED"' in dom:
    print(f"OVERALL STATUS: SUCCESS - ALL {len(rows)} TESTS PASSED PERFECTLY!\n")
else:
    print("OVERALL STATUS: SOME TESTS FAILED!\n")
    if not rows:
        print("Raw DOM output snippet:\n", dom[:1000])
