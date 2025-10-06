# 🚀 Deployment Guide - Boyama Sayfası

## 📋 İçindekiler
- [Dokploy Deployment](#dokploy-deployment)
- [Environment Variables](#environment-variables)
- [Domain Ayarları](#domain-ayarları)
- [SSL/HTTPS](#ssl-https)
- [Database Setup](#database-setup)
- [Monitoring](#monitoring)
- [Backup Strategy](#backup-strategy)
- [Troubleshooting](#troubleshooting)

---

## 🐳 Dokploy Deployment

### 1. Repository Bağlantısı
```bash
Repository URL: https://github.com/kerimyeniyildiz/boyama-online
Branch: main
Auto Deploy: ✅ Enabled
```

### 2. Build Settings
```bash
Build Command: npm install && npm run build
Start Command: npm start
Port: 3000
Node Version: 18.x or 20.x
```

### 3. Environment Variables

**Dokploy Dashboard → Environment Variables** bölümüne ekleyin:

```env
# Site Configuration
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://boyamasayfasi.com.tr
NEXT_PUBLIC_SITE_NAME=Boyama Sayfası

# Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$10$EO7jh6pf8WnqhDHWmhHqweEhtSqBb39w6F61HXjEKAR3yVS5iHPz.

# Security
JWT_SECRET=zmGBPFPu6/D230OYq49194TKCzoLIQgMKrwmYzjd7Rw=
CSRF_SECRET=wmHIL8ZDjFEsz3DzlAZ6gwPbNzfg9SJTq9ede88hAf0=
NEXT_PUBLIC_SECURE_COOKIE=true
```

### 4. Health Check
```bash
Path: /
Port: 3000
Interval: 30s
```

---

## 🔐 Güvenlik Önlemleri

### Production Secrets Oluşturma

```bash
# JWT Secret (32+ karakter)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# CSRF Secret (32+ karakter)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Password Hash (bcrypt)
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YourStrongPassword', 10))"
```

### Güvenlik Checklist

- [ ] Güçlü admin şifresi kullan (min 12 karakter)
- [ ] JWT_SECRET ve CSRF_SECRET production'a özgü olsun
- [ ] HTTPS zorunlu (NEXT_PUBLIC_SECURE_COOKIE=true)
- [ ] Firewall kuralları ayarla (sadece 80, 443 portları açık)
- [ ] Regular security audits (`npm audit`)
- [ ] Environment variables şifreli sakla

---

## 🌐 Domain Ayarları

### DNS Configuration

**A Record:**
```
Type: A
Name: @
Value: [Sunucu IP Adresi]
TTL: 3600
```

**CNAME Record (www):**
```
Type: CNAME
Name: www
Value: boyamasayfasi.com.tr
TTL: 3600
```

### Dokploy Domain Setup

1. Dokploy Dashboard → Domains
2. Add Domain: `boyamasayfasi.com.tr`
3. Add www redirect: `www.boyamasayfasi.com.tr` → `boyamasayfasi.com.tr`

---

## 🔒 SSL/HTTPS Setup

### Let's Encrypt (Otomatik)

Dokploy otomatik SSL sağlar:

1. Domain DNS ayarlarını tamamla
2. Dokploy Dashboard → SSL/TLS
3. Enable Auto SSL (Let's Encrypt)
4. Certificate auto-renewal: ✅

### Manuel SSL (Cloudflare)

```bash
# Cloudflare SSL/TLS Settings
SSL/TLS Encryption Mode: Full (Strict)
Always Use HTTPS: On
Automatic HTTPS Rewrites: On
Minimum TLS Version: 1.2
```

---

## 💾 Database Migration (Gelecek için)

### PostgreSQL Setup

```bash
# 1. PostgreSQL Container oluştur
docker run -d \
  --name postgres-coloring \
  -e POSTGRES_USER=coloringuser \
  -e POSTGRES_PASSWORD=[güçlü-şifre] \
  -e POSTGRES_DB=coloring_pages \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:15-alpine

# 2. Environment variable ekle
DATABASE_URL=postgresql://coloringuser:[şifre]@localhost:5432/coloring_pages
```

### Migration Script

```bash
# lib/migrate-to-db.ts
npm run migrate:from-filesystem
```

---

## 📊 Monitoring & Analytics

### 1. Sentry (Error Tracking)

```bash
# Kurulum
npm install @sentry/nextjs

# .env.production
NEXT_PUBLIC_SENTRY_DSN=https://[your-dsn]@sentry.io/[project-id]
SENTRY_AUTH_TOKEN=[your-auth-token]
```

```javascript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

### 2. Google Analytics

```bash
# .env.production
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

```tsx
// app/layout.tsx
import Script from 'next/script';

<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
```

### 3. Uptime Monitoring

**UptimeRobot Setup:**
- Monitor Type: HTTPS
- URL: https://boyamasayfasi.com.tr
- Monitoring Interval: 5 minutes
- Alert: Email/SMS

---

## 💾 Backup Strategy

### Otomatik Backup Script

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/coloring-pages"
SOURCE_DIR="/app/public/coloring-pages"

# Backup images
tar -czf "$BACKUP_DIR/images_$DATE.tar.gz" "$SOURCE_DIR"

# Backup data
tar -czf "$BACKUP_DIR/data_$DATE.tar.gz" "/app/data"

# Keep last 30 days
find "$BACKUP_DIR" -mtime +30 -delete

# Upload to S3 (opsiyonel)
# aws s3 cp "$BACKUP_DIR/images_$DATE.tar.gz" s3://your-bucket/backups/
```

### Cron Job Setup

```bash
# Daily backup at 3 AM
0 3 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1
```

---

## 🔧 Performance Optimization

### 1. CDN Setup (Cloudflare)

```bash
# Cloudflare Settings
Cache Level: Standard
Browser Cache TTL: 4 hours
Always Online: On
Auto Minify: HTML, CSS, JS
Brotli Compression: On
```

### 2. Image Optimization

```bash
# Sharp config already optimized
# WebP/AVIF conversion enabled
# Lazy loading implemented
```

### 3. Database Indexing (Future)

```sql
-- Indexes for better performance
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_images_category ON images(category_id);
CREATE INDEX idx_images_upload_date ON images(upload_date);
```

---

## 🐛 Troubleshooting

### Build Fails

**Problem:** `DYNAMIC_SERVER_USAGE` error
```bash
# Solution: API routes'lara force-dynamic ekle
export const dynamic = 'force-dynamic';
```

**Problem:** Out of memory
```bash
# Dokploy settings
Memory Limit: 2GB (minimum)
NODE_OPTIONS: --max-old-space-size=4096
```

### Runtime Errors

**Problem:** 500 Internal Server Error
```bash
# Check logs
docker logs [container-id] --tail 100

# Check environment variables
printenv | grep -E "JWT|CSRF|ADMIN"
```

**Problem:** Images not loading
```bash
# Check file permissions
chmod -R 755 /app/public/coloring-pages

# Check Sharp installation
npm rebuild sharp
```

### Performance Issues

**Problem:** Slow page load
```bash
# Enable ISR
export const revalidate = 3600; // 1 hour

# Check CDN cache
curl -I https://boyamasayfasi.com.tr

# Analyze bundle
npm run build -- --profile
```

---

## 📈 Monitoring Checklist

### Daily
- [ ] Uptime status
- [ ] Error rate (Sentry)
- [ ] Response time

### Weekly
- [ ] Security updates (`npm audit`)
- [ ] Backup verification
- [ ] Disk space usage

### Monthly
- [ ] Performance audit (Lighthouse)
- [ ] SEO health check
- [ ] SSL certificate expiry
- [ ] Cost optimization

---

## 🔄 Update & Rollback

### Safe Deployment

```bash
# 1. Test locally
npm run build
npm start

# 2. Push to GitHub
git add .
git commit -m "Update: [description]"
git push origin main

# 3. Monitor Dokploy deployment
# 4. Verify production

# 5. Rollback if needed
git revert HEAD
git push origin main
```

### Zero-Downtime Deployment

Dokploy otomatik olarak zero-downtime deployment sağlar:
1. New container build edilir
2. Health check yapılır
3. Traffic yeni container'a yönlendirilir
4. Eski container kapanır

---

## 📞 Support & Resources

- **GitHub:** https://github.com/kerimyeniyildiz/boyama-online
- **Dokploy Docs:** https://dokploy.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Sentry:** https://sentry.io

---

## ✅ Production Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Security audit clean
- [ ] Environment variables set
- [ ] SSL certificate active
- [ ] Domain DNS configured

### Post-Deployment
- [ ] Health check passing
- [ ] Admin login working
- [ ] Image upload working
- [ ] PDF generation working
- [ ] Search functionality working
- [ ] Mobile responsive
- [ ] Performance audit >90

### Monitoring
- [ ] Sentry configured
- [ ] Google Analytics active
- [ ] Uptime monitoring active
- [ ] Backup automation running
- [ ] Error alerts configured

---

**Last Updated:** 2024
**Deployment Status:** ✅ Production Ready
