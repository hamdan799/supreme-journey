// OriginalName: StockMovementTracking
// ShortName: StockMove

import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { ArrowUp, ArrowDown, RefreshCw, Package } from 'lucide-react';

const movements = [
  {
    id: 1,
    type: 'in',
    item: 'LCD Samsung A02',
    qty: 5,
    source: 'Supplier - Toko Jaya',
    user: 'Admin',
    timestamp: '2024-12-07 14:30',
    ref: 'PO-001234',
  },
  {
    id: 2,
    type: 'out',
    item: 'IC Charging 1612',
    qty: 3,
    source: 'Service - NS-20241207-001',
    user: 'Teknisi A',
    timestamp: '2024-12-07 13:15',
    ref: 'NS-001',
  },
  {
    id: 3,
    type: 'out',
    item: 'Mic Universal',
    qty: 2,
    source: 'POS - Penjualan Langsung',
    user: 'Kasir',
    timestamp: '2024-12-07 12:00',
    ref: 'TX-002345',
  },
  {
    id: 4,
    type: 'in',
    item: 'Flexibel Vivo Y21',
    qty: 10,
    source: 'Supplier - Central Sparepart',
    user: 'Admin',
    timestamp: '2024-12-07 10:45',
    ref: 'PO-001235',
  },
  {
    id: 5,
    type: 'adjustment',
    item: 'LCD Infinix Hot 10',
    qty: -1,
    source: 'Stock Opname - Barang Rusak',
    user: 'Manager',
    timestamp: '2024-12-07 09:30',
    ref: 'ADJ-0012',
  },
  {
    id: 6,
    type: 'out',
    item: 'Baterai Samsung A02',
    qty: 4,
    source: 'Service - NS-20241207-002',
    user: 'Teknisi B',
    timestamp: '2024-12-06 16:20',
    ref: 'NS-002',
  },
];

const sourceBreakdown = [
  { source: 'Penjualan POS', count: 145, pct: 45 },
  { source: 'Service Order', count: 98, pct: 30 },
  { source: 'Supplier Restock', count: 65, pct: 20 },
  { source: 'Stock Adjustment', count: 16, pct: 5 },
];

export function StockMove() {
  return (
    <>
      <Card className="p-6">
        <h3 className="mb-4">Source Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {sourceBreakdown.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">{item.source}</span>
                <span className="text-sm text-muted-foreground">{item.pct}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all" 
                  style={{ width: `${item.pct}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{item.count} pergerakan</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4">Timeline Pergerakan Stok</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Tipe</th>
                <th className="text-left p-3">Barang</th>
                <th className="text-center p-3">Qty</th>
                <th className="text-left p-3">Source/Destination</th>
                <th className="text-left p-3">User</th>
                <th className="text-right p-3">Waktu</th>
                <th className="text-right p-3">Ref</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((mov) => (
                <tr key={mov.id} className="border-b hover:bg-muted/50">
                  <td className="p-3">
                    {mov.type === 'in' && (
                      <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                        <ArrowUp className="size-3" />
                        Masuk
                      </Badge>
                    )}
                    {mov.type === 'out' && (
                      <Badge variant="outline" className="gap-1 text-red-600 border-red-600">
                        <ArrowDown className="size-3" />
                        Keluar
                      </Badge>
                    )}
                    {mov.type === 'adjustment' && (
                      <Badge variant="outline" className="gap-1 text-orange-600 border-orange-600">
                        <RefreshCw className="size-3" />
                        Adjust
                      </Badge>
                    )}
                  </td>
                  <td className="p-3">{mov.item}</td>
                  <td className="text-center p-3">
                    <span className={mov.type === 'in' ? 'text-green-600' : mov.type === 'out' ? 'text-red-600' : 'text-orange-600'}>
                      {mov.qty > 0 ? '+' : ''}{mov.qty}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{mov.source}</td>
                  <td className="p-3 text-sm">{mov.user}</td>
                  <td className="text-right p-3 text-sm text-muted-foreground">{mov.timestamp}</td>
                  <td className="text-right p-3">
                    <Badge variant="secondary">{mov.ref}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
