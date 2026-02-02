// OriginalName: SaleTab
// ShortName: SaleTab

import { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Calculator, Save, ChevronRight } from 'lucide-react';
import { CalcWidget } from './CalcWidget';
import { ProdPicker } from './ProdPicker';
import { CartView } from './CartView';
import { CustInfo } from './CustInfo';
import { toast } from 'sonner';
import type { Product, Category } from '../../types/inventory';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  cost: number;
  quantity: number;
  stock: number;
}

interface SaleTabProps {
  products: Product[];
  categories: Category[];
  contacts?: any[];
  onTransactionCreate: (transaction: any) => void;
  onProductUpdate?: (product: Product) => void;
  onStockLogCreate?: (log: any) => void;
  onContactCreate?: (contact: any) => Promise<void>;
  onCategoryCreate?: (category: any) => Promise<void>;
  onProductCreate?: (product: any) => Promise<void>;
  formatCurrency: (amount: number) => string;
  onClose?: () => void;
}

export function SaleTab({
  products,
  categories,
  contacts = [],
  onTransactionCreate,
  onProductUpdate,
  onStockLogCreate,
  onContactCreate,
  onCategoryCreate,
  onProductCreate,
  formatCurrency,
  onClose,
}: SaleTabProps) {
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalSale, setTotalSale] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [paymentStatus, setPaymentStatus] = useState<'lunas' | 'hutang'>('lunas');
  const [description, setDescription] = useState('');

  // Calculate totals from cart
  const calculatedTotals = useMemo(() => {
    const sale = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cost = cartItems.reduce((sum, item) => sum + item.cost * item.quantity, 0);
    return { sale, cost };
  }, [cartItems]);

  // Auto-update totals when cart changes
  useMemo(() => {
    if (cartItems.length > 0) {
      setTotalSale(calculatedTotals.sale.toString());
      setTotalCost(calculatedTotals.cost.toString());
    }
  }, [calculatedTotals, cartItems.length]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error('Stok habis');
      return;
    }

    const existingItem = cartItems.find((item) => item.productId === product.id);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error('Stok tidak cukup');
        return;
      }
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        cost: product.cost || 0,
        quantity: 1,
        stock: product.stock,
      };
      setCartItems([...cartItems, newItem]);
      toast.success(`${product.name} ditambahkan`);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const item = cartItems.find((i) => i.productId === productId);
    if (item && newQuantity > item.stock) {
      toast.error('Stok tidak cukup');
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter((item) => item.productId !== productId));
  };

  const handleCalculatorInput = (value: string) => {
    if (value === 'C') {
      setCalcDisplay('0');
    } else if (value === '←') {
      setCalcDisplay(calcDisplay.length > 1 ? calcDisplay.slice(0, -1) : '0');
    } else if (value === '=') {
      try {
        const result = eval(calcDisplay);
        setCalcDisplay(result.toString());
        setTotalSale(result.toString());
        setShowCalculator(false);
      } catch {
        toast.error('Perhitungan tidak valid');
      }
    } else {
      setCalcDisplay(calcDisplay === '0' ? value : calcDisplay + value);
    }
  };

  const handleSaveContact = async () => {
    if (!customerName.trim()) {
      toast.error('Masukkan nama pelanggan');
      return;
    }

    // Check for duplicate contacts by phone or name
    const existingContact = contacts.find(
      c =>
        (customerPhone && c.phone === customerPhone) ||
        (c.name.toLowerCase() === customerName.trim().toLowerCase())
    );

    if (existingContact) {
      toast.warning('Kontak sudah tersimpan');
      return;
    }

    if (onContactCreate) {
      await onContactCreate({
        name: customerName,
        phone: customerPhone,
        type: 'customer',
      });
      toast.success('Kontak pelanggan tersimpan');
    }
  };

  const handleSaveTransaction = async () => {
    if (!totalSale || Number(totalSale) <= 0) {
      toast.error('Masukkan total penjualan');
      return;
    }

    const total = Number(totalSale);
    const cost = totalCost ? Number(totalCost) : 0;

    const transaction = {
      type: 'pemasukan' as const,
      nominal: total,
      totalCost: cost,
      items:
        cartItems.length > 0
          ? cartItems.map((item) => {
              const product = products.find(p => p.id === item.productId)
              return {
                id: crypto.randomUUID(), // Unique ID for each item
                productId: item.productId,
                productName: item.name,
                quantity: item.quantity,
                unitPrice: item.price,        // ✅ Snapshot harga jual
                unitCost: item.cost || 0,     // ✅ Snapshot modal (WAJIB) - DO NOT FETCH FROM PRODUCTS TABLE
                total: item.price * item.quantity,
                // Optional metadata for reporting
                category: product?.category,
                brand_hp: product?.brand_hp,
                model_hp: product?.model_hp,
                sparepart_brand: product?.brand_sparepart,
                vendor_name: product?.vendor_id
              }
            })
          : undefined,
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
      paymentStatus,
      paidAmount: paymentStatus === 'lunas' ? total : 0,
      tanggal: new Date(transactionDate),
      catatan: description || undefined,
    };

    onTransactionCreate(transaction);

    // Update stock if products were selected
    if (onProductUpdate && onStockLogCreate) {
      cartItems.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          onProductUpdate({
            ...product,
            stock: product.stock - item.quantity,
          });

          onStockLogCreate({
            productId: product.id,
            productName: product.name,
            jumlah: item.quantity,
            type: 'keluar',
            reference: 'Sale Transaction',
            tanggal: new Date(transactionDate),
          });
        }
      });
    }

    // Create contact if new (auto-save when transaction is saved)
    if (customerName && onContactCreate) {
      // Check for duplicate before saving
      const existingContact = contacts.find(
        c =>
          (customerPhone && c.phone === customerPhone) ||
          (c.name.toLowerCase() === customerName.trim().toLowerCase())
      );

      if (!existingContact) {
        await onContactCreate({
          name: customerName,
          phone: customerPhone,
          type: 'customer',
        });
      }
    }

    toast.success('Transaksi penjualan berhasil disimpan');
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Step 1: Detail Transaksi */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3>Step 1: Detail Transaksi</h3>
          <Badge variant={totalSale ? 'default' : 'secondary'}>
            {totalSale ? formatCurrency(Number(totalSale)) : 'Belum diisi'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Total Penjualan *</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={totalSale}
                onChange={(e) => setTotalSale(e.target.value)}
                placeholder="0"
                className="text-lg"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowCalculator(!showCalculator)}
              >
                <Calculator className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Total Modal (opsional)</Label>
            <Input
              type="number"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              placeholder="0"
              className="text-lg"
            />
          </div>
        </div>

        <CalcWidget
          open={showCalculator}
          display={calcDisplay}
          onInput={handleCalculatorInput}
        />

        {totalSale && Number(totalSale) > 0 && (
          <Button className="w-full" onClick={() => setStep(2)}>
            Lanjut ke Pilih Produk
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Step 2: Pilih Produk */}
      {step >= 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3>Step 2: Pilih Produk (Opsional)</h3>
            <Badge variant={cartItems.length > 0 ? 'default' : 'secondary'}>
              {cartItems.length} produk
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Product Selection */}
            <ProdPicker
              products={products}
              categories={categories}
              cartItems={cartItems}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onSearchChange={setSearchQuery}
              onCategoryChange={setSelectedCategory}
              onAddToCart={addToCart}
              onUpdateQuantity={updateQuantity}
              formatCurrency={formatCurrency}
              onCategoryCreate={onCategoryCreate}
              onProductCreate={onProductCreate}
            />

            {/* Right: Cart */}
            <div className="space-y-4">
              <Label>Keranjang ({cartItems.length})</Label>
              <div className="space-y-2 max-h-[380px] overflow-y-auto border rounded-lg p-3 bg-muted/30">
                <CartView
                  items={cartItems}
                  onRemove={removeFromCart}
                  formatCurrency={formatCurrency}
                />
              </div>
            </div>
          </div>

          <Button className="w-full" onClick={() => setStep(3)}>
            Lanjut ke Info Pelanggan
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step 3: Pelanggan & Pembayaran */}
      {step >= 3 && (
        <div className="space-y-4">
          <h3>Step 3: Pelanggan & Pembayaran</h3>

          <CustInfo
            customerName={customerName}
            customerPhone={customerPhone}
            transactionDate={transactionDate}
            paymentStatus={paymentStatus}
            description={description}
            contacts={contacts}
            onCustomerNameChange={setCustomerName}
            onCustomerPhoneChange={setCustomerPhone}
            onTransactionDateChange={setTransactionDate}
            onPaymentStatusChange={setPaymentStatus}
            onDescriptionChange={setDescription}
            onSaveContact={handleSaveContact}
          />
        </div>
      )}

      {/* Action Buttons - Always visible */}
      <div className="flex justify-end gap-2 pt-4 border-t mt-6">
        <Button 
          variant="outline" 
          onClick={() => {
            // Save draft to localStorage
            const draft = {
              cartItems,
              totalSale,
              totalCost,
              customerName,
              customerPhone,
              transactionDate,
              paymentStatus,
              description,
              step,
            };
            localStorage.setItem('sale_transaction_draft', JSON.stringify(draft));
            toast.success('Draft disimpan');
          }}
        >
          Draft
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            // Reset form
            setStep(1);
            setCartItems([]);
            setTotalSale('');
            setTotalCost('');
            setSearchQuery('');
            setSelectedCategory('all');
            setCustomerName('');
            setCustomerPhone('');
            setTransactionDate(new Date().toISOString().split('T')[0]);
            setPaymentStatus('lunas');
            setDescription('');
            toast.info('Form dibatalkan');
            // Close dialog
            if (onClose) {
              onClose();
            }
          }}
        >
          Batal
        </Button>
        <Button 
          onClick={handleSaveTransaction}
          disabled={!totalSale || Number(totalSale) <= 0}
        >
          <Save className="w-4 h-4 mr-2" />
          Simpan
        </Button>
      </div>
    </div>
  );
}