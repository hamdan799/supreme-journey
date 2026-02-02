// OriginalName: RepairPerformanceAnalysis
// ShortName: RepairPerf

import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { CheckCircle, XCircle, Clock, RotateCcw, Wrench } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const kpiData = {
  totalService: 342,
  successRate: 92,
  avgRepairTime: 4.5,
  repeatRate: 8,
  commonIssue: 'Charging Problem',
  problematicModel: 'Infinix Hot 10',
};

const timelineData = [
  { date: '1 Des', masuk: 12, sukses: 11, gagal: 1, repeat: 0 },
  { date: '2 Des', masuk: 15, sukses: 14, gagal: 1, repeat: 0 },
  { date: '3 Des', masuk: 18, sukses: 16, gagal: 1, repeat: 1 },
  { date: '4 Des', masuk: 14, sukses: 13, gagal: 1, repeat: 0 },
  { date: '5 Des', masuk: 20, sukses: 18, gagal: 1, repeat: 1 },
  { date: '6 Des', masuk: 16, sukses: 15, gagal: 0, repeat: 1 },
  { date: '7 Des', masuk: 13, sukses: 12, gagal: 1, repeat: 0 },
];

const modelBreakdown = [
  {
    brand: 'Infinix',
    model: 'Hot 10',
    totalRepair: 45,
    commonIssue: 'Mic Problem (lawan bicara tidak dengar)',
    repeatIssues: 8,
    typicalFix: 'Jalur Mic Upper Board (78%)',
  },
  {
    brand: 'Samsung',
    model: 'A02',
    totalRepair: 38,
    commonIssue: 'LCD Tidak Tampil',
    repeatIssues: 4,
    typicalFix: 'Ganti LCD + Check Connector (85%)',
  },
  {
    brand: 'Vivo',
    model: 'Y21',
    totalRepair: 32,
    commonIssue: 'Charging Lambat/Tidak Ngecas',
    repeatIssues: 6,
    typicalFix: 'IC Charging 1612 (65%)',
  },
  {
    brand: 'OPPO',
    model: 'A5s',
    totalRepair: 28,
    commonIssue: 'Touchscreen Tidak Responsif',
    repeatIssues: 5,
    typicalFix: 'Ganti Touchscreen (72%)',
  },
];

const issuePatterns = [
  { part: 'Mic / Audio', count: 58, avgTime: 3.5, difficulty: 'Sedang' },
  { part: 'Charging IC', count: 52, avgTime: 5.2, difficulty: 'Susah' },
  { part: 'LCD / Display', count: 48, avgTime: 2.8, difficulty: 'Mudah' },
  { part: 'Touchscreen', count: 35, avgTime: 3.0, difficulty: 'Mudah' },
  { part: 'Backlight', count: 28, avgTime: 6.5, difficulty: 'Susah' },
  { part: 'Baseband / Sinyal', count: 22, avgTime: 8.0, difficulty: 'Sangat Susah' },
];

export function RepairPerf() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Service</span>
            <Wrench className="size-4 text-blue-600" />
          </div>
          <p className="text-2xl">{kpiData.totalService}</p>
          <p className="text-xs text-muted-foreground mt-1">30 hari terakhir</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Success Rate</span>
            <CheckCircle className="size-4 text-green-600" />
          </div>
          <p className="text-2xl">{kpiData.successRate}%</p>
          <p className="text-xs text-green-600 mt-1">Sangat baik</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg Repair Time</span>
            <Clock className="size-4 text-orange-600" />
          </div>
          <p className="text-2xl">{kpiData.avgRepairTime}h</p>
          <p className="text-xs text-muted-foreground mt-1">Per kasus</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Repeat Rate</span>
            <RotateCcw className="size-4 text-red-600" />
          </div>
          <p className="text-2xl">{kpiData.repeatRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">28 kasus repeat</p>
        </Card>

        <Card className="p-4">
          <div className="mb-2">
            <span className="text-sm text-muted-foreground">Common Issue</span>
          </div>
          <p className="text-lg">{kpiData.commonIssue}</p>
          <p className="text-xs text-muted-foreground mt-1">52 kasus</p>
        </Card>

        <Card className="p-4">
          <div className="mb-2">
            <span className="text-sm text-muted-foreground">Problematic Model</span>
          </div>
          <p className="text-lg">{kpiData.problematicModel}</p>
          <p className="text-xs text-muted-foreground mt-1">45 repair cases</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4">Repair Timeline (7 Hari)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="masuk" fill="#3b82f6" name="Masuk" />
            <Bar dataKey="sukses" fill="#10b981" name="Sukses" />
            <Bar dataKey="gagal" fill="#ef4444" name="Gagal" />
            <Bar dataKey="repeat" fill="#f59e0b" name="Repeat" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4">Breakdown Per Model</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Brand / Model</th>
                <th className="text-center p-3">Total Repair</th>
                <th className="text-left p-3">Common Issue</th>
                <th className="text-center p-3">Repeat</th>
                <th className="text-left p-3">Typical Fix</th>
              </tr>
            </thead>
            <tbody>
              {modelBreakdown.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="p-3">
                    <div>
                      <p>{item.brand}</p>
                      <p className="text-sm text-muted-foreground">{item.model}</p>
                    </div>
                  </td>
                  <td className="text-center p-3">{item.totalRepair}</td>
                  <td className="p-3 text-sm">{item.commonIssue}</td>
                  <td className="text-center p-3">
                    <Badge variant={item.repeatIssues > 5 ? 'destructive' : 'secondary'}>
                      {item.repeatIssues}
                    </Badge>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{item.typicalFix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4">Pola Kerusakan Per Part</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Part / Komponen</th>
                <th className="text-center p-3">Jumlah</th>
                <th className="text-center p-3">Avg Time (jam)</th>
                <th className="text-center p-3">Tingkat Kesulitan</th>
              </tr>
            </thead>
            <tbody>
              {issuePatterns.map((issue, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="p-3">{issue.part}</td>
                  <td className="text-center p-3">{issue.count}</td>
                  <td className="text-center p-3">{issue.avgTime}h</td>
                  <td className="text-center p-3">
                    <Badge 
                      variant={
                        issue.difficulty === 'Mudah' ? 'default' : 
                        issue.difficulty === 'Sedang' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {issue.difficulty}
                    </Badge>
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
