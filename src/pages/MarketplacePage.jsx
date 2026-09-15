import React, { useState } from 'react';
import { ShoppingBag, Users, CheckCircle, Search, Filter, ShieldCheck, ArrowRight } from 'lucide-react';
import { translations } from '../data/translations';

const MOCK_DEMAND_POOLS = [
  {
    id: 1,
    title: "Pune Retailers Direct Pool",
    crop: "Tomato (Grade A)",
    required: "2,500 kg",
    rate: "₹20.00 / kg",
    mandiRate: "₹16.50 / kg",
    daysLeft: 5,
    buyersCount: 14,
    fpoPartner: "Sahyadri Farmers Producer Co."
  },
  {
    id: 2,
    title: "Mumbai Restaurant Group Pool",
    crop: "Onion (Grade B)",
    required: "5,000 kg",
    rate: "₹28.50 / kg",
    mandiRate: "₹24.00 / kg",
    daysLeft: 3,
    buyersCount: 22,
    fpoPartner: "Narayangaon Vegetable FPO"
  },
  {
    id: 3,
    title: "Nagpur Supermarket Chain",
    crop: "Potato (Jyoti)",
    required: "4,000 kg",
    rate: "₹22.00 / kg",
    mandiRate: "₹18.00 / kg",
    daysLeft: 6,
    buyersCount: 9,
    fpoPartner: "Vidarbha Agro Producer Co."
  }
];

const MOCK_FPOS = [
  { name: "Sahyadri Farmers Producer Co.", location: "Nashik, MH", members: 1240, verified: true, primaryCrops: "Grape, Tomato, Onion" },
  { name: "Narayangaon Vegetable FPO", location: "Pune, MH", members: 850, verified: true, primaryCrops: "Tomato, Pomegranate" },
  { name: "Vidarbha Agro Producer Co.", location: "Nagpur, MH", members: 620, verified: true, primaryCrops: "Orange, Soyabean, Cotton" },
  { name: "Konkan Cashew & Mango FPO", location: "Ratnagiri, MH", members: 430, verified: true, primaryCrops: "Alphonso Mango, Cashew" }
];

export default function MarketplacePage({ currentLang }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [joinedPools, setJoinedPools] = useState([]);

  const handleJoinPool = (poolId) => {
    if (!joinedPools.includes(poolId)) {
      setJoinedPools([...joinedPools, poolId]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Demand Aggregation & FPO Directory</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">Live Demand Pool & FPO Marketplace</h1>
        <p className="text-slate-600 mt-2 font-medium">Pool small buyer orders into bulk city-wide demands with direct FPO supply contracts</p>
      </div>

      {/* Live Demand Aggregation Pools */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" /> Active Bulk Demand Pools
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search crop or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {MOCK_DEMAND_POOLS.map((pool) => {
            const isJoined = joinedPools.includes(pool.id);
            return (
              <div key={pool.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-xl transition">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    {pool.daysLeft} Days Left
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{pool.buyersCount} Buyers Pooled</span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{pool.title}</h3>
                  <p className="text-xs text-emerald-700 font-bold mt-1">{pool.crop}</p>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">AgriConnect Pool Rate</p>
                    <p className="text-lg font-black text-emerald-700">{pool.rate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Mandi Rate</p>
                    <p className="text-xs font-bold text-slate-500 line-through">{pool.mandiRate}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  <strong>Target FPO:</strong> {pool.fpoPartner}
                </div>

                <button
                  onClick={() => handleJoinPool(pool.id)}
                  disabled={isJoined}
                  className={`w-full py-3 rounded-2xl font-bold text-xs shadow transition flex items-center justify-center gap-2 ${
                    isJoined
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
                  }`}
                >
                  {isJoined ? <><CheckCircle className="w-4 h-4" /> Committed to Supply</> : 'Supply to Pool'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified FPO Directory */}
      <div className="space-y-6 pt-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" /> Verified FPO Directory
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {MOCK_FPOS.map((fpo, index) => (
            <div key={index} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{fpo.name}</h3>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-500 font-semibold">{fpo.location} • {fpo.members} Farmer Members</p>
                <p className="text-xs text-slate-600 font-medium"><strong>Crops:</strong> {fpo.primaryCrops}</p>
              </div>

              <button className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
