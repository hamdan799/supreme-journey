// OriginalName: useLocalStorage
// ShortName: useLS

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { Product, Category, StockLog, Receipt, Contact } from '../types/inventory'
import type { Transaction } from '../types/financial'
import type { DamageType } from '../types/nota'

const STORAGE_KEYS = {
  PRODUCTS: 'inventory_products',
  CATEGORIES: 'inventory_categories',
  TRANSACTIONS: 'inventory_transactions',
  STOCK_LOGS: 'inventory_stock_logs',
  RECEIPTS: 'inventory_receipts',
  CONTACTS: 'inventory_contacts',
  STORE_INFO: 'inventory_store_info',
  DAMAGE_TYPES: 'inventory_damage_types'
}

const DEFAULT_STORE_INFO = {
  storeName: 'Toko Saya',
  storeAddress: '',
  storePhone: '',
  storeLogo: '',
  currency: 'IDR',
  userRole: {
    mode: 'owner' as const,
    pin: ''
  }
}

export function useLocalStorage() {
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stockLogs, setStockLogs] = useState<StockLog[]>([])
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [storeInfo, setStoreInfo] = useState(DEFAULT_STORE_INFO)
  const [damageTypes, setDamageTypes] = useState<DamageType[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const localProducts = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]')
        const localCategories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]')
        const localTransactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]')
        const localStockLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.STOCK_LOGS) || '[]')
        const localReceipts = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECEIPTS) || '[]')
        const localContacts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACTS) || '[]')
        const localStoreInfo = JSON.parse(localStorage.getItem(STORAGE_KEYS.STORE_INFO) || JSON.stringify(DEFAULT_STORE_INFO))
        const localDamageTypes = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAMAGE_TYPES) || '[]')

        console.log('📂 Loaded transactions from localStorage:', localTransactions);
        console.log('📂 Expense transactions:', localTransactions.filter((t: Transaction) => t.type === 'pengeluaran'));

        setProducts(localProducts)
        setCategories(localCategories)
        setTransactions(localTransactions)
        setStockLogs(localStockLogs)
        setReceipts(localReceipts)
        setContacts(localContacts)
        setStoreInfo({ ...DEFAULT_STORE_INFO, ...localStoreInfo })
        
        // Migrate old categories to new blueprint format
        if (localCategories.length > 0) {
          const needsMigration = localCategories.some((c: any) => 
            c.createdAt !== undefined || c.archived !== undefined
          )
          
          if (needsMigration) {
            console.log('🔄 Migrating categories to blueprint format...')
            const migratedCategories = localCategories.map((c: any) => ({
              id: c.id,
              name: c.name,
              description: c.description || '',
              is_active: c.archived === undefined ? true : !c.archived,
              created_at: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
              updated_at: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString()
            }))
            setCategories(migratedCategories)
            saveToStorage(STORAGE_KEYS.CATEGORIES, migratedCategories)
            console.log('✅ Categories migrated successfully')
          }
        }
        
        // Initialize default categories if empty
        if (localCategories.length === 0) {
          const now = new Date().toISOString()
          const defaultCategories: Category[] = [
            { id: 'cat-1', name: 'Layar / LCD', description: 'Layar dan LCD', is_active: true, created_at: now, updated_at: now },
            { id: 'cat-2', name: 'Touchscreen', description: 'Touchscreen / digitizer', is_active: true, created_at: now, updated_at: now },
            { id: 'cat-3', name: 'Flexible Power', description: 'Flexible power button', is_active: true, created_at: now, updated_at: now },
            { id: 'cat-4', name: 'Flexible Volume', description: 'Flexible volume button', is_active: true, created_at: now, updated_at: now },
            { id: 'cat-5', name: 'Baterai', description: 'Baterai HP', is_active: true, created_at: now, updated_at: now },
            { id: 'cat-6', name: 'Backdoor', description: 'Tutup belakang HP', is_active: true, created_at: now, updated_at: now },
            { id: 'cat-7', name: 'Kamera Depan', description: 'Kamera depan / selfie', is_active: true, created_at: now, updated_at: now },
            { id: 'cat-8', name: 'Kamera Belakang', description: 'Kamera belakang / rear', is_active: true, created_at: now, updated_at: now },
            { id: 'cat-9', name: 'Speaker', description: 'Speaker buzzer', is_active: true, created_at: now, updated_at: now },
            { id: 'cat-10', name: 'Mic', description: 'Microphone', is_active: true, created_at: now, updated_at: now },
            { id: 'cat-11', name: 'PCB / Board', description: 'PCB / Mainboard', is_active: true, created_at: now, updated_at: now },
            { id: 'cat-12', name: 'Charger Port', description: 'Port charging / USB', is_active: true, created_at: now, updated_at: now },
            { id: 'cat-13', name: 'Konektor Baterai', description: 'Konektor baterai', is_active: true, created_at: now, updated_at: now },
            { id: 'cat-14', name: 'IC (Umum)', description: 'IC berbagai jenis', is_active: true, created_at: now, updated_at: now },
            { id: 'cat-15', name: 'Tempat Sim', description: 'Slot SIM card', is_active: true, created_at: now, updated_at: now },
            { id: 'cat-16', name: 'Frame', description: 'Frame / rangka HP', is_active: true, created_at: now, updated_at: now },
            { id: 'cat-17', name: 'Tombol Luar', description: 'Tombol fisik luar', is_active: true, created_at: now, updated_at: now },
            { id: 'cat-18', name: 'Stiker / Perekat', description: 'Stiker & perekat', is_active: true, created_at: now, updated_at: now },
            { id: 'cat-19', name: 'Pelindung', description: 'Pelindung layar, case, dll', is_active: true, created_at: now, updated_at: now },
            { id: 'cat-20', name: 'Universal / Misc', description: 'Sparepart universal & lainnya', is_active: true, created_at: now, updated_at: now }
          ]
          setCategories(defaultCategories)
          saveToStorage(STORAGE_KEYS.CATEGORIES, defaultCategories)
          console.log('✅ Default categories initialized')
        }
        
        // Initialize default damage types if empty
        if (localDamageTypes.length === 0) {
          const defaultDamageTypes: DamageType[] = [
            { id: '1', name: 'LCD Pecah', category: 'Display', description: 'Layar LCD pecah atau retak', createdAt: new Date(), updatedAt: new Date() },
            { id: '2', name: 'Touchscreen Mati', category: 'Display', description: 'Layar sentuh tidak berfungsi', createdAt: new Date(), updatedAt: new Date() },
            { id: '3', name: 'Flexible Rusak', category: 'Hardware', description: 'Kabel flexible putus atau rusak', createdAt: new Date(), updatedAt: new Date() },
            { id: '4', name: 'Battery Soak', category: 'Battery', description: 'Baterai kembung/rusak', createdAt: new Date(), updatedAt: new Date() },
            { id: '5', name: 'Charging Port Rusak', category: 'Hardware', description: 'Port charging tidak berfungsi', createdAt: new Date(), updatedAt: new Date() },
            { id: '6', name: 'Speaker Mati', category: 'Audio', description: 'Speaker tidak mengeluarkan suara', createdAt: new Date(), updatedAt: new Date() },
            { id: '7', name: 'Mic Mati', category: 'Audio', description: 'Microphone tidak berfungsi', createdAt: new Date(), updatedAt: new Date() },
            { id: '8', name: 'Sinyal Hilang', category: 'Network', description: 'Tidak ada sinyal atau jaringan', createdAt: new Date(), updatedAt: new Date() },
            { id: '9', name: 'Bootloop', category: 'Software', description: 'HP restart terus menerus', createdAt: new Date(), updatedAt: new Date() },
            { id: '10', name: 'Lupa Pola/Pin', category: 'Software', description: 'Tidak bisa unlock HP', createdAt: new Date(), updatedAt: new Date() },
          ]
          setDamageTypes(defaultDamageTypes)
          saveToStorage(STORAGE_KEYS.DAMAGE_TYPES, defaultDamageTypes)
        } else {
          setDamageTypes(localDamageTypes)
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error)
        toast.error('Gagal memuat data')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Save to localStorage helper
  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error)
      toast.error('Gagal menyimpan data')
    }
  }

  // Product CRUD
  const createProduct = async (product: Partial<Product>) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: product.name || '',
      description: product.description,
      category: product.category || '',
      categoryId: product.categoryId,
      stock: product.stock || 0,
      price: product.price || 0,
      cost: product.cost,
      minStock: product.minStock,
      barcode: product.barcode,
      sku: product.sku,
      supplier: product.supplier,
      supplierId: product.supplierId,
      // BLUEPRINT: HP fields
      brand_hp: product.brand_hp || null,
      model_hp: product.model_hp || null,
      // BLUEPRINT: Sparepart fields
      brand_sparepart: product.brand_sparepart || null,
      sparepart_quality: product.sparepart_quality || null,
      sparepart_type: product.sparepart_type || null,
      // BLUEPRINT: Vendor tracking
      vendor_id: product.vendor_id || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const updated = [...products, newProduct]
    
    console.log('➕ BLUEPRINT Product Created:', {
      productName: newProduct.name,
      productId: newProduct.id,
      category: newProduct.category,
      stock: newProduct.stock,
      price: newProduct.price,
      cost: newProduct.cost,
      // BLUEPRINT fields
      brand_hp: newProduct.brand_hp,
      model_hp: newProduct.model_hp,
      brand_sparepart: newProduct.brand_sparepart,
      sparepart_quality: newProduct.sparepart_quality,
      sparepart_type: newProduct.sparepart_type,
      vendor_id: newProduct.vendor_id,
      oldLength: products.length,
      newLength: updated.length
    })
    
    setProducts(updated)
    saveToStorage(STORAGE_KEYS.PRODUCTS, updated)
    toast.success('Produk berhasil ditambahkan')
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const oldProduct = products.find(p => p.id === id)
    const updated = products.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    )
    
    console.log('🔄 Product Updated:', {
      productId: id,
      productName: oldProduct?.name,
      updates,
      oldStock: oldProduct?.stock,
      newStock: updates.stock,
      oldLength: products.length,
      newLength: updated.length,
      arrayReference: updated !== products ? 'NEW' : 'SAME'
    })
    
    setProducts(updated)
    saveToStorage(STORAGE_KEYS.PRODUCTS, updated)
    toast.success('Produk berhasil diperbarui')
  }

  const deleteProduct = async (id: string) => {
    const product = products.find(p => p.id === id)
    const updated = products.filter(p => p.id !== id)
    setProducts(updated)
    saveToStorage(STORAGE_KEYS.PRODUCTS, updated)
    
    // Save to delete history
    if (product) {
      const currentUser = JSON.parse(localStorage.getItem('inventory_currentUser') || '{}')
      const deleteHistory = JSON.parse(localStorage.getItem('delete_history') || '[]')
      deleteHistory.push({
        id: `${id}_${Date.now()}`,
        type: 'product',
        name: product.name,
        deletedAt: new Date(),
        deletedBy: currentUser.name || 'User',
        data: product
      })
      localStorage.setItem('delete_history', JSON.stringify(deleteHistory))
    }
    
    toast.success('Produk berhasil dihapus')
  }

  // Category CRUD
  const createCategory = async (category: Partial<Category>) => {
    const now = new Date().toISOString()
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: category.name || '',
      description: category.description || '',
      is_active: category.is_active !== false,
      created_at: now,
      updated_at: now
    }

    const updated = [...categories, newCategory]
    setCategories(updated)
    saveToStorage(STORAGE_KEYS.CATEGORIES, updated)
    toast.success('Kategori berhasil ditambahkan')
  }

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const updated = categories.map(c => 
      c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
    )
    setCategories(updated)
    saveToStorage(STORAGE_KEYS.CATEGORIES, updated)
    toast.success('Kategori berhasil diperbarui')
  }

  const deleteCategory = async (id: string) => {
    const category = categories.find(c => c.id === id)
    const updated = categories.filter(c => c.id !== id)
    setCategories(updated)
    saveToStorage(STORAGE_KEYS.CATEGORIES, updated)
    
    // Save to delete history
    if (category) {
      const currentUser = JSON.parse(localStorage.getItem('inventory_currentUser') || '{}')
      const deleteHistory = JSON.parse(localStorage.getItem('delete_history') || '[]')
      deleteHistory.push({
        id: `${id}_${Date.now()}`,
        type: 'category',
        name: category.name,
        deletedAt: new Date(),
        deletedBy: currentUser.name || 'User',
        data: category
      })
      localStorage.setItem('delete_history', JSON.stringify(deleteHistory))
    }
    
    toast.success('Kategori berhasil dihapus')
  }

  // Transaction CRUD
  const createTransaction = async (transaction: Partial<Transaction>) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      transactionNumber: `TRX-${Date.now()}`,
      type: transaction.type || 'pemasukan',
      nominal: transaction.nominal || 0,
      totalCost: transaction.totalCost || 0, // 🔥 FIX: Add totalCost field
      items: transaction.items,
      catatan: transaction.catatan,
      kategori: transaction.kategori,
      tanggal: transaction.tanggal || new Date(),
      customerName: transaction.customerName,
      customerPhone: transaction.customerPhone,
      customerId: transaction.customerId,
      paymentStatus: transaction.paymentStatus || 'lunas',
      paidAmount: transaction.paidAmount,
      createdAt: new Date()
    }

    console.log('💾 Creating transaction:', newTransaction);
    console.log('💾 Transaction type:', newTransaction.type);

    const updated = [...transactions, newTransaction]
    setTransactions(updated)
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, updated)
    
    console.log('💾 Updated transactions array:', updated);
    console.log('💾 Saved to localStorage:', STORAGE_KEYS.TRANSACTIONS);
    
    toast.success('Transaksi berhasil ditambahkan')
  }

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    const updated = transactions.map(t => 
      t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
    )
    setTransactions(updated)
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, updated)
    toast.success('Transaksi berhasil diperbarui')
  }

  const deleteTransaction = async (id: string) => {
    const transaction = transactions.find(t => t.id === id)
    const updated = transactions.filter(t => t.id !== id)
    setTransactions(updated)
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, updated)
    
    // Save to delete history
    if (transaction) {
      const currentUser = JSON.parse(localStorage.getItem('inventory_currentUser') || '{}')
      const deleteHistory = JSON.parse(localStorage.getItem('delete_history') || '[]')
      deleteHistory.push({
        id: `${id}_${Date.now()}`,
        type: 'transaction',
        name: transaction.transactionNumber || `Transaksi ${transaction.type}`,
        deletedAt: new Date(),
        deletedBy: currentUser.name || 'User',
        data: transaction
      })
      localStorage.setItem('delete_history', JSON.stringify(deleteHistory))
    }
    
    toast.success('Transaksi berhasil dihapus')
  }

  // Stock Log CRUD
  const createStockLog = async (log: Partial<StockLog>) => {
    const newLog: StockLog = {
      id: Date.now().toString(),
      productId: log.productId || '',
      productName: log.productName || '',
      jumlah: log.jumlah || 0,
      type: log.type || 'masuk',
      reference: log.reference || '',
      supplier: log.supplier,
      keterangan: log.keterangan,
      tanggal: log.tanggal || new Date(),
      createdAt: new Date()
    }

    const updated = [...stockLogs, newLog]
    setStockLogs(updated)
    saveToStorage(STORAGE_KEYS.STOCK_LOGS, updated)
  }

  const updateStockLog = async (id: string, updates: Partial<StockLog>) => {
    const updated = stockLogs.map(log =>
      log.id === id ? { ...log, ...updates } : log
    )
    setStockLogs(updated)
    saveToStorage(STORAGE_KEYS.STOCK_LOGS, updated)
    toast.success('Stock log berhasil diperbarui')
  }

  const deleteStockLog = async (id: string) => {
    const updated = stockLogs.filter(log => log.id !== id)
    setStockLogs(updated)
    saveToStorage(STORAGE_KEYS.STOCK_LOGS, updated)
  }

  // Receipt CRUD
  const createReceipt = async (receipt: Partial<Receipt>) => {
    const newReceipt: Receipt = {
      id: Date.now().toString(),
      productId: receipt.productId,
      productName: receipt.productName,
      jumlah: receipt.jumlah,
      harga: receipt.harga,
      total: receipt.total,
      tanggal: receipt.tanggal || new Date(),
      createdAt: new Date()
    }

    const updated = [...receipts, newReceipt]
    setReceipts(updated)
    saveToStorage(STORAGE_KEYS.RECEIPTS, updated)
  }

  const deleteReceipt = async (id: string) => {
    const updated = receipts.filter(r => r.id !== id)
    setReceipts(updated)
    saveToStorage(STORAGE_KEYS.RECEIPTS, updated)
  }

  // Contact CRUD
  const createContact = async (contact: Partial<Contact>) => {
    // Check for duplicate phone number
    if (contact.phone) {
      const existingContact = contacts.find(c => c.phone === contact.phone)
      if (existingContact) {
        toast.error(`Kontak dengan nomor ${contact.phone} sudah ada`)
        return
      }
    }

    const newContact: Contact = {
      id: Date.now().toString(),
      name: contact.name || '',
      phone: contact.phone,
      email: contact.email,
      address: contact.address,
      type: contact.type || 'customer',
      notes: contact.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const updated = [...contacts, newContact]
    setContacts(updated)
    saveToStorage(STORAGE_KEYS.CONTACTS, updated)
    toast.success('Kontak berhasil ditambahkan')
  }

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    const updated = contacts.map(c => 
      c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
    )
    setContacts(updated)
    saveToStorage(STORAGE_KEYS.CONTACTS, updated)
    toast.success('Kontak berhasil diperbarui')
  }

  const deleteContact = async (id: string) => {
    const updated = contacts.filter(c => c.id !== id)
    setContacts(updated)
    saveToStorage(STORAGE_KEYS.CONTACTS, updated)
    toast.success('Kontak berhasil dihapus')
  }

  // Store Info
  const updateStoreInfo = async (updates: Partial<typeof storeInfo>) => {
    const updated = { ...storeInfo, ...updates }
    setStoreInfo(updated)
    saveToStorage(STORAGE_KEYS.STORE_INFO, updated)
    toast.success('Informasi toko berhasil diperbarui')
  }

  // Damage Types CRUD
  const createDamageType = async (damageType: Partial<DamageType>) => {
    // Check for duplicate name
    if (damageType.name) {
      const existingDamage = damageTypes.find(d => 
        d.name.toLowerCase() === damageType.name!.toLowerCase()
      )
      if (existingDamage) {
        toast.error(`Jenis kerusakan "${damageType.name}" sudah ada`)
        return
      }
    }

    const newDamageType: DamageType = {
      id: Date.now().toString(),
      name: damageType.name || '',
      description: damageType.description,
      category: damageType.category,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const updated = [...damageTypes, newDamageType]
    setDamageTypes(updated)
    saveToStorage(STORAGE_KEYS.DAMAGE_TYPES, updated)
    toast.success('Jenis kerusakan berhasil ditambahkan')
  }

  const updateDamageType = async (id: string, updates: Partial<DamageType>) => {
    const updated = damageTypes.map(d => 
      d.id === id ? { ...d, ...updates, updatedAt: new Date() } : d
    )
    setDamageTypes(updated)
    saveToStorage(STORAGE_KEYS.DAMAGE_TYPES, updated)
    toast.success('Jenis kerusakan berhasil diperbarui')
  }

  const deleteDamageType = async (id: string) => {
    const updated = damageTypes.filter(d => d.id !== id)
    setDamageTypes(updated)
    saveToStorage(STORAGE_KEYS.DAMAGE_TYPES, updated)
    toast.success('Jenis kerusakan berhasil dihapus')
  }

  return {
    // Data
    products,
    categories,
    transactions,
    stockLogs,
    receipts,
    contacts,
    storeInfo,
    damageTypes,
    
    // State
    isLoading,
    isConnected: true, // Always connected in localStorage mode
    
    // Product methods
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Category methods
    createCategory,
    updateCategory,
    deleteCategory,
    
    // Transaction methods
    createTransaction,
    updateTransaction,
    deleteTransaction,
    
    // Stock log methods
    createStockLog,
    updateStockLog,
    deleteStockLog,
    
    // Receipt methods
    createReceipt,
    deleteReceipt,
    
    // Contact methods
    createContact,
    updateContact,
    deleteContact,
    
    // Store info methods
    updateStoreInfo,
    
    // Damage types methods
    createDamageType,
    updateDamageType,
    deleteDamageType
  }
}