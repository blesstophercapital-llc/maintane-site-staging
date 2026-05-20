/* Maintane production-only analytics loader.
 * Keeps staging, localhost, file previews, and internal QA out of GA4.
 */
(function () {
  'use strict';

  var GA_ID = 'G-D8DRYD8BHZ';
  var host = (window.location.hostname || '').toLowerCase();
  var isProduction = host === 'getmaintane.com' || host === 'www.getmaintane.com';
  var isFilePreview = window.location.protocol === 'file:';
  var optOut = /(?:[?&](?:debug_no_ga|maintane_no_analytics)=1)(?:&|$)/.test(window.location.search || '');

  try {
    optOut = optOut || window.localStorage.getItem('maintane_no_analytics') === 'true';
  } catch (e) {}

  window.MAINTANE_ANALYTICS_DISABLED = !isProduction || isFilePreview || optOut;
  window['ga-disable-' + GA_ID] = window.MAINTANE_ANALYTICS_DISABLED;

  if (window.MAINTANE_ANALYTICS_DISABLED) {
    window.dataLayer = [];
    window.gtag = function () {};
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
})();
