/* Build js/birds2*.js + js/ranges2.js from harvested source data and the text batches in src/b2.
   Run: cscript //nologo src\build.js <scratchpad-dir>
   Species are included only when MN, EN and FR texts all exist. */
var fso = new ActiveXObject("Scripting.FileSystemObject");
var ROOT = fso.GetParentFolderName(fso.GetParentFolderName(WScript.ScriptFullName));
var SP = WScript.Arguments.length ? WScript.Arguments(0) : "";

function readU(p) { var s = new ActiveXObject("ADODB.Stream"); s.Type = 2; s.Charset = "utf-8"; s.Open(); s.LoadFromFile(p); var t = s.ReadText(); s.Close(); return t.replace(/^﻿/, ""); }
function writeU(p, t) {
  var s = new ActiveXObject("ADODB.Stream"); s.Type = 2; s.Charset = "utf-8"; s.Open(); s.WriteText(t);
  s.Position = 3; var b = new ActiveXObject("ADODB.Stream"); b.Type = 1; b.Open(); s.CopyTo(b); b.SaveToFile(p, 2); b.Close(); s.Close(); // strip BOM
}
function J(p) { return eval("(" + readU(p) + ")"); }
function has(a, v) { for (var i = 0; i < a.length; i++) if (a[i] === v) return true; return false; }
function trim(s) { return String(s).replace(/^\s+|\s+$/g, ""); }
function q(s) { return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, "\\n") + '"'; }
function ser(v, ind) {
  ind = ind || "";
  if (v === null || v === undefined) return "null";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "string") return q(v);
  if (v instanceof Array) {
    var simple = true, i, out = [];
    for (i = 0; i < v.length; i++) { if (typeof v[i] === "object" && v[i] !== null) simple = false; out.push(ser(v[i], ind + "  ")); }
    return simple ? "[" + out.join(", ") + "]" : "[\n" + ind + "  " + out.join(",\n" + ind + "  ") + "\n" + ind + "]";
  }
  var parts = [], k;
  for (k in v) if (v.hasOwnProperty(k)) parts.push((/^[a-zA-Z_$][\w$]*$/.test(k) ? k : q(k)) + ": " + ser(v[k], ind + "  "));
  return "{\n" + ind + "  " + parts.join(",\n" + ind + "  ") + "\n" + ind + "}";
}
function serFlat(v) { // one-line objects (colors, image)
  var parts = [], k; for (k in v) if (v.hasOwnProperty(k)) parts.push(k + ": " + ser(v[k])); return "{ " + parts.join(", ") + " }";
}

// ---------- sources ----------
var master = J(SP + "\\species-master.json");
var iucn = J(SP + "\\iucn-new.json");
var gbif = J(SP + "\\gbif-new.json");
var fams = J(SP + "\\families.json");
var famMN = J(SP + "\\fam-mn.json");

// ---------- text batches ----------
var TXT = { mn: {}, en: {}, fr: {} };
function B2T(lang, obj) { for (var k in obj) if (obj.hasOwnProperty(k)) { if (TXT[lang][k]) WScript.Echo("WARN duplicate " + lang + " " + k); TXT[lang][k] = obj[k]; } }
var e = new Enumerator(fso.GetFolder(ROOT + "\\src\\b2").Files);
for (; !e.atEnd(); e.moveNext()) { var f = e.item(); if (/\.js$/.test(f.Name)) { try { eval(readU(f.Path)); } catch (err) { WScript.Echo("ERROR in " + f.Name + ": " + err.message); WScript.Quit(1); } } }

// ---------- lookups ----------
var ORDER_MN = { Accipitriformes: "Хэрцгийтнүүд", Anseriformes: "Галуушууд", Pterocliformes: "Ногтруушууд", Galliformes: "Тахиатнууд", Gruiformes: "Тогоруушууд", Piciformes: "Тоншуулшууд", Charadriiformes: "Хиазаншууд", Passeriformes: "Бор шувуушууд", Strigiformes: "Шар шувуушууд", Falconiformes: "Шонхоршууд", Ciconiiformes: "Өрөвтаснууд" };
var IUCN_T = {
  mn: { EX: "Устсан", EW: "Байгальд устсан", CR: "Устаж болзошгүй", EN: "Устах аюулд орсон", VU: "Эмзэг", NT: "Ховордож болзошгүй", LC: "Анхаарал бага шаардлагатай", DD: "Мэдээлэл дутмаг", NE: "Үнэлээгүй" },
  en: { EX: "Extinct", EW: "Extinct in the Wild", CR: "Critically Endangered", EN: "Endangered", VU: "Vulnerable", NT: "Near Threatened", LC: "Least Concern", DD: "Data Deficient", NE: "Not Evaluated" },
  fr: { EX: "Éteinte", EW: "Éteinte à l’état sauvage", CR: "En danger critique", EN: "En danger", VU: "Vulnérable", NT: "Quasi menacée", LC: "Préoccupation mineure", DD: "Données insuffisantes", NE: "Non évaluée" }
};
var HS = { ulaanbaatar: [106.9, 47.92], hustai: [105.85, 47.7], terelj: [107.6, 48.0], khuvsgul: [100.45, 51.0], ugii: [102.77, 47.78], terkh: [99.75, 48.17], orkhon: [102.0, 46.8], kharus: [92.25, 48.05], uvs: [92.8, 50.3], achit: [90.55, 49.45], ulgii: [89.97, 48.97], tavanbogd: [88.25, 49.05], yoliin: [104.07, 43.49], ikhnart: [108.65, 45.7], boontsagaan: [99.25, 45.6], orog: [100.6, 45.05], taatsin: [101.6, 45.3], ganga: [114.0, 45.25], buir: [117.6, 47.75], daguur: [115.3, 49.6], khurkh: [110.45, 48.3], onon: [111.9, 49.1] };
function region(lon, lat) {
  if (lon < 96.5) return "west";
  if (lon < 104) return lat >= 46 ? "khangai" : "gobi";
  if (lon < 110.5) return lat >= 47.5 ? "north" : (lat >= 46 ? "central" : "gobi");
  return lat >= 45 ? "east" : "gobi";
}
function sizeClass(len) { var m = /(\d+(\.\d+)?)/.exec(len || ""), v = m ? parseFloat(m[1]) : 30; var m2 = /[–-]\s*(\d+(\.\d+)?)/.exec(len || ""); if (m2) v = (v + parseFloat(m2[1])) / 2; return v < 35 ? "small" : v < 75 ? "medium" : v < 110 ? "large" : "xlarge"; }
var SWANGEESE = /^(Cygnus|Anser|Branta)\s/;

// ---------- build ----------
var outMN = [], outEN = [], outFR = [], outR = [], ids = [], missing = { mn: 0, en: 0, fr: 0 }, noimg = [];
for (var i = 0; i < master.length; i++) {
  var s = master[i]; if (s.onSite) continue;
  var id = s.id, tm = TXT.mn[id], te = TXT.en[id], tf = TXT.fr[id];
  if (!tm || !te || !tf) { if (tm || te || tf) WScript.Echo("partial " + id + " mn:" + !!tm + " en:" + !!te + " fr:" + !!tf); continue; }
  var w = {}; if (fso.FileExists(SP + "\\wiki\\" + id + ".json")) w = J(SP + "\\wiki\\" + id + ".json");
  var fam = fams[s.fam], famL = s.fam.charAt(0).toUpperCase() + s.fam.substr(1), t = te.T || {};
  // names
  var mnName = tm.name || s.mn || w.mnwiki || s.eng, alts = [], parts = String(s.mnAll || "").split(";"), j;
  for (j = 0; j < parts.length; j++) { var nm = trim(parts[j].replace(/\[[^\]]*\]/g, "")); if (nm && nm !== mnName && !has(alts, nm)) alts.push(nm); }
  if (w.mnwiki) { var mw = trim(String(w.mnwiki).replace(/\s*\(.*\)$/, "")); if (mw && mw !== mnName && !has(alts, mw) && !/^[A-Z]/.test(mw)) alts.push(mw); }
  if (tm.alt) for (j = 0; j < tm.alt.length; j++) if (!has(alts, tm.alt[j])) alts.push(tm.alt[j]);
  var enName = te.name || s.eng, frName = tf.name || trim(String(w.fr || "").replace(/\s*\(.*\)$/, "")) || s.accepted;
  // status
  var code = iucn[id] || "NE"; if (code === "NE" && w.status && IUCN_T.en[String(w.status).toUpperCase()]) code = String(w.status).toUpperCase();
  // range
  var g = gbif[id], reg = {}, hsc = {}, tot = 0, cells = [], k;
  if (g && g.cells) for (k in g.cells) if (g.cells.hasOwnProperty(k)) {
    var xy = k.split(","), x = +xy[0], y = +xy[1], n = +g.cells[k], lon = 87.5 + x * 0.5 + 0.25, lat = 41.5 + y * 0.5 + 0.25, r = region(lon, lat);
    reg[r] = (reg[r] || 0) + n; tot += n; cells.push(x, y, n);
    for (var h in HS) if (Math.abs(HS[h][0] - lon) <= 0.5 && Math.abs(HS[h][1] - lat) <= 0.5) hsc[h] = (hsc[h] || 0) + n;
  }
  var regions = [], hots = [];
  for (k in reg) if (reg[k] >= Math.max(2, tot * 0.05)) regions.push([k, reg[k]]);
  regions.sort(function (a, b) { return b[1] - a[1]; });
  for (k in hsc) if (hsc[k] >= 3) hots.push([k, hsc[k]]);
  hots.sort(function (a, b) { return b[1] - a[1]; });
  var R = []; for (j = 0; j < regions.length; j++) R.push(regions[j][0]);
  var H = []; for (j = 0; j < hots.length && j < 5; j++) H.push(hots[j][0]);
  if (tm.regions) R = tm.regions; if (tm.hotspots) H = tm.hotspots;
  if (g && g.total > 0) outR.push(q(id) + ": { k: " + g.key + ", n: " + g.total + ", u: " + g.used + ", y: [" + g.y0 + ", " + g.y1 + "], m: [" + g.months.join(", ") + "], c: [" + cells.join(",") + "] }");
  // image
  var img = null;
  if (w.img && !fso.FileExists(ROOT + "\\images\\" + id + ".jpg") && fso.FileExists(SP + "\\newimg\\" + id + ".jpg")) fso.CopyFile(SP + "\\newimg\\" + id + ".jpg", ROOT + "\\images\\" + id + ".jpg");
  if (w.img && fso.FileExists(ROOT + "\\images\\" + id + ".jpg")) img = { file: "images/" + id + ".jpg", credit: trim(w.img.credit || "Wikimedia Commons").substr(0, 80) || "Wikimedia Commons", via: w.img.via, source: w.img.source };
  else { noimg.push(id); img = { file: "images/nophoto.svg", credit: "", source: "", none: true }; }
  var sz = t.sz || ["—", "—", "—"], szMN = [], szFR = [];
  for (j = 0; j < 3; j++) {
    szMN.push(String(sz[j]).replace(/(\d),(\d{3})/g, "$1$2").replace(/\bcm\b/, "см").replace(/\bkg\b/, "кг").replace(/\bg\b/, "г").replace(/\bm\b/, "м"));
    szFR.push(String(sz[j]).replace(/(\d),(\d{3})/g, "$1 $2"));
  }
  var grp = fam[3]; if (grp === "duck" && SWANGEESE.test(s.accepted)) grp = "waterfowl";
  var orderMN = ORDER_MN[fam[0]] ? ORDER_MN[fam[0]] + " (" + fam[0] + ")" : fam[0] + " баг";
  var ecode = "(" + code + ")";
  var b = {
    id: id, name: mnName, altNames: alts.join(", "), latin: s.accepted, en: enName,
    order: orderMN, family: (famMN[s.fam] || famL) + " (" + famL + ")", iucn: code,
    statusText: tm.st || ("Олон улсад \"" + IUCN_T.mn[code] + "\" " + ecode + "."),
    length: szMN[0], wingspan: szMN[1], weight: szMN[2], sizeClass: sizeClass(sz[0]), group: grp,
    colors: t.c || { brown: 1 }, habitats: t.hb || [], beak: t.bk || "short", behaviors: t.bh || [], season: t.se || ["passage"],
    regions: R, hotspots: H, voiceTypes: t.vt || [], active: t.ac || "day",
    summary: tm.s, description: tm.d, features: tm.f, similar: tm.si, habitatText: tm.h, distribution: tm.di, migration: tm.mi,
    food: tm.fo, breeding: tm.br, behavior: tm.be, voice: tm.v, culture: tm.cu, conservation: tm.co, watching: tm.w, bestTime: tm.bt, facts: tm.fa,
    image: img, audio: null, extra: true
  };
  var line = ser(b, "  ").replace(/colors: \{[^}]*\}/, "colors: " + serFlat(b.colors));
  if (img && !img.none) line = line.replace(/image: \{[^}]*\}/, "image: " + serFlat(img));
  outMN.push("  " + line);
  function tx(o, extra) { var r = extra || {}; r.summary = o.s; r.description = o.d; r.features = o.f; r.similar = o.si; r.habitatText = o.h; r.distribution = o.di; r.migration = o.mi; r.food = o.fo; r.breeding = o.br; r.behavior = o.be; r.voice = o.v; r.culture = o.cu; r.conservation = o.co; r.watching = o.w; r.bestTime = o.bt; r.facts = o.fa; return r; }
  outEN.push("  " + q(id) + ": " + ser(tx(te, { name: enName, altNames: te.alt ? te.alt.join(", ") : "", order: fam[0], family: famL + " (" + fam[1] + ")", statusText: te.st || (IUCN_T.en[code] + " " + ecode + "."), length: sz[0], wingspan: sz[1], weight: sz[2] }), "  "));
  outFR.push("  " + q(id) + ": " + ser(tx(tf, { name: frName, altNames: tf.alt ? tf.alt.join(", ") : "", order: fam[0], family: famL + " (" + fam[2] + ")", statusText: tf.st || (IUCN_T.fr[code] + " " + ecode + "."), length: szFR[0], wingspan: szFR[1], weight: szFR[2] }), "  "));
  ids.push(id);
}

var HEAD = "/* Монгол орны бусад шувууд — src/build.js-ээр үүсгэсэн, гараар бүү засаарай.\n   Нэр: sibagu.com, Монгол Википедиа; IUCN: GBIF/IUCN; тархац: GBIF.org; зураг: Wikimedia Commons (CC). */\n";
// the featured 48 used one "small" group; with the full list they move into the finer groups
var REGROUP = "\n// Онцлох 48 шувууны «Жижиг шувуу» бүлгийг нарийвчилсан бүлгүүдэд шилжүүлнэ\n" +
  "(function () {\n  const RG = { \"mongolian-lark\": \"lark\", \"horned-lark\": \"lark\", \"asian-rosy-finch\": \"finch\", \"white-winged-snowfinch\": \"finch\", \"common-rosefinch\": \"finch\", " +
  "\"siberian-rubythroat\": \"thrush\", \"himalayan-rubythroat\": \"thrush\", \"bluethroat\": \"thrush\", \"siberian-stonechat\": \"thrush\", \"white-throated-dipper\": \"thrush\", " +
  "\"white-winged-redstart\": \"thrush\", \"daurian-redstart\": \"thrush\", \"azure-winged-magpie\": \"crow\", \"hoopoe\": \"nearpass\" };\n" +
  "  BIRDS.forEach(b => { if (RG[b.id]) b.group = RG[b.id]; });\n})();\n";
writeU(ROOT + "\\js\\birds2.js", HEAD + "BIRDS.push(\n" + outMN.join(",\n") + "\n);\n" + REGROUP);
writeU(ROOT + "\\js\\birds2_en.js", "/* English profiles for js/birds2.js — generated by src/build.js */\nObject.assign(BIRDS_EN, {\n" + outEN.join(",\n") + "\n});\n");
writeU(ROOT + "\\js\\birds2_fr.js", "/* Fiches françaises pour js/birds2.js — générées par src/build.js */\nObject.assign(BIRDS_FR, {\n" + outFR.join(",\n") + "\n});\n");
writeU(ROOT + "\\js\\ranges2.js", "/* GBIF grids for js/birds2.js — generated by src/build.js */\nObject.assign(RANGES, {\n  " + outR.join(",\n  ") + "\n});\n");
WScript.Echo("built " + ids.length + " species; no image: " + noimg.join(" "));
