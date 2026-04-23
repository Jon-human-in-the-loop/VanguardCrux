/**
 * VANGUARD CRUX — World Journey Parallax
 * Cinematic scroll-driven map: plane flies from country to country
 * with a visible flight-path line and proper airplane icon.
 */

(function() {
  'use strict';

  /* ─────────────────────────────────────────
   * CONFIG — stops along the journey
   * x/y are % of the SVG viewBox (0..100)
   * ───────────────────────────────────────── */
  const STOPS = [
    {
      key: 'argentina',
      labelKey: 'journeyArgName',
      flag: '🇦🇷',
      descKey: 'journeyArgDesc',
      x: 34.22, y: 73.83,
      zoom: { cx: 34, cy: 74, scale: 2.5 },
      landId: 'land-argentina',
      sidebarId: 'sidebar-argentina'
    },
    {
      key: 'germany',
      labelKey: 'journeyGerName',
      flag: '🇩🇪',
      descKey: 'journeyGerDesc',
      x: 52.43, y: 18.41,
      zoom: { cx: 52, cy: 30, scale: 2.0 },
      landId: 'land-germany',
      sidebarId: 'sidebar-germany'
    },
    {
      key: 'dubai',
      labelKey: 'journeyDubName',
      flag: '🇦🇪',
      descKey: 'journeyDubDesc',
      x: 64.32, y: 34.38,
      zoom: { cx: 62, cy: 38, scale: 2.0 },
      landId: 'land-uae',
      sidebarId: 'sidebar-dubai'
    },
    {
      key: 'porto',
      labelKey: 'journeyPorName',
      flag: '🇵🇹',
      descKey: 'journeyPorDesc',
      x: 47.88, y: 24.48,
      zoom: { cx: 48, cy: 46, scale: 1.3 },
      landId: 'land-portugal',
      sidebarId: 'sidebar-porto',
      isCurrent: true
    }
  ];

  function getTranslation(key) {
    if (typeof translations !== 'undefined') {
      const savedLang = localStorage.getItem('userLanguage');
      let lang = 'en';
      if (savedLang && (savedLang === 'en' || savedLang === 'pt' || savedLang === 'es')) {
          lang = savedLang;
      } else if (typeof navigator !== 'undefined') {
          const browserLang = navigator.language || navigator.userLanguage;
          if (browserLang.startsWith('pt')) lang = 'pt';
          else if (browserLang.startsWith('es')) lang = 'es';
      }
      return (translations[lang] && translations[lang][key]) || translations['en'][key] || key;
    }
    return key;
  }

  // SVG viewBox dimensions (must match generated SVG)
  const VB_W = 1000;
  const VB_H = 500;

  // Reserve last 15% of scroll for "dwell" at final stop
  const DWELL_FRACTION = 0.15;

  /* ─────────────────────────────────────────
   * Math helpers
   * ───────────────────────────────────────── */
  function lerp(a, b, t) { return a + (b - a) * t; }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  // Quadratic bezier with arc control point
  function bezier(p0, p1, t) {
    const mx = (p0.x + p1.x) / 2 + (p1.y - p0.y) * 0.35;
    const my = (p0.y + p1.y) / 2 - Math.abs(p1.x - p0.x) * 0.25;
    const qx = lerp(lerp(p0.x, mx, t), lerp(mx, p1.x, t), t);
    const qy = lerp(lerp(p0.y, my, t), lerp(my, p1.y, t), t);
    return { x: qx, y: qy };
  }

  // Convert percentage (0-100) to SVG viewBox coordinate
  function pctToSvg(pct, axis) {
    return axis === 'x' ? (pct / 100) * VB_W : (pct / 100) * VB_H;
  }

  // Angle between two points (degrees)
  function angleBetween(a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI);
  }

  /* ─────────────────────────────────────────
   * DOM refs
   * ───────────────────────────────────────── */
  let wrapper, sticky, svgMap, planeEl;
  let activeFlightPathEl;
  let stopEls = [];
  let labelEls = [];
  let infoBox;
  let currentInfoEl;
  let mapWrapper = null;

  // Cached layout values — updated on resize to avoid reflow on every scroll tick
  let cachedMapW = 0, cachedMapH = 0;
  let cachedRenderedW = 0, cachedRenderedH = 0, cachedOffX = 0, cachedOffY = 0;

  function cacheMapLayout() {
    if (!mapWrapper) return;
    cachedMapW = mapWrapper.offsetWidth;
    cachedMapH = mapWrapper.offsetHeight;
    if (!cachedMapW || !cachedMapH) return;
    const mapRatio = 1000 / 500;
    const rectRatio = cachedMapW / cachedMapH;
    if (rectRatio > mapRatio) {
      cachedRenderedH = cachedMapH;
      cachedRenderedW = cachedMapH * mapRatio;
      cachedOffX = (cachedMapW - cachedRenderedW) / 2;
      cachedOffY = 0;
    } else {
      cachedRenderedW = cachedMapW;
      cachedRenderedH = cachedMapW / mapRatio;
      cachedOffX = 0;
      cachedOffY = (cachedMapH - cachedRenderedH) / 2;
    }
  }

  // RAF throttle flag
  let rafPending = false;

  function init() {
    wrapper = document.getElementById('journey-section-wrapper');
    sticky  = document.getElementById('journey-sticky');

    // Inject high-res SVG map from global variable
    mapWrapper = document.getElementById('journey-map-wrapper');
    if (mapWrapper && typeof WORLD_MAP_SVG !== 'undefined') {
      const temp = document.createElement('div');
      temp.innerHTML = WORLD_MAP_SVG;
      const svgElement = temp.querySelector('svg');
      if (svgElement) {
        mapWrapper.insertBefore(svgElement, mapWrapper.firstChild);
      }
    }

    svgMap  = document.getElementById('journey-map-svg');
    planeEl = document.getElementById('journey-plane');
    infoBox = document.getElementById('journey-info-box');
    currentInfoEl = document.getElementById('journey-current-info');

    if (!svgMap) return;

    // ── Build flight path curves and trail inside the SVG
    buildFlightPaths();

    // Position stop markers
    STOPS.forEach(stop => {
      const stopEl = document.getElementById('stop-' + stop.key);
      if (stopEl) {
        stopEl.style.left = stop.x + '%';
        stopEl.style.top = stop.y + '%';
      }
    });

    stopEls  = STOPS.map(s => document.getElementById('stop-' + s.key));
    labelEls = STOPS.map(s => document.getElementById('label-' + s.key));

    if (!wrapper || !planeEl) return;

    cacheMapLayout();
    window.addEventListener('resize', cacheMapLayout, { passive: true });
    window.addEventListener('scroll', scheduleScroll, { passive: true });
    onScroll();
  }

  /* ─────────────────────────────────────────
   * Build SVG flight path curves between stops
   * ───────────────────────────────────────── */
  function buildFlightPaths() {
    const ns = 'http://www.w3.org/2000/svg';
    const group = document.createElementNS(ns, 'g');
    group.setAttribute('class', 'flight-paths-group');

    // Create a single path element that will draw the line from the last stop to the plane
    activeFlightPathEl = document.createElementNS(ns, 'path');
    activeFlightPathEl.setAttribute('class', 'flight-route flight-route--active');
    activeFlightPathEl.setAttribute('id', 'active-flight-route');
    
    group.appendChild(activeFlightPathEl);
    svgMap.appendChild(group);
  }

  /* ─────────────────────────────────────────
   * Scroll driver
   * ───────────────────────────────────────── */
  let lastStopIdx = -1;

  function scheduleScroll() {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        onScroll();
      });
    }
  }

  function onScroll() {
    const rect    = wrapper.getBoundingClientRect();
    const total   = wrapper.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    const rawProgress = Math.max(0, Math.min(1, scrolled / total));

    // ── Map raw progress to animation progress (0..1) with dwell zone
    // First (1 - DWELL_FRACTION) of scroll = animation 0..1
    // Last DWELL_FRACTION of scroll = stay at 1.0 (hold on Porto)
    const animProgress = Math.min(1, rawProgress / (1 - DWELL_FRACTION));

    const segs = STOPS.length - 1;
    const globalSeg = animProgress * segs;           // 0..3
    const segIdx = Math.min(Math.floor(globalSeg), segs - 1);
    const segT   = easeInOut(Math.min(globalSeg - segIdx, 1));

    const fromStop = STOPS[segIdx];
    const toStop   = STOPS[Math.min(segIdx + 1, STOPS.length - 1)];

    // ── Compute zoom early (needed for plane scale compensation)
    const fz = fromStop.zoom;
    const tz = toStop.zoom;
    const zCx    = lerp(fz.cx, tz.cx, segT);
    const zCy    = lerp(fz.cy, tz.cy, segT);
    const zScale = animProgress >= 1 ? tz.scale : lerp(fz.scale, tz.scale, segT);

    // ── Plane position (% of viewBox)
    const fromPct = { x: fromStop.x, y: fromStop.y };
    const toPct   = { x: toStop.x,   y: toStop.y };
    const pos = (animProgress >= 1) ? toPct : bezier(fromPct, toPct, segT);

    // ── Plane angle
    let peekT = segT + 0.02;
    let lookForward = true;
    if (peekT > 1) {
      peekT = segT - 0.02;
      lookForward = false;
    }
    const posPeek = bezier(fromPct, toPct, peekT);
    const screenPos = getMapMappedCoords(pos.x, pos.y);
    const screenPeek = getMapMappedCoords(posPeek.x, posPeek.y);
    const angle = lookForward ? angleBetween(screenPos, screenPeek) : angleBetween(screenPeek, screenPos);

    // ── Apply plane position + counter-scale so it stays the same visual size
    positionElementOnMap(planeEl, pos.x, pos.y);
    planeEl.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

    // ── Update active dashed flight path
    if (!activeFlightPathEl) return;

    if (animProgress >= 1 || segT === 0 || segT === 1) {
      activeFlightPathEl.setAttribute('d', '');
    } else {
      const p0 = { x: pctToSvg(fromStop.x, 'x'), y: pctToSvg(fromStop.y, 'y') };
      const p1 = { x: pctToSvg(toStop.x, 'x'), y: pctToSvg(toStop.y, 'y') };
      const mx = (p0.x + p1.x) / 2 + (p1.y - p0.y) * 0.35;
      const my = (p0.y + p1.y) / 2 - Math.abs(p1.x - p0.x) * 0.25;

      const cX = lerp(p0.x, mx, segT);
      const cY = lerp(p0.y, my, segT);
      const endX = pctToSvg(pos.x, 'x');
      const endY = pctToSvg(pos.y, 'y');

      activeFlightPathEl.setAttribute('d', `M${p0.x},${p0.y} Q${cX},${cY} ${endX},${endY}`);
    }

    // ── Map zoom
    applyMapZoom(
      animProgress >= 1 ? tz.cx : zCx,
      animProgress >= 1 ? tz.cy : zCy,
      zScale
    );

    // ── Reveal stop markers + labels
    const arrivedIdx = (animProgress >= 1)
      ? STOPS.length - 1
      : segIdx + (segT > 0.7 ? 1 : 0);

    STOPS.forEach((stop, i) => {
      const dot = stopEls[i];
      const lbl = labelEls[i];
      if (!dot || !lbl) return;

      // Keep stop markers correctly positioned despite SVG letterboxing
      positionElementOnMap(dot, stop.x, stop.y);

      if (i <= arrivedIdx) {
        dot.classList.add('stop--active');
        if (stop.isCurrent && i <= arrivedIdx) {
          dot.classList.add('stop--current');
        }
      } else {
        dot.classList.remove('stop--active', 'stop--current');
      }
      if (i <= arrivedIdx) {
        lbl.classList.add('stop-label--visible');
      } else {
        lbl.classList.remove('stop-label--visible');
      }
    });

    // ── Sidebar list sync
    const sidebarIds = ['sidebar-argentina','sidebar-germany','sidebar-dubai','sidebar-porto'];
    sidebarIds.forEach((sid, i) => {
      const el = document.getElementById(sid);
      if (!el) return;
      if (i <= arrivedIdx) el.classList.add('is-active');
      else el.classList.remove('is-active');
    });

    // ── Highlight SVG country paths
    const landIds = ['land-argentina','land-germany','land-uae','land-portugal'];
    landIds.forEach((lid, i) => {
      const el = document.getElementById(lid);
      if (!el) return;
      el.classList.remove('land--active','land--current');
      if (i < arrivedIdx) el.classList.add('land--active');
      if (i === arrivedIdx) {
        el.classList.add(i === STOPS.length-1 ? 'land--current' : 'land--active');
      }
      if (i === STOPS.length-1 && arrivedIdx >= STOPS.length-1) {
        el.classList.add('land--current');
      }
    });

    // ── Info box: show current stop data
    const activeStopIdx = (animProgress >= 1)
      ? STOPS.length - 1
      : Math.min(Math.round(animProgress * segs), segs);
    if (activeStopIdx !== lastStopIdx) {
      lastStopIdx = activeStopIdx;
      const s = STOPS[activeStopIdx];
      if (s && infoBox && currentInfoEl) {
        infoBox.classList.add('info-box--exiting');
        setTimeout(() => {
          currentInfoEl.innerHTML = `
            <div class="info-flag">${s.flag}</div>
            <div class="info-label">${getTranslation(s.labelKey)}</div>
            <div class="info-desc">${getTranslation(s.descKey)}</div>
          `;
          infoBox.classList.remove('info-box--exiting');
          infoBox.classList.add('info-box--entering');
          setTimeout(() => infoBox.classList.remove('info-box--entering'), 400);
        }, 200);
      }
    }

    // ── Section progress bar
    const bar = document.getElementById('journey-progress-bar');
    if (bar) bar.style.width = (rawProgress * 100) + '%';
  }

  /* ─────────────────────────────────────────
   * Helpers
   * ───────────────────────────────────────── */
  // Uses cached layout to avoid reflow on every scroll frame
  function getMapMappedCoords(xPct, yPct) {
    if (!cachedMapW || !cachedMapH) return { x: xPct, y: yPct };
    const xPx = cachedOffX + (xPct / 100) * cachedRenderedW;
    const yPx = cachedOffY + (yPct / 100) * cachedRenderedH;
    return {
      x: (xPx / cachedMapW) * 100,
      y: (yPx / cachedMapH) * 100
    };
  }

  function positionElementOnMap(el, xPct, yPct) {
    if (!el) return;
    const mapped = getMapMappedCoords(xPct, yPct);
    el.style.left = mapped.x + '%';
    el.style.top  = mapped.y + '%';
  }

  function applyMapZoom(cx, cy, scale) {
    if (!mapWrapper) return;
    const tw = cachedMapW || window.innerWidth * 0.7;
    const th = cachedMapH || window.innerHeight;
    const tx = (50 - cx) * (scale - 1) * (tw / 100);
    const ty = (50 - cy) * (scale - 1) * (th / 100);
    mapWrapper.style.transform = `scale(${scale}) translate(${tx / scale}px, ${ty / scale}px)`;
    mapWrapper.style.setProperty('--map-zoom', scale);
  }

  /* ─────────────────────────────────────────
   * Bootstrap
   * ───────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
