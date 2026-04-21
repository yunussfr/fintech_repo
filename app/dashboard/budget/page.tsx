"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Target, Plus, TrendingUp, Wallet, PiggyBank, Home, Car,
  Plane, GraduationCap, Heart, Gift, AlertCircle,
  CheckCircle2, Clock, Edit2, Trash2, X, Zap, ShoppingBag,
  Utensils, Gamepad2, ArrowUpRight, ArrowDownLeft
} from "lucide-react"
import { GlassCard } from "@/components/dashboard/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import {
  addGoal,
  getGoals,
  deleteGoal,
  addActivityLog,
  getUserTransactions,
  type Goal,
  type Transaction,
} from "@/lib/firestore"

const goalIconOptions = [
  { id: "piggybank", icon: PiggyBank, label: "Birikim" },
  { id: "home",      icon: Home,      label: "Ev" },
  { id: "car",       icon: Car,       label: "Araba" },
  { id: "plane",     icon: Plane,     label: "Tatil" },
  { id: "edu",       icon: GraduationCap, label: "Eğitim" },
  { id: "heart",     icon: Heart,     label: "Sağlık" },
  { id: "gift",      icon: Gift,      label: "Hediye" },
  { id: "wallet",    icon: Wallet,    label: "Diğer" },
]

const priorityOptions = [
  { value: "high",   label: "Yüksek",  color: "text-primary bg-primary/20" },
  { value: "medium", label: "Orta",    color: "text-orange-400 bg-orange-500/20" },
  { value: "low",    label: "Düşük",   color: "text-muted-foreground bg-secondary" },
]

// Kategori renk ve ikon eşleştirmesi
const CATEGORY_META: Record<string, { name: string; icon: React.ElementType; color: string }> = {
  housing:       { name: "Konut",     icon: Home,          color: "bg-blue-500" },
  transport:     { name: "Ulaşım",    icon: Car,           color: "bg-cyan-500" },
  food:          { name: "Yiyecek",   icon: Utensils,      color: "bg-orange-500" },
  health:        { name: "Sağlık",    icon: Heart,         color: "bg-red-500" },
  education:     { name: "Eğitim",    icon: GraduationCap, color: "bg-green-500" },
  entertainment: { name: "Eğlence",   icon: Gamepad2,      color: "bg-purple-500" },
  shopping:      { name: "Alışveriş",  icon: ShoppingBag,   color: "bg-pink-500" },
  bills:         { name: "Faturalar",  icon: Zap,           color: "bg-yellow-500" },
  travel:        { name: "Seyahat",   icon: Plane,         color: "bg-sky-500" },
}

// Yeni hedef formu için başlangıç değerleri
const emptyForm = {
  name: "",
  iconId: "piggybank",
  target: "",
  current: "",
  deadline: "",
  priority: "medium",
  monthlyContribution: "",
}

export default function BudgetPage() {
  const { user }                        = useAuth()
  const [activeTab, setActiveTab]       = useState<"budget" | "goals">("budget")
  const [goals, setGoals]               = useState<Goal[]>([])
  const [loadingGoals, setLoadingGoals] = useState(true)
  const [transactions,  setTxs]         = useState<Transaction[]>([])
  const [loadingTxs,    setLoadingTxs]  = useState(true)
  const [showModal, setShowModal]       = useState(false)
  const [form, setForm]                 = useState(emptyForm)
  const [formError, setFormError]       = useState("")
  const [saving, setSaving]             = useState(false)

  // Hedefleri yükle
  useEffect(() => {
    if (!user) return
    setLoadingGoals(true)
    getGoals(user.uid).then(({ goals: fetched, error }) => {
      if (error) console.error("Hedefler yüklenemedi:", error)
      else setGoals(fetched)
      setLoadingGoals(false)
    })
  }, [user])

  // İşlemleri yükle (bütçe hesapları için)
  useEffect(() => {
    if (!user) return
    setLoadingTxs(true)
    getUserTransactions(user.uid, 200).then(({ transactions: fetched, error }) => {
      if (error) console.error("İşlemler yüklenemedi:", error)
      else setTxs(fetched)
      setLoadingTxs(false)
    })
  }, [user])

  // Harcama kategorileri Firestore verisiyle hesaplanır
  const budgetCategories = useMemo(() => {
    const expenses = transactions.filter(t => t.amount < 0)
    return Object.entries(CATEGORY_META).map(([id, meta]) => ({
      id, ...meta,
      budget: 5000, // kullanıcı bütçe belirleyene kadar varsayılan
      spent: Math.abs(expenses.filter(t => t.category === id).reduce((s, t) => s + t.amount, 0)),
    }))
  }, [transactions])

  // Toplam bütçe ve harcama hesaplamaları
  const totalBudget = useMemo(() => budgetCategories.reduce((sum, cat) => sum + cat.budget, 0), [budgetCategories])
  const totalSpent = useMemo(() => budgetCategories.reduce((sum, cat) => sum + cat.spent, 0), [budgetCategories])
  const overBudgetCount = useMemo(() => budgetCategories.filter(cat => cat.spent > cat.budget).length, [budgetCategories])

  // Aylık özet (son 6 ay)
  const monthlyInsights = useMemo(() => {
    const months: Record<string, { month: string; income: number; expense: number }> = {}
    transactions.forEach(t => {
      const d     = t.date instanceof Date ? t.date : (t.date as any)?.toDate?.() ?? new Date()
      const key   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      const label = d.toLocaleDateString("tr-TR", { month: "long" })
      if (!months[key]) months[key] = { month: label, income: 0, expense: 0 }
      if (t.amount > 0) months[key].income  += t.amount
      else              months[key].expense += Math.abs(t.amount)
    })
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([, v]) => v)
  }, [transactions])

  const handleAddGoal = async () => {
    setFormError("")
    if (!user)             return setFormError("Oturum bulunamadı.")
    if (!form.name.trim()) return setFormError("Hedef adı zorunludur.")
    if (!form.target)      return setFormError("Hedef tutarı zorunludur.")
    if (!form.deadline)    return setFormError("Son tarih zorunludur.")

    setSaving(true)
    const payload = {
      name:                form.name.trim(),
      iconId:              form.iconId,
      target:              Number(form.target),
      current:             Number(form.current) || 0,
      deadline:            form.deadline,
      priority:            form.priority as Goal["priority"],
      monthlyContribution: Number(form.monthlyContribution) || 0,
    }

    const { id, error } = await addGoal(user.uid, payload)
    if (error || !id) {
      setFormError("Kaydedilemedi: " + (error ?? "bilinmeyen hata"))
      setSaving(false)
      return
    }

    // Aktivite logu
    await addActivityLog(user.uid, "goal_created", `Hedef: ${payload.name}`)

    // UI'ya ekle (yeniden fetch yapmadan)
    setGoals(prev => [{ ...payload, id, userId: user.uid }, ...prev])
    setForm(emptyForm)
    setShowModal(false)
    setSaving(false)
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (!user) return
    const { error } = await deleteGoal(goalId)
    if (error) { console.error("Silinemedi:", error); return }
    setGoals(prev => prev.filter(g => g.id !== goalId))
  }

  return (
    <div className="space-y-6">
      {/* ── YENİ HEDEF MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          {/* Modal Kutu */}
          <div className="relative w-full max-w-lg glass-card rounded-2xl p-6 border border-border/50 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Başlık */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Yeni Hedef Ekle</h2>
                <p className="text-sm text-muted-foreground">Birikim hedefinizi tanımlayın</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Hata mesajı */}
              {formError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {formError}
                </div>
              )}

              {/* Hedef Adı */}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Hedef Adı *</label>
                <Input
                  placeholder="Örn: Yaz Tatili, Ev Peşinatı..."
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="bg-secondary/50 border-border/50"
                />
              </div>

              {/* İkon Seçimi */}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">İkon</label>
                <div className="grid grid-cols-8 gap-2">
                  {goalIconOptions.map(opt => {
                    const Icon = opt.icon
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, iconId: opt.id }))}
                        title={opt.label}
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                          form.iconId === opt.id
                            ? "bg-primary/30 border-2 border-primary"
                            : "bg-secondary/50 border-2 border-transparent hover:bg-secondary"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tutarlar */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Hedef Tutar (₺) *</label>
                  <Input
                    type="number"
                    placeholder="100000"
                    value={form.target}
                    onChange={e => setForm(p => ({ ...p, target: e.target.value }))}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Mevcut Birikim (₺)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.current}
                    onChange={e => setForm(p => ({ ...p, current: e.target.value }))}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
              </div>

              {/* Aylık Katkı + Son Tarih */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Aylık Katkı (₺)</label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={form.monthlyContribution}
                    onChange={e => setForm(p => ({ ...p, monthlyContribution: e.target.value }))}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Son Tarih *</label>
                  <Input
                    type="date"
                    value={form.deadline}
                    onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
              </div>

              {/* Öncelik */}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Öncelik</label>
                <div className="flex gap-2">
                  {priorityOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, priority: opt.value }))}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-sm font-medium transition-all border-2",
                        form.priority === opt.value
                          ? opt.color + " border-current"
                          : "border-transparent bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Butonlar */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border/50">
              <Button
                variant="outline"
                onClick={() => { setShowModal(false); setForm(emptyForm); setFormError("") }}
                className="bg-secondary/30 border-border/50"
              >
                İptal
              </Button>
              <Button
                onClick={handleAddGoal}
                disabled={saving}
                className="bg-primary text-primary-foreground gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <>⏳ Kaydediliyor...</>
                ) : (
                  <><Plus className="w-4 h-4" />Hedef Ekle</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold metallic-text">Bütçe ve Hedefler</h1>
          <p className="text-muted-foreground mt-1">Harcamalarınızı yönetin ve hedeflerinize ulaşın</p>
        </div>
        <Button
          onClick={() => { setActiveTab("goals"); setShowModal(true) }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Plus className="w-4 h-4" />
          Yeni Hedef Ekle
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aylık Bütçe</p>
              <p className="text-xl font-bold">{totalBudget.toLocaleString("tr-TR")} ₺</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Harcanan</p>
              <p className="text-xl font-bold">{totalSpent.toLocaleString("tr-TR")} ₺</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <PiggyBank className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Kalan</p>
              <p className={cn("text-xl font-bold", totalBudget - totalSpent >= 0 ? "text-emerald-400" : "text-red-400")}>
                {(totalBudget - totalSpent).toLocaleString("tr-TR")} ₺
              </p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aktif Hedefler</p>
              <p className="text-xl font-bold">{goals.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {goals.length > 0 
                  ? `Toplam: ${goals.reduce((s, g) => s + g.target, 0).toLocaleString("tr-TR")} ₺`
                  : "Hedef ekleyin"}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "budget" ? "default" : "outline"}
          onClick={() => setActiveTab("budget")}
          className={cn(activeTab === "budget" ? "bg-primary text-primary-foreground" : "bg-secondary/30 border-border/50")}
        >
          <Wallet className="w-4 h-4 mr-2" />
          Bütçe Takibi
        </Button>
        <Button
          variant={activeTab === "goals" ? "default" : "outline"}
          onClick={() => setActiveTab("goals")}
          className={cn(activeTab === "goals" ? "bg-primary text-primary-foreground" : "bg-secondary/30 border-border/50")}
        >
          <Target className="w-4 h-4 mr-2" />
          Birikim Hedefleri
          {goals.length > 0 && (
            <span className="ml-2 w-5 h-5 rounded-full bg-primary-foreground/20 text-xs flex items-center justify-center">
              {goals.length}
            </span>
          )}
        </Button>
      </div>

      {/* ── BÜTÇE TAKİBİ ── */}
      {activeTab === "budget" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold mb-4">Kategori Bazlı Bütçe</h2>
              <div className="space-y-6">
                {budgetCategories.map(category => {
                  const Icon = category.icon
                  const percentage = (category.spent / category.budget) * 100
                  const isOverBudget = category.spent > category.budget
                  return (
                    <div key={category.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", category.color + "/20")}>
                            <Icon className={cn("w-5 h-5", category.color.replace("bg-", "text-"))} />
                          </div>
                          <div>
                            <h3 className="font-medium">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {category.spent.toLocaleString("tr-TR")} / {category.budget.toLocaleString("tr-TR")} ₺
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn("font-semibold", isOverBudget ? "text-red-400" : "text-foreground")}>
                            {percentage.toFixed(0)}%
                          </p>
                          {isOverBudget && (
                            <p className="text-xs text-red-400">
                              +{(category.spent - category.budget).toLocaleString("tr-TR")} ₺ aşım
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all duration-500", isOverBudget ? "bg-red-500" : category.color)}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold mb-4">Aylık Özet</h2>
              <div className="space-y-3">
                {monthlyInsights.slice(-4).map((month, index) => (
                  <div key={index} className="p-3 bg-secondary/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{month.month}</span>
                      <span className={cn("text-sm font-semibold", month.income - month.expense >= 0 ? "text-emerald-400" : "text-red-400")}>
                        +{(month.income - month.expense).toLocaleString("tr-TR")} ₺
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-emerald-400">+{month.income.toLocaleString("tr-TR")}</span>
                      <span>/</span>
                      <span className="text-red-400">-{month.expense.toLocaleString("tr-TR")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Hedef Önerileri */}
            {goals.length > 0 && (
              <GlassCard className="p-6 border-primary/30" glow>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Hedef Önerileri</h3>
                    <p className="text-sm text-muted-foreground">
                      Bütçenize göre hedeflerinize ulaşma planı
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {goals.slice(0, 3).map(goal => {
                    const remaining = goal.target - goal.current
                    const monthsLeft = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))
                    const neededPerMonth = monthsLeft > 0 ? remaining / monthsLeft : remaining
                    const canAfford = (totalBudget - totalSpent) >= neededPerMonth

                    return (
                      <div key={goal.id} className="p-3 bg-secondary/30 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{goal.name}</span>
                          <span className={cn("text-xs font-semibold", canAfford ? "text-emerald-400" : "text-orange-400")}>
                            {neededPerMonth.toLocaleString("tr-TR")} ₺/ay
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {Math.round((goal.current / goal.target) * 100)}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {canAfford 
                            ? `✓ Mevcut bütçenizle ulaşabilirsiniz (${monthsLeft} ay)` 
                            : `⚠ Aylık ${(neededPerMonth - (totalBudget - totalSpent)).toLocaleString("tr-TR")} ₺ daha tasarruf gerekli`}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      )}

      {/* ── BİRİKİM HEDEFLERİ ── */}
      {activeTab === "goals" && (
        <>
          {loadingGoals ? (
            <GlassCard className="p-12 text-center">
              <p className="text-muted-foreground text-sm animate-pulse">Hedefler yükleniyor...</p>
            </GlassCard>
          ) : goals.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Henüz hedef yok</h3>
              <p className="text-muted-foreground text-sm mb-4">İlk birikim hedefinizi oluşturun.</p>
              <Button onClick={() => setShowModal(true)} className="bg-primary text-primary-foreground gap-2">
                <Plus className="w-4 h-4" />
                Hedef Ekle
              </Button>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map(goal => {
                const iconOpt    = goalIconOptions.find(o => o.id === goal.iconId) ?? goalIconOptions[0]
                const Icon       = iconOpt.icon
                const percentage = (goal.current / goal.target) * 100
                const remaining  = goal.target - goal.current
                const deadline   = new Date(goal.deadline)
                const monthsLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))

                return (
                  <GlassCard key={goal.id} className="p-6" glow={goal.priority === "high"}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          goal.priority === "high"   ? "bg-primary/20" :
                          goal.priority === "medium" ? "bg-orange-500/20" : "bg-secondary"
                        )}>
                          <Icon className={cn(
                            "w-6 h-6",
                            goal.priority === "high"   ? "text-primary" :
                            goal.priority === "medium" ? "text-orange-400" : "text-muted-foreground"
                          )} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{goal.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{monthsLeft > 0 ? `${monthsLeft} ay kaldı` : "Süresi geçti"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                         onClick={() => handleDeleteGoal(goal.id!)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">İlerleme</span>
                          <span className="font-semibold">{Math.min(percentage, 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-3 bg-secondary/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-secondary/30 rounded-xl">
                          <p className="text-xs text-muted-foreground mb-1">Biriken</p>
                          <p className="text-lg font-bold text-emerald-400">
                            {goal.current.toLocaleString("tr-TR")} ₺
                          </p>
                        </div>
                        <div className="p-3 bg-secondary/30 rounded-xl">
                          <p className="text-xs text-muted-foreground mb-1">Hedef</p>
                          <p className="text-lg font-bold">{goal.target.toLocaleString("tr-TR")} ₺</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                        <div>
                          <p className="text-xs text-muted-foreground">Aylık Katkı</p>
                          <p className="font-semibold">{goal.monthlyContribution.toLocaleString("tr-TR")} ₺</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Kalan</p>
                          <p className="font-semibold">{remaining.toLocaleString("tr-TR")} ₺</p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                )
              })}

              {/* Yeni hedef ekle kartı */}
              <button
                onClick={() => setShowModal(true)}
                className="group p-6 rounded-2xl border-2 border-dashed border-border/50 hover:border-primary/50 transition-all duration-300 flex flex-col items-center justify-center gap-3 hover:bg-primary/5 min-h-[200px]"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/50 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                  Yeni Hedef Ekle
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
