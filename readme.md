# Hafez API
این پروژه یک API برای درخواست و دریافت غزلیات حافظ است که با hono ساخته شده و می توانید آن را روی cloudflare workers اجرا کنید. برای مشاهده مستندات این API [اینجا کلیک کنید](https://moheb2000.github.io/hafez-api-cloudflare-workers/).
## نصب و راه اندازی
ابتدا سورس کد پروژه را دریافت کنید:
```
git clone https://github.com/moheb2000/hafez-api-cloudflare-workers.git
```
ابتدا وابستگی های لازم برای API را نصب کنید:
```
npm install
```
برای اجرا کردن تست ها می توانید دستور زیر را اجرا کنید. اگر با خطای time out مواجه شدید دوباره دستور را اجرا کنید (تلاش می کنم در فرصتی مناسب این مشکل را برطرف کنم).
```
npm test
```
برای تست و اجرای API روی سرور لوکال دستور زیر را اجرا کنید:
```
npm run dev
```
برای منتشر کردن API روی cloudflareworkers ابتدا فایل wrangler.toml را باز کنید و به جای hafez نام worker ساخته شده در cloudflare را وارد کنید. پس از آن دستور زیر را اجرا کنید:
```
npm run deploy
```
در صورت علاقه به اجرای این API در محیط های دیگر مانند node js به مستندات [hono](https://hono.dev/) مراجعه کنید.
