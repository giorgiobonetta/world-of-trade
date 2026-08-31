# Portrait-first mobile

World of Trade mobile is designed for portrait play only.

## Phone behaviour
- Header row 1: brand + four reward counters.
- Header row 2: Path / Play / Practice / League / Profile, always visible.
- No horizontal navigation scrolling.
- Trading House map becomes a vertical one-column list.
- Safe areas are respected on iPhone and Android devices.
- On a phone held landscape, a rotate-to-portrait guard covers gameplay.

## Installed app / PWA
`manifest.webmanifest` already declares `orientation: portrait`. `native-runtime.js` additionally requests a portrait lock where the platform allows it.

## Desktop
Desktop behaviour and layout are unchanged.
