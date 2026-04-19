"use client"

import { StatsCard } from "@/components/dashboard/stats-card"
import { PortfolioChart } from "@/components/dashboard/portfolio-chart"
import { SpendingChart } from "@/components/dashboard/spending-chart"
import { AIChat } from "@/components/dashboard/ai-chat"
import { InvestmentList } from "@/components/dashboard/investment-list"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { Wallet, TrendingUp, ArrowUpDown, PiggyBank } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardPage() {
  const { user } = useAuth()

  // displayName varsa kullan, yoksa e-postanın @ öncesi kısmı
  const displayName = user?.displayName || user?.email?.split("@")[0] || "Kullanıcı"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        <h1 className="text-2xl font-bold metallic-text">Hoş Geldiniz, {displayName} 👋</h1>
        <p className="text-muted-foreground mt-1">Finansal durumunuzun özeti</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatsCard
              title="Toplam Varlik"
              value="₺785,000"
              change={12.5}
              icon={<Wallet className="w-5 h-5" />}
            />
            <StatsCard
              title="Aylik Gelir"
              value="₺53,500"
              change={8.2}
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <StatsCard
              title="Aylik Gider"
              value="₺38,400"
              change={-5.3}
              changeLabel="gecen aya gore azaldi"
              icon={<ArrowUpDown className="w-5 h-5" />}
              variant="highlight"
            />
            <StatsCard
              title="Birikim Hedefi"
              value="68%"
              change={15.0}
              changeLabel="₺500K hedefine dogru"
              icon={<PiggyBank className="w-5 h-5" />}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <PortfolioChart />
            <div className="space-y-6">
              <SpendingChart />
              <InvestmentList />
            </div>
          </div>

          {/* Transactions */}
          <RecentTransactions />
        </div>

        {/* AI Chat Sidebar */}
        <div className="w-full xl:w-[380px]">
          <div className="xl:sticky xl:top-6">
            <AIChat />
          </div>
        </div>
      </div>
    </div>
  )
}
