"use client"

import { Bell, Search, Settings, ChevronDown } from "lucide-react"

export function Header() {
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

        {/* Profile */}
        <button className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl bg-[oklch(0.15_0.01_250)] hover:bg-[oklch(0.2_0.015_250)] transition-all duration-300 border border-[oklch(0.28_0.02_250)] hover:border-[oklch(0.35_0.02_250)] group backdrop-blur-sm">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">Alex Johnson</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Premium Plan
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[oklch(0.6_0.15_280)] via-[oklch(0.55_0.16_260)] to-[oklch(0.5_0.18_240)] flex items-center justify-center shadow-lg shadow-[oklch(0.6_0.15_280/0.3)] group-hover:shadow-xl group-hover:shadow-[oklch(0.6_0.15_280/0.4)] transition-all duration-300">
            <span className="text-sm font-semibold text-[oklch(0.12_0.01_250)]">AJ</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </div>
    </header>
  )
}
