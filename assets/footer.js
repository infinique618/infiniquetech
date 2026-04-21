(function(){
  var FOOTER_KO = '<footer class="bg-black text-white py-20 px-6" style="border-top:1px solid rgba(255,255,255,0.1);">' +
    '<div class="max-w-[1920px] mx-auto">' +
      '<div class="footer-main-row" style="display:flex;margin-bottom:4px;justify-content:space-between;align-items:flex-start;">' +
        '<div style="white-space:nowrap;">' +
          '<span class="footer-addr" style="display:flex;align-items:center;gap:16px;white-space:nowrap;">' +
            '<span class="text-lg" style="color:#ddd;">주식회사 인피니크</span>' +
            '<span class="text-lg" style="color:#ddd;">|</span>' +
            '<a href="mailto:infinique@infinique.co.kr" style="color:#ddd;display:flex;align-items:center;gap:8px;white-space:nowrap;text-decoration:none;font-size:1.125rem;">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>' +
              '<span>infinique@infinique.co.kr</span>' +
            '</a>' +
          '</span>' +
          '<div style="color:#ddd;margin-top:8px;font-size:0.875rem;">' +
            '<p style="margin:0;">© 2026 주식회사 인피니크. All rights reserved.<a href="__ADMIN__" aria-label="." style="display:inline-block;width:3px;height:3px;background:rgba(255,255,255,0.08);margin-left:6px;vertical-align:middle;border-radius:50%;"></a></p>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:12px;">' +          '<a href="https://infinique.co.kr" target="_blank" rel="noopener" aria-label="infinique.co.kr">' +
            '<img src="__ASSETS__/dev_logo.svg" alt="Dev logo" style="width:160px;height:auto;">' +
          '</a>' +

          '<a href="https://infinique.kr" target="_blank" rel="noopener" aria-label="infinique.kr">' +
            '<img src="__ASSETS__/infinique_design_logo.svg" alt="Infinique" style="height:32px;width:auto;">' +
          '</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</footer>';

  var FOOTER_EN = '<footer class="bg-black text-white py-20 px-6" style="border-top:1px solid rgba(255,255,255,0.1);">' +
    '<div class="max-w-[1920px] mx-auto">' +
      '<div class="footer-main-row" style="display:flex;margin-bottom:4px;justify-content:space-between;align-items:flex-start;">' +
        '<div style="white-space:nowrap;">' +
          '<span class="footer-addr" style="display:flex;align-items:center;gap:16px;white-space:nowrap;">' +
            '<span class="text-lg" style="color:#ddd;">Infinique Inc.</span>' +
            '<span class="text-lg" style="color:#ddd;">|</span>' +
            '<a href="mailto:infinique@infinique.co.kr" style="color:#ddd;display:flex;align-items:center;gap:8px;white-space:nowrap;text-decoration:none;font-size:1.125rem;">' +
              '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>' +
              '<span>infinique@infinique.co.kr</span>' +
            '</a>' +
          '</span>' +
          '<div style="color:#ddd;margin-top:8px;font-size:0.875rem;">' +
            '<p style="margin:0;">© 2026 Infinique Inc. All rights reserved.<a href="__ADMIN__" aria-label="." style="display:inline-block;width:3px;height:3px;background:rgba(255,255,255,0.08);margin-left:6px;vertical-align:middle;border-radius:50%;"></a></p>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:12px;">' +          '<a href="https://infinique.co.kr" target="_blank" rel="noopener" aria-label="infinique.co.kr">' +
            '<img src="__ASSETS__/dev_logo.svg" alt="Dev logo" style="width:160px;height:auto;">' +
          '</a>' +

          '<a href="https://infinique.kr" target="_blank" rel="noopener" aria-label="infinique.kr">' +
            '<img src="__ASSETS__/infinique_design_logo.svg" alt="Infinique" style="height:32px;width:auto;">' +
          '</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</footer>';

  // Derive paths from this script's own src (works from any depth)
  var _scriptEl = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && scripts[i].src.indexOf('footer.js') > -1) return scripts[i];
    }
    return null;
  })();
  var _srcAttr = _scriptEl ? (_scriptEl.getAttribute('src') || '') : './assets/footer.js';
  var _assetsPath = _srcAttr.replace(/\/?footer\.js(\?.*)?$/, '');
  var _adminPath = _assetsPath.replace(/\/?assets\/?$/, '') + '/admin.html';
  if (_adminPath.charAt(0) === '/') _adminPath = '.' + _adminPath;

  function inject() {
    var el = document.getElementById('footer-placeholder');
    if (!el) return;
    var isEn = /\/en\//.test(window.location.pathname) || document.documentElement.lang === 'en';
    var html = (isEn ? FOOTER_EN : FOOTER_KO)
      .replace(/__ASSETS__/g, _assetsPath)
      .replace(/__ADMIN__/g, _adminPath);
    el.outerHTML = html;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
