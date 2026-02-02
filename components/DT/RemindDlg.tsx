// OriginalName: ReminderDialog
// ShortName: RemindDlg

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { MessageCircle, MessageSquare, Copy, Send } from 'lucide-react'
import { toast } from 'sonner'
import { sendWhatsAppMessage } from '../../utils/whatsapp'

interface ReminderDialogProps {
  open: boolean
  onClose: () => void
  transaction: any
  storeInfo: {
    storeName: string
    storeLogo?: string
  }
}

export function ReminderDialog({ open, onClose, transaction, storeInfo }: ReminderDialogProps) {
  const [customMessage, setCustomMessage] = useState('')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const generateMessage = () => {
    const customerName = transaction.customerName || 'Pelanggan'
    const amount = transaction.nominal - (transaction.paidAmount || 0)
    const dueDate = transaction.dueDate 
      ? new Date(transaction.dueDate).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      : '-'

    const message = `
🏪 ${storeInfo.storeName || 'Toko Kami'}

📋 PENGINGAT PEMBAYARAN

Kepada Yth. ${customerName},

Kami ingin mengingatkan bahwa Anda memiliki:

💰 Nominal: ${formatCurrency(amount)}
📅 Jatuh Tempo: ${dueDate}

Mohon untuk segera melakukan pembayaran sesuai dengan kesepakatan.

Terima kasih atas perhatian dan kerjasamanya.

---
${storeInfo.storeName || 'Toko Kami'}
    `.trim()

    return customMessage || message
  }

  const handleCopyMessage = () => {
    const message = generateMessage()
    navigator.clipboard.writeText(message)
    toast.success('Pesan disalin ke clipboard')
  }

  const handleSendWhatsApp = () => {
    if (!transaction.customerPhone) {
      toast.error('Nomor telepon customer tidak tersedia')
      return
    }

    const message = generateMessage()
    const success = sendWhatsAppMessage(transaction.customerPhone, message)
    
    if (success) {
      toast.success('Membuka WhatsApp...')
      onClose()
    }
  }

  const handleSendSMS = () => {
    if (!transaction.customerPhone) {
      toast.error('Nomor telepon customer tidak tersedia')
      return
    }

    const message = generateMessage()
    const smsUrl = `sms:${transaction.customerPhone}?body=${encodeURIComponent(message)}`
    
    window.open(smsUrl, '_blank')
    toast.success('Membuka aplikasi SMS...')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Kirim Pengingat Pembayaran</DialogTitle>
          <DialogDescription>
            Kirim pesan pengingat pembayaran ke pelanggan Anda melalui WhatsApp atau SMS.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Store Info */}
          <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
            {storeInfo.storeLogo && (
              <img 
                src={storeInfo.storeLogo} 
                alt="Logo" 
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <div className="font-medium">{storeInfo.storeName || 'Toko Kami'}</div>
              <div className="text-sm text-muted-foreground">
                {transaction.customerName || 'Customer'}
              </div>
            </div>
          </div>

          {/* Debt Summary */}
          <div className="p-4 border rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Nominal Hutang:</span>
              <span className="font-bold text-lg">
                {formatCurrency(transaction.nominal - (transaction.paidAmount || 0))}
              </span>
            </div>
            {transaction.dueDate && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Jatuh Tempo:</span>
                <Badge variant={
                  new Date(transaction.dueDate) < new Date() ? 'destructive' : 'secondary'
                }>
                  {new Date(transaction.dueDate).toLocaleDateString('id-ID')}
                </Badge>
              </div>
            )}
            {transaction.customerPhone && (
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm text-muted-foreground">Telepon:</span>
                <span className="text-sm">{transaction.customerPhone}</span>
              </div>
            )}
          </div>

          {/* Message Preview */}
          <div className="space-y-2">
            <Label>Pesan Pengingat</Label>
            <Textarea
              value={customMessage || generateMessage()}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Anda dapat mengedit pesan sebelum mengirim
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={handleCopyMessage}
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Salin Pesan
            </Button>

            <Button
              variant="outline"
              onClick={handleSendWhatsApp}
              disabled={!transaction.customerPhone}
              className="w-full"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>

          <Button
            onClick={handleSendSMS}
            disabled={!transaction.customerPhone}
            className="w-full"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Kirim via SMS
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
