"use client"

import { useState } from "react"
import { 
  User, Bell, Shield, CreditCard, Globe, Moon, Sun, 
  Smartphone, Mail, Lock, Eye, EyeOff, Check, ChevronRight,
  LogOut, Trash2, Download, HelpCircle, MessageSquare
} from "lucide-react"
import { GlassCard } from "@/components/dashboard/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const settingsSections = [
  { id: "profile", name: "Profil", icon: User },
  { id: "notifications", name: "Bildirimler", icon: Bell },
  { id: "security", name: "Guvenlik", icon: Shield },
  { id: "payments", name: "Odeme Yontemleri", icon: CreditCard },
  { id: "preferences", name: "Tercihler", icon: Globe },
]

const connectedAccounts = [
  { name: "Ziraat Bankasi", type: "Vadesiz", balance: 45230, lastSync: "2 dk once" },
  { name: "Garanti BBVA", type: "Kredi Karti", balance: -12450, lastSync: "5 dk once" },
  { name: "Akbank", type: "Birikim", balance: 125000, lastSync: "1 saat once" },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    weekly: true,
    budget: true,
    goals: true,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold metallic-text">Ayarlar</h1>
        <p className="text-muted-foreground mt-1">Hesap ve uygulama ayarlarinizi yonetin</p>
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
          {activeSection === "profile" && (
            <>
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-6">Profil Bilgileri</h2>
                
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-3xl font-bold text-primary-foreground">
                      AY
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
                          defaultValue="Ahmet" 
                          className="bg-secondary/50 border-border/50"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Soyad</label>
                        <Input 
                          defaultValue="Yilmaz" 
                          className="bg-secondary/50 border-border/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">E-posta</label>
                      <Input 
                        type="email"
                        defaultValue="ahmet@example.com" 
                        className="bg-secondary/50 border-border/50"
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
                    Iptal
                  </Button>
                  <Button className="bg-primary text-primary-foreground">
                    Degisiklikleri Kaydet
                  </Button>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-4">Bagli Hesaplar</h2>
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
                        <p className={cn(
                          "font-semibold",
                          account.balance >= 0 ? "text-emerald-400" : "text-red-400"
                        )}>
                          {account.balance.toLocaleString("tr-TR")} ₺
                        </p>
                        <p className="text-xs text-muted-foreground">{account.lastSync}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-secondary/30 border-border/50 gap-2">
                  <CreditCard className="w-4 h-4" />
                  Yeni Hesap Bagla
                </Button>
              </GlassCard>
            </>
          )}

          {activeSection === "notifications" && (
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold mb-6">Bildirim Tercihleri</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Bildirim Kanallari</h3>
                  <div className="space-y-3">
                    {[
                      { key: "email", icon: Mail, label: "E-posta Bildirimleri" },
                      { key: "push", icon: Bell, label: "Push Bildirimleri" },
                      { key: "sms", icon: Smartphone, label: "SMS Bildirimleri" },
                    ].map(item => {
                      const Icon = item.icon
                      return (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-muted-foreground" />
                            <span>{item.label}</span>
                          </div>
                          <button
                            onClick={() => setNotifications(prev => ({
                              ...prev,
                              [item.key]: !prev[item.key as keyof typeof prev]
                            }))}
                            className={cn(
                              "w-12 h-6 rounded-full transition-colors relative",
                              notifications[item.key as keyof typeof notifications]
                                ? "bg-primary"
                                : "bg-secondary"
                            )}
                          >
                            <div className={cn(
                              "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform",
                              notifications[item.key as keyof typeof notifications]
                                ? "translate-x-6"
                                : "translate-x-0.5"
                            )} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Bildirim Turleri</h3>
                  <div className="space-y-3">
                    {[
                      { key: "weekly", label: "Haftalik Rapor", desc: "Her pazar finansal ozetiniz" },
                      { key: "budget", label: "Butce Uyarilari", desc: "Butce asimi durumunda bildirim" },
                      { key: "goals", label: "Hedef Guncellemeleri", desc: "Birikim hedefi ilerleme bildirimleri" },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotifications(prev => ({
                            ...prev,
                            [item.key]: !prev[item.key as keyof typeof prev]
                          }))}
                          className={cn(
                            "w-12 h-6 rounded-full transition-colors relative",
                            notifications[item.key as keyof typeof notifications]
                              ? "bg-primary"
                              : "bg-secondary"
                          )}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform",
                            notifications[item.key as keyof typeof notifications]
                              ? "translate-x-6"
                              : "translate-x-0.5"
                          )} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {activeSection === "security" && (
            <>
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-6">Sifre Degistir</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Mevcut Sifre</label>
                    <div className="relative">
                      <Input 
                        type="password"
                        className="bg-secondary/50 border-border/50 pr-10"
                      />
                      <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground cursor-pointer" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Yeni Sifre</label>
                    <Input 
                      type="password"
                      className="bg-secondary/50 border-border/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Yeni Sifre (Tekrar)</label>
                    <Input 
                      type="password"
                      className="bg-secondary/50 border-border/50"
                    />
                  </div>
                  <Button className="bg-primary text-primary-foreground">
                    Sifreyi Guncelle
                  </Button>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-4">Iki Faktorlu Dogrulama</h2>
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
                  <Button variant="outline" className="bg-secondary/30 border-border/50">
                    Yonet
                  </Button>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-4">Oturum Gecmisi</h2>
                <div className="space-y-3">
                  {[
                    { device: "iPhone 15 Pro", location: "Istanbul, TR", time: "Simdi", current: true },
                    { device: "MacBook Pro", location: "Istanbul, TR", time: "2 saat once", current: false },
                    { device: "Windows PC", location: "Ankara, TR", time: "1 gun once", current: false },
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
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                          Mevcut
                        </span>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-red-400">
                          Sonlandir
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </>
          )}

          {activeSection === "payments" && (
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold mb-6">Odeme Yontemleri</h2>
              <div className="space-y-3">
                {[
                  { type: "Visa", last4: "4242", expiry: "12/26", default: true },
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
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                              Varsayilan
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">Son kullanim: {card.expiry}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-secondary/30 border-border/50 gap-2">
                <CreditCard className="w-4 h-4" />
                Yeni Kart Ekle
              </Button>
            </GlassCard>
          )}

          {activeSection === "preferences" && (
            <>
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-6">Gorunum</h2>
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    <span>Karanlik Mod</span>
                  </div>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative",
                      isDarkMode ? "bg-primary" : "bg-secondary"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform",
                      isDarkMode ? "translate-x-6" : "translate-x-0.5"
                    )} />
                  </button>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-6">Dil ve Bolge</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Dil</label>
                    <select className="w-full p-3 bg-secondary/50 border border-border/50 rounded-xl">
                      <option>Turkce</option>
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
                  <Button variant="outline" className="w-full justify-between bg-secondary/30 border-border/50">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Verilerimi Indir
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between bg-secondary/30 border-border/50">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" />
                      Gizlilik Politikasi
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between bg-secondary/30 border-border/50">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Destek
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </GlassCard>

              <GlassCard className="p-6 border-red-500/30">
                <h2 className="text-lg font-semibold mb-4 text-red-400">Tehlikeli Alan</h2>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10">
                    <LogOut className="w-4 h-4" />
                    Cikis Yap
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                    Hesabi Sil
                  </Button>
                </div>
              </GlassCard>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
