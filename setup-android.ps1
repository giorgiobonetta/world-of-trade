$ErrorActionPreference = "Stop"
npm install
if (-not (Test-Path "android")) { npx cap add android }
npx cap sync android
Write-Host "Android project ready. Opening Android Studio..."
npx cap open android
