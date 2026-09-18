(function () {
  'use strict';

  var FECHA_BODA = new Date(2012, 8, 18);

  var RAZONES = [
    'Por ser un hombre íntegro.',
    'Por ser un gran padre.',
    'Por tu forma infantil.',
    'Por tu olor.',
    'Por lo amoroso que eres.',
    'Porque eres consentidor.',
    'Por ser protector.',
    'Por cuidar mi autoestima.',
    'Por motivarme.',
    'Por creer en mis sueños.',
    'Porque en ti encuentro paz.',
    'Porque me haces sentir segura.',
    'Por no soltar mi mano.',
    'Porque eres un gran hombre.'
  ];

  var FOTOS = [
    'fotos/1.jpeg',
    'fotos/2.jpeg',
    'fotos/3.jpeg',
    'fotos/4.jpeg',
    'fotos/5.jpeg',
    'fotos/6.jpeg'
  ];

  function aniosDesde(fecha) {
    var hoy = new Date();
    var anios = hoy.getFullYear() - fecha.getFullYear();
    var m = hoy.getMonth() - fecha.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) anios--;
    return Math.max(anios, 0);
  }

  function renderRazones() {
    var grid = document.getElementById('razonesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    RAZONES.forEach(function (razon, i) {
      var card = document.createElement('article');
      card.className = 'razon-card reveal';
      card.style.transitionDelay = (i % 3) * 0.1 + 's';
      card.innerHTML =
        '<span class="razon-num">' + (i + 1) + '</span>' +
        '<p class="razon-texto">' + razon + '</p>';
      grid.appendChild(card);
    });
  }

  function renderGaleria() {
    var grid = document.getElementById('galeriaGrid');
    if (!grid) return;
    grid.innerHTML = '';
    FOTOS.forEach(function (src, i) {
      var item = document.createElement('figure');
      item.className = 'galeria-item reveal';
      item.style.transitionDelay = (i % 3) * 0.1 + 's';
      item.tabIndex = 0;
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', 'Ver foto ' + (i + 1));
      var img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = 'Recuerdo ' + (i + 1);
      img.src = src;
      img.addEventListener('error', function () {
        img.style.display = 'none';
        var ph = document.createElement('div');
        ph.className = 'placeholder-img';
        ph.innerHTML = '<span class="corazon">♥</span>';
        item.appendChild(ph);
      });
      item.appendChild(img);
      item.addEventListener('click', function () {
        abrirLightbox(img);
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          abrirLightbox(img);
        }
      });
      grid.appendChild(item);
    });
  }

  function renderHero() {
    var badge = document.getElementById('heroBadge');
    var sub = document.getElementById('heroSub');
    var anios = aniosDesde(FECHA_BODA);
    if (!isNaN(anios) && badge) {
      badge.textContent = 'Nuestro amor cumple ' + anios + (anios === 1 ? ' año' : ' años');
    }
    if (sub) {
      sub.textContent = anios + ' años caminando de tu mano, escribiendo nuestra historia.';
    }
  }

  function initReveal() {
    var targets = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(targets, function (el) { el.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(targets, function (el) { obs.observe(el); });
  }

  var audio = document.getElementById('audio');
  var btn = document.getElementById('btnMusica');
  var tocando = false;

  function activarMusica() {
    if (!audio || !btn) return;
    btn.classList.add('playing');
    btn.classList.remove('paused');
    audio.play().catch(function () {});
  }

  function pausarMusica() {
    if (!audio || !btn) return;
    btn.classList.add('paused');
    btn.classList.remove('playing');
    audio.pause();
  }

  btn.classList.add('paused');
  btn.addEventListener('click', function () {
    if (tocando) {
      tocando = false;
      pausarMusica();
    } else {
      tocando = true;
      activarMusica();
    }
  });

  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbClose = document.getElementById('lbClose');

  function abrirLightbox(img) {
    if (!lb || !lbImg) return;
    lbImg.src = img.src;
    lb.classList.add('abierto');
    document.body.style.overflow = 'hidden';
  }

  function cerrarLightbox() {
    if (!lb) return;
    lb.classList.remove('abierto');
    document.body.style.overflow = '';
  }

  if (lbClose) lbClose.addEventListener('click', cerrarLightbox);
  if (lb) lb.addEventListener('click', function (e) { if (e.target === lb) cerrarLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cerrarLightbox();
  });

  var canvas = document.getElementById('lluvia');
  var ctx = canvas ? canvas.getContext('2d') : null;
  var corazones = [];

  function tamanoCanvas() {
    if (!canvas) return;
    var dpr = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function crearCorazon(i) {
    var total = Math.min(14, Math.max(7, Math.floor(window.innerWidth / 110)));
    return {
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + Math.random() * window.innerHeight,
      s: 0.8 + Math.random() * 1.4,
      v: 0.2 + Math.random() * 0.5,
      o: 0.05 + Math.random() * 0.12,
      i: i,
      total: total,
      w: Math.PI * 2 * Math.random()
    };
  }

  function dibujaCorazon(c) {
    ctx.save();
    ctx.globalAlpha = c.o;
    ctx.translate(c.x, c.y);
    ctx.rotate(Math.sin(c.w) * 0.15);
    ctx.scale(c.s, c.s);
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(0, 1.5, -4, -2, -6.5, 1);
    ctx.bezierCurveTo(-8.5, 3.5, -4.5, 7, 0, 10.5);
    ctx.bezierCurveTo(4.5, 7, 8.5, 3.5, 6.5, 1);
    ctx.bezierCurveTo(4, -2, 0, 1.5, 0, 4);
    ctx.closePath();
    ctx.fillStyle = '#e8a7bb';
    ctx.shadowColor = '#e8a7bb';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  }

  function animarCorazones() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    var contador = 0;
    for (var i = 0; i < corazones.length; i++) {
      var c = corazones[i];
      c.y -= c.v;
      c.w += 0.008;
      if (c.y < -30) {
        c.y = window.innerHeight + 20;
        c.x = Math.random() * window.innerWidth;
      }
      if (contador % 3 === 0) dibujaCorazon(c);
      contador++;
    }
    requestAnimationFrame(animarCorazones);
  }

  function initCorazones() {
    if (!canvas || !ctx) return;
    tamanoCanvas();
    var n = Math.min(14, Math.max(7, Math.floor(window.innerWidth / 110)));
    corazones = [];
    for (var i = 0; i < n; i++) corazones.push(crearCorazon(i));
    window.addEventListener('resize', function () {
      tamanoCanvas();
      var nuevo = Math.min(14, Math.max(7, Math.floor(window.innerWidth / 110)));
      while (corazones.length < nuevo) corazones.push(crearCorazon(corazones.length));
      corazones.length = nuevo;
    });
    requestAnimationFrame(animarCorazones);
  }

  renderHero();
  renderRazones();
  renderGaleria();
  initReveal();
  initCorazones();
})();