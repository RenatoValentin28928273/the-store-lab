import React, { useState, useEffect } from "react";
import { Search, ShoppingBag, User, ArrowRight, ArrowUpRight, Plus, X, Globe, Share2, Zap, Menu, Hourglass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const HERO_IMAGE = "https://images.unsplash.com/photo-1511499767390-903390e62bc0?q=80&w=2080&auto=format&fit=crop";
const PROMO1_IMAGE = "https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=2080&auto=format&fit=crop";
const PROMO2_IMAGE = "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=2070&auto=format&fit=crop";
const LARGE_IMAGE = "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=2070&auto=format&fit=crop";

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<null | any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeBanner, setActiveBanner] = useState(0);
  const [view, setView] = useState<'home' | 'shop'>('home');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'FEMALE' | 'MALE' | 'UNISEX'>('ALL');
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);



  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const banners = [
    {
      id: "01",
      title: "SHOP NOW",
      sub: "Explore our collection",
      cta: "VIEW COLLECTION",
      image: "/10.webp"
    },
    {
      id: "02",
      title: "PURE VISION",
      sub: "High precision lenses",
      cta: "DISCOVER",
      image: "https://www.projectshades.com/cdn/shop/files/14-2.jpg?v=1734103650&width=1920"
    },
    {
      id: "03",
      title: "URBAN MODE",
      sub: "Design made for the street",
      cta: "SHOP NOW",
      image: "https://www.projectshades.com/cdn/shop/files/17-3.jpg?v=1734103650&width=1920"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX - cursor.offsetWidth / 2}px`;
      cursor.style.top = `${e.clientY - cursor.offsetHeight / 2}px`;
    };

    const handleHover = () => cursor.classList.add('cursor-active');
    const handleLeave = () => cursor.classList.remove('cursor-active');

    window.addEventListener('mousemove', moveCursor);
    
    // Add hover effect to all buttons and links
    const interactive = document.querySelectorAll('button, a, .cursor-crosshair');
    interactive.forEach(el => {
      el.addEventListener('mouseenter', handleHover);
      el.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactive.forEach(el => {
        el.removeEventListener('mouseenter', handleHover);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, [selectedProduct, isCartOpen, isSearchOpen, isMobileMenuOpen]);

  return (
    <div className="bg-surface selection:bg-primary selection:text-on-primary min-h-screen font-body relative">


      {/* Header Navigation - Floating Pill Style */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b 
        ${scrolled || view === 'shop'
          ? 'bg-white border-black/10 py-4 shadow-sm backdrop-blur-md' 
          : 'bg-transparent border-transparent py-6'}`}
      >
        <div className="container mx-auto px-8 flex items-center justify-between relative">
          {/* Brand Logo - Left */}
          <div 
            className={`font-headline font-black text-2xl tracking-tighter cursor-pointer transition-all duration-500 hover:scale-110 shrink-0
              ${scrolled || view === 'shop' ? 'text-[#E30613]' : 'text-white'}`}
            onClick={() => setView('home')}
          >
            BLVCK LENS
          </div>

          {/* Navigation - Minimalist Plain Text */}
          <nav 
            className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2 h-24"
          >
            {["SHOP", "COLLECTIONS", "ABOUT US", "DIARY"].map((item, idx) => (
              <div 
                key={item} 
                className="relative h-full flex items-center"
                onMouseEnter={() => {
                  if (item === "COLLECTIONS") setIsMegaMenuOpen(true);
                  else setIsMegaMenuOpen(false);
                }}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (item === "SHOP") {
                      setView('shop');
                      setActiveCategory('ALL');
                    }
                    if (item === "BLVCK LENS") setView('home');
                  }}
                  className={`px-4 py-2 text-[10px] font-headline font-bold tracking-widest uppercase transition-all duration-300 block
                    ${scrolled || view === 'shop' ? 'text-black' : 'text-white'} 
                    hover:opacity-60`}
                >
                  {item} {idx > 0 && "+"}
                </a>

                {/* Mega Menu Dropdown (Inside the item container for better hover persistence) */}
                {item === "COLLECTIONS" && (
                  <AnimatePresence>
                    {isMegaMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1400px] bg-black text-white p-12 border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] z-[60] overflow-hidden group/mega"
                        style={{ backdropFilter: 'blur(20px)' }}
                        onMouseEnter={() => setIsMegaMenuOpen(true)}
                        onMouseLeave={() => setIsMegaMenuOpen(false)}
                      >
                        <div className="relative z-10 grid grid-cols-12 gap-16">
                          {/* Left - Navigation List */}
                          <div className="col-span-3">
                            <div className="flex items-center gap-4 mb-12">
                              <span className="font-label text-[10px] text-white/40 tracking-widest uppercase block">BROWSE</span>
                              <div className="flex items-center gap-1.5 bg-[#E30613] text-white px-2.5 py-1 rounded-sm shadow-[0_0_15px_rgba(227,6,19,0.3)]">
                                <Zap size={10} fill="white" />
                                <span className="font-headline font-black text-[9px] tracking-tighter leading-none pt-0.5">NEW DROPS</span>
                              </div>
                            </div>
                            <ul className="space-y-6">
                              {['SEE ALL', 'BEST SELLERS', 'ACCESSORIES', 'COLLABS', 'LIMITED EDITION'].map((link) => (
                                <li key={link}>
                                  <a 
                                    href="#" 
                                    onClick={() => { setView('shop'); setIsMegaMenuOpen(false); }}
                                    className="font-headline font-black text-2xl tracking-tighter hover:text-outline transition-all uppercase block"
                                  >
                                    {link}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Right - Image Grid (Brutalist style) */}
                          <div className="col-span-9">
                            <div className="grid grid-cols-4 gap-4 h-full">
                              <MegaMenuCard 
                                title="MENS" 
                                image="/male_collection.png" 
                                onClick={() => { setView('shop'); setActiveCategory('MALE'); setIsMegaMenuOpen(false); }}
                              />
                              <MegaMenuCard 
                                title="WOMENS" 
                                image="/female_collection.png" 
                                onClick={() => { setView('shop'); setActiveCategory('FEMALE'); setIsMegaMenuOpen(false); }}
                              />
                              <MegaMenuCard 
                                title="ACCESSORIES" 
                                image="/accessories_collection.png" 
                                onClick={() => { setView('shop'); setIsMegaMenuOpen(false); }}
                              />
                              <MegaMenuCard 
                                title="STREETSTYLE" 
                                image="/streetstyle_collection.png" 
                                onClick={() => { setView('shop'); setIsMegaMenuOpen(false); }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Action Icons */}
          <div className={`flex items-center gap-6 ${scrolled || view === 'shop' ? 'text-black' : 'text-white'} transition-colors duration-500`}>
            <button className="hover:scale-110 transition-transform" onClick={() => setIsSearchOpen(true)}>
              <Search size={20} />
            </button>
            <button className="hover:scale-110 transition-transform">
              <User size={20} />
            </button>
            <button onClick={() => setIsCartOpen(true)} className="relative hover:scale-110 transition-transform">
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E30613] text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full shadow-sm">
                  {cart.length}
                </span>
              )}
            </button>
            
            {/* Mobile Toggle */}
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-0">
        {view === 'home' ? (
          <>
            {/* Hero Section - Editorial Video Style */}
        <section className="relative h-screen w-full bg-black overflow-hidden">
          {/* Background Images Layer with Crossfade */}
          {banners.map((banner, index) => (
            <div 
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out
                ${activeBanner === index ? 'opacity-40 scale-100' : 'opacity-0 scale-105'}`}
            >
              <img 
                src={banner.image} 
                alt={banner.title}
                className="w-full h-full object-cover transition-transform duration-[5000ms] ease-linear"
                style={{ transform: activeBanner === index ? 'scale(1.1)' : 'scale(1)' }}
              />
            </div>
          ))}

          {/* Video Background Overlay (Subtle Atmospheric) */}
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-10 pointer-events-none"
          >
            <source src="https://cdn.shopify.com/videos/c/o/v/e07897d2169b4e7087693d222240b991.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
          
          {/* Editorial Content Grid */}
          <div className="relative h-full w-full flex flex-col justify-between p-8 md:p-16 z-20">
            {/* Top Row Spacing for Header */}
            <div className="h-32"></div>

            {/* Middle Row - Floating Numbers Indicators */}
            <div className="flex justify-between items-center w-full pointer-events-none">
              {banners.map((banner, index) => (
                <span 
                  key={banner.id}
                  className={`font-headline font-black text-4xl md:text-6xl transition-all duration-700 cursor-pointer pointer-events-auto
                    ${activeBanner === index ? 'text-white scale-110' : 'text-white/20 hover:text-white/40'}`}
                  onClick={() => setActiveBanner(index)}
                >
                  {banner.id}
                </span>
              ))}
            </div>

            {/* Bottom Row - Headline & Scroll (Animated) */}
            <div className="flex justify-between items-end w-full min-h-[300px]">
              <div className="max-w-4xl overflow-hidden">
                {banners.map((banner, index) => (
                   <div 
                    key={banner.id}
                    className={`transition-all duration-1000 absolute bottom-16 md:bottom-24 left-8 md:left-16 
                      ${activeBanner === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}`}
                   >
                    <h1 className="font-headline text-5xl md:text-7xl lg:text-[7rem] text-white font-black leading-[0.8] tracking-tight uppercase drop-shadow-2xl">
                      {banner.title}<br/>
                      <span className="text-white/60 text-3xl md:text-5xl lg:text-6xl block mt-4 font-normal tracking-normal normal-case">
                        {banner.sub}
                      </span>
                    </h1>
                    <div className="lightning-button-container mt-12 relative">
                      <div className="lightning-glow"></div>
                      <div className="lightning-border"></div>
                      <div className="relative z-10">
                        <button 
                          onClick={() => setView('shop')}
                          className="bg-black text-white font-headline font-bold text-lg tracking-tight px-10 py-4 rounded-full hover:bg-black/90 transition-all shadow-2xl"
                        >
                          {banner.cta}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col items-center gap-6 z-30">
                <span className="font-headline text-lg text-white uppercase vertical-text tracking-widest font-bold">Scroll</span>
                <div className="scroll-lightning-line"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Infinite Ticker */}
        {/* Brand Infinite Ticker */}
        <div className="bg-white py-4 md:py-6 overflow-hidden border-y border-black">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center">
                <span className="text-black font-headline text-xl md:text-3xl font-black mx-6 tracking-tighter uppercase whitespace-nowrap">
                  PRECISION LENSES
                </span>
                <Globe className="text-black w-4 h-4 md:w-6 md:h-6" />
                <span className="text-black font-headline text-xl md:text-3xl font-black mx-6 tracking-tighter uppercase whitespace-nowrap">
                  SUBVERSIVE STYLE
                </span>
                <Globe className="text-black w-4 h-4 md:w-6 md:h-6" />
                <span className="text-black font-headline text-xl md:text-3xl font-black mx-6 tracking-tighter uppercase whitespace-nowrap">
                  STREETWEAR CULTURE
                </span>
                <Globe className="text-black w-4 h-4 md:w-6 md:h-6" />
              </div>
            ))}
          </div>
        </div>

        {/* Discover a New Approach (4 Columns) */}
        <section className="py-24 container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-headline font-black text-white mb-16 tracking-tighter uppercase">DISCOVER A NEW APPROACH</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="animate-float-card" style={{ animationDelay: '0s' }}>
                    <CategoryCard onClick={() => { setView('shop'); setActiveCategory('FEMALE'); }} title="WOMENS" image="/female_cat.png" />
                </div>
                <div className="animate-float-card" style={{ animationDelay: '0.2s' }}>
                    <CategoryCard onClick={() => { setView('shop'); setActiveCategory('MALE'); }} title="MENS" image="/male_collection.png" />
                </div>
                <div className="animate-float-card" style={{ animationDelay: '0.4s' }}>
                    <CategoryCard onClick={() => { setView('shop'); setActiveCategory('ALL'); }} title="NEW ARRIVALS" image="/new_arrivals_cat.png" />
                </div>
                <div className="animate-float-card" style={{ animationDelay: '0.6s' }}>
                    <CategoryCard onClick={() => { setView('shop'); setActiveCategory('ALL'); }} title="BEST SELLERS" image="/best_sellers_cat.png" />
                </div>
            </div>
        </section>

        {/* Luxury Text + Grid - White Background Version with Sticky Effect */}
        <section className="py-32 bg-white w-full">
          <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-16 relative">
            {/* Sticky Left Column */}
            <div className="w-full lg:w-1/3 lg:h-max lg:sticky lg:top-40">
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[#E30613] text-white px-3 py-1 rounded-full text-[8px] font-headline font-black tracking-widest uppercase">LIMITED EDITION</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-3xl font-headline font-black text-black mb-6 tracking-tighter uppercase leading-[1.1]">
                    BLVCK LENS BEST SELLING SUNGLASSES
                </h2>
                <p className="font-body text-sm text-black/60 mb-10 max-w-sm leading-relaxed">
                    Discover the definitive curation of BLVCK LENS. Our iconic collection of sunglasses unites luxury fashion prestige with urban attitude, setting the new standard for contemporary style.
                </p>
                <a href="#" className="inline-flex items-center justify-center bg-black text-white font-headline font-black text-[10px] tracking-[0.2em] uppercase px-8 py-4 rounded-full hover:bg-[#E30613] transition-all w-max shadow-xl group">
                    VIEW COLLECTION <ArrowRight size={14} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </a>
            </div>
            {/* Scrolling Right Column */}
            <div className="w-full lg:w-2/3 grid grid-cols-2 gap-4">
                <ProductCard onClick={() => setView('shop')} tag="NEW" image="/streetwear_1.png" title="ASTRA" price="R$ 1.250" colors={['#000', '#A67B5B', '#E5E5E5']} />
                <ProductCard onClick={() => setView('shop')} tag="NEW" image="/streetwear_2.png" title="LUNARA" price="R$ 2.250" colors={['#000', '#5c5c5c']} />
                <ProductCard onClick={() => setView('shop')} tag="NEW" image="/streetwear_3.png" title="NOIRVUE" price="R$ 1.350" colors={['#A67B5B', '#000']} />
                <ProductCard onClick={() => setView('shop')} tag="NEW" image="/streetwear_1.png" title="SOLEIL" price="R$ 1.200" colors={['#E5E5E5', '#A67B5B']} />
                <ProductCard onClick={() => setView('shop')} tag="LIMITED" image="/streetwear_2.png" title="ZENITH" price="R$ 1.850" colors={['#000']} />
                <ProductCard onClick={() => setView('shop')} tag="NEW" image="/streetwear_3.png" title="ECLIPSE" price="R$ 1.450" colors={['#E5E5E5', '#000']} />
            </div>
          </div>
        </section>

        {/* Grid + Bold Looks Text - Sticky Dark Version */}
        <section className="py-32 bg-black w-full border-t border-white/5">
          <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-16 relative">
            {/* Scrolling Right Column (Placed left in flex for a different feel or same for consistency? User said same structure, and usually products are right) */}
            <div className="w-full lg:w-2/3 grid grid-cols-2 gap-4">
                <ProductCard onClick={() => setView('shop')} tag="BEST SELLER" image="/streetwear_2.png" title="SELENE" price="R$ 325" colors={['#000', '#222']} />
                <ProductCard onClick={() => setView('shop')} tag="BEST SELLER" image="/streetwear_1.png" title="MARAIS" price="R$ 125" colors={['#A67B5B', '#5c5c5c']} />
                <ProductCard onClick={() => setView('shop')} tag="BEST SELLER" image="/streetwear_3.png" title="NOIRVUE" price="R$ 205" colors={['#000']} />
                <ProductCard onClick={() => setView('shop')} tag="BEST SELLER" image="/streetwear_2.png" title="ORION" price="R$ 115" colors={['#E5E5E5', '#000']} />
                <ProductCard onClick={() => setView('shop')} tag="COLLECTION" image="/streetwear_1.png" title="CAPRI" price="R$ 115" colors={['#000', '#A67B5B']} />
                <ProductCard onClick={() => setView('shop')} tag="BEST SELLER" image="/streetwear_3.png" title="RAYA" price="R$ 225" colors={['#000', '#5c5c5c']} />
            </div>
            {/* Sticky Column (Right side for variety in this section) */}
            <div className="w-full lg:w-1/3 lg:h-max lg:sticky lg:top-40 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[#E30613] text-white px-3 py-1 rounded-full text-[8px] font-black tracking-widest uppercase animate-pulse">HOT DROPS</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-3xl font-headline font-black text-white mb-6 tracking-tighter uppercase leading-[1.1]">
                    BLVCK LENS NEW RELEASES SUNGLASSES
                </h2>
                <p className="font-body text-sm text-white/60 mb-10 max-w-sm leading-relaxed">
                    Explore the new frontier of urban luxury with BLVCK LENS exclusive releases. Premium streetwear accessories with avant-garde design, created for those who set tomorrow's rules.
                </p>
                <a href="#" className="inline-flex items-center justify-center bg-white text-black font-headline font-black text-[10px] tracking-[0.2em] uppercase px-8 py-4 rounded-full hover:bg-[#E30613] hover:text-white transition-all w-max shadow-xl group">
                    GET YOUR DROP <ArrowRight size={14} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </a>
            </div>
          </div>
        </section>

        {/* 50/50 Promo Split */}
        <section className="py-12 container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-4 h-auto lg:h-[800px]">
             <PromoCard 
                onClick={() => setView('shop')}
                category="COOLER SUMMER"
                title="SAVE 20% OFF SITEWIDE — LIMITED TIME ONLY."
                linkText="SHOP THE PROMO"
                bgImage={PROMO1_IMAGE}
             />
             <PromoCard 
                onClick={() => setView('shop')}
                category="INTRODUCING THE SOLEIL COLLECTION"
                title="SUN-KISSED COLORS. DESIGN FOR THE GOLDEN HOUR."
                linkText="EXPLORE NOW"
                bgImage={PROMO2_IMAGE}
             />
        </section>

        {/* Style That Shines + Grid - Sticky Version */}
        <section className="py-24 container mx-auto px-4 flex flex-col lg:flex-row gap-16 relative">
            <div className="w-full lg:w-1/3 lg:h-max lg:sticky lg:top-40 flex flex-col justify-center">
                <h2 className="text-4xl md:text-5xl lg:text-3xl font-headline font-black text-white mb-10 tracking-tighter uppercase leading-[1.1]">
                    BLVCK LENS BEST SELLING SUNGLASSES
                </h2>
                <a href="#" className="inline-flex items-center justify-center bg-white text-black font-headline font-black text-[10px] tracking-[0.2em] uppercase px-8 py-4 rounded-full hover:bg-[#E30613] hover:text-white transition-all w-max shadow-xl group">
                    EXPLORE FAVORITES <ArrowRight size={14} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </a>
            </div>
            <div className="w-full lg:w-2/3 grid grid-cols-2 gap-4">
                <ProductCard onClick={() => setView('shop')} tag="BEST SELLER" image="https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=2070&auto=format&fit=crop" title="CAPRI" price="R$ 115" colors={['#000', '#A67B5B']} />
                <ProductCard onClick={() => setView('shop')} tag="BEST SELLER" image="https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=2080&auto=format&fit=crop" title="SAVANNAH" price="R$ 225" colors={['#E5E5E5']} />
                <ProductCard onClick={() => setView('shop')} tag="BEST SELLER" image="https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2080&auto=format&fit=crop" title="NOMAD" price="R$ 125" colors={['#A67B5B', '#000']} />
                <ProductCard onClick={() => setView('shop')} tag="BEST SELLER" image="https://images.unsplash.com/photo-1511499767390-903390e62bc0?q=80&w=2080&auto=format&fit=crop" title="RAYA" price="R$ 225" colors={['#000', '#5c5c5c']} />
            </div>
        </section>

            </>
          ) : (
            <CategoryView 
              activeCategory={activeCategory} 
              setActiveCategory={setActiveCategory} 
              setSelectedProduct={setSelectedProduct}
              setView={setView}
            />
          )}
        </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest w-full pt-20 pb-10 mt-12 border-t border-white/10">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            {/* Brand */}
            <div className="md:col-span-3">
                <div className="text-3xl font-black tracking-tighter text-white font-headline uppercase">BLVCK LENS</div>
            </div>
            
            {/* Shop Links */}
            <div className="md:col-span-2">
                <h4 className="font-label font-bold text-white text-xs mb-6 uppercase tracking-widest">SHOP</h4>
                <ul className="space-y-4 font-body text-xs text-outline">
                <li><a className="hover:text-white transition-colors" href="#">Womens</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Mens</a></li>
                <li><a className="hover:text-white transition-colors" href="#">New Arrivals</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Best Sellers</a></li>
                </ul>
            </div>

            {/* About Links */}
            <div className="md:col-span-2">
                <h4 className="font-label font-bold text-white text-xs mb-6 uppercase tracking-widest">ABOUT</h4>
                <ul className="space-y-4 font-body text-xs text-outline">
                <li><a className="hover:text-white transition-colors" href="#">Our Story</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Sustainability</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Careers</a></li>
                </ul>
            </div>

            {/* Support Links */}
            <div className="md:col-span-3">
                <h4 className="font-label font-bold text-white text-xs mb-6 uppercase tracking-widest">SUPPORT</h4>
                <ul className="space-y-4 font-body text-xs text-outline">
                <li><a className="hover:text-white transition-colors" href="#">Help Center</a></li>
                <li><a className="hover:text-white transition-colors" href="#">My Account</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Track Order</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Returns & Exchanges</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Privacy Policy</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Contact Us</a></li>
                </ul>
            </div>

            {/* Connect Links */}
            <div className="md:col-span-2">
                <h4 className="font-label font-bold text-white text-xs mb-6 uppercase tracking-widest">CONNECT</h4>
                <ul className="space-y-4 font-body text-xs text-outline">
                <li><a className="hover:text-white transition-colors" href="#">Instagram</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Pinterest</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Facebook</a></li>
                </ul>
            </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-t border-white/10 pt-10">
                <div className="w-full md:w-1/2 mb-8 md:mb-0">
                    <h4 className="font-headline font-bold text-white text-sm mb-4 uppercase tracking-widest">SUBSCRIBE TO OUR NEWSLETTER</h4>
                    <form className="flex w-full max-w-md bg-transparent border border-white/20" onSubmit={(e) => e.preventDefault()}>
                        <input 
                            className="bg-transparent px-4 py-3 flex-1 text-xs font-label text-white placeholder-outline focus:outline-none" 
                            placeholder="Enter your email address" 
                            type="email" 
                        />
                        <button className="bg-white text-black font-label text-xs font-bold tracking-widest uppercase px-6 hover:bg-gray-200 transition-colors" type="submit">
                            SUBSCRIBE
                        </button>
                    </form>
                    <p className="text-[10px] text-outline mt-2 tracking-wide font-body">Stay in the loop. Be the first to know about new arrivals, exclusive offers, and style tips.</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-between w-full md:w-auto font-body text-xs text-outline">
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    </div>
                    <div>© BLVCK LENS. All rights reserved 2025</div>
                </div>
            </div>
        </div>
      </footer>

      {/* Global Lens Cursor */}
      <div id="custom-cursor"></div>
    </div>
  );
}

// Subcomponents

function CategoryCard({ title, image, onClick, badge = "NEW DROPS" }: { title: string, image: string, onClick: () => void, badge?: string }) {
    return (
        <div 
            className="group relative h-[300px] md:h-[450px] overflow-hidden rounded-[4px] cursor-pointer border border-white/5 transition-all duration-700 shadow-2xl"
            onClick={onClick}
        >
            <img 
                src={image} 
                alt={title} 
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
            
            {/* CRO Optimized Badge - Always Visible - Refined Pill Style */}
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-[#E30613] text-white px-4 py-2 rounded-full shadow-[0_10px_30px_rgba(227,6,19,0.4)] opacity-100 translate-y-0 transition-all duration-500 z-20">
                <Zap size={14} fill="white" className="animate-pulse" />
                <span className="font-headline font-black text-[10px] tracking-widest uppercase leading-none pt-0.5">{badge}</span>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-end h-full text-center pb-12 hover-lift">
                <h3 className="font-headline font-black text-2xl md:text-3xl text-white uppercase tracking-tighter leading-tight max-w-lg px-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    {title}
                </h3>
                <div className="mt-4 w-10 h-[1px] bg-[#E30613] group-hover:w-20 transition-all duration-500"></div>
            </div>
        </div>
    )
}

function ProductCard({ image, tag, title, price, colors, onClick, ...props }: { image: string, tag: string, title: string, price: string, colors: string[], onClick?: () => void, [key: string]: any }) {
    return (
        <div className="flex flex-col cursor-pointer group bg-black rounded-[10px] overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02] h-full relative animate-float-card" onClick={onClick} {...props}>
            {/* Full Image Container - Immersive & Borderless */}
            <div className="aspect-[4/5] relative flex items-center justify-center overflow-hidden">
                 <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1s] ease-out shadow-inner" 
                 />
                 {/* CRO: Gradient for clear info visibility */}
                 <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 transition-opacity duration-500"></div>
                 
                 {/* CRO: Fixed Red Badge + Scarcity Message - Refined Pill Style */}
                 <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                    <div className="flex items-center gap-1.5 bg-[#E30613] text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg">
                        <Zap size={10} fill="white" className="animate-pulse" />
                        {tag}
                    </div>
                 </div>

                 {/* Scarcity / Social Proof Bar */}
                 <div className="absolute bottom-0 left-0 w-full bg-black py-4 px-4 flex items-center justify-center gap-4 z-30 border-t border-white/10 group-hover:bg-[#E30613] transition-colors duration-500">
                    <Hourglass size={18} className="text-white fill-white/20" />
                    <div className="flex flex-col">
                        <span className="text-white font-headline font-black text-[11px] leading-tight uppercase tracking-wider">DON'T SLEEP!</span>
                        <span className="text-[#37BCF8] font-headline font-bold text-[10px] leading-tight uppercase tracking-tight group-hover:text-white transition-colors">12 sold in the last few days</span>
                    </div>
                 </div>

                 {/* Persistent Editorial Info + CTA Overlay */}
                 <div className="absolute inset-x-0 bottom-[68px] p-5 z-20 flex flex-col gap-4">
                    <div className="flex flex-col gap-0.5">
                        <h3 className="font-headline font-bold text-lg text-white uppercase tracking-tighter leading-none mb-1 group-hover:text-[#E30613] transition-colors">{title}</h3>
                        <div className="flex flex-col gap-0.5">
                            <span className="font-headline font-black text-lg text-white">{price}</span>
                            <span className="font-label text-[11px] text-white/80 tracking-widest uppercase">OR 12X R$ {(parseInt(price.replace(/\D/g,''))/12).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* CRO: Persistent Quick Add Action Bar */}
                    <button className="w-full py-4 bg-white text-black font-headline font-black text-[9px] tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all shadow-xl flex items-center justify-center gap-2 transform group-hover:scale-[1.02] rounded-[10px]">
                        ADD TO CART <ShoppingBag size={12} />
                    </button>
                 </div>
            </div>
        </div>
    )
}

function CategoryView({ 
    activeCategory, 
    setActiveCategory, 
    setSelectedProduct, 
    setView 
}: { 
    activeCategory: 'ALL' | 'FEMALE' | 'MALE' | 'UNISEX', 
    setActiveCategory: (c: 'ALL' | 'FEMALE' | 'MALE' | 'UNISEX') => void,
    setSelectedProduct: (p: any) => void,
    setView: (v: any) => void
}) {
    const products = [
        { id: 1, tag: "NEW", category: 'FEMALE', image: "/streetwear_1.png", title: "ASTRA", price: "R$ 1.250", colors: ['#000', '#A67B5B', '#E5E5E5'] },
        { id: 2, tag: "LIMITED", category: 'MALE', image: "/streetwear_2.png", title: "LUNARA", price: "R$ 2.250", colors: ['#000', '#5c5c5c'] },
        { id: 3, tag: "PRE-ORDER", category: 'FEMALE', image: "/streetwear_3.png", title: "NOIRVUE", price: "R$ 1.350", colors: ['#A67B5B', '#000'] },
        { id: 4, tag: "NEW", category: 'MALE', image: "/streetwear_1.png", title: "SOLEIL", price: "R$ 1.200", colors: ['#E5E5E5', '#A67B5B'] },
        { id: 5, tag: "POPULAR", category: 'FEMALE', image: "/streetwear_2.png", title: "ZENITH", price: "R$ 1.850", colors: ['#000'] },
        { id: 6, tag: "NEW", category: 'MALE', image: "/streetwear_3.png", title: "ECLIPSE", price: "R$ 1.450", colors: ['#E5E5E5', '#000'] },
        { id: 7, tag: "LIMITED", category: 'FEMALE', image: "/streetwear_1.png", title: "ORION", price: "R$ 2.100", colors: ['#000', '#A67B5B'] },
        { id: 8, tag: "NEW", category: 'MALE', image: "/streetwear_2.png", title: "SOLARIS", price: "R$ 1.150", colors: ['#A67B5B'] },
    ];

    const filteredProducts = activeCategory === 'ALL' 
        ? products 
        : products.filter(p => p.category === activeCategory);

    return (
        <div className="bg-white min-h-screen pt-40 pb-24">
            <div className="container mx-auto px-8 md:px-16 text-black">
                {/* Category Header */}
                <div className="mb-20">
                    <div className="flex items-center gap-2 text-[10px] font-label font-bold text-black/40 tracking-widest uppercase mb-4">
                        <span>Shop All</span>
                        <div className="w-1 h-1 rounded-full bg-black/20"></div>
                        <span className="text-black">
                          {activeCategory === 'ALL' ? 'Eyewear' : activeCategory === 'FEMALE' ? 'Womens' : 'Mens'}
                        </span>
                    </div>
                    {activeCategory === 'FEMALE' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-headline font-black text-black tracking-tighter uppercase leading-[0.8]">
                          WOMENS<br/>EYEWEAR
                        </h1>
                        <div className="aspect-[3/4] md:aspect-[4/3] overflow-hidden rounded-sm border border-black/5 max-h-[500px]">
                          <img 
                            src="/female_collection.png" 
                            alt="BLVCK LENS Womens Collection" 
                            className="w-full h-full object-cover object-top hover:scale-105 transition-all duration-[2s]"
                          />
                        </div>
                      </div>
                    ) : (
                      <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-headline font-black text-black tracking-tighter uppercase leading-[0.8]">
                        SHOP ALL<br/>EYEWEAR
                      </h1>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="sticky top-32">
                            <div className="flex items-center justify-between border-b border-black pb-4 mb-8">
                                <span className="font-headline font-bold text-sm text-black uppercase">FILTERS (0)</span>
                                <Plus size={14} className="text-black" />
                            </div>

                            <div className="space-y-10">
                                {/* Genre/Category */}
                                <div>
                                    <h4 className="font-label font-black text-[10px] tracking-widest text-black/40 uppercase mb-6">Categories</h4>
                                    <ul className="space-y-4 font-label font-bold text-xs text-black uppercase tracking-tight">
                                        <li 
                                          className={`flex items-center justify-between cursor-pointer transition-colors ${activeCategory === 'MALE' ? 'text-black' : 'text-black/40 hover:text-black'}`}
                                          onClick={() => setActiveCategory('MALE')}
                                        >
                                            <span>MALE</span>
                                            <span className="text-[10px] opacity-40">(4)</span>
                                        </li>
                                        <li 
                                          className={`flex items-center justify-between cursor-pointer transition-colors ${activeCategory === 'FEMALE' ? 'text-black' : 'text-black/40 hover:text-black'}`}
                                          onClick={() => setActiveCategory('FEMALE')}
                                        >
                                            <span>FEMALE</span>
                                            <span className="text-[10px] opacity-40">(4)</span>
                                        </li>
                                        <li 
                                          className={`flex items-center justify-between cursor-pointer transition-colors ${activeCategory === 'ALL' ? 'text-black' : 'text-black/40 hover:text-black'}`}
                                          onClick={() => setActiveCategory('ALL')}
                                        >
                                            <span>VIEW ALL</span>
                                            <span className="text-[10px] opacity-40">(8)</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Price Filter */}
                                <div>
                                    <h4 className="font-label font-black text-[10px] tracking-widest text-black/40 uppercase mb-6">PRICE</h4>
                                    <ul className="space-y-4 font-label font-bold text-xs text-black uppercase tracking-tight">
                                        <li className="flex items-center gap-3 cursor-pointer">
                                            <div className="w-4 h-4 border border-black/20 rounded-sm"></div>
                                            <span>Under R$ 1,500</span>
                                        </li>
                                        <li className="flex items-center gap-3 cursor-pointer">
                                            <div className="w-4 h-4 border border-black/20 rounded-sm"></div>
                                            <span>R$ 1,500 – R$ 2,500</span>
                                        </li>
                                        <li className="flex items-center gap-3 cursor-pointer">
                                            <div className="w-4 h-4 border border-black/20 rounded-sm"></div>
                                            <span>Above R$ 2,500</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Frame color */}
                                <div>
                                    <h4 className="font-label font-black text-[10px] tracking-widest text-black/40 uppercase mb-6">FRAME</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['#000000', '#A67B5B', '#E5E5E5', '#5C5C5C', '#FFFFFF'].map((color, i) => (
                                            <div key={i} className="w-6 h-6 rounded-full border border-black/10 cursor-pointer hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: color }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-10 border-b border-black/10 pb-6">
                            <span className="font-label font-bold text-[10px] text-black/40 tracking-widest uppercase">{filteredProducts.length} PRODUCTS FOUND</span>
                            <div className="flex items-center gap-4">
                                <span className="font-label font-bold text-[10px] text-black/40 tracking-widest uppercase">SORT BY:</span>
                                <span className="font-label font-bold text-[10px] text-black tracking-widest uppercase cursor-pointer">RELEVANCE</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredProducts.map((product) => (
                                <ProductCard 
                                    key={product.id} 
                                    image={product.image}
                                    tag={product.tag}
                                    price={product.price}
                                    title={product.title}
                                    colors={product.colors}
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        setView('product');
                                    }} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function PromoCard({ category, title, linkText, bgImage, onClick }: { category: string, title: string, linkText: string, bgImage: string, onClick?: () => void }) {
    return (
        <div className="relative w-full h-full min-h-[500px] flex items-end p-8 md:p-12 overflow-hidden rounded-[10px] group border border-white/5 cursor-pointer" onClick={onClick}>
            <img src={bgImage} alt={title} className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[10s]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="relative z-10">
                <span className="font-label text-[10px] tracking-widest text-white/80 uppercase block mb-4">{category}</span>
                <h3 className="font-headline font-black text-3xl md:text-5xl text-white uppercase tracking-tighter leading-tight mb-8 max-w-lg">
                    {title}
                </h3>
                <div className="inline-flex items-center text-white font-label text-xs tracking-widest uppercase border-b border-white pb-2 hover:opacity-70 transition-opacity">
                    {linkText} <ArrowRight size={14} className="ml-2" />
                </div>
            </div>
        </div>
    )
}
function MegaMenuCard({ title, image, onClick }: { title: string, image: string, onClick: () => void }) {
  return (
    <div
      className="relative flex flex-col justify-end p-6 overflow-hidden rounded-[10px] cursor-pointer group aspect-[3/4] border border-white/5 bg-zinc-900"
      onClick={onClick}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
      <h4 className="relative z-10 font-headline font-black text-xl tracking-tighter text-white uppercase text-center mt-auto">
        {title}
      </h4>
    </div>
  )
}
