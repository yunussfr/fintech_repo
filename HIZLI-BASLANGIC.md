# ⚡ Hızlı Başlangıç Rehberi

## 🚀 5 Dakikada Çalıştır

### 1️⃣ Bağımlılıkları Yükle
```bash
pnpm install
```

### 2️⃣ Geliştirme Sunucusunu Başlat
```bash
pnpm dev
```

### 3️⃣ Tarayıcıda Aç
```
http://localhost:3000
```

✅ **Tebrikler!** Uygulamanız çalışıyor!

---

## 🔥 Firebase Entegrasyonu (Opsiyonel)

### Adım 1: Firebase Projesi Oluştur
1. [Firebase Console](https://console.firebase.google.com/) → "Add project"
2. Proje adı gir → "Continue"
3. Google Analytics aktif et (opsiyonel) → "Create project"

### Adım 2: Web App Ekle
1. Firebase Console → Proje seç
2. Web ikonu (</>)  → "Register app"
3. App nickname gir → "Register app"
4. Config bilgilerini kopyala

### Adım 3: Firebase SDK Yükle
```bash
pnpm add firebase
```

### Adım 4: Environment Variables
```bash
# .env.local.example dosyasını kopyala
cp .env.local.example .env.local

# .env.local dosyasını düzenle ve Firebase config'i ekle
```

### Adım 5: Firebase Servislerini Aktifleştir

**Authentication:**
1. Firebase Console → Authentication → "Get started"
2. Sign-in method → Email/Password → "Enable"
3. (Opsiyonel) Google, GitHub vb. ekle

**Firestore Database:**
1. Firebase Console → Firestore Database → "Create database"
2. "Start in test mode" → Location seç → "Enable"
3. Rules sekmesi → `firestore.rules` dosyasındaki kuralları kopyala

### Adım 6: Dev Server'ı Yeniden Başlat
```bash
# Ctrl+C ile durdur, sonra tekrar başlat
pnpm dev
```

---

## 📁 Proje Yapısı

```
financeai/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Dashboard sayfaları
│   ├── login/               # Login sayfası
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Ana sayfa
│   └── globals.css          # Global CSS + Tasarım efektleri
├── components/              # React bileşenleri
│   ├── dashboard/          # Dashboard bileşenleri
│   └── ui/                 # Shadcn UI bileşenleri
├── hooks/                   # Custom React hooks
│   ├── use-auth.ts         # Firebase Authentication hook
│   └── use-toast.ts        # Toast notification hook
├── lib/                     # Utility fonksiyonlar
│   ├── firebase.ts         # Firebase config
│   ├── firestore.ts        # Firestore helper fonksiyonlar
│   └── utils.ts            # Genel utility'ler
├── public/                  # Static dosyalar
├── .env.local              # Environment variables (GİT'E EKLEMEYİN!)
├── .env.local.example      # Environment variables şablonu
├── firestore.rules         # Firestore güvenlik kuralları
└── package.json            # Dependencies ve scripts
```

---

## 🛠️ Kullanılabilir Komutlar

```bash
# Development server (Hot reload ile)
pnpm dev

# Production build oluştur
pnpm build

# Production server'ı çalıştır (önce build gerekli)
pnpm start

# Kod kalitesi kontrolü
pnpm lint

# Firebase deploy (Firebase CLI gerekli)
firebase deploy
```

---

## 🎨 Tasarım Özellikleri

✨ **Premium Dark Mode**
- Metalik shimmer efektleri
- Glassmorphism (cam efekti)
- Neon glow vurguları
- Smooth animasyonlar
- Fütüristik grid pattern

🎯 **Bileşenler**
- AI Chat (Yapay zeka sohbet arayüzü)
- Portfolio Chart (Yatırım grafiği)
- Spending Chart (Harcama grafiği)
- Stats Cards (İstatistik kartları)
- Investment List (Yatırım listesi)
- Recent Transactions (Son işlemler)

---

## 🔐 Firebase Authentication Kullanımı

```tsx
'use client'

import { useAuth } from '@/hooks/useAuth'

export default function MyComponent() {
  const { user, loading, signIn, signOut } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!user) {
    return (
      <button onClick={() => signIn('email@example.com', 'password')}>
        Login
      </button>
    )
  }

  return (
    <div>
      <p>Welcome {user.email}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  )
}
```

---

## 💾 Firestore Kullanımı

```tsx
import { addTransaction, getUserTransactions } from '@/lib/firestore'

// Transaction ekleme
const { id, error } = await addTransaction(userId, {
  name: 'Starbucks',
  category: 'Food & Drinks',
  amount: -8.50,
  type: 'expense',
  date: new Date(),
})

// Transaction'ları getirme
const { transactions, error } = await getUserTransactions(userId)
```

---

## 🐛 Sorun Giderme

### Port 3000 kullanımda
```bash
pnpm dev -- -p 3001
```

### Module not found
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Firebase bağlantı hatası
1. `.env.local` dosyasını kontrol et
2. Tüm değişkenler `NEXT_PUBLIC_` ile başlamalı
3. Dev server'ı yeniden başlat

### Build hatası
```bash
rm -rf .next
pnpm build
```

---

## 📚 Daha Fazla Bilgi

- 📖 [KURULUM-REHBERI.md](./KURULUM-REHBERI.md) - Detaylı kurulum
- 🎨 [TASARIM-GUNCELLEMELERI.md](./TASARIM-GUNCELLEMELERI.md) - Tasarım detayları
- 🔥 [Firebase Docs](https://firebase.google.com/docs)
- ⚡ [Next.js Docs](https://nextjs.org/docs)

---

## 🚀 Production Deployment

### Vercel (Önerilen - 1 Dakika)
```bash
# Vercel CLI yükle
npm i -g vercel

# Deploy
vercel

# Production
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

## 💡 İpuçları

1. **Hot Reload**: Dosyaları kaydettiğinizde sayfa otomatik güncellenir
2. **TypeScript**: Tüm dosyalar TypeScript ile yazılmış
3. **Tailwind**: Utility-first CSS framework kullanılıyor
4. **Shadcn UI**: Özelleştirilebilir UI bileşenleri
5. **Firebase**: Backend olarak Firebase kullanılıyor

---

Başarılar! 🎉

Sorularınız için: [GitHub Issues](https://github.com/your-repo/issues)
