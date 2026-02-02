/**
 * WhatsApp integration utilities
 * For sending receipts, reminders, and reports via WhatsApp
 */

export const sendWhatsAppMessage = (phoneNumber: string, message: string) => {
  // Clean phone number (remove spaces, dashes, etc)
  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '')
  
  // Convert to international format if starts with 0
  const internationalNumber = cleanNumber.startsWith('0') 
    ? '62' + cleanNumber.substring(1)
    : cleanNumber

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message)
  
  // Open WhatsApp with pre-filled message
  const whatsappUrl = `https://wa.me/${internationalNumber}?text=${encodedMessage}`
  window.open(whatsappUrl, '_blank')
}

export const formatReceiptForWhatsApp = (transaction: any, storeInfo: any) => {
  const items = transaction.items || []
  const itemsList = items.map((item: any, index: number) => 
    `${index + 1}. ${item.productName} (${item.quantity}x) - ${formatCurrency(item.total)}`
  ).join('\n')

  return `
*STRUK PEMBELIAN*
${storeInfo.storeName}
${storeInfo.storeAddress || ''}
${storeInfo.storePhone || ''}

━━━━━━━━━━━━━━━━━━━━

*No. Transaksi:* ${transaction.transactionNumber || 'TRX-' + transaction.id?.slice(0, 8)}
*Tanggal:* ${new Date(transaction.tanggal).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}
*Kasir:* ${transaction.createdBy || 'Admin'}

━━━━━━━━━━━━━━━━━━━━

*DAFTAR PEMBELIAN:*
${itemsList || transaction.catatan || 'Transaksi manual'}

━━━━━━━━━━━━━━━━━━━━

*Total:* ${formatCurrency(transaction.nominal)}
${transaction.paymentStatus !== 'lunas' ? `*Dibayar:* ${formatCurrency(transaction.paidAmount || 0)}\n*Sisa Hutang:* ${formatCurrency(transaction.nominal - (transaction.paidAmount || 0))}` : '*Status:* LUNAS'}

━━━━━━━━━━━━━━━━━━━━

Terima kasih atas pembelian Anda!
`.trim()
}

export const formatDebtReminderForWhatsApp = (customerName: string, totalDebt: number, transactions: any[]) => {
  const transactionList = transactions.map((t, index) => {
    const remaining = t.paymentStatus === 'hutang' ? t.nominal : (t.nominal - (t.paidAmount || 0))
    return `${index + 1}. ${new Date(t.tanggal).toLocaleDateString('id-ID')} - ${formatCurrency(remaining)}`
  }).join('\n')

  return `
*PENGINGAT PEMBAYARAN*

Yth. ${customerName},

Kami ingin mengingatkan bahwa Anda memiliki sisa pembayaran sebesar:

*${formatCurrency(totalDebt)}*

Detail transaksi:
${transactionList}

Mohon segera melakukan pelunasan. Jika sudah melakukan pembayaran, mohon konfirmasi kepada kami.

Terima kasih atas perhatiannya.
`.trim()
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}