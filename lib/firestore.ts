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
      orderBy('date', 'desc'),
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
