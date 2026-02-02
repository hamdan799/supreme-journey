// OriginalName: CustomerInfo
// ShortName: CustInfo

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { User, Phone, Save, Contact as ContactIcon } from 'lucide-react';
import type { Contact } from '../../types/inventory';

interface CustInfoProps {
  customerName: string;
  customerPhone: string;
  transactionDate: string;
  paymentStatus: 'lunas' | 'hutang';
  description: string;
  contacts?: Contact[];
  onCustomerNameChange: (name: string) => void;
  onCustomerPhoneChange: (phone: string) => void;
  onTransactionDateChange: (date: string) => void;
  onPaymentStatusChange: (status: 'lunas' | 'hutang') => void;
  onDescriptionChange: (desc: string) => void;
  onSaveContact?: () => void;
}

export function CustInfo({
  customerName,
  customerPhone,
  transactionDate,
  paymentStatus,
  description,
  contacts = [],
  onCustomerNameChange,
  onCustomerPhoneChange,
  onTransactionDateChange,
  onPaymentStatusChange,
  onDescriptionChange,
  onSaveContact,
}: CustInfoProps) {
  // Filter contacts to show only customers
  const customerContacts = contacts.filter(c => c.type === 'customer' || c.type === 'both');

  const handleContactSelect = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      onCustomerNameChange(contact.name);
      onCustomerPhoneChange(contact.phone || '');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Contact Picker */}
      {customerContacts.length > 0 && (
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center gap-2">
            <ContactIcon className="w-4 h-4 text-muted-foreground" />
            <Label>Pilih dari Kontak Tersimpan (Opsional)</Label>
          </div>
          <Select onValueChange={handleContactSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kontak atau isi manual di bawah" />
            </SelectTrigger>
            <SelectContent>
              {customerContacts.map(contact => (
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
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Nama Pelanggan (Opsional)</Label>
          {customerName && onSaveContact && (
            <Button size="sm" variant="ghost" onClick={onSaveContact}>
              <Save className="w-3 h-3 mr-1" />
              Simpan Kontak
            </Button>
          )}
        </div>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Nama pelanggan"
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>No. Telepon (Opsional)</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="08xxxxxxxxxx"
            value={customerPhone}
            onChange={(e) => onCustomerPhoneChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tanggal Transaksi</Label>
        <Input
          type="date"
          value={transactionDate}
          onChange={(e) => onTransactionDateChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Status Pembayaran</Label>
        <Select
          value={paymentStatus}
          onValueChange={(v: any) => onPaymentStatusChange(v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lunas">Lunas</SelectItem>
            <SelectItem value="hutang">Hutang</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label>Deskripsi (Opsional)</Label>
        <Textarea
          placeholder="Catatan transaksi..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
}
