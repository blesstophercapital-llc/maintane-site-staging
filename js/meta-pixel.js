/* Meta Pixel base code.
 * Production-only guard keeps staging/local QA out of paid-media reporting.
 */
(function () {
  'use strict';

  var host = (window.location.hostname || '').toLowerCase();
  var isProduction = host === 'getmaintane.com' || host === 'www.getmaintane.com';
  var isFilePreview = window.location.protocol === 'file:';
  var optOut = /(?:[?&](?:debug_no_ga|maintane_no_analytics)=1)(?:&|$)/.test(window.location.search || '');

  try {
    optOut = optOut || window.localStorage.getItem('maintane_no_analytics') === 'true';
  } catch (e) {}

  if (!isProduction || isFilePreview || optOut || window.MAINTANE_ANALYTICS_DISABLED) {
    window.fbq = window.fbq || function () {};
    return;
  }

  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '35305867532391902');
  fbq('track', 'PageView');
})();
