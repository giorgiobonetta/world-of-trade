# World of Trade — Installable App Preview

This build is designed to be installed directly from the deployed Vercel site and used like a mobile app before Play Store / App Store packaging.

## Android
1. Deploy this folder to Vercel.
2. Open the deployed `/learn.html` page in Chrome on your phone.
3. Tap **Install World of Trade** when the button appears (or Chrome menu → Install app).
4. Open the new World of Trade icon from the home screen.

The installed app opens in portrait, standalone mode without the normal browser UI.

## iPhone
1. Open the deployed `/learn.html` page in Safari.
2. Tap **Install World of Trade** to see the guide, or use Safari Share directly.
3. Share → **Add to Home Screen** → Add.
4. Launch World of Trade from the home-screen icon.

## Important
The previous build loaded `native-runtime.js` on the web and incorrectly marked the browser as native, preventing the PWA service worker/install flow. This build fixes that: the native marker activates only inside a real Capacitor app.

## Later store build
This PWA preview is for gameplay testing. A Play Store `.aab/.apk` still requires an Android SDK build, while the App Store build requires Xcode/macOS.
