// OriginalName: BrandModelAnalysis
// ShortName: BrandModel

import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const brandPerformance = [
  {
    brand: 'Samsung',
    turnover: 92,
    failureRate: 8,
    sparepartCount: 145,
    score: 'A',
    trend: 'up',
  },
  {
    brand: 'Infinix',
    turnover: 85,
    failureRate: 15,
    sparepartCount: 98,
    score: 'B',
    trend: 'up',
  },
  {
    brand: 'Vivo',
    turnover: 78,
    failureRate: 12,
    sparepartCount: 112,
    score: 'B',
    trend: 'stable',
  },
  {
    brand: 'OPPO',
    turnover: 65,
    failureRate: 18,
    sparepartCount: 88,
    score: 'C',
    trend: 'down',
  },
];

const modelFailures = [
  {
    model: 'Infinix Hot 10',
    issue: 'Mic Problem',
    count: 18,
    rootCause: 'Jalur Mic Upper Board (78%)',
    sparepartUsed: 'Mic Universal',
    failRate: 22,
  },
  {
    model: 'Samsung A02',
    issue: 'LCD Tidak Tampil',
    count: 15,
    rootCause: 'LCD Connector (65%)',
    sparepartUsed: 'LCD A02',
    failRate: 12,
  },
  {
    model: 'Vivo Y21',
    issue: 'Charging Bermasalah',
    count: 12,
    rootCause: 'IC Charging 1612 (55%)',
    sparepartUsed: 'IC 1612',
    failRate: 18,
  },
];

const sparepartMapping = [
  { sparepart: 'LCD Samsung A02', brands: ['Samsung'], usage: 28, compatibility: 95 },
  { sparepart: 'Mic Universal', brands: ['Infinix', 'Vivo', 'OPPO'], usage: 42, compatibility: 78 },
  { sparepart: 'IC Charging 1612', brands: ['Vivo', 'Xiaomi', 'Realme'], usage: 35, compatibility: 88 },
  { sparepart: 'Flexibel Brandless', brands: ['Generic'], usage: 18, compatibility: 62 },
];

export function BrandModel() {
  return (
    <>
      <Card className="p-6">
        <h3 className="mb-4">Brand Performance Score</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Brand</th>
                <th className="text-center p-3">Turnover</th>
                <th className="text-center p-3">Failure Rate</th>
                <th className="text-center p-3">Sparepart</th>
                <th className="text-center p-3">Score</th>
                <th className="text-center p-3">Trend</th>
              </tr>
            </thead>
            <tbody>
              {brandPerformance.map((brand, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="p-3">{brand.brand}</td>
                  <td className="text-center p-3">
                    <span className="text-green-600">{brand.turnover}%</span>
                  </td>
                  <td className="text-center p-3">
                    <span className={brand.failureRate > 15 ? 'text-red-600' : 'text-orange-600'}>
                      {brand.failureRate}%
                    </span>
                  </td>
                  <td className="text-center p-3">{brand.sparepartCount}</td>
                  <td className="text-center p-3">
                    <Badge 
                      variant={brand.score === 'A' ? 'default' : brand.score === 'B' ? 'secondary' : 'outline'}
                    >
                      {brand.score}
                    </Badge>
                  </td>
                  <td className="text-center p-3">
                    {brand.trend === 'up' && <TrendingUp className="size-4 text-green-600 mx-auto" />}
                    {brand.trend === 'down' && <TrendingDown className="size-4 text-red-600 mx-auto" />}
                    {brand.trend === 'stable' && <span className="text-muted-foreground">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="size-5 text-orange-600" />
          <h3>Model-Failure Mapping</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Pola kerusakan spesifik per model berdasarkan data service
        </p>
        <div className="space-y-4">
          {modelFailures.map((item, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="mb-1">{item.model}</h4>
                  <p className="text-sm text-muted-foreground">{item.issue}</p>
                </div>
                <Badge variant="outline">{item.count} kasus</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="p-2 bg-muted/50 rounded">
                  <div className="text-xs text-muted-foreground mb-1">Root Cause</div>
                  <div>{item.rootCause}</div>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <div className="text-xs text-muted-foreground mb-1">Sparepart Dipakai</div>
                  <div>{item.sparepartUsed}</div>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <div className="text-xs text-muted-foreground mb-1">Failure Rate</div>
                  <div className={item.failRate > 15 ? 'text-red-600' : 'text-orange-600'}>
                    {item.failRate}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4">Sparepart Mapping</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Sparepart yang paling sering dipakai untuk brand tertentu
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Sparepart</th>
                <th className="text-left p-3">Compatible Brands</th>
                <th className="text-center p-3">Usage 30d</th>
                <th className="text-center p-3">Compatibility</th>
              </tr>
            </thead>
            <tbody>
              {sparepartMapping.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="p-3">{item.sparepart}</td>
                  <td className="p-3">
                    <div className="flex gap-1 flex-wrap">
                      {item.brands.map((brand, bidx) => (
                        <Badge key={bidx} variant="secondary" className="text-xs">
                          {brand}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="text-center p-3">{item.usage}x</td>
                  <td className="text-center p-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-600" 
                          style={{ width: `${item.compatibility}%` }}
                        />
                      </div>
                      <span className="text-sm">{item.compatibility}%</span>
                    </div>
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
