// OriginalName: VendorManagementPage
// ShortName: VM (index)

import { useState } from 'react'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { VStats } from './VStats'
import { VForm } from './VForm'
import { VList } from './VList'
import { useVendorStore } from '../../hooks/useVendorStore'
import { LoadingSpinner } from '../ui/loading-spinner'
import type { Vendor } from '../../types/inventory'

export function VM() {
  const {
    vendors,
    isLoading,
    createVendor,
    updateVendor,
    deleteVendor,
    searchVendors
  } = useVendorStore()

  const [showForm, setShowForm] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | undefined>()
  const [searchQuery, setSearchQuery] = useState('')

  // Get filtered vendors
  const filteredVendors = searchVendors(searchQuery)

  const handleSubmit = (data: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingVendor) {
      updateVendor(editingVendor.id, data)
    } else {
      createVendor(data)
    }
    setShowForm(false)
    setEditingVendor(undefined)
  }

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingVendor(undefined)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Vendor Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola data vendor dan supplier sparepart
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Vendor
          </Button>
        )}
      </div>

      {/* Statistics */}
      <VStats vendors={vendors} />

      {/* Form or List */}
      {showForm ? (
        <VForm
          vendor={editingVendor}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <VList
          vendors={filteredVendors}
          onEdit={handleEdit}
          onDelete={deleteVendor}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}
    </div>
  )
}
