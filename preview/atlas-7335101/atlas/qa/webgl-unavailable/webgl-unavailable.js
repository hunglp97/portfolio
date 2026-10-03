/* Controlled QA fixture only; production Atlas remains unchanged. */
(() => {
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(type, ...args) {
    if (['webgl','webgl2','experimental-webgl'].includes(String(type))) return null;
    return original.call(this,type,...args);
  };
})();
