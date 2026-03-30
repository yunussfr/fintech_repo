"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, ArrowLeftRight, Receipt, Target, 
  Settings, Sparkles, LogOut, ChevronLeft, ChevronRight,
  PieChart, Bell, HelpCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const mainNavItems = [
  { href: "/dashboard", label: "Ana Sayfa", icon: LayoutDashboard },
  { href: "/dashboard/currency", label: "Doviz Cevirici", icon: ArrowLeftRight },
  { href: "/dashboard/transactions", label: "Islemler", icon: Receipt },
  { href: "/dashboard/budget", label: "Butce", icon: Target },
  { href: "/dashboard/analytics", label: "Analitik", icon: PieChart },
]

const bottomNavItems = [
  { href: "/dashboard/settings", label: "Ayarlar", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
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
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold metallic-text">FinanceAI</span>
          )}
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
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pointer-events-none" />
                )}
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 relative z-10",
                  isActive ? "bg-primary/20 shadow-lg shadow-primary/20" : "bg-secondary/50 group-hover:bg-secondary"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                {!isCollapsed && (
                  <span className="font-medium relative z-10">{item.label}</span>
                )}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-lg shadow-primary/50 relative z-10" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* AI Assistant Card */}
        {!isCollapsed && (
          <div className="p-4 mb-4 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary/30 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 holographic opacity-20 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Asistan</h3>
                  <p className="text-xs text-muted-foreground">Finansal rehberiniz</p>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/30 btn-glow" size="sm">
                Soru Sor
              </Button>
            </div>
          </div>
        )}

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
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            )
          })}

          {/* Notifications */}
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 text-muted-foreground hover:bg-secondary/50 hover:text-foreground group">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-secondary/50 relative group-hover:bg-secondary transition-all duration-300">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center shadow-lg shadow-red-500/50 animate-pulse">
                3
              </span>
            </div>
            {!isCollapsed && <span className="font-medium">Bildirimler</span>}
          </button>

          {/* Help */}
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-muted-foreground hover:bg-secondary/50 hover:text-foreground">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-secondary/50">
              <HelpCircle className="w-5 h-5" />
            </div>
            {!isCollapsed && <span className="font-medium">Yardim</span>}
          </button>

          {/* Logout */}
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 text-red-400 hover:bg-red-500/10 group"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-red-500/10 group-hover:bg-red-500/20 transition-all duration-300 border border-red-500/20">
              <LogOut className="w-5 h-5" />
            </div>
            {!isCollapsed && <span className="font-medium">Cikis Yap</span>}
          </Link>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-secondary/80 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* User Profile */}
        <div className={cn(
          "flex items-center gap-3 px-2 pt-4 border-t border-border/50 mt-4",
          isCollapsed && "justify-center"
        )}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0 shadow-lg shadow-primary/30">
            AY
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">Ahmet Yilmaz</p>
              <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Premium Uye
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
