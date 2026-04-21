"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Search, Filter, Plus, Download, ArrowUpRight, ArrowDownLeft,
  Calendar, ChevronDown, MoreHorizontal, CreditCard,
  Building2, ShoppingBag, Utensils, Car, Home, Zap, Heart,
  Plane, Gamepad2, GraduationCap, X, AlertCircle
} from "lucide-react"
import { GlassCard } from "@/components/dashboard/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import {
  addTransaction,
  deleteTransaction,
  addActivityLog,
  type Transaction,
} from "@/lib/firestore"
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

// ── Kategori Tanımları ────────────────────────────────────────────────────────

const categories = [
  { id: "all",           name: "Tümü",           icon: Filter },
  { id: "shopping",      name: "Alışveriş",       icon: ShoppingBag },
  { id: "food",          name: "Yemek",           icon: Utensils },
  { id: "transport",     name: "Ulaşım",          icon: Car },
  { id: "bills",         name: "Faturalar",       icon: Zap },
  { id: "health",        name: "Sağlık",          icon: Heart },
  { id: "travel",        name: "Seyahat",         icon: Plane },
  { id: "entertainment", name: "Eğlence",         icon: Gamepad2 },
  { id: "education",     name: "Eğitim",          icon: GraduationCap },
  { id: "income",        name: "Gelir",           icon: Building2 },
]

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  shopping: ShoppingBag, food: Utensils, transport: Car,
  bills: Zap, health: Heart, travel: Plane,
  entertainment: Gamepad2, education: GraduationCap,
  income: Building2,
}

const CATEGORY_COLORS: Record<string, string> = {
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

// ── Form Başlangıç Değerleri ──────────────────────────────────────────────────

const emptyForm = {
  name: "", category: "shopping",
  amount: "", type: "expense" as "income" | "expense",
  date: new Date().toISOString().split("T")[0],
}

// ── Sayfa Bileşeni ────────────────────────────────────────────────────────────

export default function TransactionsPage() {
  const { user } = useAuth()

  const [transactions,      setTransactions]      = useState<Transaction[]>([])
  const [loading,           setLoading]           = useState(true)
  const [searchQuery,       setSearchQuery]       = useState("")
  const [selectedCategory,  setSelectedCategory]  = useState("all")
  const [showModal,         setShowModal]         = useState(false)
  const [form,              setForm]              = useState(emptyForm)
  const [formError,         setFormError]         = useState("")
  const [saving,            setSaving]            = useState(false)

  // ── Firestore'dan İşlemleri Çek (Realtime) ──────────────────────────────
  useEffect(() => {
    if (!user) return
    
    setLoading(true)
    
    // Realtime listener - işlem eklenince/silinince otomatik güncellenir
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(100)
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

  // ── Hesaplamalar ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() =>
    transactions.filter(t => {
      const matchSearch = (t.name ?? "").toLowerCase().includes(searchQuery.toLowerCase())
      const matchCat    = selectedCategory === "all" || t.category === selectedCategory
      return matchSearch && matchCat
    }), [transactions, searchQuery, selectedCategory]
  )

  const totalIncome  = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)

  // ── Yeni İşlem Ekle ──────────────────────────────────────────────────────────
  const handleAdd = async () => {
    setFormError("")
    if (!user)            return setFormError("Oturum bulunamadı.")
    if (!form.name.trim()) return setFormError("İşlem adı zorunludur.")
    if (!form.amount)      return setFormError("Tutar zorunludur.")

    setSaving(true)
    const rawAmount  = Number(form.amount)
    const signedAmt  = form.type === "expense" ? -Math.abs(rawAmount) : Math.abs(rawAmount)
    const payload    = {
      name:     form.name.trim(),
      category: form.category,
      amount:   signedAmt,
      type:     form.type,
      date:     new Date(form.date),
    }

    const { id, error } = await addTransaction(user.uid, payload)
    if (error || !id) {
      setFormError("Kaydedilemedi: " + (error ?? "bilinmeyen hata"))
      setSaving(false)
      return
    }

    await addActivityLog(user.uid, "transaction_added", `${payload.name}: ${signedAmt} ₺`)
    
    // Realtime listener otomatik ekleyecek, manuel eklemeye gerek yok
    setForm(emptyForm)
    setShowModal(false)
    setSaving(false)
  }

  // ── İşlem Sil ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!id || !confirm("Bu işlem silinsin mi?")) return
    const { error } = await deleteTransaction(id)
    // Realtime listener otomatik güncelleyecek, manuel silmeye gerek yok
    if (error) console.error("Silinemedi:", error)
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── YENİ İŞLEM MODAL ─────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md glass-card rounded-2xl p-6 border border-border/50 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold">Yeni İşlem Ekle</h2>
                <p className="text-sm text-muted-foreground">Finansal işleminizi kaydedin</p>
              </div>
              <button onClick={() => { setShowModal(false); setFormError("") }}
                className="w-8 h-8 rounded-lg bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {formError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />{formError}
                </div>
              )}

              {/* Tür */}
              <div className="grid grid-cols-2 gap-2">
                {(["expense", "income"] as const).map(t => (
                  <button key={t} onClick={() => setForm(p => ({ ...p, type: t }))}
                    className={cn("py-3 rounded-xl text-sm font-semibold border-2 transition-all",
                      form.type === t
                        ? t === "expense" ? "bg-red-500/20 border-red-500 text-red-400" : "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : "border-transparent bg-secondary/50 hover:bg-secondary text-muted-foreground"
                    )}>
                    {t === "expense" ? "💸 Gider" : "💰 Gelir"}
                  </button>
                ))}
              </div>

              {/* Ad */}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">İşlem Adı *</label>
                <Input placeholder="Örn: Market, Maaş..." value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="bg-secondary/50 border-border/50" />
              </div>

              {/* Tutar + Tarih */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Tutar (₺) *</label>
                  <Input type="number" placeholder="0" value={form.amount}
                    onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                    className="bg-secondary/50 border-border/50" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Tarih</label>
                  <Input type="date" value={form.date}
                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    className="bg-secondary/50 border-border/50" />
                </div>
              </div>

              {/* Kategori */}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Kategori</label>
                <select value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-xl text-sm">
                  {categories.filter(c => c.id !== "all").map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border/50">
              <Button variant="outline" onClick={() => { setShowModal(false); setForm(emptyForm); setFormError("") }}
                className="bg-secondary/30 border-border/50">İptal</Button>
              <Button onClick={handleAdd} disabled={saving}
                className="bg-primary text-primary-foreground gap-2 disabled:opacity-60">
                <Plus className="w-4 h-4" />
                {saving ? "Kaydediliyor..." : "İşlem Ekle"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold metallic-text">İşlem Geçmişi</h1>
          <p className="text-muted-foreground mt-1">Tüm finansal işlemlerinizi görüntüleyin</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            <Plus className="w-4 h-4" />Yeni İşlem
          </Button>
          <Button variant="outline" className="gap-2 bg-secondary/30 border-border/50">
            <Download className="w-4 h-4" />Rapor İndir
          </Button>
        </div>
      </div>

      {/* ── ÖZET KARTLAR ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <ArrowDownLeft className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Toplam Gelir</p>
              <p className="text-xl font-bold text-emerald-400">+{totalIncome.toLocaleString("tr-TR")} ₺</p>
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
              <p className="text-xl font-bold text-red-400">-{totalExpense.toLocaleString("tr-TR")} ₺</p>
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
              <p className={cn("text-xl font-bold", totalIncome - totalExpense >= 0 ? "text-emerald-400" : "text-red-400")}>
                {totalIncome - totalExpense >= 0 ? "+" : ""}{(totalIncome - totalExpense).toLocaleString("tr-TR")} ₺
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ── FİLTRELER ────────────────────────────────────────────────────── */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="İşlem ara..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border/50" />
          </div>
          <Button variant="outline" className="gap-2 bg-secondary/50 border-border/50">
            <Calendar className="w-4 h-4" />Bu Ay<ChevronDown className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map(cat => {
            const Icon = cat.icon
            return (
              <Button key={cat.id} variant={selectedCategory === cat.id ? "default" : "outline"} size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn("gap-2", selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/30 border-border/50 hover:bg-secondary/50")}>
                <Icon className="w-4 h-4" />{cat.name}
              </Button>
            )
          })}
        </div>
      </GlassCard>

      {/* ── İŞLEM LİSTESİ ────────────────────────────────────────────────── */}
      <GlassCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">İşlemler yükleniyor...</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filtered.map(tx => {
              const CategoryIcon = CATEGORY_ICONS[tx.category] ?? CreditCard
              const date = tx.date instanceof Date ? tx.date : (tx.date as any)?.toDate?.() ?? new Date()
              return (
                <div key={tx.id}
                  className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors group">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    CATEGORY_COLORS[tx.category] ?? "bg-gray-500/20 text-gray-400")}>
                    <CategoryIcon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{tx.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/50 text-muted-foreground capitalize">
                        {categories.find(c => c.id === tx.category)?.name ?? tx.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>{date.toLocaleDateString("tr-TR")}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={cn("text-lg font-semibold",
                      tx.amount > 0 ? "text-emerald-400" : "text-foreground")}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString("tr-TR")} ₺
                    </p>
                  </div>

                  <Button variant="ghost" size="icon"
                    onClick={() => handleDelete(tx.id!)}
                    className="shrink-0 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )
            })}

            {filtered.length === 0 && !loading && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">İşlem Bulunamadı</h3>
                <p className="text-muted-foreground mt-1 text-sm">Arama kriterlerinize uygun işlem yok</p>
                <Button onClick={() => setShowModal(true)}
                  className="mt-4 bg-primary text-primary-foreground gap-2">
                  <Plus className="w-4 h-4" />İlk İşlemi Ekle
                </Button>
              </div>
            )}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              {filtered.length} işlem gösteriliyor
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
