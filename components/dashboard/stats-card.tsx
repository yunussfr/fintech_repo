"use client"

import { GlassCard } from "./glass-card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  variant?: "default" | "highlight" | "warning"
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeLabel = "vs last month",
  icon,
  variant = "default"
}: StatsCardProps) {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0
  const isNeutral = change === 0

  return (
    <GlassCard variant={variant} className="group">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className={cn(
            "text-3xl font-bold tracking-tight",
            variant === "warning" ? "text-[oklch(0.7_0.22_25)] neon-coral-glow" : "metallic-text"
          )}>
            {value}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-2">
              <span className={cn(
                "flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full backdrop-blur-sm",
                isPositive && "text-[oklch(0.7_0.2_220)] bg-[oklch(0.7_0.2_220/0.15)] border border-[oklch(0.7_0.2_220/0.3)] neon-blue-glow",
                isNegative && "text-[oklch(0.7_0.22_25)] bg-[oklch(0.7_0.22_25/0.15)] border border-[oklch(0.7_0.22_25/0.3)] neon-coral-glow",
                isNeutral && "text-muted-foreground bg-muted border border-border"
              )}>
                {isPositive && <TrendingUp className="w-3 h-3" />}
                {isNegative && <TrendingDown className="w-3 h-3" />}
                {isNeutral && <Minus className="w-3 h-3" />}
                {isPositive && "+"}{change}%
              </span>
              <span className="text-xs text-muted-foreground">{changeLabel}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn(
            "p-3 rounded-xl backdrop-blur-sm transition-all duration-300 group-hover:scale-110",
            variant === "warning" 
              ? "bg-[oklch(0.7_0.22_25/0.15)] text-[oklch(0.7_0.22_25)] border border-[oklch(0.7_0.22_25/0.3)]" 
              : "bg-[oklch(0.7_0.2_220/0.15)] text-[oklch(0.7_0.2_220)] border border-[oklch(0.7_0.2_220/0.3)]"
          )}>
            {icon}
          </div>
        )}
      </div>
    </GlassCard>
  )
}
