function SmoothScroll({ target, speed, smooth }) {
  if (target === document) {
    target = document.scrollingElement || document.documentElement || document.body.parentNode || document.body;
  }

  let moving = false;
  let pos = target.scrollTop;
  const frame = target === document.body && document.documentElement ? document.documentElement : target;

  // Adding event listeners for scrolling
  target.addEventListener('wheel', scrolled, { passive: false });
  target.addEventListener('mousewheel', scrolled, { passive: false });
  target.addEventListener('DOMMouseScroll', scrolled, { passive: false });

  function scrolled(e) {
    e.preventDefault(); // Disable default scrolling
    const delta = normalizeWheelDelta(e);
    pos += -delta * speed;
    pos = Math.max(0, Math.min(pos, target.scrollHeight - frame.clientHeight)); // Limit scrolling

    if (!moving) update();
  }

  function normalizeWheelDelta(e) {
    if (e.detail) {
      return e.wheelDelta ? e.wheelDelta / e.detail / 40 * (e.detail > 0 ? 1 : -1) : -e.detail / 3; // Firefox
    } else {
      return e.wheelDelta / 120; // IE,Safari,Chrome
    }
  }

  function update() {
    moving = true;
    const delta = (pos - target.scrollTop) / smooth;
    target.scrollTop += delta;

    if (Math.abs(delta) > 0.5) {
      requestFrame(update);
    } else {
      moving = false;
    }
  }

  const requestFrame = (function() {
    return window.requestAnimationFrame || 
           window.webkitRequestAnimationFrame || 
           window.mozRequestAnimationFrame || 
           window.oRequestAnimationFrame || 
           window.msRequestAnimationFrame || 
           function(func) { window.setTimeout(func, 1000 / 50); };
  })();
}
