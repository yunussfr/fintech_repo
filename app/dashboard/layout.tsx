"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useAuth } from "@/hooks/useAuth"
import { LanguageProvider } from "@/lib/i18n/LanguageContext"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Auth durumu yüklenince ve kullanıcı yoksa login'e yönlendir
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [user, loading, router])

  // Yükleniyor ekranı
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[oklch(0.12_0.01_250)]">
        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-[oklch(0.28_0.02_250)] border-t-[oklch(0.7_0.2_220)] animate-spin" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-b-[oklch(0.6_0.15_280/0.4)] animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
        </div>
        {/* Logo & Metin */}
        <div className="text-center">
          <p className="text-lg font-semibold metallic-text">FinanceAI</p>
          <p className="text-sm text-muted-foreground mt-1 animate-pulse">Hesabınız doğrulanıyor...</p>
        </div>
      </div>
    )
  }

  // Kullanıcı yoksa (yönlendirme useEffect'te yapılıyor) boş döndür
  if (!user) {
    return null
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen relative">
        {/* Futuristic background effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Grid pattern */}
          <div className="absolute inset-0 grid-pattern opacity-[0.02]" />
          
          {/* Radial gradients for depth */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[oklch(0.7_0.2_220/0.03)] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[oklch(0.6_0.15_280/0.03)] rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[oklch(0.65_0.18_230/0.02)] rounded-full blur-3xl" />
        </div>
        
        <Sidebar />
        <main className="pl-64 min-h-screen relative z-10">
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </LanguageProvider>
  )
}
