"use client"

import { useEffect, useState } from "react"
import { GlassCard } from "@/components/dashboard/glass-card"
import { SpendingChart } from "@/components/dashboard/spending-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { Wallet, TrendingUp, ArrowUpDown, PiggyBank, DatabaseZap, Edit2, Check, X, AlertCircle, Target } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { seedDatabase } from "@/lib/seedDatabase"
import { getUserProfile, setUserProfile, type Transaction } from "@/lib/firestore"
import { getGoals } from "@/lib/firestore"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function DashboardPage() {
  const { user } = useAuth()
  const [seeding,   setSeeding]   = useState(false)
  const [seedDone,  setSeedDone]  = useState(false)
  const [totalAssets,     setTotalAssets]     = useState<number | null>(null)
  const [monthlyIncome,   setMonthlyIncome]   = useState<number | null>(null)
  const [monthlyExpenses, setMonthlyExpenses] = useState<number | null>(null)
  const [savingsGoal,     setSavingsGoal]     = useState<number | null>(null)

  // Hedefler
  const [goals, setGoals] = useState<any[]>([])
  const [loadingGoals, setLoadingGoals] = useState(true)

  // Düzenleme state'leri
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingUpdate, setPendingUpdate] = useState<{ field: string; value: number } | null>(null)

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Kullanıcı"

  // ── Firestore'dan kullanıcı ve işlem verisi çek ──────────────────────────
  useEffect(() => {
    if (!user) return

    // Kullanıcı profil verileri (toplam varlık, aylık gelir/gider)
    getUserProfile(user.uid).then(({ profile }) => {
      if (profile) {
        setTotalAssets(profile.totalAssets ?? null)
        setMonthlyIncome(profile.monthlyIncome ?? null)
        setMonthlyExpenses(profile.monthlyExpenses ?? null)
        setSavingsGoal(profile.savingsGoal ?? null)
      }
    })

    // Hedefleri yükle
    setLoadingGoals(true)
    getGoals(user.uid).then(({ goals: fetched, error }) => {
      if (error) console.error("Hedefler yüklenemedi:", error)
      else setGoals(fetched)
      setLoadingGoals(false)
    })

    // İşlemlerden realtime hesaplama - işlem eklenince otomatik güncellenir
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(100)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Transaction[]

      if (!txs.length) return

      const now = new Date()
      const thisMonth = txs.filter(t => {
        const d = t.date instanceof Date ? t.date : (t.date as any)?.toDate?.() ?? new Date()
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })
      
      const income = thisMonth.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)
      const expenses = thisMonth.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
      
      if (income > 0) setMonthlyIncome(income)
      if (expenses > 0) setMonthlyExpenses(expenses)
    })

    return () => unsubscribe()
  }, [user])

  const handleSeed = async () => {
    if (!user) return alert("Önce giriş yapmış olmalısın!")
    setSeeding(true)
    try {
      await seedDatabase(user.uid)
      setSeedDone(true)
      alert("✅ Veriler Firestore'a başarıyla yazıldı!")
    } catch (err: any) {
      alert("❌ Hata: " + err.message)
    } finally {
      setSeeding(false)
    }
  }

  const handleEdit = (field: string, currentValue: number | null) => {
    setEditingField(field)
    setEditValue(currentValue?.toString() || "")
  }

  const handleSave = (field: string) => {
    const value = parseFloat(editValue)
    if (isNaN(value) || value < 0) {
      alert("Geçerli bir sayı girin")
      return
    }
    setPendingUpdate({ field, value })
    setShowConfirm(true)
  }

  const confirmUpdate = async () => {
    if (!user || !pendingUpdate) return
    
    const updateData: any = {}
    updateData[pendingUpdate.field] = pendingUpdate.value

    const { error } = await setUserProfile(user.uid, updateData)
    
    if (error) {
      alert("Kaydedilemedi: " + error)
    } else {
      // State'i güncelle
      if (pendingUpdate.field === "totalAssets") setTotalAssets(pendingUpdate.value)
      else if (pendingUpdate.field === "monthlyIncome") setMonthlyIncome(pendingUpdate.value)
      else if (pendingUpdate.field === "monthlyExpenses") setMonthlyExpenses(pendingUpdate.value)
      else if (pendingUpdate.field === "savingsGoal") setSavingsGoal(pendingUpdate.value)
      
      setEditingField(null)
      setEditValue("")
    }
    
    setShowConfirm(false)
    setPendingUpdate(null)
  }

  const cancelEdit = () => {
    setEditingField(null)
    setEditValue("")
  }

  const fmt = (n: number | null) =>
    n !== null ? `₺${n.toLocaleString("tr-TR")}` : "—"

  return (
    <div className="space-y-6">
      {/* Onay Dialogu */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative w-full max-w-md glass-card rounded-2xl p-6 border border-border/50 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Değişikliği Onayla</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Bu değeri güncellemek istediğinizden emin misiniz?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => { setShowConfirm(false); setPendingUpdate(null) }}
                className="bg-secondary/30 border-border/50"
              >
                İptal
              </Button>
              <Button
                onClick={confirmUpdate}
                className="bg-primary text-primary-foreground"
              >
                Onayla
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DEV ONLY — Seed Butonu */}
      {process.env.NODE_ENV === "development" && (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-yellow-500/40 bg-yellow-500/5">
          <DatabaseZap className="w-5 h-5 text-yellow-400 shrink-0" />
          <span className="text-sm text-yellow-300/80 flex-1">
            <strong>Dev Modu:</strong> Firestore'a test verisi eklemek için butona tıkla.
          </span>
          <button
            onClick={handleSeed}
            disabled={seeding || seedDone}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-yellow-500 hover:bg-yellow-400 text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {seeding ? "⏳ Yazılıyor..." : seedDone ? "✅ Yazıldı" : "🌱 Seed Database"}
          </button>
        </div>
      )}

      {/* Header */}
      <div className="relative">
        <h1 className="text-2xl font-bold metallic-text">Hoş Geldiniz, {displayName} 👋</h1>
        <p className="text-muted-foreground mt-1">Finansal durumunuzun özeti</p>
      </div>

      {/* Stats Grid - Düzenlenebilir */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Toplam Varlık */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toplam Varlık</p>
                {editingField === "totalAssets" ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-8 w-32 text-sm"
                      autoFocus
                    />
                    <button onClick={() => handleSave("totalAssets")} className="text-emerald-400 hover:text-emerald-300">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={cancelEdit} className="text-red-400 hover:text-red-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xl font-bold">{fmt(totalAssets)}</p>
                )}
              </div>
            </div>
            {editingField !== "totalAssets" && (
              <button
                onClick={() => handleEdit("totalAssets", totalAssets)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </GlassCard>

        {/* Aylık Gelir */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aylık Gelir</p>
                {editingField === "monthlyIncome" ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-8 w-32 text-sm"
                      autoFocus
                    />
                    <button onClick={() => handleSave("monthlyIncome")} className="text-emerald-400 hover:text-emerald-300">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={cancelEdit} className="text-red-400 hover:text-red-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xl font-bold">{fmt(monthlyIncome)}</p>
                )}
              </div>
            </div>
            {editingField !== "monthlyIncome" && (
              <button
                onClick={() => handleEdit("monthlyIncome", monthlyIncome)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </GlassCard>

        {/* Aylık Gider */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <ArrowUpDown className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aylık Gider</p>
                {editingField === "monthlyExpenses" ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-8 w-32 text-sm"
                      autoFocus
                    />
                    <button onClick={() => handleSave("monthlyExpenses")} className="text-emerald-400 hover:text-emerald-300">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={cancelEdit} className="text-red-400 hover:text-red-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xl font-bold">{fmt(monthlyExpenses)}</p>
                )}
              </div>
            </div>
            {editingField !== "monthlyExpenses" && (
              <button
                onClick={() => handleEdit("monthlyExpenses", monthlyExpenses)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </GlassCard>

        {/* Birikim Hedefi */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Birikim Hedefi</p>
                {editingField === "savingsGoal" ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-8 w-32 text-sm"
                      autoFocus
                    />
                    <button onClick={() => handleSave("savingsGoal")} className="text-emerald-400 hover:text-emerald-300">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={cancelEdit} className="text-red-400 hover:text-red-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xl font-bold">{fmt(savingsGoal)}</p>
                )}
              </div>
            </div>
            {editingField !== "savingsGoal" && (
              <button
                onClick={() => handleEdit("savingsGoal", savingsGoal)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Haftalık Harcama Grafiği */}
      <SpendingChart />

      {/* Birikim Hedefleri Özeti */}
      {!loadingGoals && goals.length > 0 && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold metallic-text">Birikim Hedefleriniz</h3>
              <p className="text-sm text-muted-foreground mt-1">Hedeflerinize ne kadar yakınsınız?</p>
            </div>
            <a 
              href="/dashboard/budget"
              className="text-xs px-3 py-1.5 rounded-lg bg-[oklch(0.7_0.2_220/0.15)] text-[oklch(0.7_0.2_220)] hover:bg-[oklch(0.7_0.2_220/0.25)] transition-all duration-300 border border-[oklch(0.7_0.2_220/0.3)] backdrop-blur-sm"
            >
              Tümünü Gör
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {goals.slice(0, 3).map((goal: any) => {
              const percentage = (goal.current / goal.target) * 100
              const remaining = goal.target - goal.current
              const deadline = new Date(goal.deadline)
              const monthsLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))
              const neededPerMonth = monthsLeft > 0 ? remaining / monthsLeft : remaining
              const monthlySavings = (monthlyIncome || 0) - (monthlyExpenses || 0)
              const canAfford = monthlySavings >= neededPerMonth

              return (
                <div key={goal.id} className="p-4 bg-secondary/30 rounded-xl hover:bg-secondary/40 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{goal.name}</h4>
                    <span className={cn(
                      "text-xs font-semibold px-2 py-1 rounded-full",
                      goal.priority === "high" ? "bg-primary/20 text-primary" :
                      goal.priority === "medium" ? "bg-orange-500/20 text-orange-400" :
                      "bg-secondary text-muted-foreground"
                    )}>
                      {goal.priority === "high" ? "Yüksek" : goal.priority === "medium" ? "Orta" : "Düşük"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">İlerleme</span>
                      <span className="font-semibold">{Math.min(percentage, 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                      <span>{goal.current.toLocaleString("tr-TR")} ₺</span>
                      <span>{goal.target.toLocaleString("tr-TR")} ₺</span>
                    </div>

                    <div className={cn(
                      "mt-3 p-2 rounded-lg text-xs",
                      canAfford ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
                    )}>
                      {canAfford 
                        ? `✓ Aylık ${neededPerMonth.toLocaleString("tr-TR")} ₺ ile ${monthsLeft} ayda ulaşabilirsiniz` 
                        : `⚠ Aylık ${neededPerMonth.toLocaleString("tr-TR")} ₺ tasarruf gerekli (${monthsLeft} ay)`}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {goals.length > 3 && (
            <div className="mt-4 text-center">
              <a 
                href="/dashboard/budget"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                +{goals.length - 3} hedef daha →
              </a>
            </div>
          )}
        </GlassCard>
      )}

      {/* Son İşlemler */}
      <RecentTransactions />
    </div>
  )
}
