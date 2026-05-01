/* Maintane lead capture forms
 * Small reusable Klaviyo submitter for landing-page email forms.
 */
(function () {
  'use strict';

  var IS_STAGING = (function () {
    var h = (window.location.hostname || '').toLowerCase();
    return h.indexOf('staging') !== -1 || h.indexOf('netlify') !== -1;
  })();

  var KLAVIYO_COMPANY_ID = 'UnVzdk';
  var KLAVIYO_LIST_ID    = 'Ue3eN8';
  var KLAVIYO_ENDPOINT   = 'https://a.klaviyo.com/client/subscriptions/?company_id=' + KLAVIYO_COMPANY_ID;
  var KLAVIYO_REVISION   = '2024-10-15';
  var EMAIL_REGEX        = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var CONVERTED_COOKIE_DAYS = 365;

  function setCookie(name, value, days) {
    var expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/;SameSite=Lax';
  }

  function track(event, params) {
    if (typeof window.gtag === 'function') {
      try { window.gtag('event', event, params || {}); } catch (e) {}
    }
    if (!IS_STAGING && event === 'email_signup' && typeof window.fbq === 'function') {
      try {
        window.fbq('track', 'Lead', {
          content_name: 'Maintane Landing Page Lead',
          source: (params && params.source) || 'landing_page',
          source_page: window.location.pathname
        });
      } catch (e) {}
    }
  }

  function initForm(form) {
    var input = form.querySelector('input[type="email"]');
    var success = form.querySelector('[data-lead-success]');
    var error = form.querySelector('[data-lead-error]');
    var next = form.querySelector('[data-lead-next]');
    var submit = form.querySelector('button[type="submit"]');
    var source = form.getAttribute('data-lead-source') || 'landing_page';

    if (!input) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (input.value || '').trim();

      if (!EMAIL_REGEX.test(email)) {
        input.classList.add('is-invalid');
        input.focus();
        return;
      }

      input.classList.remove('is-invalid');
      if (submit) submit.disabled = true;

      if (IS_STAGING) {
        console.log('[lead-capture] STAGING — would POST to Klaviyo', {
          email: email, list: KLAVIYO_LIST_ID, source: source
        });
        onSuccess();
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
                      signup_source: source,
                      source_page: window.location.pathname
                    }
                  }
                }
              },
              custom_source: source
            },
            relationships: {
              list: { data: { type: 'list', id: KLAVIYO_LIST_ID } }
            }
          }
        })
      }).then(function (r) {
        if (r.status === 202 || r.status === 200) onSuccess();
        else onError(new Error('Klaviyo returned HTTP ' + r.status));
      }).catch(onError);
    });

    function onSuccess() {
      setCookie('maintane_popup_converted', '1', CONVERTED_COOKIE_DAYS);
      track('email_signup', {
        source: source,
        source_page: window.location.pathname
      });
      form.classList.add('lead-form--submitted');
      if (error) error.style.display = 'none';
      if (success) success.style.display = 'block';
      if (next) next.style.display = 'block';
      if (submit) submit.disabled = false;
    }

    function onError(err) {
      console.error('[lead-capture] Klaviyo submission failed:', err);
      form.classList.remove('lead-form--submitted');
      if (success) success.style.display = 'none';
      if (next) next.style.display = 'none';
      if (error) error.style.display = 'block';
      if (submit) submit.disabled = false;
    }
  }

  function init() {
    var forms = document.querySelectorAll('[data-lead-form]');
    for (var i = 0; i < forms.length; i++) initForm(forms[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
