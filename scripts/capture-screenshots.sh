#!/usr/bin/env bash
# Capture the docs/screenshots/ family on the running dev server (port 5173).
# Usage: bash scripts/capture-screenshots.sh
# Shots 1-10 are the standing family; 11-13 pin the session-3 flyout
# remediation (the new Entertainment flyout, the iPhone three-section content,
# and the mobile accordion expansion). Shots 14-17 pin the session-4 parity
# work (the Home flyout restructure, the Mac family rows, the mobile Home
# expansion, the store chip row + full-form category h1).
# NOTE: agent-browser keeps the session viewport across `open` calls — the
# `--viewport` flag on open does not reset it — so every capture explicitly
# `set viewport` after navigation.
set -euo pipefail
DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$DIR/docs/screenshots"
mkdir -p "$OUT"
BASE="http://localhost:5173"

capture_desktop() { # name, route
  agent-browser open "$BASE$2" >/dev/null 2>&1
  agent-browser set viewport 1440 900 >/dev/null 2>&1
  sleep 2
  agent-browser screenshot "$OUT/$1.png" >/dev/null 2>&1
  echo "captured $1"
}

capture_mobile() { # name, route
  agent-browser open "$BASE$2" >/dev/null 2>&1
  agent-browser set viewport 390 844 >/dev/null 2>&1
  sleep 2
  agent-browser screenshot "$OUT/$1.png" >/dev/null 2>&1
  echo "captured $1"
}

capture_desktop 01-desktop-home ""
capture_desktop 02-desktop-store "#/store"
capture_desktop 03-desktop-product "#/product/iphone-18-pro"
capture_desktop 04-desktop-bag "#/bag"
capture_desktop 05-desktop-checkout "#/checkout"
capture_desktop 06-desktop-entertainment "#/entertainment"

# 11 — the session-3 Entertainment flyout (hover, then shoot)
agent-browser open "$BASE" >/dev/null 2>&1
agent-browser set viewport 1440 900 >/dev/null 2>&1
sleep 2
agent-browser hover 'nav a[href*="entertainment"]' >/dev/null 2>&1
sleep 1
agent-browser screenshot "$OUT/11-desktop-flyout-entertainment.png" >/dev/null 2>&1
echo "captured 11-desktop-flyout-entertainment"

# 12 — iPhone flyout (the reference-exact three-section content)
agent-browser open "$BASE" >/dev/null 2>&1
agent-browser set viewport 1440 900 >/dev/null 2>&1
sleep 2
agent-browser hover 'nav a[href*="store/iphone"]' >/dev/null 2>&1
sleep 1
agent-browser screenshot "$OUT/12-desktop-flyout-iphone.png" >/dev/null 2>&1
echo "captured 12-desktop-flyout-iphone"

capture_mobile 07-mobile-home ""
capture_mobile 09-mobile-store "#/store"
capture_mobile 10-mobile-product "#/product/iphone-18-pro"

# 08 — mobile menu open (the accordion)
agent-browser open "$BASE" >/dev/null 2>&1
agent-browser set viewport 390 844 >/dev/null 2>&1
sleep 2
agent-browser eval "document.querySelector('nav button[aria-label=\"Menu\"]').click(); 'opened'" >/dev/null 2>&1
sleep 1
agent-browser screenshot "$OUT/08-mobile-menu-open.png" >/dev/null 2>&1
echo "captured 08-mobile-menu-open"

# 13 — mobile accordion with Entertainment expanded (session-3)
agent-browser eval "document.querySelector('#mobile-menu button[aria-label=\"Entertainment menu\"]').click(); 'expanded'" >/dev/null 2>&1
sleep 1
agent-browser screenshot "$OUT/13-mobile-menu-entertainment.png" >/dev/null 2>&1
echo "captured 13-mobile-menu-entertainment"

# 14 — desktop Home flyout (session-4: the reference's restructured three-section model)
agent-browser open "$BASE" >/dev/null 2>&1
agent-browser set viewport 1440 900 >/dev/null 2>&1
sleep 2
agent-browser hover 'nav a[href*="store/home"]' >/dev/null 2>&1
sleep 1
agent-browser screenshot "$OUT/14-desktop-flyout-home.png" >/dev/null 2>&1
echo "captured 14-desktop-flyout-home"

# 15 — desktop Mac flyout (session-4: the reference's full product-family rows)
agent-browser open "$BASE" >/dev/null 2>&1
agent-browser set viewport 1440 900 >/dev/null 2>&1
sleep 2
agent-browser hover 'nav a[href*="store/mac"]' >/dev/null 2>&1
sleep 1
agent-browser screenshot "$OUT/15-desktop-flyout-mac.png" >/dev/null 2>&1
echo "captured 15-desktop-flyout-mac"

# 16 — mobile accordion with Home expanded (session-4: the new three-section content)
agent-browser open "$BASE" >/dev/null 2>&1
agent-browser set viewport 390 844 >/dev/null 2>&1
sleep 2
agent-browser eval "document.querySelector('nav button[aria-label=\"Menu\"]').click(); 'opened'" >/dev/null 2>&1
sleep 1
agent-browser eval "document.querySelector('#mobile-menu button[aria-label=\"Home menu\"]').click(); 'expanded'" >/dev/null 2>&1
sleep 1
agent-browser screenshot "$OUT/16-mobile-menu-home.png" >/dev/null 2>&1
echo "captured 16-mobile-menu-home"

# 17 — the store category page (session-4: chip row + full-form h1)
capture_desktop 17-desktop-store-watch "#/store/watch"

# validate every file is a non-blank PNG
python3 - "$OUT" << 'PY'
import struct, sys, pathlib
out = pathlib.Path(sys.argv[1])
files = sorted(out.glob("*.png"))
bad = []
for f in files:
    data = f.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        bad.append(f"{f.name}: not a PNG")
        continue
    w, h = struct.unpack(">II", data[16:24])
    if w < 100 or h < 100:
        bad.append(f"{f.name}: too small {w}x{h}")
print(f"{len(files)} PNGs validated" + (f"; BAD: {bad}" if bad else " — all signature+dimension valid"))
sys.exit(1 if bad else 0)
PY
