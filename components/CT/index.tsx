// OriginalName: ContactManagement
// ShortName: CT

import { useState } from 'react'
import { Button } from '../ui/button'
import { UserPlus, Download } from 'lucide-react'
import { CTList } from './CTList'
import { CTForm } from './CTForm'
import { CTStats } from './CTStats'
import { ContDet } from './ContDet'
import { toast } from 'sonner'
import { exportContactsReport } from '../../utils/exportHelpers'
import type { Contact } from '../../types/inventory'

interface CTProps {
  contacts: Contact[]
  onContactCreate: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onContactUpdate: (id: string, contact: Partial<Contact>) => Promise<void>
  onContactDelete: (id: string) => Promise<void>
}

export function CT({ contacts, onContactCreate, onContactUpdate, onContactDelete }: CTProps) {
  const [filterType, setFilterType] = useState<'all' | 'customer' | 'supplier' | 'vendor'>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const handleOpenDialog = (contact?: Contact) => {
    setEditingContact(contact || null)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingContact(null)
  }

  const handleSubmit = async (data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingContact) {
        await onContactUpdate(editingContact.id, data)
      } else {
        await onContactCreate(data)
      }
      handleCloseDialog()
    } catch (error) {
      console.error('Error saving contact:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await onContactDelete(id)
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
  };

  // If contact detail view is active, show it
  if (selectedContact) {
    return (
      <ContDet
        contact={selectedContact}
        onBack={() => setSelectedContact(null)}
        onEdit={(contact) => {
          setEditingContact(contact);
          setIsDialogOpen(true);
        }}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl">Kontak</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola pelanggan, supplier, dan vendor
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              exportContactsReport(contacts)
              toast.success('Daftar kontak berhasil diekspor')
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => handleOpenDialog()}>
            <UserPlus className="w-4 h-4 mr-2" />
            Tambah Kontak
          </Button>
        </div>
      </div>

      {/* Stats */}
      <CTStats contacts={contacts} />

      {/* Filter Buttons (UI Internal) */}
      <div className="flex gap-2">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('all')}
        >
          Semua
        </Button>
        <Button
          variant={filterType === 'customer' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('customer')}
        >
          Pelanggan
        </Button>
        <Button
          variant={filterType === 'supplier' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('supplier')}
        >
          Supplier
        </Button>
        <Button
          variant={filterType === 'vendor' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('vendor')}
        >
          Vendor
        </Button>
      </div>

      {/* Contact List */}
      <CTList
        contacts={contacts}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
        onContactClick={handleContactClick}
      />

      {/* Contact Dialog */}
      <CTForm
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        contact={editingContact}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

// Export all sub-components
export { CTList } from './CTList'
export { CTForm } from './CTForm'
export { CTStats } from './CTStats'
export { ContDet } from './ContDet'