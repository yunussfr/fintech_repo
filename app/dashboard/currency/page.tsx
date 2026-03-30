"use client"

import { useState, useEffect } from "react"
import { ArrowRightLeft, TrendingUp, TrendingDown, RefreshCw, Star, Clock, ChevronDown } from "lucide-react"
import { GlassCard } from "@/components/dashboard/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const currencies = [
  { code: "USD", name: "ABD Dolari", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "Ingiliz Sterlini", symbol: "£", flag: "🇬🇧" },
  { code: "TRY", name: "Turk Lirasi", symbol: "₺", flag: "🇹🇷" },
  { code: "JPY", name: "Japon Yeni", symbol: "¥", flag: "🇯🇵" },
  { code: "CHF", name: "Isvicre Frangi", symbol: "Fr", flag: "🇨🇭" },
  { code: "CAD", name: "Kanada Dolari", symbol: "$", flag: "🇨🇦" },
  { code: "AUD", name: "Avustralya Dolari", symbol: "$", flag: "🇦🇺" },
  { code: "CNY", name: "Cin Yuani", symbol: "¥", flag: "🇨🇳" },
  { code: "INR", name: "Hindistan Rupisi", symbol: "₹", flag: "🇮🇳" },
]

// Simulated exchange rates (base: USD)
const exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  TRY: 32.15,
  JPY: 149.50,
  CHF: 0.88,
  CAD: 1.36,
  AUD: 1.53,
  CNY: 7.24,
  INR: 83.12,
}

const popularPairs = [
  { from: "USD", to: "TRY", change: 2.34 },
  { from: "EUR", to: "TRY", change: 1.87 },
  { from: "GBP", to: "TRY", change: -0.45 },
  { from: "USD", to: "EUR", change: 0.12 },
  { from: "EUR", to: "USD", change: -0.11 },
  { from: "USD", to: "JPY", change: 0.65 },
]

const recentConversions = [
  { from: "USD", to: "TRY", amount: 1000, result: 32150, time: "2 dk once" },
  { from: "EUR", to: "USD", amount: 500, result: 543.48, time: "15 dk once" },
  { from: "GBP", to: "TRY", amount: 250, result: 10172.78, time: "1 saat once" },
]

export default function CurrencyPage() {
  const [fromCurrency, setFromCurrency] = useState(currencies[0])
  const [toCurrency, setToCurrency] = useState(currencies[3])
  const [amount, setAmount] = useState("1000")
  const [result, setResult] = useState("0")
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(["USD-TRY", "EUR-TRY"])

  const convert = (value: string, from: string, to: string) => {
    const numValue = parseFloat(value) || 0
    const fromRate = exchangeRates[from]
    const toRate = exchangeRates[to]
    const converted = (numValue / fromRate) * toRate
    return converted.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  useEffect(() => {
    setResult(convert(amount, fromCurrency.code, toCurrency.code))
  }, [amount, fromCurrency, toCurrency])

  const swapCurrencies = () => {
    setIsConverting(true)
    setTimeout(() => {
      const temp = fromCurrency
      setFromCurrency(toCurrency)
      setToCurrency(temp)
      setIsConverting(false)
    }, 300)
  }

  const toggleFavorite = (pair: string) => {
    setFavorites(prev => 
      prev.includes(pair) ? prev.filter(p => p !== pair) : [...prev, pair]
    )
  }

  const rate = (exchangeRates[toCurrency.code] / exchangeRates[fromCurrency.code])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold metallic-text">Doviz Cevirici</h1>
        <p className="text-muted-foreground mt-1">Anlık kurlarla doviz donusumu yapin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Converter */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6" glow>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Doviz Cevir</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(`${fromCurrency.code}-${toCurrency.code}`)}
                className={cn(
                  "gap-2",
                  favorites.includes(`${fromCurrency.code}-${toCurrency.code}`) && "text-yellow-500"
                )}
              >
                <Star className={cn(
                  "w-4 h-4",
                  favorites.includes(`${fromCurrency.code}-${toCurrency.code}`) && "fill-current"
                )} />
                Favorilere Ekle
              </Button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* From Currency */}
              <div className="flex-1 w-full">
                <label className="text-sm text-muted-foreground mb-2 block">Gonderen</label>
                <div className="relative">
                  <div
                    onClick={() => setShowFromDropdown(!showFromDropdown)}
                    className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl cursor-pointer hover:bg-secondary/70 transition-colors"
                  >
                    <span className="text-2xl">{fromCurrency.flag}</span>
                    <div className="flex-1">
                      <div className="font-semibold">{fromCurrency.code}</div>
                      <div className="text-sm text-muted-foreground">{fromCurrency.name}</div>
                    </div>
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </div>
                  
                  {showFromDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                      {currencies.map(currency => (
                        <div
                          key={currency.code}
                          onClick={() => {
                            setFromCurrency(currency)
                            setShowFromDropdown(false)
                          }}
                          className={cn(
                            "flex items-center gap-3 p-3 cursor-pointer hover:bg-secondary/50 transition-colors",
                            currency.code === fromCurrency.code && "bg-primary/10"
                          )}
                        >
                          <span className="text-xl">{currency.flag}</span>
                          <div className="flex-1">
                            <div className="font-medium">{currency.code}</div>
                            <div className="text-xs text-muted-foreground">{currency.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  className="mt-3 h-14 text-2xl font-bold bg-secondary/30 border-border/50 text-center"
                  placeholder="0.00"
                />
              </div>

              {/* Swap Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={swapCurrencies}
                className={cn(
                  "w-12 h-12 rounded-full border-primary/30 bg-primary/10 hover:bg-primary/20 shrink-0",
                  isConverting && "animate-spin"
                )}
              >
                <ArrowRightLeft className="w-5 h-5 text-primary" />
              </Button>

              {/* To Currency */}
              <div className="flex-1 w-full">
                <label className="text-sm text-muted-foreground mb-2 block">Alan</label>
                <div className="relative">
                  <div
                    onClick={() => setShowToDropdown(!showToDropdown)}
                    className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl cursor-pointer hover:bg-secondary/70 transition-colors"
                  >
                    <span className="text-2xl">{toCurrency.flag}</span>
                    <div className="flex-1">
                      <div className="font-semibold">{toCurrency.code}</div>
                      <div className="text-sm text-muted-foreground">{toCurrency.name}</div>
                    </div>
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </div>
                  
                  {showToDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                      {currencies.map(currency => (
                        <div
                          key={currency.code}
                          onClick={() => {
                            setToCurrency(currency)
                            setShowToDropdown(false)
                          }}
                          className={cn(
                            "flex items-center gap-3 p-3 cursor-pointer hover:bg-secondary/50 transition-colors",
                            currency.code === toCurrency.code && "bg-primary/10"
                          )}
                        >
                          <span className="text-xl">{currency.flag}</span>
                          <div className="flex-1">
                            <div className="font-medium">{currency.code}</div>
                            <div className="text-xs text-muted-foreground">{currency.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-3 h-14 flex items-center justify-center text-2xl font-bold bg-primary/10 rounded-lg border border-primary/20">
                  <span className="text-primary">{toCurrency.symbol}</span>
                  <span className="ml-2">{result}</span>
                </div>
              </div>
            </div>

            {/* Rate Info */}
            <div className="flex items-center justify-between mt-6 p-4 bg-secondary/30 rounded-xl">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Guncel Kur:</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  1 {fromCurrency.code} = {rate.toFixed(4)} {toCurrency.code}
                </div>
                <div className="text-xs text-muted-foreground">Son guncelleme: 1 dk once</div>
              </div>
            </div>
          </GlassCard>

          {/* Popular Pairs */}
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold mb-4">Populer Pariteler</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {popularPairs.map((pair, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setFromCurrency(currencies.find(c => c.code === pair.from)!)
                    setToCurrency(currencies.find(c => c.code === pair.to)!)
                  }}
                  className="p-4 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{pair.from}/{pair.to}</span>
                    <div className={cn(
                      "flex items-center gap-1 text-sm",
                      pair.change >= 0 ? "text-green-400" : "text-red-400"
                    )}>
                      {pair.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {pair.change >= 0 ? "+" : ""}{pair.change}%
                    </div>
                  </div>
                  <div className="text-lg font-bold">
                    {(exchangeRates[pair.to] / exchangeRates[pair.from]).toFixed(4)}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Favorites */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <h2 className="text-lg font-semibold">Favorilerim</h2>
            </div>
            <div className="space-y-3">
              {favorites.map(pair => {
                const [from, to] = pair.split("-")
                const fromCurr = currencies.find(c => c.code === from)
                const toCurr = currencies.find(c => c.code === to)
                if (!fromCurr || !toCurr) return null
                return (
                  <div
                    key={pair}
                    onClick={() => {
                      setFromCurrency(fromCurr)
                      setToCurrency(toCurr)
                    }}
                    className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>{fromCurr.flag}</span>
                      <span className="font-medium">{from}/{to}</span>
                      <span>{toCurr.flag}</span>
                    </div>
                    <span className="font-semibold">
                      {(exchangeRates[to] / exchangeRates[from]).toFixed(2)}
                    </span>
                  </div>
                )
              })}
              {favorites.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Henuz favori parite eklemediniz
                </p>
              )}
            </div>
          </GlassCard>

          {/* Recent Conversions */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Son Ceviriler</h2>
            </div>
            <div className="space-y-3">
              {recentConversions.map((conv, index) => (
                <div key={index} className="p-3 bg-secondary/30 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{conv.from} → {conv.to}</span>
                    <span className="text-xs text-muted-foreground">{conv.time}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {conv.amount.toLocaleString()} {conv.from}
                    </span>
                    <span className="font-semibold text-primary">
                      {conv.result.toLocaleString()} {conv.to}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* AI Tip */}
          <GlassCard className="p-6 border-primary/30" glow>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-lg">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI Oneri</h3>
                <p className="text-sm text-muted-foreground">
                  TRY/USD paritesi son 24 saatte %2.3 yukseldi. Doviz alimi icin beklemek mantikli olabilir.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
