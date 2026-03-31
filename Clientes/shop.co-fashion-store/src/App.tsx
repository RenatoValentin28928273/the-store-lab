import { 
  Search, 
  ShoppingCart, 
  UserCircle, 
  Star, 
  ArrowRight, 
  ArrowLeft, 
  Mail, 
  Twitter, 
  Facebook, 
  Instagram, 
  Github,
  ChevronDown,
  X
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const TopBanner = () => (
  <div className="bg-black text-white text-center py-2 text-xs sm:text-sm relative">
    <p>
      Sign up and get 20% off to your first order.{" "}
      <a href="#" className="underline font-bold">Sign Up Now</a>
    </p>
    <button className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:block">
      <X size={16} />
    </button>
  </div>
);

const Navbar = () => (
  <nav className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between gap-4 sm:gap-8">
    <div className="flex items-center gap-4">
      <h1 className="text-2xl sm:text-3xl font-black tracking-tighter">SHOP.CO</h1>
      <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
        <a href="#" className="flex items-center gap-1">Shop <ChevronDown size={14} /></a>
        <a href="#">On Sale</a>
        <a href="#">New Arrivals</a>
        <a href="#">Brands</a>
      </div>
    </div>

    <div className="flex-1 max-w-xl hidden md:block">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search for products..." 
          className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>
    </div>

    <div className="flex items-center gap-4">
      <button className="md:hidden"><Search size={24} /></button>
      <button><ShoppingCart size={24} /></button>
      <button><UserCircle size={24} /></button>
    </div>
  </nav>
);

const Hero = () => (
  <section className="bg-[#F2F0F1] overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 pt-10 sm:pt-20 flex flex-col lg:flex-row items-center">
      <div className="lg:w-1/2 z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-6"
        >
          FIND CLOTHES THAT MATCHES YOUR STYLE
        </motion.h2>
        <p className="text-gray-500 text-sm sm:text-base mb-8 max-w-lg">
          Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
        </p>
        <button className="bg-black text-white px-12 py-4 rounded-full font-medium mb-12 hover:bg-gray-800 transition-colors">
          Shop Now
        </button>

        <div className="flex flex-wrap gap-8 sm:gap-12 mb-12">
          <div>
            <h3 className="text-2xl sm:text-4xl font-bold">200+</h3>
            <p className="text-gray-500 text-xs sm:text-sm">International Brands</p>
          </div>
          <div className="border-l border-gray-300 pl-8 sm:pl-12">
            <h3 className="text-2xl sm:text-4xl font-bold">2,000+</h3>
            <p className="text-gray-500 text-xs sm:text-sm">High-Quality Products</p>
          </div>
          <div className="border-l border-gray-300 pl-8 sm:pl-12">
            <h3 className="text-2xl sm:text-4xl font-bold">30,000+</h3>
            <p className="text-gray-500 text-xs sm:text-sm">Happy Customers</p>
          </div>
        </div>
      </div>

      <div className="lg:w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" 
          alt="Fashion Couple" 
          className="w-full h-auto object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Decorative Stars */}
        <div className="absolute top-10 right-10 sm:top-20 sm:right-20">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28 0L31.3908 24.6092L56 28L31.3908 31.3908L28 56L24.6092 31.3908L0 28L24.6092 24.6092L28 0Z" fill="black"/>
          </svg>
        </div>
        <div className="absolute top-1/2 left-0 sm:left-10">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0L17.9376 14.0624L32 16L17.9376 17.9376L16 32L14.0624 17.9376L0 16L14.0624 14.0624L16 0Z" fill="black"/>
          </svg>
        </div>
      </div>
    </div>
  </section>
);

const Brands = () => (
  <div className="bg-black py-8 sm:py-12">
    <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center sm:justify-between items-center gap-8 sm:gap-12 grayscale invert opacity-80">
      <span className="text-2xl sm:text-4xl font-bold tracking-tighter">VERSACE</span>
      <span className="text-2xl sm:text-4xl font-bold tracking-tighter">ZARA</span>
      <span className="text-2xl sm:text-4xl font-bold tracking-tighter">GUCCI</span>
      <span className="text-2xl sm:text-4xl font-bold tracking-tighter">PRADA</span>
      <span className="text-2xl sm:text-4xl font-bold tracking-tighter">Calvin Klein</span>
    </div>
  </div>
);

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  image: string;
}

const ProductCard = ({ product }: { product: Product }) => (
  <div className="group cursor-pointer">
    <div className="bg-[#F0EEED] rounded-[20px] aspect-square overflow-hidden mb-4">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        referrerPolicy="no-referrer"
      />
    </div>
    <h4 className="font-bold text-base sm:text-lg mb-1">{product.name}</h4>
    <div className="flex items-center gap-2 mb-2">
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
        ))}
      </div>
      <span className="text-sm text-gray-500">{product.rating}/5</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-xl sm:text-2xl font-bold">${product.price}</span>
      {product.oldPrice && (
        <>
          <span className="text-xl sm:text-2xl font-bold text-gray-400 line-through">${product.oldPrice}</span>
          <span className="bg-red-100 text-red-500 text-xs px-2 py-1 rounded-full">
            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
          </span>
        </>
      )}
    </div>
  </div>
);

const ProductSection = ({ title, products }: { title: string; products: Product[] }) => (
  <section className="max-w-7xl mx-auto px-4 py-16 sm:py-24 border-b border-gray-100 last:border-0">
    <h2 className="text-3xl sm:text-5xl font-black text-center mb-12 tracking-tighter uppercase">{title}</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-12">
      {products.map(p => (
        <div key={p.id}>
          <ProductCard product={p} />
        </div>
      ))}
    </div>
    <div className="text-center">
      <button className="border border-gray-200 px-12 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">
        View All
      </button>
    </div>
  </section>
);

const DressStyle = () => (
  <section className="max-w-7xl mx-auto px-4 py-16">
    <div className="bg-[#F0F0F0] rounded-[40px] p-6 sm:p-16">
      <h2 className="text-3xl sm:text-5xl font-black text-center mb-12 tracking-tighter uppercase">BROWSE BY DRESS STYLE</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-white rounded-[20px] h-[289px] relative overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=500&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
          <h3 className="absolute top-6 left-6 text-2xl sm:text-3xl font-bold">Casual</h3>
        </div>
        <div className="md:col-span-2 bg-white rounded-[20px] h-[289px] relative overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
          <h3 className="absolute top-6 left-6 text-2xl sm:text-3xl font-bold">Formal</h3>
        </div>
        <div className="md:col-span-2 bg-white rounded-[20px] h-[289px] relative overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
          <h3 className="absolute top-6 left-6 text-2xl sm:text-3xl font-bold">Party</h3>
        </div>
        <div className="md:col-span-1 bg-white rounded-[20px] h-[289px] relative overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
          <h3 className="absolute top-6 left-6 text-2xl sm:text-3xl font-bold">Gym</h3>
        </div>
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
    <div className="flex items-center justify-between mb-12">
      <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase">OUR HAPPY CUSTOMERS</h2>
      <div className="flex gap-4">
        <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50"><ArrowLeft size={24} /></button>
        <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50"><ArrowRight size={24} /></button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { name: "Sarah M.", text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations." },
        { name: "Alex K.", text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions." },
        { name: "James L.", text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends." }
      ].map((t, i) => (
        <div key={i} className="border border-gray-100 rounded-[20px] p-8">
          <div className="flex text-yellow-400 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
          </div>
          <div className="flex items-center gap-1 mb-3">
            <h4 className="font-bold text-lg">{t.name}</h4>
            <div className="bg-green-500 rounded-full p-0.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          </div>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">"{t.text}"</p>
        </div>
      ))}
    </div>
  </section>
);

const Newsletter = () => (
  <section className="max-w-7xl mx-auto px-4 relative z-10 -mb-24">
    <div className="bg-black rounded-[20px] p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
      <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter leading-tight max-w-lg">
        STAY UPTO DATE ABOUT OUR LATEST OFFERS
      </h2>
      <div className="w-full max-w-md space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="w-full bg-white rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none"
          />
        </div>
        <button className="w-full bg-white text-black rounded-full py-3 font-bold text-sm hover:bg-gray-100 transition-colors">
          Subscribe to Newsletter
        </button>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-[#F0F0F0] pt-40 pb-12">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-12">
        <div className="col-span-2 md:col-span-1">
          <h2 className="text-3xl font-black tracking-tighter mb-6">SHOP.CO</h2>
          <p className="text-gray-500 text-sm mb-8">
            We have clothes that suits your style and which you're proud to wear. From women to men.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-white rounded-full border border-gray-200 hover:bg-black hover:text-white transition-all"><Twitter size={18} /></a>
            <a href="#" className="p-2 bg-white rounded-full border border-gray-200 hover:bg-black hover:text-white transition-all"><Facebook size={18} /></a>
            <a href="#" className="p-2 bg-white rounded-full border border-gray-200 hover:bg-black hover:text-white transition-all"><Instagram size={18} /></a>
            <a href="#" className="p-2 bg-white rounded-full border border-gray-200 hover:bg-black hover:text-white transition-all"><Github size={18} /></a>
          </div>
        </div>
        
        <div>
          <h4 className="font-bold uppercase tracking-widest text-sm mb-6">COMPANY</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li><a href="#">About</a></li>
            <li><a href="#">Features</a></li>
            <li><a href="#">Works</a></li>
            <li><a href="#">Career</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-widest text-sm mb-6">HELP</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li><a href="#">Customer Support</a></li>
            <li><a href="#">Delivery Details</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-widest text-sm mb-6">FAQ</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li><a href="#">Account</a></li>
            <li><a href="#">Manage Deliveries</a></li>
            <li><a href="#">Orders</a></li>
            <li><a href="#">Payments</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-widest text-sm mb-6">RESOURCES</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li><a href="#">Free eBooks</a></li>
            <li><a href="#">Development Tutorial</a></li>
            <li><a href="#">How to - Blog</a></li>
            <li><a href="#">Youtube Playlist</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">Shop.co © 2000-2023, All Rights Reserved</p>
        <div className="flex gap-4 grayscale opacity-60">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" referrerPolicy="no-referrer" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" referrerPolicy="no-referrer" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4" referrerPolicy="no-referrer" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Pay_logo.svg" alt="Apple Pay" className="h-6" referrerPolicy="no-referrer" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_logo_%282020%29.svg" alt="Google Pay" className="h-6" referrerPolicy="no-referrer" />
        </div>
      </div>
    </div>
  </footer>
);

// --- Main App ---

const NEW_ARRIVALS: Product[] = [
  { id: 1, name: "T-shirt with Tape Details", price: 120, rating: 4.5, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500&auto=format&fit=crop" },
  { id: 2, name: "Skinny Fit Jeans", price: 240, oldPrice: 260, rating: 3.5, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=500&auto=format&fit=crop" },
  { id: 3, name: "Checkered Shirt", price: 180, rating: 4.5, image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=500&auto=format&fit=crop" },
  { id: 4, name: "Sleeve Striped T-shirt", price: 130, oldPrice: 160, rating: 4.5, image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=500&auto=format&fit=crop" },
];

const TOP_SELLING: Product[] = [
  { id: 5, name: "Vertical Striped Shirt", price: 212, oldPrice: 232, rating: 5.0, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=500&auto=format&fit=crop" },
  { id: 6, name: "Courage Graphic T-shirt", price: 145, rating: 4.0, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=500&auto=format&fit=crop" },
  { id: 7, name: "Loose Fit Bermuda Shorts", price: 80, rating: 3.0, image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=500&auto=format&fit=crop" },
  { id: 8, name: "Faded Skinny Jeans", price: 210, rating: 4.5, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=500&auto=format&fit=crop" },
];

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <TopBanner />
      <Navbar />
      <Hero />
      <Brands />
      <ProductSection title="New Arrivals" products={NEW_ARRIVALS} />
      <ProductSection title="Top Selling" products={TOP_SELLING} />
      <DressStyle />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
}
