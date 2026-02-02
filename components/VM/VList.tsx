// OriginalName: VendorList
// ShortName: VList

import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { ConfirmDialog } from '../ui/confirm-dialog'
import { Search, Edit, Trash2, Phone, Mail, MapPin, FileText } from 'lucide-react'
import type { Vendor } from '../../types/inventory'

interface VListProps {
  vendors: Vendor[]
  onEdit: (vendor: Vendor) => void
  onDelete: (id: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function VList({
  vendors,
  onEdit,
  onDelete,
  searchQuery,
  onSearchChange
}: VListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const vendorToDelete = vendors.find(v => v.id === deleteId)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date))
  }

  if (vendors.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>
            {searchQuery
              ? `Tidak ada vendor yang cocok dengan "${searchQuery}"`
              : 'Belum ada vendor. Klik "Tambah Vendor" untuk memulai.'}
          </p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card>
        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari vendor berdasarkan nama, kontak, email..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Vendor</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{vendor.nama_vendor}</p>
                      {vendor.alamat && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {vendor.alamat.length > 40
                            ? vendor.alamat.slice(0, 40) + '...'
                            : vendor.alamat}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {vendor.kontak ? (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{vendor.kontak}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {vendor.email ? (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{vendor.email}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(vendor.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(vendor)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(vendor.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y">
          {vendors.map((vendor) => {
            const isExpanded = expandedId === vendor.id

            return (
              <div key={vendor.id} className="p-4">
                <div
                  className="cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : vendor.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium">{vendor.nama_vendor}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(vendor.createdAt)}
                      </p>
                    </div>
                    {vendor.catatan && (
                      <Badge variant="secondary" className="ml-2">
                        <FileText className="w-3 h-3" />
                      </Badge>
                    )}
                  </div>

                  {/* Contact Info - Always Visible */}
                  <div className="space-y-1 mt-2">
                    {vendor.kontak && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{vendor.kontak}</span>
                      </div>
                    )}
                    {vendor.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{vendor.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t space-y-2">
                      {vendor.alamat && (
                        <div>
                          <p className="text-sm font-medium mb-1">Alamat:</p>
                          <p className="text-sm text-muted-foreground flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{vendor.alamat}</span>
                          </p>
                        </div>
                      )}
                      {vendor.catatan && (
                        <div>
                          <p className="text-sm font-medium mb-1">Catatan:</p>
                          <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                            {vendor.catatan}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onEdit(vendor)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(vendor.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            onDelete(deleteId)
            setDeleteId(null)
          }
        }}
        title="Hapus Vendor"
        description={`Apakah Anda yakin ingin menghapus vendor "${vendorToDelete?.nama_vendor}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        variant="destructive"
      />
    </>
  )
}
