(function(){
  var SB_URL = 'https://umzfjxrrotvwcmurzduz.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtemZqeHJyb3R2d2NtdXJ6ZHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NTEzMDcsImV4cCI6MjA5MjAyNzMwN30.TR0lKwZeC1_AONrfNgJLYWOykq8u5RBYFGc4q_xpfak';
  var TABLE = 'tech_projects';
  var CACHE_KEY = 'iq_tech_projects_v1';

  var isEnglish = /\/en(\/|$)/.test(location.pathname);
  var tagOrder = { 'Robotics': 1, 'AI': 2, 'Hardware': 3, 'Software': 4 };

  function rowToProject(r){
    return {
      slug: r.slug,
      num: r.num || '',
      category: r.category,
      orderInCategory: r.order_in_category == null ? 99 : r.order_in_category,
      showOnMain: !!r.show_on_main,
      orderOnMain: r.order_on_main == null ? 99 : r.order_on_main,
      title: r.en_title || '',
      subtitle: isEnglish ? (r.en_subtitle || '') : (r.ko_subtitle || r.en_subtitle || ''),
      tags: r.tags || [],
      images: r.images || []
    };
  }

  function esc(s){
    return (s == null ? '' : String(s)).replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  }

  function sortTags(tags){
    return (tags || []).slice().sort(function(a, b){
      return (tagOrder[a] || 99) - (tagOrder[b] || 99);
    });
  }

  function projectHref(slug){
    return './projects/' + slug + '.html';
  }

  function renderListTiles(ul, projects){
    if (!projects.length) return;
    var html = projects.map(function(p){
      var thumb = (p.images && p.images[0]) || '';
      var tagsHtml = sortTags(p.tags).map(function(t){ return '<span>' + esc(t) + '</span>'; }).join('');
      return '<li>' +
        '<a class="project-tile" href="' + esc(projectHref(p.slug)) + '">' +
          '<div class="project-tile-thumb">' +
            (thumb ? '<img src="' + esc(thumb) + '" alt="' + esc(p.title) + '" loading="lazy" decoding="async">' : '') +
          '</div>' +
          '<div class="project-tile-info">' +
            '<p class="project-tile-num">Project ' + esc(p.num) + '</p>' +
            '<h3 class="project-tile-name">' + esc(p.title) + '</h3>' +
            '<p class="project-tile-sub">' + esc(p.subtitle) + '</p>' +
            '<div class="project-tile-tags">' + tagsHtml + '</div>' +
          '</div>' +
        '</a>' +
      '</li>';
    }).join('');
    ul.innerHTML = html;
  }

  function renderRecentGrid(grid, projects){
    if (!projects.length) return;
    var html = projects.slice(0, 2).map(function(p){
      var thumb = (p.images && p.images[0]) || '';
      var style = thumb ? ' style="background-image:url(' + esc(thumb) + ');background-size:cover;background-position:center;"' : '';
      return '<div class="recent-item">' +
        '<a class="recent-thumb" href="' + esc(projectHref(p.slug)) + '"' + style + '></a>' +
        '<p class="recent-title">' + esc(p.title) + '</p>' +
      '</div>';
    }).join('');
    grid.innerHTML = html;
  }

  function applyAll(projects){
    // List pages (hardware.html / software.html)
    var listEls = document.querySelectorAll('[data-tech-list]');
    Array.prototype.forEach.call(listEls, function(el){
      var cat = el.getAttribute('data-tech-list');
      var filtered = projects.filter(function(p){ return p.category === cat; });
      filtered.sort(function(a, b){ return a.orderInCategory - b.orderInCategory; });
      renderListTiles(el, filtered);
    });

    // Main page: infer category from each .domain-card's CTA href
    var cards = document.querySelectorAll('.domain-card');
    Array.prototype.forEach.call(cards, function(card){
      var cta = card.querySelector('.domain-card-cta');
      var grid = card.querySelector('.domain-recent-grid');
      if (!cta || !grid) return;
      var href = cta.getAttribute('href') || '';
      var cat = /hardware/i.test(href) ? 'hardware' : /software/i.test(href) ? 'software' : null;
      if (!cat) return;
      var filtered = projects.filter(function(p){ return p.category === cat && p.showOnMain; });
      filtered.sort(function(a, b){ return a.orderOnMain - b.orderOnMain; });
      renderRecentGrid(grid, filtered);
    });
  }

  function boot(){
    var hasTargets = document.querySelector('[data-tech-list]') || document.querySelector('.domain-recent-grid');
    if (!hasTargets) return;

    // 1) render from cache if available
    try {
      var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (cached && cached.length) applyAll(cached.map(rowToProject));
    } catch(_){}

    // 2) fetch latest
    fetch(SB_URL + '/rest/v1/' + TABLE + '?select=*', {
      headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY }
    })
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(data){
      if (!data || !data.length) return;
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch(_){}
      applyAll(data.map(rowToProject));
    })
    .catch(function(err){ console.warn('tech_projects fetch failed', err); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
