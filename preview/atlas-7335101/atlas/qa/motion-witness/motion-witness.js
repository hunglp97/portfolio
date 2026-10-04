/* QA-only witness. Delegates unchanged public camera methods; never shipped in production Atlas. */
(() => {
  'use strict';
  const records = [];
  let installed = false;
  const snapshot = () => ({fixtureOnly:true, version:1, installed,
    timeOrigin:performance.timeOrigin, records:records.map(x => ({...x}))});
  Object.defineProperty(window, '__dbpAtlasMotionQA', {get:snapshot, configurable:false});
  document.addEventListener('load', event => {
    if (installed || event.target.tagName !== 'SCRIPT' ||
        event.target.src !== 'https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.js' ||
        !window.maplibregl?.Map?.prototype) return;
    const proto = window.maplibregl.Map.prototype;
    for (const method of ['fitBounds', 'flyTo']) {
      const original = proto[method];
      if (typeof original !== 'function') return;
    }
    for (const method of ['fitBounds', 'flyTo']) {
      const original = proto[method];
      proto[method] = function(...args) {
        if (records.length >= 24) return original.apply(this, args);
        const options = method === 'fitBounds' ? args[1] : args[0];
        const duration = options?.duration;
        const row = {method, requestedDuration:typeof duration === 'number' && Number.isFinite(duration) ? duration : null,
          calledAt:performance.now(), movementStartedAt:null, movementEndedAt:null, elapsedMs:null, error:null};
        records.push(row);
        const start = () => { if (row.movementStartedAt === null) row.movementStartedAt = performance.now(); };
        let timer;
        const cleanup = () => { this.off('movestart', start); this.off('moveend', end); clearTimeout(timer); };
        const end = () => {
          // A new call can cancel an older animation before its own movestart.
          // Unpaired end events cannot establish this call's movement duration.
          if (row.movementStartedAt === null) return;
          row.movementEndedAt = performance.now();
          row.elapsedMs = row.movementEndedAt - row.movementStartedAt;
          cleanup();
        };
        this.on('movestart', start); this.on('moveend', end);
        timer = setTimeout(cleanup, 2000);
        try { return original.apply(this, args); }
        catch (error) { row.error = 'CAMERA_CALL_FAILED'; cleanup(); throw error; }
      };
    }
    installed = true;
  }, true);
})();
