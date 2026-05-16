/* Maintane lead capture forms
 * Small reusable Klaviyo submitter for landing-page email forms.
 */
(function () {
  'use strict';

  var IS_STAGING = (function () {
    var h = (window.location.hostname || '').toLowerCase();
    return h === 'localhost' || h === '127.0.0.1' || h.indexOf('staging') !== -1 || h.indexOf('netlify') !== -1;
  })();

  var KLAVIYO_COMPANY_ID = 'UnVzdk';
  var DEFAULT_KLAVIYO_LIST_ID = 'Ue3eN8';
  var KLAVIYO_ENDPOINT   = 'https://a.klaviyo.com/client/subscriptions/?company_id=' + KLAVIYO_COMPANY_ID;
  var KLAVIYO_ONSITE_SRC = 'https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=' + KLAVIYO_COMPANY_ID;
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
          source: (params && (params.signup_source || params.form_id)) || 'landing_page',
          source_page: window.location.pathname
        });
      } catch (e) {}
    }
  }

  function collectFormProperties(form) {
    var props = {};
    var fields = form.querySelectorAll('input[name], select[name], textarea[name]');
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      var name = field.getAttribute('name');
      if (!name || name === 'email') continue;
      if ((field.type === 'checkbox' || field.type === 'radio') && !field.checked) continue;
      props[name] = (field.value || '').trim();
    }
    return props;
  }

  function validateRequiredFields(form) {
    var required = form.querySelectorAll('[required]');
    for (var i = 0; i < required.length; i++) {
      var field = required[i];
      if ((field.value || '').trim()) {
        field.classList.remove('is-invalid');
        continue;
      }
      field.classList.add('is-invalid');
      field.focus();
      return false;
    }
    return true;
  }

  function postKlaviyoEvent(email, eventName, source, listId, properties) {
    if (!eventName) return;

    var eventProperties = Object.assign({
      signup_source: source,
      signup_list_id: listId,
      source_page: window.location.pathname
    }, properties || {});
    var profileProperties = Object.assign({ '$email': email }, eventProperties);

    if (IS_STAGING) {
      console.log('[lead-capture] STAGING — would track Klaviyo onsite event', {
        email: email,
        event: eventName,
        properties: eventProperties
      });
      return;
    }

    window._learnq = window._learnq || [];
    window._learnq.push(['identify', profileProperties]);
    window._learnq.push(['track', eventName, eventProperties]);
    loadKlaviyoOnsite();
  }

  function loadKlaviyoOnsite() {
    if (document.querySelector('script[data-klaviyo-onsite]')) return;
    var script = document.createElement('script');
    script.async = true;
    script.src = KLAVIYO_ONSITE_SRC;
    script.setAttribute('data-klaviyo-onsite', 'true');
    document.head.appendChild(script);
  }

  function initForm(form) {
    var input = form.querySelector('input[type="email"]');
    var success = form.querySelector('[data-lead-success]');
    var error = form.querySelector('[data-lead-error]');
    var next = form.querySelector('[data-lead-next]');
    var submit = form.querySelector('button[type="submit"]');
    var source = form.getAttribute('data-lead-source') || 'landing_page';
    var listId = form.getAttribute('data-lead-list-id') || DEFAULT_KLAVIYO_LIST_ID;
    var explicitEvent = form.getAttribute('data-event') || '';
    var explicitEventLabel = form.getAttribute('data-event-label') || source;
    var klaviyoEvent = form.getAttribute('data-klaviyo-event') || '';
    var successRedirect = form.getAttribute('data-success-redirect') || '';
    var customProperties = {};
    var submittedEmail = '';

    if (!input) return;

    input.addEventListener('focus', function () {
      var eventParams = {
        signup_source: source,
        source_page: window.location.pathname,
        form_id: source,
        list_id: listId
      };
      track('form_start', eventParams);
      track('lead_form_start', eventParams);
    }, { once: true });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (input.value || '').trim();

      if (!validateRequiredFields(form)) return;

      if (!EMAIL_REGEX.test(email)) {
        input.classList.add('is-invalid');
        input.focus();
        return;
      }

      input.classList.remove('is-invalid');
      if (submit) submit.disabled = true;
      customProperties = collectFormProperties(form);
      submittedEmail = email;

      if (IS_STAGING) {
        console.log('[lead-capture] STAGING — would POST to Klaviyo', {
          email: email, list: listId, source: source, properties: customProperties
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
                    properties: Object.assign({
                      signup_source: source,
                      signup_list_id: listId,
                      source_page: window.location.pathname
                    }, customProperties)
                  }
                }
              },
              custom_source: source
            },
            relationships: {
              list: { data: { type: 'list', id: listId } }
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
      var eventParams = {
        signup_source: source,
        source_page: window.location.pathname,
        form_id: source,
        list_id: listId
      };
      eventParams = Object.assign(eventParams, customProperties);
      track('email_signup', Object.assign({
        signup_source: source,
        source_page: window.location.pathname,
        form_id: source,
        list_id: listId
      }, customProperties));
      track('lead_form_submit', eventParams);
      track('generate_lead', eventParams);
      if (source.indexOf('waitlist') !== -1) track('waitlist_complete', eventParams);
      if (source.indexOf('checklist') !== -1) track('checklist_lead_submit', eventParams);
      postKlaviyoEvent(submittedEmail, klaviyoEvent, source, listId, customProperties);
      if (explicitEvent) {
        track(explicitEvent, {
          signup_source: source,
          source_page: window.location.pathname,
          form_id: source,
          list_id: listId,
          event_label: explicitEventLabel
        });
      }
      form.classList.add('lead-form--submitted');
      if (error) error.style.display = 'none';
      if (success) success.style.display = 'block';
      if (next) next.style.display = 'block';
      if (submit) submit.disabled = false;
      form.dispatchEvent(new CustomEvent('maintane:lead-success', {
        bubbles: true,
        detail: {
          signup_source: source,
          source_page: window.location.pathname,
          form_id: source,
          list_id: listId,
          properties: customProperties
        }
      }));
      if (successRedirect) {
        window.setTimeout(function () {
          window.location.href = successRedirect;
        }, 450);
      }
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
