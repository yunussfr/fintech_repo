// lib/i18n/translations.ts
// TR/EN sözlük — tüm UI metinleri burada tutulur.

export const translations = {
  tr: {
    // ── Navigasyon ──────────────────────────────────────────────
    nav: {
      home:         "Ana Sayfa",
      currency:     "Döviz Çevirici",
      transactions: "İşlemler",
      budget:       "Bütçe",
      analytics:    "Analitik",
      assets:       "Varlıklar",
      settings:     "Ayarlar",
      notifications:"Bildirimler",
      help:         "Yardım",
      logout:       "Çıkış Yap",
      loggingOut:   "Çıkılıyor...",
    },

    // ── Grafik Etiketleri ────────────────────────────────────────
    days: {
      mon: "Pzt", tue: "Sal", wed: "Çar",
      thu: "Per", fri: "Cum", sat: "Cmt", sun: "Paz",
    },
    months: {
      jan: "Oca", feb: "Şub", mar: "Mar",
      apr: "Nis", may: "May", jun: "Haz",
      jul: "Tem", aug: "Ağu", sep: "Eyl",
      oct: "Eki", nov: "Kas", dec: "Ara",
    },

    // ── SpendingChart ────────────────────────────────────────────
    spending: {
      title:        "Haftalık Harcama",
      dailyBudget:  "Günlük bütçe",
      exceeded:     "Bütçe Aşıldı",
      overBy:       "Aşım",
    },

    // ── PortfolioChart ───────────────────────────────────────────
    portfolio: {
      title:        "Portföy Performansı",
      subtitle:     "Yatırım büyümeni takip et",
      totalGrowth:  "Toplam Büyüme",
      investments:  "Yatırım Varlıkları",
      liveValues:   "Anlık değerler",
    },

    // ── Assets Sayfası ───────────────────────────────────────────
    assets: {
      title:          "Varlıklarım",
      subtitle:       "Tüm finansal varlıklarınızı yönetin",
      addButton:      "Yeni Varlık Ekle",
      totalAssets:    "Toplam Varlık",
      assetCount:     "Varlık Sayısı",
      loading:        "Varlıklar yükleniyor...",
      empty:          "Henüz varlık eklenmedi",
      emptyDesc:      "İlk varlığınızı ekleyerek başlayın.",
      deleteConfirm:  "Bu varlık silinsin mi?",
      deleteSuccess:  "Varlık silindi",
      addSuccess:     "Varlık eklendi",

      // Form
      modal: {
        title:    "Yeni Varlık Ekle",
        subtitle: "Finansal varlığınızı tanımlayın",
        name:     "Varlık Adı",
        namePh:   "Örn: Ziraat Bankası, Ev, Nakit...",
        type:     "Tür",
        balance:  "Bakiye",
        currency: "Para Birimi",
        save:     "Varlık Ekle",
        saving:   "Kaydediliyor...",
        cancel:   "İptal",
      },

      // Türler
      types: {
        bank:        "Banka Hesabı",
        cash:        "Nakit",
        real_estate: "Gayrimenkul",
        other:       "Diğer",
      },
    },

    // ── Budget / Goals ───────────────────────────────────────────
    budget: {
      title:       "Bütçe ve Hedefler",
      subtitle:    "Harcamalarınızı yönetin ve hedeflerinize ulaşın",
      addGoal:     "Yeni Hedef Ekle",
      loading:     "Hedefler yükleniyor...",
      
      // Overview Cards
      monthlyBudget: "Aylık Bütçe",
      spent:         "Harcanan",
      remaining:     "Kalan",
      activeGoals:   "Aktif Hedefler",
      totalGoals:    "Toplam",
      addGoalPrompt: "Hedef ekleyin",
      
      // Tabs
      budgetTracking: "Bütçe Takibi",
      savingsGoals:   "Birikim Hedefleri",
      
      // Goal Suggestions
      goalSuggestions: "Hedef Önerileri",
      goalSuggestionsDesc: "Bütçenize göre hedeflerinize ulaşma planı",
      perMonth: "ay",
      canAfford: "Mevcut bütçenizle ulaşabilirsiniz",
      needMore: "daha tasarruf gerekli",
      months: "ay",
      
      // Monthly Summary
      monthlySummary: "Aylık Özet",
      
      // Category Budget
      categoryBudget: "Kategori Bazlı Bütçe",
      overBudget: "aşım",
      
      // Goals
      noGoals: "Henüz hedef yok",
      noGoalsDesc: "İlk birikim hedefinizi oluşturun.",
      progress: "İlerleme",
      saved: "Biriken",
      target: "Hedef",
      monthlyContribution: "Aylık Katkı",
      deadline: "Son Tarih",
      monthsLeft: "ay kaldı",
      expired: "Süresi geçti",
      
      // Priority
      high: "Yüksek",
      medium: "Orta",
      low: "Düşük",
    },

    // ── Settings ─────────────────────────────────────────────────
    settings: {
      language:    "Dil",
      langTr:      "Türkçe",
      langEn:      "English",
      darkMode:    "Karanlık Mod",
      darkOn:      "Karanlık tema aktif",
      darkOff:     "Aydınlık tema aktif",
    },

    // ── Genel ────────────────────────────────────────────────────
    common: {
      save:    "Kaydet",
      cancel:  "İptal",
      delete:  "Sil",
      edit:    "Düzenle",
      add:     "Ekle",
      loading: "Yükleniyor...",
      error:   "Bir hata oluştu",
      success: "İşlem başarılı",
      seeAll:  "Tümünü Gör",
      confirm: "Onayla",
    },

    // ── Dashboard ─────────────────────────────────────────────────
    dashboard: {
      welcome: "Hoş Geldiniz",
      financialSummary: "Finansal durumunuzun özeti",
      
      // Stats Cards
      totalAssets: "Toplam Varlık",
      monthlyIncome: "Aylık Gelir",
      monthlyExpenses: "Aylık Gider",
      savingsGoal: "Birikim Hedefi",
      
      // Recent Transactions
      recentTransactions: "Son İşlemler",
      latestActivity: "En son aktiviteleriniz",
      noTransactions: "Henüz işlem yok",
      
      // Savings Goals
      yourSavingsGoals: "Birikim Hedefleriniz",
      howCloseAreYou: "Hedeflerinize ne kadar yakınsınız?",
      moreGoals: "hedef daha",
      
      // Goal Status
      canReachIn: "ile",
      inMonths: "ayda ulaşabilirsiniz",
      savingsNeeded: "tasarruf gerekli",
      
      // Confirm Dialog
      confirmChange: "Değişikliği Onayla",
      confirmChangeDesc: "Bu değeri güncellemek istediğinizden emin misiniz?",
    },
  },

  en: {
    nav: {
      home:         "Dashboard",
      currency:     "Currency",
      transactions: "Transactions",
      budget:       "Budget",
      analytics:    "Analytics",
      assets:       "Assets",
      settings:     "Settings",
      notifications:"Notifications",
      help:         "Help",
      logout:       "Sign Out",
      loggingOut:   "Signing out...",
    },

    days: {
      mon: "Mon", tue: "Tue", wed: "Wed",
      thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
    },
    months: {
      jan: "Jan", feb: "Feb", mar: "Mar",
      apr: "Apr", may: "May", jun: "Jun",
      jul: "Jul", aug: "Aug", sep: "Sep",
      oct: "Oct", nov: "Nov", dec: "Dec",
    },

    spending: {
      title:        "Weekly Spending",
      dailyBudget:  "Daily budget",
      exceeded:     "Budget Exceeded",
      overBy:       "Over budget by",
    },

    portfolio: {
      title:        "Portfolio Performance",
      subtitle:     "Track your investment growth",
      totalGrowth:  "Total Growth",
      investments:  "Investment Assets",
      liveValues:   "Live values",
    },

    assets: {
      title:         "My Assets",
      subtitle:      "Manage all your financial assets",
      addButton:     "Add New Asset",
      totalAssets:   "Total Assets",
      assetCount:    "Asset Count",
      loading:       "Loading assets...",
      empty:         "No assets added yet",
      emptyDesc:     "Start by adding your first asset.",
      deleteConfirm: "Delete this asset?",
      deleteSuccess: "Asset deleted",
      addSuccess:    "Asset added",

      modal: {
        title:    "Add New Asset",
        subtitle: "Define your financial asset",
        name:     "Asset Name",
        namePh:   "E.g. Savings Account, House, Cash...",
        type:     "Type",
        balance:  "Balance",
        currency: "Currency",
        save:     "Add Asset",
        saving:   "Saving...",
        cancel:   "Cancel",
      },

      types: {
        bank:        "Bank Account",
        cash:        "Cash",
        real_estate: "Real Estate",
        other:       "Other",
      },
    },

    budget: {
      title:       "Budget & Goals",
      subtitle:    "Manage your expenses and reach your goals",
      addGoal:     "Add New Goal",
      loading:     "Loading goals...",
      
      // Overview Cards
      monthlyBudget: "Monthly Budget",
      spent:         "Spent",
      remaining:     "Remaining",
      activeGoals:   "Active Goals",
      totalGoals:    "Total",
      addGoalPrompt: "Add a goal",
      
      // Tabs
      budgetTracking: "Budget Tracking",
      savingsGoals:   "Savings Goals",
      
      // Goal Suggestions
      goalSuggestions: "Goal Suggestions",
      goalSuggestionsDesc: "Plan to reach your goals based on your budget",
      perMonth: "month",
      canAfford: "You can reach it with your current budget",
      needMore: "more savings needed",
      months: "months",
      
      // Monthly Summary
      monthlySummary: "Monthly Summary",
      
      // Category Budget
      categoryBudget: "Category Budget",
      overBudget: "over budget",
      
      // Goals
      noGoals: "No goals yet",
      noGoalsDesc: "Create your first savings goal.",
      progress: "Progress",
      saved: "Saved",
      target: "Target",
      monthlyContribution: "Monthly Contribution",
      deadline: "Deadline",
      monthsLeft: "months left",
      expired: "Expired",
      
      // Priority
      high: "High",
      medium: "Medium",
      low: "Low",
    },

    settings: {
      language:    "Language",
      langTr:      "Türkçe",
      langEn:      "English",
      darkMode:    "Dark Mode",
      darkOn:      "Dark theme active",
      darkOff:     "Light theme active",
    },

    common: {
      save:    "Save",
      cancel:  "Cancel",
      delete:  "Delete",
      edit:    "Edit",
      add:     "Add",
      loading: "Loading...",
      error:   "An error occurred",
      success: "Success",
      seeAll:  "See All",
      confirm: "Confirm",
    },

    // ── Dashboard ─────────────────────────────────────────────────
    dashboard: {
      welcome: "Welcome",
      financialSummary: "Your financial summary",
      
      // Stats Cards
      totalAssets: "Total Assets",
      monthlyIncome: "Monthly Income",
      monthlyExpenses: "Monthly Expenses",
      savingsGoal: "Savings Goal",
      
      // Recent Transactions
      recentTransactions: "Recent Transactions",
      latestActivity: "Your latest activity",
      noTransactions: "No transactions yet",
      
      // Savings Goals
      yourSavingsGoals: "Your Savings Goals",
      howCloseAreYou: "How close are you to your goals?",
      moreGoals: "more goals",
      
      // Goal Status
      canReachIn: "with",
      inMonths: "you can reach in months",
      savingsNeeded: "savings needed",
      
      // Confirm Dialog
      confirmChange: "Confirm Change",
      confirmChangeDesc: "Are you sure you want to update this value?",
    },
  },
} as const

export type Language = keyof typeof translations
export type Translations = typeof translations.tr
