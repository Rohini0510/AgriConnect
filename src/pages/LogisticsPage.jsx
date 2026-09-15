import React, { useState } from 'react';
import { Truck, MapPin, Navigation, ArrowRight, ShieldCheck, DollarSign, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LogisticsPage({ currentLang, setActivePage }) {
  const [isOptimized, setIsOptimized] = useState(true);
  const [optimizationAlert, setOptimizationAlert] = useState('');

  const truckList = [
    {
      id: 'NX204',
      driver: 'Rajesh Verma (MH-31-AP-8821)',
      capacity: '10 Tonnes',
      loaded: '8.5 Tonnes',
      route: 'Nagpur → Amravati',
      status: 'In Transit',
      eta: '2 Hours 15 Mins',
      statusBg: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      id: 'NX205',
      driver: 'Ganesh Shinde (MH-27-BX-4412)',
      capacity: '12 Tonnes',
      loaded: '11.0 Tonnes',
      route: 'Wardha → Nagpur',
      status: 'Loading at Hub',
      eta: 'Dispatches in 30 Mins',
      statusBg: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      id: 3,
      idStr: 'NX208',
      driver: 'Prakash Deshmukh (MH-30-CD-9901)',
      capacity: '8 Tonnes',
      loaded: '7.8 Tonnes',
      route: 'Akola → Nashik',
      status: 'Delivered',
      eta: 'Completed',
      statusBg: 'bg-purple-100 text-purple-800 border-purple-300'
    }
  ];

  const handleOptimizeRoutes = () => {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setIsOptimized(true);
    setOptimizationAlert('AI Route Optimizer recalibrated! Total transit distance reduced by 42 km across 3 pooled trucks.');
    setTimeout(() => setOptimizationAlert(''), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">AI Express Freight Network</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pooled Logistics & Route Optimization</h1>
          <p className="text-xs text-slate-500 font-medium">Consolidating produce loads across neighboring FPOs to cut freight overheads by 25%</p>
        </div>

        <button
          onClick={handleOptimizeRoutes}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xl shadow-emerald-600/30 transition flex items-center gap-2"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Optimize Routes Now</span>
        </button>
      </div>

      {optimizationAlert && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{optimizationAlert}</span>
          </div>
        </div>
      )}

      {/* SMART ROUTE OPTIMIZATION COMPARISON CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-8 rounded-3xl text-white shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-extrabold text-teal-400 uppercase tracking-wider">Smart Freight Cost Efficiency</span>
            <h2 className="text-2xl font-black text-white mt-1">Traditional vs Nexora AI Pooled Route</h2>
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/40">
            25% Estimated Logistics Cost Reduction
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Route */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Traditional Un-pooled Logistics</span>
            <div className="text-3xl font-black text-slate-300">₹100 / tonne</div>
            <p className="text-xs text-slate-400 font-medium">Single FPO trucks running at partial 50-60% capacity with empty return trips.</p>
          </div>

          {/* AI Pooled Route */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900/90 to-teal-900/90 border border-emerald-500/50 space-y-3 shadow-lg">
            <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">Nexora AI Pooled Freight</span>
            <div className="text-4xl font-black text-emerald-400">₹75 / tonne</div>
            <p className="text-xs text-emerald-100 font-medium">Shared multi-FPO loads consolidated onto 85-95% full capacity trucks on shared routes.</p>
          </div>
        </div>
      </div>

      {/* MAP-BASED INTERFACE & TRUCK CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Interactive Map Visual Simulator */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>Live Express Logistics Hub Map</span>
            </h3>
            <span className="text-xs font-bold text-emerald-600">Vidarbha & Nashik Corridors</span>
          </div>

          {/* Visual Map Diagram Representation */}
          <div className="relative h-80 rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 flex items-center justify-center p-6 text-white">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Map Node Locations */}
            <div className="w-full max-w-lg space-y-8 relative z-10">
              
              {/* Route line 1: Nagpur -> Amravati */}
              <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold">Nagpur FPO Hub</span>
                </div>
                <div className="flex-1 mx-4 border-t-2 border-dashed border-emerald-400 relative flex items-center justify-center">
                  <span className="bg-emerald-600 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow">
                    Truck #NX204 (In Transit)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="text-xs font-bold">Amravati Retail Hub</span>
                </div>
              </div>

              {/* Route line 2: Wardha -> Nagpur */}
              <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-400" />
                  <span className="text-xs font-bold">Wardha FPO Hub</span>
                </div>
                <div className="flex-1 mx-4 border-t-2 border-dashed border-blue-400 relative flex items-center justify-center">
                  <span className="bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow">
                    Truck #NX205 (Loading)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold">Nagpur Wholesale</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Truck Status Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900">Active Truck Fleet ({truckList.length})</h3>
            <span className="text-xs text-slate-400 font-semibold">Real-time Telematics</span>
          </div>

          <div className="space-y-4">
            {truckList.map((t) => (
              <div key={t.id || t.idStr} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-3 hover:border-emerald-400 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Truck #{t.id || t.idStr}</h4>
                      <p className="text-[11px] text-slate-400 font-medium">{t.driver}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${t.statusBg}`}>
                    {t.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Capacity / Loaded</span>
                    <span className="font-extrabold text-slate-800">{t.loaded} / {t.capacity}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Assigned Route</span>
                    <span className="font-extrabold text-emerald-700">{t.route}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Estimated Arrival: <strong>{t.eta}</strong></span>
                  <span className="text-emerald-600 font-bold hover:underline cursor-pointer">Live GPS Tracking</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
