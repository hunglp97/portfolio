#!/usr/bin/env python3
"""
CLI Tool cập nhật mã CDKey Delta Force trên server Ubuntu (hlpdata.com)
Tự động thêm mã mới vào api/df-codes.json, commit và push lên GitHub Pages.
"""

import sys
import json
import os
import subprocess
from datetime import datetime

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
JSON_PATH = os.path.join(REPO_ROOT, "api", "df-codes.json")

def main():
    if len(sys.argv) < 2:
        print("Cách sử dụng:")
        print("  python3 scripts/add_codes.py CODE1 CODE2 CODE3 ...")
        print("  python3 scripts/add_codes.py --file <duong_dan_file_text>")
        sys.exit(1)

    if not os.path.exists(JSON_PATH):
        print(f"Lỗi: Không tìm thấy file {JSON_PATH}")
        sys.exit(1)

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    existing_codes = data.get("codes", [])
    existing_set = set(c.upper() for c in existing_codes)

    new_candidates = []
    if sys.argv[1] == "--file":
        if len(sys.argv) < 3:
            print("Lỗi: Thiếu đường dẫn file!")
            sys.exit(1)
        with open(sys.argv[2], "r", encoding="utf-8") as f:
            for line in f:
                c = line.strip()
                if c:
                    new_candidates.append(c)
    else:
        new_candidates = sys.argv[1:]

    added = []
    for c in new_candidates:
        clean = c.strip()
        if clean and clean.upper() not in existing_set:
            existing_codes.append(clean)
            existing_set.add(clean.upper())
            added.append(clean)

    if not added:
        print("ℹ️ Không có mã nào mới (tất cả các mã đã tồn tại).")
        print(f"Tổng số mã hiện tại: {len(existing_codes)}")
        return

    data["codes"] = existing_codes
    data["count"] = len(existing_codes)
    data["last_updated"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✅ Đã thêm {len(added)} mã mới vào {JSON_PATH}!")
    print(f"Tổng số mã hiện tại: {len(existing_codes)}")
    print("Mã vừa thêm:", ", ".join(added))

    # Tự động Git Commit & Push nếu được cấu hình
    try:
        print("\n🚀 Đang tự động commit và push lên hlpdata.com...")
        subprocess.run(["git", "add", "api/df-codes.json"], cwd=REPO_ROOT, check=True)
        commit_msg = f"Update Delta Force codes: +{len(added)} codes (Total: {len(existing_codes)})"
        subprocess.run(["git", "commit", "-m", commit_msg], cwd=REPO_ROOT, check=True)
        subprocess.run(["git", "push", "origin", "main"], cwd=REPO_ROOT, check=True)
        print("🎉 ĐÃ PUSH THÀNH CÔNG LÊN HLPDATA.COM! Tất cả Client sẽ tự động nhận được mã mới!")
    except Exception as e:
        print("⚠️ Chú ý: Lỗi tự động git push:", e)

if __name__ == "__main__":
    main()
