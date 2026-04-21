/* getmaintane.com — GA4 event tracking
 * Loaded with `defer` at the end of <body> on every HTML file.
 * GA4 measurement ID G-D8DRYD8BHZ is loaded earlier via gtag.js in <head>.
 *
 * 10 events wired (event 10 `faq_expand` deliberately omitted — dosing-guide
 * FAQs are static content, not accordions; revisit when accordion is built).
 *
 * Staging guard: when hostname includes "staging", listeners install but
 * `gtag('event', ...)` is never called — so staging traffic doesn't pollute
 * the production analytics property. Set DEBUG=true to console.log every event
 * (works on staging and prod for verification).
 */
(function () {
  'use strict';

  // ── Configuration ────────────────────────────────────────────────────────
  var DEBUG = false;
  var IS_STAGING = (window.location.hostname || '').toLowerCase().indexOf('staging') !== -1;

  var CHECKOUT_HREF_PATTERN = /(?:aykixg-rn\.myshopify\.com|shopify\.com)\/cart/i;
  var EXTERNAL_DESTINATIONS = [
    { match: /(^|\.)tiktok\.com/i,    name: 'tiktok' },
    { match: /(^|\.)instagram\.com/i, name: 'instagram' },
    { match: /(^|\.)amazon\.[a-z.]+/i, name: 'amazon' }
  ];

  // ── Utilities ────────────────────────────────────────────────────────────
  function pathname() { return window.location.pathname || '/'; }

  // Homepage SPA: which .page panel is currently visible?
  // Returns 'home' | 'how' | 'contact' | 'policy' | null
  function virtualPage() {
    var active = document.querySelector('.page.active');
    if (active && active.id) return active.id.replace(/^page-/, '');
    return null;
  }

  function baseParams(extra) {
    var p = { source_page: pathname() };
    var vp = virtualPage();
    if (vp) p.virtual_page = vp;
    if (extra) for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) p[k] = extra[k];
    return p;
  }

  function fire(name, params) {
    if (DEBUG) console.log('[GA4]', name, params);
    if (IS_STAGING) return;            // staging never sends to GA4
    if (typeof gtag !== 'function') return;
    gtag('event', name, params);
  }

  // Derive a meaningful label for which CTA the user interacted with.
  function buttonLocation(el) {
    if (!el) return 'unknown';
    if (el.classList && el.classList.contains('nav-cta')) return 'nav';
    if (el.classList && el.classList.contains('mobile-cta')) return 'mobile-menu';
    if (el.closest('#hero')) return 'hero';
    if (el.closest('.cta-block')) return 'cta-block';
    if (el.closest('.guide-cta')) return 'guide-cta';
    // Risk-free CTA section uses no id; fall through to heading text.
    var section = el.closest('section, .page, article, div');
    if (section) {
      // Prefer an explicit id (skip placeholder/utility ids)
      var idCarrier = el.closest('section[id], div.page[id], article[id]');
      if (idCarrier && idCarrier.id) return idCarrier.id;
      var heading = section.querySelector('h2, h1, h3');
      if (heading && heading.textContent) {
        return heading.textContent.trim().toLowerCase().substring(0, 60);
      }
    }
    return 'unknown';
  }

  function isHomepage() {
    var p = pathname();
    return p === '/' || p === '/index.html';
  }

  function isProseBlogPost() {
    var p = pathname();
    if (p.indexOf('/blog/') === -1) return false;
    if (p.indexOf('dosing-guide') !== -1) return false;
    if (p === '/blog/' || p === '/blog/index.html') return false;
    return true;
  }

  function isDosingGuide() {
    return pathname().indexOf('dosing-guide') !== -1;
  }

  function scrollFraction() {
    var doc = document.documentElement;
    var height = Math.max(doc.scrollHeight, document.body.scrollHeight);
    if (height <= 0) return 0;
    return (window.pageYOffset + window.innerHeight) / height;
  }

  // ── Event 1: checkout_click ──────────────────────────────────────────────
  function setupCheckoutClick() {
    var links = document.querySelectorAll('a[href]');
    var n = 0;
    for (var i = 0; i < links.length; i++) {
      (function (link) {
        if (!CHECKOUT_HREF_PATTERN.test(link.href)) return;
        n++;
        link.addEventListener('click', function () {
          fire('checkout_click', baseParams({
            button_location: buttonLocation(link)
          }));
        });
      })(links[i]);
    }
    if (DEBUG) console.log('[GA4] checkout_click wired:', n, 'buttons');
  }

  // ── Event 2: email_signup (Klaviyo postMessage; dormant until form added) ─
  function setupEmailSignup() {
    window.addEventListener('message', function (e) {
      if (!e.data || e.data.type !== 'klaviyoForms') return;
      if (e.data.event !== 'submit') return;
      fire('email_signup', baseParams({
        form_id: e.data.formId || 'unknown'
      }));
    });
  }

  // ── Event 3: dosing_guide_viewed (50% scroll, once per pageview) ─────────
  function setupDosingGuideViewed() {
    if (!isDosingGuide()) return;
    var handler = function () {
      if (window.__dosingGuideEventFired) return;
      if (scrollFraction() < 0.5) return;
      window.__dosingGuideEventFired = true;
      fire('dosing_guide_viewed', baseParams({
        url: pathname(),
        page_title: document.title
      }));
      window.removeEventListener('scroll', handler);
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler(); // check immediately for short viewports
  }

  // ── Event 4: blog_read_75pct (75% scroll, prose posts only) ──────────────
  function setupBlogRead() {
    if (!isProseBlogPost()) return;
    var handler = function () {
      if (window.__blogReadEventFired) return;
      if (scrollFraction() < 0.75) return;
      window.__blogReadEventFired = true;
      fire('blog_read_75pct', baseParams({
        blog_post: document.title,
        url: pathname()
      }));
      window.removeEventListener('scroll', handler);
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
  }

  // ── Event 5: external_link_click (delegated; dormant until links added) ──
  function setupExternalLinks() {
    document.addEventListener('click', function (e) {
      var link = e.target && e.target.closest && e.target.closest('a[href]');
      if (!link) return;
      var href = link.href;
      var dest = null;
      for (var i = 0; i < EXTERNAL_DESTINATIONS.length; i++) {
        if (EXTERNAL_DESTINATIONS[i].match.test(href)) {
          dest = EXTERNAL_DESTINATIONS[i].name;
          break;
        }
      }
      if (!dest) return;
      fire('external_link_click', baseParams({
        destination: dest
      }));
    });
  }

  // ── Event 6: checkout_cta_impression (50% in viewport, once per element) ──
  function setupCheckoutImpressions() {
    if (typeof IntersectionObserver !== 'function') return;
    var seen = new WeakSet();
    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        if (!entry.isIntersecting) continue;
        if (seen.has(entry.target)) continue;
        seen.add(entry.target);
        fire('checkout_cta_impression', baseParams({
          button_location: buttonLocation(entry.target)
        }));
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.5 });
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      if (CHECKOUT_HREF_PATTERN.test(links[i].href)) observer.observe(links[i]);
    }
  }

  // ── Event 7: product_page_scroll_50 (homepage only) ──────────────────────
  function setupHomepageScroll() {
    if (!isHomepage()) return;
    var handler = function () {
      if (window.__homepageScrollEventFired) return;
      if (scrollFraction() < 0.5) return;
      window.__homepageScrollEventFired = true;
      fire('product_page_scroll_50', baseParams());
      window.removeEventListener('scroll', handler);
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
  }

  // ── Event 8: nav_click (links inside <nav>, excluding Buy Now) ───────────
  function setupNavClick() {
    var nav = document.querySelector('nav');
    if (!nav) return;
    var links = nav.querySelectorAll('a');
    var n = 0;
    for (var i = 0; i < links.length; i++) {
      (function (link) {
        // Skip Buy Now — it fires checkout_click instead
        if (link.href && CHECKOUT_HREF_PATTERN.test(link.href)) return;
        n++;
        link.addEventListener('click', function () {
          var label = (link.textContent || '').trim().toLowerCase();
          var destination = link.getAttribute('href') || '';
          // SPA showPage('x') links have no real href; derive destination from onclick
          if (!destination || destination === '#') {
            var onclick = link.getAttribute('onclick') || '';
            var m = onclick.match(/showPage\(['"]([^'"]+)['"]\)/);
            if (m) destination = '#page-' + m[1];
          }
          fire('nav_click', baseParams({
            nav_item: label,
            destination: destination
          }));
        });
      })(links[i]);
    }
    if (DEBUG) console.log('[GA4] nav_click wired:', n, 'links');
  }

  // ── Event 9: mobile_menu_open (.hamburger; only on open) ─────────────────
  function setupMobileMenu() {
    var hamburger = document.querySelector('.hamburger');
    if (!hamburger) return;
    hamburger.addEventListener('click', function () {
      // Inline onclick="toggleMobileMenu()" runs before this listener.
      // After toggle, check if menu is now in the open state.
      var menu = document.getElementById('mobileMenu');
      if (menu && menu.classList.contains('open')) {
        fire('mobile_menu_open', baseParams());
      }
    });
  }

  // ── Event 11: contact_form_submit (real form submission) ────────────────
  function setupContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function () {
      fire('contact_form_submit', baseParams());
    });
  }

  // ── Init ─────────────────────────────────────────────────────────────────
  function init() {
    setupCheckoutClick();
    setupEmailSignup();
    setupDosingGuideViewed();
    setupBlogRead();
    setupExternalLinks();
    setupCheckoutImpressions();
    setupHomepageScroll();
    setupNavClick();
    setupMobileMenu();
    setupContactForm();
    if (DEBUG) console.log('[GA4] analytics-events.js initialized', { staging: IS_STAGING });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
