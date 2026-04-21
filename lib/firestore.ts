// lib/firestore.ts
import { db } from './firebase'
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query, 
  where,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore'

// ==================== TRANSACTIONS ====================

export interface Transaction {
  id?: string
  userId: string
  name: string
  category: string
  amount: number
  type: 'income' | 'expense'
  date: Date
  createdAt?: Date
}

// Transaction ekleme
export async function addTransaction(userId: string, data: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...data,
      userId,
      date: Timestamp.fromDate(data.date),
      createdAt: Timestamp.now(),
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

// Kullanıcının transaction'larını getir
export async function getUserTransactions(userId: string, limitCount = 50) {
  try {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    const snapshot = await getDocs(q)
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Transaction[]
    
    return { transactions, error: null }
  } catch (error: any) {
    return { transactions: [], error: error.message }
  }
}

// Transaction güncelle
export async function updateTransaction(transactionId: string, data: Partial<Transaction>) {
  try {
    const docRef = doc(db, 'transactions', transactionId)
    await updateDoc(docRef, {
      ...data,
      ...(data.date && { date: Timestamp.fromDate(data.date) }),
    })
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Transaction sil
export async function deleteTransaction(transactionId: string) {
  try {
    await deleteDoc(doc(db, 'transactions', transactionId))
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// ==================== INVESTMENTS ====================

export interface Investment {
  id?: string
  userId: string
  name: string
  symbol: string
  value: number
  change: number
  allocation: number
  createdAt?: Date
}

// Investment ekleme
export async function addInvestment(userId: string, data: Omit<Investment, 'id' | 'userId' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, 'investments'), {
      ...data,
      userId,
      createdAt: Timestamp.now(),
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

// Kullanıcının investment'larını getir
export async function getUserInvestments(userId: string) {
  try {
    const q = query(
      collection(db, 'investments'),
      where('userId', '==', userId),
      orderBy('value', 'desc')
    )
    const snapshot = await getDocs(q)
    const investments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    })) as Investment[]
    
    return { investments, error: null }
  } catch (error: any) {
    return { investments: [], error: error.message }
  }
}

// ==================== USER PROFILE ====================

export interface UserProfile {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  totalAssets?: number
  monthlyIncome?: number
  monthlyExpenses?: number
  savingsGoal?: number
  createdAt?: Date
  updatedAt?: Date
}

// User profile oluştur veya güncelle
export async function setUserProfile(userId: string, data: Partial<UserProfile>) {
  try {
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      // Güncelle
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      })
    } else {
      // Oluştur
      await addDoc(collection(db, 'users'), {
        ...data,
        uid: userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    }
    
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// User profile getir
export async function getUserProfile(userId: string) {
  try {
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const profile = {
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate(),
      } as UserProfile
      
      return { profile, error: null }
    } else {
      return { profile: null, error: 'User profile not found' }
    }
  } catch (error: any) {
    return { profile: null, error: error.message }
  }
}

// ==================== GOALS (Birikim Hedefleri) ====================

export interface Goal {
  id?: string
  userId: string
  name: string
  iconId: string
  target: number
  current: number
  deadline: string        // "YYYY-MM-DD"
  priority: 'high' | 'medium' | 'low'
  monthlyContribution: number
  createdAt?: Date
}

/** Yeni hedef ekle */
export async function addGoal(userId: string, data: Omit<Goal, 'id' | 'userId' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, 'goals'), {
      ...data,
      userId,
      createdAt: Timestamp.now(),
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

/** Kullanıcının hedeflerini getir (oluşturma tarihine göre yeniden eskiye) */
export async function getGoals(userId: string) {
  try {
    const q = query(
      collection(db, 'goals'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    const goals = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate(),
    })) as Goal[]

    return { goals, error: null }
  } catch (error: any) {
    return { goals: [], error: error.message }
  }
}

/** Hedef sil */
export async function deleteGoal(goalId: string) {
  try {
    await deleteDoc(doc(db, 'goals', goalId))
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

/** Hedef güncelle (mevcut birikim miktarı vb.) */
export async function updateGoal(goalId: string, data: Partial<Omit<Goal, 'id' | 'userId' | 'createdAt'>>) {
  try {
    await updateDoc(doc(db, 'goals', goalId), data)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// ==================== ASSETS (Kullanıcı Varlıkları) ====================

export interface Asset {
  id?: string
  userId: string
  name: string
  type: 'bank' | 'cash' | 'real_estate' | 'other'
  balance: number
  currency: string        // "TRY", "USD", "EUR" vb.
  createdAt?: Date
  updatedAt?: Date
}

/** Yeni varlık ekle */
export async function addAsset(userId: string, data: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  try {
    const docRef = await addDoc(collection(db, 'assets'), {
      ...data,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

/** Kullanıcının tüm varlıklarını getir */
export async function getUserAssets(userId: string) {
  try {
    const q = query(
      collection(db, 'assets'),
      where('userId', '==', userId),
      orderBy('balance', 'desc')
    )
    const snapshot = await getDocs(q)
    const assets = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate(),
      updatedAt: d.data().updatedAt?.toDate(),
    })) as Asset[]

    return { assets, error: null }
  } catch (error: any) {
    return { assets: [], error: error.message }
  }
}

/** Varlık güncelle */
export async function updateAsset(assetId: string, data: Partial<Omit<Asset, 'id' | 'userId' | 'createdAt'>>) {
  try {
    await updateDoc(doc(db, 'assets', assetId), {
      ...data,
      updatedAt: Timestamp.now(),
    })
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

/** Varlık sil */
export async function deleteAsset(assetId: string) {
  try {
    await deleteDoc(doc(db, 'assets', assetId))
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// ==================== ACTIVITY LOGS (Kullanıcı Aktivite Logları) ====================
// Firestore rules gereği: sadece CREATE ve READ. Update/delete yasaktır.

export interface ActivityLog {
  id?: string
  userId: string
  action: string          // "login", "transaction_added", "goal_created" vb.
  details?: string        // opsiyonel açıklama
  createdAt?: Date
}

/** Yeni aktivite logu ekle (append-only, güncelleme/silme yok) */
export async function addActivityLog(userId: string, action: string, details?: string) {
  try {
    const docRef = await addDoc(collection(db, 'activityLogs'), {
      userId,
      action,
      ...(details !== undefined && { details }),
      createdAt: Timestamp.now(),
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

/** Kullanıcının aktivite loglarını getir (en yeni önce, max 100 kayıt) */
export async function getActivityLogs(userId: string, limitCount = 100) {
  try {
    const q = query(
      collection(db, 'activityLogs'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    const snapshot = await getDocs(q)
    const logs = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate(),
    })) as ActivityLog[]

    return { logs, error: null }
  } catch (error: any) {
    return { logs: [], error: error.message }
  }
}
