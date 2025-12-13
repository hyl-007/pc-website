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
  DollarSign
} from 'lucide-react';
import { Part, User, GalleryItem, BuilderJob } from './types';

// --- MOCK DATA ---

const MOCK_PARTS: Part[] = [
  // Chassis
  { id: 'c1', name: 'Nebula Core X1 (3D Printed)', price: 150, type: 'chassis', image: 'https://picsum.photos/id/1/400/400' },
  { id: 'c2', name: 'Void Walker S (Glass)', price: 200, type: 'chassis', image: 'https://picsum.photos/id/2/400/400' },
  // CPU
  { id: 'cpu1', name: 'Intel Core i9-14900K', price: 600, type: 'cpu', image: 'https://picsum.photos/id/3/200/200' },
  { id: 'cpu2', name: 'AMD Ryzen 9 7950X3D', price: 650, type: 'cpu', image: 'https://picsum.photos/id/4/200/200' },
  // GPU
  { id: 'gpu1', name: 'NVIDIA RTX 4090 OC', price: 1600, type: 'gpu', image: 'https://picsum.photos/id/5/300/200' },
  { id: 'gpu2', name: 'NVIDIA RTX 4080 Super', price: 1000, type: 'gpu', image: 'https://picsum.photos/id/6/300/200' },
  // RAM
  { id: 'ram1', name: 'Corsair Dom. Titanium 64GB', price: 300, type: 'ram', image: 'https://picsum.photos/id/7/200/200' },
  { id: 'ram2', name: 'G.Skill Trident Z5 32GB', price: 150, type: 'ram', image: 'https://picsum.photos/id/8/200/200' },
  // Storage
  { id: 'st1', name: 'Samsung 990 Pro 2TB', price: 180, type: 'storage', image: 'https://picsum.photos/id/9/200/200' },
  // PSU
  { id: 'psu1', name: 'Thor 1200W Platinum', price: 300, type: 'psu', image: 'https://picsum.photos/id/10/200/200' },
  // MB
  { id: 'mb1', name: 'ROG Maximus Z790', price: 500, type: 'motherboard', image: 'https://picsum.photos/id/11/300/300' },
];

const MOCK_GALLERY: GalleryItem[] = [
  { id: 'g1', user: 'CyberNinja99', image: 'https://picsum.photos/id/20/600/400', specs: 'RTX 4090, i9-14900K', review: 'Absolute beast of a machine. The 3D printed chassis airflow is insane.', approved: true },
  { id: 'g2', user: 'SGLooper', image: 'https://picsum.photos/id/21/600/400', specs: 'Ryzen 7, RTX 4070', review: 'Clean cable management by the builder. Delivered in 2 days.', approved: true },
];

const MOCK_JOBS: BuilderJob[] = [
  { id: 'j1', customerName: 'Alice Tan', specs: MOCK_PARTS.slice(0, 4), payout: 150, status: 'pending', location: 'Tampines' },
  { id: 'j2', customerName: 'Bob Lim', specs: MOCK_PARTS.slice(2, 6), payout: 220, status: 'pending', location: 'Jurong East' },
];

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
  const [selectedParts, setSelectedParts] = useState<{ [key: string]: Part | null }>({
    chassis: null,
    cpu: null,
    gpu: null,
    ram: null,
    storage: null,
    motherboard: null,
    psu: null,
  });

  const categories = ['chassis', 'cpu', 'motherboard', 'gpu', 'ram', 'storage', 'psu'];
  const [activeCategory, setActiveCategory] = useState('chassis');

  const totalPrice = Object.values(selectedParts).reduce((acc, part) => acc + (part?.price || 0), 0);
  const discount = (user?.isFirstTime && user.role === 'user') ? 0.15 : 0;
  const finalPrice = totalPrice * (1 - discount);

  const handleSelect = (part: Part) => {
    setSelectedParts(prev => ({ ...prev, [part.type]: part }));
  };

  return (
    <div className="pt-20 pb-12 min-h-screen bg-slate-950 flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 flex flex-col lg:flex-row gap-8">
        
        {/* Left Panel: Component Selection */}
        <div className="w-full lg:w-1/3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10 p-6 flex flex-col h-[80vh]">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Settings className="mr-2 text-cyan-400" /> COMPONENT SELECTION
          </h2>
          
          {/* Category Tabs */}
          <div className="flex overflow-x-auto space-x-2 pb-4 mb-4 scrollbar-thin">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
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
            {MOCK_PARTS.filter(p => p.type === activeCategory).map(part => (
              <div 
                key={part.id}
                onClick={() => handleSelect(part)}
                className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center space-x-4 ${
                  selectedParts[part.type]?.id === part.id 
                    ? 'border-cyan-500 bg-cyan-500/10' 
                    : 'border-white/5 bg-slate-800/50 hover:border-white/20'
                }`}
              >
                <img src={part.image} alt={part.name} className="w-16 h-16 object-cover rounded bg-slate-700" />
                <div className="flex-1">
                  <h4 className="text-white font-medium">{part.name}</h4>
                  <p className="text-cyan-400 font-bold">${part.price}</p>
                </div>
                {selectedParts[part.type]?.id === part.id && <CheckCircle className="text-cyan-500 w-5 h-5" />}
              </div>
            ))}
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
                className="relative w-64 h-96 border-4 border-slate-700 bg-slate-800/80 rounded-lg flex items-center justify-center shadow-2xl shadow-cyan-900/20"
               >
                  {/* Simulated Chassis */}
                  <div className="absolute top-0 w-full h-8 bg-slate-700/50"></div>
                  <div className="text-slate-500 font-bold text-4xl rotate-90 opacity-20">NEBULA</div>
                  
                  {/* Dynamic Parts Appearance */}
                  <div className="absolute inset-4 flex flex-col gap-2 justify-center">
                     {selectedParts.motherboard && <motion.div initial={{x: -50, opacity:0}} animate={{x:0, opacity:1}} className="w-full h-40 bg-slate-600/50 border border-slate-500 rounded flex items-center justify-center text-xs">MOBO</motion.div>}
                     {selectedParts.gpu && <motion.div initial={{x: 50, opacity:0}} animate={{x:0, opacity:1}} className="w-full h-12 bg-green-500/20 border border-green-500/50 rounded flex items-center justify-center text-xs text-green-300">GPU ACTIVE</motion.div>}
                  </div>
                  
                  {selectedParts.cpu && <motion.div initial={{scale: 2, opacity:0}} animate={{scale:1, opacity:1}} className="absolute top-1/3 w-8 h-8 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></motion.div>}
               </motion.div>
             ) : (
               <div className="text-center text-slate-500">
                 <Box className="w-24 h-24 mx-auto mb-4 opacity-20" />
                 <p>Select a Chassis to begin</p>
               </div>
             )}
          </AnimatePresence>

          {/* Stats Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-slate-400">
             <span>Power: {selectedParts.psu ? 'Optimal' : 'Checking...'}</span>
             <span>Compatibility: 100%</span>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="w-full lg:w-1/3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/10 p-6 flex flex-col justify-between h-[80vh]">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">BUILD SUMMARY</h2>
            <div className="space-y-3 mb-6">
              {Object.entries(selectedParts).map(([type, part]) => (
                part && (
                  <div key={type} className="flex justify-between text-sm border-b border-white/5 pb-2">
                    <span className="text-slate-400 uppercase">{type}</span>
                    <span className="text-slate-200">{part.name}</span>
                  </div>
                )
              ))}
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
    </div>
  );
};

// 5. Gallery
const Gallery: React.FC<{ user: User | null }> = ({ user }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingReview, setPendingReview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingReview(true);
    setTimeout(() => {
      setPendingReview(false);
      setModalOpen(false);
      console.log('Submission sent to hengyule22@gmail.com');
      alert("Submission received! Awaiting admin approval.");
    }, 1500);
  };

  return (
    <div className="pt-24 pb-12 min-h-screen max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-white">COMMUNITY BUILDS</h1>
        {user && <button onClick={() => setModalOpen(true)} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full flex items-center"><Camera className="mr-2 w-4 h-4" /> Post Build</button>}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_GALLERY.filter(g => g.approved).map(item => (
          <div key={item.id} className="bg-slate-900 rounded-xl overflow-hidden border border-white/10 group">
            <div className="relative overflow-hidden h-64">
              <img src={item.image} alt="Build" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-4">
                <span className="text-white font-bold flex items-center"><UserIcon className="w-3 h-3 mr-1" /> {item.user}</span>
              </div>
            </div>
            <div className="p-6">
               <p className="text-sm text-cyan-400 mb-2 font-mono">{item.specs}</p>
               <p className="text-slate-300 italic">"{item.review}"</p>
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 p-8 rounded-xl max-w-md w-full border border-white/10">
            <h2 className="text-2xl text-white font-bold mb-4">Showcase Your Rig</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Build Specs (CPU, GPU...)" className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded focus:border-cyan-500 outline-none" required />
              <textarea placeholder="Your Review" className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded h-32 focus:border-cyan-500 outline-none" required></textarea>
              <div className="border-2 border-dashed border-slate-700 p-8 text-center text-slate-500 rounded cursor-pointer hover:border-cyan-500 transition-colors">
                <Camera className="w-8 h-8 mx-auto mb-2" />
                <span>Upload Photos</span>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-cyan-600 text-white rounded font-bold hover:bg-cyan-500 disabled:opacity-50">
                   {pendingReview ? 'Sending...' : 'Submit for Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// 6. Accessories (Placeholder)
const Accessories = () => (
  <div className="pt-24 min-h-screen max-w-7xl mx-auto px-4 text-center">
    <h1 className="text-4xl font-bold text-white mb-8">PERIPHERALS & GEAR</h1>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-slate-900 border border-white/5 p-6 rounded-xl opacity-70 hover:opacity-100 transition-opacity">
           <div className="h-40 bg-slate-800 rounded mb-4 animate-pulse"></div>
           <h3 className="text-white font-bold">Nebula Mechanical Keycap Set</h3>
           <p className="text-cyan-500 mt-2">Coming Soon</p>
        </div>
      ))}
    </div>
  </div>
);

// 7. Builder Pages (Registration & Dashboard)
const BuilderSection: React.FC<{ user: User | null; onLogin: (u: User) => void }> = ({ user, onLogin }) => {
  const [isApplying, setIsApplying] = useState(false);
  
  // If user is a verified builder
  if (user?.role === 'builder') {
    return (
      <div className="pt-24 min-h-screen max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
           <h1 className="text-3xl font-bold text-white flex items-center"><Wrench className="mr-3 text-purple-500" /> BUILDER DASHBOARD</h1>
           <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded text-sm border border-green-500/30">Verified Partner</span>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
           <div className="bg-slate-900 p-6 rounded-xl border border-white/10">
             <div className="text-slate-400 text-sm">Active Jobs</div>
             <div className="text-3xl font-bold text-white">2</div>
           </div>
           <div className="bg-slate-900 p-6 rounded-xl border border-white/10">
             <div className="text-slate-400 text-sm">Total Earnings</div>
             <div className="text-3xl font-bold text-green-400">$1,450</div>
           </div>
           <div className="bg-slate-900 p-6 rounded-xl border border-white/10">
             <div className="text-slate-400 text-sm">Rating</div>
             <div className="text-3xl font-bold text-yellow-400">4.9/5</div>
           </div>
        </div>

        <h2 className="text-xl text-white font-bold mb-4">Available Orders</h2>
        <div className="bg-slate-900 rounded-xl border border-white/10 overflow-hidden">
           <table className="w-full text-left text-slate-300">
             <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
               <tr>
                 <th className="p-4">Customer</th>
                 <th className="p-4">Location</th>
                 <th className="p-4">Specs</th>
                 <th className="p-4">Payout</th>
                 <th className="p-4">Action</th>
               </tr>
             </thead>
             <tbody>
               {MOCK_JOBS.map(job => (
                 <tr key={job.id} className="border-t border-white/5 hover:bg-slate-800/50">
                   <td className="p-4">{job.customerName}</td>
                   <td className="p-4">{job.location}</td>
                   <td className="p-4 text-xs max-w-xs truncate">{job.specs.map(p => p.name).join(', ')}</td>
                   <td className="p-4 text-green-400 font-bold">${job.payout}</td>
                   <td className="p-4">
                     <button className="px-3 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-500 text-sm">Accept</button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
        
        <div className="mt-8 p-6 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
           <h3 className="text-white font-bold mb-2">Component Store</h3>
           <p className="text-slate-400 text-sm">Source parts directly from our warehouse at wholesale prices.</p>
           <button className="mt-4 text-cyan-400 hover:text-white text-sm font-bold">Access Inventory &rarr;</button>
        </div>
      </div>
    );
  }

  const handleApplication = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Application submitted to hengyule22@gmail.com for review!");
    setIsApplying(false);
  };

  // Logic to simulate builder login for demo purposes
  const simulateBuilderLogin = () => {
    onLogin({
      id: 'b1',
      name: 'Demo Builder',
      email: 'builder@nebula.sg',
      role: 'builder',
      isFirstTime: false,
      builderApproved: true
    });
  }

  // Landing for prospective builders
  return (
    <div className="pt-20 min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-slate-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="grid md:grid-cols-2">
           <div className="p-12 flex flex-col justify-center">
              <h1 className="text-4xl font-bold text-white mb-6">JOIN THE FORGE</h1>
              <p className="text-slate-400 mb-8">
                Are you an expert PC builder in Singapore? Monetize your skill. Work from home. Build high-end systems.
              </p>
              <ul className="space-y-4 mb-8 text-slate-300">
                <li className="flex items-center"><ShieldCheck className="text-cyan-500 mr-2" /> Verified Partners Only</li>
                <li className="flex items-center"><DollarSign className="text-cyan-500 mr-2" /> Competitive Payouts</li>
                <li className="flex items-center"><Box className="text-cyan-500 mr-2" /> Wholesale Part Access</li>
              </ul>
              <button 
                onClick={() => setIsApplying(!isApplying)}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded transition-colors"
              >
                {isApplying ? 'Cancel Application' : 'Apply Now'}
              </button>
              
              <button onClick={simulateBuilderLogin} className="mt-4 text-xs text-slate-600 hover:text-slate-400 text-center">
                (Demo: Simulate Verified Builder Login)
              </button>
           </div>
           <div className="hidden md:block bg-[url('https://images.unsplash.com/photo-1555618254-76a0d46e398d?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center">
              <div className="h-full w-full bg-purple-900/40 backdrop-blur-[2px]"></div>
           </div>
        </div>
      </div>

      {isApplying && (
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-2xl w-full bg-slate-800 mt-8 p-8 rounded-xl border border-white/10">
          <h3 className="text-white text-xl font-bold mb-4">Builder Application</h3>
          <form onSubmit={handleApplication} className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <input type="text" placeholder="Full Name" required className="bg-slate-900 border border-slate-700 p-3 rounded text-white" />
               <input type="email" placeholder="Email" required className="bg-slate-900 border border-slate-700 p-3 rounded text-white" />
             </div>
             <textarea placeholder="Experience Summary (Years, specialized builds...)" required className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-white h-24"></textarea>
             <div className="border-2 border-dashed border-slate-700 p-6 text-center text-slate-500 rounded">
               <p>Upload Portfolio Images (Previous Builds)</p>
             </div>
             <button type="submit" className="w-full py-3 bg-cyan-600 text-white font-bold rounded">Submit for Review</button>
             <p className="text-xs text-center text-slate-500">Applications sent to admin for manual verification.</p>
          </form>
        </motion.div>
      )}
    </div>
  );
};

// 8. Auth / Login (Simple)
const AuthPage: React.FC<{ onLogin: (u: User) => void }> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    const mockUser: User = {
      id: 'u_' + Math.random(),
      name: formData.name || 'New User',
      email: formData.email,
      role: 'user',
      isFirstTime: isRegister // If registering, they are first time
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-white/10 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
        <p className="text-slate-400 text-center mb-8">{isRegister ? 'Join Nebula Forge & Get 15% Off' : 'Access your saved builds'}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input 
              type="text" 
              placeholder="Full Name" 
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded text-white focus:border-cyan-500 outline-none" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded text-white focus:border-cyan-500 outline-none" 
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded text-white focus:border-cyan-500 outline-none" 
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            required
          />
          
          <button className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
            {isRegister ? 'Register & Claim Discount' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <button onClick={() => setIsRegister(!isRegister)} className="text-slate-400 hover:text-white underline">
            {isRegister ? 'Already have an account? Login' : 'New here? Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const handleLogin = (u: User) => {
    setUser(u);
    navigate(u.role === 'builder' ? '/builders' : '/customize');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500 selection:text-white">
      <Navbar user={user} onLogout={handleLogout} />
      
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <InfoSection />
          </>
        } />
        <Route path="/customize" element={<Configurator user={user} />} />
        <Route path="/gallery" element={<Gallery user={user} />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/builders" element={<BuilderSection user={user} onLogin={handleLogin} />} />
        <Route path="/login" element={<AuthPage onLogin={handleLogin} />} />
      </Routes>

      <footer className="py-8 bg-slate-950 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>&copy; 2024 Nebula Forge Singapore. All rights reserved.</p>
        <p className="mt-2">Designed for the Future.</p>
      </footer>
    </div>
  );
}