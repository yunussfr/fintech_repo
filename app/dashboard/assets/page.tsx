"use client"
// app/dashboard/assets/page.tsx

import { useState, useEffect } from "react"
import {
  Landmark, Plus, Trash2, Building2, Banknote,
  Home, PackageOpen, TrendingUp, AlertCircle, X, Wallet
} from "lucide-react"
import { GlassCard } from "@/components/dashboard/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import {
  addAsset,
  getUserAssets,
  deleteAsset,
  addActivityLog,
  type Asset,
} from "@/lib/firestore"

// ── Sabitler ─────────────────────────────────────────────────────────────────

const ASSET_TYPES: Asset["type"][] = ["bank", "cash", "real_estate", "other"]

const TYPE_ICONS: Record<Asset["type"], React.ElementType> = {
  bank:        Landmark,
  cash:        Banknote,
  real_estate: Home,
  other:       PackageOpen,
}

const TYPE_COLORS: Record<Asset["type"], string> = {
  bank:        "bg-blue-500/20 text-blue-400",
  cash:        "bg-emerald-500/20 text-emerald-400",
  real_estate: "bg-purple-500/20 text-purple-400",
  other:       "bg-orange-500/20 text-orange-400",
}

const CURRENCIES = ["TRY", "USD", "EUR", "GBP", "CHF"]

const emptyForm = {
  name:     "",
  type:     "bank" as Asset["type"],
  balance:  "",
  currency: "TRY",
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AssetsPage() {
  const { user }       = useAuth()
  const { t }          = useLanguage()

  const [assets,       setAssets]       = useState<Asset[]>([])
  const [loading,      setLoading]      = useState(true)
  const [showModal,    setShowModal]    = useState(false)
  const [form,         setForm]         = useState(emptyForm)
  const [formError,    setFormError]    = useState("")
  const [saving,       setSaving]       = useState(false)
  const [deletingId,   setDeletingId]   = useState<string | null>(null)

  // ── Varlıkları Yükle ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return
    setLoading(true)
    getUserAssets(user.uid).then(({ assets: fetched, error }) => {
      if (error) console.error("Varlıklar yüklenemedi:", error)
      else setAssets(fetched)
      setLoading(false)
    })
  }, [user])

  // ── Özet Hesapları ─────────────────────────────────────────────────────────
  const totalByType = ASSET_TYPES.map((type) => ({
    type,
    total: assets.filter((a) => a.type === type).reduce((s, a) => s + a.balance, 0),
    count: assets.filter((a) => a.type === type).length,
  }))

  const grandTotal = assets.reduce((s, a) => s + a.balance, 0)

  // ── Varlık Ekle ────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    setFormError("")
    if (!user)           return setFormError("Oturum bulunamadı.")
    if (!form.name.trim()) return setFormError("Varlık adı zorunludur.")
    if (!form.balance)   return setFormError("Bakiye zorunludur.")

    setSaving(true)
    const payload = {
      name:     form.name.trim(),
      type:     form.type,
      balance:  Number(form.balance),
      currency: form.currency,
    }

    const { id, error } = await addAsset(user.uid, payload)
    if (error || !id) {
      setFormError("Kaydedilemedi: " + (error ?? "bilinmeyen hata"))
      setSaving(false)
      return
    }

    // Aktivite logu
    await addActivityLog(user.uid, "asset_added", `${payload.name} — ${payload.balance} ${payload.currency}`)

    // UI güncelle
    setAssets((prev) => [{ ...payload, id, userId: user.uid }, ...prev])
    setForm(emptyForm)
    setShowModal(false)
    setSaving(false)
  }

  // ── Varlık Sil ─────────────────────────────────────────────────────────────
  const handleDelete = async (assetId: string, assetName: string) => {
    if (!user) return
    if (!confirm(t("assets.deleteConfirm"))) return
    setDeletingId(assetId)
    const { error } = await deleteAsset(assetId)
    if (!error) {
      await addActivityLog(user.uid, "asset_deleted", assetName)
      setAssets((prev) => prev.filter((a) => a.id !== assetId))
    }
    setDeletingId(null)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── MODAL ──────────────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-md glass-card rounded-2xl p-6 border border-border/50 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Başlık */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">{t("assets.modal.title")}</h2>
                <p className="text-sm text-muted-foreground">{t("assets.modal.subtitle")}</p>
              </div>
              <button
                onClick={() => { setShowModal(false); setFormError("") }}
                className="w-8 h-8 rounded-lg bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Hata */}
              {formError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {formError}
                </div>
              )}

              {/* İsim */}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  {t("assets.modal.name")} *
                </label>
                <Input
                  placeholder={t("assets.modal.namePh")}
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="bg-secondary/50 border-border/50"
                />
              </div>

              {/* Tür */}
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  {t("assets.modal.type")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ASSET_TYPES.map((type) => {
                    const Icon = TYPE_ICONS[type]
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, type }))}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all",
                          form.type === type
                            ? "border-primary bg-primary/20 text-primary"
                            : "border-transparent bg-secondary/50 hover:bg-secondary text-muted-foreground"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {t(`assets.types.${type}`)}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Bakiye + Para Birimi */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">
                    {t("assets.modal.balance")} *
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.balance}
                    onChange={(e) => setForm((p) => ({ ...p, balance: e.target.value }))}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">
                    {t("assets.modal.currency")}
                  </label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}
                    className="w-full h-10 px-3 bg-secondary/50 border border-border/50 rounded-xl text-sm"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Butonlar */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border/50">
              <Button
                variant="outline"
                onClick={() => { setShowModal(false); setForm(emptyForm); setFormError("") }}
                className="bg-secondary/30 border-border/50"
              >
                {t("assets.modal.cancel")}
              </Button>
              <Button
                onClick={handleAdd}
                disabled={saving}
                className="bg-primary text-primary-foreground gap-2 disabled:opacity-60"
              >
                <Plus className="w-4 h-4" />
                {saving ? t("assets.modal.saving") : t("assets.modal.save")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold metallic-text">{t("assets.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("assets.subtitle")}</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Plus className="w-4 h-4" />
          {t("assets.addButton")}
        </Button>
      </div>

      {/* ── ÖZET KARTLAR ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Toplam */}
        <GlassCard className="p-4 md:col-span-2" glow>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
              <TrendingUp className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("assets.totalAssets")}</p>
              <p className="text-2xl font-bold metallic-text">
                {grandTotal.toLocaleString("tr-TR")} ₺
              </p>
              <p className="text-xs text-muted-foreground">
                {assets.length} {t("assets.assetCount").toLowerCase()}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Tür bazlı mini kartlar */}
        {totalByType.slice(0, 2).map(({ type, total, count }) => {
          const Icon = TYPE_ICONS[type]
          return (
            <GlassCard key={type} className="p-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", TYPE_COLORS[type])}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs text-muted-foreground mb-1">{t(`assets.types.${type}`)}</p>
              <p className="text-lg font-bold">{total.toLocaleString("tr-TR")} ₺</p>
              <p className="text-xs text-muted-foreground">{count} adet</p>
            </GlassCard>
          )
        })}
      </div>

      {/* ── VARLIK LİSTESİ ─────────────────────────────────────────────────── */}
      {loading ? (
        <GlassCard className="p-12 text-center">
          <p className="text-muted-foreground text-sm animate-pulse">{t("assets.loading")}</p>
        </GlassCard>
      ) : assets.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t("assets.empty")}</h3>
          <p className="text-muted-foreground text-sm mb-4">{t("assets.emptyDesc")}</p>
          <Button onClick={() => setShowModal(true)} className="bg-primary text-primary-foreground gap-2">
            <Plus className="w-4 h-4" />
            {t("assets.addButton")}
          </Button>
        </GlassCard>
      ) : (
        <GlassCard className="p-6">
          <div className="space-y-3">
            {assets.map((asset) => {
              const Icon = TYPE_ICONS[asset.type]
              const isDeleting = deletingId === asset.id
              return (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", TYPE_COLORS[asset.type])}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">{t(`assets.types.${asset.type}`)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {asset.balance.toLocaleString("tr-TR")} {asset.currency}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isDeleting}
                      onClick={() => handleDelete(asset.id!, asset.name)}
                      className="w-8 h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      {isDeleting
                        ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        : <Trash2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
