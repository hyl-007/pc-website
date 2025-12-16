import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Cpu, 
  Monitor, 
  HardDrive, 
  Zap, 
  Box, 
  Settings, 
  Menu, 
  X, 
  ChevronRight, 
  ShieldCheck, 
  User as UserIcon, 
  ShoppingCart,
  Wrench,
  Camera,
  CheckCircle,
  Lock,
  DollarSign,
  Mail,
  AlertTriangle,
  Loader2,
  WifiOff,
  ArrowRight
} from 'lucide-react';
import { Part, User, GalleryItem, BuilderJob } from './types';

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

const API_URL = 'http://localhost:5000/api';

// --- MOCK DATA ---

const MOCK_PARTS: Part[] = [
  // Chassis
  { id: 'c1', name: 'Nebula Core X1 (3D Printed)', price: 150, type: 'chassis', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400&auto=format&fit=crop' },
  { id: 'c2', name: 'Void Walker S (Glass)', price: 200, type: 'chassis', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=400&auto=format&fit=crop' },
  // CPU
  { id: 'cpu1', name: 'Intel Core i9-14900K', price: 600, type: 'cpu', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=200&auto=format&fit=crop' },
  { id: 'cpu2', name: 'AMD Ryzen 9 7950X3D', price: 650, type: 'cpu', image: 'https://images.unsplash.com/photo-1555618254-76a0d46e398d?q=80&w=200&auto=format&fit=crop' },
  // GPU
  { id: 'gpu1', name: 'NVIDIA RTX 4090 OC', price: 1600, type: 'gpu', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=300&auto=format&fit=crop' },
  { id: 'gpu2', name: 'NVIDIA RTX 4080 Super', price: 1000, type: 'gpu', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=300&auto=format&fit=crop' },
  // RAM
  { id: 'ram1', name: 'Corsair Dom. Titanium 64GB', price: 300, type: 'ram', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=200&auto=format&fit=crop' },
  { id: 'ram2', name: 'G.Skill Trident Z5 32GB', price: 150, type: 'ram', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=200&auto=format&fit=crop' },
  // Storage
  { id: 'st1', name: 'Samsung 990 Pro 2TB', price: 180, type: 'storage', image: 'https://images.unsplash.com/photo-1597872250969-bc3a2d25d8a9?q=80&w=200&auto=format&fit=crop' },
  { id: 'st2', name: 'Western Digital Black 4TB', price: 250, type: 'storage', image: 'https://plus.unsplash.com/premium_photo-1681488350153-2940656a1b24?q=80&w=200&auto=format&fit=crop' },
  // PSU
  { id: 'psu1', name: 'Thor 1200W Platinum', price: 300, type: 'psu', image: 'https://images.unsplash.com/photo-1544652478-6653e09f1826?q=80&w=200&auto=format&fit=crop' },
  // MB
  { id: 'mb1', name: 'ROG Maximus Z790', price: 500, type: 'motherboard', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&auto=format&fit=crop' },
];

const MOCK_GALLERY: GalleryItem[] = [
  { id: 'g1', user: 'CyberNinja99', image: 'https://picsum.photos/id/20/600/400', specs: 'RTX 4090, i9-14900K', review: 'Absolute beast of a machine. The 3D printed chassis airflow is insane.', approved: true },
  { id: 'g2', user: 'SGLooper', image: 'https://picsum.photos/id/21/600/400', specs: 'Ryzen 7, RTX 4070', review: 'Clean cable management by the builder. Delivered in 2 days.', approved: true },
];

const MOCK_JOBS: BuilderJob[] = [
  { id: 'j1', customerName: 'Alice Tan', specs: MOCK_PARTS.slice(0, 4), payout: 150, status: 'pending', location: 'Tampines' },
  { id: 'j2', customerName: 'Bob Lim', specs: MOCK_PARTS.slice(2, 6), payout: 220, status: 'pending', location: 'Jurong East' },
];

const CATEGORY_INFO: Record<string, string> = {
  chassis: "The housing for your PC components. Determines airflow & size.",
  cpu: "Central Processing Unit. The brain that handles instructions.",
  motherboard: "Main circuit board connecting all components together.",
  gpu: "Graphics Processing Unit. Renders complex images & games.",
  ram: "Random Access Memory. Fast short-term storage for active tasks.",
  storage: "Long-term storage (SSD/HDD) for your OS, games, and files.",
  psu: "Power Supply Unit. Delivers stable power to all parts.",
};

// --- COMPONENTS ---

// 1. Navigation
const Navbar: React.FC<{ user: User | null; onLogout: () => void }> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Customize', path: '/customize' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Accessories', path: '/accessories' },
    { name: 'Builders', path: '/builders' },
  ];

  useGSAP(() => {
    // Initial Nav Entry
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
  }, []);

  return (
    <nav ref={navRef} className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Zap className="h-8 w-8 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-2xl font-bold tracking-wider text-white">NEBULA<span className="text-cyan-400">FORGE</span></span>
          </Link>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 group ${
                    location.pathname === link.path ? 'text-cyan-400' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 transform origin-left transition-transform duration-300 ${location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-400">
                  {user.role === 'builder' ? '🛠️ ' : ''}Welcome, {user.name}
                </span>
                <button onClick={onLogout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="relative px-4 py-2 rounded-full overflow-hidden group border border-cyan-500/50 text-cyan-400"
              >
                <div className="absolute inset-0 w-full h-full bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-all"></div>
                <div className="absolute inset-0 w-0 bg-cyan-500/20 group-hover:w-full transition-all duration-300 ease-out"></div>
                <span className="relative z-10">Login / Join</span>
              </Link>
            )}
          </div>

          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                 <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-cyan-400">Login / Join</Link>
              )}
          </div>
        </div>
      )}
    </nav>
  );
};

// 2. Hero Section
const Hero = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const btnRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(titleRef.current, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
      skewY: 7
    })
    .from(textRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.5")
    .from(btnRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(1.7)"
    }, "-=0.3");

    // Subtle parallax on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      
      gsap.to(containerRef.current, {
        backgroundPosition: `calc(50% + ${x}px) calc(50% + ${y}px)`,
        duration: 0.5,
        ease: "power1.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1 
          ref={titleRef}
          className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6 drop-shadow-2xl leading-tight"
        >
          ARCHITECT YOUR REALITY
        </h1>
        
        <p 
          ref={textRef}
          className="text-xl md:text-2xl text-slate-300 mb-10 font-light tracking-wide max-w-2xl mx-auto"
        >
          Singapore's Premium Custom PC Ecosystem. <br />
          Designed by you. Built by artisans. Delivered to your doorstep.
        </p>
        
        <div ref={btnRef} className="flex flex-col sm:flex-row justify-center gap-6">
          <Link to="/customize" className="group relative px-8 py-4 bg-cyan-500 text-slate-950 font-bold rounded-none skew-x-[-10deg] hover:bg-cyan-400 transition-all overflow-hidden">
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-[20deg]"></div>
            <span className="block skew-x-[10deg]">CUSTOMIZE RIG</span>
          </Link>
          <Link to="/gallery" className="group relative px-8 py-4 bg-transparent border border-white/30 text-white font-bold rounded-none skew-x-[-10deg] hover:bg-white/10 transition-all">
            <span className="block skew-x-[10deg]">VIEW SHOWCASE</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

// 3. Why Choose Us / How It Works
const InfoSection = () => {
  const sectionRef = useRef(null);
  
  useGSAP(() => {
    const cards = gsap.utils.toArray('.info-card');
    
    // Animate cards on scroll
    gsap.from(cards, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
      ease: "power2.out"
    });
  }, { scope: sectionRef });

  const steps = [
    { title: 'Visualize', desc: 'Drag & drop premium components into your chassis.', icon: <Monitor className="w-10 h-10 text-cyan-400" /> },
    { title: 'Engineer', desc: 'Verified local builders assemble your rig with precision.', icon: <Wrench className="w-10 h-10 text-purple-500" /> },
    { title: 'Deploy', desc: 'Secure delivery to your doorstep within Singapore.', icon: <Box className="w-10 h-10 text-green-400" /> },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute top-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-600 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">BEYOND PRE-BUILTS</h2>
            <p className="text-slate-400 mb-4 text-lg">
              We leverage <span className="text-cyan-400">industrial 3D printing</span> to create chassis designs impossible with traditional manufacturing. 
              No physical shop means we invest more in components and talent.
            </p>
            <ul className="space-y-4 text-slate-300">
              <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-cyan-500" /> Fully modular 3D printed aesthetics</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-cyan-500" /> Local Singaporean artisan network</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-cyan-500" /> 15% Cheaper than retail stores</li>
            </ul>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-700"></div>
            <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2642&auto=format&fit=crop" alt="PC Interior" className="relative rounded-xl shadow-2xl border border-white/10" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-12">THE PROCESS</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="info-card bg-slate-900/50 p-8 rounded-xl border border-white/5 hover:border-cyan-500/50 transition-colors hover:bg-slate-900/80">
              <div className="mb-6">{step.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 4. Configurator (The Core Feature)
const Configurator: React.FC<{ user: User | null }> = ({ user }) => {
  // Allow multiple storage devices
  const [selectedParts, setSelectedParts] = useState<{
    chassis: Part | null;
    cpu: Part | null;
    gpu: Part | null;
    ram: Part | null;
    motherboard: Part | null;
    psu: Part | null;
    storage: Part[]; // Changed from Part | null to Part[]
  }>({
    chassis: null,
    cpu: null,
    gpu: null,
    ram: null,
    motherboard: null,
    psu: null,
    storage: [],
  });

  const categories = ['chassis', 'cpu', 'motherboard', 'gpu', 'ram', 'storage', 'psu'];
  const [activeCategory, setActiveCategory] = useState('chassis');
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  // Updated Total Price Logic
  const totalPrice = Object.entries(selectedParts).reduce((acc, [key, part]) => {
    if (key === 'storage' && Array.isArray(part)) {
        return acc + part.reduce((s, p) => s + p.price, 0);
    }
    if (part && !Array.isArray(part)) return acc + (part as Part).price;
    return acc;
  }, 0);

  const discount = (user?.isFirstTime && user.role === 'user') ? 0.15 : 0;
  const finalPrice = totalPrice * (1 - discount);

  const handleSelect = (part: Part) => {
    if (part.type === 'storage') {
        setSelectedParts(prev => {
            const currentStorage = prev.storage;
            const exists = currentStorage.find(p => p.id === part.id);
            if (exists) {
                // Remove if already selected (toggle)
                return { ...prev, storage: currentStorage.filter(p => p.id !== part.id) };
            }
            // Add to selection
            return { ...prev, storage: [...currentStorage, part] };
        });
    } else {
        setSelectedParts(prev => ({ ...prev, [part.type]: part }));
    }
  };

  const isPartSelected = (part: Part) => {
    // Safely retrieve the selected part(s) based on key
    const selection = selectedParts[part.type as keyof typeof selectedParts];
    if (Array.isArray(selection)) {
        return selection.some(p => p.id === part.id);
    }
    return selection?.id === part.id;
  };

  // Helper for lighting status
  const isPowered = !!selectedParts.psu;

  // VISUALIZER GSAP REFERENCES
  const visualizerRef = useRef<HTMLDivElement>(null);
  
  // Animate chassis appearance
  useGSAP(() => {
    if (selectedParts.chassis) {
      gsap.fromTo(".chassis-frame", 
        { scale: 0.9, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.2)" }
      );
    }
  }, [selectedParts.chassis]);

  // --- COMPONENT ANIMATIONS ---
  
  // 1. Motherboard: Fades in with a "tech" scale effect
  useGSAP(() => {
    if (selectedParts.motherboard && selectedParts.chassis) {
      gsap.fromTo(".mb-part", 
        { opacity: 0, scale: 1.1, filter: "blur(10px)" }, 
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out" }
      );
    }
  }, [selectedParts.motherboard]);

  // 2. CPU: Drops from top with precision snap
  useGSAP(() => {
    if (selectedParts.cpu && selectedParts.chassis) {
        const tl = gsap.timeline();
        tl.fromTo(".cpu-part", 
          { y: -300, opacity: 0, scale: 2 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" }
        )
        .to(".cpu-light", { opacity: 1, duration: 0.1, yoyo: true, repeat: 3, ease: "power1.inOut" }, "-=0.2");
    }
  }, [selectedParts.cpu]);

  // 3. RAM: Slides in diagonally and snaps
  useGSAP(() => {
    if (selectedParts.ram && selectedParts.chassis) {
      gsap.fromTo(".ram-part",
        { x: 50, y: -50, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.6, ease: "back.out(2)" }
      );
    }
  }, [selectedParts.ram]);

  // 4. GPU: Slides in from side with "heavy" inertia
  useGSAP(() => {
    if (selectedParts.gpu && selectedParts.chassis) {
      gsap.fromTo(".gpu-part",
        { x: -400, opacity: 0, skewX: -10 },
        { x: 0, opacity: 1, skewX: 0, duration: 0.9, ease: "power4.out" }
      );
    }
  }, [selectedParts.gpu]);

  // 5. PSU: Lifts up from bottom into the shroud
  useGSAP(() => {
    if (selectedParts.psu && selectedParts.chassis) {
       gsap.fromTo(".psu-part",
         { y: 150, opacity: 0 },
         { y: 0, opacity: 1, duration: 0.8, ease: "circ.out" }
       );
    }
  }, [selectedParts.psu]);

  // 6. Storage: Staggered slide in
  useGSAP(() => {
      if (selectedParts.storage.length > 0 && selectedParts.chassis) {
          gsap.fromTo(".storage-part",
             { x: 100, opacity: 0 },
             { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.2)" }
          );
      }
  }, [selectedParts.storage]); // Re-run when storage array changes

  // Ambient Loop for powered system
  useGSAP(() => {
    if (isPowered) {
       gsap.to(".power-glow", {
          opacity: 0.6,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
       });
    }
  }, [isPowered]);


  return (
    <div className="pt-20 pb-12 min-h-screen bg-slate-950 flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 flex flex-col lg:flex-row gap-8">
        
        {/* Left Panel: Component Selection */}
        <div className="w-full lg:w-1/3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10 p-6 flex flex-col h-[80vh]">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Settings className="mr-2 text-cyan-400" /> COMPONENT SELECTION
          </h2>
          
          {/* Category Tabs */}
          <div 
            className="flex overflow-x-auto space-x-2 pb-4 mb-4 scrollbar-thin"
            onScroll={() => setTooltip(null)} // Hide tooltip on scroll
          >
            {categories.map(cat => {
              const selection = selectedParts[cat as keyof typeof selectedParts];
              const isFilled = Array.isArray(selection) ? selection.length > 0 : !!selection;
              const isActive = activeCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  onMouseEnter={(e) => {
                     const rect = e.currentTarget.getBoundingClientRect();
                     setTooltip({
                       text: CATEGORY_INFO[cat] || '',
                       x: rect.left + rect.width / 2,
                       y: rect.top
                     });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold uppercase whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isActive 
                      ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-500/30' 
                      : isFilled
                        ? 'bg-slate-800 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                        : 'bg-slate-800 text-slate-400 border-transparent hover:bg-slate-700'
                  }`}
                >
                  {cat}
                  {isFilled && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-cyan-400'} shadow-[0_0_5px_currentColor]`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Parts List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {MOCK_PARTS.filter(p => p.type === activeCategory).map(part => {
              const selected = isPartSelected(part);
              return (
                <div 
                    key={part.id}
                    onClick={() => handleSelect(part)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center space-x-4 group ${
                    selected
                        ? 'border-cyan-500 bg-cyan-500/10' 
                        : 'border-white/5 bg-slate-800/50 hover:border-white/20'
                    }`}
                >
                    <img src={part.image} alt={part.name} className="w-16 h-16 object-cover rounded bg-slate-700 group-hover:scale-105 transition-transform" />
                    <div className="flex-1">
                    <h4 className="text-white font-medium">{part.name}</h4>
                    <p className="text-cyan-400 font-bold">${part.price}</p>
                    </div>
                    {selected && <CheckCircle className="text-cyan-500 w-5 h-5" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Visualization */}
        <div ref={visualizerRef} className="w-full lg:w-1/3 relative flex flex-col items-center justify-center bg-slate-900/40 rounded-xl border border-white/5 p-8 overflow-hidden min-h-[500px]">
          {/* Background Grid Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          
          <AnimatePresence mode="wait">
             {selectedParts.chassis ? (
               <div 
                key="chassis-container"
                className="chassis-frame relative w-72 h-[32rem] border-4 border-slate-700 bg-slate-800/90 rounded-xl flex flex-col items-center shadow-2xl shadow-cyan-900/20 overflow-hidden"
               >
                  {/* --- Dynamic Lighting & AO Layer --- */}
                  <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-slate-900/80" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.8)_100%)]" /> {/* Darkened edge for depth */}
                    
                    {/* CPU Ambient Glow */}
                    {selectedParts.cpu && (
                        <div className={`cpu-light absolute top-[20%] left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-400 blur-[80px] rounded-full mix-blend-screen opacity-20 ${isPowered ? 'power-glow' : ''}`}></div>
                    )}
                    
                    {/* GPU Ambient Glow */}
                    {selectedParts.gpu && (
                        <div className={`absolute top-[45%] left-0 right-0 h-32 bg-green-500 blur-[60px] mix-blend-screen opacity-20 ${isPowered ? 'power-glow' : ''}`}></div>
                    )}
                  </div>

                  {/* Chassis Image Background (faint) */}
                  <img src={selectedParts.chassis.image} alt="chassis" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none blur-sm z-0" />
                  
                  <div className="absolute top-0 w-full h-full flex flex-col p-4 z-10 gap-2">
                    {/* Top Section: Motherboard Area */}
                    <div className="relative flex-[2] w-full border border-dashed border-white/10 rounded-lg flex items-center justify-center bg-black/40 shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] overflow-hidden">
                        {/* Motherboard Backplate/Tray Detail */}
                        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-black pointer-events-none"></div>

                        {/* Motherboard */}
                        {selectedParts.motherboard && (
                            <div className="mb-part absolute inset-2 z-0 transform perspective-[800px] rotate-x-2">
                                <img 
                                    key={selectedParts.motherboard.id}
                                    src={selectedParts.motherboard.image} 
                                    className="w-full h-full object-cover opacity-70 rounded-lg drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] grayscale-[0.2]" 
                                />
                                {/* AO Overlay for Motherboard - deepened */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/80 rounded-lg mix-blend-overlay"></div>
                                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] rounded-lg pointer-events-none"></div>
                            </div>
                        )}

                        {/* CPU */}
                        {selectedParts.cpu && (
                            <div className="cpu-part absolute top-[25%] left-1/2 -translate-x-1/2 w-20 h-20 bg-slate-900 border border-cyan-500/50 shadow-[0_0_30px_rgba(0,0,0,0.8),inset_0_0_10px_rgba(0,0,0,1)] z-20 flex items-center justify-center rounded-lg overflow-hidden group">
                                <img src={selectedParts.cpu.image} className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70"></div> {/* Stronger Self-shadow */}
                                <div className="absolute inset-0 bg-cyan-400 mix-blend-overlay opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                {/* Pin Highlight */}
                                <div className="absolute top-0 right-0 w-3 h-3 bg-cyan-400 blur-sm opacity-50"></div>
                            </div>
                        )}

                        {/* RAM */}
                        {selectedParts.ram && (
                            <div className="ram-part absolute top-[20%] right-[12%] w-8 h-[50%] bg-slate-900/80 border-r-2 border-slate-600 shadow-[-10px_10px_20px_rgba(0,0,0,0.9)] z-20 flex flex-col overflow-hidden rounded transform skew-y-12 origin-top-right">
                                <img src={selectedParts.ram.image} className="w-full h-full object-cover opacity-80" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div> {/* Side shadow for depth */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent mix-blend-overlay"></div>
                            </div>
                        )}
                    </div>

                    {/* Middle Section: GPU Area */}
                    <div className="relative h-28 w-full border border-dashed border-white/10 rounded-lg flex items-center justify-center bg-black/50 perspective-[1200px] shadow-[inset_0_15px_30px_rgba(0,0,0,0.8)] overflow-visible z-20">
                         {/* GPU Slot Highlight */}
                         <div className="absolute bottom-2 left-2 right-2 h-1 bg-slate-800 shadow-[0_0_10px_rgba(0,255,255,0.1)]"></div>
                         
                        {selectedParts.gpu ? (
                            <div className="gpu-part relative w-[98%] h-24 bg-slate-800 border-t border-white/10 border-b-4 border-b-black/80 rounded flex items-center shadow-[0_30px_50px_rgba(0,0,0,1)] overflow-hidden z-20 cursor-pointer transform hover:scale-[1.01] transition-transform origin-center">
                                <img src={selectedParts.gpu.image} className="w-full h-full object-cover opacity-95" />
                                <div className="absolute bottom-2 right-2 text-[10px] text-green-400 font-bold bg-black/90 px-3 py-1 rounded backdrop-blur-md border border-green-500/30 shadow-lg">RTX ON</div>
                                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/90 pointer-events-none"></div> {/* Heavy grounding gradient */}
                                <div className="absolute top-0 w-full h-[1px] bg-white/30"></div> {/* Top edge light */}
                            </div>
                        ) : <span className="text-xs text-slate-600 font-mono tracking-widest opacity-40">PCIE X16 SLOT</span>}
                    </div>

                    {/* Bottom Section: PSU & Storage */}
                    <div className="flex h-24 gap-3 w-full z-10">
                        {/* PSU */}
                        <div className="flex-[2] border border-dashed border-white/10 rounded-lg flex items-center justify-center bg-black/60 overflow-hidden relative group shadow-[inset_0_10px_30px_rgba(0,0,0,0.9)]">
                            {selectedParts.psu ? (
                                <div className="psu-part w-full h-full relative">
                                    <img src={selectedParts.psu.image} className="w-full h-full object-cover opacity-60 grayscale-[0.3]" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div> {/* Deep recess feel */}
                                    <div className="absolute inset-0 shadow-[inset_0_0_20px_black]"></div>
                                    <div className="absolute bottom-2 left-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] font-bold text-slate-300 tracking-widest">ACTIVE</span>
                                        </div>
                                    </div>
                                </div>
                            ) : <span className="text-xs text-slate-600 opacity-40">PSU SHROUD</span>}
                        </div>
                        {/* Storage */}
                        <div className="flex-1 border border-dashed border-white/10 rounded-lg flex items-center justify-center bg-black/60 relative overflow-hidden shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)]">
                             {selectedParts.storage.length > 0 ? (
                                <div className="relative w-full h-full flex items-center justify-center perspective-[800px]">
                                    {selectedParts.storage.map((disk, i) => (
                                        <div
                                            key={disk.id}
                                            className="storage-part absolute w-[80%] h-[70%] bg-slate-800 rounded border border-slate-700 shadow-xl overflow-hidden"
                                            style={{ 
                                                left: `${50 + (i * 5)}%`, 
                                                top: `${50 - (i * 5)}%`, 
                                                translate: '-50% -50%',
                                                zIndex: i,
                                                transform: `rotateY(-15deg) translateZ(${i * 10}px)`,
                                                boxShadow: '-5px 5px 15px rgba(0,0,0,0.8)'
                                            }}
                                        >
                                            <img src={disk.image} className="w-full h-full object-cover opacity-80" />
                                            <div className="absolute inset-0 bg-black/50"></div>
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500/50"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : <span className="text-xs text-slate-600 opacity-40">DRIVE CAGE</span>}
                        </div>
                    </div>
                  </div>
                  
                  {/* Glass Panel Reflection overlay - Enhanced */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-white/5 pointer-events-none rounded-xl border border-white/5 z-20"></div>
                  <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-20 transform -skew-y-12 opacity-30"></div>
                  
                  {/* Final Frame Glint/Shadow vignette */}
                  <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] rounded-xl pointer-events-none z-30"></div>
               </div>
             ) : (
               <div className="text-center text-slate-500">
                 <Box className="w-24 h-24 mx-auto mb-4 opacity-20" />
                 <p>Select a Chassis to begin</p>
               </div>
             )}
          </AnimatePresence>

          {/* Stats Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-slate-400 z-20">
             <span>Power: {selectedParts.psu ? <span className="text-green-400">Stable</span> : 'Checking...'}</span>
             <span>Est. Wattage: {selectedParts.gpu && selectedParts.cpu ? '750W' : '---'}</span>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="w-full lg:w-1/3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10 p-6 flex flex-col justify-between h-[80vh]">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">BUILD SUMMARY</h2>
            <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
              {Object.entries(selectedParts).map(([type, part]) => {
                // Special handling for storage array
                if (type === 'storage' && Array.isArray(part) && part.length > 0) {
                     const storageParts = part as Part[];
                     return (
                         <div key={type} className="border-b border-white/5 pb-2">
                             <div className="flex justify-between text-sm">
                                 <span className="text-slate-400 uppercase">STORAGE ({storageParts.length})</span>
                             </div>
                             {storageParts.map(p => (
                                 <div key={p.id} className="flex justify-between text-sm pl-4 mt-1">
                                     <span className="text-slate-300 text-xs truncate max-w-[150px]">{p.name}</span>
                                     <span className="text-slate-200 text-xs">${p.price}</span>
                                 </div>
                             ))}
                         </div>
                     );
                }
                
                // Normal handling for single parts
                if (part && !Array.isArray(part)) {
                   const singlePart = part as Part;
                   return (
                    <div key={type} className="flex justify-between text-sm border-b border-white/5 pb-2">
                        <span className="text-slate-400 uppercase">{type}</span>
                        <span className="text-slate-200">{singlePart.name}</span>
                    </div>
                   );
                }
                return null;
              })}
            </div>
          </div>

          <div className="space-y-4">
             {user?.isFirstTime && (
                <div className="bg-green-500/10 border border-green-500/30 p-3 rounded text-green-400 text-sm flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" /> New Member Discount (15%) Applied!
                </div>
             )}
            <div className="flex justify-between items-end">
              <span className="text-slate-400">Total Estimate</span>
              <div className="text-right">
                {user?.isFirstTime && <span className="block text-sm line-through text-slate-500">${totalPrice.toLocaleString()}</span>}
                <span className="text-4xl font-bold text-cyan-400">${finalPrice.toLocaleString()}</span>
              </div>
            </div>
            <button className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-bold text-white hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-900/40 uppercase tracking-widest relative overflow-hidden group">
              <span className="relative z-10">Checkout Build</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <p className="text-xs text-center text-slate-500">Built by verified experts. Delivered in 3-5 days.</p>
          </div>
        </div>

      </div>

      {/* Tooltip Overlay */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ 
              position: 'fixed', 
              left: tooltip.x, 
              top: tooltip.y - 12,
              translateX: '-50%',
              translateY: '-100%'
            }}
            className="fixed z-[100] px-3 py-2 bg-slate-900/95 backdrop-blur border border-cyan-500/50 text-xs text-cyan-50 rounded shadow-[0_4px_20px_rgba(0,0,0,0.5)] whitespace-nowrap pointer-events-none"
          >
             <div className="relative z-10">{tooltip.text}</div>
             {/* Arrow */}
             <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-cyan-500/50 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 5. Auth Component
const AuthPage: React.FC<{ onLogin: (u: User) => void }> = ({ onLogin }) => {
  const [step, setStep] = useState<'init' | 'verify'>('init');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', code: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const runDemoFallback = (action: 'init' | 'verify') => {
    setError('Backend unreachable. Using Demo Mode.');
    setTimeout(() => setError(''), 3000);
    
    if (action === 'init') {
      // Simulate sending code
      setTimeout(() => {
        setStep('verify');
        setLoading(false);
      }, 1500);
    } else {
      // Simulate login success
      setTimeout(() => {
        onLogin({
          id: 'demo_user',
          name: formData.name || 'Demo User',
          email: formData.email,
          role: 'user',
          isFirstTime: true
        });
        setLoading(false);
      }, 1500);
    }
  }

  const handleInit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_URL}/register-init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            name: formData.name, 
            email: formData.email, 
            password: formData.password 
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Error');
      
      setStep('verify');
      setLoading(false);
    } catch (err: any) {
      console.warn("Backend error:", err);
      // Check if it is a fetch error (backend down)
      if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
        runDemoFallback('init');
        return;
      }
      setError(err.message);
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, code: formData.code })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      
      onLogin(data.user);
    } catch (err: any) {
      console.warn("Backend error:", err);
      if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
        runDemoFallback('verify');
        return;
      }
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-slate-900/90 p-8 rounded-xl border border-white/10 w-full max-w-md shadow-2xl"
      >
        <div className="text-center mb-8">
          <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            {step === 'init' ? 'Join Nebula Forge' : 'Verify Identity'}
          </h2>
          <p className="text-slate-400">
            {step === 'init' 
              ? 'Create your artisan profile to start building.' 
              : `Enter the code sent to ${formData.email}`}
          </p>
        </div>

        {error && (
           <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded flex items-center text-red-400 text-sm">
             <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
             {error}
           </div>
        )}

        {step === 'init' ? (
          <form onSubmit={handleInit} className="space-y-4">
            <div>
               <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Full Name</label>
               <input 
                 name="name" 
                 type="text" 
                 required
                 value={formData.name}
                 onChange={handleChange}
                 className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                 placeholder="e.g. Kai Tan"
               />
            </div>
            <div>
               <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Email Address</label>
               <input 
                 name="email" 
                 type="email" 
                 required
                 value={formData.email}
                 onChange={handleChange}
                 className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                 placeholder="kai@example.com"
               />
            </div>
            <div>
               <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Password</label>
               <input 
                 name="password" 
                 type="password" 
                 required
                 value={formData.password}
                 onChange={handleChange}
                 className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                 placeholder="••••••••"
               />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 mt-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
               <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Verification Code</label>
               <input 
                 name="code" 
                 type="text" 
                 required
                 value={formData.code}
                 onChange={handleChange}
                 className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                 placeholder="••••••"
                 maxLength={6}
               />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 mt-4 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Verify & Login'}
            </button>
            <button 
              type="button" 
              onClick={() => setStep('init')}
              className="w-full py-2 text-slate-400 hover:text-white text-sm"
            >
              Back to Sign Up
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const handleLogin = (userData: User) => {
    setUser(userData);
    navigate('/'); // Redirect to home after login
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-cyan-500/30">
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <InfoSection />
          </>
        } />
        <Route path="/customize" element={<Configurator user={user} />} />
        <Route path="/gallery" element={
          <div className="pt-24 px-4 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">Community Showcase</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_GALLERY.map(item => (
                <div key={item.id} className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all">
                  <img src={item.image} alt={item.user} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-white">{item.user}</h3>
                      {item.approved && <CheckCircle className="w-4 h-4 text-green-400" />}
                    </div>
                    <p className="text-xs text-cyan-400 mb-2">{item.specs}</p>
                    <p className="text-sm text-slate-400">"{item.review}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        } />
        <Route path="/builders" element={
            <div className="pt-24 text-center">
                <h2 className="text-2xl text-white">Builder Portal</h2>
                <p className="text-slate-400">Coming Soon</p>
            </div>
        } />
        <Route path="/accessories" element={
            <div className="pt-24 text-center">
                <h2 className="text-2xl text-white">Accessories</h2>
                <p className="text-slate-400">Coming Soon</p>
            </div>
        } />
        <Route path="/login" element={<AuthPage onLogin={handleLogin} />} />
        <Route path="*" element={
            <div className="pt-32 text-center">
                <h2 className="text-2xl text-white">404</h2>
                <Link to="/" className="text-cyan-400">Go Home</Link>
            </div>
        } />
      </Routes>
    </div>
  );
};

export default App;