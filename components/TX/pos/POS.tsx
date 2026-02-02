// ==========================================
// POS.tsx — UI ORCHESTRATOR (BATCH TRANSACTION)
// ==========================================
// 🎯 REFACTORED - UI Components Separated
// POS = Orchestrator untuk transaksi batch
// TIDAK menghitung profit/hutang/stok sendiri
// SEMUA logic lewat hooks yang sudah ada
// UI components: ProductPanel, CartPanel, PaymentDialog
// ==========================================

import { useState } from 'react'
import { toast } from 'sonner'
import { ConfirmDialog } from '../../ui/confirm-dialog'

// Import UI components
import { POSProductPanel } from './POSProductPanel'
import { POSCartPanel } from './POSCartPanel'
import { POSPaymentDialog } from './POSPaymentDialog'

// Import types dari single source of truth
import type { Product, Contact } from '../../../types/inventory'
import type { Transaction, TransactionItem } from '../../../types/financial'

// ==========================================
// TYPE DEFINITIONS (MINIMAL UI STATE)
// ==========================================

type PaymentStatus = 'lunas' | 'hutang' | 'sebagian'
type PaymentMethod = 'cash' | 'transfer' | 'split'

interface CartItem {
  productId: string
  quantity: number
}

interface Cart {
  id: string
  name: string
  items: CartItem[]
}

// ==========================================
// PROPS
// ==========================================

interface POSProps {
  products: Product[]
  contacts: Contact[]
  onTransactionCreate: (transaction: Partial<Transaction>) => void
  onProductUpdate: (id: string, updates: Partial<Product>) => void
  onStockLogCreate: (log: any) => void
  storeInfo: {
    storeName: string
    currency?: string
  }
}

// ==========================================
// COMPONENT
// ==========================================

export function POS({
  products,
  contacts,
  onTransactionCreate,
  onProductUpdate,
  onStockLogCreate,
}: POSProps) {
  // ==========================================
  // STATE MANAGEMENT (UI ONLY)
  // ==========================================

  // Cart state (minimal: hanya productId + qty)
  const [carts, setCarts] = useState<Cart[]>([
    { id: '1', name: 'Cart #1', items: [] }
  ])
  const [activeCartId, setActiveCartId] = useState('1')

  // Search state
  const [barcode, setBarcode] = useState('')

  // Pricing state
  const [discount, setDiscount] = useState<number | ''>('')
  const [premi, setPremi] = useState<number | ''>('')

  // Customer state
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('lunas')
  const [paidAmountPartial, setPaidAmountPartial] = useState<number | ''>(0)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [cashAmount, setCashAmount] = useState<number | ''>(0)
  const [transferAmount, setTransferAmount] = useState<number | ''>(0)

  // UI state
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showPopularItems, setShowPopularItems] = useState(true)
  const [showRecentItems, setShowRecentItems] = useState(true)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Recent products state
  const [recentProducts, setRecentProducts] = useState<string[]>([])

  // ==========================================
  // DERIVED STATE
  // ==========================================

  const activeCart = carts.find(c => c.id === activeCartId) || carts[0]

  // Calculate totals (QUERY products on-the-fly untuk data terbaru)
  const cartItemsWithData = activeCart.items.map(ci => {
    const product = products.find(p => p.id === ci.productId)
    return product ? { ...ci, product } : null
  }).filter(Boolean) as Array<CartItem & { product: Product }>

  const subtotal = cartItemsWithData.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  )

  const discountAmount = discount === '' ? 0 : discount
  const premiAmount = premi === '' ? 0 : premi
  const total = subtotal - discountAmount + premiAmount

  // Popular products (top 6 with stock)
  const popularProducts = products
    .filter(p => p.stock > 0)
    .slice(0, 6)

  // Recent products (from recent IDs)
  const recentlyUsedProducts = products
    .filter(p => recentProducts.includes(p.id) && p.stock > 0)
    .slice(0, 6)

  // Customer contacts
  const customerContacts = contacts.filter(c => c.type === 'customer' || c.type === 'both')

  // ==========================================
  // HELPER FUNCTIONS (PURE, SIMPLE)
  // ==========================================

  const fmtCurr = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const searchProduct = (query: string): Product | undefined => {
    if (!query.trim()) return undefined
    const search = query.toLowerCase().trim()
    return products.find(p =>
      p.barcode === search ||
      p.sku === search ||
      p.name.toLowerCase().includes(search)
    )
  }

  const addToRecent = (productId: string) => {
    if (!recentProducts.includes(productId)) {
      setRecentProducts([productId, ...recentProducts.slice(0, 9)])
    }
  }

  // ==========================================
  // CART OPERATIONS
  // ==========================================

  const handleBarcodeSearch = () => {
    const product = searchProduct(barcode)

    if (product) {
      addToCart(product)
      setBarcode('')
      toast.success(`${product.name} ditambahkan`)
    } else {
      toast.error('Produk tidak ditemukan')
    }
  }

  const addToCart = (product: Product) => {
    const existingItem = activeCart.items.find(i => i.productId === product.id)
    const currentQty = existingItem?.quantity || 0

    // Validation
    if (product.stock <= 0) {
      toast.error('Stok habis')
      return
    }

    if (currentQty >= product.stock) {
      toast.error('Stok tidak cukup')
      return
    }

    // Update cart
    setCarts(carts.map(cart => {
      if (cart.id !== activeCartId) return cart

      if (existingItem) {
        return {
          ...cart,
          items: cart.items.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      } else {
        return {
          ...cart,
          items: [...cart.items, { productId: product.id, quantity: 1 }]
        }
      }
    }))

    // Add to recent
    addToRecent(product.id)
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    const product = products.find(p => p.id === productId)

    if (!product) return

    if (newQuantity > product.stock) {
      toast.error('Stok tidak cukup')
      return
    }

    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCarts(carts.map(cart =>
      cart.id === activeCartId
        ? {
            ...cart,
            items: cart.items.map(item =>
              item.productId === productId
                ? { ...item, quantity: newQuantity }
                : item
            )
          }
        : cart
    ))
  }

  const removeFromCart = (productId: string) => {
    setCarts(carts.map(cart =>
      cart.id === activeCartId
        ? { ...cart, items: cart.items.filter(item => item.productId !== productId) }
        : cart
    ))
  }

  const clearCart = () => {
    setShowClearConfirm(true)
  }

  const confirmClearCart = () => {
    setCarts(carts.map(cart =>
      cart.id === activeCartId
        ? { ...cart, items: [] }
        : cart
    ))
    setDiscount('')
    setPremi('')
    setCustomerName('')
    setCustomerPhone('')
    setShowClearConfirm(false)
    toast.success('Keranjang dikosongkan')
  }

  const holdCart = () => {
    const newCartId = Date.now().toString()
    const newCart: Cart = {
      id: newCartId,
      name: `Cart #${carts.length + 1}`,
      items: []
    }
    setCarts([...carts, newCart])
    setActiveCartId(newCartId)
    toast.success('Keranjang disimpan, keranjang baru dibuat')
  }

  // ==========================================
  // CHECKOUT FLOW
  // ==========================================

  const handleCheckout = () => {
    if (activeCart.items.length === 0) {
      toast.error('Keranjang masih kosong')
      return
    }

    setShowPaymentDialog(true)
  }

  const processPayment = async () => {
    // Validasi payment
    if (paymentStatus !== 'lunas' && !selectedContact) {
      toast.error('Pilih customer/supplier untuk pembayaran hutang')
      return
    }

    if (paymentStatus === 'sebagian') {
      const paidNum = paidAmountPartial === '' ? 0 : paidAmountPartial
      if (paidNum <= 0 || paidNum >= total) {
        toast.error('Jumlah pembayaran sebagian tidak valid')
        return
      }
    }

    if (paymentStatus === 'lunas' && paymentMethod === 'split') {
      const cashNum = cashAmount === '' ? 0 : cashAmount
      const transferNum = transferAmount === '' ? 0 : transferAmount
      const totalPaid = cashNum + transferNum
      if (totalPaid < total) {
        toast.error('Jumlah pembayaran kurang')
        return
      }
    }

    // Build transaction items (snapshot data saat transaksi)
    const transactionItems: TransactionItem[] = cartItemsWithData.map(item => {
      const product = item.product
      return {
        id: crypto.randomUUID(),
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        unitCost: product.cost || 0,
        total: product.price * item.quantity,
        category: product.category,
        brand_hp: product.brand_hp || product.helper_brand_hp,
        model_hp: product.model_hp || product.helper_model_text,
        sparepart_brand: product.brand_sparepart,
        vendor_name: product.vendor_id,
      }
    })

    // Calculate total cost
    const totalCost = transactionItems.reduce((sum, item) => 
      sum + (item.unitCost * item.quantity), 0
    )

    // Calculate paid amount
    let paidAmount = 0
    if (paymentStatus === 'lunas') {
      if (paymentMethod === 'cash' || paymentMethod === 'transfer') {
        paidAmount = total
      } else if (paymentMethod === 'split') {
        paidAmount = (cashAmount === '' ? 0 : cashAmount) + (transferAmount === '' ? 0 : transferAmount)
      }
    } else if (paymentStatus === 'sebagian') {
      paidAmount = paidAmountPartial === '' ? 0 : paidAmountPartial
    } else {
      // hutang
      paidAmount = 0
    }

    // Build payment notes
    let methodLabel = ''
    switch (paymentMethod) {
      case 'cash':
        methodLabel = 'Tunai'
        break
      case 'transfer':
        methodLabel = 'Transfer'
        break
      case 'split':
        methodLabel = 'Split Payment'
        break
    }

    let statusLabel = ''
    if (paymentStatus !== 'lunas') {
      statusLabel = paymentStatus === 'hutang' ? ' - Status: Belum Lunas' : ' - Status: Dibayar Sebagian'
    }

    const catatan = `Pembayaran: ${methodLabel}${statusLabel}`

    // Build transaction (MINIMAL PAYLOAD)
    const transaction: Partial<Transaction> = {
      type: 'pemasukan',
      nominal: total,
      totalCost: totalCost,
      items: transactionItems,
      customerName: selectedContact?.name || customerName || undefined,
      customerPhone: selectedContact?.phone || customerPhone || undefined,
      customerId: selectedContact?.id,
      paymentStatus: paymentStatus,
      paidAmount: paidAmount,
      tanggal: new Date(),
      catatan: catatan,
    }

    console.log('💰 POS Transaction:', transaction)

    // Submit via hook (SINGLE SOURCE OF TRUTH)
    try {
      onTransactionCreate(transaction)

      // Update stock & create stock logs (via hooks)
      activeCart.items.forEach(item => {
        const product = products.find(p => p.id === item.productId)
        if (product) {
          // Update product stock
          onProductUpdate(product.id, {
            stock: product.stock - item.quantity
          })

          // Create stock log
          onStockLogCreate({
            productId: product.id,
            productName: product.name,
            jumlah: item.quantity,
            type: 'keluar',
            reference: 'POS Sale',
            tanggal: new Date()
          })
        }
      })

      // Success! Clear cart and reset state
      setCarts(carts.map(cart =>
        cart.id === activeCartId
          ? { ...cart, items: [] }
          : cart
      ))
      setDiscount('')
      setPremi('')
      setCustomerName('')
      setCustomerPhone('')
      setSelectedContact(null)
      setCashAmount(0)
      setTransferAmount(0)
      setPaidAmountPartial(0)
      setPaymentStatus('lunas')
      setPaymentMethod('cash')
      setShowPaymentDialog(false)

      // Show success messages
      let mainMessage = 'Transaksi berhasil!'
      if (paymentStatus !== 'lunas') {
        const remainingDebt = total - paidAmount
        mainMessage += ` Sisa hutang: ${fmtCurr(remainingDebt)}`
      }
      toast.success(mainMessage)

      // Show change message
      if (paymentStatus === 'lunas' && methodLabel === 'Tunai') {
        const changeAmount = paidAmount - total
        if (changeAmount > 0) {
          setTimeout(() => {
            toast.success(`Kembalian: ${fmtCurr(changeAmount)}`)
          }, 500)
        }
      }

    } catch (error) {
      console.error('❌ POS Transaction Error:', error)
      toast.error('Transaksi gagal')
    }
  }

  // ==========================================
  // CONTACT SELECTION HELPER
  // ==========================================

  const handleContactSelect = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId)
    if (contact) {
      setSelectedContact(contact)
      setCustomerName(contact.name)
      setCustomerPhone(contact.phone || '')
    }
  }

  const handlePaymentContactChange = (contact: Contact | null) => {
    setSelectedContact(contact)
    if (contact) {
      setCustomerName(contact.name)
      setCustomerPhone(contact.phone || '')
    }
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Point of Sale</h1>
        <p className="text-muted-foreground">Kasir dan transaksi penjualan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Products */}
        <div className="lg:col-span-2">
          <POSProductPanel
            barcode={barcode}
            onBarcodeChange={setBarcode}
            onBarcodeSearch={handleBarcodeSearch}
            popularProducts={popularProducts}
            recentProducts={recentlyUsedProducts}
            onProductClick={addToCart}
            showPopular={showPopularItems}
            onShowPopularChange={setShowPopularItems}
            showRecent={showRecentItems}
            onShowRecentChange={setShowRecentItems}
            formatCurrency={fmtCurr}
          />
        </div>

        {/* Right Panel - Cart */}
        <div className="lg:col-span-1">
          <POSCartPanel
            carts={carts}
            activeCartId={activeCartId}
            onActiveCartChange={setActiveCartId}
            cartItems={cartItemsWithData}
            subtotal={subtotal}
            discount={discount}
            onDiscountChange={setDiscount}
            premi={premi}
            onPremiChange={setPremi}
            total={total}
            customerName={customerName}
            onCustomerNameChange={setCustomerName}
            customerPhone={customerPhone}
            onCustomerPhoneChange={setCustomerPhone}
            customerContacts={customerContacts}
            onContactSelect={handleContactSelect}
            onQuantityUpdate={updateQuantity}
            onRemoveItem={removeFromCart}
            onHold={holdCart}
            onClear={clearCart}
            onCheckout={handleCheckout}
            formatCurrency={fmtCurr}
          />
        </div>
      </div>

      {/* Payment Dialog */}
      <POSPaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        total={total}
        paymentStatus={paymentStatus}
        onPaymentStatusChange={setPaymentStatus}
        selectedContact={selectedContact}
        onContactChange={handlePaymentContactChange}
        customerContacts={customerContacts}
        paidAmountPartial={paidAmountPartial}
        onPaidAmountPartialChange={setPaidAmountPartial}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        cashAmount={cashAmount}
        onCashAmountChange={setCashAmount}
        transferAmount={transferAmount}
        onTransferAmountChange={setTransferAmount}
        onProcess={processPayment}
        formatCurrency={fmtCurr}
      />

      {/* Clear Confirm Dialog */}
      <ConfirmDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        onConfirm={confirmClearCart}
        title="Kosongkan Keranjang"
        description="Semua item di keranjang akan dihapus. Apakah Anda yakin?"
      />
    </div>
  )
}
