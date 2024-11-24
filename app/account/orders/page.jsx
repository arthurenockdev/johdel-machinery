'use client'

export const runtime = 'edge';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from 'lucide-react'

// This would typically come from your API
const mockOrders = [
  { id: 'ORD-001', date: '2023-06-01', total: 150.00, status: 'delivered' },
  { id: 'ORD-002', date: '2023-06-15', total: 89.99, status: 'shipped' },
  { id: 'ORD-003', date: '2023-06-30', total: 249.99, status: 'processing' },
]

export default function OrderManagementPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulating API call to fetch orders
    setTimeout(() => {
      setOrders(mockOrders)
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>
      case 'shipped':
        return <Badge variant="primary">Shipped</Badge>
      case 'delivered':
        return <Badge variant="success">Delivered</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleTrackOrder = (orderId) => {
    router.push(`/account/orders/${orderId}`)
  }

  const handleDownloadInvoice = (orderId) => {
    // This would typically trigger an API call to generate and download the invoice
    console.log(`Downloading invoice for order ${orderId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => handleTrackOrder(order.id)}>
                      Track Order
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(order.id)}>
                      Download Invoice
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}