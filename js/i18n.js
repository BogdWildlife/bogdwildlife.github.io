/* Хэлний тохиргоо — Language setting (mn / en) */
const LANG = (function () {
  let l = null;
  try { l = localStorage.getItem("mbird-lang"); } catch (e) {}
  if (!l) { const m = /mbird-lang=(mn|en)/.exec(window.name || ""); if (m) l = m[1]; }
  return l === "en" ? "en" : "mn";
})();
document.documentElement.lang = LANG;

// T("монгол текст", "English text") — сонгосон хэлээр буцаана
function T(mn, en) { return LANG === "en" ? en : mn; }

function setLang(l) {
  try { localStorage.setItem("mbird-lang", l); } catch (e) {}
  window.name = "mbird-lang=" + l;
  location.reload();
}
