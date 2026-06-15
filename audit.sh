#!/bin/bash
# Pre-build audit for Card Game Encyclopedia
# Run this BEFORE every eas build to catch data bugs early.

echo ""
echo "🔍 CARD GAME ENCYCLOPEDIA — PRE-BUILD AUDIT"
echo "============================================"
echo ""

echo "1️⃣  PASTE BUGS (property names pasted inside strings)"
echo "    These should all be EMPTY:"
echo "    --- description: ---"
grep -nE "['\"]description: ['\"]" constants/games.ts
echo "    --- objective: ---"
grep -n "'objective:" constants/games.ts
echo "    --- deck: ---"
grep -n "'deck:" constants/games.ts
echo "    (nothing above this line = good)"
echo ""

echo "2️⃣  GAME COUNT"
COUNT=$(grep -cE "id: ['\"]" constants/games.ts)
echo "    Found: $COUNT games"
echo ""

echo "3️⃣  LONG TIPS / TEXT (over 90 chars — check these wrap OK)"
grep -oE '"[^"]{91,}"' constants/games.ts | head -20
echo "    (long lines aren't always bugs — just worth eyeballing)"
echo ""

echo "4️⃣  DUPLICATE GAME NAMES (should be empty)"
grep -oE "name: ['\"][^'\"]+['\"]" constants/games.ts | sort | uniq -d
echo "    (nothing above = no duplicate names)"
echo ""

echo "============================================"
echo "✅ AUDIT COMPLETE"
echo ""