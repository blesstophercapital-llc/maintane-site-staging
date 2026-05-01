/* Maintane funnel page helpers */
(function () {
  'use strict';

  function initMobileMenu() {
    var toggle = document.querySelector('[data-funnel-menu-toggle]');
    var menu = document.querySelector('[data-funnel-mobile-menu]');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    menu.addEventListener('click', function (e) {
      var link = e.target && e.target.closest && e.target.closest('a');
      if (!link) return;
      menu.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }
})();
