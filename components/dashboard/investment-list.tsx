"use client"

import { GlassCard } from "./glass-card"
import { TrendingUp, TrendingDown, Bitcoin, DollarSign, Building2, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const investments = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    value: "$12,450",
    change: 5.23,
    allocation: 16,
    icon: Bitcoin,
  },
  {
    name: "S&P 500 ETF",
    symbol: "VOO",
    value: "$28,200",
    change: 2.15,
    allocation: 36,
    icon: BarChart3,
  },
  {
    name: "Real Estate Fund",
    symbol: "VNQ",
    value: "$18,500",
    change: -1.32,
    allocation: 24,
    icon: Building2,
  },
  {
    name: "US Treasury Bonds",
    symbol: "GOVT",
    value: "$19,350",
    change: 0.45,
    allocation: 24,
    icon: DollarSign,
  },
]

export function InvestmentList() {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold metallic-text">Investment Portfolio</h3>
          <p className="text-sm text-muted-foreground mt-1">Your diversified holdings</p>
        </div>
        <button className="text-xs px-3 py-1.5 rounded-lg bg-[oklch(0.7_0.2_220/0.15)] text-[oklch(0.7_0.2_220)] hover:bg-[oklch(0.7_0.2_220/0.25)] transition-all duration-300 border border-[oklch(0.7_0.2_220/0.3)] backdrop-blur-sm">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {investments.map((investment) => {
          const Icon = investment.icon
          const isPositive = investment.change > 0

          return (
            <div
              key={investment.symbol}
              className="flex items-center gap-4 p-3 rounded-xl bg-[oklch(0.15_0.01_250)] hover:bg-[oklch(0.18_0.012_250)] transition-all duration-300 group cursor-pointer border border-transparent hover:border-[oklch(0.35_0.02_250/0.3)]"
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all duration-300 group-hover:scale-110",
                isPositive 
                  ? "bg-[oklch(0.7_0.2_220/0.15)] text-[oklch(0.7_0.2_220)] border border-[oklch(0.7_0.2_220/0.3)]" 
                  : "bg-[oklch(0.7_0.22_25/0.15)] text-[oklch(0.7_0.22_25)] border border-[oklch(0.7_0.22_25/0.3)]"
              )}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{investment.name}</span>
                  <span className="font-semibold metallic-text">{investment.value}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{investment.symbol}</span>
                  <span className={cn(
                    "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full backdrop-blur-sm",
                    isPositive ? "text-[oklch(0.7_0.2_220)] bg-[oklch(0.7_0.2_220/0.1)]" : "text-[oklch(0.7_0.22_25)] bg-[oklch(0.7_0.22_25/0.1)]"
                  )}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositive && "+"}{investment.change}%
                  </span>
                </div>
              </div>

              {/* Allocation bar */}
              <div className="w-16 h-2 bg-[oklch(0.2_0.015_250)] rounded-full overflow-hidden border border-[oklch(0.28_0.02_250)]">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500 group-hover:opacity-90",
                    isPositive ? "bg-gradient-to-r from-[oklch(0.7_0.2_220)] to-[oklch(0.65_0.18_230)]" : "bg-gradient-to-r from-[oklch(0.7_0.22_25)] to-[oklch(0.65_0.2_20)]"
                  )}
                  style={{ width: `${investment.allocation}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
