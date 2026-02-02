// OriginalName: SparepartQualityAnalysis
// ShortName: SPQual

import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { AlertTriangle, CheckCircle, TrendingUp, Package } from 'lucide-react';

const kpiData = {
  avgFailureRate: 12,
  repeatLinked: 28,
  avgLifespan: 180,
};

const sparepartTracking = [
  {
    name: 'LCD Samsung A02 (Original)',
    category: 'Brand Official',
    qualityScore: 95,
    failureRate: 5,
    repeatCause: 2,
    avgLifespan: 365,
    installs: 42,
  },
  {
    name: 'IC Charging 1612 (OEM)',
    category: 'OEM',
    qualityScore: 88,
    failureRate: 12,
    repeatCause: 5,
    avgLifespan: 240,
    installs: 38,
  },
  {
    name: 'Mic Universal (Brandless)',
    category: 'Brandless',
    qualityScore: 78,
    failureRate: 22,
    repeatCause: 8,
    avgLifespan: 120,
    installs: 52,
  },
  {
    name: 'LCD Infinix Hot 10 (KW)',
    category: 'KW/Non-Original',
    qualityScore: 65,
    failureRate: 35,
    repeatCause: 12,
    avgLifespan: 90,
    installs: 28,
  },
  {
    name: 'Flexibel Vivo Y21 (Original)',
    category: 'Brand Official',
    qualityScore: 92,
    failureRate: 8,
    repeatCause: 3,
    avgLifespan: 300,
    installs: 25,
  },
];

const caseStudies = [
  {
    sparepart: 'LCD A02 KW',
    issue: 'High repeat rate',
    finding: '23% repeat dalam 30 hari - touchscreen bermasalah setelah instalasi',
    recommendation: 'Ganti supplier atau naikkan ke grade Original',
  },
  {
    sparepart: 'Mic Infinix Hot 10 Brandless',
    issue: 'Root cause confusion',
    finding: '12 kasus "tidak ada suara" → 80% jalur mic, bukan sparepartnya',
    recommendation: 'Sparepart sebenarnya aman. Fokus ke perbaikan jalur.',
  },
];

export function SPQual() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg Failure Rate</span>
            <AlertTriangle className="size-4 text-orange-600" />
          </div>
          <p className="text-2xl">{kpiData.avgFailureRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">Semua sparepart</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Repeat Linked to Part</span>
            <Package className="size-4 text-red-600" />
          </div>
          <p className="text-2xl">{kpiData.repeatLinked}</p>
          <p className="text-xs text-muted-foreground mt-1">Dari 342 total service</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg Lifespan</span>
            <TrendingUp className="size-4 text-green-600" />
          </div>
          <p className="text-2xl">{kpiData.avgLifespan} hari</p>
          <p className="text-xs text-muted-foreground mt-1">Sebelum repeat service</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4">Sparepart Quality Tracking</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Nama Sparepart</th>
                <th className="text-left p-3">Kategori</th>
                <th className="text-center p-3">Quality Score</th>
                <th className="text-center p-3">Failure Rate</th>
                <th className="text-center p-3">Repeat Cause</th>
                <th className="text-center p-3">Avg Lifespan</th>
                <th className="text-center p-3">Installs</th>
              </tr>
            </thead>
            <tbody>
              {sparepartTracking.map((sp, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="p-3">{sp.name}</td>
                  <td className="p-3">
                    <Badge variant="outline">{sp.category}</Badge>
                  </td>
                  <td className="text-center p-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${sp.qualityScore >= 90 ? 'bg-green-600' : sp.qualityScore >= 75 ? 'bg-blue-600' : 'bg-orange-600'}`}
                          style={{ width: `${sp.qualityScore}%` }}
                        />
                      </div>
                      <span className="text-sm">{sp.qualityScore}</span>
                    </div>
                  </td>
                  <td className="text-center p-3">
                    <span className={sp.failureRate > 20 ? 'text-red-600' : sp.failureRate > 10 ? 'text-orange-600' : 'text-green-600'}>
                      {sp.failureRate}%
                    </span>
                  </td>
                  <td className="text-center p-3">
                    <Badge variant={sp.repeatCause > 8 ? 'destructive' : 'secondary'}>
                      {sp.repeatCause}
                    </Badge>
                  </td>
                  <td className="text-center p-3 text-sm text-muted-foreground">{sp.avgLifespan} hari</td>
                  <td className="text-center p-3">{sp.installs}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-green-50 dark:bg-green-950/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="size-4 text-green-600" />
            <span className="text-sm">Brand Official</span>
          </div>
          <p className="text-xl text-green-600">93%</p>
          <p className="text-xs text-muted-foreground mt-1">Quality score rata-rata</p>
        </Card>

        <Card className="p-4 bg-blue-50 dark:bg-blue-950/20">
          <div className="flex items-center gap-2 mb-2">
            <Package className="size-4 text-blue-600" />
            <span className="text-sm">OEM</span>
          </div>
          <p className="text-xl text-blue-600">85%</p>
          <p className="text-xs text-muted-foreground mt-1">Quality score rata-rata</p>
        </Card>

        <Card className="p-4 bg-orange-50 dark:bg-orange-950/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="size-4 text-orange-600" />
            <span className="text-sm">Brandless</span>
          </div>
          <p className="text-xl text-orange-600">75%</p>
          <p className="text-xs text-muted-foreground mt-1">Quality score rata-rata</p>
        </Card>

        <Card className="p-4 bg-red-50 dark:bg-red-950/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="size-4 text-red-600" />
            <span className="text-sm">KW / Non-Original</span>
          </div>
          <p className="text-xl text-red-600">62%</p>
          <p className="text-xs text-muted-foreground mt-1">Quality score rata-rata</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4">Use Case Real (Findings)</h3>
        <div className="space-y-4">
          {caseStudies.map((cs, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="mb-1">{cs.sparepart}</h4>
                  <Badge variant="outline" className="text-xs">{cs.issue}</Badge>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Finding: </span>
                  <span>{cs.finding}</span>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded">
                  <span className="text-muted-foreground">Recommendation: </span>
                  <span className="text-blue-600">{cs.recommendation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
