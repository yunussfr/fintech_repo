"use client"

import { GlassCard } from "./glass-card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const data = [
  { month: "Jan", value: 42000 },
  { month: "Feb", value: 45200 },
  { month: "Mar", value: 48500 },
  { month: "Apr", value: 52100 },
  { month: "May", value: 49800 },
  { month: "Jun", value: 54300 },
  { month: "Jul", value: 58700 },
  { month: "Aug", value: 62100 },
  { month: "Sep", value: 59400 },
  { month: "Oct", value: 65800 },
  { month: "Nov", value: 71200 },
  { month: "Dec", value: 78500 },
]

const periods = ["1W", "1M", "3M", "6M", "1Y", "ALL"]

// Mock yatırım varlıkları
const assets = [
  {
    name: "Apple Inc.",
    symbol: "AAPL",
    amount: "12 Hisse",
    value: "₺28.450",
    change: +4.32,
    color: "from-[oklch(0.7_0.15_220)] to-[oklch(0.6_0.12_230)]",
    dot: "bg-[oklch(0.7_0.15_220)]",
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
    amount: "0.085 BTC",
    value: "₺187.320",
    change: +12.7,
    color: "from-[oklch(0.75_0.18_50)] to-[oklch(0.65_0.15_40)]",
    dot: "bg-[oklch(0.75_0.18_50)]",
  },
  {
    name: "Altın",
    symbol: "GOLD",
    amount: "35 gr",
    value: "₺92.750",
    change: -1.85,
    color: "from-[oklch(0.8_0.15_85)] to-[oklch(0.7_0.12_80)]",
    dot: "bg-[oklch(0.8_0.15_85)]",
  },
  {
    name: "EUR/TRY",
    symbol: "EUR",
    amount: "€2.500",
    value: "₺81.250",
    change: +0.64,
    color: "from-[oklch(0.65_0.18_280)] to-[oklch(0.55_0.15_270)]",
    dot: "bg-[oklch(0.65_0.18_280)]",
  },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg p-3 border border-[oklch(0.4_0.03_250/0.3)]">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-lg font-semibold metallic-text">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    )
  }
  return null
}

export function PortfolioChart() {
  const [activePeriod, setActivePeriod] = useState("1Y")

  return (
    <GlassCard className="h-full">
      {/* Başlık + Periyot */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold metallic-text">Portföy Performansı</h3>
          <p className="text-sm text-muted-foreground mt-1">Yatırım büyümeni takip et</p>
        </div>
        <div className="flex gap-1 p-1 rounded-lg bg-[oklch(0.15_0.01_250)] border border-[oklch(0.28_0.02_250)]">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-300 ${
                activePeriod === period
                  ? "bg-gradient-to-br from-[oklch(0.7_0.2_220)] to-[oklch(0.6_0.18_230)] text-[oklch(0.12_0.01_250)] shadow-lg shadow-[oklch(0.7_0.2_220/0.3)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-[oklch(0.2_0.015_250)]"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Grafik */}
      <div className="h-[240px] chart-glow relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="oklch(0.7 0.2 220)" stopOpacity={0.5} />
                <stop offset="30%"  stopColor="oklch(0.7 0.2 220)" stopOpacity={0.3} />
                <stop offset="70%"  stopColor="oklch(0.65 0.18 230)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="oklch(0.6 0.15 240)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="portfolioStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="oklch(0.7 0.2 220)" />
                <stop offset="50%"  stopColor="oklch(0.75 0.18 230)" />
                <stop offset="100%" stopColor="oklch(0.7 0.2 220)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "oklch(0.5 0.02 250)", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "oklch(0.5 0.02 250)", fontSize: 12 }}
              tickFormatter={(v) => `${v / 1000}k`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="url(#portfolioStroke)"
              strokeWidth={3}
              fill="url(#portfolioGradient)"
              filter="url(#glow)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Toplam büyüme */}
      <div className="mt-4 pb-4 border-b border-[oklch(0.28_0.02_250)]">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Toplam Büyüme</span>
          <span className="text-[oklch(0.7_0.2_220)] font-semibold flex items-center gap-1 neon-blue-glow">
            <TrendingUp className="w-4 h-4" />
            +86.9%
          </span>
        </div>
      </div>

      {/* ── Yatırım Varlıkları ── */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-foreground/80">Yatırım Varlıkları</h4>
          <span className="text-xs text-muted-foreground">Anlık değerler</span>
        </div>

        <div className="space-y-2.5">
          {assets.map((asset) => (
            <div
              key={asset.symbol}
              className="flex items-center justify-between p-3 bg-[oklch(0.15_0.01_250)] rounded-xl hover:bg-[oklch(0.17_0.01_250)] transition-colors group"
            >
              {/* Sol: İkon + İsim */}
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-md shrink-0",
                  asset.color
                )}>
                  <span className="text-xs font-bold text-[oklch(0.12_0.01_250)]">
                    {asset.symbol.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium leading-tight">{asset.name}</p>
                  <p className="text-xs text-muted-foreground">{asset.amount}</p>
                </div>
              </div>

              {/* Sağ: Değer + Değişim */}
              <div className="text-right">
                <p className="text-sm font-semibold">{asset.value}</p>
                <div className={cn(
                  "flex items-center justify-end gap-0.5 text-xs font-medium",
                  asset.change >= 0 ? "text-emerald-400" : "text-red-400"
                )}>
                  {asset.change >= 0
                    ? <TrendingUp className="w-3 h-3" />
                    : <TrendingDown className="w-3 h-3" />}
                  {asset.change >= 0 ? "+" : ""}{asset.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  )
}
