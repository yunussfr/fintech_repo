"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  glow?: boolean
  variant?: "default" | "highlight" | "warning"
}

export function GlassCard({ 
  children, 
  className, 
  glow = true,
  variant = "default" 
}: GlassCardProps) {
  return (
    <div 
      className={cn(
        "glass-card rounded-2xl p-6 relative overflow-hidden hover-lift",
        glow && "glass-card-glow animate-border-glow",
        variant === "highlight" && "border-[oklch(0.7_0.2_220/0.4)]",
        variant === "warning" && "border-[oklch(0.7_0.22_25/0.4)] neon-coral-glow",
        className
      )}
    >
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-[0.015] pointer-events-none" />
      
      {/* Metallic shimmer overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          background: `linear-gradient(
            120deg,
            transparent 0%,
            oklch(0.95 0.01 250 / 0.6) 40%,
            oklch(0.98 0.005 250 / 0.9) 50%,
            oklch(0.95 0.01 250 / 0.6) 60%,
            transparent 100%
          )`,
          backgroundSize: "200% 200%",
          animation: "shimmer 4s linear infinite",
        }}
      />
      
      {/* Scan line for futuristic effect */}
      {variant === "highlight" && (
        <div className="scan-line absolute inset-0 pointer-events-none" />
      )}
      
      <div className="relative z-10">{children}</div>
    </div>
  )
}
