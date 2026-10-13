# راهنمای ورود مدیر و انتشار MOSAIX

این راهنما مربوط به تصمیم جدید مالک است: OpenAI برای دستیار و GitHub + Vercel برای انتشار. شرط قبلی self-hosted-only با این تصمیم جایگزین شده است. سایت هنوز منتشر نشده و حساب یا خریدی انجام نشده است.

## ورود به پنل

در نسخهٔ محلی: http://127.0.0.1:4180/admin
پس از انتشار: https://YOUR-DOMAIN/admin

ایمیل و رمز اولیه در فایل خصوصی .local-admin/owner-credentials.txt داخل پروژه قرار می‌گیرند. اگر هنوز ایجاد نشده‌اند، از پوشهٔ پروژه npm run setup:owner را اجرا کن. فایل خصوصی را در GitHub قرار نده و کلیدها را در چت نفرست. دستور npm run setup:owner -- --rotate رمز جدید می‌سازد و نشست‌های قدیمی را باطل می‌کند؛ اطلاعات تازهٔ سرور را هم باید در Vercel جایگزین کنی.

پنل متن خانه و Hero، لوگو و شعار، ویدیوی ورود، خدمات و ویدیوهای آن‌ها، فرایند همکاری، معرفی تیم و عکس‌ها، پروژه‌ها، Lab، تماس، ظاهر، تنظیمات دستیار و SEO را مدیریت می‌کند. شناسه و آدرس پنج خدمت اصلی ثابت‌اند. تغییر شکل انیمیشن یا ساختار برنامه را با من در کد انجام بده. اطلاعات خدمات نباید قیمت یا تخمین قیمت داشته باشند.

Save changes تغییرات را در ذخیره‌سازی پایدار ثبت می‌کند. با تازه‌کردن سایت ظاهر می‌شوند؛ فایل کد یا GitHub تغییر نمی‌کند. بخش Restore نسخه‌های قبلی را برمی‌گرداند و خودش نسخهٔ جدید می‌سازد. انتشار نسخهٔ تازهٔ کد تنظیمات پنل را پاک نمی‌کند: فیلدهای تغییرنداده‌شده از کد جدید پیروی می‌کنند، فیلدهایی که در پنل تغییر داده‌ای اولویت دارند.

## اتصال OpenAI

در داشبورد OpenAI Platform یک کلید API برای پروژه بساز. دسترسی API و اعتبار حساب را خودت فعال کن. اشتراک ChatGPT یا Codex به معنی آماده‌بودن اعتبار API سایت نیست.

در Vercel، Project → Settings → Environment Variables:
- OPENAI_API_KEY: کلید خصوصی OpenAI
- MOSAIX_AI_PROVIDER: openai
- MOSAIX_AI_ENABLED: true
- MOSAIX_OPENAI_MODEL: gpt-6-sol
- MOSAIX_AI_DAILY_REQUEST_LIMIT: 200 یا سقف مناسب خودت
- MOSAIX_AI_TRUST_PROXY: true

کلید فقط سمت سرور استفاده می‌شود. هیچ کلیدی با پیشوند NEXT_PUBLIC_ نساز.
در پنل Check connections دسترسی کلید به مدل بررسی می‌شود؛ این بررسی کیفیت مکالمه نیست. پس از اتصال، مکالمهٔ واقعی، حافظه، خلاصهٔ پروژه و سیاست عدم اعلام قیمت را ارزیابی کن. زیرساخت بدون کلید آزمون شده ولی پاسخ واقعی OpenAI هنوز ارزیابی نشده است.

درخواست‌ها از Responses API و store:false استفاده می‌کنند. این گزینه به معنی حذف همهٔ نگهداری‌های احتمالی OpenAI نیست. پیام‌ها به OpenAI ارسال می‌شوند؛ اطلاعات حساس ننویس. زمینهٔ موقت گفتگو تا ۳۰ دقیقه در ذخیره‌سازی سایت می‌ماند و با Clear conversation پاک می‌شود.

## ذخیره‌سازی پایدار و دسترسی مدیر

یک پایگاه Redis سازگار با Upstash REST به پروژهٔ Vercel متصل کن. راه ساده استفاده از ادغام Upstash در Marketplace خود Vercel است. پیش از ساخت سرویس، شرایط حساب و هزینهٔ آن را خودت بررسی کن. این پروژه هیچ سرویس پولی ایجاد نکرده است.

متغیرها:
- UPSTASH_REDIS_REST_URL
- UPSTASH_REDIS_REST_TOKEN
- MOSAIX_DATA_NAMESPACE: mosaix-production برای محیط Production
- ADMIN_EMAIL
- ADMIN_PASSWORD_HASH
- ADMIN_SESSION_SECRET

سه مقدار ADMIN را از بخش Vercel server settings فایل خصوصی owner-credentials.txt منتقل کن. رمز واقعی را در ADMIN_PASSWORD_HASH وارد نکن؛ این متغیر باید همان هش تولیدشده باشد.

برای Preview از namespace جدا مثل mosaix-preview استفاده کن. Preview نباید به داده‌های Production بنویسد. اگر Redis تنظیم نشده باشد، پنل و دستیار روی Vercel کار نمی‌کنند؛ سایت عمومی با محتوای اولیه نمایش داده می‌شود. در کامپیوتر توسعه، محتوای پنل در پوشهٔ خصوصی .local-admin/store ذخیره می‌شود. انتقال به سرور خودکار نیست: از Export content پنل محلی نسخه بگیر و با Import content پنل منتشرشده وارد کن.

## تصاویر و ویدیوها

برای آپلود از پنل، یک Vercel Blob store عمومی به پروژه متصل کن و BLOB_READ_WRITE_TOKEN را فقط سمت سرور تنظیم کن. Media library عکس PNG/JPEG/WebP و ویدیو MP4 تا ۲۰۰ مگابایت می‌پذیرد. فایل‌ها رسانهٔ عمومی سایت‌اند، محل اسناد خصوصی نیستند. URL فایل آپلودشده را در فیلد لوگو، عکس یا ویدیو جای‌گذاری کن. مسیرهای موجود /brand/... و /media/... هم قابل استفاده‌اند. حذف فایل‌های اصلی انجام نشده است.

## GitHub و Vercel

۱. پروژهٔ اصلی همین پوشه است: E:/MOSAIX_AI/Projects/MOSAIX-AI Website.
۲. در GitHub یک مخزن خصوصی یا عمومی طبق انتخاب خودت بساز. فایل‌های .env.local، .local-admin، .local-ai، node_modules و .next نباید ارسال شوند. .gitignore آن‌ها را مستثنا می‌کند. Videos نسخه‌های اصلی منبع است و برای انتشار لازم نیست؛ رسانه‌های سایت در public قرار دارند.
۳. این پوشه را به مخزن خودت وصل کن و commit/push اولیه را انجام بده.
۴. در Vercel گزینهٔ Add New Project → Import Git Repository را انتخاب کن و همان مخزن را وارد کن.
۵. Framework: Next.js، Node.js: 24، Root Directory: پوشه‌ای که package.json در آن است، Build Command: npm run build:verified. Output Directory را پیش‌فرض بگذار.
۶. متغیرهای بالا را برای محیط درست وارد کن. SITE_URL باید مبدأ HTTPS دامنهٔ واقعی باشد، بدون مسیر اضافه؛ مثال https://mosaix.ai. تا قبل از آماده‌شدن انتشار، SITE_INDEXABLE=false بماند؛ برای انتشار نهایی true کن.
۷. Deploy را در حساب خودت انجام بده. دامنه را در Project → Settings → Domains اضافه کن و DNS ارائه‌شدهٔ Vercel را در مدیریت دامنه تنظیم کن.
۸. پس از هر تغییر متغیرهای محیط، Redeploy انجام بده. دامنه باید HTTPS فعال داشته باشد.
۹. بعد از انتشار، /admin را باز کن، وارد شو و اتصال‌ها و مکالمهٔ واقعی را بررسی کن.

## ویرایش‌های بعدی چگونه روی دامنه می‌آیند؟

تغییر کد با من → بررسی → commit → push به شاخهٔ Production متصل در Vercel → ساخت موفق → نسخهٔ جدید روی دامنه.
صرف ذخیرهٔ فایل روی این کامپیوتر سایت آنلاین را تغییر نمی‌دهد. Vercel پس از push شاخهٔ متصل انتشار را انجام می‌دهد. GitHub Actions هم بررسی می‌کند؛ جلوگیری از انتشار خراب با Build Command شامل آزمون‌ها در خود Vercel انجام می‌شود، نه صرفاً وجود یک workflow موازی.

تغییر محتوا در پنل منتشرشده → Save changes → ذخیره در Redis → تازه‌کردن صفحهٔ سایت. این مسیر به push نیاز ندارد.
برای انتقال تنظیمات محلی به سرور از Export/Import استفاده کن. محتوا را به محیط درست وارد کن؛ نسخهٔ Preview و Production جدا هستند.

اگر انتشار جدید مشکل داشت، نسخهٔ قبلی Vercel را Promote/Rollback کن. برای محتوای پنل از Restore استفاده کن؛ این دو نوع بازگردانی مستقل‌اند.

## منابع رسمی

- Responses streaming: https://developers.openai.com/api/docs/guides/streaming-responses
- Structured outputs: https://developers.openai.com/api/docs/guides/structured-outputs
- OpenAI data controls: https://developers.openai.com/api/docs/guides/your-data
- Vercel Git integration: https://vercel.com/docs/git
- Vercel environment variables: https://vercel.com/docs/environment-variables
- Vercel Blob: https://vercel.com/docs/vercel-blob/client-upload
