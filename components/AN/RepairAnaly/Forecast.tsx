// OriginalName: ForecastPrediction
// ShortName: Forecast

import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { TrendingUp, Package, Wrench, DollarSign, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const formatRupiah = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
};

const serviceForecast = [
  { month: 'Jul', actual: 98, forecast: null },
  { month: 'Agt', actual: 112, forecast: null },
  { month: 'Sep', actual: 105, forecast: null },
  { month: 'Okt', actual: 125, forecast: null },
  { month: 'Nov', actual: 118, forecast: null },
  { month: 'Des', actual: 95, forecast: 105 },
  { month: 'Jan', actual: null, forecast: 128 },
  { month: 'Feb', actual: null, forecast: 135 },
  { month: 'Mar', actual: null, forecast: 142 },
];

const predictions = [
  {
    type: 'service',
    icon: Wrench,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    title: 'Prediksi Service Bulan Depan',
    prediction: '128 kasus (+8%)',
    confidence: 87,
    detail: 'Berdasarkan tren 60 hari terakhir',
  },
  {
    type: 'sparepart',
    icon: Package,
    color: 'text-green-600',
    bg: 'bg-green-100',
    title: 'Kebutuhan Sparepart',
    prediction: 'IC Charging 1612: +5 unit',
    confidence: 82,
    detail: 'Diprediksi charging problem naik 28%',
  },
  {
    type: 'revenue',
    icon: DollarSign,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    title: 'Revenue Service',
    prediction: formatRupiah(18500000),
    confidence: 79,
    detail: 'Estimasi dari prediksi jumlah kasus',
  },
  {
    type: 'issue',
    icon: AlertTriangle,
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    title: 'Model yang Akan Naik',
    prediction: 'Infinix Hot 10 (+28%)',
    confidence: 85,
    detail: 'Kerusakan charging diprediksi meningkat',
  },
];

const sparepartNeeds = [
  { sparepart: 'IC Charging 1612', currentStock: 8, predicted: 13, recommendation: '+5 unit', urgency: 'high' },
  { sparepart: 'LCD Samsung A02', currentStock: 12, predicted: 15, recommendation: '+3 unit', urgency: 'medium' },
  { sparepart: 'Mic Universal', currentStock: 25, predicted: 28, recommendation: '+3 unit', urgency: 'low' },
  { sparepart: 'Flexibel Vivo Y21', currentStock: 6, predicted: 10, recommendation: '+4 unit', urgency: 'high' },
];

export function Forecast() {
  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="size-5 text-purple-600" />
          <h3>Service Forecast (3 Bulan Ke Depan)</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={serviceForecast}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Actual"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="forecast" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Forecast"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Prediksi berdasarkan data 60 hari terakhir dengan confidence level 85%
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predictions.map((pred, idx) => (
          <Card key={idx} className="p-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${pred.bg}`}>
                <pred.icon className={`size-6 ${pred.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="mb-1">{pred.title}</h4>
                <p className="text-2xl mb-2">{pred.prediction}</p>
                <p className="text-sm text-muted-foreground mb-3">{pred.detail}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${pred.color.replace('text-', 'bg-')}`}
                      style={{ width: `${pred.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">{pred.confidence}% confidence</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="mb-4">Prediksi Kebutuhan Sparepart</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Rekomendasi restock berdasarkan prediksi service bulan depan
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Sparepart</th>
                <th className="text-center p-3">Stock Saat Ini</th>
                <th className="text-center p-3">Predicted Need</th>
                <th className="text-center p-3">Recommendation</th>
                <th className="text-center p-3">Urgency</th>
              </tr>
            </thead>
            <tbody>
              {sparepartNeeds.map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="p-3">{item.sparepart}</td>
                  <td className="text-center p-3">{item.currentStock}</td>
                  <td className="text-center p-3">{item.predicted}</td>
                  <td className="text-center p-3">
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      {item.recommendation}
                    </Badge>
                  </td>
                  <td className="text-center p-3">
                    <Badge 
                      variant={item.urgency === 'high' ? 'destructive' : item.urgency === 'medium' ? 'default' : 'secondary'}
                    >
                      {item.urgency === 'high' ? 'High' : item.urgency === 'medium' ? 'Medium' : 'Low'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 bg-orange-50 dark:bg-orange-950/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="size-5 text-orange-600 mt-0.5" />
          <div>
            <h4 className="text-orange-900 dark:text-orange-100 mb-2">📈 Forecast Alert</h4>
            <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
              Berdasarkan 60 hari data, diprediksi bulan depan kerusakan charging pada Infinix akan naik 28%. 
              Persiapkan stok IC Charging 1612 minimal +5 unit untuk mengantisipasi lonjakan permintaan.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-white dark:bg-gray-900 rounded">
                <span className="text-muted-foreground">Confidence Level: </span>
                <span className="text-orange-600">82%</span>
              </div>
              <div className="p-2 bg-white dark:bg-gray-900 rounded">
                <span className="text-muted-foreground">Action: </span>
                <span>Restok IC 1612 minggu ini</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
