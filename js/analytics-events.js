/* getmaintane.com — GA4 event tracking
 * Loaded with `defer` at the end of <body> on every HTML file.
 * GA4 measurement ID G-D8DRYD8BHZ and Meta Pixel are loaded earlier in <head>.
 *
 * Funnel and commerce events are wired with lightweight delegated listeners.
 * `faq_expand` is deliberately omitted — dosing-guide FAQs are static content,
 * not accordions; revisit when accordion is built.
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

  var CHECKOUT_HREF_PATTERN = /(?:aykixg-rn\.myshopify\.com|shopify\.com)\/cart|shop\.getmaintane\.com\/products\//i;
  var WAITLIST_HREF_PATTERN = /(?:getmaintane\.com)?\/waitlist\/?(?:$|[?#])/i;
  var FUNNEL_DESTINATIONS = [
    '/shop.html',
    '/septic-treatment.html',
    '/septic-care-checklist.html',
    '/septic-smell.html',
    '/slow-drains.html',
    '/natural-septic-treatment.html',
    '/ridx-alternative.html',
    '/septic-treatment-for-homes-with-kids-and-pets.html',
    '/septic-treatment-after-pumping.html',
    '/toilets-gurgling-septic.html',
    '/septic-alarm-going-off.html',
    '/septic-backup.html',
    '/standing-water-drain-field.html',
    '/septic-treatment-for-new-homeowners.html',
    '/septic-treatment-for-vacation-homes.html',
    '/septic-treatment-for-older-homes.html',
    '/septic-treatment-for-garbage-disposals.html',
    '/monthly-septic-treatment.html',
    '/septic-treatment-powder.html',
    '/chemical-free-septic-treatment.html',
    '/best-septic-treatment.html',
    '/septic-tank-smell-in-house.html',
    '/septic-smell-outside.html',
    '/rotten-egg-smell-septic.html',
    '/toilet-bubbling-septic.html',
    '/shower-drain-smells-septic.html',
    '/septic-tank-full-signs.html',
    '/septic-safe-drain-cleaner.html',
    '/septic-safe-toilet-cleaner.html',
    '/septic-safe-laundry-detergent.html',
    '/septic-treatment-for-rental-homes.html',
    '/septic-safe-home-cleaning-guide.html'
  ];
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
    if (!IS_STAGING && typeof gtag === 'function') {
      gtag('event', name, params);
    }
    fireMeta(name, params);
  }

  function fireMeta(name, params) {
    if (IS_STAGING || typeof fbq !== 'function') return;
    var metaParams = params || {};
    try {
      if (name === 'checkout_click') {
        fbq('track', 'InitiateCheckout', {
          value: Number(metaParams.value || metaParams.product_price || 49.99),
          currency: 'USD',
          content_name: metaParams.product_name || 'Maintane Natural Septic Tank Treatment',
          content_ids: [metaParams.product_id || 'MTN-001'],
          content_type: 'product',
          button_location: metaParams.button_location || 'unknown'
        });
      } else if (name === 'contact_form_submit') {
        fbq('track', 'Contact', {
          source_page: metaParams.source_page || pathname()
        });
      } else if (name === 'email_signup') {
        fbq('track', 'Lead', {
          content_name: 'Maintane Email Signup',
          source: metaParams.source || metaParams.form_id || 'email_signup',
          source_page: metaParams.source_page || pathname()
        });
      }
    } catch (e) {}
  }

  function cleanText(value, limit) {
    return (value || '').replace(/\s+/g, ' ').trim().toLowerCase().substring(0, limit || 100);
  }

  // Derive a meaningful label for which CTA the user interacted with.
  function buttonLocation(el) {
    if (!el) return 'unknown';
    if (el.classList && el.classList.contains('nav-cta')) return 'nav';
    if (el.classList && el.classList.contains('funnel-nav-cta')) return 'nav';
    if (el.classList && el.classList.contains('mobile-cta')) return 'mobile-menu';
    if (el.closest && el.closest('.funnel-mobile-menu')) return 'mobile-menu';
    if (el.closest && el.closest('footer')) return 'footer';
    if (el.closest && el.closest('.maintane-popup')) return 'popup';
    if (el.closest && el.closest('.funnel-resource-links')) return 'related-guides';
    if (el.closest && el.closest('.funnel-next-offer')) return 'lead-next-offer';
    if (el.closest && el.closest('.funnel-lead-card')) return 'lead-card';
    if (el.closest && el.closest('.funnel-hero')) return 'hero';
    if (el.closest && el.closest('.funnel-cta-band')) return 'cta-band';
    if (el.closest && el.closest('.funnel-actions')) return 'funnel-actions';
    if (el.closest && el.closest('.post-cta')) return 'blog-cta';
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

  function urlPath(href) {
    try { return new URL(href, window.location.origin).pathname; }
    catch (e) { return ''; }
  }

  function urlHash(href) {
    try { return new URL(href, window.location.origin).hash; }
    catch (e) { return ''; }
  }

  function isFunnelDestination(href) {
    var p = urlPath(href);
    return FUNNEL_DESTINATIONS.indexOf(p) !== -1;
  }

  function linkParams(link, extra) {
    var href = link.getAttribute('href') || '';
    var params = baseParams({
      destination: href,
      destination_path: urlPath(link.href),
      cta_text: cleanText(link.textContent, 100),
      button_location: buttonLocation(link)
    });
    if (extra) {
      for (var k in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, k)) params[k] = extra[k];
      }
    }
    return params;
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
          var params = baseParams({
            button_location: buttonLocation(link),
            cta_text: cleanText(link.textContent, 100),
            destination: link.getAttribute('href') || '',
            product_name: link.getAttribute('data-product-name') || 'Maintane Natural Septic Tank Treatment',
            product_id: link.getAttribute('data-product-id') || 'MTN-001',
            product_price: link.getAttribute('data-product-price') || '49.99',
            value: Number(link.getAttribute('data-product-price') || 49.99),
            currency: 'USD'
          });
          fire('checkout_click', params);
          fire('checkout_start', params);
        });
      })(links[i]);
    }
    if (DEBUG) console.log('[GA4] checkout_click wired:', n, 'buttons');
  }

  // ── Event 1b: waitlist_cta_click ─────────────────────────────────────────
  function setupWaitlistClick() {
    var links = document.querySelectorAll('a[href]');
    var n = 0;
    for (var i = 0; i < links.length; i++) {
      (function (link) {
        if (!WAITLIST_HREF_PATTERN.test(link.href)) return;
        n++;
        link.addEventListener('click', function () {
          fire('waitlist_cta_click', linkParams(link, {
            destination_type: 'waitlist'
          }));
        });
      })(links[i]);
    }
    if (DEBUG) console.log('[GA4] waitlist_cta_click wired:', n, 'buttons');
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

  // ── Event 6: product/waitlist CTA impressions (50% in viewport, once) ─────
  function setupCheckoutImpressions() {
    if (typeof IntersectionObserver !== 'function') return;
    var seen = new WeakSet();
    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        if (!entry.isIntersecting) continue;
        if (seen.has(entry.target)) continue;
        seen.add(entry.target);
        var isWaitlist = WAITLIST_HREF_PATTERN.test(entry.target.href || '');
        fire(isWaitlist ? 'waitlist_cta_impression' : 'checkout_cta_impression', baseParams({
          button_location: buttonLocation(entry.target),
          destination: entry.target.getAttribute('href') || ''
        }));
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.5 });
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      if (CHECKOUT_HREF_PATTERN.test(links[i].href) || WAITLIST_HREF_PATTERN.test(links[i].href)) observer.observe(links[i]);
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

  // ── Event 10: funnel_cta_click (treatment/checklist funnel links) ────────
  function setupFunnelCtaClick() {
    document.addEventListener('click', function (e) {
      var link = e.target && e.target.closest && e.target.closest('a[href]');
      if (!link || !isFunnelDestination(link.href)) return;
      fire('funnel_cta_click', baseParams({
        funnel_destination: urlPath(link.href),
        cta_text: cleanText(link.textContent, 80),
        button_location: buttonLocation(link)
      }));
    });
  }

  // ── Event 12: named funnel path clicks ──────────────────────────────────
  function setupKeyFunnelClicks() {
    document.addEventListener('click', function (e) {
      var link = e.target && e.target.closest && e.target.closest('a[href]');
      if (!link) return;

      var href = link.href || '';
      var path = urlPath(href);
      var hash = urlHash(href);
      var text = cleanText(link.textContent, 100);

      if (CHECKOUT_HREF_PATTERN.test(href)) {
        fire('product_cta_click', linkParams(link, {
          value: 39.99,
          currency: 'USD',
          product_name: 'Maintane Natural Septic Tank Treatment'
        }));
      }

      if (WAITLIST_HREF_PATTERN.test(href)) {
        fire('product_waitlist_click', linkParams(link, {
          product_name: 'Maintane Natural Septic Tank Treatment',
          destination_type: 'waitlist'
        }));
      }

      if (path === '/septic-care-checklist.html' || hash === '#checklist-form') {
        fire('checklist_cta_click', linkParams(link));
      }

      if (path === '/dosing-guide.html' || path === '/blog/dosing-guide.html') {
        fire('dosing_guide_click', linkParams(link));
      }

      if (link.closest('.funnel-resource-links')) {
        fire('related_guide_click', linkParams(link, {
          related_group: link.closest('.funnel-resource-links').getAttribute('aria-label') || 'related septic guides'
        }));
      }

      if (link.closest('footer') && path === '/septic-treatment.html' && text === 'septic guides') {
        fire('footer_septic_guides_click', linkParams(link));
      }
    });
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
  // Native form submission required for hCaptcha token to be included in POST.
  // target="_top" on the form element bypasses SPA interception.
  function setupContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function () {
      // Fire analytics before native form navigates away
      fire('contact_form_submit', baseParams());
      // Native form submission proceeds to FormSubmit with hCaptcha token attached
    });
  }

  // ── Event 13: explicit data-event hooks for focused landing pages ───────
  function setupDataEventHooks() {
    document.addEventListener('click', function (e) {
      var target = e.target && e.target.closest && e.target.closest('[data-event]');
      if (!target || target.tagName === 'FORM') return;
      fire(target.getAttribute('data-event'), baseParams({
        event_label: target.getAttribute('data-event-label') || cleanText(target.textContent, 80),
        destination: target.getAttribute('href') || '',
        button_location: buttonLocation(target)
      }));
    });

  }

  // ── Init ─────────────────────────────────────────────────────────────────
  function init() {
    setupCheckoutClick();
    setupWaitlistClick();
    setupEmailSignup();
    setupDosingGuideViewed();
    setupBlogRead();
    setupExternalLinks();
    setupCheckoutImpressions();
    setupHomepageScroll();
    setupNavClick();
    setupFunnelCtaClick();
    setupKeyFunnelClicks();
    setupMobileMenu();
    setupContactForm();
    setupDataEventHooks();
    if (DEBUG) console.log('[GA4] analytics-events.js initialized', { staging: IS_STAGING });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
