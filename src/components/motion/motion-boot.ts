/**
 * Runs before first paint: enables motion styles only when motion is allowed (and JS runs).
 * Lives outside the 'use client' controller on purpose: a value exported from a client module reaches the server
 * layout as a client reference, so <head> would wait on the controller's JS chunk during hydration. If that chunk
 * arrived mid-hydration, React re-entered <head> and resumed <body> at the wrong node (#418), dropping motion-ok.
 */
export const motionBootScript = `(function(){try{var d=document.documentElement;d.classList.add('js');if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('motion-ok');}catch(e){}})();`;
