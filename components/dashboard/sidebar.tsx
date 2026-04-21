"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, ArrowLeftRight, Receipt, Target,
  Settings, LogOut, ChevronLeft, ChevronRight,
  PieChart, Bell, HelpCircle, X, Mail, Smartphone,
  BookOpen, MessageSquare, LifeBuoy, CheckCircle2, Landmark
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

// navItems artık dinamik — useLanguage() içinde oluşturuluyor
const bottomNavItems = [
  { href: "/dashboard/settings", labelKey: "nav.settings", icon: Settings },
]

// Mock bildirimler
const mockNotifications = [
  { id: 1, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", title: "Bütçe hedefine ulaştınız", desc: "Yaz tatili birikiminde %73'e ulaştınız.", time: "2 dk önce", read: false },
  { id: 2, icon: Bell,         color: "text-orange-400", bg: "bg-orange-500/10",  title: "Bütçe uyarısı",            desc: "Yiyecek kategorisinde %105 harcadınız.",     time: "1 saat önce", read: false },
  { id: 3, icon: Mail,         color: "text-blue-400",  bg: "bg-blue-500/10",    title: "Haftalık rapor hazır",     desc: "Bu haftanın özeti oluşturuldu.",             time: "5 saat önce", read: true },
]

// Yardım içeriği
const helpItems = [
  { icon: BookOpen,      color: "text-blue-400",   bg: "bg-blue-500/10",   title: "Başlangıç Rehberi",   desc: "Uygulamayı nasıl kullanırım?" },
  { icon: MessageSquare, color: "text-green-400",  bg: "bg-green-500/10",  title: "Canlı Destek",        desc: "Uzmanlarla anlık sohbet" },
  { icon: LifeBuoy,      color: "text-purple-400", bg: "bg-purple-500/10", title: "SSS",                 desc: "Sık sorulan sorular" },
  { icon: HelpCircle,    color: "text-orange-400", bg: "bg-orange-500/10", title: "Gizlilik Politikası", desc: "Verileriniz güvende" },
]

type PanelType = "notifications" | "help" | null

export function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const { user, signOut } = useAuth()
  const { t } = useLanguage()

  const [isCollapsed,   setIsCollapsed]   = useState(false)
  const [isSigningOut,  setIsSigningOut]  = useState(false)
  const [activePanel,   setActivePanel]   = useState<PanelType>(null)
  const [notifications, setNotifications] = useState(mockNotifications)

  const mainNavItems = [
    { href: "/dashboard",              labelKey: "nav.home",         icon: LayoutDashboard },
    { href: "/dashboard/currency",     labelKey: "nav.currency",     icon: ArrowLeftRight },
    { href: "/dashboard/transactions", labelKey: "nav.transactions", icon: Receipt },
    { href: "/dashboard/budget",       labelKey: "nav.budget",       icon: Target },
    { href: "/dashboard/assets",       labelKey: "nav.assets",       icon: Landmark },
    { href: "/dashboard/analytics",    labelKey: "nav.analytics",    icon: PieChart },
  ]

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    router.push("/login")
  }

  const togglePanel = (panel: PanelType) => {
    setActivePanel(prev => prev === panel ? null : panel)
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  // Kullanıcı adı ve avatar
  const displayName    = user?.displayName || user?.email?.split("@")[0] || "Kullanıcı"
  const avatarLetters  = user?.displayName
    ? user.displayName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? "?").toUpperCase()

  return (
    <>
      {/* Panelarka planı overlay (panel açıkken) */}
      {activePanel && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActivePanel(null)}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-50",
        isCollapsed ? "w-20" : "w-64"
      )}>
        {/* Background */}
        <div className="absolute inset-0 glass-card border-r border-border/50" />

        <div className="relative flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 ai-icon-glow">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            {!isCollapsed && <span className="text-xl font-bold metallic-text">FinanceAI</span>}
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  {isActive && <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pointer-events-none" />}
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 relative z-10",
                    isActive ? "bg-primary/20 shadow-lg shadow-primary/20" : "bg-secondary/50 group-hover:bg-secondary"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {!isCollapsed && <span className="font-medium relative z-10">{t(item.labelKey)}</span>}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-lg shadow-primary/50 relative z-10" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Navigation */}
          <div className="space-y-1 border-t border-border/50 pt-4">
            {bottomNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    isActive ? "bg-primary/20" : "bg-secondary/50 group-hover:bg-secondary"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {!isCollapsed && <span className="font-medium">{t(item.labelKey)}</span>}
                </Link>
              )
            })}

            {/* Bildirimler butonu — panel açar */}
            <button
              onClick={() => togglePanel("notifications")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group",
                activePanel === "notifications"
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-secondary/50 relative group-hover:bg-secondary transition-all duration-300">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center shadow-lg shadow-red-500/50 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              {!isCollapsed && <span className="font-medium">{t("nav.notifications")}</span>}
            </button>

            {/* Yardım butonu — panel açar */}
            <button
              onClick={() => togglePanel("help")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                activePanel === "help"
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-secondary/50 group-hover:bg-secondary transition-colors">
                <HelpCircle className="w-5 h-5" />
              </div>
              {!isCollapsed && <span className="font-medium">{t("nav.help")}</span>}
            </button>

            {/* Çıkış */}
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 text-red-400 hover:bg-red-500/10 group"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-red-500/10 group-hover:bg-red-500/20 transition-all duration-300 border border-red-500/20">
                {isSigningOut
                  ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  : <LogOut className="w-5 h-5" />}
              </div>
              {!isCollapsed && <span className="font-medium">{isSigningOut ? t("nav.loggingOut") : t("nav.logout")}</span>}
            </button>
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-secondary/80 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* User Profile */}
          <div className={cn(
            "flex items-center gap-3 px-2 pt-4 border-t border-border/50 mt-4",
            isCollapsed && "justify-center"
          )}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0 shadow-lg shadow-primary/30">
              {avatarLetters}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Premium Üye
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── BİLDİRİMLER PANELİ ── */}
      {activePanel === "notifications" && (
        <div className={cn(
          "fixed top-0 z-50 h-screen w-80 flex flex-col transition-all duration-300",
          isCollapsed ? "left-20" : "left-64"
        )}>
          <div className="absolute inset-0 glass-card border-r border-border/50 backdrop-blur-xl" />
          <div className="relative flex flex-col h-full">
            {/* Panel Başlık */}
            <div className="flex items-center justify-between p-5 border-b border-border/50">
              <div>
                <h2 className="font-semibold text-lg">Bildirimler</h2>
                {unreadCount > 0 && (
                  <p className="text-xs text-muted-foreground">{unreadCount} okunmamış bildirim</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-primary hover:underline"
                  >
                    Tümünü oku
                  </button>
                )}
                <button
                  onClick={() => setActivePanel(null)}
                  className="w-8 h-8 rounded-lg bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bildirim Listesi */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.map((notif) => {
                const Icon = notif.icon
                return (
                  <div
                    key={notif.id}
                    onClick={() => setNotifications(prev =>
                      prev.map(n => n.id === notif.id ? { ...n, read: true } : n)
                    )}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors",
                      notif.read
                        ? "bg-secondary/20 hover:bg-secondary/30"
                        : "bg-[oklch(0.18_0.02_250)] hover:bg-[oklch(0.2_0.02_250)] border border-border/30"
                    )}
                  >
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", notif.bg)}>
                      <Icon className={cn("w-5 h-5", notif.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn("text-sm font-medium truncate", !notif.read && "text-foreground")}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.desc}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">{notif.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Alt buton */}
            <div className="p-4 border-t border-border/50">
              <Link
                href="/dashboard/settings?tab=notifications"
                className="block w-full text-center text-sm text-primary hover:underline py-2"
                onClick={() => setActivePanel(null)}
              >
                Bildirim ayarlarına git →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── YARDIM PANELİ ── */}
      {activePanel === "help" && (
        <div className={cn(
          "fixed top-0 z-50 h-screen w-80 flex flex-col transition-all duration-300",
          isCollapsed ? "left-20" : "left-64"
        )}>
          <div className="absolute inset-0 glass-card border-r border-border/50 backdrop-blur-xl" />
          <div className="relative flex flex-col h-full">
            {/* Panel Başlık */}
            <div className="flex items-center justify-between p-5 border-b border-border/50">
              <div>
                <h2 className="font-semibold text-lg">Yardım Merkezi</h2>
                <p className="text-xs text-muted-foreground">Size nasıl yardımcı olabiliriz?</p>
              </div>
              <button
                onClick={() => setActivePanel(null)}
                className="w-8 h-8 rounded-lg bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Yardım İçeriği */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <p className="text-xs text-muted-foreground px-1 mb-4">Hızlı erişim</p>
              {helpItems.map((item, i) => {
                const Icon = item.icon
                return (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors text-left group"
                  >
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", item.bg)}>
                      <Icon className={cn("w-5 h-5", item.color)} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </button>
                )
              })}

              {/* Mesaj Gönder */}
              <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-xl">
                <p className="text-sm font-medium mb-2">Bize yazın</p>
                <textarea
                  rows={3}
                  placeholder="Sorununuzu yazın..."
                  className="w-full text-xs bg-secondary/50 border border-border/50 rounded-lg p-2 resize-none outline-none focus:border-primary/50 placeholder:text-muted-foreground"
                />
                <button className="mt-2 w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  Gönder
                </button>
              </div>
            </div>

            {/* Alt versiyon */}
            <div className="p-4 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground">FinanceAI v2.4.1 · <span className="text-primary">Gizlilik Politikası</span></p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
