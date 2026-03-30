"use client"

import { useState } from "react"
import { 
  Search, Filter, Download, ArrowUpRight, ArrowDownLeft, 
  Calendar, ChevronDown, MoreHorizontal, CreditCard, 
  Building2, ShoppingBag, Utensils, Car, Home, Zap, Heart,
  Plane, Gamepad2, GraduationCap
} from "lucide-react"
import { GlassCard } from "@/components/dashboard/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const categories = [
  { id: "all", name: "Tumu", icon: Filter },
  { id: "shopping", name: "Alisveris", icon: ShoppingBag },
  { id: "food", name: "Yemek", icon: Utensils },
  { id: "transport", name: "Ulasim", icon: Car },
  { id: "bills", name: "Faturalar", icon: Zap },
  { id: "health", name: "Saglik", icon: Heart },
  { id: "travel", name: "Seyahat", icon: Plane },
  { id: "entertainment", name: "Eglence", icon: Gamepad2 },
  { id: "education", name: "Egitim", icon: GraduationCap },
]

const transactions = [
  { 
    id: 1, 
    title: "Netflix Abonelik", 
    category: "entertainment", 
    amount: -129.99, 
    date: "2024-03-28", 
    time: "14:30",
    account: "Kredi Karti",
    status: "completed",
    recurring: true
  },
  { 
    id: 2, 
    title: "Maas Yatirma", 
    category: "income", 
    amount: 45000, 
    date: "2024-03-25", 
    time: "09:00",
    account: "Ana Hesap",
    status: "completed",
    recurring: true
  },
  { 
    id: 3, 
    title: "Migros Market", 
    category: "shopping", 
    amount: -856.50, 
    date: "2024-03-24", 
    time: "18:45",
    account: "Banka Karti",
    status: "completed",
    recurring: false
  },
  { 
    id: 4, 
    title: "Elektrik Faturasi", 
    category: "bills", 
    amount: -423.00, 
    date: "2024-03-23", 
    time: "10:15",
    account: "Otomatik Odeme",
    status: "completed",
    recurring: true
  },
  { 
    id: 5, 
    title: "Starbucks", 
    category: "food", 
    amount: -87.50, 
    date: "2024-03-23", 
    time: "08:30",
    account: "Kredi Karti",
    status: "completed",
    recurring: false
  },
  { 
    id: 6, 
    title: "Uber Yolculuk", 
    category: "transport", 
    amount: -145.00, 
    date: "2024-03-22", 
    time: "19:20",
    account: "Kredi Karti",
    status: "completed",
    recurring: false
  },
  { 
    id: 7, 
    title: "Freelance Odeme", 
    category: "income", 
    amount: 8500, 
    date: "2024-03-21", 
    time: "16:00",
    account: "Ana Hesap",
    status: "completed",
    recurring: false
  },
  { 
    id: 8, 
    title: "Eczane", 
    category: "health", 
    amount: -234.00, 
    date: "2024-03-20", 
    time: "12:30",
    account: "Banka Karti",
    status: "completed",
    recurring: false
  },
  { 
    id: 9, 
    title: "Udemy Kurs", 
    category: "education", 
    amount: -449.00, 
    date: "2024-03-19", 
    time: "21:45",
    account: "Kredi Karti",
    status: "completed",
    recurring: false
  },
  { 
    id: 10, 
    title: "Kira Odemesi", 
    category: "bills", 
    amount: -8500, 
    date: "2024-03-15", 
    time: "09:00",
    account: "Ana Hesap",
    status: "completed",
    recurring: true
  },
  { 
    id: 11, 
    title: "THY Ucak Bileti", 
    category: "travel", 
    amount: -2450.00, 
    date: "2024-03-14", 
    time: "15:30",
    account: "Kredi Karti",
    status: "pending",
    recurring: false
  },
  { 
    id: 12, 
    title: "Steam Oyun", 
    category: "entertainment", 
    amount: -349.00, 
    date: "2024-03-12", 
    time: "22:00",
    account: "Kredi Karti",
    status: "completed",
    recurring: false
  },
]

const getCategoryIcon = (category: string) => {
  const icons: Record<string, React.ElementType> = {
    shopping: ShoppingBag,
    food: Utensils,
    transport: Car,
    bills: Zap,
    health: Heart,
    travel: Plane,
    entertainment: Gamepad2,
    education: GraduationCap,
    income: Building2,
  }
  return icons[category] || CreditCard
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    shopping: "bg-pink-500/20 text-pink-400",
    food: "bg-orange-500/20 text-orange-400",
    transport: "bg-blue-500/20 text-blue-400",
    bills: "bg-yellow-500/20 text-yellow-400",
    health: "bg-red-500/20 text-red-400",
    travel: "bg-cyan-500/20 text-cyan-400",
    entertainment: "bg-purple-500/20 text-purple-400",
    education: "bg-green-500/20 text-green-400",
    income: "bg-emerald-500/20 text-emerald-400",
  }
  return colors[category] || "bg-gray-500/20 text-gray-400"
}

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [dateRange, setDateRange] = useState("Bu Ay")

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold metallic-text">Islem Gecmisi</h1>
          <p className="text-muted-foreground mt-1">Tum finansal islemlerinizi goruntuleyin</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Download className="w-4 h-4" />
          Rapor Indir
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <ArrowDownLeft className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Toplam Gelir</p>
              <p className="text-xl font-bold text-emerald-400">
                +{totalIncome.toLocaleString("tr-TR")} ₺
              </p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Toplam Gider</p>
              <p className="text-xl font-bold text-red-400">
                -{totalExpense.toLocaleString("tr-TR")} ₺
              </p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Bakiye</p>
              <p className={cn(
                "text-xl font-bold",
                totalIncome - totalExpense >= 0 ? "text-emerald-400" : "text-red-400"
              )}>
                {totalIncome - totalExpense >= 0 ? "+" : ""}{(totalIncome - totalExpense).toLocaleString("tr-TR")} ₺
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Islem ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border/50"
            />
          </div>

          {/* Date Range */}
          <Button variant="outline" className="gap-2 bg-secondary/50 border-border/50">
            <Calendar className="w-4 h-4" />
            {dateRange}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map(cat => {
            const Icon = cat.icon
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "gap-2",
                  selectedCategory === cat.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary/30 border-border/50 hover:bg-secondary/50"
                )}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </Button>
            )
          })}
        </div>
      </GlassCard>

      {/* Transactions List */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="divide-y divide-border/50">
          {filteredTransactions.map((transaction) => {
            const CategoryIcon = getCategoryIcon(transaction.category)
            return (
              <div 
                key={transaction.id}
                className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  getCategoryColor(transaction.category)
                )}>
                  <CategoryIcon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium truncate">{transaction.title}</h3>
                    {transaction.recurring && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                        Tekrarli
                      </span>
                    )}
                    {transaction.status === "pending" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">
                        Beklemede
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span>{transaction.account}</span>
                    <span>•</span>
                    <span>{new Date(transaction.date).toLocaleDateString("tr-TR")}</span>
                    <span>•</span>
                    <span>{transaction.time}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className={cn(
                    "text-lg font-semibold",
                    transaction.amount > 0 ? "text-emerald-400" : "text-foreground"
                  )}>
                    {transaction.amount > 0 ? "+" : ""}{transaction.amount.toLocaleString("tr-TR")} ₺
                  </p>
                </div>

                <Button variant="ghost" size="icon" className="shrink-0">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
            )
          })}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">Islem Bulunamadi</h3>
            <p className="text-muted-foreground mt-1">Arama kriterlerinize uygun islem yok</p>
          </div>
        )}
      </GlassCard>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredTransactions.length} islem gosteriliyor
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="bg-secondary/30 border-border/50">
            Onceki
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
            1
          </Button>
          <Button variant="outline" size="sm" className="bg-secondary/30 border-border/50">
            2
          </Button>
          <Button variant="outline" size="sm" className="bg-secondary/30 border-border/50">
            3
          </Button>
          <Button variant="outline" size="sm" className="bg-secondary/30 border-border/50">
            Sonraki
          </Button>
        </div>
      </div>
    </div>
  )
}
