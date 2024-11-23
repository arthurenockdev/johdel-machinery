import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Sample data - replace with actual data from your database
const salesData = [
  { month: 'Jan', sales: 4000, orders: 240 },
  { month: 'Feb', sales: 3000, orders: 198 },
  { month: 'Mar', sales: 5000, orders: 300 },
  { month: 'Apr', sales: 2780, orders: 180 },
  { month: 'May', sales: 1890, orders: 120 },
  { month: 'Jun', sales: 2390, orders: 150 },
];

const trafficData = [
  { source: 'Direct', visits: 4000 },
  { source: 'Social', visits: 3000 },
  { source: 'Email', visits: 2000 },
  { source: 'Organic', visits: 2780 },
  { source: 'Referral', visits: 1890 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
        <select className="px-4 py-2 border rounded-md">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
          <option>Last year</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
          <p className="text-3xl font-bold">$24,780</p>
          <p className="text-sm text-green-600">+12% from last period</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600">Orders</h3>
          <p className="text-3xl font-bold">1,482</p>
          <p className="text-sm text-green-600">+5% from last period</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600">Conversion Rate</h3>
          <p className="text-3xl font-bold">3.2%</p>
          <p className="text-sm text-red-600">-0.4% from last period</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600">Avg. Order Value</h3>
          <p className="text-3xl font-bold">$158</p>
          <p className="text-sm text-green-600">+2% from last period</p>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Sales Overview</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                stroke="#8884d8"
                name="Sales ($)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#82ca9d"
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Traffic Sources */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Traffic Sources</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="visits" fill="#8884d8" name="Visits" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Customer Behavior */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Popular Products</h3>
          <div className="space-y-4">
            {/* Sample product stats */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Product Name</p>
                <p className="text-sm text-gray-500">234 sales</p>
              </div>
              <p className="text-green-600">$12,345</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Customer Demographics</h3>
          <div className="space-y-4">
            {/* Sample demographics */}
            <div className="flex justify-between items-center">
              <p className="font-medium">Age 25-34</p>
              <p>45%</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
