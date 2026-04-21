"use client"

import { GlassCard } from "./glass-card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts"
import { AlertTriangle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const rawData = [
  { dayKey: "days.mon", spending: 120 },
  { dayKey: "days.tue", spending: 280 },
  { dayKey: "days.wed", spending: 450 },
  { dayKey: "days.thu", spending: 180 },
  { dayKey: "days.fri", spending: 520 },
  { dayKey: "days.sat", spending: 680 },
  { dayKey: "days.sun", spending: 340 },
]

const BUDGET_LIMIT = 400

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    dataKey: string
  }>
  label?: string
}

function CustomTooltip({ active, payload, label, overByLabel }: CustomTooltipProps & { overByLabel?: string }) {
  if (active && payload && payload.length) {
    const value = payload[0].value
    const isOverBudget = value > BUDGET_LIMIT

    return (
      <div className={`glass-card rounded-lg p-3 border ${
        isOverBudget 
          ? "border-[oklch(0.7_0.22_25/0.5)]" 
          : "border-[oklch(0.4_0.03_250/0.3)]"
      }`}>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className={`text-lg font-semibold ${
          isOverBudget ? "text-[oklch(0.7_0.22_25)]" : "metallic-text"
        }`}>
          {value} ₺
        </p>
        {isOverBudget && (
          <p className="text-xs text-[oklch(0.7_0.22_25)] mt-1">
            {overByLabel}: {value - BUDGET_LIMIT} ₺
          </p>
        )}
      </div>
    )
  }
  return null
}

export function SpendingChart() {
  const { t } = useLanguage()
  // Günleri dile göre çevir
  const data = rawData.map(d => ({ day: t(d.dayKey), spending: d.spending }))
  const maxSpending = Math.max(...data.map(d => d.spending))
  const hasOverspending = maxSpending > BUDGET_LIMIT

  return (
    <GlassCard variant={hasOverspending ? "warning" : "default"}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold metallic-text">{t("spending.title")}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {t("spending.dailyBudget")}: {BUDGET_LIMIT} ₺
          </p>
        </div>
        {hasOverspending && (
          <div className="px-3 py-1.5 rounded-full bg-[oklch(0.7_0.22_25/0.15)] border border-[oklch(0.7_0.22_25/0.4)] backdrop-blur-sm flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-[oklch(0.7_0.22_25)]" />
            <span className="text-xs font-medium text-[oklch(0.7_0.22_25)]">
              {t("spending.exceeded")}
            </span>
          </div>
        )}
      </div>

      <div className={`h-[200px] ${hasOverspending ? "neon-coral-glow" : "chart-glow"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="spendingGradientNormal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.7 0.2 220)" stopOpacity={0.5} />
                <stop offset="50%" stopColor="oklch(0.65 0.18 230)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="oklch(0.6 0.15 240)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="spendingGradientWarning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.7 0.22 25)" stopOpacity={0.5} />
                <stop offset="50%" stopColor="oklch(0.65 0.2 20)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="oklch(0.6 0.18 15)" stopOpacity={0} />
              </linearGradient>
              <filter id="spendingGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'oklch(0.5 0.02 250)', fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
              dx={-10}
            />
            <ReferenceLine 
              y={BUDGET_LIMIT} 
              stroke="oklch(0.7 0.22 25)" 
              strokeDasharray="5 5"
              strokeOpacity={0.7}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip overByLabel={t("spending.overBy")} />} />
            <Area
              type="monotone"
              dataKey="spending"
              stroke={hasOverspending ? "oklch(0.7 0.22 25)" : "oklch(0.7 0.2 220)"}
              strokeWidth={3}
              fill={hasOverspending ? "url(#spendingGradientWarning)" : "url(#spendingGradientNormal)"}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}
