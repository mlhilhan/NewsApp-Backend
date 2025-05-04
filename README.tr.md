# Haber Uygulaması - Backend

Bu proje, modern haber portalı uygulamasının backend kısmıdır. Express.js, TypeScript, PostgreSQL ve Sequelize ORM kullanılarak geliştirilmiştir.

## Özellikler

- 🔐 JWT tabanlı kimlik doğrulama ve yetkilendirme
- 📰 Haber CRUD işlemleri
- 🗂️ Kategori yönetimi
- 💬 Yorum sistemi
- 👍 Beğeni ve reaksiyon sistemi
- 📊 API dokümantasyonu (Swagger UI)
- 🔄 Harici haber API entegrasyonu

## Teknolojiler

- **Express.js**: Web framework
- **TypeScript**: Tip güvenliği için
- **PostgreSQL**: Veritabanı
- **Sequelize ORM**: Veritabanı işlemleri için
- **Sequelize-TypeScript**: TypeScript desteği için
- **JWT**: Kimlik doğrulama için
- **bcrypt**: Şifre hashleme için
- **Swagger UI**: API dokümantasyonu için
- **dotenv**: Ortam değişkenleri için
- **cors**: CORS işlemleri için
- **helmet**: Güvenlik için

## Kurulum

### Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn
- PostgreSQL (v12 veya üzeri)

### Adımlar

1. Depoyu klonlayın:

```bash
git clone https://github.com/kullaniciadi/haber-backend.git
cd haber-backend
```

2. Bağımlılıkları yükleyin:

```bash
npm install
# veya
yarn install
```

3. PostgreSQL veritabanı oluşturun:

```sql
CREATE DATABASE haber_db;
```

4. Ortam değişkenlerini ayarlayın. `.env` dosyasını kök dizinde oluşturun:

```env
# Uygulama
PORT=3000
NODE_ENV=development

# Veritabanı
DB_HOST=localhost
DB_PORT=5432
DB_NAME=haber_db
DB_USER=postgres
DB_PASSWORD=yourpassword

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Harici Haber API
NEWS_API_KEY=your_news_api_key
```

5. TypeScript kodunu derleyin:

```bash
npm run build
# veya
yarn build
```

6. Veritabanı tablolarını oluşturun:

```bash
npm run db:sync
# veya
yarn db:sync
```

7. Uygulamayı başlatın:

```bash
npm run start
# veya
yarn start
```

8. Geliştirme modunda çalıştırmak için:

```bash
npm run dev
# veya
yarn dev
```

## API Dokümantasyonu

API dokümantasyonuna tarayıcı üzerinden erişebilirsiniz:

```
http://localhost:3000/api-docs
```

## API Endpoints

### Kimlik Doğrulama (Auth)

- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/profile` - Kullanıcı profilini görüntüleme
- `PUT /api/auth/profile` - Kullanıcı profilini güncelleme
- `PUT /api/auth/change-password` - Kullanıcı şifresini değiştirme

### Haberler (News)

- `GET /api/news` - Tüm haberleri getir
- `GET /api/news/:id` - Belirli bir haberi getir
- `POST /api/news` - Yeni haber oluştur (admin)
- `PUT /api/news/:id` - Haberi güncelle (admin)
- `DELETE /api/news/:id` - Haberi sil (admin)
- `GET /api/news/fetch/external` - Harici API'den haberleri getir (admin)

### Kategoriler (Categories)

- `GET /api/categories` - Tüm kategorileri getir
- `GET /api/categories/:id` - Belirli bir kategoriyi getir
- `POST /api/categories` - Yeni kategori oluştur (admin)
- `PUT /api/categories/:id` - Kategoriyi güncelle (admin)
- `DELETE /api/categories/:id` - Kategoriyi sil (admin)

### Yorumlar (Comments)

- `GET /api/comments/news/:newsId` - Bir habere ait yorumları getir
- `POST /api/comments` - Yeni yorum oluştur
- `PUT /api/comments/:id` - Yorumu güncelle
- `DELETE /api/comments/:id` - Yorumu sil

### Reaksiyonlar (Reactions)

- `GET /api/reactions/news/:newsId` - Bir habere ait reaksiyonları getir
- `GET /api/reactions/user/news/:newsId` - Kullanıcının bir habere yaptığı reaksiyonu getir
- `POST /api/reactions` - Reaksiyon ekle/güncelle
- `DELETE /api/reactions/news/:newsId` - Reaksiyonu kaldır

## Proje Yapısı

```
/src
  /config             # Yapılandırma dosyaları
  /interfaces         # TypeScript interface'leri
  /middlewares        # Express middleware'leri
  /services           # Servisler
    /auth             # Kimlik doğrulama servisi
      /controllers    # Controller'lar
      /models         # Sequelize modelleri
      /routes         # Express route'ları
    /news             # Haber servisi
    /comment          # Yorum servisi
  /utils              # Yardımcı fonksiyonlar
  index.ts            # Ana giriş dosyası
```

## Veritabanı Şeması

```
┌─────────────┐       ┌─────────────┐
│    Users    │       │    News     │
├─────────────┤       ├─────────────┤
│ id          │       │ id          │
│ username    │       │ title       │
│ email       │       │ content     │
│ password    │       │ imageUrl    │
│ role        │       │ author      │
│ createdAt   │       │ source      │
│ updatedAt   │       │ publishedAt │
└─────────────┘       │ createdAt   │
       │              │ updatedAt   │
       │              └─────────────┘
       │                     │
       │              ┌─────────────┐
       │              │NewsCategories│
       │              ├─────────────┤
       │              │ newsId      │
       │              │ categoryId  │
       │              └─────────────┘
       │                     │
┌─────────────┐       ┌─────────────┐
│  Comments   │       │  Categories │
├─────────────┤       ├─────────────┤
│ id          │       │ id          │
│ content     │       │ name        │
│ userId      │       │ slug        │
│ newsId      │       │ description │
│ createdAt   │       │ createdAt   │
│ updatedAt   │       │ updatedAt   │
└─────────────┘       └─────────────┘
       │
┌─────────────┐
│  Reactions  │
├─────────────┤
│ id          │
│ userId      │
│ newsId      │
│ type        │
│ createdAt   │
│ updatedAt   │
└─────────────┘
```

## Hata Giderme

**Model not initialized hatası**

Eğer "Model not initialized: Member cannot be called" hatası alıyorsanız, database.ts dosyanızda modellerin doğru şekilde Sequelize örneğine eklendiğinden emin olun:

```typescript
// config/database.ts
import { Sequelize } from "sequelize-typescript";
import User from "../services/auth/models/user.model";
import News from "../services/news/models/news.model";
// Diğer modelleri içe aktarın

const sequelize = new Sequelize({
  // veritabanı yapılandırması...
  models: [User, News /* diğer modeller... */],
});
```

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
