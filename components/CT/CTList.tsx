// OriginalName: ContactList
// ShortName: CTList

import { useState } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Search, User, Eye } from 'lucide-react'
import { useNotaStore } from '../../hooks/useNotaStore'
import type { Contact } from '../../types/inventory'

interface CTListProps {
  contacts: Contact[]
  onEdit: (contact: Contact) => void
  onDelete: (id: string) => void
  onContactClick?: (contact: Contact) => void
}

export function CTList({ contacts, onEdit, onDelete, onContactClick }: CTListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'customer' | 'supplier' | 'vendor' | 'both'>('all')
  
  const { getServiceNota } = useNotaStore()
  const allServiceNotas = getServiceNota()

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = filterType === 'all' || contact.type === filterType
    
    return matchesSearch && matchesType
  })

  const getTypeColor = (type: Contact['type']) => {
    switch (type) {
      case 'customer':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
      case 'supplier':
        return 'bg-green-500/10 text-green-600 dark:text-green-400'
      case 'vendor':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
      case 'both':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
    }
  }

  const getTypeLabel = (type: Contact['type']) => {
    switch (type) {
      case 'customer':
        return 'Pelanggan'
      case 'supplier':
        return 'Supplier'
      case 'vendor':
        return 'Vendor'
      case 'both':
        return 'Pelanggan & Supplier'
    }
  }

  const getContactStats = (contact: Contact) => {
    // Count Nota Service
    const totalService = allServiceNotas.filter(
      nota => nota.nomorHp === contact.phone || nota.namaPelanggan === contact.name
    ).length
    
    // TODO: Count Nota Pesanan when available
    const totalPesanan = 0
    
    // Get last activity date
    const contactNotas = allServiceNotas.filter(
      nota => nota.nomorHp === contact.phone || nota.namaPelanggan === contact.name
    )
    const lastActivity = contactNotas.length > 0
      ? new Date(Math.max(...contactNotas.map(n => new Date(n.tanggal).getTime())))
      : null
    
    return { totalService, totalPesanan, lastActivity }
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus kontak ${name}?`)) {
      onDelete(id)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari kontak berdasarkan nama, telepon, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="customer">Pelanggan</SelectItem>
              <SelectItem value="supplier">Supplier</SelectItem>
              <SelectItem value="vendor">Vendor</SelectItem>
              <SelectItem value="both">Keduanya</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Contacts List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-4">Nama</th>
                <th className="p-4">Role</th>
                <th className="p-4">Total Service</th>
                <th className="p-4">Total Pesanan</th>
                <th className="p-4">Aktivitas Terakhir</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    {searchQuery || filterType !== 'all' 
                      ? 'Tidak ada kontak yang cocok dengan filter'
                      : 'Belum ada kontak. Klik "Tambah Kontak" untuk menambahkan.'}
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => {
                  const stats = getContactStats(contact)
                  return (
                    <tr key={contact.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-xs text-muted-foreground">{contact.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getTypeColor(contact.type)}>
                          {getTypeLabel(contact.type)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">{stats.totalService}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">{stats.totalPesanan}</span>
                      </td>
                      <td className="p-4">
                        {stats.lastActivity ? (
                          <span className="text-sm">
                            {stats.lastActivity.toLocaleDateString('id-ID', { 
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => onContactClick && onContactClick(contact)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Detail
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
