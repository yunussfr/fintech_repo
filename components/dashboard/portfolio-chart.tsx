"use client"

import { GlassCard } from "./glass-card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { TrendingUp } from "lucide-react"
import { useState } from "react"

const data = [
  { month: "Jan", value: 42000, spending: 3200 },
  { month: "Feb", value: 45200, spending: 2800 },
  { month: "Mar", value: 48500, spending: 3100 },
  { month: "Apr", value: 52100, spending: 2900 },
  { month: "May", value: 49800, spending: 4200 },
  { month: "Jun", value: 54300, spending: 3500 },
  { month: "Jul", value: 58700, spending: 3300 },
  { month: "Aug", value: 62100, spending: 3800 },
  { month: "Sep", value: 59400, spending: 4500 },
  { month: "Oct", value: 65800, spending: 3200 },
  { month: "Nov", value: 71200, spending: 3600 },
  { month: "Dec", value: 78500, spending: 5200 },
]

const periods = ["1W", "1M", "3M", "6M", "1Y", "ALL"]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    dataKey: string
  }>
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold metallic-text">Portfolio Performance</h3>
          <p className="text-sm text-muted-foreground mt-1">Track your investment growth</p>
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

      <div className="h-[280px] chart-glow relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.7 0.2 220)" stopOpacity={0.5} />
                <stop offset="30%" stopColor="oklch(0.7 0.2 220)" stopOpacity={0.3} />
                <stop offset="70%" stopColor="oklch(0.65 0.18 230)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="oklch(0.6 0.15 240)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="portfolioStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="oklch(0.7 0.2 220)" />
                <stop offset="50%" stopColor="oklch(0.75 0.18 230)" />
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
              tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000}k`}
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

      <div className="mt-4 pt-4 border-t border-[oklch(0.28_0.02_250)]">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Growth</span>
          <span className="text-[oklch(0.7_0.2_220)] font-semibold flex items-center gap-1 neon-blue-glow">
            <TrendingUp className="w-4 h-4" />
            +86.9%
          </span>
        </div>
      </div>
    </GlassCard>
  )
}
