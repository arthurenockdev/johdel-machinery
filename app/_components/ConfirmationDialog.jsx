'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ConfirmationDialog({ isOpen, onClose, product }) {
  const router = useRouter()

  const handleViewCart = () => {
    onClose()
    router.push('/cart')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Added to Cart</DialogTitle>
          <DialogDescription>
            {product?.name} has been successfully added to your cart.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={onClose}>
            Continue Shopping
          </Button>
          <Button type="button" onClick={handleViewCart}>
            View Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}