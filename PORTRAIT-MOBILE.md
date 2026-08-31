# Portrait-first mobile

World of Trade mobile is designed primarily for portrait play.

## Phone behaviour
- Header row 1: brand + four reward counters, including the lifebuoy count.
- Header row 2: Path / Play / Practice / League / Profile, always visible.
- No horizontal navigation scrolling.
- Trading House map becomes a vertical one-column list.
- Safe areas are respected on iPhone and Android devices.
- There is no rotate-device overlay or blocking orientation message.

## Installed app / PWA
`manifest.webmanifest` declares `orientation: portrait`. `native-runtime.js` may request portrait orientation where the installed platform supports it, without showing a blocking overlay.

## Career progression
- Only the current desk and previously completed desks are visible.
- Future desks are not rendered.
- Inside a desk, only the single next subsection can be started.
- The following desk becomes visible only after every question in every subsection of the current desk has been completed.

## Desktop
Desktop behaviour and layout remain available.
