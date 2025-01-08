function smoothScroll(target, options) {

    if (target === document)
      target = (document.scrollingElement || document.documentElement || document.body.parentNode || document.body);

    let moving = false;
    let pos = target.scrollTop;
    const frame = target === document.body && document.documentElement ? document.documentElement : target;

    // Attach event listeners
    target.addEventListener('wheel', scrolled, { passive: false });

    function scrolled(e) {
      e.preventDefault();
      const delta = normalizeWheelDelta(e);
      pos += -delta * speed;
      pos = Math.max(0, Math.min(pos, target.scrollHeight - frame.clientHeight));
      if (!moving) update();
    }

    function normalizeWheelDelta(e) {
      return e.deltaY ? e.deltaY / 120 : e.wheelDelta / 120;
    }

    function update() {
      moving = true;
      const delta = (pos - target.scrollTop) / smooth;
      target.scrollTop += delta;

      if (Math.abs(delta) > 0.5)
        requestAnimationFrame(update);
      else
        moving = false;
    }
  }