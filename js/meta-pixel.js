/* Meta Pixel base code. Production only; staging/local previews are for build work. */
(function () {
  var host = (window.location.hostname || '').toLowerCase();
  var isProductionHost = host === 'getmaintane.com' || host === 'www.getmaintane.com';
  if (!isProductionHost || window.MAINTANE_ANALYTICS_DISABLED) {
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
