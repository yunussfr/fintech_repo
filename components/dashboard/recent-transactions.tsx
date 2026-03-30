"use client"

import { GlassCard } from "./glass-card"
import { ArrowUpRight, ArrowDownLeft, Coffee, ShoppingBag, Utensils, Fuel, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const transactions = [
  {
    id: 1,
    name: "Salary Deposit",
    category: "Income",
    amount: 5200,
    type: "income",
    date: "Today, 9:30 AM",
    icon: ArrowDownLeft,
  },
  {
    id: 2,
    name: "Starbucks",
    category: "Food & Drinks",
    amount: -8.50,
    type: "expense",
    date: "Today, 11:15 AM",
    icon: Coffee,
  },
  {
    id: 3,
    name: "Amazon Purchase",
    category: "Shopping",
    amount: -156.99,
    type: "expense",
    date: "Yesterday, 3:45 PM",
    icon: ShoppingBag,
  },
  {
    id: 4,
    name: "Restaurant",
    category: "Dining",
    amount: -72.30,
    type: "expense",
    date: "Yesterday, 8:20 PM",
    icon: Utensils,
  },
  {
    id: 5,
    name: "Gas Station",
    category: "Transportation",
    amount: -45.00,
    type: "expense",
    date: "Mar 28, 2:10 PM",
    icon: Fuel,
  },
  {
    id: 6,
    name: "Electricity Bill",
    category: "Utilities",
    amount: -128.40,
    type: "expense",
    date: "Mar 27, 10:00 AM",
    icon: Zap,
  },
]

export function RecentTransactions() {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold metallic-text">Recent Transactions</h3>
          <p className="text-sm text-muted-foreground mt-1">Your latest activity</p>
        </div>
        <button className="text-xs px-3 py-1.5 rounded-lg bg-[oklch(0.7_0.2_220/0.15)] text-[oklch(0.7_0.2_220)] hover:bg-[oklch(0.7_0.2_220/0.25)] transition-all duration-300 border border-[oklch(0.7_0.2_220/0.3)] backdrop-blur-sm">
          See All
        </button>
      </div>

      <div className="space-y-2">
        {transactions.map((transaction) => {
          const Icon = transaction.icon
          const isIncome = transaction.type === "income"

          return (
            <div
              key={transaction.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-[oklch(0.15_0.01_250)] transition-all duration-300 cursor-pointer group border border-transparent hover:border-[oklch(0.35_0.02_250/0.3)]"
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all duration-300 group-hover:scale-110",
                isIncome 
                  ? "bg-[oklch(0.6_0.18_160/0.15)] text-[oklch(0.6_0.18_160)] border border-[oklch(0.6_0.18_160/0.3)]" 
                  : "bg-[oklch(0.5_0.02_250/0.4)] text-muted-foreground border border-[oklch(0.35_0.02_250/0.3)]"
              )}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground truncate">{transaction.name}</span>
                  <span className={cn(
                    "font-semibold",
                    isIncome ? "text-[oklch(0.6_0.18_160)] neon-green-glow" : "text-foreground"
                  )}>
                    {isIncome ? "+" : ""}{transaction.amount < 0 ? "-" : ""}${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-muted-foreground">{transaction.category}</span>
                  <span className="text-xs text-muted-foreground">{transaction.date}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
