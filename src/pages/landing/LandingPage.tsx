
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart2, Database, Package2, ShoppingCart, Wrench, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  const features = [
    {
      title: "Asset Management",
      description: "Track and manage your fixed assets with detailed records, QR codes, and reporting.",
      icon: Database,
    },
    {
      title: "Inventory Tracking",
      description: "Monitor stock levels across locations, manage transactions, and receive alerts.",
      icon: Package2,
    },
    {
      title: "Sales & AMC",
      description: "Track products sold to clients, warranties and maintenance contracts with expiration alerts.",
      icon: ShoppingCart,
    },
    {
      title: "Service Management",
      description: "Schedule maintenance, assign technicians, and track service completion against SLAs.",
      icon: Wrench,
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-100 to-slate-100">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                <span className="text-primary">Track</span>
                <span className="text-gray-800">atease</span>
              </h1>
              <p className="text-2xl md:text-3xl font-light mb-6 text-gray-700">
                Complete Asset & Inventory Management Solution for Your Business
              </p>
              <p className="text-lg mb-8 text-gray-600">
                Streamline your asset tracking, inventory management, and maintenance operations with our all-in-one platform.
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg">
                  <Link to="/login">
                    Login
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/login">Sign Up</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-white/80 p-6 rounded-xl shadow-lg">
                <BarChart2 className="h-40 w-40 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">All-in-One Business Management</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to streamline your operations?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600">
            Join hundreds of businesses that use Trackatease to manage their assets, inventory and maintenance workflows efficiently.
          </p>
          <Button asChild size="lg">
            <Link to="/login">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-white">
                <span className="text-primary">Track</span>atease
              </h2>
              <p className="mt-2">Asset & Inventory Management</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">Product</h3>
                <ul className="space-y-1">
                  <li><a href="#" className="hover:text-primary">Features</a></li>
                  <li><a href="#" className="hover:text-primary">Pricing</a></li>
                  <li><a href="#" className="hover:text-primary">Documentation</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Company</h3>
                <ul className="space-y-1">
                  <li><a href="#" className="hover:text-primary">About Us</a></li>
                  <li><a href="#" className="hover:text-primary">Contact</a></li>
                  <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p>&copy; {new Date().getFullYear()} Trackatease. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
