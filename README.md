# ENews - Modern Medya Platformu

ENews, Next.js tabanli modern bir haber platformudur.  
Projede kategori filtreleme, arama, haber detaylari, admin paneli, rich text icerik yonetimi ve Supabase Storage ile resim yukleme akisi bulunur.

## Teknoloji Yigini

- `Next.js 16` (App Router, Route Handlers)
- `React 19` + `TypeScript`
- `Tailwind CSS 4`
- `Prisma 7` + `@prisma/adapter-pg` + `pg`
- `Supabase` (PostgreSQL + Storage)
- `TipTap` (Rich Text Editor)

## Mimari ve Klasor Yapisi

- `src/app`: Next.js App Router sayfalari ve API route'lari
  - `src/app/api/articles`: haber okuma/yazma endpoint'leri
  - `src/app/api/admin/uploads/image`: admin resim yukleme endpoint'i
  - `src/app/admin`: login, haber ekleme, listeleme, duzenleme ekranlari
- `src/components`: UI bilesenleri
  - `src/components/home`: ana sayfa bilesenleri
  - `src/components/admin`: admin formlari ve TipTap editor
- `src/lib`: uygulama servis/yardimci katmani
  - `src/lib/prisma.ts`: Prisma singleton + `PrismaPg` adapter kurulumu
  - `src/lib/server`: auth ve Supabase admin helper'lari
- `prisma`: schema, migration ve seed dosyalari

## Kurulum

1. Bagimliliklari yukleyin:

```bash
npm install
```

2. Ortam degiskenlerini hazirlayin:

```bash
cp .env.example .env
```

3. `.env` dosyasini asagidaki degerlerle guncelleyin:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `ADMIN_API_KEY` veya `ADMIN_UI_PASSWORD`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_NEWS_BUCKET` (opsiyonel, varsayilan: `news-images`)

Ornek `.env`:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
ADMIN_UI_PASSWORD="super-secret-password"
SUPABASE_URL="https://<project-ref>.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="service-role-key"
SUPABASE_NEWS_BUCKET="news-images"
```

4. Prisma client uretin:

```bash
npm run prisma:generate
```

5. Gelistirme sunucusunu baslatin:

```bash
npm run dev
```

Uygulama varsayilan olarak `http://localhost:3000` adresinde calisir.

## Veritabani ve Prisma Notlari

- Migration icin:

```bash
npm run prisma:migrate
```

- Seed calistirmak icin:

```bash
npm run prisma:seed
```

- Prisma Studio acmak icin:

```bash
npm run prisma:studio
```

### Prisma 7 Runtime Notu

Bu projede Prisma client, `src/lib/prisma.ts` icinde `PrismaPg` adapter ile olusturulur.

Eger su hatayi gorurseniz:

`Using engine type "client" requires either "adapter" or "accelerateUrl" to be provided to PrismaClient constructor`

asagilari kontrol edin:

1. `src/lib/prisma.ts` icinde `adapter: new PrismaPg(...)` kullanildigi
2. `.env` dosyasinda `DATABASE_URL` oldugu
3. Degisiklikten sonra `npm run dev` yeniden baslatildigi

## Admin Paneli

### Giris

- URL: `/admin/login`
- Giris dogrulamasi `ADMIN_UI_PASSWORD` (veya fallback olarak `ADMIN_API_KEY`) ile yapilir.
- Basarili giristen sonra admin session cookie olusur.

### Haber Yonetimi

- Yeni haber: `/admin/new-article`
- Listeleme + arama + sayfalama: `/admin/articles`
- Duzenleme: `/admin/articles/[slug]`
- Silme: Liste ekranindan yapilir.

### Rich Text Editor

Admin icerik editorunde su ozellikler vardir:

- Kalin, italik
- Alt baslik
- Madde ve numarali listeler
- Link ekleme/duzenleme modal'i
- Resim ekleme modal'i
- Resim alt yazisi (caption)

## Resim Yukleme (Supabase Storage)

### Akis

1. Admin editorunde `Resim` butonuna tiklanir.
2. Modal icindeki `Dosya Yukle` ile gorsel secilir.
3. Dosya `POST /api/admin/uploads/image` endpoint'ine gider.
4. Endpoint resmi Supabase Storage bucket'ina yukler.
5. Donen public URL otomatik olarak modaldeki URL alanina yazilir.
6. `Resmi Ekle` ile editor icerigine `figure + figcaption` olarak eklenir.

### Endpoint

- `POST /api/admin/uploads/image`
- Sadece admin yetkisi olan istekleri kabul eder.
- Sadece `image/*` dosyalari kabul edilir.
- Maksimum dosya boyutu: `8MB`.

## Faydalı Komutlar

```bash
npm run dev
npm run lint
npm run build
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run prisma:studio
```
