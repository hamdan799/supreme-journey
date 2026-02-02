// OriginalName: TimePatternAnalysis
// ShortName: TimePat

import { Card } from '../../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const hourlyData = [
  { hour: '08:00', sales: 12 },
  { hour: '09:00', sales: 18 },
  { hour: '10:00', sales: 25 },
  { hour: '11:00', sales: 32 },
  { hour: '12:00', sales: 28 },
  { hour: '13:00', sales: 22 },
  { hour: '14:00', sales: 38 },
  { hour: '15:00', sales: 42 },
  { hour: '16:00', sales: 35 },
  { hour: '17:00', sales: 28 },
  { hour: '18:00', sales: 15 },
  { hour: '19:00', sales: 8 },
];

const dailyData = [
  { day: 'Sen', sales: 145 },
  { day: 'Sel', sales: 168 },
  { day: 'Rab', sales: 152 },
  { day: 'Kam', sales: 178 },
  { day: 'Jum', sales: 192 },
  { day: 'Sab', sales: 210 },
  { day: 'Min', sales: 98 },
];

export function TimePat() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="mb-4">Pola Penjualan per Jam</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Jam sibuk: <span className="text-foreground">14:00 - 16:00</span>
        </p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#10b981" name="Transaksi" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4">Pola Penjualan per Hari</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Hari tersibuk: <span className="text-foreground">Sabtu</span>
        </p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#3b82f6" name="Transaksi" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
