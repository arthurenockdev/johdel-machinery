'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  AlertCircle, 
  Loader2, 
  Clock, 
  Share2,
  Printer,
  Download,
  ShoppingBag
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { toast } from 'sonner'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const OrderStatus = {
  pending: { 
    label: 'Pending', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: Clock,
    progress: 33,
    message: 'Awaiting payment confirmation'
  },
  paid: { 
    label: 'Paid', 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle2,
    progress: 66,
    message: 'Order confirmed and being processed'
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-blue-100 text-blue-800',
    icon: Truck,
    progress: 100,
    message: 'Your order is on its way'
  },
  cancelled: { 
    label: 'Cancelled', 
    color: 'bg-red-100 text-red-800', 
    icon: AlertCircle,
    progress: 0,
    message: 'This order has been cancelled'
  }
}

export default function OrderConfirmationPage() {
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('No order ID provided')
        setLoading(false)
        return
      }

      try {
        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) throw userError

        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single()

        if (orderError) throw orderError

        if (!order) {
          throw new Error('Order not found')
        }

        // Verify the order belongs to the current user
        if (order.user_id !== user.id) {
          throw new Error('Unauthorized access to order')
        }

        setOrderDetails({
          ...order,
          items: order.items || [],
          date: new Date(order.created_at).toLocaleDateString(),
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
        })
      } catch (err) {
        console.error('Error fetching order:', err)
        setError(err.message === 'Unauthorized access to order' 
          ? 'You do not have permission to view this order.'
          : 'Error loading order details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'My Order',
        text: `Check out my order #${orderDetails.id.slice(0, 8)}`,
        url: window.location.href
      })
    } catch (err) {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Order link copied to clipboard!')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadInvoice = async () => {
    try {
      // In a real app, you would generate a PDF invoice here
      toast.success('Invoice download started...')
    } catch (err) {
      toast.error('Failed to download invoice')
    }
  }

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          className="mt-4" 
          onClick={() => router.push('/products')}
        >
          Continue Shopping
        </Button>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Order Not Found</AlertTitle>
          <AlertDescription>
            We couldn't find your order. Please check your order ID or contact support.
          </AlertDescription>
        </Alert>
        <Button 
          className="mt-4" 
          onClick={() => router.push('/products')}
        >
          Continue Shopping
        </Button>
      </div>
    )
  }

  const status = OrderStatus[orderDetails.status] || OrderStatus.pending
  const StatusIcon = status.icon
  const subtotal = calculateTotal(orderDetails.items)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Order Status Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${status.color} rounded-full mb-4`}>
            <StatusIcon className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order {status.label}</h1>
          <p className="text-gray-600 mb-4">{status.message}</p>
          <Progress value={status.progress} className="w-full max-w-md mx-auto" />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8 print:hidden">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          {orderDetails.status === 'paid' && (
            <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
              <Download className="h-4 w-4 mr-2" />
              Invoice
            </Button>
          )}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Order Details</span>
              <Badge className={status.color}>
                {status.label}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Order Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-medium">#{orderDetails.id.slice(0, 8)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{orderDetails.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                {orderDetails.payment_reference && (
                  <p className="text-xs text-gray-500 mt-1">
                    Ref: {orderDetails.payment_reference}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated Delivery</p>
                <p className="font-medium">{orderDetails.estimatedDelivery}</p>
              </div>
            </div>

            <Separator />

            {/* Shipping Address */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center">
                <Truck className="h-4 w-4 mr-2" />
                Shipping Address
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                  {orderDetails.shipping_address?.firstName} {orderDetails.shipping_address?.lastName}<br />
                  {orderDetails.shipping_address?.address}<br />
                  {orderDetails.shipping_address?.city}, {orderDetails.shipping_address?.postalCode}<br />
                  {orderDetails.shipping_address?.country}
                </p>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Order Items
              </h3>
              <div className="space-y-4">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                    <div className="relative w-20 h-20">
                      <Image
                        src={item.image_url || '/placeholder.png'}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × {new Intl.NumberFormat('en-GH', {
                          style: 'currency',
                          currency: 'GHS'
                        }).format(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {new Intl.NumberFormat('en-GH', {
                          style: 'currency',
                          currency: 'GHS'
                        }).format(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{new Intl.NumberFormat('en-GH', {
                  style: 'currency',
                  currency: 'GHS'
                }).format(subtotal)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{new Intl.NumberFormat('en-GH', {
                  style: 'currency',
                  currency: 'GHS'
                }).format(orderDetails.total_amount)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between print:hidden">
            <Button 
              variant="outline"
              onClick={() => router.push('/products')}
            >
              Continue Shopping
            </Button>
            {orderDetails.status === 'pending' && (
              <Button 
                onClick={() => router.push(`/checkout?orderId=${orderDetails.id}`)}
              >
                Complete Payment
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Status-specific Alerts */}
        {orderDetails.status === 'paid' && (
          <Alert>
            <Truck className="h-4 w-4" />
            <AlertTitle>Shipping Update</AlertTitle>
            <AlertDescription>
              Your order is being prepared for shipping. You will receive tracking information once it's dispatched.
            </AlertDescription>
          </Alert>
        )}

        {orderDetails.status === 'pending' && (
          <Alert>
            <CreditCard className="h-4 w-4" />
            <AlertTitle>Payment Required</AlertTitle>
            <AlertDescription>
              Please complete your payment to process your order. Click the "Complete Payment" button above.
            </AlertDescription>
          </Alert>
        )}

        {/* Print-only Footer */}
        <div className="hidden print:block mt-8 text-center text-sm text-gray-500">
          <p>Thank you for shopping with us!</p>
          <p>For any questions, please contact support@yourecommerce.com</p>
        </div>
      </div>
    </div>
  )
}