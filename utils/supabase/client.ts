// Check if Supabase credentials are available
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY?.trim()

// Only create client if both URL and key are provided and not empty
let supabase: any = null
let isSupabaseConfigured = false

// Force localStorage mode for now to avoid errors
console.log('📦 Running in localStorage mode')
isSupabaseConfigured = false

// Uncomment below when Supabase is needed:
/*
if (supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '') {
  try {
    import { createClient } from '@supabase/supabase-js'
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    isSupabaseConfigured = true
    console.log('✅ Supabase client initialized')
  } catch (error) {
    console.warn('⚠️ Failed to initialize Supabase client:', error)
    isSupabaseConfigured = false
  }
}
*/

export { supabase, isSupabaseConfigured }

// Database tables configuration
export const TABLES = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories', 
  TRANSACTIONS: 'transactions',
  STOCK_LOGS: 'stock_logs',
  RECEIPTS: 'receipts',
  STORE_SETTINGS: 'store_settings'
}

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error)
  throw new Error(error.message || 'Database operation failed')
}

// Helper function to check if operation is possible
const checkSupabaseReady = () => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('localStorage mode - Supabase operations disabled')
  }
}

// Products operations
export const productOperations = {
  async getAll() {
    checkSupabaseReady()
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .select('*')
      .order('name')
    
    if (error) handleSupabaseError(error)
    return data || []
  },

  async create(product: any) {
    checkSupabaseReady()
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .insert(product)
      .select()
      .single()
    
    if (error) handleSupabaseError(error)
    return data
  },

  async update(id: string, updates: any) {
    checkSupabaseReady()
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) handleSupabaseError(error)
    return data
  },

  async delete(id: string) {
    checkSupabaseReady()
    const { error } = await supabase
      .from(TABLES.PRODUCTS)
      .delete()
      .eq('id', id)
    
    if (error) handleSupabaseError(error)
  }
}

// Categories operations
export const categoryOperations = {
  async getAll() {
    checkSupabaseReady()
    const { data, error } = await supabase
      .from(TABLES.CATEGORIES)
      .select('*')
      .order('name')
    
    if (error) handleSupabaseError(error)
    return data || []
  },

  async create(category: any) {
    checkSupabaseReady()
    const { data, error } = await supabase
      .from(TABLES.CATEGORIES)
      .insert(category)
      .select()
      .single()
    
    if (error) handleSupabaseError(error)
    return data
  },

  async update(id: string, updates: any) {
    checkSupabaseReady()
    const { data, error } = await supabase
      .from(TABLES.CATEGORIES)
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) handleSupabaseError(error)
    return data
  },

  async delete(id: string) {
    checkSupabaseReady()
    const { error } = await supabase
      .from(TABLES.CATEGORIES)
      .delete()
      .eq('id', id)
    
    if (error) handleSupabaseError(error)
  }
}

// Transactions operations
export const transactionOperations = {
  async getAll() {
    checkSupabaseReady()
    const { data, error } = await supabase
      .from(TABLES.TRANSACTIONS)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) handleSupabaseError(error)
    return data || []
  },

  async create(transaction: any) {
    checkSupabaseReady()
    const { data, error } = await supabase
      .from(TABLES.TRANSACTIONS)
      .insert(transaction)
      .select()
      .single()
    
    if (error) handleSupabaseError(error)
    return data
  },

  async update(id: string, updates: any) {
    checkSupabaseReady()
    const { data, error } = await supabase
      .from(TABLES.TRANSACTIONS)
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) handleSupabaseError(error)
    return data
  },

  async delete(id: string) {
    checkSupabaseReady()
    const { error } = await supabase
      .from(TABLES.TRANSACTIONS)
      .delete()
      .eq('id', id)
    
    if (error) handleSupabaseError(error)
  }
}

// Stock logs operations
export const stockLogOperations = {
  async getAll() {
    checkSupabaseReady()
    const { data, error } = await supabase
      .from(TABLES.STOCK_LOGS)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) handleSupabaseError(error)
    return data || []
  },

  async create(stockLog: any) {
    checkSupabaseReady()
    const { data, error } = await supabase
      .from(TABLES.STOCK_LOGS)
      .insert(stockLog)
      .select()
      .single()
    
    if (error) handleSupabaseError(error)
    return data
  }
}

// Receipt operations
export const receiptOperations = {
  async getAll() {
    checkSupabaseReady()
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) handleSupabaseError(error)
    return data || []
  },

  async create(receipt: any) {
    checkSupabaseReady()
    const { data, error } = await supabase
      .from('receipts')
      .insert(receipt)
      .select()
      .single()
    
    if (error) handleSupabaseError(error)
    return data
  },

  async delete(id: string) {
    checkSupabaseReady()
    const { error } = await supabase
      .from('receipts')
      .delete()
      .eq('id', id)
    
    if (error) handleSupabaseError(error)
  }
}

// Store settings operations
export const storeOperations = {
  async getSettings() {
    checkSupabaseReady()
    const { data, error } = await supabase
      .from(TABLES.STORE_SETTINGS)
      .select('*')
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      handleSupabaseError(error)
    }
    return data
  },

  async updateSettings(settings: any) {
    checkSupabaseReady()
    const { data, error } = await supabase
      .from(TABLES.STORE_SETTINGS)
      .upsert(settings)
      .select()
      .single()
    
    if (error) handleSupabaseError(error)
    return data
  }
}

// Real-time subscriptions
export const subscriptions = {
  products: (callback: (payload: any) => void) => {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('Supabase not configured - subscriptions disabled')
      return { unsubscribe: () => {} }
    }
    
    return supabase
      .channel('products-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: TABLES.PRODUCTS },
        callback
      )
      .subscribe()
  },

  transactions: (callback: (payload: any) => void) => {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('Supabase not configured - subscriptions disabled')
      return { unsubscribe: () => {} }
    }
    
    return supabase
      .channel('transactions-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: TABLES.TRANSACTIONS },
        callback
      )
      .subscribe()
  }
}