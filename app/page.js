'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Drill, Hammer, Wrench, Scissors, ShoppingCart, Search, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter();

  const handleNavigation = () => {
    router.push('/products');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <Drill className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">Johdel Machinery</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/tools">Tools</Link>
              <Link href="/brands">Brands</Link>
              <Link href="/deals">Deals</Link>
              <Link href="/help">Help</Link>
            </nav>
          </div>
          <Button variant="outline" size="icon" className="mr-2 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open Menu</span>
          </Button>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Input
                type="search"
                placeholder="Find tools..."
                className="h-9 md:w-[300px] lg:w-[400px]"
              />
            </div>
            <Button variant="outline" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="outline" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Shopping Cart</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-orange-600">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <Image
                src="/placeholder.svg?height=400&width=800"
                width={800}
                height={400}
                alt="Featured Power Tool"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none">
                    Get the Right Tools for Any Job
                  </h1>
                  <p className="max-w-[600px] text-gray-200 md:text-xl">
                    Find top-quality power tools and machines for your projects. We have everything you need to get the job done right.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button onClick={handleNavigation} size="lg" className="bg-white text-orange-600 hover:bg-gray-100">Shop Now</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-8">Our Top Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Power Drills", icon: Drill },
                { name: "Wrenches", icon: Wrench },
                { name: "Hammers", icon: Hammer },
                { name: "Cutting Tools", icon: Scissors },
              ].map((category) => (
                <Card key={category.name} className="flex flex-col items-center justify-center p-6 hover:shadow-lg transition-shadow">
                  <category.icon className="h-12 w-12 mb-4" />
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-8">Featured Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Powerful Circular Saw", price: "$129", image: "/placeholder.svg?height=200&width=300" },
                { name: "Bosch Grinding Machine", price: "$89", image: "/placeholder.svg?height=200&width=300" },
                { name: "Heavy-Duty Drill", price: "$79", image: "/placeholder.svg?height=200&width=300" },
              ].map((product) => (
                <Card key={product.name} className="flex flex-col">
                  <CardHeader>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="object-cover w-full h-[200px] rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.price}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Add to Cart</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 bg-gray-800 text-gray-300">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            {/* About Us Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">About Us</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/about" className="hover:underline">
                    Our Story
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Help Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Customer Help</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/contact" className="hover:underline">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:underline">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:underline">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>

            {/* Follow Us Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Follow Us</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="https://instagram.com" className="hover:underline">
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>

            {/* Admin Access Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Admin Access</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/admin" className="hover:underline">
                    Admin Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 text-center border-t border-gray-700 pt-4">
            <p>&copy; 2024 Johdel Machinery. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}