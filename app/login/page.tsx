"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Fingerprint, Mail, Lock, ArrowRight, Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signUp, signInWithGoogle } = useAuth()

  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const result = isLogin
      ? await signIn(email, password)
      : await signUp(email, password)

    if (result.error) {
      setError(translateFirebaseError(result.error))
      setIsLoading(false)
      return
    }

    router.push("/dashboard")
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setIsGoogleLoading(true)

    const result = await signInWithGoogle()

    if (result.error) {
      setError(translateFirebaseError(result.error))
      setIsGoogleLoading(false)
      return
    }

    router.push("/dashboard")
  }

  // Firebase hata kodlarını Türkçe'ye çevir
  const translateFirebaseError = (message: string): string => {
    if (message.includes("user-not-found")) return "Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı."
    if (message.includes("wrong-password")) return "Şifre hatalı. Lütfen tekrar deneyin."
    if (message.includes("email-already-in-use")) return "Bu e-posta adresi zaten kullanılıyor."
    if (message.includes("weak-password")) return "Şifre en az 6 karakter olmalıdır."
    if (message.includes("invalid-email")) return "Geçersiz e-posta adresi."
    if (message.includes("too-many-requests")) return "Çok fazla başarısız deneme. Lütfen bir süre bekleyin."
    if (message.includes("popup-closed-by-user")) return "Google girişi iptal edildi."
    if (message.includes("invalid-credential")) return "E-posta veya şifre hatalı."
    return "Bir hata oluştu. Lütfen tekrar deneyin."
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_oklch(0.25_0.08_220)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_oklch(0.2_0.06_250)_0%,_transparent_50%)]" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[oklch(0.7_0.2_220/0.1)] blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[oklch(0.6_0.15_250/0.08)] blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[oklch(0.7_0.2_220)] ai-icon-glow mb-4">
            <Sparkles className="w-8 h-8 text-[oklch(0.12_0.01_250)]" />
          </div>
          <h1 className="text-3xl font-bold metallic-text">FinanceAI</h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? "Hesabiniza giris yapin" : "Yeni hesap olusturun"}
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card glass-card-glow rounded-2xl p-8">

          {/* Hata Mesajı */}
          {error && (
            <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-[oklch(0.35_0.12_25/0.15)] border border-[oklch(0.55_0.18_25/0.4)] text-[oklch(0.85_0.1_25)] text-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">Ad Soyad</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Adinizi girin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12 bg-secondary/50 border-border/50 focus:border-primary/50 transition-colors"
                  />
                  <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">E-posta</label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null) }}
                  className="pl-10 h-12 bg-secondary/50 border-border/50 focus:border-primary/50 transition-colors"
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Sifre</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Sifrenizi girin"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null) }}
                  className="pl-10 pr-10 h-12 bg-secondary/50 border-border/50 focus:border-primary/50 transition-colors"
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-border bg-secondary" />
                  <span className="text-muted-foreground">Beni hatirla</span>
                </label>
                <button type="button" className="text-primary hover:underline">
                  Sifremi unuttum
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className={cn(
                "w-full h-12 bg-[oklch(0.7_0.2_220)] hover:bg-[oklch(0.65_0.2_220)] text-[oklch(0.12_0.01_250)] font-semibold",
                "transition-all duration-300 hover:shadow-[0_0_30px_oklch(0.7_0.2_220/0.4)]"
              )}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? "Giris Yap" : "Kayit Ol"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-sm text-muted-foreground">veya</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
              className="h-12 bg-secondary/30 border-border/50 hover:bg-secondary/50"
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </>
              )}
            </Button>
            <Button variant="outline" className="h-12 bg-secondary/30 border-border/50 hover:bg-secondary/50">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              Apple
            </Button>
          </div>

          {/* Switch mode */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Hesabiniz yok mu?" : "Zaten hesabiniz var mi?"}{" "}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(null) }}
              className="text-primary hover:underline font-medium"
            >
              {isLogin ? "Kayit olun" : "Giris yapin"}
            </button>
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { icon: "🔒", text: "256-bit SSL" },
            { icon: "🛡️", text: "2FA Koruma" },
            { icon: "📊", text: "AI Analiz" },
          ].map((feature, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl mb-1">{feature.icon}</div>
              <div className="text-xs text-muted-foreground">{feature.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
