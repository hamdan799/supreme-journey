// ==========================================
// POSPaymentDialog.tsx — PAYMENT PROCESSING UI
// ==========================================
// Komponen UI untuk dialog pembayaran:
// - Payment status selection (lunas/hutang/sebagian)
// - Customer/supplier selection
// - Partial payment amount
// - Payment method selection (cash/transfer/split)
// - Split payment inputs
// ==========================================

import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Banknote, CreditCard, DollarSign } from 'lucide-react'
import type { Contact } from '../../../types/inventory'

// ==========================================
// TYPES
// ==========================================

type PaymentStatus = 'lunas' | 'hutang' | 'sebagian'
type PaymentMethod = 'cash' | 'transfer' | 'split'

// ==========================================
// PROPS
// ==========================================

interface POSPaymentDialogProps {
  // Dialog state
  open: boolean
  onOpenChange: (open: boolean) => void

  // Total
  total: number

  // Payment status
  paymentStatus: PaymentStatus
  onPaymentStatusChange: (status: PaymentStatus) => void

  // Customer/Supplier (for debt)
  selectedContact: Contact | null
  onContactChange: (contact: Contact | null) => void
  customerContacts: Contact[]

  // Partial payment
  paidAmountPartial: number | ''
  onPaidAmountPartialChange: (amount: number | '') => void

  // Payment method (for lunas)
  paymentMethod: PaymentMethod
  onPaymentMethodChange: (method: PaymentMethod) => void

  // Split payment
  cashAmount: number | ''
  onCashAmountChange: (amount: number | '') => void
  transferAmount: number | ''
  onTransferAmountChange: (amount: number | '') => void

  // Actions
  onProcess: () => void

  // Helper
  formatCurrency: (amount: number) => string
}

// ==========================================
// COMPONENT
// ==========================================

export function POSPaymentDialog({
  open,
  onOpenChange,
  total,
  paymentStatus,
  onPaymentStatusChange,
  selectedContact,
  onContactChange,
  customerContacts,
  paidAmountPartial,
  onPaidAmountPartialChange,
  paymentMethod,
  onPaymentMethodChange,
  cashAmount,
  onCashAmountChange,
  transferAmount,
  onTransferAmountChange,
  onProcess,
  formatCurrency,
}: POSPaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Pembayaran Transaksi</DialogTitle>
          <DialogDescription>
            Pilih metode dan status pembayaran untuk menyelesaikan transaksi
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Total Pembayaran</div>
            <div className="text-2xl font-bold">{formatCurrency(total)}</div>
          </div>

          {/* Payment Status Selection */}
          <div className="space-y-2">
            <Label>Status Pembayaran</Label>
            <Tabs value={paymentStatus} onValueChange={(v) => onPaymentStatusChange(v as PaymentStatus)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="lunas">Lunas</TabsTrigger>
                <TabsTrigger value="hutang">Hutang</TabsTrigger>
                <TabsTrigger value="sebagian">Sebagian</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Customer Selection (for debt) */}
          {paymentStatus !== 'lunas' && (
            <div className="space-y-2">
              <Label>Customer/Supplier *</Label>
              <Select
                value={selectedContact?.id || ''}
                onValueChange={(id) => {
                  const contact = customerContacts.find(c => c.id === id)
                  onContactChange(contact || null)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih customer/supplier" />
                </SelectTrigger>
                <SelectContent>
                  {customerContacts.map(contact => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name} {contact.phone ? `(${contact.phone})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Pilih customer untuk tracking hutang
              </p>
            </div>
          )}

          {/* Partial Payment Amount */}
          {paymentStatus === 'sebagian' && (
            <div className="space-y-2">
              <Label>Jumlah Dibayar</Label>
              <Input
                type="number"
                value={paidAmountPartial}
                onChange={(e) => onPaidAmountPartialChange(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Masukkan jumlah yang dibayar"
              />
              {paidAmountPartial !== '' && paidAmountPartial > 0 && paidAmountPartial < total && (
                <p className="text-xs text-muted-foreground">
                  Sisa hutang: {formatCurrency(total - paidAmountPartial)}
                </p>
              )}
            </div>
          )}

          {/* Payment Method (only for lunas) */}
          {paymentStatus === 'lunas' && (
            <div className="space-y-2">
              <Label>Metode Pembayaran</Label>
              <Tabs value={paymentMethod} onValueChange={(v) => onPaymentMethodChange(v as PaymentMethod)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="cash">
                    <Banknote className="w-4 h-4 mr-2" />
                    Tunai
                  </TabsTrigger>
                  <TabsTrigger value="transfer">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Transfer
                  </TabsTrigger>
                  <TabsTrigger value="split">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Split
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="cash" className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Pembayaran tunai - {formatCurrency(total)}
                  </p>
                </TabsContent>

                <TabsContent value="transfer" className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Pembayaran transfer - {formatCurrency(total)}
                  </p>
                </TabsContent>

                <TabsContent value="split" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tunai</Label>
                    <Input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => onCashAmountChange(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Transfer</Label>
                    <Input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => onTransferAmountChange(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  {(cashAmount !== '' || transferAmount !== '') && (
                    <p className="text-xs text-muted-foreground">
                      Total: {formatCurrency((cashAmount === '' ? 0 : cashAmount) + (transferAmount === '' ? 0 : transferAmount))}
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button className="flex-1" onClick={onProcess}>
              Proses Pembayaran
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
