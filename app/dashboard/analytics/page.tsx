"use client"

import { useState } from "react"
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart, 
  BarChart3, Calendar, ArrowUpRight, ArrowDownRight
} from "lucide-react"
import { GlassCard } from "@/components/dashboard/glass-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts"

const monthlyData = [
  { month: "Oca", income: 48000, expense: 35000, savings: 13000 },
  { month: "Sub", income: 52000, expense: 38000, savings: 14000 },
  { month: "Mar", income: 49000, expense: 32000, savings: 17000 },
  { month: "Nis", income: 53500, expense: 40000, savings: 13500 },
  { month: "May", income: 55000, expense: 36000, savings: 19000 },
  { month: "Haz", income: 53500, expense: 38400, savings: 15100 },
]

const categoryData = [
  { name: "Konut", value: 35, color: "#3b82f6" },
  { name: "Ulasim", value: 15, color: "#06b6d4" },
  { name: "Yiyecek", value: 20, color: "#f97316" },
  { name: "Eglence", value: 10, color: "#8b5cf6" },
  { name: "Saglik", value: 8, color: "#ef4444" },
  { name: "Diger", value: 12, color: "#6b7280" },
]

const weeklyTrend = [
  { day: "Pzt", amount: 1200 },
  { day: "Sal", amount: 850 },
  { day: "Car", amount: 2100 },
  { day: "Per", amount: 600 },
  { day: "Cum", amount: 1800 },
  { day: "Cmt", amount: 3200 },
  { day: "Paz", amount: 900 },
]

const insights = [
  {
    type: "positive",
    title: "Tasarruf Artisi",
    description: "Bu ay tasarruf oraniniz %12 artti",
    value: "+₺3,200",
  },
  {
    type: "warning",
    title: "Yiyecek Harcamasi",
    description: "Yiyecek butcenizi %15 astiniz",
    value: "-₺850",
  },
  {
    type: "positive",
    title: "Yatirim Getirisi",
    description: "Portfoyunuz %8.5 deger kazandi",
    value: "+₺12,450",
  },
  {
    type: "neutral",
    title: "Fatura Odemesi",
    description: "3 gun icinde elektrik faturasi",
    value: "₺423",
  },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6ay")

  const totalIncome = monthlyData.reduce((sum, d) => sum + d.income, 0)
  const totalExpense = monthlyData.reduce((sum, d) => sum + d.expense, 0)
  const totalSavings = monthlyData.reduce((sum, d) => sum + d.savings, 0)
  const savingsRate = ((totalSavings / totalIncome) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold metallic-text">Finansal Analitik</h1>
          <p className="text-muted-foreground mt-1">Detayli finansal analizlerinizi inceleyin</p>
        </div>
        <div className="flex items-center gap-2">
          {["1ay", "3ay", "6ay", "1yil"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={cn(
                timeRange === range 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary/30 border-border/50"
              )}
            >
              {range.replace("ay", " Ay").replace("yil", " Yil")}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Toplam Gelir</p>
              <p className="text-2xl font-bold mt-1">{totalIncome.toLocaleString("tr-TR")} ₺</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            <span>+8.2% gecen döneme göre</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Toplam Gider</p>
              <p className="text-2xl font-bold mt-1">{totalExpense.toLocaleString("tr-TR")} ₺</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-red-400">
            <ArrowDownRight className="w-4 h-4" />
            <span>-3.5% gecen döneme göre</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Net Tasarruf</p>
              <p className="text-2xl font-bold mt-1">{totalSavings.toLocaleString("tr-TR")} ₺</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            <span>+15% gecen döneme göre</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tasarruf Orani</p>
              <p className="text-2xl font-bold mt-1">%{savingsRate}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <PieChart className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div className="h-2 bg-secondary/50 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-primary rounded-full"
              style={{ width: `${savingsRate}%` }}
            />
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expense Chart */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Gelir vs Gider Trendi</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-muted-foreground">Gelir</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-muted-foreground">Gider</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'oklch(0.6 0.02 250)', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'oklch(0.6 0.02 250)', fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.16 0.015 250)',
                    border: '1px solid oklch(0.28 0.02 250)',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                  labelStyle={{ color: 'oklch(0.92 0.01 250)' }}
                  formatter={(value: number) => [`₺${value.toLocaleString("tr-TR")}`, '']}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#incomeGradient)"
                  name="Gelir"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#expenseGradient)"
                  name="Gider"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Category Distribution */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-6">Harcama Dagilimi</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.16 0.015 250)',
                    border: '1px solid oklch(0.28 0.02 250)',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                  formatter={(value: number) => [`%${value}`, '']}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-muted-foreground">{cat.name}</span>
                <span className="ml-auto font-medium">%{cat.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Spending */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Haftalik Harcama</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Bu Hafta</span>
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 250)" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'oklch(0.6 0.02 250)', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'oklch(0.6 0.02 250)', fontSize: 12 }}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.16 0.015 250)',
                    border: '1px solid oklch(0.28 0.02 250)',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                  formatter={(value: number) => [`₺${value.toLocaleString("tr-TR")}`, 'Harcama']}
                />
                <Bar 
                  dataKey="amount" 
                  fill="url(#barGradient)" 
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.2 220)" />
                    <stop offset="100%" stopColor="oklch(0.5 0.15 220)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* AI Insights */}
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-4">AI Oneriler</h2>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className={cn(
                  "p-4 rounded-xl",
                  insight.type === "positive" && "bg-emerald-500/10 border border-emerald-500/20",
                  insight.type === "warning" && "bg-orange-500/10 border border-orange-500/20",
                  insight.type === "neutral" && "bg-secondary/30 border border-border/50"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-sm">{insight.title}</h3>
                  <span className={cn(
                    "text-sm font-semibold",
                    insight.type === "positive" && "text-emerald-400",
                    insight.type === "warning" && "text-orange-400",
                    insight.type === "neutral" && "text-foreground"
                  )}>
                    {insight.value}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
