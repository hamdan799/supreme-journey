// OriginalName: PrintDialog
// ShortName: PrintDlg

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { Minus, Plus, Printer } from 'lucide-react'
import { toast } from 'sonner'

interface PrintDialogProps {
  open: boolean
  onClose: () => void
  transaction: any
  storeInfo: {
    storeName: string
    storeLogo?: string
    storeAddress?: string
    storePhone?: string
  }
}

export function PrintDialog({ open, onClose, transaction, storeInfo }: PrintDialogProps) {
  const [template, setTemplate] = useState('default')
  const [copies, setCopies] = useState(1)
  const [includeHeader, setIncludeHeader] = useState(true)
  const [includePayment, setIncludePayment] = useState(true)
  const [includeCustomerCopy, setIncludeCustomerCopy] = useState(true)

  const handlePrint = () => {
    // Build print content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Struk - ${transaction.transactionNumber || 'TRX'}</title>
          <style>
            @media print {
              @page { margin: 0; }
              body { margin: 1cm; }
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              max-width: 300px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px dashed #000;
              padding-bottom: 10px;
            }
            .logo {
              width: 60px;
              height: 60px;
              margin: 0 auto 10px;
            }
            .title {
              font-size: 16px;
              font-weight: bold;
              margin: 5px 0;
            }
            .info {
              font-size: 10px;
              margin: 2px 0;
            }
            .section {
              margin: 15px 0;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
            }
            .items {
              border-top: 1px dashed #000;
              border-bottom: 1px dashed #000;
              padding: 10px 0;
              margin: 10px 0;
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
            }
            .total {
              font-size: 14px;
              font-weight: bold;
              border-top: 2px solid #000;
              padding-top: 10px;
              margin-top: 10px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              border-top: 2px dashed #000;
              padding-top: 10px;
              font-size: 10px;
            }
          </style>
        </head>
        <body>
          ${includeHeader ? `
            <div class="header">
              ${storeInfo.storeLogo ? `<img src="${storeInfo.storeLogo}" alt="Logo" class="logo" />` : ''}
              <div class="title">${storeInfo.storeName || 'Toko Saya'}</div>
              ${storeInfo.storeAddress ? `<div class="info">${storeInfo.storeAddress}</div>` : ''}
              ${storeInfo.storePhone ? `<div class="info">Telp: ${storeInfo.storePhone}</div>` : ''}
            </div>
          ` : ''}
          
          <div class="section">
            <div class="row">
              <span>No. Transaksi:</span>
              <span>${transaction.transactionNumber || 'TRX-' + transaction.id?.slice(0, 8)}</span>
            </div>
            <div class="row">
              <span>Tanggal:</span>
              <span>${new Date(transaction.tanggal || transaction.createdAt).toLocaleDateString('id-ID')}</span>
            </div>
            ${transaction.customerName ? `
              <div class="row">
                <span>Customer:</span>
                <span>${transaction.customerName}</span>
              </div>
            ` : ''}
          </div>
          
          ${transaction.items && transaction.items.length > 0 ? `
            <div class="items">
              ${transaction.items.map((item: any) => `
                <div class="item-row">
                  <span>${item.name || item.productName}</span>
                  <span>${item.quantity || item.jumlah}x</span>
                </div>
                <div class="item-row" style="margin-left: 10px;">
                  <span>@ ${new Intl.NumberFormat('id-ID').format(item.price || item.harga)}</span>
                  <span>${new Intl.NumberFormat('id-ID').format((item.price || item.harga) * (item.quantity || item.jumlah))}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <div class="total">
            <div class="row">
              <span>TOTAL:</span>
              <span>Rp ${new Intl.NumberFormat('id-ID').format(transaction.nominal || 0)}</span>
            </div>
            
            ${includePayment && transaction.paymentStatus ? `
              <div class="row" style="font-size: 12px; margin-top: 10px;">
                <span>Status:</span>
                <span>${transaction.paymentStatus === 'lunas' ? 'LUNAS' : transaction.paymentStatus === 'hutang' ? 'BELUM LUNAS' : 'SEBAGIAN'}</span>
              </div>
              ${transaction.paidAmount ? `
                <div class="row" style="font-size: 12px;">
                  <span>Dibayar:</span>
                  <span>Rp ${new Intl.NumberFormat('id-ID').format(transaction.paidAmount)}</span>
                </div>
                <div class="row" style="font-size: 12px;">
                  <span>Sisa:</span>
                  <span>Rp ${new Intl.NumberFormat('id-ID').format(transaction.nominal - transaction.paidAmount)}</span>
                </div>
              ` : ''}
            ` : ''}
          </div>
          
          <div class="footer">
            <div>Terima kasih atas kunjungan Anda!</div>
            <div style="margin-top: 10px;">
              ${new Date().toLocaleString('id-ID')}
            </div>
          </div>
          
          ${includeCustomerCopy ? `
            <div style="page-break-after: always;"></div>
            <div class="header">
              ${storeInfo.storeLogo ? `<img src="${storeInfo.storeLogo}" alt="Logo" class="logo" />` : ''}
              <div class="title">${storeInfo.storeName || 'Toko Saya'}</div>
              <div class="info">SALINAN CUSTOMER</div>
            </div>
            <!-- Repeat content for customer copy -->
          ` : ''}
        </body>
      </html>
    `

    // Create print window
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      
      // Print multiple copies if needed
      setTimeout(() => {
        for (let i = 0; i < copies; i++) {
          printWindow.print()
        }
        toast.success(`Mencetak ${copies} salinan`)
        onClose()
      }, 250)
    } else {
      toast.error('Gagal membuka jendela cetak. Periksa popup blocker.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Opsi Cetak</DialogTitle>
          <DialogDescription>
            Pilih opsi cetak atau bagikan struk transaksi
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Template Selection */}
          <div className="space-y-2">
            <Label>Template</Label>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Copies */}
          <div className="space-y-2">
            <Label>Jumlah Salinan</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCopies(Math.max(1, copies - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="flex-1 text-center py-2 border rounded-md">
                {copies}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCopies(Math.min(10, copies + 1))}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <Label>Opsi</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="header"
                checked={includeHeader}
                onCheckedChange={(checked) => setIncludeHeader(checked as boolean)}
              />
              <label htmlFor="header" className="text-sm cursor-pointer">
                Header & Logo
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="payment"
                checked={includePayment}
                onCheckedChange={(checked) => setIncludePayment(checked as boolean)}
              />
              <label htmlFor="payment" className="text-sm cursor-pointer">
                Detail Pembayaran
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="customer-copy"
                checked={includeCustomerCopy}
                onCheckedChange={(checked) => setIncludeCustomerCopy(checked as boolean)}
              />
              <label htmlFor="customer-copy" className="text-sm cursor-pointer">
                Salinan Customer
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Cetak
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
