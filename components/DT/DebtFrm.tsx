// OriginalName: EnhancedDebtForm
// ShortName: DebtFrm

import { useState } from 'react'
import { Switch } from '../ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Calendar } from '../ui/calendar'
import { cn } from '../ui/utils'
import { CalendarIcon, Calculator, Contact as ContactIcon, Phone } from 'lucide-react'
import { toast } from 'sonner'
import type { Contact } from '../../types/inventory'

interface EnhancedDebtFormProps {
  open: boolean
  onClose: () => void
  contacts: Contact[]
  onTransactionCreate: (transaction: any) => void
  onContactCreate?: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
}

export function DebtFrm({
  open,
  onClose,
  contacts,
  onTransactionCreate,
  onContactCreate
}: EnhancedDebtFormProps) {
  const [mode, setMode] = useState<'receive' | 'give'>('receive')
  const [amount, setAmount] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState<Date>(new Date())
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [enableInstallment, setEnableInstallment] = useState(false)
  const [installmentAmount, setInstallmentAmount] = useState('')
  const [installmentPeriod, setInstallmentPeriod] = useState<'weekly' | 'monthly'>('monthly')
  const [showCalculator, setShowCalculator] = useState(false)

  const customerContacts = contacts.filter(c => c.type === 'customer')
  const supplierContacts = contacts.filter(c => c.type === 'supplier')
  const availableContacts = mode === 'receive' ? customerContacts : supplierContacts

  const handleContactSelect = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId)
    if (contact) {
      setContactName(contact.name)
      setContactPhone(contact.phone || '')
    }
  }

  const handleCalculatorInput = (value: string) => {
    setAmount(prev => {
      if (value === 'C') return ''
      if (value === '←') return prev.slice(0, -1)
      if (value === '=') {
        try {
          return eval(prev).toString()
        } catch {
          return prev
        }
      }
      return prev + value
    })
  }

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error('Masukkan jumlah yang valid')
      return
    }

    if (!contactName.trim()) {
      toast.error('Masukkan nama kontak')
      return
    }

    // Create or update contact if needed
    if (onContactCreate && contactPhone) {
      const existingContact = contacts.find(c => c.name === contactName)
      if (!existingContact) {
        await onContactCreate({
          name: contactName,
          phone: contactPhone,
          type: mode === 'receive' ? 'customer' : 'supplier',
          notes: description
        })
      }
    }

    const transaction = {
      type: mode === 'receive' ? 'piutang' : 'hutang',
      nominal: Number(amount),
      customerName: contactName,
      customerPhone: contactPhone || undefined,
      catatan: description || undefined,
      tanggal: date,
      dueDate: dueDate || undefined,
      paymentStatus: 'hutang',
      paidAmount: 0,
      installment: enableInstallment ? {
        amount: Number(installmentAmount),
        period: installmentPeriod
      } : undefined
    }

    onTransactionCreate(transaction)
    toast.success(`${mode === 'receive' ? 'Piutang' : 'Hutang'} berhasil ditambahkan`)
    handleClose()
  }

  const handleClose = () => {
    setAmount('')
    setContactName('')
    setContactPhone('')
    setDescription('')
    setDate(new Date())
    setDueDate(undefined)
    setEnableInstallment(false)
    setInstallmentAmount('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'receive' ? 'Tambah Piutang' : 'Tambah Hutang'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'receive' 
              ? 'Catat piutang dari pelanggan yang berhutang kepada Anda'
              : 'Catat hutang Anda kepada supplier atau pihak lain'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Mode Toggle */}
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="receive">Menerima Piutang</TabsTrigger>
              <TabsTrigger value="give">Memberi Hutang</TabsTrigger>
            </TabsList>

            <TabsContent value="receive" className="space-y-4 mt-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  Anda <strong>menerima piutang</strong> dari pelanggan. Mereka berhutang kepada Anda.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="give" className="space-y-4 mt-4">
              <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-900 dark:text-orange-100">
                  Anda <strong>memberi hutang</strong> kepada supplier. Anda berhutang kepada mereka.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Amount */}
          <div className="space-y-2">
            <Label>
              {mode === 'receive' ? 'Jumlah Piutang' : 'Jumlah Hutang'}
            </Label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="text-right"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowCalculator(!showCalculator)}
              >
                <Calculator className="w-4 h-4" />
              </Button>
            </div>

            {/* Simple Calculator */}
            {showCalculator && (
              <div className="grid grid-cols-4 gap-1 p-2 border rounded-lg bg-muted/50">
                {['7', '8', '9', '/'].map(key => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => handleCalculatorInput(key)}
                  >
                    {key}
                  </Button>
                ))}
                {['4', '5', '6', '*'].map(key => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => handleCalculatorInput(key)}
                  >
                    {key}
                  </Button>
                ))}
                {['1', '2', '3', '-'].map(key => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => handleCalculatorInput(key)}
                  >
                    {key}
                  </Button>
                ))}
                {['0', '←', '=', '+'].map(key => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => handleCalculatorInput(key)}
                  >
                    {key}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="col-span-4"
                  onClick={() => handleCalculatorInput('C')}
                >
                  Clear
                </Button>
              </div>
            )}
          </div>

          {/* Contact Selection */}
          <div className="space-y-2">
            <Label>
              {mode === 'receive' ? 'Dari Pelanggan' : 'Kepada Supplier'}
            </Label>
            <Select onValueChange={handleContactSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kontak atau ketik manual" />
              </SelectTrigger>
              <SelectContent>
                {availableContacts.map(contact => (
                  <SelectItem key={contact.id} value={contact.id}>
                    <div className="flex items-center gap-2">
                      <ContactIcon className="w-4 h-4" />
                      <span>{contact.name}</span>
                      {contact.phone && (
                        <span className="text-xs text-muted-foreground">
                          ({contact.phone})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contact Name (Manual) */}
          <div className="space-y-2">
            <Label>Nama</Label>
            <Input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Nama pelanggan/supplier"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label>Nomor Telepon</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="08xx xxxx xxxx"
                className="pl-10"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Deskripsi (Opsional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Catatan tambahan..."
              rows={3}
            />
          </div>

          {/* Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Pilih tanggal'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Jatuh Tempo</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left',
                      !dueDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Pilih tanggal'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Installment */}
          <div className="space-y-3 p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <Label htmlFor="installment">Cicilan</Label>
              <Switch
                id="installment"
                checked={enableInstallment}
                onCheckedChange={setEnableInstallment}
              />
            </div>

            {enableInstallment && (
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label>Jumlah Per Cicilan</Label>
                  <Input
                    type="number"
                    value={installmentAmount}
                    onChange={(e) => setInstallmentAmount(e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Periode</Label>
                  <Select
                    value={installmentPeriod}
                    onValueChange={(v) => setInstallmentPeriod(v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Mingguan</SelectItem>
                      <SelectItem value="monthly">Bulanan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}