// OriginalName: TransactionHistoryItem
// ShortName: HistoryItem

import { useState } from 'react'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { TableCell, TableRow } from '../../ui/table'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible'
import {
  ChevronDown,
  ChevronUp,
  Package,
  CreditCard,
  User,
  Printer,
  Share2,
  Eye
} from 'lucide-react'
import type { Transaction } from '../../../types/financial'

interface HistoryItemProps {
  transaction: Transaction
  onViewDetail: (transaction: Transaction) => void
  onPrint?: (transaction: Transaction) => void
  onShare?: (transaction: Transaction) => void
}

export function HistoryItem({ transaction, onViewDetail, onPrint, onShare }: HistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusBadge = () => {
    const status = transaction.paymentStatus || 'lunas'
    const variants = {
      lunas: 'default',
      hutang: 'destructive',
      sebagian: 'secondary'
    } as const

    const labels = {
      lunas: 'Lunas',
      hutang: 'Belum Lunas',
      sebagian: 'Sebagian'
    }

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  const getTypeBadge = () => {
    return (
      <Badge variant={transaction.type === 'pemasukan' ? 'default' : 'outline'}>
        {transaction.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
      </Badge>
    )
  }

  const sisaHutang = transaction.nominal - (
    transaction.paidAmount ?? 
    (transaction.paymentStatus === 'lunas' ? transaction.nominal : 0)
  )

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded} asChild>
      <>
        <TableRow className="hover:bg-muted/50">
          <TableCell>
            {formatDate(transaction.tanggal || transaction.createdAt)}
          </TableCell>
          <TableCell>
            <div className="space-y-1">
              <div className="font-medium">
                {transaction.transactionNumber || `TRX-${transaction.id?.slice(0, 8)}`}
              </div>
              <div>{getTypeBadge()}</div>
            </div>
          </TableCell>
          <TableCell>
            {transaction.customerName || '-'}
          </TableCell>
          <TableCell className="text-right">
            <div className={transaction.type === 'pengeluaran' ? 'text-destructive' : ''}>
              {formatCurrency(transaction.nominal)}
            </div>
          </TableCell>
          <TableCell>
            {getStatusBadge()}
            {sisaHutang > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                Sisa: {formatCurrency(sisaHutang)}
              </div>
            )}
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetail(transaction)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>

        {/* Expanded Detail - READ ONLY snapshot */}
        <CollapsibleContent asChild>
          <TableRow>
            <TableCell colSpan={6} className="bg-muted/30">
              <div className="p-4 space-y-4">
                {/* Items - Menggunakan SNAPSHOT, tidak query ulang */}
                {transaction.items && transaction.items.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4" />
                      <span className="font-medium">Items ({transaction.items.length} produk)</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      {transaction.items.map((item) => (
                        <div key={item.id} className="text-sm text-muted-foreground">
                          • {item.productName} x{item.quantity} @ {formatCurrency(item.unitPrice)}
                          {' = '}
                          <span className="font-medium">{formatCurrency(item.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Info */}
                <div className="flex items-start gap-2 text-sm">
                  <CreditCard className="w-4 h-4 mt-0.5" />
                  <div>
                    <span className="font-medium">Pembayaran: </span>
                    {transaction.paymentStatus === 'lunas' && (
                      <span className="text-muted-foreground">Lunas</span>
                    )}
                    {transaction.paymentStatus === 'hutang' && (
                      <span className="text-destructive">Belum Lunas</span>
                    )}
                    {transaction.paymentStatus === 'sebagian' && (
                      <span className="text-muted-foreground">
                        Dibayar {formatCurrency(transaction.paidAmount || 0)} dari {formatCurrency(transaction.nominal)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                {transaction.customerName && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Customer:</span>
                    <span className="text-muted-foreground">
                      {transaction.customerName}
                      {transaction.customerPhone && ` (${transaction.customerPhone})`}
                    </span>
                  </div>
                )}

                {/* Notes */}
                {transaction.catatan && (
                  <div className="text-sm text-muted-foreground ml-6">
                    <em>Catatan: {transaction.catatan}</em>
                  </div>
                )}

                {/* Quick Actions - READ ONLY */}
                <div className="flex gap-2 pt-2 border-t">
                  {onPrint && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onPrint(transaction)}
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                  )}
                  {onShare && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onShare(transaction)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  )}
                </div>
              </div>
            </TableCell>
          </TableRow>
        </CollapsibleContent>
      </>
    </Collapsible>
  )
}