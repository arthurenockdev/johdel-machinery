'use client'

import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Star, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import ConfirmationDialog from '../_components/ConfirmationDialog'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const ITEMS_PER_PAGE = 11

export default function ProductListingPage() {
  const { cart, addToCart, showConfirmation, setShowConfirmation, lastAddedProduct } = useCart()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [displayedProducts, setDisplayedProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOption, setSortOption] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const supabase = createClientComponentClient()

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setProducts(data);
        setFilteredProducts(data);
        setDisplayedProducts(data.slice(0, ITEMS_PER_PAGE));
        
        // Get unique categories
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
        
        // Set initial price range based on actual product prices
        const prices = data.map(product => product.price);
        setPriceRange([Math.min(...prices), Math.max(...prices)]);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    setDisplayedProducts(filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE))
  }, [currentPage, filteredProducts])

  const handleSort = (option) => {
    setSortOption(option)
    let sortedProducts = [...filteredProducts]
    switch (option) {
      case 'priceLowToHigh':
        sortedProducts.sort((a, b) => a.price - b.price)
        break
      case 'priceHighToLow':
        sortedProducts.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      default:
        // 'featured' - revert to original order
        sortedProducts = [...products]
        break
    }
    setFilteredProducts(sortedProducts)
    setCurrentPage(1)
  }

  const handleFilter = () => {
    let newFilteredProducts = products.filter(product => 
      (selectedCategory === 'All' || product.category === selectedCategory) &&
      (product.price >= priceRange[0] && product.price <= priceRange[1])
    )
    setFilteredProducts(newFilteredProducts)
    setCurrentPage(1)
  }

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)

  // Helper function to format price in GHC
  const formatPrice = (price) => {
    return `GH₵${price.toFixed(2)}`
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading products...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <Link href="/cart" className="relative" aria-label={`View cart with ${cart.length} items`}>
          <ShoppingCart className="w-6 h-6" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Link>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="category-select" className="text-sm font-medium">Category</label>
                <Select onValueChange={setSelectedCategory}>
                  <SelectTrigger id="category-select">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="price-range" className="text-sm font-medium">Price Range</label>
                <Slider
                  id="price-range"
                  min={0}
                  max={Math.max(...products.map(p => p.price))}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mt-2"
                />
                <div className="flex justify-between mt-2">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
              <Button onClick={handleFilter} className="w-full">Apply Filters</Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">{filteredProducts.length} products</p>
            <Select value={sortOption} onValueChange={handleSort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="priceLowToHigh">Price: Low to High</SelectItem>
                <SelectItem value="priceHighToLow">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map(product => (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <Link href={`/products/${product.id}`} passHref>
                    <div className="relative w-full h-48">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  </Link>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <p className="text-2xl font-bold mb-2">{formatPrice(product.price)}</p>
                  <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        product={lastAddedProduct}
      />
    </div>
  )
}