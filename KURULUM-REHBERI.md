# 🚀 FinanceAI - Kurulum ve Firebase Entegrasyon Rehberi

## 📋 İçindekiler
1. [Yerel Kurulum](#1-yerel-kurulum)
2. [Firebase Entegrasyonu](#2-firebase-entegrasyonu)
3. [Komutların Açıklaması](#3-komutların-açıklaması)
4. [Arka Planda Neler Oluyor](#4-arka-planda-neler-oluyor)

---

## 1. 📦 Yerel Kurulum

### Adım 1: Gereksinimler
Sisteminizde bunların yüklü olması gerekiyor:
- **Node.js** (v18 veya üzeri) - [İndir](https://nodejs.org/)
- **pnpm** (önerilen) veya npm/yarn

```bash
# Node.js versiyonunu kontrol et
node --version  # v18.0.0 veya üzeri olmalı

# pnpm yükle (eğer yoksa)
npm install -g pnpm
```

### Adım 2: Bağımlılıkları Yükle

```bash
# Proje klasörüne git
cd [proje-klasörü-adı]

# Bağımlılıkları yükle
pnpm install
# veya
npm install
# veya
yarn install
```

**Bu komut ne yapar?**
- `package.json` dosyasındaki tüm bağımlılıkları indirir
- `node_modules` klasörü oluşturur
- `pnpm-lock.yaml` dosyasını kontrol eder (versiyon kilitleme)

### Adım 3: Geliştirme Sunucusunu Başlat

```bash
# Development mode'da çalıştır
pnpm dev
# veya
npm run dev
```

**Tarayıcıda aç:**
```
http://localhost:3000
```

✅ Artık uygulamanız çalışıyor!

---

## 2. 🔥 Firebase Entegrasyonu

### Adım 1: Firebase Projesi Oluştur

1. [Firebase Console](https://console.firebase.google.com/) 'a git
2. "Add project" (Proje ekle) butonuna tıkla
3. Proje adı gir (örn: "financeai-app")
4. Google Analytics'i etkinleştir (isteğe bağlı)
5. Projeyi oluştur

### Adım 2: Firebase Web App Ekle

1. Firebase Console'da projenize tıklayın
2. "Web" ikonuna (</>)  tıklayın
3. App nickname girin (örn: "FinanceAI Web")
4. "Register app" butonuna tıklayın
5. Firebase config bilgilerini kopyalayın

### Adım 3: Firebase SDK'yı Yükle

```bash
# Firebase paketlerini yükle
pnpm add firebase
# veya
npm install firebase
```

### Adım 4: Environment Variables Oluştur

Proje kök dizininde `.env.local` dosyası oluşturun:

```bash
# .env.local dosyası oluştur
touch .env.local
```

`.env.local` içeriği:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

⚠️ **Önemli:** `.env.local` dosyasını `.gitignore`'a ekleyin!

### Adım 5: Firebase Config Dosyası Oluştur

`lib/firebase.ts` dosyası oluşturun:

```typescript
// lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Firebase'i sadece bir kez başlat
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Firebase servislerini export et
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
```

### Adım 6: Firebase Authentication Aktifleştir

1. Firebase Console → Authentication
2. "Get started" butonuna tıkla
3. Sign-in method sekmesine git
4. İstediğiniz yöntemleri aktifleştir:
   - Email/Password
   - Google
   - GitHub
   - vb.

### Adım 7: Firestore Database Oluştur

1. Firebase Console → Firestore Database
2. "Create database" butonuna tıkla
3. "Start in test mode" seçin (geliştirme için)
4. Location seçin (örn: europe-west1)
5. "Enable" butonuna tıklayın

**Güvenlik Kuralları (Production için):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Kullanıcılar sadece kendi verilerine erişebilir
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Investments
    match /investments/{investmentId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

### Adım 8: Firebase Kullanım Örneği

`hooks/useAuth.ts` oluşturun:

```typescript
// hooks/useAuth.ts
'use client'

import { useState, useEffect } from 'react'
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const signOut = async () => {
    return firebaseSignOut(auth)
  }

  return { user, loading, signIn, signUp, signOut }
}
```

Firestore kullanım örneği:

```typescript
// lib/firestore.ts
import { db } from './firebase'
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  Timestamp 
} from 'firebase/firestore'

// Transaction ekleme
export async function addTransaction(userId: string, data: any) {
  return addDoc(collection(db, 'transactions'), {
    ...data,
    userId,
    createdAt: Timestamp.now(),
  })
}

// Kullanıcının transaction'larını getir
export async function getUserTransactions(userId: string) {
  const q = query(
    collection(db, 'transactions'),
    where('userId', '==', userId)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
```

---

## 3. 🔧 Komutların Açıklaması

### `pnpm dev` (Development Mode)

```bash
pnpm dev
```

**Ne yapar?**
- Next.js development server'ı başlatır
- Port 3000'de çalışır
- Hot Module Replacement (HMR) aktif
- Hataları tarayıcıda gösterir
- Fast Refresh ile anında güncelleme

**Arka planda:**
```
1. Next.js compiler başlatılır
2. Webpack/Turbopack dev server çalışır
3. File watcher aktif olur (dosya değişikliklerini izler)
4. React Fast Refresh etkinleşir
5. Source maps oluşturulur (debugging için)
```

### `pnpm build` (Production Build)

```bash
pnpm build
```

**Ne yapar?**
- Production için optimize edilmiş build oluşturur
- `.next` klasörüne output yazar
- Static HTML sayfaları oluşturur
- JavaScript bundle'ları optimize eder
- CSS'i minimize eder
- Image'leri optimize eder

**Arka planda:**
```
1. TypeScript type checking
2. ESLint kontrolü
3. Tailwind CSS purge (kullanılmayan CSS'leri temizler)
4. JavaScript minification (Terser)
5. Code splitting (sayfa bazlı)
6. Tree shaking (kullanılmayan kod temizleme)
7. Static generation (SSG) veya Server-side rendering (SSR)
8. Image optimization
9. Font optimization
```

**Output:**
```
.next/
├── cache/              # Build cache
├── server/             # Server-side kod
│   ├── app/           # App router sayfaları
│   └── chunks/        # Shared chunks
├── static/            # Static assets
│   ├── chunks/        # JavaScript chunks
│   ├── css/           # CSS dosyaları
│   └── media/         # Resimler, fontlar
└── BUILD_ID           # Unique build identifier
```

### `pnpm start` (Production Server)

```bash
pnpm start
```

**Ne yapar?**
- Production build'i çalıştırır
- Önce `pnpm build` yapılmalı
- Port 3000'de production server başlatır

**Arka planda:**
```
1. .next klasöründeki build'i okur
2. Node.js HTTP server başlatır
3. Static dosyaları serve eder
4. API routes'ları handle eder
5. Server-side rendering yapar (gerekirse)
```

### `pnpm lint`

```bash
pnpm lint
```

**Ne yapar?**
- ESLint ile kod kalitesini kontrol eder
- Syntax hatalarını bulur
- Best practice ihlallerini gösterir

---

## 4. 🔍 Arka Planda Neler Oluyor?

### Next.js App Router Yapısı

```
app/
├── layout.tsx          # Root layout (tüm sayfalarda)
├── page.tsx            # Ana sayfa (/)
├── globals.css         # Global CSS
├── dashboard/
│   ├── layout.tsx     # Dashboard layout
│   ├── page.tsx       # /dashboard
│   ├── analytics/
│   │   └── page.tsx   # /dashboard/analytics
│   └── settings/
│       └── page.tsx   # /dashboard/settings
└── api/               # API routes
    └── route.ts       # /api endpoint
```

### Rendering Stratejileri

#### 1. Server Components (Varsayılan)
```tsx
// app/dashboard/page.tsx
export default function DashboardPage() {
  // Bu server'da render edilir
  return <div>Dashboard</div>
}
```

**Avantajları:**
- SEO dostu
- Daha hızlı initial load
- Daha küçük JavaScript bundle
- Direkt database erişimi

#### 2. Client Components
```tsx
'use client'  // Bu directive gerekli

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**Ne zaman kullanılır:**
- useState, useEffect gibi hooks
- Event handlers (onClick, onChange)
- Browser API'leri (localStorage, window)
- Interaktif bileşenler

### Build Process Detayları

```
1. TypeScript Compilation
   ├── .ts/.tsx → .js
   └── Type checking

2. Tailwind CSS Processing
   ├── Scan all files for classes
   ├── Generate CSS
   └── Purge unused styles

3. JavaScript Bundling
   ├── Entry points (her sayfa)
   ├── Code splitting
   ├── Tree shaking
   └── Minification

4. Static Generation
   ├── Pre-render pages
   ├── Generate HTML
   └── Extract CSS

5. Optimization
   ├── Image optimization
   ├── Font optimization
   └── Asset compression
```

### Hot Module Replacement (HMR)

Development mode'da dosya değiştiğinde:

```
1. File watcher değişikliği algılar
2. Sadece değişen modül yeniden compile edilir
3. WebSocket ile tarayıcıya bildirim gönderilir
4. React Fast Refresh devreye girer
5. State korunarak component güncellenir
6. Sayfa yenilenmeden değişiklik görünür
```

### Production Deployment

```bash
# 1. Build oluştur
pnpm build

# 2. Test et
pnpm start

# 3. Deploy (Vercel örneği)
vercel deploy

# veya Firebase Hosting
firebase deploy
```

---

## 5. 🎯 Hızlı Başlangıç Checklist

- [ ] Node.js yüklü (v18+)
- [ ] pnpm yüklü
- [ ] `pnpm install` çalıştırıldı
- [ ] `.env.local` oluşturuldu
- [ ] Firebase projesi oluşturuldu
- [ ] Firebase config eklendi
- [ ] `pnpm dev` ile test edildi
- [ ] Authentication aktif
- [ ] Firestore database oluşturuldu
- [ ] Güvenlik kuralları ayarlandı

---

## 6. 🐛 Sık Karşılaşılan Sorunlar

### Port 3000 zaten kullanımda
```bash
# Farklı port kullan
pnpm dev -- -p 3001
```

### Module not found hatası
```bash
# node_modules'ü sil ve yeniden yükle
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Firebase connection hatası
- `.env.local` dosyasını kontrol edin
- Environment variable isimleri `NEXT_PUBLIC_` ile başlamalı
- Dev server'ı yeniden başlatın

### Build hatası
```bash
# Cache'i temizle
rm -rf .next
pnpm build
```

---

## 7. 📚 Faydalı Kaynaklar

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Shadcn UI Docs](https://ui.shadcn.com/)

---

## 8. 🚀 Production Deployment

### Vercel (Önerilen)
```bash
# Vercel CLI yükle
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### Firebase Hosting
```bash
# Firebase CLI yükle
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy --only hosting
```

---

Başarılar! 🎉
