import type { Product, Category, Contact, StockLog } from '../types/inventory'
import type { Transaction } from '../types/financial'

export function generateDummyData() {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const lastWeek = new Date(now)
  lastWeek.setDate(lastWeek.getDate() - 7)
  const lastMonth = new Date(now)
  lastMonth.setMonth(lastMonth.getMonth() - 1)

  // Categories
  const categories: Category[] = [
    {
      id: '1',
      name: 'Elektronik',
      description: 'Produk elektronik dan gadget',
      icon: 'laptop',
      color: '#3b82f6',
      createdAt: lastMonth,
      updatedAt: lastMonth
    },
    {
      id: '2',
      name: 'Pakaian',
      description: 'Fashion dan pakaian',
      icon: 'shirt',
      color: '#ec4899',
      createdAt: lastMonth,
      updatedAt: lastMonth
    },
    {
      id: '3',
      name: 'Makanan',
      description: 'Makanan dan minuman',
      icon: 'utensils',
      color: '#f59e0b',
      createdAt: lastMonth,
      updatedAt: lastMonth
    },
    {
      id: '4',
      name: 'Alat Tulis',
      description: 'Perlengkapan kantor dan sekolah',
      icon: 'pen',
      color: '#10b981',
      createdAt: lastMonth,
      updatedAt: lastMonth
    }
  ]

  // Contacts
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'PT Maju Jaya',
      phone: '081234567890',
      email: 'majujaya@example.com',
      address: 'Jakarta Selatan',
      type: 'supplier',
      notes: 'Supplier elektronik terpercaya',
      createdAt: lastMonth,
      updatedAt: lastMonth
    },
    {
      id: '2',
      name: 'Budi Santoso',
      phone: '082345678901',
      email: 'budi@example.com',
      address: 'Tangerang',
      type: 'customer',
      notes: 'Pelanggan setia',
      createdAt: lastMonth,
      updatedAt: lastMonth
    },
    {
      id: '3',
      name: 'CV Fashion Store',
      phone: '083456789012',
      email: 'fashion@example.com',
      address: 'Bandung',
      type: 'supplier',
      notes: 'Supplier pakaian',
      createdAt: lastWeek,
      updatedAt: lastWeek
    },
    {
      id: '4',
      name: 'Siti Nurhaliza',
      phone: '084567890123',
      type: 'customer',
      createdAt: lastWeek,
      updatedAt: lastWeek
    }
  ]

  // Products
  const products: Product[] = [
    {
      id: '1',
      name: 'Laptop Asus ROG',
      description: 'Laptop gaming spesifikasi tinggi',
      category: 'Elektronik',
      categoryId: '1',
      stock: 5,
      price: 15000000,
      cost: 12000000,
      minStock: 2,
      barcode: '8886778901234',
      sku: 'LAP-ASUS-001',
      supplier: 'PT Maju Jaya',
      supplierId: '1',
      createdAt: lastMonth,
      updatedAt: now
    },
    {
      id: '2',
      name: 'Mouse Logitech',
      description: 'Mouse wireless gaming',
      category: 'Elektronik',
      categoryId: '1',
      stock: 15,
      price: 350000,
      cost: 250000,
      minStock: 5,
      barcode: '8886778901235',
      sku: 'MOU-LOG-001',
      supplier: 'PT Maju Jaya',
      supplierId: '1',
      createdAt: lastMonth,
      updatedAt: now
    },
    {
      id: '3',
      name: 'Kaos Polos Premium',
      description: 'Kaos cotton combed 30s',
      category: 'Pakaian',
      categoryId: '2',
      stock: 50,
      price: 75000,
      cost: 45000,
      minStock: 20,
      barcode: '8886778901236',
      sku: 'CL-KAO-001',
      supplier: 'CV Fashion Store',
      supplierId: '3',
      createdAt: lastMonth,
      updatedAt: now
    },
    {
      id: '4',
      name: 'Celana Jeans',
      description: 'Celana jeans pria slim fit',
      category: 'Pakaian',
      categoryId: '2',
      stock: 25,
      price: 250000,
      cost: 150000,
      minStock: 10,
      barcode: '8886778901237',
      sku: 'CL-JEA-001',
      supplier: 'CV Fashion Store',
      supplierId: '3',
      createdAt: lastMonth,
      updatedAt: now
    },
    {
      id: '5',
      name: 'Kopi Arabica 100g',
      description: 'Kopi arabica premium',
      category: 'Makanan',
      categoryId: '3',
      stock: 100,
      price: 50000,
      cost: 30000,
      minStock: 30,
      barcode: '8886778901238',
      sku: 'FD-KOP-001',
      createdAt: lastWeek,
      updatedAt: now
    },
    {
      id: '6',
      name: 'Buku Tulis 50 Lembar',
      description: 'Buku tulis bergaris',
      category: 'Alat Tulis',
      categoryId: '4',
      stock: 200,
      price: 5000,
      cost: 3000,
      minStock: 50,
      barcode: '8886778901239',
      sku: 'STT-BUK-001',
      createdAt: lastWeek,
      updatedAt: now
    },
    {
      id: '7',
      name: 'Pulpen Gel 0.5mm',
      description: 'Pulpen gel hitam',
      category: 'Alat Tulis',
      categoryId: '4',
      stock: 150,
      price: 3000,
      cost: 1500,
      minStock: 50,
      barcode: '8886778901240',
      sku: 'STT-PEN-001',
      createdAt: lastWeek,
      updatedAt: now
    },
    {
      id: '8',
      name: 'Keyboard Mechanical',
      description: 'Keyboard mechanical RGB',
      category: 'Elektronik',
      categoryId: '1',
      stock: 3,
      price: 850000,
      cost: 650000,
      minStock: 5,
      barcode: '8886778901241',
      sku: 'LAP-KEY-001',
      supplier: 'PT Maju Jaya',
      supplierId: '1',
      createdAt: lastWeek,
      updatedAt: now
    }
  ]

  // Stock Logs
  const stockLogs: StockLog[] = [
    {
      id: '1',
      productId: '1',
      productName: 'Laptop Asus ROG',
      jumlah: 10,
      type: 'masuk',
      reference: 'PO-001',
      supplier: 'PT Maju Jaya',
      supplierId: '1',
      notes: 'Pembelian awal stock',
      tanggal: lastMonth,
      createdAt: lastMonth
    },
    {
      id: '2',
      productId: '1',
      productName: 'Laptop Asus ROG',
      jumlah: 5,
      type: 'keluar',
      reference: 'POS-20250115-001',
      notes: 'Penjualan via POS',
      tanggal: lastWeek,
      createdAt: lastWeek
    },
    {
      id: '3',
      productId: '2',
      productName: 'Mouse Logitech',
      jumlah: 20,
      type: 'masuk',
      reference: 'PO-002',
      supplier: 'PT Maju Jaya',
      supplierId: '1',
      notes: 'Restok barang',
      tanggal: lastWeek,
      createdAt: lastWeek
    },
    {
      id: '4',
      productId: '3',
      productName: 'Kaos Polos Premium',
      jumlah: 100,
      type: 'masuk',
      reference: 'PO-003',
      supplier: 'CV Fashion Store',
      supplierId: '3',
      notes: 'Stock awal',
      tanggal: lastMonth,
      createdAt: lastMonth
    },
    {
      id: '5',
      productId: '3',
      productName: 'Kaos Polos Premium',
      jumlah: 50,
      type: 'keluar',
      reference: 'POS-20250118-002',
      notes: 'Penjualan grosir',
      tanggal: yesterday,
      createdAt: yesterday
    },
    {
      id: '6',
      productId: '8',
      productName: 'Keyboard Mechanical',
      jumlah: 2,
      type: 'keluar',
      reference: 'POS-20250119-003',
      notes: 'Penjualan retail',
      tanggal: yesterday,
      createdAt: yesterday
    }
  ]

  // Transactions
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'penjualan',
      category: 'Elektronik',
      description: 'Penjualan Laptop Asus ROG (5 unit)',
      amount: 75000000,
      date: lastWeek,
      paymentMethod: 'transfer',
      status: 'lunas',
      reference: 'POS-20250115-001',
      items: [
        {
          productId: '1',
          productName: 'Laptop Asus ROG',
          quantity: 5,
          price: 15000000
        }
      ],
      createdAt: lastWeek,
      updatedAt: lastWeek
    },
    {
      id: '2',
      type: 'pembelian',
      category: 'Elektronik',
      description: 'Pembelian stock Mouse Logitech (20 unit)',
      amount: 5000000,
      date: lastWeek,
      paymentMethod: 'transfer',
      status: 'lunas',
      reference: 'PO-002',
      contactId: '1',
      contactName: 'PT Maju Jaya',
      createdAt: lastWeek,
      updatedAt: lastWeek
    },
    {
      id: '3',
      type: 'penjualan',
      category: 'Pakaian',
      description: 'Penjualan Kaos Polos Premium grosir (50 unit)',
      amount: 3750000,
      date: yesterday,
      paymentMethod: 'cash',
      status: 'lunas',
      reference: 'POS-20250118-002',
      contactId: '2',
      contactName: 'Budi Santoso',
      createdAt: yesterday,
      updatedAt: yesterday
    },
    {
      id: '4',
      type: 'penjualan',
      category: 'Elektronik',
      description: 'Penjualan Keyboard Mechanical (2 unit)',
      amount: 1700000,
      paidAmount: 1000000,
      date: yesterday,
      paymentMethod: 'split',
      status: 'sebagian',
      reference: 'POS-20250119-003',
      contactId: '4',
      contactName: 'Siti Nurhaliza',
      createdAt: yesterday,
      updatedAt: yesterday
    },
    {
      id: '5',
      type: 'pengeluaran',
      category: 'Operasional',
      description: 'Bayar listrik toko bulan ini',
      amount: 500000,
      date: yesterday,
      paymentMethod: 'cash',
      status: 'lunas',
      reference: 'EXP-001',
      createdAt: yesterday,
      updatedAt: yesterday
    },
    {
      id: '6',
      type: 'pengeluaran',
      category: 'Gaji',
      description: 'Gaji karyawan bulan ini',
      amount: 3000000,
      date: lastWeek,
      paymentMethod: 'transfer',
      status: 'lunas',
      reference: 'EXP-002',
      createdAt: lastWeek,
      updatedAt: lastWeek
    }
  ]

  return {
    categories,
    contacts,
    products,
    stockLogs,
    transactions
  }
}
