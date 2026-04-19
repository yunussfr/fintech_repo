"use client"

import { useState } from "react"
import {
  Target, Plus, TrendingUp, Wallet, PiggyBank, Home, Car,
  Plane, GraduationCap, Heart, Gift, Sparkles, AlertCircle,
  CheckCircle2, Clock, Edit2, Trash2, X
} from "lucide-react"
import { GlassCard } from "@/components/dashboard/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

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

const budgetCategories = [
  { id: "housing",       name: "Konut",    icon: Home,          budget: 10000, spent: 8500,  color: "bg-blue-500" },
  { id: "transport",     name: "Ulaşım",   icon: Car,           budget: 3000,  spent: 2100,  color: "bg-cyan-500" },
  { id: "food",          name: "Yiyecek",  icon: Wallet,        budget: 4000,  spent: 4200,  color: "bg-orange-500" },
  { id: "health",        name: "Sağlık",   icon: Heart,         budget: 2000,  spent: 800,   color: "bg-red-500" },
  { id: "education",     name: "Eğitim",   icon: GraduationCap, budget: 2500,  spent: 1200,  color: "bg-green-500" },
  { id: "entertainment", name: "Eğlence",  icon: Gift,          budget: 1500,  spent: 1800,  color: "bg-purple-500" },
]

const monthlyInsights = [
  { month: "Ocak",    income: 53500, expense: 38000 },
  { month: "Şubat",  income: 53500, expense: 42000 },
  { month: "Mart",   income: 58500, expense: 35000 },
  { month: "Nisan",  income: 53500, expense: 40000 },
  { month: "Mayıs",  income: 55000, expense: 37000 },
  { month: "Haziran",income: 53500, expense: 39000 },
]

interface Goal {
  id: number
  name: string
  iconId: string
  target: number
  current: number
  deadline: string
  priority: string
  monthlyContribution: number
}

const initialGoals: Goal[] = [
  { id: 1, name: "Acil Durum Fonu", iconId: "piggybank", target: 100000, current: 65000, deadline: "2024-12-31", priority: "high",   monthlyContribution: 5000  },
  { id: 2, name: "Ev Peşinatı",     iconId: "home",      target: 500000, current: 125000, deadline: "2026-06-01", priority: "high",   monthlyContribution: 12000 },
  { id: 3, name: "Yaz Tatili",      iconId: "plane",     target: 30000,  current: 22000, deadline: "2024-07-01", priority: "medium", monthlyContribution: 3000  },
  { id: 4, name: "Yeni Araba",      iconId: "car",       target: 800000, current: 180000, deadline: "2027-01-01", priority: "low",    monthlyContribution: 15000 },
]

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
  const [activeTab, setActiveTab]   = useState<"budget" | "goals">("budget")
  const [goals, setGoals]           = useState<Goal[]>(initialGoals)
  const [showModal, setShowModal]   = useState(false)
  const [form, setForm]             = useState(emptyForm)
  const [formError, setFormError]   = useState("")

  const totalBudget      = budgetCategories.reduce((s, c) => s + c.budget, 0)
  const totalSpent       = budgetCategories.reduce((s, c) => s + c.spent, 0)
  const overBudgetCount  = budgetCategories.filter(c => c.spent > c.budget).length

  const handleAddGoal = () => {
    setFormError("")
    if (!form.name.trim())    return setFormError("Hedef adı zorunludur.")
    if (!form.target)         return setFormError("Hedef tutarı zorunludur.")
    if (!form.deadline)       return setFormError("Son tarih zorunludur.")

    const newGoal: Goal = {
      id:                  Date.now(),
      name:                form.name.trim(),
      iconId:              form.iconId,
      target:              Number(form.target),
      current:             Number(form.current) || 0,
      deadline:            form.deadline,
      priority:            form.priority,
      monthlyContribution: Number(form.monthlyContribution) || 0,
    }
    setGoals(prev => [newGoal, ...prev])
    setForm(emptyForm)
    setShowModal(false)
  }

  const handleDeleteGoal = (id: number) => {
    setGoals(prev => prev.filter(g => g.id !== id))
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
                className="bg-primary text-primary-foreground gap-2"
              >
                <Plus className="w-4 h-4" />
                Hedef Ekle
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
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", overBudgetCount > 0 ? "bg-red-500/20" : "bg-emerald-500/20")}>
              {overBudgetCount > 0
                ? <AlertCircle className="w-6 h-6 text-red-400" />
                : <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bütçe Durumu</p>
              <p className={cn("text-xl font-bold", overBudgetCount > 0 ? "text-red-400" : "text-emerald-400")}>
                {overBudgetCount > 0 ? `${overBudgetCount} Aşım` : "İyi"}
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

            <GlassCard className="p-6 border-primary/30" glow>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">AI Analiz</h3>
                  <p className="text-sm text-muted-foreground">
                    Yiyecek ve eğlence kategorilerinde bütçe aşımı var. Bu ay 2.500₺ tasarruf etmek için bu alanlarda harcamaları azaltmanızı öneririm.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* ── BİRİKİM HEDEFLERİ ── */}
      {activeTab === "goals" && (
        <>
          {goals.length === 0 ? (
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
                          onClick={() => handleDeleteGoal(goal.id)}
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
