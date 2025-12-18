
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Cpu, Monitor, HardDrive, Zap, Box, Settings, Menu, X, 
  Wrench, CheckCircle, DollarSign, AlertTriangle, Loader2,
  Truck, LayoutDashboard, Store, Users, ShoppingBag, ArrowRight,
  Camera, FileText, Globe, Mail, MapPin, Award, MousePointer2, Keyboard as KeyboardIcon,
  Filter, Tag, Plus
} from 'lucide-react';
import { Part, User, GalleryItem, PCBuild, SupplierOrder } from './types';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const API_URL = 'http://localhost:5000/api';

// --- MOCK DATA ---
const MOCK_PARTS: Part[] = [
  // Core components
  { id: 'cpu1', name: 'Intel i9-14900K', price: 600, type: 'cpu', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=200', supplierId: 'sup1', stock: 15 },
  { id: 'cpu2', name: 'Ryzen 9 7950X', price: 550, type: 'cpu', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=200', supplierId: 'sup1', stock: 12 },
  { id: 'gpu1', name: 'RTX 4090 OC', price: 1600, type: 'gpu', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=300', supplierId: 'sup2', stock: 5 },
  { id: 'gpu2', name: 'RTX 4080 Super', price: 1000, type: 'gpu', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=300', supplierId: 'sup2', stock: 8 },
  { id: 'mb1', name: 'ROG Maximus Z790', price: 500, type: 'motherboard', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300', supplierId: 'sup1', stock: 10 },
  { id: 'c1', name: 'Nebula X1 Chassis', price: 150, type: 'chassis', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400', supplierId: 'sup3', stock: 20 },
  { id: 'ram1', name: '32GB DDR5 6000MHz', price: 180, type: 'ram', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=200', supplierId: 'sup1', stock: 25 },
  { id: 'psu1', name: '1000W 80+ Gold Modular', price: 200, type: 'psu', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=200', supplierId: 'sup3', stock: 15 },
  { id: 'st1', name: '2TB NVMe Gen4 SSD', price: 150, type: 'storage', image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=200', supplierId: 'sup1', stock: 30 },
  
  // Accessories & Peripherals
  { id: 'mon1', name: '34" Ultrawide 165Hz', price: 850, type: 'monitor', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=400', supplierId: 'sup2', stock: 5 },
  { id: 'mon2', name: '27" 4K Pro Art', price: 600, type: 'monitor', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=400', supplierId: 'sup2', stock: 7 },
  { id: 'kb1', name: 'Mechanical RGB Keyboard', price: 120, type: 'keyboard', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=400', supplierId: 'sup3', stock: 40 },
  { id: 'kb2', name: 'Nebula Wireless TKL', price: 160, type: 'keyboard', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=400', supplierId: 'sup3', stock: 15 },
  { id: 'ms1', name: 'Wireless Pro Mouse', price: 90, type: 'mouse', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=400', supplierId: 'sup3', stock: 50 },
  { id: 'ms2', name: 'Forge Ergonomic Mouse', price: 75, type: 'mouse', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=400', supplierId: 'sup3', stock: 30 },
  { id: 'acc1', name: 'Nebula Forge Desk Mat', price: 45, type: 'accessory', image: 'https://images.unsplash.com/photo-1616422285623-13ff0167c958?q=80&w=400', supplierId: 'sup3', stock: 100 },
  { id: 'acc2', name: 'ARGB LED Strip Kit', price: 35, type: 'accessory', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400', supplierId: 'sup3', stock: 200 },
];

const MOCK_BUILDERS: User[] = [
  { id: 'b1', name: 'Artisan PC Sg', role: 'builder', email: 'artisan@forge.sg', isFirstTime: false, rating: 4.9, bio: 'Expert in hard-line water cooling.' },
  { id: 'b2', name: 'NanoBuilds', role: 'builder', email: 'nano@forge.sg', isFirstTime: false, rating: 4.7, bio: 'Specialist in SFF (Small Form Factor) builds.' },
];

const MOCK_GALLERY: GalleryItem[] = [
  { id: 'g1', builderId: 'b1', builderName: 'Artisan PC Sg', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=600', specs: 'RTX 4090, i9-14900K', review: 'Flawless execution on the cable management.' },
  { id: 'g2', builderId: 'b2', builderName: 'NanoBuilds', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=600', specs: 'Ryzen 7, RTX 4080', review: 'Tiny footprint, massive performance.' },
];

// --- COMPONENTS ---

const Navbar: React.FC<{ user: User | null; onLogout: () => void }> = ({ user, onLogout }) => {
  const location = useLocation();

  const getNavLinks = () => {
    if (!user) return [
      { name: 'Home', path: '/' }, 
      { name: 'Customise', path: '/customize' },
      { name: 'Accessories', path: '/accessories' },
      { name: 'Showcase', path: '/gallery' },
      { name: 'Become a Builder', path: '/apply-builder' }
    ];
    if (user.role === 'buyer') return [
      { name: 'Home', path: '/' },
      { name: 'Customise', path: '/customize' },
      { name: 'Accessories', path: '/accessories' },
      { name: 'Find Builders', path: '/builders' },
      { name: 'My Orders', path: '/dashboard' }
    ];
    if (user.role === 'builder') return [
      { name: 'Job Board', path: '/jobs' },
      { name: 'My Builds', path: '/dashboard' },
      { name: 'Source Parts', path: '/supplier-hub' }
    ];
    if (user.role === 'supplier') return [
      { name: 'Inventory', path: '/inventory' },
      { name: 'Orders', path: '/orders' }
    ];
    return [];
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Zap className="h-8 w-8 text-cyan-400" />
          <span className="text-xl font-bold tracking-wider text-white">NEBULA<span className="text-cyan-400">FORGE</span></span>
        </Link>
        
        <div className="hidden md:flex space-x-6">
          {getNavLinks().map((link) => (
            <Link key={link.name} to={link.path} className={`text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}>
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-xs px-2 py-1 bg-slate-800 rounded text-cyan-400 uppercase font-bold">{user.role}</span>
              <button onClick={onLogout} className="text-sm text-red-400 font-bold hover:text-red-300">LOGOUT</button>
            </div>
          ) : (
            <Link to="/login" className="px-4 py-2 rounded-full border border-cyan-500/50 text-cyan-400 text-sm font-bold uppercase tracking-wider hover:bg-cyan-500/10 transition-all">Join Platform</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

// --- LANDING PAGE COMPONENTS ---

const Hero = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const btnRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(titleRef.current, { y: 100, opacity: 0, duration: 1, ease: "power4.out", skewY: 5 })
      .from(textRef.current, { y: 30, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.5")
      .from(btnRef.current, { scale: 0.8, opacity: 0, duration: 0.5, ease: "back.out(1.7)" }, "-=0.3");
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1 ref={titleRef} className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6 drop-shadow-2xl">
          ARCHITECT YOUR REALITY
        </h1>
        <p ref={textRef} className="text-xl md:text-2xl text-slate-300 mb-10 font-light tracking-wide max-w-2xl mx-auto">
          Singapore's First 4-Party PC Ecosystem. <br />
          Where Buyers, Builders, and Suppliers unite.
        </p>
        <div ref={btnRef} className="flex flex-col sm:flex-row justify-center gap-6">
          <Link to="/customize" className="px-8 py-4 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition-all uppercase tracking-widest shadow-lg shadow-cyan-900/40">
            Customize Rig
          </Link>
          <Link to="/gallery" className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-lg hover:bg-white/5 transition-all uppercase tracking-widest">
            View Showcase
          </Link>
        </div>
      </div>
    </div>
  );
};

const InfoSection = () => {
  const sectionRef = useRef(null);
  
  useGSAP(() => {
    gsap.from('.info-card', {
      y: 50, opacity: 0, duration: 0.8, stagger: 0.2,
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      ease: "power2.out"
    });
  }, { scope: sectionRef });

  const steps = [
    { title: 'Visualize', desc: 'Drag & drop components in our immersive visualizer.', icon: <Monitor className="w-10 h-10 text-cyan-400" /> },
    { title: 'Engineer', desc: 'Verified artisans compete to build your configuration.', icon: <Wrench className="w-10 h-10 text-purple-500" /> },
    { title: 'Deploy', desc: 'Safe delivery to your doorstep within 3-5 days.', icon: <Truck className="w-10 h-10 text-green-400" /> },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6 uppercase tracking-tight">The Artisan Edge</h2>
            <p className="text-slate-400 mb-4 text-lg">
              We've cut out the retail middleman. By connecting you directly with industrial <span className="text-cyan-400">suppliers</span> and artisan <span className="text-purple-400">builders</span>, we offer better components at lower prices.
            </p>
            <ul className="space-y-4 text-slate-300">
              <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-cyan-500" /> Escrow-protected payments</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-cyan-500" /> Verified builder portfolio tracking</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-cyan-500" /> Real-time supplier inventory sync</li>
            </ul>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-700"></div>
            <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2642&auto=format&fit=crop" alt="PC Interior" className="relative rounded-xl shadow-2xl border border-white/10" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-12 uppercase">The Process</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="info-card bg-slate-900/50 p-8 rounded-xl border border-white/5 hover:border-cyan-500/50 transition-colors">
              <div className="mb-6">{step.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2 uppercase">{step.title}</h3>
              <p className="text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- MARKETPLACE PORTALS ---

const BuilderMarketplace = () => (
  <div className="pt-24 pb-12 max-w-7xl mx-auto px-4">
    <h1 className="text-4xl font-bold text-white mb-8">CHOOSE YOUR ARTISAN</h1>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {MOCK_BUILDERS.map(builder => (
        <div key={builder.id} className="bg-slate-900/50 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-cyan-400">
              <Wrench size={32} />
            </div>
            <div className="text-right">
              <div className="text-cyan-400 font-bold text-xl">★ {builder.rating}</div>
              <div className="text-xs text-slate-500">Singapore Based</div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 uppercase">{builder.name}</h3>
          <p className="text-slate-400 text-sm mb-6 line-clamp-3">{builder.bio}</p>
          <button className="w-full py-3 bg-slate-800 hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
            View Portfolio <ArrowRight size={14} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

const BuilderDashboard = () => (
  <div className="pt-24 pb-12 max-w-7xl mx-auto px-4">
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Active Build Jobs</h2>
        {[1, 2].map(i => (
          <div key={i} className="bg-slate-900 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-cyan-500/10 rounded-lg text-cyan-400">
                <Box size={32} />
              </div>
              <div>
                <h4 className="text-white font-bold uppercase">Build Request #WF-1092</h4>
                <p className="text-slate-500 text-sm">Customer: Michael K. • Budget: $4,500</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <button className="px-6 py-2 bg-cyan-600 rounded text-xs font-bold uppercase tracking-widest">Accept Job</button>
              <button className="px-6 py-2 bg-slate-800 rounded text-xs font-bold uppercase tracking-widest">View Specs</button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-slate-900 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">Supplier Status</h2>
        <div className="space-y-4">
           <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
              <span className="text-slate-400">RTX 4090 OC</span>
              <span className="text-green-400 font-bold uppercase text-[10px]">In Stock</span>
           </div>
           <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
              <span className="text-slate-400">i9-14900K</span>
              <span className="text-yellow-400 font-bold uppercase text-[10px]">Low Stock</span>
           </div>
        </div>
        <Link to="/inventory" className="mt-6 block text-center py-3 border border-dashed border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/5 uppercase text-xs font-bold tracking-widest transition-all">
          Manage Inventory
        </Link>
      </div>
    </div>
  </div>
);

const SupplierPortal = () => (
  <div className="pt-24 pb-12 max-w-7xl mx-auto px-4">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-white uppercase tracking-widest">Vendor Inventory</h1>
      <button className="px-6 py-2 bg-cyan-600 rounded-lg text-xs font-bold uppercase tracking-widest">+ Add SKU</button>
    </div>
    <div className="bg-slate-900 rounded-xl border border-white/10 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-800 text-slate-400 text-[10px] uppercase tracking-widest font-black">
          <tr>
            <th className="p-4">Component</th>
            <th className="p-4">Price</th>
            <th className="p-4">Stock</th>
            <th className="p-4">Demand</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody className="text-slate-300">
          {MOCK_PARTS.map(part => (
            <tr key={part.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
              <td className="p-4 flex items-center gap-3">
                <img src={part.image} className="w-10 h-10 rounded bg-slate-800 object-cover border border-white/5" />
                <span className="text-sm font-medium">{part.name}</span>
              </td>
              <td className="p-4 text-sm font-mono tracking-tighter">${part.price}</td>
              <td className="p-4 text-sm">{part.stock} units</td>
              <td className="p-4">
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest">High</span>
              </td>
              <td className="p-4">
                <button className="text-cyan-400 hover:text-cyan-300 text-xs font-bold uppercase tracking-widest transition-all">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- ACCESSORIES PAGE ---

const AccessoriesPage = () => {
  const accessories = MOCK_PARTS.filter(p => ['monitor', 'keyboard', 'mouse', 'accessory'].includes(p.type));
  const [filter, setFilter] = useState('all');

  const filteredItems = filter === 'all' ? accessories : accessories.filter(a => a.type === filter);

  return (
    <div className="pt-24 pb-12 min-h-screen bg-slate-950 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 uppercase tracking-[0.2em]">Artisan Peripherals</h1>
          <p className="text-slate-500 max-w-2xl text-lg font-light tracking-wide">Complete your sanctuary with our curated selection of high-fidelity monitors and custom-engineered input devices.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 space-y-8">
            <div>
              <h3 className="text-xs uppercase font-black text-slate-500 tracking-widest mb-4 flex items-center gap-2">
                <Filter size={14} /> Categories
              </h3>
              <div className="space-y-2">
                {['all', 'monitor', 'keyboard', 'mouse', 'accessory'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`w-full text-left px-4 py-2 rounded text-xs uppercase font-bold tracking-widest transition-all ${filter === cat ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Catalog Grid */}
          <main className="flex-1">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden group hover:border-cyan-500/50 transition-all shadow-xl">
                  <div className="h-56 overflow-hidden relative">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-slate-950/80 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-cyan-400 border border-white/10">
                        {item.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight leading-tight">{item.name}</h3>
                      <div className="text-xl font-mono text-cyan-400 tracking-tighter">${item.price}</div>
                    </div>
                    <p className="text-slate-500 text-xs mb-6 uppercase tracking-widest">Supplier: {item.supplierId}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded text-xs uppercase tracking-widest transition-all">
                        Details
                      </button>
                      <button className="w-12 h-12 flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 text-white rounded transition-all shadow-lg shadow-cyan-900/20">
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredItems.length === 0 && (
              <div className="text-center py-20 text-slate-600 italic">No products found for this criteria.</div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// --- MAIN CONFIGURATOR ---

const Configurator: React.FC<{ user: User | null }> = ({ user }) => {
  const [selectedParts, setSelectedParts] = useState<Record<string, Part | null>>({
    chassis: null, cpu: null, gpu: null, ram: null, motherboard: null, psu: null, storage: null
  });
  const [activeCategory, setActiveCategory] = useState('chassis');
  const navigate = useNavigate();

  const handleSelect = (part: Part) => {
    setSelectedParts(prev => ({ ...prev, [part.type]: part }));
  };

  const calculateTotal = () => {
    return (Object.values(selectedParts) as (Part | null)[]).reduce((acc: number, part: Part | null) => acc + (part?.price || 0), 0);
  };

  const submitBuild = () => {
    if (!user) { navigate('/login'); return; }
    navigate('/builders');
  };

  const categories = [
    { id: 'chassis', label: 'Chassis', icon: <Box size={14} /> },
    { id: 'cpu', label: 'CPU', icon: <Cpu size={14} /> },
    { id: 'motherboard', label: 'Motherboard', icon: <Settings size={14} /> },
    { id: 'gpu', label: 'GPU', icon: <Zap size={14} /> },
    { id: 'ram', label: 'RAM', icon: <HardDrive size={14} /> },
    { id: 'storage', label: 'Storage', icon: <HardDrive size={14} /> },
    { id: 'psu', label: 'Power', icon: <Zap size={14} /> },
  ];

  return (
    <div className="pt-24 pb-12 min-h-screen bg-slate-950 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Component Selection */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-white/10 p-6 rounded-xl h-[80vh] flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-widest">
            <Settings className="text-cyan-400" /> CORE SYSTEM
          </h2>
          
          <div className="flex overflow-x-auto gap-2 mb-6 pb-2 custom-scrollbar scrollbar-hide whitespace-nowrap">
            {categories.map(cat => (
              <button 
                key={cat.id} 
                onClick={() => setActiveCategory(cat.id)} 
                className={`px-4 py-2 rounded text-[10px] uppercase font-black transition-all flex items-center gap-2 shrink-0 tracking-widest ${activeCategory === cat.id ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
             {MOCK_PARTS.filter(p => p.type === activeCategory).map(part => (
                <div 
                  key={part.id} 
                  onClick={() => handleSelect(part)} 
                  className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center gap-4 group ${selectedParts[activeCategory]?.id === part.id ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.1)]' : 'border-white/5 bg-slate-800/50 hover:border-white/20'}`}
                >
                  <div className="relative overflow-hidden rounded bg-slate-900 w-16 h-16 shrink-0 border border-white/5">
                    <img src={part.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={part.name} />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold text-sm mb-1 uppercase tracking-tight">{part.name}</div>
                    <div className="text-cyan-400 text-xs font-mono tracking-wider">${part.price.toLocaleString()}</div>
                  </div>
                </div>
             ))}
             {MOCK_PARTS.filter(p => p.type === activeCategory).length === 0 && (
               <div className="text-center py-10 text-slate-500 text-[10px] uppercase tracking-widest italic">
                 Awaiting inventory update...
               </div>
             )}
          </div>
        </div>

        {/* Center Panel: Visualizer */}
        <div className="lg:col-span-4 flex items-center justify-center bg-slate-900/20 border border-white/5 rounded-xl border-dashed relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-50"></div>
           <div className="text-center relative z-10">
              <div className="w-72 h-[450px] border-4 border-slate-800 rounded-3xl relative overflow-hidden bg-slate-900/50 shadow-2xl backdrop-blur-sm transition-all group-hover:border-cyan-500/30">
                 <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent"></div>
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-8 space-y-4">
                    {selectedParts.chassis ? (
                        <div className="animate-pulse flex flex-col items-center">
                           <Box className="w-40 h-40 text-cyan-400 opacity-20" />
                           <div className="mt-8 flex flex-col items-center gap-2">
                              <span className="text-[10px] text-cyan-400/80 font-black tracking-[0.4em] uppercase">Architecture Loaded</span>
                              <div className="flex gap-1">
                                {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: `${i*0.2}s`}}></div>)}
                              </div>
                           </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 opacity-20">
                          <Box className="w-32 h-32 text-slate-600" />
                          <span className="text-slate-600 text-[10px] uppercase tracking-[0.4em] font-black">Architecture Offline</span>
                        </div>
                    )}
                 </div>
              </div>
              <p className="mt-6 text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Holographic Engine v2.0</p>
           </div>
        </div>

        {/* Right Sidebar: Summary */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-white/10 p-6 rounded-xl flex flex-col justify-between h-[80vh]">
          <div className="flex-1 flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6 flex justify-between items-center uppercase tracking-widest">
              SUMMARY
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Estimate Only</span>
            </h2>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {(Object.entries(selectedParts) as [string, Part | null][]).map(([key, part]) => part && (
                <div key={key} className="flex justify-between items-center group border-b border-white/[0.03] pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-800 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-cyan-400 transition-colors">
                      {categories.find(c => c.id === key)?.icon || <Tag size={12} />}
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-0.5">{key}</div>
                      <div className="text-xs text-white truncate w-32 font-medium">{part.name}</div>
                    </div>
                  </div>
                  <div className="text-cyan-400 text-xs font-mono tracking-tighter">${part.price.toLocaleString()}</div>
                </div>
              ))}
              {!Object.values(selectedParts).some(v => v) && (
                <div className="text-center py-20 text-slate-700">
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-10" />
                  <p className="text-[10px] uppercase tracking-[0.3em] font-black">Engineering Bay Empty</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
              <div className="flex justify-between text-xs uppercase tracking-widest">
                <span className="text-slate-500 font-bold">BOM Total</span>
                <span className="text-white font-mono">${calculateTotal().toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-xs uppercase tracking-widest">
                <span className="text-slate-500 font-bold">Escrow Fee (2%)</span>
                <span className="text-white font-mono">${(calculateTotal() * 0.02).toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-xl font-black mt-4 pt-4 border-t border-white/10">
                <span className="text-white uppercase tracking-tighter">TOTAL</span>
                <span className="text-cyan-400 font-mono tracking-tighter">${(calculateTotal() * 1.02).toLocaleString()}.00</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button 
              onClick={submitBuild} 
              disabled={!selectedParts.chassis || !selectedParts.cpu}
              className="w-full py-4 bg-cyan-600 rounded text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-cyan-500 shadow-xl shadow-cyan-900/30 disabled:opacity-30 disabled:pointer-events-none"
            >
              Initialize Escrow
            </button>
            <div className="flex items-center justify-center gap-1.5">
              {[1,2,3].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-cyan-500' : 'bg-slate-800'}`}></div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- BUILDER APPLICATION ---

const BuilderApplication = () => {
  const [formData, setFormData] = useState({ businessName: '', email: '', location: '', experience: '', specialty: '', portfolioLinks: '', instagram: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${API_URL}/builder-apply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      setSubmitted(true);
    } catch (err) { setError('Submission failed.'); }
    finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <div className="pt-32 text-center px-4">
        <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-500/20">
          <CheckCircle size={40} className="text-cyan-400" />
        </div>
        <h2 className="text-3xl font-bold text-white uppercase tracking-[0.2em] mb-4">Transmission Sent</h2>
        <p className="text-slate-500 mt-4 max-w-md mx-auto text-lg">Our vetting team will analyze your portfolio data. Expect a response via encrypted channel within 72 hours.</p>
        <Link to="/" className="mt-12 inline-block px-8 py-4 border border-cyan-500/50 text-cyan-400 font-black uppercase tracking-[0.2em] hover:bg-cyan-500/10 transition-all rounded">Back to Command Center</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 max-w-2xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-white text-center mb-8 uppercase tracking-[0.2em]">Recruitment Portal</h1>
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-white/10 p-10 rounded-2xl space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600"></div>
        
        <div className="space-y-2">
          <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-black">Division / Builder Name</label>
          <input required name="businessName" placeholder="e.g. TITAN SYSTEMS" onChange={(e) => setFormData({...formData, businessName: e.target.value})} className="w-full bg-slate-950 border border-white/10 p-4 rounded text-white outline-none focus:border-cyan-500 transition-all font-medium" />
        </div>
        <div className="space-y-2">
          <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-black">Communication Email</label>
          <input required type="email" name="email" placeholder="nexus@nebula.sg" onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-white/10 p-4 rounded text-white outline-none focus:border-cyan-500 transition-all font-medium" />
        </div>
        <div className="space-y-2">
          <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-black">Engineering Portfolio</label>
          <textarea required name="portfolioLinks" placeholder="Drive links, Imgur, or Website URLs..." onChange={(e) => setFormData({...formData, portfolioLinks: e.target.value})} className="w-full bg-slate-950 border border-white/10 p-4 rounded text-white outline-none focus:border-cyan-500 h-32 text-white resize-none transition-all font-medium" />
        </div>
        <button type="submit" disabled={loading} className="w-full py-5 bg-cyan-600 rounded text-xs font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-cyan-500 disabled:opacity-50 shadow-lg shadow-cyan-900/30">
          {loading ? 'Transmitting Data...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

const AuthPage: React.FC<{ onLogin: (u: User) => void }> = ({ onLogin }) => {
  const [role, setRole] = useState<'buyer' | 'builder' | 'supplier'>('buyer');
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full bg-slate-900 p-10 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600"></div>
        <h2 className="text-2xl font-black text-white text-center mb-8 uppercase tracking-[0.2em]">Authentication Required</h2>
        <div className="flex gap-2 mb-10">
          {['buyer', 'builder', 'supplier'].map(r => (
            <button key={r} onClick={() => setRole(r as any)} className={`flex-1 py-3 rounded text-[10px] uppercase font-black transition-all tracking-widest ${role === r ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40' : 'bg-slate-800 text-slate-600 hover:text-slate-400'}`}>
              {r}
            </button>
          ))}
        </div>
        <button onClick={() => onLogin({ id: 'demo', name: 'Demo ' + role, email: 'demo@forge.sg', role, isFirstTime: true })} className="w-full py-5 bg-cyan-600 rounded text-xs font-black text-white uppercase tracking-[0.3em] hover:bg-cyan-500 transition-all shadow-xl shadow-cyan-900/20">
          Initialize Demo {role}
        </button>
        {role === 'builder' && <Link to="/apply-builder" className="block mt-8 text-center text-cyan-400 text-[10px] font-black uppercase hover:underline tracking-widest transition-all">Request Recruitment Access</Link>}
      </div>
    </div>
  );
};

// --- APP CORE ---

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-cyan-500/30">
      <Navbar user={user} onLogout={() => { setUser(null); navigate('/'); }} />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <InfoSection />
          </>
        } />
        <Route path="/customize" element={<Configurator user={user} />} />
        <Route path="/accessories" element={<AccessoriesPage />} />
        <Route path="/builders" element={<BuilderMarketplace />} />
        <Route path="/jobs" element={<BuilderDashboard />} />
        <Route path="/inventory" element={<SupplierPortal />} />
        <Route path="/apply-builder" element={<BuilderApplication />} />
        <Route path="/gallery" element={
          <div className="pt-24 px-4 max-w-7xl mx-auto pb-20">
            <h2 className="text-4xl font-black text-white mb-12 uppercase tracking-[0.2em]">Artisan Archives</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MOCK_GALLERY.map(item => (
                <div key={item.id} className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all group shadow-2xl">
                  <div className="h-64 overflow-hidden relative">
                    <img src={item.image} alt={item.builderName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-black text-white uppercase tracking-wider text-xl">{item.builderName}</h3>
                      <Award size={20} className="text-cyan-400" />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <Tag size={12} className="text-cyan-600" />
                      <p className="text-[10px] text-cyan-400 uppercase font-black tracking-widest">{item.specs}</p>
                    </div>
                    <p className="text-slate-400 italic text-sm leading-relaxed">"{item.review}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        } />
        <Route path="/login" element={<AuthPage onLogin={(u) => { setUser(u); navigate(u.role === 'buyer' ? '/customize' : u.role === 'builder' ? '/jobs' : '/inventory'); }} />} />
      </Routes>
    </div>
  );
};

export default App;
