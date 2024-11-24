'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Drill, 
  Hammer, 
  Wrench, 
  Scissors, 
  ShoppingCart, 
  Search, 
  Menu,
  X,
  User,
  Loader2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('featured', true)
          .limit(3);

        if (error) throw error;
        setFeaturedProducts(data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleNavigation = () => {
    router.push('/products');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className={`sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 shadow-md' : 'bg-transparent'
      }`}>
        <div className="container flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link className="flex items-center space-x-2" href="/">
              <Drill className="h-6 w-6" />
              <span className="font-bold">Johdel Machinery</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link href="/tools" className="relative group">
              <span className="hover:text-orange-600 transition-colors">Tools</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/brands" className="relative group">
              <span className="hover:text-orange-600 transition-colors">Brands</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/deals" className="relative group">
              <span className="hover:text-orange-600 transition-colors">Deals</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/help" className="relative group">
              <span className="hover:text-orange-600 transition-colors">Help</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <Input
                type="search"
                placeholder="Find tools..."
                className="h-9 w-[200px] lg:w-[300px]"
              />
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <nav className="flex flex-col space-y-4 p-4 bg-white">
              <Link href="/tools" className="hover:text-orange-600 transition-colors">Tools</Link>
              <Link href="/brands" className="hover:text-orange-600 transition-colors">Brands</Link>
              <Link href="/deals" className="hover:text-orange-600 transition-colors">Deals</Link>
              <Link href="/help" className="hover:text-orange-600 transition-colors">Help</Link>
              <div className="pt-4 border-t">
                <Input
                  type="search"
                  placeholder="Find tools..."
                  className="h-9 w-full"
                />
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none animate-fade-up">
                    Get the Right Tools for Any Job
                  </h1>
                  <p className="max-w-[600px] text-gray-100 md:text-xl animate-fade-up delay-150">
                    Find top-quality power tools and machines for your projects. We have everything you need to get the job done right.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row animate-fade-up delay-300">
                  <Button 
                    onClick={handleNavigation} 
                    size="lg" 
                    className="bg-white text-orange-600 hover:bg-gray-100 hover:text-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    Shop Now
                  </Button>
                </div>
              </div>
              <div className="relative aspect-video lg:aspect-square animate-fade-left">
                <Image
                  src="/ecom-logo.jpeg"
                  fill
                  alt="Featured Power Tool"
                  className="object-cover rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-700">
              Our Top Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { name: "Power Drills", icon: Drill },
                { name: "Wrenches", icon: Wrench },
                { name: "Hammers", icon: Hammer },
                { name: "Cutting Tools", icon: Scissors },
              ].map((category) => (
                <Card 
                  key={category.name} 
                  className="flex flex-col items-center justify-center p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group bg-white border-none"
                >
                  <div className="p-3 rounded-full bg-orange-50 group-hover:bg-orange-100 transition-colors duration-300">
                    <category.icon className="h-10 w-10 text-orange-600 group-hover:text-orange-700 transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-center mt-4 group-hover:text-orange-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-700">
              Featured Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                </div>
              ) : featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  >
                    <Link href={`/products/${product.id}`}>
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={product.image_url || '/placeholder-product.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="flex-1 p-4">
                        <CardTitle className="mb-2 group-hover:text-orange-600 transition-colors duration-300">
                          {product.name}
                        </CardTitle>
                        <CardDescription className="text-sm line-clamp-2 mb-2">
                          {product.description}
                        </CardDescription>
                        <p className="text-lg font-semibold text-orange-600">
                          ₵{product.price.toFixed(2)}
                        </p>
                      </CardContent>
                    </Link>
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        className="w-full bg-orange-600 hover:bg-orange-700 transition-all duration-300 transform hover:scale-105"
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to cart functionality will be implemented later
                          router.push(`/products/${product.id}`);
                        }}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No featured products available at the moment.</p>
                  <Button 
                    className="mt-4"
                    onClick={() => router.push('/products')}
                  >
                    View All Products
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 bg-gray-900 text-gray-300">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            {/* About Us Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">About Us</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:text-orange-500 transition-colors">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="hover:text-orange-500 transition-colors">
                    Our Team
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Help Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Customer Help</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="hover:text-orange-500 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-orange-500 transition-colors">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-orange-500 transition-colors">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>

            {/* Follow Us Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Follow Us</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="https://instagram.com" className="hover:text-orange-500 transition-colors">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="https://facebook.com" className="hover:text-orange-500 transition-colors">
                    Facebook
                  </Link>
                </li>
              </ul>
            </div>

            {/* Admin Access Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Admin Access</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/admin" className="hover:text-orange-500 transition-colors">
                    Admin Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 text-center border-t border-gray-800 pt-8">
            <p className="text-sm text-gray-400">&copy; 2024 Johdel Machinery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}