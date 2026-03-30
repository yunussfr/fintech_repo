"use client"

import { useState } from "react"
import { 
  Target, Plus, TrendingUp, Wallet, PiggyBank, Home, Car, 
  Plane, GraduationCap, Heart, Gift, Sparkles, AlertCircle,
  CheckCircle2, Clock, Edit2, Trash2
} from "lucide-react"
import { GlassCard } from "@/components/dashboard/glass-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const budgetCategories = [
  { id: "housing", name: "Konut", icon: Home, budget: 10000, spent: 8500, color: "bg-blue-500" },
  { id: "transport", name: "Ulasim", icon: Car, budget: 3000, spent: 2100, color: "bg-cyan-500" },
  { id: "food", name: "Yiyecek", icon: Wallet, budget: 4000, spent: 4200, color: "bg-orange-500" },
  { id: "health", name: "Saglik", icon: Heart, budget: 2000, spent: 800, color: "bg-red-500" },
  { id: "education", name: "Egitim", icon: GraduationCap, budget: 2500, spent: 1200, color: "bg-green-500" },
  { id: "entertainment", name: "Eglence", icon: Gift, budget: 1500, spent: 1800, color: "bg-purple-500" },
]

const savingsGoals = [
  { 
    id: 1, 
    name: "Acil Durum Fonu", 
    icon: PiggyBank, 
    target: 100000, 
    current: 65000, 
    deadline: "2024-12-31",
    priority: "high",
    monthlyContribution: 5000
  },
  { 
    id: 2, 
    name: "Ev Pesinati", 
    icon: Home, 
    target: 500000, 
    current: 125000, 
    deadline: "2026-06-01",
    priority: "high",
    monthlyContribution: 12000
  },
  { 
    id: 3, 
    name: "Yaz Tatili", 
    icon: Plane, 
    target: 30000, 
    current: 22000, 
    deadline: "2024-07-01",
    priority: "medium",
    monthlyContribution: 3000
  },
  { 
    id: 4, 
    name: "Yeni Araba", 
    icon: Car, 
    target: 800000, 
    current: 180000, 
    deadline: "2027-01-01",
    priority: "low",
    monthlyContribution: 15000
  },
]

const monthlyInsights = [
  { month: "Ocak", income: 53500, expense: 38000 },
  { month: "Subat", income: 53500, expense: 42000 },
  { month: "Mart", income: 58500, expense: 35000 },
  { month: "Nisan", income: 53500, expense: 40000 },
  { month: "Mayis", income: 55000, expense: 37000 },
  { month: "Haziran", income: 53500, expense: 39000 },
]

export default function BudgetPage() {
  const [activeTab, setActiveTab] = useState<"budget" | "goals">("budget")

  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budget, 0)
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0)
  const overBudgetCount = budgetCategories.filter(cat => cat.spent > cat.budget).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold metallic-text">Butce ve Hedefler</h1>
          <p className="text-muted-foreground mt-1">Harcamalarinizi yonetin ve hedeflerinize ulasin</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
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
              <p className="text-sm text-muted-foreground">Aylik Butce</p>
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
              <p className={cn(
                "text-xl font-bold",
                totalBudget - totalSpent >= 0 ? "text-emerald-400" : "text-red-400"
              )}>
                {(totalBudget - totalSpent).toLocaleString("tr-TR")} ₺
              </p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              overBudgetCount > 0 ? "bg-red-500/20" : "bg-emerald-500/20"
            )}>
              {overBudgetCount > 0 ? (
                <AlertCircle className="w-6 h-6 text-red-400" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Butce Durumu</p>
              <p className={cn(
                "text-xl font-bold",
                overBudgetCount > 0 ? "text-red-400" : "text-emerald-400"
              )}>
                {overBudgetCount > 0 ? `${overBudgetCount} Asim` : "Iyi"}
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
          className={cn(
            activeTab === "budget" 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary/30 border-border/50"
          )}
        >
          <Wallet className="w-4 h-4 mr-2" />
          Butce Takibi
        </Button>
        <Button
          variant={activeTab === "goals" ? "default" : "outline"}
          onClick={() => setActiveTab("goals")}
          className={cn(
            activeTab === "goals" 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary/30 border-border/50"
          )}
        >
          <Target className="w-4 h-4 mr-2" />
          Birikim Hedefleri
        </Button>
      </div>

      {activeTab === "budget" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Budget Categories */}
          <div className="lg:col-span-2 space-y-4">
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold mb-4">Kategori Bazli Butce</h2>
              <div className="space-y-6">
                {budgetCategories.map(category => {
                  const Icon = category.icon
                  const percentage = (category.spent / category.budget) * 100
                  const isOverBudget = category.spent > category.budget
                  
                  return (
                    <div key={category.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            category.color + "/20"
                          )}>
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
                          <p className={cn(
                            "font-semibold",
                            isOverBudget ? "text-red-400" : "text-foreground"
                          )}>
                            {percentage.toFixed(0)}%
                          </p>
                          {isOverBudget && (
                            <p className="text-xs text-red-400">
                              +{(category.spent - category.budget).toLocaleString("tr-TR")} ₺ asim
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            isOverBudget ? "bg-red-500" : category.color
                          )}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          </div>

          {/* Monthly Summary */}
          <div className="space-y-6">
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold mb-4">Aylik Ozet</h2>
              <div className="space-y-3">
                {monthlyInsights.slice(-4).map((month, index) => (
                  <div key={index} className="p-3 bg-secondary/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{month.month}</span>
                      <span className={cn(
                        "text-sm font-semibold",
                        month.income - month.expense >= 0 ? "text-emerald-400" : "text-red-400"
                      )}>
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

            {/* AI Insight */}
            <GlassCard className="p-6 border-primary/30" glow>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">AI Analiz</h3>
                  <p className="text-sm text-muted-foreground">
                    Yiyecek ve eglence kategorilerinde butce asimi var. Bu ay 2.500₺ tasarruf etmek icin bu alanlarda harcamalari azaltmanizi oneririm.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savingsGoals.map(goal => {
            const Icon = goal.icon
            const percentage = (goal.current / goal.target) * 100
            const remaining = goal.target - goal.current
            const deadline = new Date(goal.deadline)
            const monthsLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))
            
            return (
              <GlassCard key={goal.id} className="p-6" glow={goal.priority === "high"}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      goal.priority === "high" ? "bg-primary/20" : 
                      goal.priority === "medium" ? "bg-orange-500/20" : "bg-secondary"
                    )}>
                      <Icon className={cn(
                        "w-6 h-6",
                        goal.priority === "high" ? "text-primary" : 
                        goal.priority === "medium" ? "text-orange-400" : "text-muted-foreground"
                      )} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{goal.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{monthsLeft} ay kaldi</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Ilerleme</span>
                      <span className="font-semibold">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-secondary/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
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
                      <p className="text-lg font-bold">
                        {goal.target.toLocaleString("tr-TR")} ₺
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                    <div>
                      <p className="text-xs text-muted-foreground">Aylik Katki</p>
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
        </div>
      )}
    </div>
  )
}
