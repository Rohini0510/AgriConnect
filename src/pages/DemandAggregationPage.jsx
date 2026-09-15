import React, { useState } from 'react';
import { Layers, ShoppingBag, Plus, CheckCircle2, ArrowRight, Zap, Building2, Store, Utensils } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DemandAggregationPage({ currentLang, setActivePage }) {
  // Existing Retailer & Restaurant Orders list
  const [buyerRequirements, setBuyerRequirements] = useState([
    { id: 1, buyer: 'Sharma Restaurant', type: 'Restaurant', produce: 'Tomato (Grade A)', qtyKg: 500, location: 'Nagpur', freq: 'Weekly' },
    { id: 2, buyer: 'Nagpur Retail Traders', type: 'Retailer', produce: 'Tomato (Grade A)', qtyKg: 1200, location: 'Nagpur', freq: 'Weekly' },
    { id: 3, buyer: 'Hotel Pride Executive', type: 'Restaurant', produce: 'Potato (Grade A)', qtyKg: 300, location: 'Nagpur', freq: 'Weekly' },
    { id: 4, buyer: 'Central Supermarket', type: 'Retailer', produce: 'Onion (Grade B)', qtyKg: 250, location: 'Nagpur', freq: 'Weekly' },
    { id: 5, buyer: 'Vidarbha Caterers', type: 'Restaurant', produce: 'Tomato (Grade A)', qtyKg: 800, location: 'Nagpur', freq: 'Weekly' },
    { id: 6, buyer: 'Amravati Fresh Mart', type: 'Retailer', produce: 'Tomato (Grade A)', qtyKg: 1700, location: 'Amravati', freq: 'Weekly' },
  ]);

  // Form state
  const [buyerName, setBuyerName] = useState('');
  const [buyerType, setBuyerType] = useState('Restaurant');
  const [produce, setProduce] = useState('Tomato (Grade A)');
  const [qtyKg, setQtyKg] = useState('');
  const [location, setLocation] = useState('Nagpur');
  const [freq, setFreq] = useState('Weekly');
  const [successBanner, setSuccessBanner] = useState('');

  const handleAddRequirement = (e) => {
    e.preventDefault();
    if (!buyerName || !qtyKg) return;

    const newReq = {
      id: Date.now(),
      buyer: buyerName,
      type: buyerType,
      produce,
      qtyKg: parseInt(qtyKg),
      location,
      freq
    };

    setBuyerRequirements([...buyerRequirements, newReq]);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    setSuccessBanner(`Requirement for ${qtyKg} kg of ${produce} posted! Automatically added to aggregation pool.`);
    setBuyerName('');
    setQtyKg('');
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  // Calculate Aggregation totals for Nagpur Tomato pool
  const nagpurTomatoOrders = buyerRequirements.filter(r => r.location === 'Nagpur' && r.produce.includes('Tomato'));
  const totalNagpurTomatoKg = nagpurTomatoOrders.reduce((sum, r) => sum + r.qtyKg, 0);

  const totalBuyersCount = buyerRequirements.length;
  const restaurantsCount = buyerRequirements.filter(r => r.type === 'Restaurant').length;
  const retailersCount = buyerRequirements.filter(r => r.type === 'Retailer').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Demand Aggregation Engine</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Weekly Buyer Requirement Pool</h1>
          <p className="text-xs text-slate-500 font-medium">Combining small retailer and restaurant orders into large bulk supply contracts</p>
        </div>

        <button
          onClick={() => setActivePage('auctions')}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md"
        >
          View Active Supply Auctions
        </button>
      </div>

      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successBanner}</span>
          </div>
        </div>
      )}

      {/* FEATURED: AGGREGATE DEMAND CALCULATION WIDGET */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 rounded-3xl p-8 text-white shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">AI Order Consolidation</span>
              <h2 className="text-2xl font-black text-white">Aggregated Demand Summary</h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
            Hub: Nagpur Wholesale Cluster
          </span>
        </div>

        {/* Math Visual Formula */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-6 items-center text-center">
          
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
            <div className="text-2xl font-black text-emerald-400">{retailersCount} Retailers</div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Small Shop Owners</p>
          </div>

          <div className="text-2xl font-black text-emerald-400">+</div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
            <div className="text-2xl font-black text-amber-400">{restaurantsCount} Restaurants</div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Local Dining Establishments</p>
          </div>

          <div className="text-2xl font-black text-emerald-400">=</div>

        </div>

        {/* Aggregated Output Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-200">Combined Demand Volume</span>
            <div className="text-3xl sm:text-4xl font-black mt-1">
              {(totalNagpurTomatoKg / 1000).toFixed(1)} Tonnes Combined Demand
            </div>
            <p className="text-xs text-emerald-100 font-medium mt-1">
              Guarantees bulk wholesale discount pricing for buyers and bulk sale for FPOs.
            </p>
          </div>

          <button
            onClick={() => setActivePage('auctions')}
            className="px-6 py-4 rounded-2xl bg-slate-950 hover:bg-slate-900 text-emerald-400 font-black text-xs shadow-xl transition flex items-center justify-center gap-2"
          >
            <span>Create Bulk Order Contract</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SUBMIT REQUIREMENT & LIST GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Submit Requirement Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4">
          <div className="border-b pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Submit Weekly Buyer Requirement</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">Post requirements for automated pooling</p>
          </div>

          <form onSubmit={handleAddRequirement} className="space-y-3 text-xs font-bold">
            <div>
              <label className="block text-slate-700 mb-1">Business Name</label>
              <input
                type="text"
                placeholder="e.g. Sharma Restaurant"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 mb-1">Business Type</label>
                <select
                  value={buyerType}
                  onChange={(e) => setBuyerType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
                >
                  <option value="Restaurant">Restaurant</option>
                  <option value="Retailer">Retailer</option>
                  <option value="Bulk Buyer">Bulk Buyer</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Produce Category</label>
                <select
                  value={produce}
                  onChange={(e) => setProduce(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
                >
                  <option value="Tomato (Grade A)">Tomatoes (Grade A)</option>
                  <option value="Potato (Grade A)">Potatoes (Grade A)</option>
                  <option value="Onion (Grade B)">Onions (Grade B)</option>
                  <option value="Wheat (Sharbati)">Sharbati Wheat</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 mb-1">Quantity Required (kg/week)</label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={qtyKg}
                  onChange={(e) => setQtyKg(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Delivery City Hub</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
                >
                  <option value="Nagpur">Nagpur</option>
                  <option value="Amravati">Amravati</option>
                  <option value="Wardha">Wardha</option>
                  <option value="Nashik">Nashik</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition"
            >
              Add to Aggregation Pool
            </button>
          </form>
        </div>

        {/* Existing Requirements Pool List */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-base font-extrabold text-slate-900">Active Buyer Requirements</h3>
            <span className="text-xs font-semibold text-slate-400">{buyerRequirements.length} Pool Entries</span>
          </div>

          <div className="space-y-3">
            {buyerRequirements.map((req) => (
              <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    {req.type === 'Restaurant' ? <Utensils className="w-5 h-5" /> : <Store className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{req.buyer}</h4>
                    <p className="text-slate-500 font-semibold">{req.produce} • {req.location}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-emerald-800 text-base">{req.qtyKg} kg / week</div>
                  <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border">
                    {req.freq}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
