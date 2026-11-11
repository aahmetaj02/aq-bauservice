/* Google container loads only after an explicit statistics opt-in. */
(function () {
  'use strict';
  var key = 'aq-statistics-consent-v1';
  var lifetime = 180 * 24 * 60 * 60 * 1000;
  var loaded = false;
  var choice = null;
  try {
    var saved = JSON.parse(localStorage.getItem(key));
    if (saved && typeof saved.allowed === 'boolean' && saved.expires > Date.now()) choice = saved.allowed;
  } catch (_) {}
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: choice === true ? 'granted' : 'denied',
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'
  });
  function loadTag() {
    if (loaded) return;
    loaded = true;
    window.gtag('js', new Date());
    window.dataLayer.push({'gtm.start': Date.now(), event: 'gtm.js'});
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-MHFBD2ZR';
    document.head.appendChild(script);
  }
  function clearAnalyticsCookies() {
    document.cookie.split(';').forEach(function (item) {
      var name = item.split('=')[0].trim();
      if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name)) return;
      var suffix = '=; Max-Age=0; path=/; SameSite=Lax';
      document.cookie = name + suffix;
      var parts = location.hostname.split('.');
      for (var i = 0; i < parts.length - 1; i++) {
        document.cookie = name + suffix + '; domain=' + parts.slice(i).join('.');
        document.cookie = name + suffix + '; domain=.' + parts.slice(i).join('.');
      }
    });
  }
  if (choice === true) loadTag();
  var panel = document.createElement('section');
  panel.className = 'aq-consent';
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', 'aq-consent-title');
  panel.hidden = choice !== null;
  panel.innerHTML = '<h2 id="aq-consent-title">Ihre Datenschutzeinstellungen</h2><p>Mit Ihrer Zustimmung laden wir Google Tag Manager für die Besuchsstatistik mit Google Analytics. Dabei können Nutzungsdaten an Google übermittelt und Statistik-Cookies gespeichert werden. Ohne Zustimmung wird der Google-Code nicht geladen. Ihre Auswahl speichern wir für 180 Tage. Sie können sie jederzeit über „Datenschutzeinstellungen“ ändern. <a href="datenschutz.html">Mehr zum Datenschutz</a></p><div class="aq-consent-actions"><button type="button" data-choice="no">Ablehnen</button><button type="button" data-choice="yes">Statistik erlauben</button></div>';
  var settings = document.createElement('button');
  settings.type = 'button';
  settings.className = 'aq-consent-settings';
  settings.textContent = 'Datenschutzeinstellungen';
  settings.setAttribute('aria-controls', 'aq-consent-panel');
  panel.id = 'aq-consent-panel';
  settings.addEventListener('click', function () {
    panel.hidden = false;
    panel.querySelector('button').focus();
  });
  panel.querySelectorAll('button').forEach(function (button) {
    button.addEventListener('click', function () {
      var allowed = button.dataset.choice === 'yes';
      try { localStorage.setItem(key, JSON.stringify({allowed: allowed, expires: Date.now() + lifetime})); } catch (_) {}
      choice = allowed;
      window.gtag('consent', 'update', {analytics_storage: allowed ? 'granted' : 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
      panel.hidden = true;
      settings.focus();
      if (allowed) loadTag();
      else {
        clearAnalyticsCookies();
        // Unload previously started tags so withdrawal also stops further requests.
        if (loaded) location.reload();
      }
    });
  });
  window.addEventListener('storage', function (event) {
    if (event.key === key || event.key === null) location.reload();
  });
  document.body.appendChild(settings);
  document.body.appendChild(panel);
}());
