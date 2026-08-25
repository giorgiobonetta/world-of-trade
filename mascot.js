/* Hélène Marchand — head trader.
   Compare nel feedback, alla fine della lezione e sul percorso.
   Tre espressioni: teach (spiega), happy (giusto), oops (sbagliato).
*/
window.MASCOT = (function () {
  const FACES = {
    teach: {
      brows: '<path d="M30 39 q7 -3 14 0" /><path d="M56 39 q7 -3 14 0" />',
      mouth: '<path d="M42 60 q8 4 16 0" fill="none" stroke-width="3.4" />',
      eyes: 2.9,
    },
    happy: {
      brows: '<path d="M30 37 q7 -4 14 -1" /><path d="M56 36 q7 -3 14 1" />',
      mouth: '<path d="M39 57 q11 11 22 0 q-11 5 -22 0 z" fill="#8e3a4a" stroke="none" />',
      eyes: 2.6, squint: true,
    },
    oops: {
      brows: '<path d="M30 40 q7 -2 14 -5" /><path d="M56 35 q7 3 14 5" />',
      mouth: '<path d="M41 61 q9 -3 18 1" fill="none" stroke-width="3.2" />',
      eyes: 3.1,
    },
  };

  function svg(mood = 'teach', size = 96) {
    const f = FACES[mood] || FACES.teach;
    const eyeShape = f.squint
      ? '<path d="M33 45 q4 -4 8 0" fill="none" stroke="#2a1f1a" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M59 45 q4 -4 8 0" fill="none" stroke="#2a1f1a" stroke-width="3" stroke-linecap="round"/>'
      : `<circle cx="37" cy="46" r="${f.eyes}" fill="#2a1f1a"/><circle cx="63" cy="46" r="${f.eyes}" fill="#2a1f1a"/>` +
        `<circle cx="38.1" cy="45" r="1" fill="#fff" opacity=".85"/><circle cx="64.1" cy="45" r="1" fill="#fff" opacity=".85"/>`;
    return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="Hélène, your trading mentor">
  <defs>
    <linearGradient id="mDisc" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3f7ae0"/><stop offset="100%" stop-color="#12356f"/>
    </linearGradient>
    <linearGradient id="mCoat" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e4a94"/><stop offset="100%" stop-color="#0e2a5c"/>
    </linearGradient>
    <linearGradient id="mHair" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#5b3a24"/><stop offset="100%" stop-color="#33200f"/>
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#mDisc)" stroke="#ffd45c" stroke-width="3.5"/>
  <path d="M14 100 q0 -22 21 -29 h30 q21 7 21 29 z" fill="url(#mCoat)"/>
  <path d="M50 71 l-11 6 6 23 h10 l6 -23 z" fill="#f4f7ff"/>
  <path d="M50 72 l-6 8 6 7 6 -7 z" fill="#ffd45c"/>
  <path d="M26 46 q-3 -30 24 -32 q27 2 24 32 q-3 -14 -7 -18 q-8 6 -21 5 q-9 -1 -13 -5 q-5 5 -7 18 z" fill="url(#mHair)"/>
  <ellipse cx="50" cy="48" rx="20.5" ry="23" fill="#f0cfae"/>
  <path d="M27 40 q0 -26 23 -26 q23 0 23 26 q-5 -13 -12 -15 q-9 7 -22 4 q-6 -1 -9 -3 q-3 4 -3 14 z" fill="url(#mHair)"/>
  <path d="M28 30 q10 -12 24 -9 q-13 3 -19 12 z" fill="#6b4830" opacity=".55"/>
  <g stroke="#42301f" stroke-width="3" stroke-linecap="round" fill="none">${f.brows}</g>
  ${eyeShape}
  <g stroke="#8e3a4a" stroke-linecap="round">${f.mouth}</g>
  <circle cx="30" cy="56" r="4" fill="#e8a08c" opacity=".35"/>
  <circle cx="70" cy="56" r="4" fill="#e8a08c" opacity=".35"/>
</svg>`;
  }

  const PRAISE = ['Exactly.', 'That’s it.', 'Correct.', 'Good.', 'Right on.'];
  const MISS   = ['Not quite.', 'Close, but no.', 'Not this time.', 'Almost.'];
  let pi = 0, mi = 0;
  const praise = () => PRAISE[pi++ % PRAISE.length];
  const miss   = () => MISS[mi++ % MISS.length];

  return { svg, praise, miss, name: 'Hélène' };
})();
