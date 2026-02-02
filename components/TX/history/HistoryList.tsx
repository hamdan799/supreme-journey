// OriginalName: TransactionHistoryList
// ShortName: HistoryList

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table'
import { HistoryItem } from './HistoryItem'
import type { Transaction } from '../../../types/financial'

interface HistoryListProps {
  transactions: Transaction[]
  onViewDetail: (transaction: Transaction) => void
  onPrint?: (transaction: Transaction) => void
  onShare?: (transaction: Transaction) => void
}

export function HistoryList({ transactions, onViewDetail, onPrint, onShare }: HistoryListProps) {
  if (transactions.length === 0) {
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Tanggal</TableHead>
              <TableHead>Invoice / Jenis</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Tidak ada transaksi
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Tanggal</TableHead>
            <TableHead>Invoice / Jenis</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <HistoryItem
              key={transaction.id}
              transaction={transaction}
              onViewDetail={onViewDetail}
              onPrint={onPrint}
              onShare={onShare}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
