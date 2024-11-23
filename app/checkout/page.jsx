'use client'

import Script from 'next/script'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '../context/CartContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CreditCard, Loader2 } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from 'sonner'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to format GHC currency
const formatGHC = (amount) => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [paymentError, setPaymentError] = useState(null)
  const [order, setOrder] = useState(null)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'GH',
    shippingMethod: 'standard'
  })

  const [errors, setErrors] = useState({})

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shippingFee = formData.shippingMethod === 'express' ? 80 : 50
  const tax = subtotal * 0.125 // Ghana VAT rate is 12.5%
  const total = subtotal + shippingFee + tax

  // Check authentication status
  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      
      if (!session) {
        // Redirect to login if no session
        const returnUrl = encodeURIComponent(window.location.pathname)
        router.push(`/login?returnUrl=${returnUrl}`)
        return
      }

      setUser(session.user)
      setFormData(prev => ({
        ...prev,
        email: session.user.email || prev.email
      }))
    } catch (error) {
      console.error('Error checking authentication:', error)
      toast.error('Please log in to continue with checkout')
      router.push('/login')
    }
  }

  // Check for existing order ID in URL
  useEffect(() => {
    const orderId = searchParams.get('orderId')
    if (orderId && user) {
      fetchOrder(orderId)
    }
  }, [searchParams, user])

  const fetchOrder = async (orderId) => {
    try {
      const { data: orderData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single()

      if (error) throw error

      if (orderData.status === 'paid') {
        router.push(`/order-confirmation?orderId=${orderId}`)
        return
      }

      setOrder(orderData)
      setFormData({
        firstName: orderData.shipping_address?.firstName || '',
        lastName: orderData.shipping_address?.lastName || '',
        email: orderData.user_email || user?.email || '',
        address: orderData.shipping_address?.address || '',
        city: orderData.shipping_address?.city || '',
        postalCode: orderData.shipping_address?.postalCode || '',
        country: orderData.shipping_address?.country || 'GH',
        shippingMethod: orderData.shipping_method || 'standard'
      })
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('Error loading order details')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.address) newErrors.address = 'Address is required'
    if (!formData.city) newErrors.city = 'City is required'
    if (!formData.postalCode) newErrors.postalCode = 'Postal code is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const createOrUpdateOrder = async () => {
    if (!user) {
      toast.error('Please log in to continue with checkout')
      router.push('/login')
      return null
    }

    try {
      const orderData = {
        user_id: user.id,
        user_email: formData.email,
        shipping_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url
        })),
        shipping_method: formData.shippingMethod,
        status: 'pending',
        total_amount: Math.round(total * 100) // Store amount in cents/pesewas
      }

      if (order) {
        // Update existing order
        const { data: updatedOrder, error } = await supabase
          .from('orders')
          .update(orderData)
          .eq('id', order.id)
          .select()
          .single()

        if (error) throw error
        return updatedOrder
      } else {
        // Create new order
        const { data: newOrder, error } = await supabase
          .from('orders')
          .insert([orderData])
          .select()
          .single()

        if (error) throw error
        return newOrder
      }
    } catch (error) {
      console.error('Error creating/updating order:', error)
      throw new Error('Failed to process order')
    }
  }

  const handlePaystackPayment = async () => {
    if (!user) {
      toast.error('Please log in to continue with checkout')
      router.push('/login')
      return
    }

    if (!validateForm()) return

    setLoading(true)
    setPaymentError(null)

    try {
      // Create or update order
      const currentOrder = await createOrUpdateOrder()
      if (!currentOrder) return

      // Initialize Paystack payment
      const handler = PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: formData.email,
        amount: Math.round(total * 100), // Convert to pesewas
        currency: 'GHS',
        ref: `ORD-${currentOrder.id}-${Date.now()}`,
        metadata: {
          order_id: currentOrder.id,
          user_id: currentOrder.user_id,
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: currentOrder.id
            }
          ]
        },
        onSuccess: async (transaction) => {
          try {
            // Update order status
            const { error: updateError } = await supabase
              .from('orders')
              .update({ 
                status: 'paid',
                payment_reference: transaction.reference
              })
              .eq('id', currentOrder.id)

            if (updateError) throw updateError

            // Clear cart and redirect to success page
            clearCart()
            router.push(`/order-confirmation?orderId=${currentOrder.id}`)
          } catch (error) {
            console.error('Error updating order:', error)
            toast.error('Payment successful but error updating order. Please contact support.')
          }
        },
        onCancel: async () => {
          setLoading(false)
          toast.error('Payment was cancelled')
          
          // Update order status to cancelled
          await supabase
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('id', currentOrder.id)
        },
        callback: function(response) {
          // This is called after the onSuccess handler
          console.log('Payment callback:', response)
        },
        onClose: function() {
          setLoading(false)
        }
      })

      handler.openIframe()
    } catch (error) {
      console.error('Error processing payment:', error)
      toast.error(error.message || 'Error processing payment. Please try again.')
      setPaymentError('Error processing payment. Please try again.')
      setLoading(false)
    }
  }

  if (cart.length === 0 && !order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="mb-4">Add some products to your cart before checking out.</p>
        <Button onClick={() => router.push('/products')}>
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Script 
        src="https://js.paystack.co/v2/inline.js"
        strategy="lazyOnload"
      />
      
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(order?.items || cart).map((item, index) => (
                  <div key={item.id || index} className="flex gap-4 py-4 border-b">
                    <div className="relative w-24 h-24">
                      <Image
                        src={item.image_url || '/placeholder.png'}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">{formatGHC(item.price)}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatGHC(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Details */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="shippingMethod">Shipping Method</Label>
                <RadioGroup
                  value={formData.shippingMethod}
                  onValueChange={(value) => handleInputChange({ target: { name: 'shippingMethod', value } })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard">Standard Delivery (₵50) - 3-5 business days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express">Express Delivery (₵80) - 1-2 business days</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatGHC(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatGHC(shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (12.5%)</span>
                  <span>{formatGHC(tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatGHC(total)}</span>
                </div>

                {paymentError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{paymentError}</AlertDescription>
                  </Alert>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePaystackPayment}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay {formatGHC(total)}
                    </>
                  )}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  Secure payment powered by Paystack
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}