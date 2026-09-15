import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, Award, Gavel, ShoppingCart, Clock, CheckCircle2, TrendingUp, ChevronRight, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MarketplacePage({ currentLang, setActivePage, onOpenAuction }) {
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [maxPrice, setMaxPrice] = useState(100);

  // Modal state
  const [buyModalItem, setBuyModalItem] = useState(null);
  const [bidModalItem, setBidModalItem] = useState(null);
  const [customBidAmount, setCustomBidAmount] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sample Produce Listings
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Premium Tomatoes',
      category: 'Vegetables',
      fpo: 'Green Valley FPO',
      grade: 'Grade A',
      available: '2.5 Tonnes',
      marketPrice: 32,
      nexoraPrice: 35,
      harvestDate: '2026-09-14',
      location: 'Nagpur',
      qualityScore: 96,
      image: '🍅'
    },
    {
      id: 2,
      name: 'Fresh Red Onions',
      category: 'Vegetables',
      fpo: 'Sahyadri Farmers FPO',
      grade: 'Grade A',
      available: '5.0 Tonnes',
      marketPrice: 24,
      nexoraPrice: 27,
      harvestDate: '2026-09-12',
      location: 'Nashik',
      qualityScore: 94,
      image: '🧅'
    },
    {
      id: 3,
      name: 'Organic Sharbati Wheat',
      category: 'Grains',
      fpo: 'Wardha Agro Producer Co.',
      grade: 'Grade A',
      available: '10.0 Tonnes',
      marketPrice: 28,
      nexoraPrice: 31,
      harvestDate: '2026-09-10',
      location: 'Wardha',
      qualityScore: 98,
      image: '🌾'
    },
    {
      id: 4,
      name: 'Nagpur Sweet Oranges',
      category: 'Fruits',
      fpo: 'Vidarbha Citrus FPO',
      grade: 'Grade A',
      available: '3.5 Tonnes',
      marketPrice: 42,
      nexoraPrice: 46,
      harvestDate: '2026-09-15',
      location: 'Nagpur',
      qualityScore: 95,
      image: '🍊'
    },
    {
      id: 5,
      name: 'Yellow Toor Dal (Pigeon Peas)',
      category: 'Pulses',
      fpo: 'Akola Grain Growers FPO',
      grade: 'Grade B',
      available: '4.0 Tonnes',
      marketPrice: 85,
      nexoraPrice: 89,
      harvestDate: '2026-09-08',
      location: 'Akola',
      qualityScore: 91,
      image: '🫘'
    },
    {
      id: 6,
      name: 'Maharashtrian Red Chilli',
      category: 'Spices',
      fpo: 'Amravati Spice Producer FPO',
      grade: 'Grade A',
      available: '1.2 Tonnes',
      marketPrice: 140,
      nexoraPrice: 152,
      harvestDate: '2026-09-11',
      location: 'Amravati',
      qualityScore: 97,
      image: '🌶️'
    }
  ]);

  // Sample Live Auctions
  const [auctions, setAuctions] = useState([
    {
      id: 101,
      produce: 'Organic Tomatoes – Grade A',
      fpo: 'Green Valley FPO',
      quantity: '5.0 Tonnes',
      startingPrice: 30,
      currentBid: 36,
      bidders: 24,
      timeLeft: 9257, // in seconds
      location: 'Nagpur'
    },
    {
      id: 102,
      produce: 'Fresh Potatoes – Grade A',
      fpo: 'Wardha Agro FPO',
      quantity: '8.0 Tonnes',
      startingPrice: 20,
      currentBid: 24,
      bidders: 18,
      timeLeft: 5410,
      location: 'Wardha'
    },
    {
      id: 103,
      produce: 'Basmati Rice 1121',
      fpo: 'Akola Agri Producer Co.',
      quantity: '12.0 Tonnes',
      startingPrice: 65,
      currentBid: 72,
      bidders: 31,
      timeLeft: 14200,
      location: 'Akola'
    }
  ]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setAuctions(prev =>
        prev.map(a => ({
          ...a,
          timeLeft: a.timeLeft > 0 ? a.timeLeft - 1 : 0
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const locations = ['All', 'Nagpur', 'Amravati', 'Wardha', 'Akola', 'Nashik', 'Pune'];
  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices'];
  const grades = ['All', 'Grade A', 'Grade B', 'Grade C'];

  // Filtering
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.fpo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === 'All' || p.location === selectedLocation;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesGrade = selectedGrade === 'All' || p.grade === selectedGrade;
    const matchesPrice = p.nexoraPrice <= maxPrice;
    return matchesSearch && matchesLocation && matchesCategory && matchesGrade && matchesPrice;
  });

  const handleBuyNow = (product) => {
    setBuyModalItem(product);
  };

  const confirmBuy = () => {
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    setSuccessMessage(`Success! Order confirmed for ${buyModalItem.name} at ₹${buyModalItem.nexoraPrice}/kg.`);
    setBuyModalItem(null);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handlePlaceBidSubmit = (auctionId) => {
    const amount = parseFloat(customBidAmount);
    if (!amount || isNaN(amount)) return;

    setAuctions(prev => prev.map(a => {
      if (a.id === auctionId && amount > a.currentBid) {
        return { ...a, currentBid: amount, bidders: a.bidders + 1 };
      }
      return a;
    }));

    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    setSuccessMessage(`Bid of ₹${amount}/kg submitted successfully!`);
    setBidModalItem(null);
    setCustomBidAmount('');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Direct Agri Marketplace</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Verified Produce Marketplace</h1>
          <p className="text-sm text-slate-500 font-medium">Buy directly from registered FPOs with transparent pricing and quality grading</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('auctions')}
            className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition flex items-center gap-2"
          >
            <Gavel className="w-4 h-4" />
            <span>Go to Live Auction Desk</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="p-1 hover:bg-emerald-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Control Dashboard */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Marketplace Filters</span>
          </h3>
          <span className="text-xs font-semibold text-slate-400">{filteredProducts.length} listings found</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search produce or FPO..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Location Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Location Hub</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Grade Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Quality Grade</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LIVE AUCTIONS SECTION */}
      <div className="bg-gradient-to-r from-amber-900/90 via-slate-900 to-amber-950 p-8 rounded-3xl text-white shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">Live Time-Bound Auctions</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">Active Mandi Lot Auctions</h2>
          </div>
          <span className="text-xs text-amber-200 font-medium">Bids update in real-time with automated contract execution</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {auctions.map(auc => (
            <div key={auc.id} className="bg-slate-900/90 rounded-2xl p-5 border border-amber-700/60 flex flex-col justify-between space-y-4 shadow-lg hover:border-amber-400 transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                    Lot #{auc.id}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-extrabold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTime(auc.timeLeft)}</span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-white mb-1">{auc.produce}</h3>
                <p className="text-xs text-slate-400 font-medium">{auc.fpo} • {auc.location}</p>
                <p className="text-xs font-bold text-slate-300 mt-2">Quantity: {auc.quantity}</p>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Starting Price:</span>
                  <span className="font-semibold text-slate-300">₹{auc.startingPrice}/kg</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-amber-400">Current High Bid:</span>
                  <span className="font-black text-white text-base">₹{auc.currentBid}/kg</span>
                </div>
                <div className="text-[10px] text-slate-400 text-right font-medium">
                  {auc.bidders} Active Bidders
                </div>
              </div>

              <button
                onClick={() => setBidModalItem(auc)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-md"
              >
                <Gavel className="w-4 h-4" />
                <span>Bid Now</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCT CARDS LISTINGS GRID */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Direct FPO Supply Listings</h2>

        {filteredProducts.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border text-center text-slate-400 font-semibold">
            No produce listings match the selected filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(p => (
              <div key={p.id} className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-md hover:shadow-xl transition flex flex-col justify-between group">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-2xl flex items-center justify-center shadow-inner">
                        {p.image}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition">{p.name}</h3>
                        <p className="text-xs font-semibold text-emerald-600">{p.fpo}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {p.grade}
                    </span>
                  </div>

                  {/* Attributes */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl mb-4 border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Available</span>
                      <span className="font-bold text-slate-800">{p.available}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Quality Score</span>
                      <span className="font-bold text-emerald-600">{p.qualityScore}% Verified</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Harvest Date</span>
                      <span className="font-semibold text-slate-700">{p.harvestDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Location Hub</span>
                      <span className="font-semibold text-slate-700">{p.location}</span>
                    </div>
                  </div>

                  {/* Price comparison */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 mb-6">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 block">Local Mandi Rate</span>
                      <span className="text-xs font-bold text-slate-400 line-through">₹{p.marketPrice}/kg</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-emerald-700 block">Nexora Direct Rate</span>
                      <span className="text-lg font-black text-emerald-800">₹{p.nexoraPrice}/kg</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      setActivePage('auctions');
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition border border-slate-200 flex items-center justify-center gap-1.5"
                  >
                    <Gavel className="w-3.5 h-3.5" />
                    <span>Place Bid</span>
                  </button>

                  <button
                    onClick={() => handleBuyNow(p)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buy Now Modal */}
      {buyModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 max-w-md w-full space-y-5">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-slate-900">Confirm Direct Purchase</h3>
              <button onClick={() => setBuyModalItem(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <h4 className="font-extrabold text-slate-900 text-sm">{buyModalItem.name}</h4>
                <p className="text-emerald-700 font-semibold">{buyModalItem.fpo} • {buyModalItem.location}</p>
                <div className="mt-2 text-base font-black text-emerald-800">
                  Total Nexora Rate: ₹{buyModalItem.nexoraPrice} / kg
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Procurement Quantity</label>
                <select className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50">
                  <option>500 kg (Small Bulk)</option>
                  <option>1.0 Tonne (Standard Lot)</option>
                  <option>2.5 Tonnes (Full Available Lot)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Delivery Hub Destination</label>
                <input type="text" defaultValue="Nagpur Wholesale Center, Gate #4" className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-xs bg-slate-50" />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setBuyModalItem(null)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmBuy}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md"
              >
                Confirm Order & Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bid Modal */}
      {bidModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 max-w-md w-full space-y-5">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Gavel className="w-5 h-5 text-amber-500" />
                <span>Place Auction Bid</span>
              </h3>
              <button onClick={() => setBidModalItem(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <h4 className="font-extrabold text-slate-900 text-sm">{bidModalItem.produce}</h4>
                <p className="text-amber-800 font-semibold">{bidModalItem.fpo} • {bidModalItem.quantity}</p>
                <div className="mt-2 flex justify-between items-center text-xs">
                  <span>Current High Bid:</span>
                  <span className="font-black text-amber-900 text-sm">₹{bidModalItem.currentBid}/kg</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Bid Amount (₹ / kg)</label>
                <input
                  type="number"
                  placeholder={`Must be higher than ₹${bidModalItem.currentBid}`}
                  value={customBidAmount}
                  onChange={(e) => setCustomBidAmount(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 font-bold text-sm bg-slate-50 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setBidModalItem(null)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePlaceBidSubmit(bidModalItem.id)}
                className="w-1/2 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 shadow-md"
              >
                Submit Bid
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
