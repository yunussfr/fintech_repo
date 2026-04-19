"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, Settings, ChevronDown, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export function Header() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Dropdown dışına tıklandığında kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    router.push("/login")
  }

  // Kullanıcı adını ve avatar harfini belirle:
  // displayName > email prefix > 'Misafir'
  const userEmail    = user?.email ?? ""
  const displayName  = user?.displayName || userEmail.split("@")[0] || "Misafir"
  const avatarLetter = (user?.displayName?.[0] || userEmail[0] || "?").toUpperCase()

  return (
    <header className="flex items-center justify-between py-4 px-6 border-b border-[oklch(0.28_0.02_250)] backdrop-blur-sm bg-[oklch(0.12_0.01_250/0.8)] sticky top-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.7_0.2_220)] via-[oklch(0.65_0.18_230)] to-[oklch(0.6_0.15_240)] flex items-center justify-center shadow-lg shadow-[oklch(0.7_0.2_220/0.3)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="text-lg font-bold text-[oklch(0.12_0.01_250)] relative z-10">F</span>
        </div>
        <div>
          <h1 className="text-xl font-bold metallic-text">FinanceAI</h1>
          <p className="text-xs text-muted-foreground">Smart Money Management</p>
        </div>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[oklch(0.15_0.01_250)] border border-[oklch(0.28_0.02_250)] w-80 backdrop-blur-sm hover:border-[oklch(0.35_0.02_250)] transition-all duration-300 focus-within:border-[oklch(0.7_0.2_220/0.5)] focus-within:ring-2 focus-within:ring-[oklch(0.7_0.2_220/0.2)]">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search transactions, investments..."
          className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-muted-foreground"
        />
        <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-muted-foreground bg-[oklch(0.2_0.015_250)] rounded border border-[oklch(0.28_0.02_250)]">
          ⌘K
        </kbd>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl bg-[oklch(0.15_0.01_250)] hover:bg-[oklch(0.2_0.015_250)] transition-all duration-300 border border-[oklch(0.28_0.02_250)] hover:border-[oklch(0.35_0.02_250)] group">
          <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[oklch(0.7_0.22_25)] rounded-full shadow-lg shadow-[oklch(0.7_0.22_25/0.5)] animate-pulse" />
        </button>

        {/* Settings */}
        <button className="p-2.5 rounded-xl bg-[oklch(0.15_0.01_250)] hover:bg-[oklch(0.2_0.015_250)] transition-all duration-300 border border-[oklch(0.28_0.02_250)] hover:border-[oklch(0.35_0.02_250)] group">
          <Settings className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>

        {/* Profile + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl bg-[oklch(0.15_0.01_250)] hover:bg-[oklch(0.2_0.015_250)] transition-all duration-300 border border-[oklch(0.28_0.02_250)] hover:border-[oklch(0.35_0.02_250)] group backdrop-blur-sm"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground truncate max-w-[120px]">{displayName}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {userEmail || "Misafir"}
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[oklch(0.6_0.15_280)] via-[oklch(0.55_0.16_260)] to-[oklch(0.5_0.18_240)] flex items-center justify-center shadow-lg shadow-[oklch(0.6_0.15_280/0.3)] group-hover:shadow-xl group-hover:shadow-[oklch(0.6_0.15_280/0.4)] transition-all duration-300">
              <span className="text-sm font-semibold text-[oklch(0.12_0.01_250)]">{avatarLetter}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-all duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[oklch(0.15_0.01_250)] border border-[oklch(0.28_0.02_250)] shadow-2xl shadow-black/40 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              {/* Kullanıcı Bilgisi */}
              <div className="px-4 py-3 border-b border-[oklch(0.22_0.02_250)]">
                <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>

              {/* Sign Out */}
              <div className="p-2">
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[oklch(0.75_0.15_25)] hover:bg-[oklch(0.35_0.08_25/0.15)] hover:text-[oklch(0.85_0.18_25)] transition-all duration-200 group"
                >
                  {isSigningOut ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  )}
                  <span>{isSigningOut ? "Çıkış yapılıyor..." : "Çıkış Yap"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
