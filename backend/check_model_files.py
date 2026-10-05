import os

MODEL_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "models"
)

files = [
    "xgb_nitrogen_gap.pkl",
    "xgb_phosphorus_gap.pkl",
    "xgb_potassium_gap_tuned.pkl",
]

print("=" * 70)
print("MODEL FILE CHECK")
print("=" * 70)

for filename in files:

    path = os.path.join(MODEL_DIR, filename)

    print("\n" + "-" * 70)
    print(filename)

    if not os.path.exists(path):
        print("❌ FILE NOT FOUND")
        continue

    size = os.path.getsize(path)

    print("Size:", size, "bytes")
    print("Size:", round(size / 1024, 2), "KB")

    with open(path, "rb") as f:
        first_bytes = f.read(100)

    print("First bytes:")
    print(first_bytes)

    if first_bytes.startswith(b"PK"):
        print("Looks like a ZIP-based file")

    elif first_bytes.startswith(b"\x80"):
        print("Looks like a Python pickle")

    elif b"<html" in first_bytes.lower() or b"<!doctype" in first_bytes.lower():
        print("❌ THIS IS AN HTML FILE, NOT A MODEL")

    else:
        print("⚠️ Unknown file format")

print("\n" + "=" * 70)