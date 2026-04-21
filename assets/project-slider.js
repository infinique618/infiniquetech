(function(){
  var SB_URL = 'https://umzfjxrrotvwcmurzduz.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtemZqeHJyb3R2d2NtdXJ6ZHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NTEzMDcsImV4cCI6MjA5MjAyNzMwN30.TR0lKwZeC1_AONrfNgJLYWOykq8u5RBYFGc4q_xpfak';
  var TABLE = 'tech_projects';
  var CACHE_KEY = 'iq_tech_projects_v1';

  function esc(s){
    return (s == null ? '' : String(s)).replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  }

  function getSlugFromPath(){
    var m = /\/projects\/([^\/]+)\.html/.exec(location.pathname);
    return m ? m[1] : null;
  }

  function ensureModal(){
    var m = document.getElementById('projectImgModal');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'projectImgModal';
    m.className = 'proj-modal';
    m.setAttribute('aria-hidden', 'true');
    m.innerHTML =
      '<button class="proj-modal-close" aria-label="Close">&times;</button>' +
      '<button class="proj-modal-prev" aria-label="Previous">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
      '</button>' +
      '<button class="proj-modal-next" aria-label="Next">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>' +
      '</button>' +
      '<img class="proj-modal-img" alt="">';
    document.body.appendChild(m);
    return m;
  }

  function rebuildSlides(slider, images, altBase){
    var track = slider.querySelector('.slider-track');
    var dotsContainer = slider.querySelector('.slider-dots');
    if (!track) return;

    if (!images || !images.length) {
      // Show single empty placeholder if nothing uploaded yet
      track.innerHTML = '<div class="slider-slide is-empty"></div>';
      if (dotsContainer) dotsContainer.innerHTML = '';
      return;
    }

    track.innerHTML = images.map(function(src, i){
      return '<div class="slider-slide">' +
        '<img src="' + esc(src) + '" alt="' + esc(altBase) + ' – image ' + (i + 1) + '">' +
      '</div>';
    }).join('');

    if (dotsContainer) {
      dotsContainer.innerHTML = images.map(function(_, i){
        return '<button class="slider-dot' + (i === 0 ? ' is-active' : '') + '" aria-label="Slide ' + (i + 1) + '"></button>';
      }).join('');
    }
  }

  function initSlider(slider){
    var track = slider.querySelector('.slider-track');
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.slider-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.slider-dot'));
    var prevBtn = slider.querySelector('.slider-prev');
    var nextBtn = slider.querySelector('.slider-next');
    if (!track || !slides.length) return;

    slides.forEach(function(s){
      var img = s.querySelector('img');
      if (!img) { s.classList.add('is-empty'); return; }
      img.addEventListener('error', function(){ s.classList.add('is-empty'); });
    });

    var idx = 0;
    var count = slides.length;

    function update(){
      track.style.transform = 'translateX(' + (-idx * 100) + '%)';
      dots.forEach(function(d, j){ d.classList.toggle('is-active', j === idx); });
    }
    function go(i){ idx = ((i % count) + count) % count; update(); }

    if (prevBtn) prevBtn.addEventListener('click', function(){ go(idx - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function(){ go(idx + 1); });
    dots.forEach(function(d, j){ d.addEventListener('click', function(){ go(j); }); });

    var modal = ensureModal();
    var modalImg = modal.querySelector('.proj-modal-img');
    var modalClose = modal.querySelector('.proj-modal-close');
    var modalPrev = modal.querySelector('.proj-modal-prev');
    var modalNext = modal.querySelector('.proj-modal-next');

    function openModal(i){
      if (slides[i].classList.contains('is-empty')) return;
      var img = slides[i].querySelector('img');
      if (!img) return;
      idx = i;
      update();
      modalImg.src = img.currentSrc || img.src;
      modalImg.alt = img.alt || '';
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeModal(){
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    function modalGo(i){
      i = ((i % count) + count) % count;
      if (slides[i].classList.contains('is-empty')) return;
      idx = i;
      update();
      var img = slides[i].querySelector('img');
      if (img) modalImg.src = img.currentSrc || img.src;
    }

    slides.forEach(function(s, j){
      s.addEventListener('click', function(){ openModal(j); });
    });

    modalClose.onclick = closeModal;
    modalPrev.onclick = function(){ modalGo(idx - 1); };
    modalNext.onclick = function(){ modalGo(idx + 1); };
    modal.addEventListener('click', function(e){ if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function(e){
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeModal();
      else if (e.key === 'ArrowLeft') modalGo(idx - 1);
      else if (e.key === 'ArrowRight') modalGo(idx + 1);
    });
  }

  function getCachedImages(slug){
    try {
      var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (!cached) return null;
      for (var i = 0; i < cached.length; i++) {
        if (cached[i].slug === slug) return cached[i].images || [];
      }
    } catch(_) {}
    return null;
  }

  function fetchImages(slug, cb){
    fetch(SB_URL + '/rest/v1/' + TABLE + '?slug=eq.' + encodeURIComponent(slug) + '&select=images,en_title', {
      headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY }
    })
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(data){
      if (data && data[0] && Array.isArray(data[0].images)) cb(data[0].images, data[0].en_title || '');
      else cb(null, '');
    })
    .catch(function(){ cb(null, ''); });
  }

  function boot(){
    var sliders = document.querySelectorAll('.project-detail-slider');
    if (!sliders.length) return;

    var slug = getSlugFromPath();
    var altBase = (document.querySelector('.project-detail-title') || {}).textContent || slug || '';
    var initialized = false;

    function initAll(images){
      if (initialized) return;
      initialized = true;
      Array.prototype.forEach.call(sliders, function(s){
        if (images !== null) rebuildSlides(s, images, altBase);
        initSlider(s);
      });
    }

    // Try cache for instant render
    var cachedImages = slug ? getCachedImages(slug) : null;
    if (cachedImages !== null) {
      Array.prototype.forEach.call(sliders, function(s){ rebuildSlides(s, cachedImages, altBase); });
    }

    if (!slug) { initAll(null); return; }

    var timer = setTimeout(function(){ initAll(cachedImages !== null ? cachedImages : null); }, 1500);
    fetchImages(slug, function(images){
      clearTimeout(timer);
      initAll(images);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
