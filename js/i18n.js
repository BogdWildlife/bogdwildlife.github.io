/* Хэлний тохиргоо — Language setting (mn / en / fr) */
const LANG = (function () {
  let l = null;
  try { l = localStorage.getItem("mbird-lang"); } catch (e) {}
  if (!l) { const m = /mbird-lang=(mn|en|fr)/.exec(window.name || ""); if (m) l = m[1]; }
  return l === "en" || l === "fr" ? l : "mn";
})();
document.documentElement.lang = LANG;

// T("монгол текст", "English text"[, "texte français"]) — сонгосон хэлээр буцаана.
// Франц горимд 3 дахь аргумент байхгүй бол англи текстийг түлхүүр болгож FR_UI (js/i18n_fr.js)-ээс хайна.
function T(mn, en, fr) {
  if (LANG === "en") return en;
  if (LANG === "fr") {
    if (fr !== undefined) return fr;
    if (typeof FR_UI !== "undefined" && typeof en === "string" && Object.prototype.hasOwnProperty.call(FR_UI, en)) return FR_UI[en];
    return en;
  }
  return mn;
}

function setLang(l) {
  try { localStorage.setItem("mbird-lang", l); } catch (e) {}
  window.name = "mbird-lang=" + l;
  location.reload();
}
