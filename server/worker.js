/* МонголШувуу — мэдэгдлийн сервер (Cloudflare Workers)
   Өдөр бүр хэрэглэгчийн сонгосон цагт "карт цээжлэх цаг боллоо" гэсэн Web Push мэдэгдэл илгээнэ.

   Тохиргоо (Cloudflare самбар дээр):
     • KV namespace үүсгээд Worker-т MBIRD нэрээр холбоно (Settings → Bindings → KV namespace, Variable name: MBIRD)
     • Cron trigger: 30 минут тутам (яг бичлэгийг README.md-ээс харна уу)
   Нууц түлхүүр гараар оруулах шаардлагагүй: VAPID түлхүүрийг анхны хүсэлтээр өөрөө үүсгэж KV-д хадгална.

   Мэдэгдэл нь агуулгагүй (payload-гүй) илгээгддэг тул шифрлэлт хэрэггүй; текстийг сайтын service worker (sw.js) харуулна.
   Хадгалах зүйл: зөвхөн хөтчийн push хаяг (endpoint) ба цагийн слот. Нэр, и-мэйл, байршил хадгалахгүй. */

const ALLOWED_ORIGINS = ["https://bogdwildlife.github.io"];
const CONTACT = "https://bogdwildlife.github.io/";   // VAPID "sub" — push үйлчилгээ холбоо барих хаяг
// Зөвхөн албан ёсны push үйлчилгээнүүд рүү хүсэлт илгээнэ (сервэрийг өөр зорилгоор ашиглуулахгүй)
const PUSH_HOSTS = [/^fcm\.googleapis\.com$/, /^updates\.push\.services\.mozilla\.com$/, /\.notify\.windows\.com$/, /\.push\.apple\.com$/, /^web\.push\.apple\.com$/];

const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const enc = s => new TextEncoder().encode(s);
const json = (obj, status, cors) => new Response(JSON.stringify(obj), { status: status || 200, headers: { "content-type": "application/json", ...cors } });

async function sha(s) {
  const d = await crypto.subtle.digest("SHA-256", enc(s));
  return b64u(d).slice(0, 32);
}

async function vapid(env) {
  let v = await env.MBIRD.get("vapid", "json");
  if (!v) {
    const kp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
    v = { publicKey: b64u(await crypto.subtle.exportKey("raw", kp.publicKey)), privateJwk: await crypto.subtle.exportKey("jwk", kp.privateKey) };
    await env.MBIRD.put("vapid", JSON.stringify(v));
  }
  return v;
}

async function vapidHeader(v, endpoint) {
  const aud = new URL(endpoint).origin;
  const head = b64u(enc(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const body = b64u(enc(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: CONTACT })));
  const key = await crypto.subtle.importKey("jwk", v.privateJwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, enc(head + "." + body));
  return `vapid t=${head}.${body}.${b64u(sig)}, k=${v.publicKey}`;
}

function validEndpoint(u) {
  try { const x = new URL(u); return x.protocol === "https:" && PUSH_HOSTS.some(r => r.test(x.hostname)); } catch (e) { return false; }
}

// "HH:MM" (хэрэглэгчийн орон нутгийн цаг) + цагийн зөрүү (минут, Date.getTimezoneOffset()) → UTC 30 минутын слот "HHMM"
function slotOf(time, tz) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time || ""); if (!m) return null;
  const h = +m[1], mi = +m[2]; if (h > 23 || mi > 59 || !Number.isFinite(tz) || Math.abs(tz) > 900) return null;
  let utc = ((h * 60 + mi + tz) % 1440 + 1440) % 1440;
  utc = Math.floor(utc / 30) * 30;
  return String(Math.floor(utc / 60)).padStart(2, "0") + String(utc % 60).padStart(2, "0");
}

async function unsubscribe(env, endpoint) {
  const id = await sha(endpoint), old = await env.MBIRD.get("e:" + id);
  if (old) { await env.MBIRD.delete("s:" + old + ":" + id); await env.MBIRD.delete("e:" + id); }
}

async function sendPush(env, v, endpoint) {
  const res = await fetch(endpoint, { method: "POST", headers: { Authorization: await vapidHeader(v, endpoint), TTL: "43200", Urgency: "normal", "Content-Length": "0" } });
  if (res.status === 404 || res.status === 410) await unsubscribe(env, endpoint);   // бүртгэл хүчингүй болсон
  return res.status;
}

async function sendDue(env) {
  const now = new Date(), slot = String(now.getUTCHours()).padStart(2, "0") + (now.getUTCMinutes() < 30 ? "00" : "30");
  const v = await vapid(env);
  let cursor, sent = 0;
  do {
    const page = await env.MBIRD.list({ prefix: "s:" + slot + ":", cursor });
    for (const k of page.keys) {
      const endpoint = await env.MBIRD.get(k.name);
      if (endpoint && validEndpoint(endpoint)) { try { await sendPush(env, v, endpoint); sent++; } catch (e) {} }
    }
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);
  return sent;
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const cors = ALLOWED_ORIGINS.includes(origin) ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Access-Control-Allow-Headers": "content-type", "Access-Control-Max-Age": "86400", Vary: "Origin" } : {};
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    const path = new URL(req.url).pathname;
    try {
      if (req.method === "GET" && path === "/vapid") return json({ key: (await vapid(env)).publicKey }, 200, cors);
      if (req.method === "POST" && (path === "/subscribe" || path === "/unsubscribe" || path === "/test")) {
        if (!ALLOWED_ORIGINS.includes(origin)) return json({ error: "origin" }, 403, cors);
        const body = await req.json().catch(() => null);
        const endpoint = body && body.endpoint;
        if (!endpoint || endpoint.length > 1000 || !validEndpoint(endpoint)) return json({ error: "endpoint" }, 400, cors);
        if (path === "/unsubscribe") { await unsubscribe(env, endpoint); return json({ ok: true }, 200, cors); }
        if (path === "/test") return json({ ok: true, status: await sendPush(env, await vapid(env), endpoint) }, 200, cors);
        const slot = slotOf(body.time, Number(body.tz));
        if (!slot) return json({ error: "time" }, 400, cors);
        await unsubscribe(env, endpoint);
        const id = await sha(endpoint);
        await env.MBIRD.put("s:" + slot + ":" + id, endpoint);
        await env.MBIRD.put("e:" + id, slot);
        return json({ ok: true, slot }, 200, cors);
      }
      if (path === "/") return new Response("MongolShuvuu push server OK", { headers: cors });
      return json({ error: "not found" }, 404, cors);
    } catch (e) {
      return json({ error: "server" }, 500, cors);
    }
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(sendDue(env));
  }
};
