import { Link } from "react-router-dom";
import { Droplets, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Droplets className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Cooler Emporium</span>
            </Link>
            <p className="text-background/70 max-w-md">
              Your trusted destination for quality cooling solutions. From RO purifiers to coolers and fans, 
              we bring comfort to your home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-background/70 hover:text-background transition-smooth">Home</Link>
              <Link to="/products" className="text-background/70 hover:text-background transition-smooth">Products</Link>
              <Link to="/products?category=ro-purifier" className="text-background/70 hover:text-background transition-smooth">RO Purifiers</Link>
              <Link to="/products?category=cooler" className="text-background/70 hover:text-background transition-smooth">Coolers</Link>
              <Link to="/products?category=fans" className="text-background/70 hover:text-background transition-smooth">Fans</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-background/70">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-background/70">
                <Mail className="w-4 h-4" />
                <span>info@cooleremporium.com</span>
              </div>
              <div className="flex items-start gap-2 text-background/70">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>123 Main Street, City Center, New Delhi - 110001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/50 text-sm">
          <p>© {new Date().getFullYear()} Cooler Emporium. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
