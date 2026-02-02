import { useDocumentTitle } from '../../../hooks/useDocumentTitle'
import { Button } from '../../ui/button'
import { Card, CardContent } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Edit, Trash2, Plus, UserCircle } from 'lucide-react'
import { useUserManagement } from '../../../hooks/useUserManagement'
import { toast } from 'sonner'

export default function UMPage() {
  useDocumentTitle('Manajemen Pengguna')
  const { users } = useUserManagement()

  // Mock users if empty (for visualization as per blueprint)
  const displayUsers = users.length > 0 ? users : [
    { id: '1', username: 'Owner', email: 'owner@toko.com', role: 'owner', is_active: true },
    { id: '2', username: 'Kasir 1', email: 'kasir@toko.com', role: 'cashier', is_active: true }
  ]

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h1>
          <p className="text-muted-foreground">
            Kelola akses dan peran pengguna dalam sistem
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pengguna
        </Button>
      </div>

      {/* User List */}
      <div className="space-y-4">
        {displayUsers.map((user) => (
          <Card key={user.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-background">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || 'User'}`} />
                    <AvatarFallback>{(user.username || 'User').substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{user.username || 'Unnamed User'}</h3>
                      <Badge variant={user.role === 'owner' ? 'default' : 'secondary'}>
                        {user.role === 'owner' ? 'Owner' : 'Kasir'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email || 'Tidak ada email'}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`inline-block w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className={user.is_active ? 'text-green-600' : 'text-red-600'}>
                        {user.is_active ? 'Status: Aktif' : 'Status: Nonaktif'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button variant="outline" size="sm" onClick={() => toast.info('Fitur edit user akan segera hadir')}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  {user.role !== 'owner' && (
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
