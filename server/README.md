# МонголШувуу — мэдэгдлийн сервер (Cloudflare Workers)

Өдөр бүр хэрэглэгчийн сонгосон цагт «Карт цээжлэх цаг боллоо» гэсэн мэдэгдэл илгээнэ.
Үнэгүй багцад багтана. Код: `worker.js`.

## Байрлуулах алхмууд (Node.js шаардлагагүй, бүгд вэб самбар дээр)

1. https://dash.cloudflare.com дээр үнэгүй бүртгэл нээж нэвтэрнэ.
2. **Storage & Databases → KV → Create** — нэр: `mbird`.
3. **Workers & Pages → Create → Create Worker** — нэр: `mbird-push` → **Deploy**.
4. **Edit code** дарж, доторх кодыг бүгдийг нь устгаад `worker.js` файлын агуулгыг хуулж тавиад **Deploy**.
5. Worker-ийн **Settings → Bindings → Add → KV namespace**:
   Variable name: `MBIRD`, KV namespace: `mbird` → **Deploy**.
6. **Settings → Trigger Events → Add → Cron Triggers**: `*/30 * * * *` → **Add**.
7. Worker-ийн хаягийг хуулна (жишээ: `https://mbird-push.НЭР.workers.dev`).
   Хөтчөөр нээхэд `MongolShuvuu push server OK` гэж гарвал ажиллаж байна.
8. Тэр хаягийг `js/app.js` доторх `const PUSH_API = "";` мөрөнд бичээд сайтаа push хийнэ.

## Юу хадгалдаг вэ

Зөвхөн хөтчийн push хаяг (endpoint) ба цагийн слот. Нэр, и-мэйл, байршил хадгалахгүй.
VAPID түлхүүрийг сервер анхны хүсэлтээр өөрөө үүсгэж KV-д хадгална.

## Хязгаар

- Мэдэгдэл 30 минутын нарийвчлалтай (cron 30 минут тутам ажиллана).
- iPhone: зөвхөн нүүр дэлгэцэд суулгасан апп (iOS 16.4+).
- Үнэгүй багц: өдөрт 100,000 хүсэлт, KV-д өдөрт 1,000 бичилт.
