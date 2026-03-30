"use client"

import { useState, useRef, useEffect } from "react"
import { GlassCard } from "./glass-card"
import { Send, Sparkles, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI Finance Mentor. I've analyzed your portfolio and noticed some interesting patterns. Would you like me to share some insights?",
  },
]

const suggestedQuestions = [
  "How can I reduce spending?",
  "Best investment tips?",
  "Analyze my portfolio",
]

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (message: string = input) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "How can I reduce spending?": "Based on your spending patterns, I notice you tend to overspend on weekends. Here are 3 actionable tips:\n\n1. Set a weekend budget of $300\n2. Use the 24-hour rule for purchases over $50\n3. Try meal prepping to reduce dining out expenses\n\nWant me to set up automatic alerts for budget limits?",
        "Best investment tips?": "Looking at your portfolio and risk tolerance, I recommend:\n\n1. Increase your index fund allocation by 15%\n2. Consider dollar-cost averaging into ETFs\n3. Your emergency fund is solid - great job!\n\nYour current portfolio is performing 12% above market average.",
        "Analyze my portfolio": "Here's your portfolio analysis:\n\n📈 Performance: +86.9% YTD\n💰 Total Assets: $78,500\n⚖️ Risk Score: Moderate (6/10)\n\nStrengths: Well-diversified, consistent growth\nAreas to improve: Consider adding bonds for stability\n\nWould you like detailed recommendations?",
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[message] || "That's a great question! Based on your financial data, I can see several opportunities for optimization. Would you like me to provide a detailed analysis of your current financial situation?",
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <GlassCard className="h-full flex flex-col" glow={true}>
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[oklch(0.28_0.02_250)]">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[oklch(0.7_0.2_220)] via-[oklch(0.65_0.18_230)] to-[oklch(0.6_0.15_240)] flex items-center justify-center ai-icon-glow shadow-lg shadow-[oklch(0.7_0.2_220/0.3)]">
            <Sparkles className="w-6 h-6 text-[oklch(0.12_0.01_250)]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[oklch(0.6_0.2_150)] rounded-full border-2 border-[oklch(0.16_0.015_250)] animate-pulse" />
        </div>
        <div>
          <h3 className="font-semibold metallic-text">AI Finance Mentor</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.6_0.2_150)] animate-pulse" />
            Always here to help
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === "user" && "flex-row-reverse"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-lg",
              message.role === "assistant" 
                ? "bg-gradient-to-br from-[oklch(0.7_0.2_220)] via-[oklch(0.65_0.18_230)] to-[oklch(0.6_0.15_240)] shadow-[oklch(0.7_0.2_220/0.3)]" 
                : "bg-gradient-to-br from-[oklch(0.35_0.02_250)] to-[oklch(0.25_0.015_250)] shadow-[oklch(0_0_0/0.3)]"
            )}>
              {message.role === "assistant" 
                ? <Bot className="w-4 h-4 text-[oklch(0.12_0.01_250)]" />
                : <User className="w-4 h-4 text-foreground" />
              }
            </div>
            <div className={cn(
              "max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap backdrop-blur-sm",
              message.role === "assistant"
                ? "bg-[oklch(0.2_0.015_250)] text-foreground rounded-tl-none border border-[oklch(0.28_0.02_250)]"
                : "bg-gradient-to-br from-[oklch(0.7_0.2_220)] to-[oklch(0.65_0.18_230)] text-[oklch(0.12_0.01_250)] rounded-tr-none shadow-lg shadow-[oklch(0.7_0.2_220/0.2)]"
            )}>
              {message.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.7_0.2_220)] via-[oklch(0.65_0.18_230)] to-[oklch(0.6_0.15_240)] flex items-center justify-center shadow-lg shadow-[oklch(0.7_0.2_220/0.3)]">
              <Bot className="w-4 h-4 text-[oklch(0.12_0.01_250)]" />
            </div>
            <div className="bg-[oklch(0.2_0.015_250)] rounded-2xl rounded-tl-none px-4 py-3 border border-[oklch(0.28_0.02_250)]">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[oklch(0.7_0.2_220)] rounded-full animate-bounce shadow-sm shadow-[oklch(0.7_0.2_220/0.5)]" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-[oklch(0.7_0.2_220)] rounded-full animate-bounce shadow-sm shadow-[oklch(0.7_0.2_220/0.5)]" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-[oklch(0.7_0.2_220)] rounded-full animate-bounce shadow-sm shadow-[oklch(0.7_0.2_220/0.5)]" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="flex gap-2 flex-wrap py-3 border-t border-[oklch(0.28_0.02_250)]">
        {suggestedQuestions.map((question) => (
          <button
            key={question}
            onClick={() => handleSend(question)}
            className="text-xs px-3 py-1.5 rounded-full bg-[oklch(0.2_0.015_250)] text-muted-foreground hover:text-foreground hover:bg-[oklch(0.25_0.02_250)] transition-all duration-300 border border-[oklch(0.28_0.02_250)] hover:border-[oklch(0.7_0.2_220/0.3)] backdrop-blur-sm"
          >
            {question}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="pt-3 border-t border-[oklch(0.28_0.02_250)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything about your finances..."
            className="flex-1 bg-[oklch(0.15_0.01_250)] border border-[oklch(0.28_0.02_250)] rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[oklch(0.7_0.2_220/0.5)] focus:ring-2 focus:ring-[oklch(0.7_0.2_220/0.2)] transition-all backdrop-blur-sm"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-[oklch(0.7_0.2_220)] via-[oklch(0.65_0.18_230)] to-[oklch(0.6_0.15_240)] flex items-center justify-center hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[oklch(0.7_0.2_220/0.3)] hover:shadow-xl hover:shadow-[oklch(0.7_0.2_220/0.4)] btn-glow"
          >
            <Send className="w-5 h-5 text-[oklch(0.12_0.01_250)]" />
          </button>
        </div>
      </div>
    </GlassCard>
  )
}
