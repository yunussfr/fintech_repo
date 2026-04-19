"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { updateProfile } from "firebase/auth"
import { useAuth } from "@/hooks/useAuth"
import { 
  User, Bell, Shield, CreditCard, Globe, Moon, Sun, 
  Smartphone, Mail, Lock, Eye, EyeOff, Check, ChevronRight,
  LogOut, Trash2, Download, HelpCircle, MessageSquare,
  AlertTriangle, BookOpen, LifeBuoy, ExternalLink
} from "lucide-react"
import { GlassCard } from "@/components/dashboard/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const settingsSections = [
  { id: "profile",       name: "Profil",           icon: User },
  { id: "notifications", name: "Bildirimler",       icon: Bell },
  { id: "security",      name: "Güvenlik",          icon: Shield },
  { id: "payments",      name: "Ödeme Yöntemleri",  icon: CreditCard },
  { id: "preferences",   name: "Tercihler",         icon: Globe },
  { id: "help",          name: "Yardım",            icon: HelpCircle },
]

const connectedAccounts = [
  { name: "Ziraat Bankası", type: "Vadesiz",    balance:  45230, lastSync: "2 dk önce" },
  { name: "Garanti BBVA",   type: "Kredi Kartı", balance: -12450, lastSync: "5 dk önce" },
  { name: "Akbank",         type: "Birikim",     balance: 125000, lastSync: "1 saat önce" },
]

// Basit inline toast
function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border animate-in slide-in-from-bottom-4 duration-300",
      type === "success"
        ? "bg-[oklch(0.15_0.02_150)] border-[oklch(0.4_0.12_150/0.5)] text-[oklch(0.8_0.15_150)]"
        : "bg-[oklch(0.15_0.02_25)] border-[oklch(0.5_0.15_25/0.5)] text-[oklch(0.8_0.15_25)]"
    )}>
      {type === "success"
        ? <Check className="w-5 h-5 shrink-0" />
        : <AlertTriangle className="w-5 h-5 shrink-0" />}
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

// Reusable Toggle Switch
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "w-12 h-6 rounded-full transition-colors relative shrink-0",
        checked ? "bg-primary" : "bg-secondary"
      )}
    >
      <div className={cn(
        "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform",
        checked ? "translate-x-6" : "translate-x-0.5"
      )} />
    </button>
  )
}

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()

  const [activeSection, setActiveSection] = useState("profile")

  // Profil state
  const [firstName, setFirstName]   = useState(user?.displayName?.split(" ")[0] ?? "")
  const [lastName, setLastName]     = useState(user?.displayName?.split(" ").slice(1).join(" ") ?? "")
  const [isSaving, setIsSaving]     = useState(false)

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Bildiri state
  const [notifications, setNotifications] = useState({
    email: true, push: true, sms: false,
    weekly: true, budget: true, goals: true,
  })

  const isDark = theme === "dark"

  // Profil Kaydet
  const handleSaveProfile = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      const displayName = `${firstName} ${lastName}`.trim()
      await updateProfile(user, { displayName })
      showToast("Profil başarıyla kaydedildi!", "success")
    } catch {
      showToast("Kaydedilirken bir hata oluştu.", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const avatarInitials = user?.displayName
    ? user.displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? "?").toUpperCase()

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold metallic-text">Ayarlar</h1>
        <p className="text-muted-foreground mt-1">Hesap ve uygulama ayarlarınızı yönetin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <GlassCard className="p-2">
            <nav className="space-y-1">
              {settingsSections.map(section => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
                      activeSection === section.id
                        ? "bg-primary/20 text-primary"
                        : "hover:bg-secondary/50 text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.name}</span>
                  </button>
                )
              })}
            </nav>
          </GlassCard>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">

          {/* ── PROFIL ── */}
          {activeSection === "profile" && (
            <>
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-6">Profil Bilgileri</h2>

                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-3xl font-bold text-primary-foreground">
                      {avatarInitials}
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      <User className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Ad</label>
                        <Input
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                          className="bg-secondary/50 border-border/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Soyad</label>
                        <Input
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                          className="bg-secondary/50 border-border/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">E-posta</label>
                      <Input
                        type="email"
                        value={user?.email ?? ""}
                        readOnly
                        className="bg-secondary/50 border-border/50 opacity-60 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Telefon</label>
                      <Input
                        type="tel"
                        defaultValue="+90 555 123 4567"
                        className="bg-secondary/50 border-border/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" className="bg-secondary/30 border-border/50">
                    İptal
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-primary text-primary-foreground min-w-[160px]"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Değişiklikleri Kaydet
                      </>
                    )}
                  </Button>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-4">Bağlı Hesaplar</h2>
                <div className="space-y-3">
                  {connectedAccounts.map((account, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{account.name}</h3>
                          <p className="text-sm text-muted-foreground">{account.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn("font-semibold", account.balance >= 0 ? "text-emerald-400" : "text-red-400")}>
                          {account.balance.toLocaleString("tr-TR")} ₺
                        </p>
                        <p className="text-xs text-muted-foreground">{account.lastSync}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-secondary/30 border-border/50 gap-2">
                  <CreditCard className="w-4 h-4" />
                  Yeni Hesap Bağla
                </Button>
              </GlassCard>
            </>
          )}

          {/* ── BİLDİRİMLER ── */}
          {activeSection === "notifications" && (
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold mb-6">Bildirim Tercihleri</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4 text-muted-foreground text-sm uppercase tracking-wider">Bildirim Kanalları</h3>
                  <div className="space-y-3">
                    {[
                      { key: "email", icon: Mail,       label: "E-posta Bildirimleri",  desc: "Önemli güncellemeler e-posta ile gelir" },
                      { key: "push",  icon: Bell,       label: "Push Bildirimleri",     desc: "Anlık uygulama bildirimleri" },
                      { key: "sms",   icon: Smartphone, label: "SMS Bildirimleri",      desc: "Telefon numaranıza kısa mesaj" },
                    ].map(item => {
                      const Icon = item.icon
                      return (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{item.label}</p>
                              <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </div>
                          </div>
                          <Toggle
                            checked={notifications[item.key as keyof typeof notifications]}
                            onChange={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4 text-muted-foreground text-sm uppercase tracking-wider">Bildirim Türleri</h3>
                  <div className="space-y-3">
                    {[
                      { key: "weekly", label: "Haftalık Rapor",        desc: "Her pazar finansal özetiniz" },
                      { key: "budget", label: "Bütçe Uyarıları",       desc: "Bütçe aşımı durumunda bildirim" },
                      { key: "goals",  label: "Hedef Güncellemeleri",  desc: "Birikim hedefi ilerleme bildirimleri" },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Toggle
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* ── GÜVENLİK ── */}
          {activeSection === "security" && (
            <>
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-6">Şifre Değiştir</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Mevcut Şifre</label>
                    <div className="relative">
                      <Input type="password" className="bg-secondary/50 border-border/50 pr-10" />
                      <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground cursor-pointer" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Yeni Şifre</label>
                    <Input type="password" className="bg-secondary/50 border-border/50" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Yeni Şifre (Tekrar)</label>
                    <Input type="password" className="bg-secondary/50 border-border/50" />
                  </div>
                  <Button className="bg-primary text-primary-foreground">Şifreyi Güncelle</Button>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-4">İki Faktörlü Doğrulama</h2>
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium">2FA Aktif</p>
                      <p className="text-sm text-muted-foreground">Google Authenticator ile korunuyor</p>
                    </div>
                  </div>
                  <Button variant="outline" className="bg-secondary/30 border-border/50">Yönet</Button>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-4">Oturum Geçmişi</h2>
                <div className="space-y-3">
                  {[
                    { device: "iPhone 15 Pro", location: "İstanbul, TR", time: "Şimdi",        current: true },
                    { device: "MacBook Pro",   location: "İstanbul, TR", time: "2 saat önce",  current: false },
                    { device: "Windows PC",    location: "Ankara, TR",   time: "1 gün önce",   current: false },
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{session.device}</p>
                          <p className="text-sm text-muted-foreground">{session.location} • {session.time}</p>
                        </div>
                      </div>
                      {session.current ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">Mevcut</span>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-red-400">Sonlandır</Button>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </>
          )}

          {/* ── ÖDEME YÖNTEMLERİ ── */}
          {activeSection === "payments" && (
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold mb-6">Ödeme Yöntemleri</h2>
              <div className="space-y-3">
                {[
                  { type: "Visa",       last4: "4242", expiry: "12/26", default: true },
                  { type: "Mastercard", last4: "8888", expiry: "03/25", default: false },
                ].map((card, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{card.type} •••• {card.last4}</p>
                          {card.default && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">Varsayılan</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">Son kullanım: {card.expiry}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon"><ChevronRight className="w-5 h-5" /></Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-secondary/30 border-border/50 gap-2">
                <CreditCard className="w-4 h-4" />
                Yeni Kart Ekle
              </Button>
            </GlassCard>
          )}

          {/* ── TERCİHLER ── */}
          {activeSection === "preferences" && (
            <>
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-6">Görünüm</h2>
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    <div>
                      <p className="font-medium">Karanlık Mod</p>
                      <p className="text-xs text-muted-foreground">
                        {isDark ? "Karanlık tema aktif" : "Aydınlık tema aktif"}
                      </p>
                    </div>
                  </div>
                  <Toggle
                    checked={isDark}
                    onChange={() => setTheme(isDark ? "light" : "dark")}
                  />
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-6">Dil ve Bölge</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Dil</label>
                    <select className="w-full p-3 bg-secondary/50 border border-border/50 rounded-xl">
                      <option>Türkçe</option>
                      <option>English</option>
                      <option>Deutsch</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Para Birimi</label>
                    <select className="w-full p-3 bg-secondary/50 border border-border/50 rounded-xl">
                      <option>TRY (₺)</option>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-6">Veri ve Gizlilik</h2>
                <div className="space-y-3">
                  {[
                    { icon: Download,       label: "Verilerimi İndir" },
                    { icon: HelpCircle,     label: "Gizlilik Politikası" },
                    { icon: MessageSquare,  label: "Destek" },
                  ].map((item, i) => {
                    const Icon = item.icon
                    return (
                      <Button key={i} variant="outline" className="w-full justify-between bg-secondary/30 border-border/50">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )
                  })}
                </div>
              </GlassCard>

              <GlassCard className="p-6 border-red-500/30">
                <h2 className="text-lg font-semibold mb-4 text-red-400">Tehlikeli Alan</h2>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10">
                    <LogOut className="w-4 h-4" />
                    Çıkış Yap
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                    Hesabı Sil
                  </Button>
                </div>
              </GlassCard>
            </>
          )}

          {/* ── YARDIM ── */}
          {activeSection === "help" && (
            <>
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-6">Yardım Merkezi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: BookOpen,    title: "Dokümantasyon",    desc: "Kullanım kılavuzları ve rehberler",    color: "text-blue-400",    bg: "bg-blue-500/10" },
                    { icon: MessageSquare, title: "Canlı Destek",  desc: "Uzmanlarımızla anlık sohbet",           color: "text-green-400",   bg: "bg-green-500/10" },
                    { icon: HelpCircle, title: "SSS",              desc: "Sıkça sorulan sorular",                color: "text-purple-400",  bg: "bg-purple-500/10" },
                    { icon: LifeBuoy,   title: "Topluluk",         desc: "Kullanıcı forumu ve ipuçları",          color: "text-orange-400",  bg: "bg-orange-500/10" },
                  ].map((item, i) => {
                    const Icon = item.icon
                    return (
                      <button key={i} className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors text-left group">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", item.bg)}>
                          <Icon className={cn("w-6 h-6", item.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                      </button>
                    )
                  })}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-4">Bize Ulaşın</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Konu</label>
                    <Input placeholder="Konuyu kısaca belirtin..." className="bg-secondary/50 border-border/50" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Mesajınız</label>
                    <textarea
                      rows={4}
                      placeholder="Sorununuzu veya önerinizi yazın..."
                      className="w-full p-3 bg-secondary/50 border border-border/50 rounded-xl resize-none text-sm placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <Button className="bg-primary text-primary-foreground gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Gönder
                  </Button>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-4">Uygulama Hakkında</h2>
                <div className="space-y-3">
                  {[
                    { label: "Sürüm",        value: "v2.4.1" },
                    { label: "Son Güncell.", value: "19 Nisan 2026" },
                    { label: "Lisans",       value: "Premium" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
