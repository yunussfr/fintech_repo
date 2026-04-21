"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "./glass-card"
import { ArrowUpRight, ArrowDownLeft, Coffee, ShoppingBag, Utensils, Fuel, Zap, Home, Car, Heart, GraduationCap, Gamepad2, Plane, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Transaction } from "@/lib/firestore"
import { useAuth } from "@/hooks/useAuth"
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Kategori ikonları
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  housing: Home,
  transport: Car,
  food: Utensils,
  health: Heart,
  education: GraduationCap,
  entertainment: Gamepad2,
  shopping: ShoppingBag,
  bills: Zap,
  travel: Plane,
  fuel: Fuel,
  coffee: Coffee,
}

// Kategori isimleri
const CATEGORY_NAMES: Record<string, string> = {
  housing: "Konut",
  transport: "Ulaşım",
  food: "Yiyecek",
  health: "Sağlık",
  education: "Eğitim",
  entertainment: "Eğlence",
  shopping: "Alışveriş",
  bills: "Faturalar",
  travel: "Seyahat",
}

export function RecentTransactions() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    setLoading(true)

    // Realtime listener - işlem eklenince otomatik güncellenir
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(6)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTransactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Transaction[]

      setTransactions(fetchedTransactions)
      setLoading(false)
    }, (error) => {
      console.error("İşlemler yüklenemedi:", error)
      setLoading(false)
    })

    // Cleanup - component unmount olduğunda listener'ı kapat
    return () => unsubscribe()
  }, [user])

  if (loading) {
    return (
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold metallic-text">Son İşlemler</h3>
            <p className="text-sm text-muted-foreground mt-1">En son aktiviteleriniz</p>
          </div>
        </div>
        <div className="text-center py-8 text-muted-foreground text-sm animate-pulse">
          Yükleniyor...
        </div>
      </GlassCard>
    )
  }

  if (transactions.length === 0) {
    return (
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold metallic-text">Son İşlemler</h3>
            <p className="text-sm text-muted-foreground mt-1">En son aktiviteleriniz</p>
          </div>
        </div>
        <div className="text-center py-8 text-muted-foreground text-sm">
          Henüz işlem yok
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold metallic-text">Son İşlemler</h3>
          <p className="text-sm text-muted-foreground mt-1">En son aktiviteleriniz</p>
        </div>
        <a 
          href="/dashboard/transactions"
          className="text-xs px-3 py-1.5 rounded-lg bg-[oklch(0.7_0.2_220/0.15)] text-[oklch(0.7_0.2_220)] hover:bg-[oklch(0.7_0.2_220/0.25)] transition-all duration-300 border border-[oklch(0.7_0.2_220/0.3)] backdrop-blur-sm"
        >
          Tümünü Gör
        </a>
      </div>

      <div className="space-y-2">
        {transactions.map((transaction) => {
          const Icon = CATEGORY_ICONS[transaction.category] || CreditCard
          const isIncome = transaction.amount > 0
          const date = transaction.date instanceof Date 
            ? transaction.date 
            : (transaction.date as any)?.toDate?.() ?? new Date()
          
          const dateStr = date.toLocaleDateString("tr-TR", { 
            day: "numeric", 
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
          })

          return (
            <div
              key={transaction.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-[oklch(0.15_0.01_250)] transition-all duration-300 cursor-pointer group border border-transparent hover:border-[oklch(0.35_0.02_250/0.3)]"
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all duration-300 group-hover:scale-110",
                isIncome 
                  ? "bg-[oklch(0.6_0.18_160/0.15)] text-[oklch(0.6_0.18_160)] border border-[oklch(0.6_0.18_160/0.3)]" 
                  : "bg-[oklch(0.5_0.02_250/0.4)] text-muted-foreground border border-[oklch(0.35_0.02_250/0.3)]"
              )}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground truncate">{transaction.name}</span>
                  <span className={cn(
                    "font-semibold",
                    isIncome ? "text-[oklch(0.6_0.18_160)] neon-green-glow" : "text-foreground"
                  )}>
                    {isIncome ? "+" : "-"}₺{Math.abs(transaction.amount).toLocaleString("tr-TR")}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {CATEGORY_NAMES[transaction.category] || transaction.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{dateStr}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
