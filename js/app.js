/* МонголШувуу — үндсэн логик */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const byId = Object.fromEntries(BIRDS.map(b => [b.id, b]));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const latinClean = b => b.latin.replace(/\s*\(.*\)/, "");
  const xcUrl = b => "https://xeno-canto.org/explore?query=" + encodeURIComponent(latinClean(b));

  const IUCN = {
    CR: T("Устах аюул нэн их", "Critically Endangered"), EN: T("Устах аюултай", "Endangered"), VU: T("Эмзэг", "Vulnerable"),
    NT: T("Ховордож болзошгүй", "Near Threatened"), LC: T("Анхаарал багатай", "Least Concern"), NR: T("Тусад нь үнэлээгүй", "Not assessed separately")
  };
  const SWATCH = {
    black: "#1c1c1c", white: "#f4f4f2", gray: "#8f969a", brown: "#6b4a2f",
    buff: "#d8bf8f", rufous: "#c5642a", yellow: "#e8c53a", red: "#c7302a"
  };
  const badge = b => `<span class="badge iucn-${b.iucn}" title="${IUCN[b.iucn]}">${b.iucn} · ${IUCN[b.iucn]}</span>`;

  const setHash = h => { try { history.replaceState(null, "", h); } catch (e) {} };

  /* ---------------- Tabs ---------------- */
  function showTab(name, push = true) {
    if (!document.getElementById("tab-" + name)) name = "home";
    $$(".tab-panel").forEach(p => p.classList.toggle("active", p.id === "tab-" + name));
    $$(".tabs button").forEach(b => b.classList.toggle("active", b.dataset.tab === name));
    if (push) setHash(name === "home" ? location.pathname : "#" + name);
    if (name === "photo") { ensurePhotoQuiz(); preloadModel(); }
    if (name === "sound") ensureSoundQuiz();
    window.scrollTo({ top: 0 });
    setTimeout(() => { if (name === "map") refit(mainMap, MN_BOUNDS); if (name === "routes" && routeBounds) refit(routeMap, routeBounds, [60, 60]); }, 40);
  }
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-tab],[data-goto]");
    if (t) { e.preventDefault(); showTab(t.dataset.tab || t.dataset.goto); }
    const c = e.target.closest("[data-bird]");
    const a = e.target.closest("a");
    if (c && !e.target.closest("audio") && (!a || a === c)) { e.preventDefault(); openBird(c.dataset.bird); }
  });

  /* ---------------- Gallery ---------------- */
  let groupFilter = null;
  function renderChips() {
    const box = $("#group-chips");
    const groups = Object.entries(GROUPS).filter(([k]) => BIRDS.some(b => b.group === k));
    box.innerHTML = `<button class="chip on" data-g="">${T("Бүгд", "All")} (${BIRDS.length})</button>` +
      groups.map(([k, v]) => `<button class="chip" data-g="${k}">${v} (${BIRDS.filter(b => b.group === k).length})</button>`).join("");
    box.addEventListener("click", e => {
      const c = e.target.closest(".chip"); if (!c) return;
      groupFilter = c.dataset.g || null;
      $$(".chip", box).forEach(x => x.classList.toggle("on", x === c));
      renderGallery();
    });
  }
  function card(b) {
    return `<button class="card" data-bird="${b.id}">
      <div class="thumb"><img loading="lazy" src="${b.image.file}" alt="${esc(b.name)}">${badge(b)}${b.audio ? '<span class="snd">🔊</span>' : ""}</div>
      <div class="body"><h3>${esc(b.name)}</h3><div class="latin">${esc(b.latin)} · ${esc(b.en)}</div><p class="sum">${esc(b.summary)}</p></div>
    </button>`;
  }
  function renderGallery() {
    const q = $("#search").value.trim().toLowerCase();
    const list = BIRDS.filter(b => (!groupFilter || b.group === groupFilter) &&
      (!q || [b.name, b.altNames, b.latin, b.en].join(" ").toLowerCase().includes(q)));
    $("#gallery").innerHTML = list.length ? list.map(card).join("") : `<p class="muted">${T("Илэрц олдсонгүй.", "No matches.")}</p>`;
  }
  $("#search").addEventListener("input", renderGallery);

  /* ---------------- Map ---------------- */
  // Монгол Улсын хил (Natural Earth, нийтийн өмч)
  const BORDER = [[87.75,49.30],[88.81,49.47],[90.71,50.33],[92.23,50.80],[93.10,50.50],[94.15,50.48],[94.82,50.01],[95.81,49.98],[97.26,49.73],[98.23,50.42],[97.83,51.01],[98.86,52.05],[99.98,51.63],[100.89,51.52],[102.07,51.26],[102.26,50.51],[103.68,50.09],[104.62,50.28],[105.89,50.41],[106.89,50.27],[107.87,49.79],[108.48,49.28],[109.40,49.29],[110.66,49.13],[111.58,49.38],[112.90,49.54],[114.36,50.25],[114.96,50.14],[115.49,49.81],[116.68,49.89],[116.19,49.13],[115.49,48.14],[115.74,47.73],[116.31,47.85],[117.30,47.70],[118.06,48.07],[118.87,47.75],[119.77,47.05],[119.66,46.69],[118.87,46.81],[117.42,46.67],[116.72,46.39],[115.99,45.73],[114.46,45.34],[113.46,44.81],[112.44,45.01],[111.87,45.10],[111.35,44.46],[111.67,44.07],[111.83,43.74],[111.13,43.41],[110.41,42.87],[109.24,42.52],[107.74,42.48],[106.13,42.13],[104.96,41.60],[104.52,41.91],[103.31,41.91],[101.83,42.51],[100.85,42.66],[99.52,42.52],[97.45,42.75],[96.35,42.73],[95.76,43.32],[95.31,44.24],[94.69,44.35],[93.48,44.98],[92.13,45.12],[90.95,45.29],[90.59,45.72],[90.97,46.89],[90.28,47.69],[88.85,48.07],[88.01,48.60]];
  // бүс нутгийн тэгш өнцөгтүүд [lon1, lon2, lat1, lat2]
  const REGION_RECTS = {
    west: [[86, 96.5, 40, 53]],
    khangai: [[96.5, 104, 46, 53]],
    north: [[104, 110.5, 47.5, 53]],
    central: [[104, 110.5, 46, 47.5]],
    east: [[110.5, 121, 45, 53]],
    gobi: [[96.5, 110.5, 40, 46], [110.5, 121, 40, 45]]
  };
  const REGION_LABEL = { west: [91.8, 48.2], khangai: [100.3, 48.9], north: [108.2, 48.9], central: [107.2, 46.75], east: [114.8, 47.2], gobi: [103.5, 44.2] };
  const px = lon => (lon - 87.3) * 26.5 + 10;
  const py = lat => (52.4 - lat) * 38 + 10;
  const borderPath = "M" + BORDER.map(([a, b]) => px(a).toFixed(1) + "," + py(b).toFixed(1)).join("L") + "Z";
  let mapUid = 0;

  function mapSVG({ regionsOn = [], hotspotsOn = null, labels = true, hsLabels = "on" }) {
    const id = "clip" + (++mapUid);
    const rects = Object.entries(REGION_RECTS).map(([k, rs]) =>
      rs.map(([a, b, c, d]) => `<rect class="region${regionsOn.includes(k) ? " on" : ""}" data-region="${k}" x="${px(a)}" y="${py(d)}" width="${px(b) - px(a)}" height="${py(c) - py(d)}"><title>${REGIONS[k].name}</title></rect>`).join("")).join("");
    const lbl = labels ? Object.entries(REGION_LABEL).map(([k, [lo, la]]) => `<text class="rlabel" x="${px(lo)}" y="${py(la)}">${REGIONS[k].name}</text>`).join("") : "";
    const hsKeys = hotspotsOn === null ? Object.keys(HOTSPOTS) : hotspotsOn;
    const hs = hsKeys.map((k, i) => {
      const h = HOTSPOTS[k], x = px(h.lon), y = py(h.lat);
      const left = hsLabels === "all" && (i % 2 === 1 || x > 780);
      return `<g class="hs${hotspotsOn && hsLabels === "all" ? " on" : ""}" data-hs="${k}"><circle cx="${x}" cy="${y}" r="6"/><title>${esc(h.name)}</title><text x="${left ? x - 10 : x + 10}" y="${y + 4}" text-anchor="${left ? "end" : "start"}">${esc(h.name)}</text></g>`;
    }).join("");
    return `<defs><clipPath id="${id}"><path d="${borderPath}"/></clipPath></defs>
      <g clip-path="url(#${id})">${rects}</g><path class="border" d="${borderPath}"/>${lbl}${hs}`;
  }

  /* ---------------- Хиймэл дагуулын газрын зураг (Leaflet) ---------------- */
  const HAS_L = typeof L !== "undefined";
  const LL = ([lon, lat]) => [lat, lon];
  const MN_BOUNDS = [[41.4, 87.6], [52.2, 120]];
  const EMBED = window.MBIRD_TILES || null;
  const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  // Sutherland–Hodgman: хилийн олон өнцөгтийг бүсийн тэгш өнцөгтөөр тайрах
  function clipPoly(poly, [x0, x1, y0, y1]) {
    const lerp = (a, b, t) => [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
    const edges = [
      [p => p[0] >= x0, (a, b) => lerp(a, b, (x0 - a[0]) / (b[0] - a[0]))],
      [p => p[0] <= x1, (a, b) => lerp(a, b, (x1 - a[0]) / (b[0] - a[0]))],
      [p => p[1] >= y0, (a, b) => lerp(a, b, (y0 - a[1]) / (b[1] - a[1]))],
      [p => p[1] <= y1, (a, b) => lerp(a, b, (y1 - a[1]) / (b[1] - a[1]))]
    ];
    let out = poly;
    for (const [inside, cut] of edges) {
      const inp = out; out = [];
      for (let i = 0; i < inp.length; i++) {
        const cur = inp[i], prev = inp[(i + inp.length - 1) % inp.length];
        if (inside(cur)) { if (!inside(prev)) out.push(cut(prev, cur)); out.push(cur); }
        else if (inside(prev)) out.push(cut(prev, cur));
      }
      if (!out.length) break;
    }
    return out;
  }
  const REGION_POLYS = Object.fromEntries(Object.entries(REGION_RECTS).map(([k, rs]) =>
    [k, rs.map(r => clipPoly(BORDER, r).map(LL)).filter(p => p.length > 2)]));
  const regionStyle = on => ({ color: on ? "#8fe3ff" : "#ffffff", weight: on ? 2.5 : 1, opacity: on ? 1 : .45, fillColor: on ? "#8fe3ff" : "#ffffff", fillOpacity: on ? .25 : .03 });
  const hsStyle = (on, dim) => ({ radius: on ? 10 : 7, color: "#ffffff", weight: 2, fillColor: on ? "#ff5a3c" : "#ffb347", fillOpacity: dim ? .35 : 1, opacity: dim ? .45 : 1 });

  function satMap(el, opts = {}) {
    const map = L.map(el, { zoomSnap: 0.5, maxBounds: [[33, 70], [60, 138]], maxBoundsViscosity: 0.7, ...opts });
    if (EMBED) {
      const Embedded = L.TileLayer.extend({ getTileUrl: c => EMBED[c.z + "/" + c.y + "/" + c.x] || BLANK });
      new Embedded("", { minZoom: 3, maxNativeZoom: 7, maxZoom: 9, attribution: T("Хиймэл дагуулын зураг: NASA Blue Marble (GIBS)", "Satellite imagery: NASA Blue Marble (GIBS)") }).addTo(map);
      map.setMinZoom(4); map.setMaxZoom(9);
    } else {
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 18, attribution: T("Хиймэл дагуулын зураг © Esri, Maxar, Earthstar Geographics", "Imagery © Esri, Maxar, Earthstar Geographics") }).addTo(map);
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 18, opacity: 0.85 }).addTo(map);
      map.setMinZoom(4);
    }
    L.polygon(BORDER.map(LL), { color: "#ffe08a", weight: 2, opacity: .9, fill: false, dashArray: "6 5", interactive: false }).addTo(map);
    map.fitBounds(MN_BOUNDS);
    return map;
  }
  const refit = (map, bounds, pad) => { if (!map) return; map.invalidateSize(); if (map.getSize().x > 0) map.fitBounds(bounds, { padding: pad || [10, 10] }); };

  let mainMap = null; const regionLayers = {}, hsLayers = {};
  const layerGroups = {}, placeMarkers = {};
  const gmaps = q => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
  const placeLink = pl => gmaps(pl.q || (pl.lat + "," + pl.lon));
  const distKm = (a, b) => { const r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2; return 2 * 6371 * Math.asin(Math.sqrt(h)); };
  function placePopup(pl) {
    const k = PLACE_KINDS[pl.kind];
    return `<div class="pop"><small style="color:${k.color}">${k.icon} ${k.name} · ${esc(pl.aimag)}</small><b>${esc(pl.name)}</b><p>${esc(pl.desc)}</p>` +
      (pl.types ? `<div class="tagrow">${pl.types.map(x => `<span class="tag">${LODGING_TYPES[x]}</span>`).join("")}</div>` : "") +
      `<a href="${placeLink(pl)}" target="_blank" rel="noopener">${pl.kind === "lodging" ? T("Google Maps-д буудал хайх ↗", "Find lodging on Google Maps ↗") : T("Google Maps-д харах ↗", "View on Google Maps ↗")}</a></div>`;
  }
  const placeIcon = pl => L.divIcon({ className: "pin pin-" + pl.kind, html: PLACE_KINDS[pl.kind].icon, iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -12] });
  function showPlaceOnMap(id) {
    const pl = PLACES.find(x => x.id === id); if (!pl || !mainMap) return;
    if (!$("#modal").hidden) closeModal();
    showTab("map");
    const chip = $(`#layer-chips .chip[data-layer="${pl.kind}"]`); if (chip && !chip.classList.contains("on")) chip.click();
    setTimeout(() => { mainMap.invalidateSize(); mainMap.setView([pl.lat, pl.lon], EMBED ? 8 : 12); placeMarkers[id].openPopup(); }, 120);
  }
  document.addEventListener("click", e => { const b = e.target.closest("[data-showplace]"); if (b) { e.preventDefault(); showPlaceOnMap(b.dataset.showplace); } });
  function initMainSat() {
    $("#mn-map").closest(".map-scroll").hidden = true;
    $("#mn-map-sat").hidden = false;
    mainMap = satMap($("#mn-map-sat"));
    for (const [k, polys] of Object.entries(REGION_POLYS)) {
      regionLayers[k] = L.polygon(polys, regionStyle(false)).addTo(mainMap)
        .bindTooltip(REGIONS[k].name, { sticky: true })
        .on("click", () => { selHotspot = null; selRegion = selRegion === k ? null : k; renderMainMap(); renderMapResults(); });
      L.marker(LL(REGION_LABEL[k]), { interactive: false, icon: L.divIcon({ className: "rlabel-sat", html: `<span>${REGIONS[k].name}</span>`, iconSize: null }) }).addTo(mainMap);
    }
    layerGroups.birds = L.layerGroup().addTo(mainMap);
    for (const kind of Object.keys(PLACE_KINDS)) layerGroups[kind] = L.layerGroup().addTo(mainMap);
    for (const pl of PLACES) placeMarkers[pl.id] = L.marker([pl.lat, pl.lon], { icon: placeIcon(pl), title: pl.name }).bindPopup(placePopup(pl), { maxWidth: 290 }).addTo(layerGroups[pl.kind]);
    for (const [k, h] of Object.entries(HOTSPOTS)) {
      hsLayers[k] = L.circleMarker([h.lat, h.lon], hsStyle(false, false)).addTo(layerGroups.birds)
        .bindTooltip(h.name, { direction: "top", offset: [0, -8], className: "hs-tip" })
        .on("click", e => { L.DomEvent.stopPropagation(e); selHotspot = selHotspot === k ? null : k; renderMainMap(); renderMapResults(); });
    }
  }
  function updateMainSat() {
    for (const [k, l] of Object.entries(regionLayers)) l.setStyle(regionStyle(k === selRegion));
    for (const [k, l] of Object.entries(hsLayers)) {
      const dim = !!selRegion && !selHotspot && !birdsFiltered().some(b => b.regions.includes(selRegion) && b.hotspots.includes(k));
      l.setStyle(hsStyle(k === selHotspot, dim));
      if (k === selHotspot) { l.bringToFront(); l.openTooltip(); }
    }
  }

  let seasonFilter = "all", selRegion = null, selHotspot = null;
  function renderMainMap() {
    if (mainMap) return updateMainSat();
    const svg = $("#mn-map");
    svg.innerHTML = mapSVG({ regionsOn: selRegion ? [selRegion] : [] });
    $$(".hs", svg).forEach(g => {
      g.classList.toggle("on", g.dataset.hs === selHotspot);
      if (selRegion && !selHotspot) {
        const any = birdsFiltered().some(b => b.regions.includes(selRegion) && b.hotspots.includes(g.dataset.hs));
        g.classList.toggle("dim", !any);
      }
    });
    $$("#mn-map .hs text").forEach(t => t.style.display = "none");
    const on = $("#mn-map .hs.on text"); if (on) on.style.display = "";
    $$("#mn-map .hs").forEach(g => {
      g.addEventListener("mouseenter", () => { $("text", g).style.display = ""; });
      g.addEventListener("mouseleave", () => { if (!g.classList.contains("on")) $("text", g).style.display = "none"; });
    });
  }
  function birdsFiltered() {
    return BIRDS.filter(b => seasonFilter === "all" || b.season.includes(seasonFilter) || (seasonFilter === "summer" && b.season.includes("resident")));
  }
  function renderMapResults() {
    let list = birdsFiltered(), head;
    if (selHotspot) {
      const h = HOTSPOTS[selHotspot];
      list = list.filter(b => b.hotspots.includes(selHotspot));
      head = `<h3>📍 ${esc(h.name)}</h3><p class="muted">${T(`Энэ газар ажиглахад тохиромжтой ${list.length} шувуу.`, `${list.length} birds to look for here.`)}</p>`;
    } else if (selRegion) {
      list = list.filter(b => b.regions.includes(selRegion));
      head = `<h3>${REGIONS[selRegion].name}</h3><p class="muted">${REGIONS[selRegion].desc}. ${T(`Энэ бүсэд ${list.length} шувуу тохиолдоно.`, `${list.length} birds occur in this region.`)}</p>`;
    } else {
      head = `<p class="muted">${T(`Газрын зураг дээр бүс эсвэл 📍 цэг сонгоно уу. Одоогоор ${list.length} шувуу харагдаж байна.`, `Pick a region or a 📍 site on the map. Showing ${list.length} birds.`)}</p>`;
    }
    $("#map-info").innerHTML = head;
    $("#map-results").innerHTML = list.map(card).join("") || `<p class="muted">${T("Тохирох шувуу алга.", "No matching birds.")}</p>`;
  }
  function initMap() {
    const seasons = { all: T("Бүх улирал", "All seasons"), summer: T("Зун", "Summer"), resident: T("Жилийн турш", "Year-round"), passage: T("Нүүдлийн үе", "Migration"), winter: T("Өвөл", "Winter") };
    $("#season-chips").innerHTML = Object.entries(seasons).map(([k, v]) => `<button class="chip${k === "all" ? " on" : ""}" data-s="${k}">${v}</button>`).join("");
    $("#season-chips").addEventListener("click", e => {
      const c = e.target.closest(".chip"); if (!c) return;
      seasonFilter = c.dataset.s;
      $$("#season-chips .chip").forEach(x => x.classList.toggle("on", x === c));
      renderMainMap(); renderMapResults();
    });
    $("#map-legend").innerHTML = HAS_L
      ? `<span><i style="background:#8fe3ff"></i>${T("Сонгосон бүс", "Selected region")}</span><span><i style="background:#ffb347"></i>${T("Шувуу ажиглах газар", "Birdwatching site")}</span><span>${T("Хулганы дугуй, +/− товч эсвэл хоёр хуруугаар томруулж, чирж хөдөлгөнө. Шар тасархай шугам нь улсын хил.", "Zoom with the mouse wheel, the +/− buttons or two fingers; drag to pan. The dashed yellow line is the national border.")}</span>`
      : `<span><i style="background:var(--region-hi)"></i>${T("Сонгосон бүс", "Selected region")}</span><span><i style="background:var(--earth)"></i>${T("Шувуу ажиглах газар", "Birdwatching site")}</span><span>${T("Схем зураг — хил ойролцоо", "Schematic map — border approximate")}</span>`;
    if (HAS_L) {
      initMainSat();
      const L_OPTS = { birds: T("🐦 Шувуу ажиглах газар", "🐦 Birdwatching sites"), lodging: T("🛏 Буудал, бааз", "🛏 Lodging"), culture: T("🏛 Түүх, соёл", "🏛 History & culture"), nature: T("⛰ Байгаль", "⛰ Nature") };
      $("#layer-chips").innerHTML = Object.entries(L_OPTS).map(([k, v]) => `<button class="chip on" data-layer="${k}" aria-pressed="true">${v}</button>`).join("");
      $("#layer-chips").addEventListener("click", e => {
        const c = e.target.closest(".chip"); if (!c) return;
        const on = !c.classList.contains("on"); c.classList.toggle("on", on); c.setAttribute("aria-pressed", String(on));
        if (on) mainMap.addLayer(layerGroups[c.dataset.layer]); else mainMap.removeLayer(layerGroups[c.dataset.layer]);
      });
    } else $(".layer-row").hidden = true;
    $("#mn-map").addEventListener("click", e => {
      const hs = e.target.closest(".hs"), rg = e.target.closest(".region");
      if (hs) { selHotspot = selHotspot === hs.dataset.hs ? null : hs.dataset.hs; }
      else if (rg) { selHotspot = null; selRegion = selRegion === rg.dataset.region ? null : rg.dataset.region; }
      renderMainMap(); renderMapResults();
    });
    renderMainMap(); renderMapResults();
  }

  /* ---------------- Нарийвчилсан тархац (GBIF ажиглалтын тор) ---------------- */
  const HAS_RANGES = typeof RANGES !== "undefined";
  const RANGE_FILL = "#eb6834";
  // Ажиглалтын тоог 4 ангилалд хуваана (нэг өнгө, тод байдлаар)
  const RANGE_BINS = [{ max: 1, op: .32, lbl: "1" }, { max: 4, op: .52, lbl: "2–4" }, { max: 19, op: .72, lbl: "5–19" }, { max: Infinity, op: .92, lbl: "20+" }];
  const rangeBin = n => RANGE_BINS.findIndex(x => n <= x.max);
  function rangeCells(b) {
    const r = HAS_RANGES && RANGES[b.id]; if (!r) return [];
    const out = [];
    for (let i = 0; i < r.c.length; i += 3) out.push([RANGE_GRID.lon0 + r.c[i] * RANGE_GRID.step, RANGE_GRID.lat0 + r.c[i + 1] * RANGE_GRID.step, r.c[i + 2]]);
    return out;
  }
  const cellLabel = (lat, lon) => `${lat.toFixed(1)}–${(lat + RANGE_GRID.step).toFixed(1)}°N, ${lon.toFixed(1)}–${(lon + RANGE_GRID.step).toFixed(1)}°E`;
  const MONTHS = T(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]);
  const MONTH_NAMES = T(["1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"],
    ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
  function monthsChart(m) {
    const total = m.reduce((a, x) => a + x, 0); if (!total) return "";
    const max = Math.max(...m), top = m.indexOf(max);
    const desc = m.map((v, i) => `${MONTH_NAMES[i]}: ${v}`).join(", ");
    return `<figure class="months-fig">
      <figcaption>${T("Аль саруудад ажиглагддаг вэ", "When it is recorded")} <span class="muted">(${T("сар бүрийн бүртгэлийн тоо", "records per month")})</span></figcaption>
      <div class="months" role="img" aria-label="${esc(desc)}">
        ${m.map((v, i) => `<div class="mcol" tabindex="0" data-tip="${esc(MONTH_NAMES[i])}: ${v} ${T("бүртгэл", v === 1 ? "record" : "records")}">
          <div class="mtrack"><i style="height:${v ? Math.max(3, Math.round(v / max * 100)) : 0}%">${i === top ? `<span class="mval">${v.toLocaleString()}</span>` : ""}</i></div><span class="mlbl">${MONTHS[i]}</span></div>`).join("")}
      </div>
      ${LANG === "en" ? "" : `<div class="mcap muted">${T("сар", "")}</div>`}
    </figure>`;
  }
  function rangeLegend(hasCells) {
    return `<div class="range-legend">
      ${hasCells ? `<span class="rl-title">${T("Ажиглалтын тоо (≈ 40 × 55 км нүд)", "Records per cell (≈ 40 × 55 km)")}:</span>
      ${RANGE_BINS.map(x => `<span class="rl-item"><i style="background:${RANGE_FILL};opacity:${x.op}"></i>${x.lbl}</span>`).join("")}` : ""}
      <span class="rl-item"><i class="rl-region"></i>${T("Ерөнхий тархацын бүс", "General range region")}</span>
      <span class="rl-item"><i class="rl-hs"></i>${T("Ажиглахад тохиромжтой газар", "Good viewing site")}</span>
    </div>`;
  }
  function rangeSection(b) {
    const r = HAS_RANGES ? RANGES[b.id] : null, cells = rangeCells(b);
    const svgCells = cells.map(([lon, lat, n]) => `<rect class="rcell" x="${px(lon)}" y="${py(lat + RANGE_GRID.step)}" width="${px(lon + RANGE_GRID.step) - px(lon)}" height="${py(lat) - py(lat + RANGE_GRID.step)}" style="fill:${RANGE_FILL};fill-opacity:${RANGE_BINS[rangeBin(n)].op}"><title>${cellLabel(lat, lon)}: ${n}</title></rect>`).join("");
    const map = HAS_L ? `<div id="bird-sat" class="sat-map sat-range" aria-label="${T("Тархацын газрын зураг", "Range map")}"></div>`
      : `<svg class="mini-map" viewBox="0 0 900 450">${mapSVG({ regionsOn: b.regions, hotspotsOn: b.hotspots, labels: false, hsLabels: "all" })}${svgCells}</svg>`;
    let stats;
    if (!r) stats = "";
    else if (!r.n) stats = `<p class="range-stats">${T("GBIF-д Монголоос бүртгэгдсэн ажиглалт алга — энэ зүйл Монголд тархдаггүй.", "GBIF holds no records from Mongolia — this species does not occur here.")}</p>`;
    else stats = `<p class="range-stats"><b>${r.n.toLocaleString()}</b> ${T("ажиглалтын бүртгэл", "records")} · <b>${cells.length}</b> ${T("нүдэнд", "grid cells")} · ${r.y[0]}–${r.y[1]} ${T("он", "")}${r.u < r.n ? ` · ${T(`газрын зурагт ${r.u.toLocaleString()} бүртгэлээр`, `map uses ${r.u.toLocaleString()} of them`)}` : ""}</p>`;
    return `<section class="range-sec"><h3>${T("Монгол дахь тархац", "Distribution in Mongolia")}</h3>
      <p>${esc(b.distribution)}</p>
      ${map}
      ${rangeLegend(cells.length > 0)}
      ${stats}
      ${r && r.n ? monthsChart(r.m) : ""}
      <div class="tagrow">${b.regions.map(k => `<span class="tag">${REGIONS[k].name}</span>`).join("")}</div>
      ${r && r.n ? `<p class="note">${T("Нүднүүд нь GBIF-д бүртгэгдсэн хүний ажиглалт, музейн сорьцыг харуулна. Ажиглагч олон очдог газар (Улаанбаатар орчим, аяллын зам) илүү олон бүртгэлтэй байдаг тул өнгө нь шувууны тоо биш, ажиглалтын тоог илтгэнэ. Хоосон нүд нь \"байхгүй\" гэсэн үг биш.", "Cells show human observations and museum specimens held by GBIF. Well-visited places (around Ulaanbaatar, tour routes) have more records, so shading reflects observation effort, not bird numbers. An empty cell does not mean absence.")}
        ${T("Эх сурвалж", "Source")}: <a href="https://www.gbif.org/species/${r.k}" target="_blank" rel="noopener">GBIF.org</a> (${RANGE_GRID.date}).</p>` : ""}
    </section>`;
  }

  /* ---------------- Detail modal ---------------- */
  function openBird(id, push = true) {
    const b = byId[id]; if (!b) return;
    const list = arr => `<ul>${arr.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
    const sec = (t, body) => `<section><h3>${t}</h3>${body}</section>`;
    const p = t => `<p>${esc(t)}</p>`;
    const voiceTags = b.voiceTypes.map(v => `<span class="tag">${VOICE_TYPES[v].name}</span>`).join("");
    $("#modal-body").innerHTML = `
      <div class="m-hero"><img src="${b.image.file}" alt="${esc(b.name)}" onload="if(this.naturalHeight>this.naturalWidth*0.8)this.classList.add('portrait')"><a class="credit" href="${b.image.source}" target="_blank" rel="noopener">📷 ${esc(b.image.credit)} · ${esc(b.image.via || "Wikimedia Commons")}</a></div>
      <div class="m-head">
        ${badge(b)}
        <h2 id="m-title">${esc(b.name)}</h2>
        <div class="sub"><i>${esc(b.latin)}</i> · ${esc(b.en)}${b.altNames ? T(" · Бусад нэр: ", " · Also: ") + esc(b.altNames) : ""}</div>
      </div>
      <div class="m-stats">
        <div class="stat"><small>${T("Биеийн урт", "Length")}</small><b>${b.length}</b></div>
        <div class="stat"><small>${T("Далавчны дэлгэц", "Wingspan")}</small><b>${b.wingspan}</b></div>
        <div class="stat"><small>${T("Жин", "Weight")}</small><b>${b.weight}</b></div>
        <div class="stat"><small>${T("Улирал", "Season")}</small><b>${b.season.map(s => SEASON_NAMES[s]).join(", ")}</b></div>
        <div class="stat"><small>${T("Үзэх хамгийн сайн үе", "Best time to see")}</small><b>${esc(b.bestTime)}</b></div>
      </div>
      <div class="m-body">
        <div>
          ${sec(T("Ерөнхий танилцуулга", "Overview"), p(b.description))}
          ${sec(T("Таних гол шинж тэмдэг", "Key field marks"), list(b.features))}
          ${sec(T("Төстэй зүйлээс ялгах нь", "Similar species"), p(b.similar))}
          ${sec(T("Амьдрах орчин", "Habitat"), p(b.habitatText))}
          ${rangeSection(b)}
          ${sec(T("Нүүдэл ба улирал", "Migration & seasons"), p(b.migration))}
          ${sec(T("Хоол тэжээл", "Diet"), p(b.food))}
          ${sec(T("Үржил", "Breeding"), p(b.breeding))}
          ${sec(T("Зан төлөв", "Behaviour"), p(b.behavior))}
          ${sec(T("Соёл, уламжлал", "Culture & tradition"), p(b.culture))}
          ${sec(T("Хамгаалал, аюул занал", "Conservation & threats"), p(b.conservation))}
        </div>
        <aside>
          <div class="side-box">
            <h3>🔊 ${T("Дуу хоолой", "Voice")}</h3>
            <div class="tagrow">${voiceTags}</div>
            <p style="margin-top:8px">${esc(b.voice)}</p>
            ${b.audio ? `<audio controls preload="none" src="${b.audio.file}"></audio><div class="xc-link muted">${T("Бичлэг", "Recording")}: <a href="${b.audio.source}" target="_blank" rel="noopener">Wikimedia Commons / xeno-canto</a></div>`
                      : `<p class="xc-link muted">${T("Энэ хөтөчид бичлэг ороогүй.", "No recording in this guide.")} <a href="${xcUrl(b)}" target="_blank" rel="noopener">${T("xeno-canto дээр сонсох ↗", "Listen on xeno-canto ↗")}</a></p>`}
          </div>
          <div class="side-box">
            <h3>📍 ${T("Хаана, хэзээ үзэх вэ", "Where & when to see")}</h3>
            <p>${esc(b.watching)}</p>
            ${(() => { const rs = ROUTES.filter(r => r.birds.includes(b.id)); return rs.length ? `<p style="margin-top:8px"><b>${T("Аяллын маршрут", "Birding routes")}:</b></p><div class="tagrow">${rs.map(r => `<a href="#route-${r.id}" class="tag route-link" data-goroute="${r.id}">🧭 ${esc(r.name)}</a>`).join("")}</div>` : ""; })()}
          </div>
          <div class="side-box status-box">
            <h3>${T("Хамгааллын статус", "Conservation status")}</h3>
            <p>${esc(b.statusText)}</p>
          </div>
          <div class="side-box">
            <h3>${T("Ангилал зүй", "Taxonomy")}</h3>
            <p><b>${T("Баг", "Order")}:</b> ${esc(b.order)}<br><b>${T("Овог", "Family")}:</b> ${esc(b.family)}<br><b>${T("Латин нэр", "Scientific name")}:</b> <i>${esc(b.latin)}</i></p>
          </div>
          <div class="side-box">
            <h3>${T("Сонирхолтой баримт", "Did you know?")}</h3>
            <ul class="facts">${b.facts.map(f => `<li>${esc(f)}</li>`).join("")}</ul>
          </div>
        </aside>
      </div>`;
    $("#modal").hidden = false;
    document.body.style.overflow = "hidden";
    $("#modal").scrollTop = 0;
    if (push) setHash("#bird-" + id);
    if (birdMap) { birdMap.remove(); birdMap = null; }
    if (HAS_L) {
      birdMap = satMap($("#bird-sat"), { scrollWheelZoom: false });
      const cells = rangeCells(b);
      b.regions.forEach(k => L.polygon(REGION_POLYS[k], cells.length ? { color: "#8fe3ff", weight: 1.5, opacity: .8, dashArray: "4 4", fillColor: "#8fe3ff", fillOpacity: .07, interactive: false } : regionStyle(true)).addTo(birdMap));
      cells.forEach(([lon, lat, n]) => L.rectangle([[lat, lon], [lat + RANGE_GRID.step, lon + RANGE_GRID.step]],
        { color: "#ffffff", weight: .6, opacity: .7, fillColor: RANGE_FILL, fillOpacity: RANGE_BINS[rangeBin(n)].op })
        .bindTooltip(`${cellLabel(lat, lon)} · <b>${n}</b> ${T("бүртгэл", n === 1 ? "record" : "records")}`, { className: "hs-tip", sticky: true }).addTo(birdMap));
      b.hotspots.forEach(k => L.circleMarker([HOTSPOTS[k].lat, HOTSPOTS[k].lon], { ...hsStyle(true, false), radius: 7 }).addTo(birdMap)
        .bindTooltip(HOTSPOTS[k].name, { direction: "top", offset: [0, -6], className: "hs-tip" }));
      setTimeout(() => refit(birdMap, MN_BOUNDS), 60);
    }
  }
  let birdMap = null;
  function closeModal() {
    if (birdMap) { birdMap.remove(); birdMap = null; }
    $$("#modal audio").forEach(a => a.pause());
    $("#modal").hidden = true;
    document.body.style.overflow = "";
    const active = $(".tab-panel.active").id.replace("tab-", "");
    setHash(active === "home" ? location.pathname : "#" + active);
  }
  $("#modal").addEventListener("click", e => { if (e.target.closest("[data-close]")) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#modal").hidden) closeModal(); });

  /* ---------------- Traits ---------------- */
  const SIZE_ORDER = ["small", "medium", "large", "xlarge"];
  const OBS_SEASON = { spring: T("Хавар (3–5 сар)", "Spring (Mar–May)"), summer: T("Зун (6–8 сар)", "Summer (Jun–Aug)"), autumn: T("Намар (9–11 сар)", "Autumn (Sep–Nov)"), winter: T("Өвөл (12–2 сар)", "Winter (Dec–Feb)") };
  const REGION_OPTS = Object.fromEntries(Object.entries(REGIONS).map(([k, v]) => [k, v.name]));
  const TRAITS = [
    { key: "group", label: T("Ерөнхий төрх, бүлэг", "General type"), type: "radio", options: GROUPS, w: 3 },
    { key: "size", label: T("Хэмжээ", "Size"), type: "radio", options: SIZE_NAMES, w: 2 },
    { key: "colors", label: T("Гол өнгө (хэд хэдийг сонгож болно)", "Main colours (pick several)"), type: "check", options: COLOR_NAMES, w: 2, swatch: true },
    { key: "beak", label: T("Хушууны хэлбэр", "Bill shape"), type: "radio", options: BEAK_NAMES, w: 2 },
    { key: "habitat", label: T("Хаана харсан бэ?", "Where did you see it?"), type: "check", options: HABITAT_NAMES, w: 1.5 },
    { key: "behavior", label: T("Юу хийж байсан бэ?", "What was it doing?"), type: "check", options: BEHAVIOR_NAMES, w: 1 },
    { key: "season", label: T("Хэзээ харсан бэ?", "When did you see it?"), type: "radio", options: OBS_SEASON, w: 1 },
    { key: "region", label: T("Аль бүс нутагт?", "Which region?"), type: "radio", options: REGION_OPTS, w: 1.5 }
  ];
  function traitScore(b, sel) {
    let got = 0, tot = 0; const why = [];
    for (const t of TRAITS) {
      const v = sel[t.key]; if (!v || (Array.isArray(v) && !v.length)) continue;
      let s = 0;
      switch (t.key) {
        case "group": s = b.group === v ? 1 : 0; if (s) why.push(GROUPS[v]); break;
        case "size": { const d = Math.abs(SIZE_ORDER.indexOf(b.sizeClass) - SIZE_ORDER.indexOf(v)); s = d === 0 ? 1 : d === 1 ? 0.35 : 0; if (d === 0) why.push(T("хэмжээ", "size")); break; }
        case "colors": { s = v.reduce((a, c) => a + ((b.colors[c] || 0) >= 0.1 ? 1 : (b.colors[c] || 0) >= 0.05 ? 0.5 : 0), 0) / v.length; if (s > 0.5) why.push(T("өнгө", "colour")); break; }
        case "beak": s = b.beak === v ? 1 : 0; if (s) why.push(T("хушуу", "bill")); break;
        case "habitat": s = v.filter(h => b.habitats.includes(h)).length / v.length; if (s > 0) why.push(T("орчин", "habitat")); break;
        case "behavior": {
          s = v.filter(x => x === "night" ? b.active === "night" : b.behaviors.includes(x)).length / v.length;
          if (v.includes("night") && b.active !== "night") s *= 0.3;
          if (s > 0) why.push(T("зан төлөв", "behaviour")); break;
        }
        case "season": {
          const res = b.season.includes("resident"), sum = b.season.includes("summer"), pas = b.season.includes("passage"), win = b.season.includes("winter");
          s = res ? 1 : v === "winter" ? (win ? 1 : 0) : v === "summer" ? (sum ? 1 : 0.1) : (sum || pas ? 1 : win ? 0.3 : 0);
          if (s >= 1) why.push(T("улирал", "season")); break;
        }
        case "region": s = b.regions.includes(v) ? 1 : 0; if (s) why.push(T("тархац", "range")); break;
      }
      got += s * t.w; tot += t.w;
    }
    return { score: tot ? got / tot : 1, why, any: tot > 0 };
  }
  function initTraits() {
    const form = $("#trait-form");
    form.innerHTML = TRAITS.map(t => `<fieldset><legend>${t.label}</legend><div class="chips">${
      Object.entries(t.options).map(([k, v]) => `<button type="button" class="chip" data-k="${t.key}" data-v="${k}">${t.swatch ? `<span class="swatch" style="background:${SWATCH[k]}"></span>` : ""}${esc(v)}</button>`).join("")
    }</div></fieldset>`).join("");
    form.addEventListener("click", e => {
      const c = e.target.closest(".chip"); if (!c) return;
      const t = TRAITS.find(x => x.key === c.dataset.k);
      if (t.type === "radio") $$(`.chip[data-k="${t.key}"]`, form).forEach(x => { if (x !== c) x.classList.remove("on"); });
      c.classList.toggle("on");
      renderTraitResults();
    });
    $("#trait-reset").addEventListener("click", () => { $$(".chip.on", form).forEach(x => x.classList.remove("on")); renderTraitResults(); });
    renderTraitResults();
  }
  function renderTraitResults() {
    const sel = {};
    for (const t of TRAITS) {
      const on = $$(`#trait-form .chip.on[data-k="${t.key}"]`).map(x => x.dataset.v);
      sel[t.key] = t.type === "radio" ? on[0] : on;
    }
    const scored = BIRDS.map(b => ({ b, ...traitScore(b, sel) })).sort((x, y) => y.score - x.score);
    const any = scored[0].any;
    const good = scored.filter(r => r.score >= 0.75).length;
    $("#trait-count").textContent = any ? T(`${good} шувуу сайн тохирч байна`, `${good} birds match well`) : T("Шинж тэмдгээ сонгоно уу", "Choose some field marks");
    $("#trait-results").innerHTML = scored.map(r => resultRow(r.b, any ? r.score : null,
      any ? (r.why.length ? T("Тохирсон: ", "Matched: ") + r.why.join(", ") : T("Тохирох шинж бага", "Few matching traits")) : r.b.summary, any && r.score < 0.5)).join("");
  }
  function resultRow(b, score, why, dim) {
    const pct = score == null ? "" : Math.round(score * 100);
    return `<div class="result${dim ? " dim" : ""}" data-bird="${b.id}">
      <img src="${b.image.file}" alt="" loading="lazy">
      <div><h4>${esc(b.name)} <span class="muted" style="font-weight:400;font-size:.85rem"><i>${esc(latinClean(b))}</i></span></h4><div class="why">${esc(why)}</div></div>
      ${score == null ? "" : `<div class="score"><b>${pct}%</b><div class="meter"><i style="width:${pct}%"></i></div></div>`}
    </div>`;
  }

  /* ---------------- Photo identification ---------------- */
  const COLOR_KEYS = Object.keys(COLOR_NAMES);
  function classifyPixel(r, g, b) {
    const max = Math.max(r, g, b), min = Math.min(r, g, b), v = max / 255, s = max ? (max - min) / max : 0;
    if (v < 0.2) return "black";
    if (s < 0.18) return v > 0.78 ? "white" : v < 0.33 ? "black" : "gray";
    let h; const d = max - min;
    if (max === r) h = ((g - b) / d) % 6; else if (max === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
    if (h >= 75 && h < 165) return "bg";
    if (h >= 165 && h < 260) return s < 0.3 ? "gray" : "bg";
    if (h >= 260 && h < 330) return "gray";
    if (h >= 330 || h < 12) return s > 0.45 && v > 0.3 ? "red" : "brown";
    if (h < 45) return v < 0.5 ? "brown" : s > 0.5 ? "rufous" : "buff";
    return s > 0.45 && v > 0.5 ? "yellow" : v < 0.45 ? "brown" : "buff";
  }
  function colorProfile(img) {
    const c = document.createElement("canvas"), W = 120, H = Math.max(1, Math.round(120 * img.naturalHeight / img.naturalWidth));
    c.width = W; c.height = H;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, W, H);
    const data = ctx.getImageData(0, 0, W, H).data;
    const cnt = Object.fromEntries(COLOR_KEYS.map(k => [k, 0])); let bg = 0, n = 0;
    for (let y = Math.floor(H * 0.1); y < H * 0.9; y++) for (let x = Math.floor(W * 0.1); x < W * 0.9; x++) {
      // голын хэсгийг илүү жинтэй
      const cx = (x / W - 0.5), cy = (y / H - 0.5), wgt = 1.5 - Math.min(1, Math.hypot(cx, cy) * 2);
      const i = (y * W + x) * 4, k = classifyPixel(data[i], data[i + 1], data[i + 2]);
      if (k === "bg") bg += wgt; else cnt[k] += wgt;
      n += wgt;
    }
    const sum = COLOR_KEYS.reduce((a, k) => a + cnt[k], 0) || 1;
    const prof = Object.fromEntries(COLOR_KEYS.map(k => [k, cnt[k] / sum]));
    return { prof, bgShare: bg / n };
  }
  function cosine(a, b) {
    let d = 0, na = 0, nb = 0;
    for (const k of COLOR_KEYS) { const x = a[k] || 0, y = b[k] || 0; d += x * y; na += x * x; nb += y * y; }
    return na && nb ? d / Math.sqrt(na * nb) : 0;
  }

  let modelPromise = null;
  function loadScript(src) {
    return new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("load " + src)); document.head.appendChild(s); });
  }
  function preloadModel() {
    if (modelPromise) return modelPromise;
    modelPromise = (async () => {
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.min.js");
      try { return await mobilenet.load({ version: 2, alpha: 1.0 }); }
      catch (e) { return await mobilenet.load({ version: 1, alpha: 1.0 }); }
    })();
    modelPromise.catch(() => {});
    return modelPromise;
  }

  let lastPhoto = null;
  async function analyzePhoto(file) {
    lastPhoto = file;
    $("#photo-ai-btn").disabled = false;
    $("#photo-ai-out").hidden = true;
    const url = URL.createObjectURL(file);
    const img = $("#photo-preview");
    img.src = url; img.hidden = false; $("#drop-empty").hidden = true;
    await img.decode().catch(() => {});
    const status = $("#photo-status");
    status.className = "status"; status.innerHTML = `<span class="spinner"></span>${T("Зургийг шинжилж байна…", "Analysing photo…")}`;
    $("#photo-results").innerHTML = "";

    const { prof, bgShare } = colorProfile(img);
    const bar = $("#color-bar");
    bar.hidden = false;
    bar.innerHTML = COLOR_KEYS.filter(k => prof[k] > 0.02).sort((a, b) => prof[b] - prof[a])
      .map(k => `<span title="${COLOR_NAMES[k]} ${Math.round(prof[k] * 100)}%" style="width:${prof[k] * 100}%;background:${SWATCH[k]}"></span>`).join("");

    let preds = null, modelErr = null;
    try {
      const model = await Promise.race([preloadModel(), new Promise((_, r) => setTimeout(() => r(new Error("timeout")), 45000))]);
      preds = await model.classify(img, 10);
    } catch (e) { modelErr = e; }

    const modelScore = Object.fromEntries(BIRDS.map(b => [b.id, 0]));
    const hits = {}; let birdMass = 0;
    if (preds) for (const p of preds) {
      const name = p.className.toLowerCase();
      for (const m of IMAGENET_MAP) {
        const re = new RegExp("(^|[ ,])" + m.k.replace(/[-]/g, "\\-") + "($|[ ,])");
        if (!re.test(name)) continue;
        birdMass += p.probability;
        for (const [id, w] of Object.entries(m.w)) {
          modelScore[id] += p.probability * w;
          if (w >= 0.3) (hits[id] = hits[id] || []).push(`${p.className.split(",")[0]} ${Math.round(p.probability * 100)}%`);
        }
        break;
      }
    }
    const maxModel = Math.max(...Object.values(modelScore));
    const useModel = preds && maxModel > 0.02;
    const results = BIRDS.map(b => {
      const col = cosine(prof, b.colors);
      const mod = useModel ? modelScore[b.id] / maxModel : 0;
      const mw = 0.7 * Math.min(1, 0.3 + birdMass * 1.2);
      const score = (useModel ? mw * mod + (1 - mw) * col : col * 0.9) * (PRIOR[b.id] || 1);
      const topCols = Object.entries(b.colors).sort((x, y) => y[1] - x[1]).slice(0, 2).map(([k]) => COLOR_NAMES[k].toLowerCase()).join(", ");
      const why = [hits[b.id] ? "AI: " + hits[b.id].slice(0, 2).join("; ") : null, `${T("Өнгөний төстэй байдал", "Colour match")} ${Math.round(col * 100)}% (${topCols})`].filter(Boolean).join(" · ");
      return { b, score, why };
    }).sort((x, y) => y.score - x.score);

    let msg;
    if (modelErr) msg = `<span class="status err">${T("⚠️ Дүрс танигч модель ачаалагдсангүй (интернэт холболт эсвэл хостын хязгаарлалтаас шалтгаалж болно). Зөвхөн өнгөний шинжилгээгээр үнэлэв — найдвартай байдал бага.", "⚠️ The image-recognition model did not load (network or host restrictions). Colour analysis only — low reliability.")}</span>`;
    else if (!useModel) msg = T("⚠️ AI зурган дээр шувуу тод таньсангүй", "⚠️ The AI could not clearly detect a bird") + (preds ? ` (${T("хамгийн төстэй", "closest")}: “${esc(preds[0].className.split(",")[0])}”)` : "") + T(". Өнгөөр л харьцуулав. Шувуу голд, томоор харагдах зураг оруулна уу.", ". Compared by colour only. Try a photo with the bird large and centred.");
    else msg = T("✅ Шинжилгээ дууслаа. Хамгийн магадлалтай 5 шувуу:", "✅ Done. The 5 most likely birds:");
    if (bgShare > 0.6) msg += `<br><span class="muted">${T("Зургийн ихэнх хэсэг нь тэнгэр/ус/ургамал байна — шувууг ойртуулж тайрвал илүү оновчтой.", "Most of the photo is sky, water or vegetation — crop closer to the bird for a better match.")}</span>`;
    status.className = "status"; status.innerHTML = msg;
    $("#photo-results").innerHTML = results.slice(0, 5).map(r => resultRow(r.b, Math.min(0.99, r.score), r.why)).join("") +
      `<p class="muted" style="font-size:.85rem">${T(`Таарахгүй бол <a href="#traits" data-goto="traits">шинж тэмдгээр</a> эсвэл <a href="#sound" data-goto="sound">дуу хоолойгоор</a> нарийвчлаарай.`, `No match? Narrow it down by <a href="#traits" data-goto="traits">field marks</a> or <a href="#sound" data-goto="sound">voice</a>.`)}</p>`;
  }
  function initPhoto() {
    const input = $("#photo-input"), dz = $("#dropzone");
    input.addEventListener("change", () => input.files[0] && analyzePhoto(input.files[0]));
    ["dragenter", "dragover"].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add("drag"); }));
    ["dragleave", "drop"].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove("drag"); }));
    dz.addEventListener("drop", e => { const f = e.dataTransfer.files[0]; if (f && f.type.startsWith("image/")) analyzePhoto(f); });
  }

  /* ---------------- Quizzes ---------------- */
  // Түвшин: сонголтын тоо, төөрөгдүүлэх хувилбар (far = өөр бүлэг, any = санамсаргүй, near = төстэй), цаг, зургийн нөхцөл
  const QUIZ_LEVELS = [
    { name: T("Эхлэгч", "Beginner"), opts: 3, dist: "far", core: true },
    { name: T("Сонирхогч", "Enthusiast"), opts: 4, dist: "any" },
    { name: T("Ажиглагч", "Birder"), opts: 4, dist: "near", wide: true },
    { name: T("Мэргэжилтэн", "Expert"), opts: 6, dist: "near", wide: true, zoom: true, time: 20 },
    { name: T("Мастер", "Master"), opts: 6, dist: "near", wide: true, zoom: true, gray: true, time: 12 }
  ];
  const ROUND = 5, PASS = 4;
  const CORE_IDS = BIRDS.slice(0, 20).map(b => b.id); // Жагсаалтын эхний 20 шувуу (тогоруу, өрөвтас, хун, галуу, махчин)
  function quizLoad(kind) {
    try { const s = JSON.parse(localStorage.getItem("mbird-quiz-" + kind)); if (s && s.unlocked >= 1) return s; } catch (e) {}
    return { unlocked: 1, best: {} };
  }
  function quizSave(kind, s) { try { localStorage.setItem("mbird-quiz-" + kind, JSON.stringify(s)); } catch (e) {} }
  function levelDesc(kind, lv) {
    const parts = [];
    if (lv.core) parts.push(kind === "photo" ? T("Монголын нэрт 20 шувуу", "Mongolia’s 20 iconic birds") : T("Тод ялгаатай шувууд", "Clearly different birds"));
    else parts.push(kind === "photo" ? T("Бүх шувуу", "All birds") : T("Бүх бичлэг", "All recordings"));
    parts.push(`${lv.opts} ${T("сонголт", "choices")}`);
    if (lv.dist === "near") parts.push(T("төстэй шувуудаас ялгах", "tell apart similar birds"));
    if (kind === "photo" && lv.zoom) parts.push(lv.gray ? T("томруулсан хар цагаан зураг", "zoomed black-and-white photo") : T("томруулсан хэсэг зураг", "zoomed-in detail"));
    if (lv.time) parts.push(`⏱ ${lv.time} ${T("секунд", "seconds")}` + (kind === "sound" ? T(" (дуу тоглож эхлэхэд цаг эхэлнэ)", " (starts when the recording plays)") : ""));
    return parts.join(" · ");
  }
  function pickOpts(ans, lv, src) {
    const n = lv.opts - 1, others = src.filter(b => b.id !== ans.id);
    let picks = [];
    if (lv.dist === "far") {
      const seen = new Set([ans.group]), cand = shuffle(others.filter(b => b.group !== ans.group));
      cand.forEach(b => { if (picks.length < n && !seen.has(b.group)) { picks.push(b); seen.add(b.group); } });
      cand.forEach(b => { if (picks.length < n && !picks.includes(b)) picks.push(b); });
    } else if (lv.dist === "near") {
      const same = shuffle(others.filter(b => b.group === ans.group));
      const size = shuffle(others.filter(b => b.group !== ans.group && b.sizeClass === ans.sizeClass));
      picks = [...same, ...size, ...shuffle(others.filter(b => !same.includes(b) && !size.includes(b)))];
    } else picks = shuffle(others);
    return shuffle([ans, ...picks.slice(0, n)]);
  }
  function makeQuiz(box, kind, all, render) {
    const st = quizLoad(kind);
    let level = st.unlocked, q = 0, results = [], recent = [], timer = null;
    const stopTimer = () => { if (timer) { clearInterval(timer); timer = null; } };
    function head() {
      const lv = QUIZ_LEVELS[level - 1];
      return `<div class="quiz-levels" role="group" aria-label="${T("Түвшин", "Level")}">${QUIZ_LEVELS.map((l, i) => {
        const n = i + 1, locked = n > st.unlocked, best = st.best[n];
        return `<button class="lvl${n === level ? " on" : ""}" data-lvl="${n}"${locked ? " disabled" : ""} title="${esc(l.name)}">${locked ? "🔒" : n}<span>${esc(l.name)}</span>${best ? `<small>${"★".repeat(best >= ROUND ? 3 : best >= PASS ? 2 : 1)}</small>` : ""}</button>`;
      }).join("")}</div>
      <p class="quiz-desc muted"><b>${T("Түвшин", "Level")} ${level} · ${esc(lv.name)}</b> — ${levelDesc(kind, lv)}. ${level < QUIZ_LEVELS.length ? T(`${ROUND} асуултаас ${PASS}-ийг зөв хариулбал дараагийн түвшин нээгдэнэ.`, `Get ${PASS} of ${ROUND} right to unlock the next level.`) : T("Хамгийн хэцүү түвшин.", "The hardest level.")}</p>`;
    }
    function bindLevels() {
      $$(".quiz-levels button", box).forEach(b => b.onclick = () => { level = +b.dataset.lvl; start(); });
    }
    function dots() {
      return Array.from({ length: ROUND }, (_, i) => `<i class="${i < results.length ? (results[i] ? "ok" : "bad") : i === results.length ? "cur" : ""}"></i>`).join("");
    }
    function start() { stopTimer(); q = 0; results = []; next(); }
    function next() {
      stopTimer();
      if (q >= ROUND) return finish();
      const lv = QUIZ_LEVELS[level - 1];
      let pool = kind === "photo" ? (lv.core ? all.filter(b => CORE_IDS.includes(b.id)) : all) : all;
      const fresh = pool.filter(b => !recent.includes(b.id));
      const ans = (fresh.length ? fresh : pool)[Math.floor(Math.random() * (fresh.length || pool.length))];
      recent.push(ans.id); if (recent.length > Math.min(10, pool.length - 1)) recent.shift();
      const opts = pickOpts(ans, lv, lv.wide ? BIRDS : pool);
      box.innerHTML = `${head()}
        <div class="quiz-top"><b>${T("Асуулт", "Question")} ${q + 1} / ${ROUND}</b><span class="quiz-dots" aria-hidden="true">${dots()}</span></div>
        ${lv.time ? `<div class="quiz-timer" aria-hidden="true"><i></i></div>` : ""}
        ${render(ans, lv)}
        <div class="quiz-opts${lv.opts > 4 ? " six" : ""}">${opts.map(o => `<button data-id="${o.id}">${esc(o.name)}</button>`).join("")}</div>
        <div class="quiz-msg" aria-live="polite"></div>`;
      bindLevels();
      let done = false;
      function answer(btn) {
        if (done) return; done = true; stopTimer();
        const right = !!btn && btn.dataset.id === ans.id;
        results.push(right); q++;
        $$(".quiz-opts button", box).forEach(x => { x.disabled = true; if (x.dataset.id === ans.id) x.classList.add("right"); else if (x === btn) x.classList.add("wrong"); });
        $(".quiz-dots", box).innerHTML = dots();
        const img = $(".quiz-img", box); if (img) img.classList.add("reveal");
        const last = q >= ROUND;
        $(".quiz-msg", box).innerHTML = (right ? T("🎉 Зөв! ", "🎉 Correct! ") : `${btn ? "❌ " + T("Буруу", "Wrong") : "⏱ " + T("Хугацаа дууслаа", "Time’s up")}. ${T("Зөв хариулт", "The answer is")}: <b>${esc(ans.name)}</b>. `) +
          `<a href="#" data-bird="${ans.id}">${T("Дэлгэрэнгүй үзэх", "Details")}</a> <button class="btn small" data-next>${last ? T("Дүнг харах →", "See result →") : T("Дараагийнх →", "Next →")}</button>`;
        $("[data-next]", box).onclick = next;
      }
      $$(".quiz-opts button", box).forEach(btn => btn.onclick = () => answer(btn));
      if (lv.time) {
        const bar = $(".quiz-timer i", box);
        const run = () => {
          if (timer || done) return;
          const t0 = Date.now();
          timer = setInterval(() => {
            const left = 1 - (Date.now() - t0) / (lv.time * 1000);
            bar.style.width = Math.max(0, left * 100) + "%";
            bar.classList.toggle("low", left < 0.3);
            if (left <= 0) answer(null);
          }, 100);
        };
        // Зураг ачаалагдсаны дараа, дуу тоглож эхэлсний дараа цаг эхэлнэ
        const media = $(".quiz-img, .quiz-media audio", box);
        if (media && media.tagName === "IMG") { if (media.complete) run(); else { media.onload = run; media.onerror = run; } }
        else if (media) media.addEventListener("playing", run, { once: true });
        else run();
      }
    }
    function finish() {
      const got = results.filter(Boolean).length, pass = got >= PASS, lv = QUIZ_LEVELS[level - 1];
      st.best[level] = Math.max(st.best[level] || 0, got);
      const opened = pass && level < QUIZ_LEVELS.length && st.unlocked === level;
      if (opened) st.unlocked = level + 1;
      quizSave(kind, st);
      const stars = got >= ROUND ? 3 : pass ? 2 : got >= 2 ? 1 : 0;
      box.innerHTML = `${head()}
        <div class="quiz-result">
          <div class="stars" aria-label="${stars} / 3">${"★".repeat(stars)}<span>${"★".repeat(3 - stars)}</span></div>
          <h4>${pass ? (level === QUIZ_LEVELS.length ? T("🏆 Та Мастер түвшинг давлаа!", "🏆 You beat the Master level!") : T(`Түвшин ${level} давлаа!`, `Level ${level} cleared!`)) : T("Дахин оролдоорой", "Try again")}</h4>
          <p>${T(`${ROUND} асуултаас ${got} зөв`, `${got} of ${ROUND} correct`)} · ${esc(lv.name)}${opened ? ` · ${T("🔓 Шинэ түвшин нээгдлээ", "🔓 New level unlocked")}: <b>${esc(QUIZ_LEVELS[level].name)}</b>` : ""}</p>
          <div class="quiz-actions">
            ${pass && level < QUIZ_LEVELS.length ? `<button class="btn primary" data-go="${level + 1}">${T("Дараагийн түвшин →", "Next level →")}</button>` : ""}
            <button class="btn${pass && level < QUIZ_LEVELS.length ? "" : " primary"}" data-go="${level}">${T("Дахин тоглох ↻", "Play again ↻")}</button>
          </div>
        </div>`;
      bindLevels();
      $$("[data-go]", box).forEach(b => b.onclick = () => { level = +b.dataset.go; start(); });
    }
    start();
  }
  let photoQuizOn = false, soundQuizOn = false;
  function ensurePhotoQuiz() {
    if (photoQuizOn) return; photoQuizOn = true;
    makeQuiz($("#photo-quiz"), "photo", BIRDS, (b, lv) => {
      const ox = 30 + Math.round(Math.random() * 40), oy = 30 + Math.round(Math.random() * 40);
      return `<div class="quiz-frame"><img class="quiz-img${lv.zoom ? " zoom" : ""}${lv.gray ? " gray" : ""}" style="transform-origin:${ox}% ${oy}%" src="${b.image.file}" alt="${T("Таах шувуу", "Mystery bird")}"></div>`;
    });
  }
  function ensureSoundQuiz() {
    if (soundQuizOn) return; soundQuizOn = true;
    makeQuiz($("#sound-quiz"), "sound", BIRDS.filter(b => b.audio), b => `<div class="quiz-media"><p class="muted">${T("Бичлэгийг сонсоод аль шувуу болохыг таана уу.", "Listen and guess which bird it is.")}</p><audio controls preload="none" src="${b.audio.file}"></audio></div>`);
  }

  /* ---------------- Sound ---------------- */
  let timeFilter = "any";
  function initSound() {
    $("#voice-chips").innerHTML = Object.entries(VOICE_TYPES).map(([k, v]) =>
      `<button class="voice-opt" data-v="${k}"><b>${v.name}</b><span>${esc(v.desc)}</span></button>`).join("");
    $("#voice-chips").addEventListener("click", e => { const c = e.target.closest(".voice-opt"); if (c) { c.classList.toggle("on"); renderSound(); } });
    const times = { any: T("Хэзээ ч", "Any time"), day: T("☀️ Өдөр сонссон", "☀️ Heard by day"), night: T("🌙 Шөнө / бүрэнхийд сонссон", "🌙 Heard at night / dusk") };
    $("#time-chips").innerHTML = Object.entries(times).map(([k, v]) => `<button class="chip${k === "any" ? " on" : ""}" data-t="${k}">${v}</button>`).join("");
    $("#time-chips").addEventListener("click", e => {
      const c = e.target.closest(".chip"); if (!c) return;
      timeFilter = c.dataset.t; $$("#time-chips .chip").forEach(x => x.classList.toggle("on", x === c)); renderSound();
    });
    renderSound();
  }
  function renderSound() {
    const sel = $$(".voice-opt.on").map(x => x.dataset.v);
    let list = BIRDS.map(b => {
      let s = sel.length ? sel.filter(v => b.voiceTypes.includes(v)).length / sel.length : 0.5;
      if (timeFilter === "night") s *= b.active === "night" ? 1.5 : 0.4;
      if (timeFilter === "day" && b.active === "night") s *= 0.3;
      return { b, s };
    });
    if (sel.length || timeFilter !== "any") list = list.filter(r => r.s > 0);
    list.sort((x, y) => y.s - x.s || (!!y.b.audio - !!x.b.audio));
    $("#sound-results").innerHTML = (sel.length ? `<p class="muted">${T(`${list.length} шувуу тохирч байна.`, `${list.length} birds match.`)}</p>` : `<p class="muted">${T("Бүх шувууны дуу хоолойн тайлбар (🔊 бичлэгтэй нь эхэнд):", "Voice descriptions of all birds (those with 🔊 recordings first):")}</p>`) +
      list.map(({ b }) => `<div class="sound-row">
        <img src="${b.image.file}" alt="" data-bird="${b.id}" loading="lazy">
        <div><h4 data-bird="${b.id}">${esc(b.name)} <span class="muted" style="font-weight:400;font-size:.85rem">· ${b.voiceTypes.map(v => VOICE_TYPES[v].name).join(", ")}</span></h4>
        <p>${esc(b.voice)}</p>
        ${b.audio ? `<audio controls preload="none" src="${b.audio.file}"></audio>` : `<a class="xc-link" href="${xcUrl(b)}" target="_blank" rel="noopener">${T("🎧 xeno-canto дээр бичлэг сонсох ↗", "🎧 Listen on xeno-canto ↗")}</a>`}
        </div></div>`).join("");
  }
  // нэг бичлэг тоглоход бусдыг зогсоох
  document.addEventListener("play", e => { $$("audio").forEach(a => { if (a !== e.target) a.pause(); }); }, true);

  /* ---------------- Routes ---------------- */
  let selRoute = ROUTES[0].id;
  function routeMapSVG(r) {
    const pts = r.stops.map(s => [px(HOTSPOTS[s.hs].lon), py(HOTSPOTS[s.hs].lat)]);
    const line = (r.loop ? pts.concat([pts[0]]) : pts).map(p => p.join(",")).join(" ");
    const marks = r.stops.map((s, i) => {
      const [x, y] = pts[i], left = x > 700;
      return `<g class="rstop"><circle cx="${x}" cy="${y}" r="13"/><text class="rnum" x="${x}" y="${y + 5}">${i + 1}</text>` +
        `<text class="rname" x="${left ? x - 18 : x + 18}" y="${y + 5}" text-anchor="${left ? "end" : "start"}">${esc(HOTSPOTS[s.hs].name)}</text></g>`;
    }).join("");
    return mapSVG({ regionsOn: [], hotspotsOn: [], labels: false }) + `<polyline class="rline" points="${line}"/>${marks}`;
  }
  function routeViewBox(r) {
    const xs = r.stops.map(s => px(HOTSPOTS[s.hs].lon)), ys = r.stops.map(s => py(HOTSPOTS[s.hs].lat));
    let x0 = Math.min(...xs) - 150, x1 = Math.max(...xs) + 150, y0 = Math.min(...ys) - 60, y1 = Math.max(...ys) + 60;
    let w = Math.max(x1 - x0, 420), h = Math.max(y1 - y0, 210);
    if (w < h * 2) w = h * 2; else h = w / 2;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    return [cx - w / 2, cy - h / 2, w, h].map(v => v.toFixed(0)).join(" ");
  }
  function renderRouteTabs() {
    $("#route-tabs").innerHTML = ROUTES.map(r => `<button class="route-tab${r.id === selRoute ? " on" : ""}" data-route="${r.id}" role="tab" aria-selected="${r.id === selRoute}">
      <b>${esc(r.name)}</b><span>${esc(r.days)} · ${esc(r.level)}</span></button>`).join("");
  }
  function renderRoute() {
    const r = ROUTES.find(x => x.id === selRoute), prog = PROGRAMS[r.id] || [];
    const slot = (label, txt) => txt && txt !== "—" ? `<div class="slot"><small>${label}</small><p>${esc(txt)}</p></div>` : "";
    $("#route-detail").innerHTML = `
      <div class="route-head">
        <h3>${esc(r.name)}</h3>
        <p>${esc(r.intro)}</p>
        <dl class="route-facts">
          <div><dt>${T("Хугацаа", "Duration")}</dt><dd>${esc(r.days)}</dd></div>
          <div><dt>${T("Зай", "Distance")}</dt><dd>${esc(r.distance)}</dd></div>
          <div><dt>${T("Тохиромжтой үе", "Best season")}</dt><dd>${esc(r.season)}</dd></div>
          <div><dt>${T("Хүндрэл", "Difficulty")}</dt><dd><span class="lvl lvl-${["Хөнгөн", "Easy"].includes(r.level) ? 1 : ["Дунд", "Moderate"].includes(r.level) ? 2 : 3}">${esc(r.level)}</span></dd></div>
          <div class="wide"><dt>${T("Тээвэр", "Transport")}</dt><dd>${esc(r.transport)}</dd></div>
        </dl>
      </div>
      <div class="route-grid">
        <div class="map-card">${HAS_L ? `<div id="route-sat" class="sat-map sat-route" aria-label="${esc(r.name)} ${T(" маршрутын газрын зураг", " — route map")}"></div>` : `<div class="map-scroll"><svg class="mn-map route-map" viewBox="${routeViewBox(r)}" role="img" aria-label="${esc(r.name)} ${T(" маршрутын зураг", " — route map")}">${routeMapSVG(r)}</svg></div>`}
          <p class="map-legend">${r.loop ? T("Улаанбаатараас эхэлж буцаж ирнэ.", "Starts and ends in Ulaanbaatar.") : T("Нэг чиглэлтэй — эхлэл, төгсгөлд нислэгтэй.", "One-way — flights at the start and end.")} ${T("Зогсоолуудыг шулуун шугамаар холбосон тул бодит замаас зөрнө.", "Stops are joined by straight lines, so the real road differs.")}</p></div>
        <ol class="stops">${r.stops.map(s => `<li><b>${esc(HOTSPOTS[s.hs].name)}</b> <span class="muted">· ${esc(s.day)}</span><p>${esc(s.note)}</p></li>`).join("")}</ol>
      </div>
      <h3 class="section-gap">${T("Өдөр бүрийн хөтөлбөр", "Day-by-day itinerary")}</h3>
      <div class="program">${prog.map(d => `
        <article class="pday">
          <div class="pday-head"><span class="dnum">${T(d.day + "-р өдөр", "Day " + d.day)}</span><h4>${esc(d.title)}</h4></div>
          <div class="pday-meta"><span>🚙 ${esc(d.drive)}</span>${d.stay && d.stay !== "—" ? `<span>🏕️ ${esc(d.stay)}</span>` : ""}</div>
          <div class="slots">${slot(T("Өглөө", "Morning"), d.am)}${slot(T("Өдөр", "Afternoon"), d.pm)}${slot(T("Орой", "Evening"), d.ev)}</div>
        </article>`).join("")}
      </div>
      <h3 class="section-gap">${T("Энэ маршрутаар харж болох шувууд", "Birds you can see on this route")} (${r.birds.length})</h3>
      <div class="route-birds">${r.birds.map(id => byId[id]).map(b => `<button class="rbird" data-bird="${b.id}"><img src="${b.image.file}" alt="" loading="lazy"><span>${esc(b.name)}</span></button>`).join("")}</div>
      ${(() => {
        const np = nearbyPlaces(r);
        const row = ({ pl, i, d }) => `<div class="rplace">
          <span class="pin-dot" style="background:${PLACE_KINDS[pl.kind].color}">${PLACE_KINDS[pl.kind].icon}</span>
          <div><b>${esc(pl.name)}</b> <span class="muted">· ${pl.kind === "lodging" ? pl.types.map(x => LODGING_TYPES[x]).join(", ") : PLACE_KINDS[pl.kind].name} · ${T(`${i + 1}-р зогсоолоос ${d < 3 ? "дэргэд" : Math.round(d) + " км"}`, d < 3 ? `next to stop ${i + 1}` : `${Math.round(d)} km from stop ${i + 1}`)}</span>
          <p>${esc(pl.desc)}</p>
          <div class="rplace-links">${HAS_L ? `<button type="button" class="btn small" data-showplace="${pl.id}">🗺️ ${T("Газрын зураг дээр", "Show on map")}</button>` : ""}<a class="btn small" href="${placeLink(pl)}" target="_blank" rel="noopener">${pl.kind === "lodging" ? T("Буудал хайх ↗", "Find lodging ↗") : "Google Maps ↗"}</a></div></div></div>`;
        const block = (title, items, empty) => `<h3 class="section-gap">${title}</h3><div class="route-places">${items.length ? items.map(row).join("") : `<p class="muted">${empty}</p>`}</div>`;
        return `<p class="muted section-gap route-near-note">${T("Доорх жагсаалтад маршрутын зогсоолуудаас 60 км-ийн дотор байгаа газрууд орсон", "Places within 60 km of the route's stops")}${HAS_L ? T("; дээрх газрын зураг дээр тэмдэглэгдсэн", " — also marked on the map above") : ""}.</p>` +
          block(T("🛏 Замд таарах буудал", "🛏 Lodging along the way"), np.filter(x => x.pl.kind === "lodging"), T("Ойролцоо бүртгэгдсэн буудал алга — майхан, хээрийн хоноглолт төлөвлө.", "No listed lodging nearby — plan to camp.")) +
          block(T("🏛 Замд таарах үзвэр", "🏛 Sights along the way"), np.filter(x => x.pl.kind !== "lodging"), T("Ойролцоо бүртгэгдсэн үзвэр алга.", "No listed sights nearby."));
      })()}      <h3 class="section-gap">${T("Зөвлөмж", "Tips")}</h3>
      <ul class="tips">${r.tips.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
      <p class="note">${T("Зай, хугацааг ойролцоогоор тооцсон; замын нөхцөл улирлаас хамаарч өөрчлөгдөнө. Хилийн бүс, тусгай хамгаалалттай газарт орохын өмнө зөвшөөрөл, хураамжийн мэдээллийг шалгаарай. Шувууг үймүүлэхгүй байх нь аялагч бүрийн үүрэг.", "Distances and times are approximate; road conditions change with the season. Check permits and fees before entering border zones or protected areas. Every traveller is responsible for not disturbing birds.")}</p>`;
  }
  let routeMap = null, routeBounds = null;
  function nearbyPlaces(r, km = 60) {
    const out = [];
    for (const pl of PLACES) {
      let best = null;
      r.stops.forEach((s, i) => { const d = distKm(HOTSPOTS[s.hs], pl); if (d <= km && (!best || d < best.d)) best = { i, d }; });
      if (best) out.push({ pl, ...best });
    }
    return out.sort((a, b) => a.i - b.i || a.d - b.d);
  }
  function drawRouteSat(r) {
    if (routeMap) { routeMap.remove(); routeMap = null; }
    if (!HAS_L) return;
    routeMap = satMap($("#route-sat"));
    const pts = r.stops.map(s => [HOTSPOTS[s.hs].lat, HOTSPOTS[s.hs].lon]);
    L.polyline(r.loop ? pts.concat([pts[0]]) : pts, { color: "#ffb347", weight: 4, dashArray: "10 8", opacity: .95 }).addTo(routeMap);
    const midLon = (Math.min(...pts.map(q => q[1])) + Math.max(...pts.map(q => q[1]))) / 2;
    r.stops.forEach((s, i) => L.marker(pts[i], { icon: L.divIcon({ className: "rnum-sat", html: String(i + 1), iconSize: [28, 28], iconAnchor: [14, 14] }) })
      .addTo(routeMap).bindTooltip(HOTSPOTS[s.hs].name, { permanent: true, direction: pts[i][1] > midLon ? "left" : "right", offset: [pts[i][1] > midLon ? -14 : 14, 0], className: "hs-tip" }));
    nearbyPlaces(r).forEach(({ pl }) => L.marker([pl.lat, pl.lon], { icon: placeIcon(pl), title: pl.name }).bindPopup(placePopup(pl), { maxWidth: 290 }).addTo(routeMap));
    routeBounds = L.latLngBounds(pts);
    setTimeout(() => refit(routeMap, routeBounds, [60, 60]), 60);
  }
  function selectRoute(id) {
    if (!ROUTES.some(r => r.id === id)) return;
    selRoute = id; renderRouteTabs(); renderRoute(); drawRouteSat(ROUTES.find(r => r.id === id));
  }
  function initRoutes() {
    $("#route-tabs").addEventListener("click", e => { const b = e.target.closest(".route-tab"); if (b) { selectRoute(b.dataset.route); setHash("#route-" + b.dataset.route); } });
    renderRouteTabs(); renderRoute(); drawRouteSat(ROUTES[0]);
  }
  document.addEventListener("click", e => {
    const l = e.target.closest("[data-goroute]"); if (!l) return;
    e.preventDefault();
    if (!$("#modal").hidden) closeModal();
    showTab("routes", false); selectRoute(l.dataset.goroute); setHash("#route-" + l.dataset.goroute);
  });

  /* ---------------- Буудал, үзвэр ---------------- */
  function nearestHotspot(pl) {
    let best = null;
    for (const [k, h] of Object.entries(HOTSPOTS)) { const d = distKm(h, pl); if (!best || d < best.d) best = { k, d }; }
    return best;
  }
  function placeCard(pl) {
    const k = PLACE_KINDS[pl.kind], nh = nearestHotspot(pl);
    const birds = nh && nh.d <= 60 ? BIRDS.filter(b => b.hotspots.includes(nh.k)).slice(0, 4) : [];
    return `<article class="place-card" style="--kc:${k.color}">
      <div class="place-kind"><span class="pin-dot" style="background:${k.color}">${k.icon}</span>${k.name} · ${esc(pl.aimag)}</div>
      <h3>${esc(pl.name)}</h3>
      <p>${esc(pl.desc)}</p>
      ${pl.types ? `<div class="tagrow">${pl.types.map(x => `<span class="tag">${LODGING_TYPES[x]}</span>`).join("")}</div>` : ""}
      ${birds.length ? `<p class="place-birds">🐦 ${T("Ойролцоо", "Nearby")} (${esc(HOTSPOTS[nh.k].name)}, ${Math.max(1, Math.round(nh.d))} ${T("км", "km")}): ${birds.map(b => `<button type="button" class="ai-chip" data-bird="${b.id}">${esc(b.name)}</button>`).join(" ")}</p>` : ""}
      <div class="rplace-links">${HAS_L ? `<button type="button" class="btn small" data-showplace="${pl.id}">🗺️ ${T("Газрын зураг дээр", "Show on map")}</button>` : ""}<a class="btn small" href="${placeLink(pl)}" target="_blank" rel="noopener">${pl.kind === "lodging" ? T("Google Maps-д буудал хайх ↗", "Find lodging on Google Maps ↗") : "Google Maps ↗"}</a></div>
    </article>`;
  }
  // chips: { key: [label, filterFn] }
  function placeSection(chipsSel, listSel, base, chips) {
    let cur = "all";
    const render = () => { const list = base.filter(chips[cur][1]); $(listSel).innerHTML = list.map(placeCard).join("") || `<p class="muted">${T("Тохирох газар алга.", "No matching places.")}</p>`; };
    $(chipsSel).innerHTML = Object.entries(chips).map(([k, [label, fn]]) => `<button class="chip${k === "all" ? " on" : ""}" data-f="${k}">${label} (${base.filter(fn).length})</button>`).join("");
    $(chipsSel).addEventListener("click", e => {
      const c = e.target.closest(".chip"); if (!c) return;
      cur = c.dataset.f; $$(chipsSel + " .chip").forEach(x => x.classList.toggle("on", x === c)); render();
    });
    render();
  }
  function initPlaces() {
    const lodging = PLACES.filter(p => p.kind === "lodging");
    const sights = PLACES.filter(p => p.kind !== "lodging").sort((a, b) => a.kind === b.kind ? 0 : a.kind === "nature" ? 1 : -1);
    placeSection("#lodging-chips", "#lodging-list", lodging, {
      all: [T("Бүгд", "All"), () => true],
      ...Object.fromEntries(Object.entries(LODGING_TYPES).map(([k, v]) => [k, [v, p => p.types.includes(k)]]))
    });
    placeSection("#sights-chips", "#sights-list", sights, {
      all: [T("Бүгд", "All"), () => true],
      culture: [T("🏛 Түүх, соёл", "🏛 History & culture"), p => p.kind === "culture"],
      nature: [T("⛰ Байгаль", "⛰ Nature"), p => p.kind === "nature"]
    });
  }
  /* ---------------- AI туслах (Claude) ---------------- */
  const AI_ERR = {
    not_granted: T("Энэ хуудсанд Claude ашиглахыг зөвшөөрөөгүй тул AI туслах ажиллахгүй.", "Claude isn't allowed on this page, so the AI assistant is unavailable."),
    sampling_disabled: T("Таны бүртгэлд Claude ашиглах боломжгүй байна.", "Claude isn't available for your account."),
    rate_limited: T("Хэт олон асуулт илгээсэн эсвэл таны Claude-ийн хэрэглээний хязгаар дууссан. Түр хүлээгээд дахин оролдоно уу.", "Too many questions, or your Claude usage limit was reached. Wait a moment and try again."),
    session_expired: T("claude.ai-д дахин нэвтэрнэ үү.", "Please sign in to claude.ai again."),
    refused: T("Claude энэ асуултад хариулахаас татгалзлаа. Асуултаа өөрөөр томъёолж үзнэ үү.", "Claude declined this question. Try rephrasing it."),
    image_rejected: T("Зургийг уншиж чадсангүй. JPG эсвэл PNG зураг оруулна уу.", "The image couldn't be read. Use a JPG or PNG photo."),
    invalid_json: T("Хариуг боловсруулж чадсангүй. Дахин оролдоно уу.", "The answer couldn't be processed. Try again."),
    prompt_too_large: T("Яриа хэт урт болсон. Шинэ яриа эхлүүлнэ үү.", "The conversation got too long. Start a new one.")
  };
  const HIDE_CODES = ["not_granted", "sampling_disabled", "not_declared", "capability_disabled", "capability_removed"];
  const aiErr = e => AI_ERR[e && e.code] || T("Холболт тасарлаа. Дахин оролдоно уу.", "The connection dropped. Try again.");

  // Сайтын мэдлэгийн сан: бүх шувууны товч жагсаалт + асуултад хамаатай шувуудын дэлгэрэнгүй
  const cut = (s, n) => s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s;
  function birdDetail(b) {
    return [
      `## ${b.name} [[${b.id}]] — ${latinClean(b)}, ${b.en}`,
      `${b.length}, ${b.wingspan}, ${b.weight}. ${b.iucn}. ${b.statusText}`,
      `${T("Орчин", "Habitat")}: ${cut(b.habitatText, 160)}`,
      `${T("Тархац", "Range")}: ${cut(b.distribution, 160)}`,
      `${T("Шинж", "Field marks")}: ${b.features.join(" ")}`,
      `${T("Ялгах", "Similar")}: ${b.similar}`,
      `${T("Дуу", "Voice")}: ${b.voice}`,
      `${T("Үзэх", "Where to see")}: ${b.watching} (${b.bestTime})`
    ].join("\n");
  }
  function relevantBirds(texts, max = 5) {
    const words = texts.join(" ").toLowerCase().split(/[^0-9a-zа-яёөү]+/i).filter(w => w.length >= 3);
    const named = new Set(); texts.forEach(s => (s.match(/\[\[([a-z-]+)\]\]/g) || []).forEach(m => named.add(m.slice(2, -2))));
    if (!words.length && !named.size) return [];
    return BIRDS.map(b => {
      const blob = [b.name, b.altNames, b.en, b.latin, b.features.join(" "), b.voice, b.habitatText, b.distribution, b.watching,
        Object.keys(b.colors).map(c => COLOR_NAMES[c]).join(" "), GROUPS[b.group]].join(" ").toLowerCase();
      let s = named.has(b.id) ? 100 : 0;
      for (const w of words) if (blob.includes(w.slice(0, Math.max(3, w.length - 2)))) s += 1;
      return { b, s };
    }).filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, max).map(x => x.b);
  }
  function knowledge(texts = []) {
    const index = BIRDS.map(b => `- ${b.name} [[${b.id}]] (${latinClean(b)}; ${b.en}) — ${GROUPS[b.group]}; ${b.length}; ${b.iucn}; ${b.season.map(s => SEASON_NAMES[s]).join("/")}; ${b.regions.map(r => REGIONS[r].name).join("/")}; ${b.habitats.map(h => HABITAT_NAMES[h]).join("/")}`).join("\n");
    const rel = relevantBirds(texts);
    const details = rel.map(birdDetail).join("\n\n");
    const routes = ROUTES.map(r => `- ${r.name} {{${r.id}}}: ${r.days}, ${r.distance}, ${r.season}, ${r.level}. ${r.stops.map(s => HOTSPOTS[s.hs].name).join(" → ")}. ${r.birds.map(id => byId[id].name).join(", ")}.`).join("\n");
    const places = PLACES.map(pl => `- ${pl.name} (${PLACE_KINDS[pl.kind].name}, ${pl.aimag}${pl.types ? "; " + pl.types.map(x => LODGING_TYPES[x]).join(", ") : ""})`).join("\n");
    return `# ${T("Бүх шувууны товч жагсаалт", "Index of all birds")}\n${index}\n\n# ${T("Асуултад хамаарах шувуудын дэлгэрэнгүй", "Details of birds relevant to the question")}\n${details || "—"}\n\n# ${T("Аяллын маршрутууд", "Routes")}\n${routes}\n\n# ${T("Буудал, үзвэр", "Lodging and sights")}\n${places}`;
  }  const EN_RULES = `You are the AI assistant of "MongolShuvuu", an online guide to the birds of Mongolia. Answer questions about identifying Mongolian birds and planning birdwatching trips IN ENGLISH, concisely, clearly and in a friendly way.

Rules:
- Based on the features the user describes (colour, size, bill, habitat, season, voice), suggest the best match among the ${BIRDS.length} birds below and explain why using field marks. If unsure, give 2–3 options, say how to tell them apart and ask a follow-up question.
- When you mention a bird, always write its [[id]] tag after the name (e.g. Saker Falcon [[saker]]). Write {{id}} for routes. The page turns these into buttons.
- If the bird may not be one of these ${BIRDS.length}, say so plainly; then answer cautiously from general knowledge and note that it is "not in this guide".
- Don't make things up. Take numbers and facts from the data below. Full details are included only for birds relevant to the question; if you need another bird's details and the get_bird tool is available, call it.
- Where relevant, remind users not to disturb birds, nests or colonies.
- For lodging, only say what type of accommodation exists in a place. Never invent hotel or camp names, prices or phone numbers; advise checking the Google Maps links in the "Lodging" section and booking ahead.
- Keep answers under about 150 words; use "- " for lists and **...** for emphasis.
- The data below may mix English and Mongolian labels; always answer in English.`;
  const RULES = (texts = []) => LANG === "en" ? `${EN_RULES}\n\n${knowledge(texts)}` : `Чи бол "МонголШувуу" цахим хөтчийн AI туслах. Монгол орны шувууг таних, шувуу ажиглах аяллын талаар МОНГОЛ ХЭЛЭЭР, товч тодорхой, найрсаг хариулна.

Дүрэм:
- Хэрэглэгчийн дүрсэлсэн шинж (өнгө, хэмжээ, хушуу, орчин, улирал, дуу) дээр үндэслэн доорх ${BIRDS.length} шувуунаас хамгийн тохирохыг санал болго, яагаад гэдгийг шинжээр нь тайлбарла. Эргэлзээтэй бол 2–3 хувилбар өгч, ялгах шинжийг хэл, нэмэлт асуулт асуу.
- Шувууг дурдахдаа нэрийн ард [[id]] тэмдэглэгээ заавал бич (жишээ: Идлэг шонхор [[saker]]). Маршрутыг дурдахдаа {{id}} бич. Эдгээрийг хуудас товч болгож харуулна.
- Энэ ${BIRDS.length} шувуунд ороогүй шувуу байж магадгүй бол шууд хэл; тэр тохиолдолд ерөнхий мэдлэгээсээ болгоомжтой хариулж, "энэ хөтчид ороогүй" гэж тэмдэглэ.
- Мэдээгүй зүйлээ бүү зохио. Тоо, баримтыг доорх мэдээллээс ав. Дэлгэрэнгүй мэдээлэл нь зөвхөн асуултад хамаатай шувуудад орсон; өөр шувууны дэлгэрэнгүй хэрэгтэй бол get_bird хэрэгсэл байвал түүнийг дууд.
- Шувуу, үүр, колонийг үймүүлэхгүй байхыг шаардлагатай үед сануул.
- Буудлын хувьд зөвхөн тухайн газарт ямар төрлийн байр байдгийг хэл. Тодорхой буудал, баазын нэр, үнэ, утсыг бүү зохио; "Буудал, үзвэр" хэсгийн Google Maps холбоосоор шалгаж, урьдчилан захиалахыг зөвлө.
- Хариулт 150 үгээс хэтрэхгүй байх нь зүйтэй; жагсаалт хэрэгтэй бол "- " ашигла, тодотгохдоо **...** ашигла.

${knowledge(texts)}`;

  function aiFormat(text) {
    let h = esc(text);
    h = h.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
    h = h.replace(/\[\[([a-z-]+)\]\]/g, (m, id) => byId[id] ? `<button type="button" class="ai-chip" data-bird="${id}">${esc(byId[id].name)} ↗</button>` : "");
    h = h.replace(/\{\{([a-z-]+)\}\}/g, (m, id) => { const r = ROUTES.find(x => x.id === id); return r ? `<a href="#route-${id}" class="ai-chip" data-goroute="${id}">🧭 ${esc(r.name)}</a>` : ""; });
    return h.split(/\n{2,}/).map(par => {
      const lines = par.split("\n");
      if (lines.every(l => /^\s*[-•]\s+/.test(l))) return `<ul>${lines.map(l => `<li>${l.replace(/^\s*[-•]\s+/, "")}</li>`).join("")}</ul>`;
      return `<p>${lines.join("<br>")}</p>`;
    }).join("");
  }

  async function initAI() {
    if (!window.claude || typeof window.claude.use !== "function") return;
    let sample = null;
    try { sample = await window.claude.use("sample"); } catch (e) { sample = null; }
    if (!sample) return;

    const fab = $("#ai-fab"), panel = $("#ai-panel"), log = $("#ai-log"), input = $("#ai-input");
    const send = $("#ai-send"), stop = $("#ai-stop");
    const turns = []; let ctl = null, busy = false;
    const lim = await sample.limits().catch(() => null);
    fab.hidden = false;
    const setOpen = open => { panel.hidden = !open; fab.setAttribute("aria-expanded", String(open)); fab.hidden = open; if (open) input.focus(); };
    fab.onclick = () => setOpen(true);
    $("#ai-close").onclick = () => setOpen(false);

    const bubble = (role, html) => { const d = document.createElement("div"); d.className = "ai-msg " + role; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; };
    bubble("assistant", `<p>${T("Сайн байна уу! Би шувуу таних, аялал төлөвлөхөд тусална. Харсан шувууныхаа өнгө, хэмжээ, хаана, хэзээ харснаа бичээрэй.", "Hello! I can help you identify birds and plan trips. Tell me the colour and size of the bird you saw, and where and when you saw it.")}</p><p class="ai-note">${T("Хариулт бүр таны Claude-ийн хэрэглээнээс тооцогдоно. Эхний асуултын үед зөвшөөрөл асууна.", "Each answer uses your own Claude usage. You'll be asked for permission on the first question.")}</p>`);

    const SUGGEST = LANG === "en"
      ? ["I saw a big black bird with a red bill and legs by a river. What is it?", "Where should I go for a 3-day birding trip in May?", "How do I tell White-naped Crane from Demoiselle Crane?", "Which bird calls \"oo-hoo\" at night?"]
      : ["Хар биетэй, улаан хушуу хөлтэй том шувуу гол дээр харсан. Юу вэ?", "5-р сард 3 хоногийн аялалд хаашаа явбал олон шувуу үзэх вэ?", "Цэн тогоруу, өвөгт тогоруу хоёрыг яаж ялгах вэ?", "Шөнө \"ухуу\" гэж дуугарах шувуу юу вэ?"];
    $("#ai-suggest").innerHTML = SUGGEST.map(s => `<button type="button" class="chip">${esc(s)}</button>`).join("");
    $("#ai-suggest").onclick = e => { const c = e.target.closest(".chip"); if (c && !busy) { input.value = c.textContent; ask(); } };

    async function ask() {
      const q = input.value.trim(); if (!q || busy) return;
      busy = true; send.disabled = true; stop.hidden = false; $("#ai-suggest").hidden = true;
      input.value = "";
      bubble("user", `<p>${esc(q)}</p>`);
      turns.push({ role: "user", content: q });
      const bytes = s => new TextEncoder().encode(s).length;
      const rules = RULES(turns.slice(-4).map(x => x.content));
      const base = bytes(rules);
      while (turns.length > 1 && (turns.length > 10 || base + turns.reduce((a, x) => a + bytes(x.content), 0) > 60000)) turns.shift();
      if (turns[0] && turns[0].role === "assistant") turns.shift();
      const out = bubble("assistant", `<p class="ai-thinking">${T("Бодож байна…", "Thinking…")}</p>`);
      ctl = new AbortController();
      try {
        const opts = { cache: false, signal: ctl.signal };
        if (lim && lim.tools) opts.tools = [{
          name: "get_bird",
          description: "Returns the full profile (size, field marks, similar species, habitat, range, voice, where to see) of one bird in this guide. Input: the bird id from the index, e.g. \"saker\".",
          inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
          execute: ({ id }) => { const b = byId[String(id)]; if (!b) throw new Error("unknown id"); return birdDetail(b); }
        }];
        const { text, truncated } = await sample([{ role: "user", content: rules }, ...turns], {
          ...opts,
          onText: ({ text }) => { out.innerHTML = aiFormat(text); log.scrollTop = log.scrollHeight; }
        });
        out.innerHTML = aiFormat(text) + (truncated ? `<p class="ai-note">${T("Хариулт тасарсан — асуултаа хэсэгчлэн асууна уу.", "The answer was cut short — try asking in smaller parts.")}</p>` : "");
        turns.push({ role: "assistant", content: text });
      } catch (e) {
        turns.pop();
        if (e && e.code === "cancelled") out.innerHTML = e.text ? aiFormat(e.text) + `<p class="ai-note">${T("Зогсоосон.", "Stopped.")}</p>` : `<p class="ai-note">${T("Зогсоосон.", "Stopped.")}</p>`;
        else {
          out.innerHTML = (e && e.text ? aiFormat(e.text) : "") + `<p class="ai-err">${esc(aiErr(e))}</p>`;
          if (e && HIDE_CODES.includes(e.code)) { $("#ai-form").hidden = true; $("#photo-ai").hidden = true; }
        }
      } finally {
        busy = false; send.disabled = false; stop.hidden = true; ctl = null;
        log.scrollTop = log.scrollHeight;
      }
    }
    $("#ai-form").addEventListener("submit", e => { e.preventDefault(); ask(); });
    input.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } });
    stop.onclick = () => ctl && ctl.abort();

    // Зургаар таних — Claude зургийг харна
    if (!lim || !lim.images) return;
    $("#photo-ai").hidden = false;
    if (lastPhoto) $("#photo-ai-btn").disabled = false;
    $("#photo-ai-btn").onclick = async () => {
      if (!lastPhoto) return;
      const btn = $("#photo-ai-btn"), outEl = $("#photo-ai-out");
      btn.disabled = true; outEl.hidden = false;
      outEl.innerHTML = `<p class="status"><span class="spinner"></span>${T("Claude зургийг харж байна… (10–40 секунд)", "Claude is looking at the photo… (10–40 seconds)")}</p>`;
      const list = BIRDS.map(b => `${b.id}: ${b.name} (${latinClean(b)}, ${b.en})`).join("\n");
      const prompt = `Хавсаргасан зураг дээрх шувууг тани. Боломжит ${BIRDS.length} зүйл (id: нэр):\n${list}\n\n` +
        `Зөвхөн дараах бүтэцтэй JSON-оор хариул:\n{"is_bird": true, "candidates": [{"id": "<дээрх id>", "confidence": 0-100, "reason": "<${T("монголоор", "in English")}, харагдаж буй шинжээр 1 өгүүлбэр>"}], "note": "<${T("монголоор", "in English")} 1–2 өгүүлбэр: зургийн чанар, эсвэл энэ жагсаалтад ороогүй шувуу бол түүний магадлалтай нэр>"}\n` +
        `candidates-д хамгийн магадлалтай 1–3 зүйлийг буурах дарааллаар өг. Зураг дээр шувуу байхгүй бол is_bird=false, candidates=[] болго.`;
      try {
        const r = await sample.json(prompt, { images: lastPhoto });
        const cands = Array.isArray(r && r.candidates) ? r.candidates.filter(c => byId[String(c.id)]) : [];
        let html = `<h4 class="ai-photo-title">${T("✦ AI туслахын дүгнэлт", "✦ AI assistant's verdict")}</h4>`;
        if (r && r.is_bird === false) html += `<p>${T("Зураг дээр шувуу олдсонгүй.", "No bird found in the photo.")}</p>`;
        html += cands.map(c => resultRow(byId[String(c.id)], Math.max(0, Math.min(99, Number(c.confidence) || 0)) / 100, String(c.reason || ""))).join("");
        if (r && r.note) html += `<p class="muted ai-photo-note">${esc(String(r.note))}</p>`;
        outEl.innerHTML = html;
      } catch (e) {
        outEl.innerHTML = `<p class="ai-err">${esc(aiErr(e))}</p>`;
        if (e && HIDE_CODES.includes(e.code)) $("#photo-ai").hidden = true;
      } finally { btn.disabled = false; }
    };
  }

  /* ---------------- Init ---------------- */
  if (LANG === "en") {
    $$("[data-en]").forEach(el => { el.innerHTML = el.dataset.en; });
    $$("[data-en-ph]").forEach(el => { el.placeholder = el.dataset.enPh; });
    $$("[data-en-aria]").forEach(el => { el.setAttribute("aria-label", el.dataset.enAria); });
    document.title = "MongolShuvuu — Birds of Mongolia field guide";
  }
  $$("[data-lang]").forEach(b => {
    const on = b.dataset.lang === LANG;
    b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on));
    b.addEventListener("click", () => { if (b.dataset.lang !== LANG) setLang(b.dataset.lang); });
  });
  renderChips(); renderGallery(); initMap(); initTraits(); initPhoto(); initSound(); initRoutes(); initPlaces(); initAI();
  const h = location.hash.slice(1);
  if (h.startsWith("bird-")) openBird(h.slice(5), false);
  else if (h.startsWith("route-")) { showTab("routes", false); selectRoute(h.slice(6)); }
  else if (h) showTab(h, false);
})();
