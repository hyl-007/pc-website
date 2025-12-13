import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Part } from './types';

// Mock data to support the UI functionality
const MOCK_PARTS: Part[] = [
  {
    id: 'gpu-1',
    name: 'Nebula RTX 4090',
    price: 1599,
    type: 'gpu',
    image: 'https://via.placeholder.com/300x100/000000/FFFFFF/?text=RTX+4090',
    specs: '24GB GDDR6X'
  },
  {
    id: 'gpu-2',
    name: 'Cosmos RX 7900 XTX',
    price: 999,
    type: 'gpu',
    image: 'https://via.placeholder.com/300x100/000000/FFFFFF/?text=RX+7900',
    specs: '24GB GDDR6'
  },
  {
    id: 'gpu-3',
    name: 'Starlight RTX 4070 Ti',
    price: 799,
    type: 'gpu',
    image: 'https://via.placeholder.com/300x100/000000/FFFFFF/?text=RTX+4070',
    specs: '12GB GDDR6X'
  }
];

export default function App() {
  const [selectedParts, setSelectedParts] = useState<{ gpu: Part | null }>({ gpu: null });

  const handleSelect = (part: Part) => {
    setSelectedParts(prev => ({
      ...prev,
      [part.type]: part
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8 font-sans">
        {/* Middle Section: GPU Area - Slide in from side */}
        <div className="relative h-24 w-full max-w-2xl border border-dashed border-white/10 rounded-lg flex items-center justify-center bg-black/20 perspective-[1000px] group z-30">
            <AnimatePresence mode="wait">
                {selectedParts.gpu ? (
                    <motion.div 
                        key={selectedParts.gpu.id}
                        initial={{x: -100, opacity: 0}} 
                        animate={{x: 0, opacity: 1}}
                        exit={{x: -50, opacity: 0}}
                        transition={{type: "spring", stiffness: 180, damping: 20}}
                        className="relative w-[95%] h-20 bg-slate-800 border border-green-500 rounded flex items-center shadow-[0_0_20px_rgba(34,197,94,0.3)] overflow-hidden z-10"
                    >
                        <img src={selectedParts.gpu.image} className="w-full h-full object-cover opacity-90" alt={selectedParts.gpu.name} />
                        <div className="absolute bottom-1 right-1 text-[9px] text-green-400 font-bold bg-black/60 px-2 rounded backdrop-blur-sm">GPU INSTALLED</div>
                        <motion.div 
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="absolute inset-0 bg-green-400 mix-blend-overlay"
                        />
                    </motion.div>
                ) : (
                    <motion.span 
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-slate-600 font-mono tracking-widest"
                    >
                        PCIE SLOT
                    </motion.span>
                )}
            </AnimatePresence>

            {/* Live GPU Quick-Select Dock */}
            <div className="absolute -bottom-5 right-2 flex gap-2 z-50 transition-all duration-300 opacity-60 hover:opacity-100 group-hover:opacity-100 scale-90 hover:scale-100 group-hover:scale-100 origin-bottom-right">
                    {MOCK_PARTS.filter(p => p.type === 'gpu').map((gpu) => (
                        <button
                            key={gpu.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelect(gpu);
                            }}
                            className={`relative w-12 h-12 rounded-lg border-2 overflow-hidden transition-all shadow-lg ${
                                selectedParts.gpu?.id === gpu.id 
                                    ? 'border-cyan-400 scale-105 shadow-cyan-500/50 ring-2 ring-cyan-500/20' 
                                    : 'border-white/20 hover:border-white/60 bg-slate-950/80 grayscale hover:grayscale-0'
                            }`}
                            title={gpu.name}
                        >
                            <img src={gpu.image} alt={gpu.name} className="w-full h-full object-cover" />
                            {selectedParts.gpu?.id === gpu.id && (
                                <div className="absolute inset-0 bg-cyan-400/10"></div>
                            )}
                        </button>
                    ))}
            </div>
        </div>
    </div>
  );
}