(function () {
  var root = document.documentElement;
  var ticking = false;

  function update() {
    var max = Math.max(1, document.body.scrollHeight - window.innerHeight);
    var progress = Math.min(1, Math.max(0, window.scrollY / max));
    root.style.setProperty('--scroll', progress.toFixed(4));
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
