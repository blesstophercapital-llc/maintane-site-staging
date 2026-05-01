/* Pre-launch waitlist popup — getmaintane.com
 * Shows quickly after page load, scroll intent, or exit intent.
 * Dismissals do not persist, so each new page visit gets a fresh popup.
 * Submits to Klaviyo's client subscriptions API; adds profile to list Ue3eN8.
 * Staging guard: listeners render the popup but never POST to Klaviyo.
 */
(function () {
  'use strict';

  // ── Configuration ────────────────────────────────────────────────────────
  var IS_STAGING = (function () {
    var h = (window.location.hostname || '').toLowerCase();
    return h.indexOf('staging') !== -1 || h.indexOf('netlify') !== -1;
  })();

  var KLAVIYO_COMPANY_ID  = 'UnVzdk';
  var KLAVIYO_LIST_ID     = 'Ue3eN8';
  var KLAVIYO_ENDPOINT    = 'https://a.klaviyo.com/client/subscriptions/?company_id=' + KLAVIYO_COMPANY_ID;
  var KLAVIYO_REVISION    = '2024-10-15';

  var SHOW_DELAY_MS           = 1200;
  var SCROLL_TRIGGER_RATIO    = 0.28;
  var EXIT_INTENT_Y           = 18;
  var CONVERTED_COOKIE_DAYS   = 365;
  var ANIM_DURATION_MS        = 250;
  var SUCCESS_AUTOCLOSE_MS    = 3000;
  var EMAIL_REGEX             = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ── Cookies ──────────────────────────────────────────────────────────────
  function setCookie(name, value, days) {
    var expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/;SameSite=Lax';
  }
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
  function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax';
  }

  // ── GA4 ──────────────────────────────────────────────────────────────────
  function track(event, params) {
    if (typeof window.gtag === 'function') {
      try { window.gtag('event', event, params || {}); } catch (e) { /* no-op */ }
    }
    if (!IS_STAGING && event === 'email_signup' && typeof window.fbq === 'function') {
      try {
        window.fbq('track', 'Lead', {
          content_name: 'Maintane Popup Waitlist',
          source: (params && params.source) || 'pre_launch_popup',
          source_page: window.location.pathname
        });
      } catch (e) { /* no-op */ }
    }
  }

  // ── Element refs ─────────────────────────────────────────────────────────
  var popup, closeBtn, form, emailInput, successEl, errorEl, submitBtn;
  var focusableEls = [];
  var lastFocused = null;
  var hasShown = false;

  // ── Init ─────────────────────────────────────────────────────────────────
  function init() {
    popup = document.getElementById('maintane-popup');
    if (!popup) return;

    // Skip popup on thank-you page (users just converted via contact form)
    if (window.location.pathname === '/thank-you.html') return;

    // Clear legacy dismissal cookies so closed popups reset on every new visit.
    deleteCookie('maintane_popup_dismissed');

    // Short-circuit only if the user already converted.
    if (getCookie('maintane_popup_converted')) return;

    closeBtn   = popup.querySelector('.maintane-popup__close');
    form       = popup.querySelector('#maintane-popup-form');
    emailInput = popup.querySelector('#maintane-popup-email');
    successEl  = popup.querySelector('#maintane-popup-success');
    errorEl    = popup.querySelector('#maintane-popup-error');
    submitBtn  = popup.querySelector('.maintane-popup__submit');

    if (closeBtn) closeBtn.addEventListener('click', function () { closePopup(); });
    if (form)     form.addEventListener('submit', onSubmit);
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('mouseleave', onExitIntent);
    window.addEventListener('scroll', onScrollIntent, { passive: true });

    setTimeout(showPopup, SHOW_DELAY_MS);
  }

  // ── Show / close ─────────────────────────────────────────────────────────
  function showPopup() {
    if (!popup) return;
    if (hasShown) return;
    hasShown = true;

    document.removeEventListener('mouseleave', onExitIntent);
    window.removeEventListener('scroll', onScrollIntent);
    lastFocused = document.activeElement;

    popup.style.display = 'flex';
    popup.setAttribute('aria-hidden', 'false');
    // Force reflow so the transition starts from the initial state
    void popup.offsetWidth;
    popup.classList.add('maintane-popup--visible');

    document.body.style.overflow = 'hidden';

    // Compute focusable elements for the focus trap
    focusableEls = Array.prototype.slice.call(
      popup.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])')
    ).filter(function (el) {
      return !el.hasAttribute('disabled') && el.offsetParent !== null;
    });

    // Focus the email input after animation settles
    setTimeout(function () {
      if (emailInput && !emailInput.disabled) emailInput.focus();
    }, ANIM_DURATION_MS);

    track('popup_shown', { source_page: window.location.pathname });
  }

  function onExitIntent(e) {
    if (!e) return;
    if (e.clientY <= EXIT_INTENT_Y) showPopup();
  }

  function onScrollIntent() {
    var scrollable = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1
    );
    var ratio = (window.scrollY || window.pageYOffset || 0) / scrollable;
    if (ratio >= SCROLL_TRIGGER_RATIO) showPopup();
  }

  function closePopup(opts) {
    if (!popup) return;
    var skipDismissCookie = opts && opts.skipDismissCookie === true;

    popup.classList.remove('maintane-popup--visible');
    popup.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    setTimeout(function () { popup.style.display = 'none'; }, ANIM_DURATION_MS);

    if (lastFocused && typeof lastFocused.focus === 'function') {
      try { lastFocused.focus(); } catch (e) { /* no-op */ }
    }

    if (!skipDismissCookie) {
      track('popup_dismissed', { source_page: window.location.pathname });
    }
  }

  // ── Keyboard handling (Escape + focus trap) ──────────────────────────────
  function onKeydown(e) {
    if (!popup.classList.contains('maintane-popup--visible')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closePopup();
      return;
    }
    if (e.key === 'Tab' && focusableEls.length) {
      var first = focusableEls[0];
      var last  = focusableEls[focusableEls.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // ── Form submission ──────────────────────────────────────────────────────
  function onSubmit(e) {
    e.preventDefault();
    var email = (emailInput.value || '').trim();

    if (!EMAIL_REGEX.test(email)) {
      emailInput.classList.add('maintane-popup__input--invalid');
      emailInput.focus();
      return;
    }
    emailInput.classList.remove('maintane-popup__input--invalid');

    if (submitBtn) submitBtn.disabled = true;

    // Staging: don't actually hit Klaviyo; still flow through success for testing
    if (IS_STAGING) {
      console.log('[popup] STAGING — would POST to Klaviyo', {
        email: email, list: KLAVIYO_LIST_ID, source: 'pre_launch_popup'
      });
      onSuccess(email);
      return;
    }

    fetch(KLAVIYO_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'revision': KLAVIYO_REVISION
      },
      body: JSON.stringify({
        data: {
          type: 'subscription',
          attributes: {
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email: email,
                  properties: {
                    signup_source: 'pre_launch_popup',
                    source_page: window.location.pathname
                  }
                }
              }
            },
            custom_source: 'pre_launch_popup'
          },
          relationships: {
            list: {
              data: { type: 'list', id: KLAVIYO_LIST_ID }
            }
          }
        }
      })
    }).then(function (r) {
      if (r.status === 202 || r.status === 200) {
        onSuccess(email);
      } else {
        onError(new Error('Klaviyo returned HTTP ' + r.status));
      }
    }).catch(onError);
  }

  function onSuccess(email) {
    setCookie('maintane_popup_converted', '1', CONVERTED_COOKIE_DAYS);
    var eventParams = {
      source: 'pre_launch_popup',
      source_page: window.location.pathname,
      form_id: 'pre_launch_popup',
      list_id: KLAVIYO_LIST_ID
    };
    track('email_signup', {
      source: 'pre_launch_popup',
      source_page: window.location.pathname,
      form_id: 'pre_launch_popup',
      list_id: KLAVIYO_LIST_ID
    });
    track('lead_form_submit', eventParams);
    track('generate_lead', eventParams);
    track('popup_lead_submit', eventParams);

    if (form)      form.style.display = 'none';
    if (errorEl)   errorEl.style.display = 'none';
    if (successEl) successEl.style.display = 'block';

    // Auto-close after a few seconds — skip the dismiss cookie/event
    // since conversion already locked out future shows via the 365d cookie.
    setTimeout(function () {
      closePopup({ skipDismissCookie: true });
    }, SUCCESS_AUTOCLOSE_MS);
  }

  function onError(err) {
    console.error('[popup] Klaviyo submission failed:', err);
    if (form)      form.style.display = 'none';
    if (successEl) successEl.style.display = 'none';
    if (errorEl)   errorEl.style.display = 'block';
    if (submitBtn) submitBtn.disabled = false;
  }

  // ── Bootstrap ────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
