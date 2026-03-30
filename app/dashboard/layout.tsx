import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
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
  )
}
