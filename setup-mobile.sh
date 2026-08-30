#!/usr/bin/env bash
set -euo pipefail
npm install
if [ ! -d android ]; then npx cap add android; fi
npx cap sync android
if [[ "$(uname -s)" == "Darwin" ]]; then
  if [ ! -d ios ]; then npx cap add ios; fi
  npx cap sync ios
fi
echo "World of Trade mobile projects are ready."
