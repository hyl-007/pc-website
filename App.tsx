import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  WifiOff
} from 'lucide-react';
import { Part, User, GalleryItem, BuilderJob } from './types';

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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Customize', path: '/customize' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Accessories', path: '/accessories' },
    { name: 'Builders', path: '/builders' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-cyan-400" />
            <span className="text-2xl font-bold tracking-wider text-white">NEBULA<span className="text-cyan-400">FORGE</span></span>
          </Link>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === link.path ? 'text-cyan-400' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.name}
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
              <Link to="/login" className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 transition-all">
                Login / Join
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
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6 drop-shadow-2xl"
        >
          ARCHITECT YOUR REALITY
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl md:text-2xl text-slate-300 mb-10 font-light tracking-wide"
        >
          Singapore's Premium Custom PC Ecosystem. <br />
          Designed by you. Built by artisans. Delivered to your doorstep.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row justify-center gap-6"
        >
          <Link to="/customize" className="group relative px-8 py-4 bg-cyan-500 text-slate-950 font-bold rounded-none skew-x-[-10deg] hover:bg-cyan-400 transition-all">
            <span className="block skew-x-[10deg]">CUSTOMIZE RIG</span>
            <div className="absolute inset-0 border border-white/20 -m-1 group-hover:m-0 transition-all duration-300"></div>
          </Link>
          <Link to="/gallery" className="group relative px-8 py-4 bg-transparent border border-white/30 text-white font-bold rounded-none skew-x-[-10deg] hover:bg-white/10 transition-all">
            <span className="block skew-x-[10deg]">VIEW SHOWCASE</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

// 3. Why Choose Us / How It Works
const InfoSection = () => {
  const steps = [
    { title: 'Visualize', desc: 'Drag & drop premium components into your chassis.', icon: <Monitor className="w-10 h-10 text-cyan-400" /> },
    { title: 'Engineer', desc: 'Verified local builders assemble your rig with precision.', icon: <Wrench className="w-10 h-10 text-purple-500" /> },
    { title: 'Deploy', desc: 'Secure delivery to your doorstep within Singapore.', icon: <Box className="w-10 h-10 text-green-400" /> },
  ];

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4">
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
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl opacity-20 blur-xl"></div>
            <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2642&auto=format&fit=crop" alt="PC Interior" className="relative rounded-xl shadow-2xl border border-white/10" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-12">THE PROCESS</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-slate-900/50 p-8 rounded-xl border border-white/5 hover:border-cyan-500/50 transition-colors">
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
            {categories.map(cat => (
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
                className={`px-4 py-2 rounded-lg text-sm font-bold uppercase whitespace-nowrap transition-all ${
                  activeCategory === cat ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Parts List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {MOCK_PARTS.filter(p => p.type === activeCategory).map(part => {
              const selected = isPartSelected(part);
              return (
                <div 
                    key={part.id}
                    onClick={() => handleSelect(part)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center space-x-4 ${
                    selected
                        ? 'border-cyan-500 bg-cyan-500/10' 
                        : 'border-white/5 bg-slate-800/50 hover:border-white/20'
                    }`}
                >
                    <img src={part.image} alt={part.name} className="w-16 h-16 object-cover rounded bg-slate-700" />
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
        <div className="w-full lg:w-1/3 relative flex flex-col items-center justify-center bg-slate-900/40 rounded-xl border border-white/5 p-8 overflow-hidden min-h-[500px]">
          {/* Background Grid Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          
          <AnimatePresence mode="wait">
             {selectedParts.chassis ? (
               <motion.div 
                key={selectedParts.chassis.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-72 h-[32rem] border-4 border-slate-700 bg-slate-800/90 rounded-xl flex flex-col items-center shadow-2xl shadow-cyan-900/20 overflow-hidden"
               >
                  {/* --- Dynamic Lighting & AO Layer --- */}
                  <div className="absolute inset-0 pointer-events-none z-0">
                    {/* Base Ambience */}
                    <div className="absolute inset-0 bg-slate-900/80" />
                    
                    {/* Global Ambient Occlusion (Corners Vignette) */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
                    
                    {/* Motherboard Backlight (Blue) */}
                    <motion.div 
                        animate={{ opacity: selectedParts.motherboard ? 0.3 : 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 bg-blue-600 mix-blend-overlay blur-sm"
                    />

                    {/* CPU Core Glow (Cyan) - Pulses if PSU is present */}
                    <motion.div 
                        animate={{ 
                            opacity: selectedParts.cpu ? (isPowered ? 0.5 : 0.2) : 0,
                            scale: selectedParts.cpu && isPowered ? [1, 1.2, 1] : 1
                        }}
                        transition={{
                            opacity: { duration: 0.5 },
                            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-400 blur-[80px] rounded-full mix-blend-screen"
                    />

                    {/* GPU Underglow (Green) */}
                    <motion.div 
                        animate={{ opacity: selectedParts.gpu ? (isPowered ? 0.4 : 0.2) : 0 }}
                        className="absolute top-[45%] left-0 right-0 h-32 bg-green-500 blur-[60px] mix-blend-screen"
                    />

                    {/* RAM Accent (Red/Purple) */}
                    <motion.div 
                        animate={{ opacity: selectedParts.ram ? 0.3 : 0 }}
                        className="absolute top-[20%] right-[10%] w-24 h-48 bg-purple-500 blur-[50px] rotate-12 mix-blend-screen"
                    />
                  </div>

                  {/* Chassis Image Background (faint) */}
                  <img src={selectedParts.chassis.image} alt="chassis" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none blur-sm z-0" />
                  
                  <div className="absolute top-0 w-full h-full flex flex-col p-4 z-10 gap-2">
                    {/* Top Section: Motherboard Area */}
                    <div className="relative flex-[2] w-full border border-dashed border-white/10 rounded-lg flex items-center justify-center bg-black/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                        {/* Motherboard - Slotted in from back */}
                        {selectedParts.motherboard && (
                            <motion.img 
                                key={selectedParts.motherboard.id}
                                layoutId="mobo"
                                src={selectedParts.motherboard.image} 
                                className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] object-cover opacity-70 rounded-lg drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]"
                                initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }} 
                                animate={{ opacity: 0.7, scale: 1, filter: 'blur(0px)' }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                        )}

                        {/* CPU (Center of Mobo) - Drop from top */}
                        {selectedParts.cpu && (
                            <motion.div 
                                key={selectedParts.cpu.id}
                                initial={{ y: -120, opacity: 0, scale: 2 }} 
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20, mass: 1.2 }}
                                className="absolute top-[25%] left-1/2 -translate-x-1/2 w-16 h-16 bg-slate-900 border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5),0_10px_20px_rgba(0,0,0,0.8)] z-20 flex items-center justify-center rounded overflow-hidden"
                            >
                                <img src={selectedParts.cpu.image} className="w-full h-full object-cover opacity-80" />
                                {/* Ambient Occlusion inner shadow */}
                                <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] pointer-events-none"></div>
                                <div className="absolute bottom-0 w-full text-center text-[7px] text-cyan-400 bg-black/70 py-0.5">CPU</div>
                                <motion.div 
                                    initial={{ opacity: 1 }}
                                    animate={{ opacity: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="absolute inset-0 bg-cyan-400 mix-blend-overlay"
                                />
                            </motion.div>
                        )}

                        {/* RAM (Right of CPU) - Angled insertion */}
                        {selectedParts.ram && (
                            <motion.div 
                                key={selectedParts.ram.id}
                                initial={{ y: -80, opacity: 0, rotateX: 45 }} 
                                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.1 }}
                                className="absolute top-[25%] right-[15%] w-6 h-[40%] bg-red-500/10 border border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5),5px_5px_15px_rgba(0,0,0,0.8)] z-20 flex flex-col overflow-hidden rounded"
                            >
                                <img src={selectedParts.ram.image} className="w-full h-full object-cover opacity-80" />
                                <motion.div 
                                    initial={{ opacity: 1 }}
                                    animate={{ opacity: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="absolute inset-0 bg-red-500 mix-blend-overlay"
                                />
                            </motion.div>
                        )}
                    </div>

                    {/* Middle Section: GPU Area - Slide in from side */}
                    <div className="relative h-24 w-full border border-dashed border-white/10 rounded-lg flex items-center justify-center bg-black/20 perspective-[1000px] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                        {selectedParts.gpu ? (
                            <motion.div 
                                key={selectedParts.gpu.id}
                                initial={{ x: -250, opacity: 0, rotateY: -10 }} 
                                animate={{ x: 0, opacity: 1, rotateY: 0 }}
                                whileHover={{ 
                                  scale: 1.02, 
                                  boxShadow: "0 0 25px rgba(74, 222, 128, 0.6), 0 0 50px rgba(74, 222, 128, 0.2)",
                                  borderColor: "rgba(74, 222, 128, 1)"
                                }}
                                exit={{ x: -100, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 150, damping: 18, mass: 1.2 }}
                                className="relative w-[95%] h-20 bg-slate-800 border border-green-500 rounded flex items-center shadow-[0_0_20px_rgba(34,197,94,0.3),0_15px_30px_rgba(0,0,0,0.9)] overflow-hidden z-10 cursor-pointer"
                            >
                                <img src={selectedParts.gpu.image} className="w-full h-full object-cover opacity-90" />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 pointer-events-none"></div>
                                <div className="absolute bottom-1 right-1 text-[9px] text-green-400 font-bold bg-black/60 px-2 rounded backdrop-blur-sm">GPU INSTALLED</div>
                                <motion.div 
                                    initial={{ opacity: 1 }}
                                    animate={{ opacity: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="absolute inset-0 bg-green-400 mix-blend-overlay"
                                />
                            </motion.div>
                        ) : <span className="text-xs text-slate-600 font-mono tracking-widest">PCIE SLOT</span>}
                    </div>

                    {/* Bottom Section: PSU & Storage */}
                    <div className="flex h-20 gap-2 w-full">
                        {/* PSU - Slide from side */}
                        <div className="flex-[2] border border-dashed border-white/10 rounded-lg flex items-center justify-center bg-black/20 overflow-hidden relative group shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                            {selectedParts.psu ? (
                                <motion.div 
                                    key={selectedParts.psu.id}
                                    className="w-full h-full relative"
                                    initial={{ x: -150, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -100, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 140, damping: 20 }}
                                >
                                    <img 
                                        src={selectedParts.psu.image} 
                                        className="w-full h-full object-cover opacity-80"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent pointer-events-none"></div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-bold text-white">POWER</span>
                                    </div>
                                    <motion.div 
                                      initial={{ opacity: 0.5 }}
                                      animate={{ opacity: 0 }}
                                      transition={{ duration: 0.5 }}
                                      className="absolute inset-0 bg-white/20"
                                    />
                                </motion.div>
                            ) : <span className="text-xs text-slate-600">PSU BAY</span>}
                        </div>
                        {/* Storage - Staggered Slot In */}
                        <div className="flex-1 border border-dashed border-white/10 rounded-lg flex items-center justify-center bg-black/20 relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                             {selectedParts.storage.length > 0 ? (
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <AnimatePresence>
                                    {selectedParts.storage.map((disk, i) => (
                                        <motion.div
                                            key={disk.id}
                                            className="absolute w-[85%] h-[75%] bg-slate-900 rounded-md border border-cyan-500/30 shadow-[0_10px_20px_rgba(0,0,0,0.8)] overflow-hidden"
                                            initial={{ x: 200, opacity: 0 }}
                                            animate={{ 
                                                x: i * 8, 
                                                y: i * -6,
                                                opacity: 1, 
                                                scale: 1 
                                            }}
                                            exit={{ x: 200, opacity: 0 }}
                                            transition={{ 
                                                type: "spring", 
                                                stiffness: 180, 
                                                damping: 22, 
                                                delay: i * 0.1 
                                            }}
                                            style={{ zIndex: i }}
                                        >
                                            <img 
                                                src={disk.image} 
                                                className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity duration-300" 
                                            />
                                            {/* Tech Overlay Lines */}
                                            <div className="absolute inset-0 border-t border-white/10"></div>
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500/20"></div>
                                            
                                            {/* Active Status Light */}
                                            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse"></div>
                                            
                                            {/* Scanning Shine Effect */}
                                            <motion.div
                                                initial={{ x: '-150%' }}
                                                animate={{ x: '150%' }}
                                                transition={{ 
                                                    duration: 1.5, 
                                                    repeat: Infinity, 
                                                    repeatDelay: 3, 
                                                    ease: "easeInOut",
                                                    delay: i * 0.5 
                                                }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent skew-x-[-20deg]"
                                            />
                                        </motion.div>
                                    ))}
                                    </AnimatePresence>
                                </div>
                            ) : <span className="text-xs text-slate-600">DRIVE BAY</span>}
                        </div>
                    </div>
                  </div>
                  
                  {/* Glass Panel Reflection overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-xl border border-white/5 z-20"></div>
                  
                  {/* Final Frame Glint/Shadow vignette */}
                  <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] rounded-xl pointer-events-none z-30"></div>
               </motion.div>
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
            <button className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-bold text-white hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-900/40 uppercase tracking-widest">
              Checkout Build
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

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = () => {
    // Simulate login
    setUser({
      id: 'u1',
      name: 'Kai',
      email: 'kai@nebulaforge.sg',
      role: 'user',
      isFirstTime: true
    });
  };

  const handleLogout = () => {
    setUser(null);
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
        <Route path="/login" element={
          <div className="h-screen flex items-center justify-center px-4">
            <div className="bg-slate-900 p-8 rounded-xl border border-white/10 w-full max-w-md text-center">
              <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-400 mb-6">Access your saved builds and order history.</p>
              <button 
                onClick={handleLogin}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all"
              >
                Sign In (Demo)
              </button>
            </div>
          </div>
        } />
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