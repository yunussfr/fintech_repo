// lib/seedDatabase.ts
// ──────────────────────────────────────────────────────────────────────────────
// Firestore'a gerçekçi test verisi ekleyen seed fonksiyonu.
//
// KULLANIM:
//   import { seedDatabase } from '@/lib/seedDatabase'
//
//   // Önce kullanıcı oturum açmış olmalı (Firestore rules gereği)
//   await seedDatabase(auth.currentUser.uid)
//
// NOT: Bu fonksiyon yalnızca development ortamında kullanılmak üzere tasarlanmıştır.
//      Mevcut verilerin üzerine YAZILMAZ; her çağrıda yeni belgeler oluşturulur.
//      Test verileri temizlemek istersen Firebase konsolunu veya bir cleanup
//      fonksiyonu kullan.
// ──────────────────────────────────────────────────────────────────────────────

import { db } from './firebase'
import {
  collection,
  addDoc,
  setDoc,
  doc,
  Timestamp,
} from 'firebase/firestore'

// ─── Type Definitions ────────────────────────────────────────────────────────

interface UserProfile {
  uid: string
  email: string
  displayName?: string
  totalAssets?: number
  monthlyIncome?: number
  monthlyExpenses?: number
  savingsGoal?: number
  createdAt?: Timestamp
}

interface Transaction {
  userId: string
  name: string
  category: string
  amount: number
  type: 'income' | 'expense'
  date: Timestamp
  createdAt: Timestamp
}

interface Investment {
  userId: string
  name: string
  symbol: string
  value: number
  change: number       // yüzde (örn: 4.25 → +%4.25)
  allocation: number   // portföydeki yüzde payı
  createdAt: Timestamp
}

interface Goal {
  userId: string
  name: string
  iconId: string
  target: number
  current: number
  deadline: string          // "YYYY-MM-DD"
  priority: 'high' | 'medium' | 'low'
  monthlyContribution: number
  createdAt: Timestamp
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Verilen yıl/ay/gün için Firestore Timestamp döndürür */
function ts(year: number, month: number, day: number): Timestamp {
  return Timestamp.fromDate(new Date(year, month - 1, day))
}

/** Bugünden N gün önce için Timestamp */
function daysAgo(n: number): Timestamp {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return Timestamp.fromDate(d)
}

// ─── Main Seed Function ───────────────────────────────────────────────────────

/**
 * Firestore'a test verisi ekler.
 *
 * @param testUserId - Oturum açmış kullanıcının UID'si.
 *                    Firestore rules, bu UID'nin request.auth.uid ile
 *                    eşleşmesini zorunlu kılar.
 */
export async function seedDatabase(testUserId: string): Promise<void> {
  const now = Timestamp.now()

  console.group('🌱 Firestore Seed başlıyor...')
  console.log('User ID:', testUserId)

  // ── 1. USERS ──────────────────────────────────────────────────────────────
  // users/{userId} → setDoc kullanıyoruz (belge ID = userId)
  const userProfile: UserProfile = {
    uid: testUserId,
    email: 'demo@fintechdash.dev',
    displayName: 'mamet  Yılmaz',
    totalAssets: 485_750,   // TL
    monthlyIncome: 28_500,
    monthlyExpenses: 14_200,
    savingsGoal: 500_000,
    createdAt: ts(2024, 3, 15),
  }

  await setDoc(doc(db, 'users', testUserId), userProfile)
  console.log('✅ users: 1 kullanıcı profili eklendi')

  // ── 2. TRANSACTIONS ───────────────────────────────────────────────────────
  const transactions: Omit<Transaction, 'userId'>[] = [
    // — Gelirler —
    {
      name: 'Maaş Ödemesi',
      category: 'income',
      amount: 25_000,
      type: 'income',
      date: daysAgo(1),
      createdAt: daysAgo(1),
    },
    {
      name: 'Freelance Web Projesi',
      category: 'income',
      amount: 3_500,
      type: 'income',
      date: daysAgo(8),
      createdAt: daysAgo(8),
    },
    {
      name: 'Kira Geliri',
      category: 'income',
      amount: 6_200,
      type: 'income',
      date: daysAgo(14),
      createdAt: daysAgo(14),
    },

    // — Alışveriş —
    {
      name: 'Zara – Kıyafet',
      category: 'shopping',
      amount: -1_240,
      type: 'expense',
      date: daysAgo(2),
      createdAt: daysAgo(2),
    },
    {
      name: 'Mediamarkt – Kulaklık',
      category: 'shopping',
      amount: -2_799,
      type: 'expense',
      date: daysAgo(9),
      createdAt: daysAgo(9),
    },

    // — Yemek —
    {
      name: 'Migros Market',
      category: 'food',
      amount: -875,
      type: 'expense',
      date: daysAgo(3),
      createdAt: daysAgo(3),
    },
    {
      name: 'Yemeksepeti Siparişi',
      category: 'food',
      amount: -312,
      type: 'expense',
      date: daysAgo(5),
      createdAt: daysAgo(5),
    },
    {
      name: 'Starbucks',
      category: 'food',
      amount: -185,
      type: 'expense',
      date: daysAgo(7),
      createdAt: daysAgo(7),
    },

    // — Ulaşım —
    {
      name: 'İETT Akbil Yüklemesi',
      category: 'transport',
      amount: -400,
      type: 'expense',
      date: daysAgo(10),
      createdAt: daysAgo(10),
    },
    {
      name: 'Uber – Havalimanı',
      category: 'transport',
      amount: -520,
      type: 'expense',
      date: daysAgo(18),
      createdAt: daysAgo(18),
    },

    // — Faturalar —
    {
      name: 'Elektrik Faturası',
      category: 'bills',
      amount: -680,
      type: 'expense',
      date: daysAgo(6),
      createdAt: daysAgo(6),
    },
    {
      name: 'İnternet & TV Paketi',
      category: 'bills',
      amount: -349,
      type: 'expense',
      date: daysAgo(6),
      createdAt: daysAgo(6),
    },

    // — Sağlık —
    {
      name: 'Özel Klinik – Muayene',
      category: 'health',
      amount: -950,
      type: 'expense',
      date: daysAgo(20),
      createdAt: daysAgo(20),
    },

    // — Eğlence —
    {
      name: 'Netflix Aboneliği',
      category: 'entertainment',
      amount: -149,
      type: 'expense',
      date: daysAgo(12),
      createdAt: daysAgo(12),
    },
    {
      name: 'Sinema – 2 Bilet',
      category: 'entertainment',
      amount: -320,
      type: 'expense',
      date: daysAgo(15),
      createdAt: daysAgo(15),
    },

    // — Eğitim —
    {
      name: 'Udemy – React Kursu',
      category: 'education',
      amount: -249,
      type: 'expense',
      date: daysAgo(22),
      createdAt: daysAgo(22),
    },
  ]

  const txResults = await Promise.allSettled(
    transactions.map((tx) =>
      addDoc(collection(db, 'transactions'), { ...tx, userId: testUserId })
    )
  )
  const txSucceeded = txResults.filter((r) => r.status === 'fulfilled').length
  console.log(`✅ transactions: ${txSucceeded}/${transactions.length} işlem eklendi`)

  // ── 3. INVESTMENTS ────────────────────────────────────────────────────────
  // allocation toplamı = 100 olacak şekilde ayarlandı
  const investments: Omit<Investment, 'userId'>[] = [
    {
      name: 'Apple Inc.',
      symbol: 'AAPL',
      value: 87_420,
      change: 4.25,
      allocation: 18,
      createdAt: ts(2024, 1, 10),
    },
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      value: 142_800,
      change: -2.18,
      allocation: 29,
      createdAt: ts(2023, 11, 5),
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      value: 63_150,
      change: 1.74,
      allocation: 13,
      createdAt: ts(2023, 11, 20),
    },
    {
      name: 'Tesla Inc.',
      symbol: 'TSLA',
      value: 55_680,
      change: -5.47,
      allocation: 11,
      createdAt: ts(2024, 2, 28),
    },
    {
      name: 'BIST 100 (THYAO)',
      symbol: 'THYAO',
      value: 43_950,
      change: 8.63,
      allocation: 9,
      createdAt: ts(2024, 3, 1),
    },
    {
      name: 'Altın (Gram)',
      symbol: 'XAU-TRY',
      value: 92_750,
      change: 3.11,
      allocation: 20,
      createdAt: ts(2023, 9, 15),
    },
  ]

  const invResults = await Promise.allSettled(
    investments.map((inv) =>
      addDoc(collection(db, 'investments'), { ...inv, userId: testUserId })
    )
  )
  const invSucceeded = invResults.filter((r) => r.status === 'fulfilled').length
  console.log(`✅ investments: ${invSucceeded}/${investments.length} yatırım eklendi`)

  // ── 4. BUDGETS / GOALS ────────────────────────────────────────────────────
  // firestore.rules'da 'budgets' koleksiyonu tanımlı olduğu için oraya yazıyoruz.
  // UI'da "goals" olarak görünse bile koleksiyon adı 'budgets' dir.
  const goals: Omit<Goal, 'userId'>[] = [
    {
      name: 'Ev Alım Fonu',
      iconId: 'home',
      target: 1_500_000,
      current: 285_000,
      deadline: '2027-12-31',
      priority: 'high',
      monthlyContribution: 12_000,
      createdAt: ts(2024, 1, 1),
    },
    {
      name: 'Acil Durum Fonu',
      iconId: 'piggybank',
      target: 100_000,
      current: 67_500,
      deadline: '2025-06-30',
      priority: 'high',
      monthlyContribution: 5_000,
      createdAt: ts(2024, 2, 1),
    },
    {
      name: 'Avrupa Tatili',
      iconId: 'plane',
      target: 80_000,
      current: 23_400,
      deadline: '2025-08-15',
      priority: 'medium',
      monthlyContribution: 3_500,
      createdAt: ts(2024, 3, 10),
    },
    {
      name: 'İkinci El Araç',
      iconId: 'car',
      target: 350_000,
      current: 90_000,
      deadline: '2026-05-01',
      priority: 'medium',
      monthlyContribution: 8_000,
      createdAt: ts(2024, 4, 1),
    },
    {
      name: 'Yüksek Lisans Fonu',
      iconId: 'edu',
      target: 60_000,
      current: 15_000,
      deadline: '2026-09-01',
      priority: 'low',
      monthlyContribution: 2_000,
      createdAt: ts(2024, 4, 5),
    },
  ]

  const goalResults = await Promise.allSettled(
    goals.map((goal) =>
      addDoc(collection(db, 'budgets'), { ...goal, userId: testUserId })
    )
  )
  const goalSucceeded = goalResults.filter((r) => r.status === 'fulfilled').length
  console.log(`✅ budgets (goals): ${goalSucceeded}/${goals.length} hedef eklendi`)

  console.groupEnd()
  console.log('🎉 Seed işlemi tamamlandı!')
}
