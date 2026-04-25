/* Footer waitlist capture — getmaintane.com
 * Submits to Klaviyo Pre-Launch Waitlist (Ue3eN8) with signup_source=footer_waitlist.
 * Self-contained IS_STAGING check so it works whether or not popup.js is loaded.
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
  }

  function init() {
    var form    = document.getElementById('footer-waitlist-form');
    if (!form) return;
    var input   = document.getElementById('footer-waitlist-email');
    var success = document.getElementById('footer-waitlist-success');
    var error   = document.getElementById('footer-waitlist-error');
    var submit  = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (input.value || '').trim();
      if (!EMAIL_REGEX.test(email)) {
        input.style.borderColor = '#c44';
        input.focus();
        return;
      }
      input.style.borderColor = '';
      if (submit) submit.disabled = true;

      if (IS_STAGING) {
        console.log('[footer-waitlist] STAGING — would POST to Klaviyo', {
          email: email, list: KLAVIYO_LIST_ID, source: 'footer_waitlist'
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
                      signup_source: 'footer_waitlist',
                      source_page: window.location.pathname
                    }
                  }
                }
              },
              custom_source: 'footer_waitlist'
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
        source: 'footer_waitlist',
        source_page: window.location.pathname
      });
      form.style.display = 'none';
      if (error) error.style.display = 'none';
      if (success) success.style.display = 'block';
    }

    function onError(err) {
      console.error('[footer-waitlist] Klaviyo submission failed:', err);
      if (success) success.style.display = 'none';
      if (error) error.style.display = 'block';
      if (submit) submit.disabled = false;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
