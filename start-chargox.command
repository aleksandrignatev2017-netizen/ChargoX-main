#!/bin/bash
cd "$(dirname "$0")"
command -v node >/dev/null || { open https://nodejs.org; echo "Install Node.js first, then run this again."; exit 1; }
[ -d node_modules ] || npm install
(sleep 4; open http://localhost:3000) &
npm run dev
