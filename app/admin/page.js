'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Package, 
  AlertCircle,
  BarChart3,
  Clock
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all products
        const { data: products, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Calculate stats
        const totalProducts = products.length;
        const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
        const lowStock = products.filter(product => product.stock <= 10);
        const categoryCounts = products.reduce((acc, product) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        }, {});

        setStats([
          {
            title: 'Total Products',
            value: totalProducts.toString(),
            icon: Package,
            description: `${Object.keys(categoryCounts).length} categories`,
            trend: 'info',
          },
          {
            title: 'Total Inventory Value',
            value: `$${totalValue.toFixed(2)}`,
            icon: BarChart3,
            description: 'Current stock value',
            trend: 'up',
          },
          {
            title: 'Low Stock Items',
            value: lowStock.length.toString(),
            icon: AlertCircle,
            description: 'Products with ≤10 items',
            trend: lowStock.length > 5 ? 'down' : 'up',
          },
          {
            title: 'Recent Updates',
            value: products.filter(p => {
              const updateDate = new Date(p.updated_at || p.created_at);
              const lastWeek = new Date();
              lastWeek.setDate(lastWeek.getDate() - 7);
              return updateDate > lastWeek;
            }).length.toString(),
            icon: Clock,
            description: 'Updated in last 7 days',
            trend: 'info',
          },
        ]);

        // Set recent products (last 5)
        setRecentProducts(products.slice(0, 5));

        // Set low stock products
        setLowStockProducts(lowStock.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'bg-green-100 text-green-600';
      case 'down':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats && stats.map((stat) => {
          const Icon = stat.icon;
          const trendColor = getTrendColor(stat.trend);
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-semibold mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${trendColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">{stat.description}</span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Products */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recently Added Products</h3>
          <div className="space-y-4">
            {recentProducts.length === 0 ? (
              <p className="text-gray-600">No products added yet</p>
            ) : (
              recentProducts.map((product) => (
                <Link 
                  href="/admin/inventory" 
                  key={product.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">${product.price}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </span>
                </Link>
              ))
            )}
          </div>
        </Card>

        {/* Low Stock Products */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Low Stock Alert</h3>
          <div className="space-y-4">
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-600">No products with low stock</p>
            ) : (
              lowStockProducts.map((product) => (
                <Link 
                  href="/admin/inventory" 
                  key={product.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">${product.price}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-red-600">
                    Only {product.stock} left
                  </span>
                </Link>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
