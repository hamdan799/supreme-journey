/**
 * Print receipt utility for thermal printer format
 */

export const printReceipt = (transaction: any, storeInfo: any) => {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Popup diblokir! Mohon izinkan popup untuk print.')
    return
  }

  const items = transaction.items || []
  const itemsHTML = items.map((item: any) => `
    <tr>
      <td style="padding: 4px 0;">${item.productName}</td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right;">${formatCurrency(item.unitPrice)}</td>
      <td style="text-align: right; font-weight: 600;">${formatCurrency(item.total)}</td>
    </tr>
  `).join('')

  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Struk - ${transaction.transactionNumber || 'TRX'}</title>
      <style>
        @page {
          size: 80mm auto;
          margin: 0;
        }
        
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          line-height: 1.4;
          margin: 0;
          padding: 10mm;
          width: 80mm;
          color: #000;
        }
        
        .header {
          text-align: center;
          margin-bottom: 10px;
          border-bottom: 2px dashed #000;
          padding-bottom: 10px;
        }
        
        .logo {
          max-width: 60mm;
          max-height: 30mm;
          margin: 0 auto 8px;
        }
        
        .store-name {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .store-info {
          font-size: 10px;
          margin: 2px 0;
        }
        
        .transaction-info {
          margin: 10px 0;
          font-size: 11px;
        }
        
        .transaction-info-row {
          display: flex;
          justify-content: space-between;
          margin: 3px 0;
        }
        
        .items-table {
          width: 100%;
          margin: 10px 0;
          border-collapse: collapse;
        }
        
        .items-table th {
          border-top: 1px solid #000;
          border-bottom: 1px solid #000;
          padding: 5px 0;
          text-align: left;
          font-size: 11px;
        }
        
        .items-table td {
          padding: 4px 0;
          font-size: 11px;
        }
        
        .total-section {
          border-top: 2px dashed #000;
          padding-top: 8px;
          margin-top: 10px;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          margin: 4px 0;
          font-size: 12px;
        }
        
        .total-row.grand-total {
          font-size: 14px;
          font-weight: bold;
          margin-top: 6px;
        }
        
        .payment-section {
          margin: 10px 0;
          padding: 8px;
          background: #f5f5f5;
          border: 1px solid #ddd;
        }
        
        .footer {
          text-align: center;
          margin-top: 15px;
          border-top: 2px dashed #000;
          padding-top: 10px;
          font-size: 11px;
        }
        
        @media print {
          body {
            padding: 5mm;
          }
          
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        ${storeInfo.storeLogo ? `<img src="${storeInfo.storeLogo}" class="logo" alt="Logo">` : ''}
        <div class="store-name">${storeInfo.storeName || 'TOKO'}</div>
        ${storeInfo.storeAddress ? `<div class="store-info">${storeInfo.storeAddress}</div>` : ''}
        ${storeInfo.storePhone ? `<div class="store-info">Telp: ${storeInfo.storePhone}</div>` : ''}
      </div>
      
      <div class="transaction-info">
        <div class="transaction-info-row">
          <span>No. Transaksi</span>
          <span><strong>${transaction.transactionNumber || 'TRX-' + transaction.id?.slice(0, 8)}</strong></span>
        </div>
        <div class="transaction-info-row">
          <span>Tanggal</span>
          <span>${new Date(transaction.tanggal).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
        ${transaction.customerName ? `
          <div class="transaction-info-row">
            <span>Pelanggan</span>
            <span>${transaction.customerName}</span>
          </div>
        ` : ''}
        <div class="transaction-info-row">
          <span>Kasir</span>
          <span>${transaction.createdBy || 'Admin'}</span>
        </div>
      </div>
      
      ${items.length > 0 ? `
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th style="text-align: center; width: 40px;">Qty</th>
              <th style="text-align: right; width: 70px;">Harga</th>
              <th style="text-align: right; width: 80px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
      ` : `
        <div style="margin: 10px 0; padding: 10px; border: 1px dashed #999;">
          <strong>Keterangan:</strong><br>
          ${transaction.catatan || 'Transaksi manual'}
        </div>
      `}
      
      <div class="total-section">
        ${transaction.items && transaction.items.length > 0 ? `
          <div class="total-row">
            <span>Subtotal</span>
            <span>${formatCurrency(transaction.nominal)}</span>
          </div>
        ` : ''}
        
        <div class="total-row grand-total">
          <span>TOTAL</span>
          <span>${formatCurrency(transaction.nominal)}</span>
        </div>
        
        ${transaction.paymentStatus !== 'lunas' ? `
          <div class="payment-section">
            <div class="total-row">
              <span>Dibayar</span>
              <span>${formatCurrency(transaction.paidAmount || 0)}</span>
            </div>
            <div class="total-row" style="color: #d00;">
              <span><strong>Sisa Hutang</strong></span>
              <span><strong>${formatCurrency(transaction.nominal - (transaction.paidAmount || 0))}</strong></span>
            </div>
          </div>
        ` : `
          <div class="payment-section">
            <div style="text-align: center; font-weight: bold; color: #060;">
              ✓ LUNAS
            </div>
          </div>
        `}
      </div>
      
      <div class="footer">
        <div style="margin-bottom: 6px;">*** TERIMA KASIH ***</div>
        <div style="font-size: 10px;">Barang yang sudah dibeli tidak dapat dikembalikan</div>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; font-size: 14px; cursor: pointer;">
          🖨️ Print Struk
        </button>
        <button onclick="window.close()" style="padding: 10px 20px; font-size: 14px; cursor: pointer; margin-left: 10px;">
          ✕ Tutup
        </button>
      </div>
      
      <script>
        // Auto print when loaded
        window.onload = () => {
          setTimeout(() => {
            window.print()
          }, 500)
        }
      </script>
    </body>
    </html>
  `

  printWindow.document.write(receiptHTML)
  printWindow.document.close()
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}