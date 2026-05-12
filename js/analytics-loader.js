/* Maintane analytics loader
 * Loads GA4 only on the production domain. Staging/local previews get a no-op
 * gtag so event code can run without sending data to Google.
 */
(function () {
  'use strict';

  var GA_MEASUREMENT_ID = 'G-D8DRYD8BHZ';
  var host = (window.location.hostname || '').toLowerCase();
  var search = window.location.search || '';
  var isProductionHost = host === 'getmaintane.com' || host === 'www.getmaintane.com';
  var hasOptOutParam = /(?:[?&](?:debug_no_ga|maintane_no_analytics)=1)(?:&|$)/.test(search);
  var hasOptOutStorage = false;

  try {
    hasOptOutStorage = window.localStorage.getItem('maintane_no_analytics') === 'true';
  } catch (e) {}

  var analyticsDisabled =
    !isProductionHost ||
    hasOptOutParam ||
    hasOptOutStorage ||
    window.location.protocol === 'file:';

  window.MAINTANE_ANALYTICS_DISABLED = analyticsDisabled;
  window['ga-disable-' + GA_MEASUREMENT_ID] = analyticsDisabled;
  window.dataLayer = window.dataLayer || [];

  if (analyticsDisabled) {
    window.gtag = function () {};
    return;
  }

  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
})();
