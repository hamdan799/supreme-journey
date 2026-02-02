// OriginalName: VendorQualityAnalysis
// ShortName: VendQual

import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Truck } from 'lucide-react';

const vendorData = [
  {
    name: 'Toko Jaya Sparepart',
    reliabilityScore: 92,
    returnRate: 5,
    consistency: 95,
    deliveryAccuracy: 98,
    failureRate: 6,
    totalPurchases: 145,
    trend: 'up',
  },
  {
    name: 'Central Sparepart Indonesia',
    reliabilityScore: 88,
    returnRate: 8,
    consistency: 90,
    deliveryAccuracy: 95,
    failureRate: 10,
    totalPurchases: 128,
    trend: 'up',
  },
  {
    name: 'Supplier KW Murah',
    reliabilityScore: 65,
    returnRate: 28,
    consistency: 70,
    deliveryAccuracy: 85,
    failureRate: 32,
    totalPurchases: 85,
    trend: 'down',
  },
  {
    name: 'Distributor Resmi Samsung',
    reliabilityScore: 98,
    returnRate: 2,
    consistency: 98,
    deliveryAccuracy: 100,
    failureRate: 3,
    totalPurchases: 68,
    trend: 'stable',
  },
];

const vendorDetails = [
  {
    vendor: 'Toko Jaya Sparepart',
    items: ['LCD Samsung A02', 'IC Charging 1612', 'Flexibel Vivo Y21'],
    failureRate: 6,
    costPerformance: 'Sangat Baik',
    repeatIssue: 'Low',
    onTimeDelivery: 98,
  },
  {
    vendor: 'Supplier KW Murah',
    items: ['LCD Generic', 'Mic Brandless', 'Touchscreen KW'],
    failureRate: 32,
    costPerformance: 'Buruk',
    repeatIssue: 'High',
    onTimeDelivery: 85,
  },
];

export function VendQual() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Vendors</span>
            <Truck className="size-4 text-blue-600" />
          </div>
          <p className="text-2xl">8</p>
          <p className="text-xs text-muted-foreground mt-1">Active suppliers</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Top Vendor</span>
            <CheckCircle className="size-4 text-green-600" />
          </div>
          <p className="text-lg">Distributor Samsung</p>
          <p className="text-xs text-green-600 mt-1">Score: 98</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg Reliability</span>
            <TrendingUp className="size-4 text-green-600" />
          </div>
          <p className="text-2xl">86%</p>
          <p className="text-xs text-muted-foreground mt-1">Semua vendor</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg Return Rate</span>
            <AlertCircle className="size-4 text-orange-600" />
          </div>
          <p className="text-2xl">11%</p>
          <p className="text-xs text-muted-foreground mt-1">Across all vendors</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Problem Vendor</span>
            <AlertCircle className="size-4 text-red-600" />
          </div>
          <p className="text-lg">KW Murah</p>
          <p className="text-xs text-red-600 mt-1">32% fail rate</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4">Vendor Performance Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Vendor Name</th>
                <th className="text-center p-3">Reliability</th>
                <th className="text-center p-3">Return Rate</th>
                <th className="text-center p-3">Consistency</th>
                <th className="text-center p-3">Delivery</th>
                <th className="text-center p-3">Failure Rate</th>
                <th className="text-center p-3">Purchases</th>
                <th className="text-center p-3">Trend</th>
              </tr>
            </thead>
            <tbody>
              {vendorData.map((vendor, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="p-3">{vendor.name}</td>
                  <td className="text-center p-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${vendor.reliabilityScore >= 90 ? 'bg-green-600' : vendor.reliabilityScore >= 75 ? 'bg-blue-600' : 'bg-orange-600'}`}
                          style={{ width: `${vendor.reliabilityScore}%` }}
                        />
                      </div>
                      <span className="text-sm">{vendor.reliabilityScore}</span>
                    </div>
                  </td>
                  <td className="text-center p-3">
                    <span className={vendor.returnRate > 20 ? 'text-red-600' : vendor.returnRate > 10 ? 'text-orange-600' : 'text-green-600'}>
                      {vendor.returnRate}%
                    </span>
                  </td>
                  <td className="text-center p-3 text-sm">{vendor.consistency}%</td>
                  <td className="text-center p-3 text-sm">{vendor.deliveryAccuracy}%</td>
                  <td className="text-center p-3">
                    <Badge variant={vendor.failureRate > 20 ? 'destructive' : vendor.failureRate > 10 ? 'default' : 'secondary'}>
                      {vendor.failureRate}%
                    </Badge>
                  </td>
                  <td className="text-center p-3">{vendor.totalPurchases}</td>
                  <td className="text-center p-3">
                    {vendor.trend === 'up' && <TrendingUp className="size-4 text-green-600 mx-auto" />}
                    {vendor.trend === 'down' && <TrendingDown className="size-4 text-red-600 mx-auto" />}
                    {vendor.trend === 'stable' && <span className="text-muted-foreground">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4">Vendor Detail Analysis</h3>
        <div className="space-y-6">
          {vendorDetails.map((vd, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="mb-1">{vd.vendor}</h4>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {vd.items.map((item, iidx) => (
                      <Badge key={iidx} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Badge 
                  variant={vd.failureRate > 20 ? 'destructive' : vd.failureRate > 10 ? 'default' : 'secondary'}
                >
                  Failure: {vd.failureRate}%
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                <div className="p-3 bg-muted/50 rounded">
                  <div className="text-xs text-muted-foreground mb-1">Cost Performance</div>
                  <div className={vd.costPerformance === 'Sangat Baik' ? 'text-green-600' : vd.costPerformance === 'Baik' ? 'text-blue-600' : 'text-red-600'}>
                    {vd.costPerformance}
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded">
                  <div className="text-xs text-muted-foreground mb-1">Repeat Issue</div>
                  <div className={vd.repeatIssue === 'Low' ? 'text-green-600' : vd.repeatIssue === 'Medium' ? 'text-orange-600' : 'text-red-600'}>
                    {vd.repeatIssue}
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded">
                  <div className="text-xs text-muted-foreground mb-1">On-Time Delivery</div>
                  <div>{vd.onTimeDelivery}%</div>
                </div>
                <div className="p-3 bg-muted/50 rounded">
                  <div className="text-xs text-muted-foreground mb-1">Recommendation</div>
                  <div className={vd.costPerformance === 'Sangat Baik' ? 'text-green-600' : vd.costPerformance === 'Baik' ? 'text-blue-600' : 'text-red-600'}>
                    {vd.costPerformance === 'Buruk' ? 'Ganti Vendor' : 'Pertahankan'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-red-50 dark:bg-red-950/20 border-red-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="size-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="text-red-900 dark:text-red-100 mb-2">⚠️ Critical Alert</h4>
            <p className="text-sm text-red-800 dark:text-red-200 mb-3">
              Vendor "Supplier KW Murah" memiliki 30% part failure rate. Sparepart dari vendor ini menyebabkan 12 kasus repeat service dalam 30 hari terakhir.
            </p>
            <p className="text-sm text-red-900 dark:text-red-100">
              <strong>Recommendation:</strong> Pindahkan pembelian ke "Toko Jaya Sparepart" atau "Central Sparepart Indonesia" untuk meningkatkan kualitas.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}
