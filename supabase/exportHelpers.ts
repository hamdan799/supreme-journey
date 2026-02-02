/**
 * Export helpers for reports (CSV, Excel-compatible CSV, PDF via print)
 */

export const exportToCSV = (data: any[], filename: string, headers?: string[]) => {
  if (data.length === 0) {
    alert('Tidak ada data untuk diekspor')
    return
  }

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0])
  
  // Create CSV content
  const csvRows = [
    csvHeaders.join(','), // Header row
    ...data.map(row => 
      csvHeaders.map(header => {
        const value = row[header]
        // Handle values with commas, quotes, or newlines
        if (value === null || value === undefined) return ''
        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      }).join(',')
    )
  ].join('\n')

  // Add BOM for Excel UTF-8 support
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvRows], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  
  URL.revokeObjectURL(url)
}

export const exportStockReport = (stockLogs: any[], products: any[]) => {
  const data = stockLogs.map(log => {
    const product = products.find(p => p.id === log.productId)
    return {
      'Tanggal': new Date(log.tanggal).toLocaleDateString('id-ID'),
      'Produk': log.productName,
      'Kategori': product?.category || '-',
      'Tipe': log.type === 'masuk' ? 'Masuk' : 'Keluar',
      'Jumlah': log.jumlah,
      'Referensi': log.reference || '-',
      'Supplier': product?.supplier || '-'
    }
  })

  exportToCSV(data, 'laporan-stok')
}

export const exportDebtReport = (transactions: any[]) => {
  const debtTransactions = transactions.filter(t => 
    t.paymentStatus === 'hutang' || t.paymentStatus === 'sebagian'
  )

  const data = debtTransactions.map(t => {
    const remaining = t.paymentStatus === 'hutang' 
      ? t.nominal 
      : (t.nominal - (t.paidAmount || 0))
    
    return {
      'Tanggal': new Date(t.tanggal).toLocaleDateString('id-ID'),
      'No. Transaksi': t.transactionNumber || t.id.slice(0, 8),
      'Customer': t.customerName || 'Tanpa Nama',
      'Telepon': t.customerPhone || '-',
      'Total': t.nominal,
      'Dibayar': t.paidAmount || 0,
      'Sisa Hutang': remaining,
      'Status': t.paymentStatus === 'hutang' ? 'Belum Dibayar' : 'Dibayar Sebagian'
    }
  })

  exportToCSV(data, 'laporan-hutang-piutang')
}

export const exportSalesReport = (transactions: any[], startDate?: Date, endDate?: Date) => {
  let salesTransactions = transactions.filter(t => t.type === 'pemasukan')

  if (startDate) {
    salesTransactions = salesTransactions.filter(t => 
      new Date(t.tanggal) >= startDate
    )
  }

  if (endDate) {
    salesTransactions = salesTransactions.filter(t => 
      new Date(t.tanggal) <= endDate
    )
  }

  const data = salesTransactions.map(t => ({
    'Tanggal': new Date(t.tanggal).toLocaleDateString('id-ID'),
    'No. Transaksi': t.transactionNumber || t.id.slice(0, 8),
    'Customer': t.customerName || '-',
    'Total Penjualan': t.nominal,
    'Modal': t.totalCost || 0,
    'Profit': t.profit || (t.nominal - (t.totalCost || 0)),
    'Status Bayar': t.paymentStatus === 'lunas' ? 'Lunas' : t.paymentStatus === 'hutang' ? 'Hutang' : 'Sebagian',
    'Catatan': t.catatan || '-'
  }))

  exportToCSV(data, 'laporan-penjualan')
}

export const exportContactsReport = (contacts: any[]) => {
  const data = contacts.map(c => ({
    'Nama': c.name,
    'Telepon': c.phone || '-',
    'Email': c.email || '-',
    'Alamat': c.address || '-',
    'Tipe': c.type === 'customer' ? 'Pelanggan' : c.type === 'supplier' ? 'Supplier' : 'Pelanggan & Supplier',
    'Catatan': c.notes || '-',
    'Dibuat': new Date(c.createdAt).toLocaleDateString('id-ID')
  }))

  exportToCSV(data, 'daftar-kontak')
}

export const exportProductsReport = (products: any[]) => {
  const data = products.map(p => ({
    'SKU': p.sku || '-',
    'Nama Produk': p.name,
    'Kategori': p.category,
    'Stok': p.stock,
    'Harga Jual': p.price,
    'Harga Modal': p.cost || 0,
    'Margin': p.cost ? ((p.price - p.cost) / p.cost * 100).toFixed(1) + '%' : '-',
    'Min. Stok': p.minStock || 0,
    'Supplier': p.supplier || '-',
    'Status': p.stock <= (p.minStock || 0) ? 'Stok Rendah' : 'Normal'
  }))

  exportToCSV(data, 'daftar-produk')
}

/**
 * Print report as PDF (using browser print dialog)
 */
export const printReport = (title: string, content: string, storeInfo?: any) => {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Popup diblokir! Mohon izinkan popup untuk print.')
    return
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        @page {
          size: A4;
          margin: 20mm;
        }
        
        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.5;
          color: #000;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 15px;
        }
        
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 24px;
        }
        
        .header p {
          margin: 3px 0;
          color: #666;
        }
        
        .report-title {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          margin: 20px 0;
        }
        
        .report-date {
          text-align: right;
          color: #666;
          margin-bottom: 20px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        
        th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-size: 10px;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
        
        @media print {
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      ${storeInfo ? `
        <div class="header">
          <h1>${storeInfo.storeName || 'TOKO'}</h1>
          ${storeInfo.storeAddress ? `<p>${storeInfo.storeAddress}</p>` : ''}
          ${storeInfo.storePhone ? `<p>Telp: ${storeInfo.storePhone}</p>` : ''}
        </div>
      ` : ''}
      
      <div class="report-title">${title}</div>
      <div class="report-date">Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })}</div>
      
      ${content}
      
      <div class="footer">
        <p>Dokumen ini dicetak otomatis oleh sistem</p>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; font-size: 14px; cursor: pointer;">
          🖨️ Print / Save as PDF
        </button>
        <button onclick="window.close()" style="padding: 10px 20px; font-size: 14px; cursor: pointer; margin-left: 10px;">
          ✕ Close
        </button>
      </div>
      
      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print()
          }, 500)
        }
      </script>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
}
