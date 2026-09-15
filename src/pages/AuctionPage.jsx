import React, { useState, useEffect } from 'react';
import { Gavel, Clock, TrendingUp, ShieldCheck, Sparkles, CheckCircle2, ChevronRight, AlertCircle, Info, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuctionPage({ currentLang, setActivePage }) {
  // Real-time countdown timer (in seconds)
  const [timeLeft, setTimeLeft] = useState(9257); // 02:34:17
  const [currentPrice, setCurrentPrice] = useState(36);
  const [bidsCount, setBidsCount] = useState(24);
  const [bidAmount, setBidAmount] = useState('');
  const [bidderName, setBidderName] = useState('Sharma Restaurant Group');
  const [alertSuccess, setAlertSuccess] = useState('');

  // Live Bid History Feed
  const [bidHistory, setBidHistory] = useState([
    { id: 1, buyer: 'Sharma Restaurant Group', amount: 36, time: '2 mins ago', badge: 'High Bidder' },
    { id: 2, buyer: 'Nagpur Fresh Mart', amount: 35.5, time: '5 mins ago', badge: 'Outbid' },
    { id: 3, buyer: 'Vidarbha Wholesale Group', amount: 34.0, time: '12 mins ago', badge: 'Outbid' },
    { id: 4, buyer: 'Metro Food Hub', amount: 33.0, time: '18 mins ago', badge: 'Outbid' },
    { id: 5, buyer: 'Central India Retailers', amount: 31.5, time: '25 mins ago', badge: 'Outbid' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlaceBid = (e) => {
    e.preventDefault();
    const parsed = parseFloat(bidAmount);
    if (!parsed || parsed <= currentPrice) return;

    setCurrentPrice(parsed);
    setBidsCount(prev => prev + 1);

    const newEntry = {
      id: Date.now(),
      buyer: bidderName || 'Anonymous Buyer',
      amount: parsed,
      time: 'Just now',
      badge: 'High Bidder'
    };

    // Update previous top bidder badge to Outbid
    const updatedHistory = bidHistory.map(b => ({ ...b, badge: 'Outbid' }));
    setBidHistory([newEntry, ...updatedHistory]);

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setAlertSuccess(`Bid of ₹${parsed}/kg placed successfully!`);
    setBidAmount('');
    setTimeout(() => setAlertSuccess(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-600">Live Transparent Auction</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">Price Discovery Desk</h1>
          <p className="text-xs text-slate-500 font-medium">Real-time auction matching FPOs directly with verified bulk buyers</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('mandi')}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition border"
          >
            Compare Mandi Prices
          </button>
        </div>
      </div>

      {alertSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{alertSuccess}</span>
          </div>
        </div>
      )}

      {/* MAIN TWO-COLUMN AUCTION LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Produce Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Organic Grade A
                </span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2">Organic Tomatoes – Grade A</h2>
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> Green Valley FPO • Nagpur Hub
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-400 block">Lot Quantity</span>
                <span className="text-2xl font-black text-slate-900">5 Tonnes</span>
              </div>
            </div>

            {/* Produce Stats Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Starting Price</span>
                <span className="font-extrabold text-slate-800 text-base">₹30 / kg</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Current Price</span>
                <span className="font-black text-emerald-600 text-base">₹{currentPrice} / kg</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Total Bids</span>
                <span className="font-extrabold text-slate-800 text-base">{bidsCount} Bids</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Time Remaining</span>
                <span className="font-black text-amber-600 text-base flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {formatCountdown(timeLeft)}
                </span>
              </div>
            </div>

            {/* AI Price Recommendation Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/60 border border-amber-200/90 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">AI Price Intelligence</h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase">
                  Optimal Recommendation
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="bg-white/80 p-3 rounded-xl border border-amber-200/80">
                  <span className="text-[11px] font-bold text-slate-500 block">Live Mandi Benchmark</span>
                  <span className="text-base font-extrabold text-slate-800">₹33 / kg</span>
                </div>
                <div className="bg-amber-500/20 p-3 rounded-xl border border-amber-300">
                  <span className="text-[11px] font-bold text-amber-900 block">Nexora Recommended Price</span>
                  <span className="text-lg font-black text-amber-900">₹35–37 / kg</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium flex items-start gap-1.5">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>"Recommended price generated using market price, grade, demand and historical trends."</span>
              </p>
            </div>

            {/* Quality Inspection Certificate */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>FSSAI & Agmark Quality Score: <strong>96 / 100 Verified</strong></span>
              </div>
              <span className="text-emerald-700 font-bold">Zero Pesticide Tested</span>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Live Auction Panel & Bid Submission */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Bid Submission Panel */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-3xl text-white border border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Gavel className="w-5 h-5 text-amber-400" />
                <span>Submit Live Bid</span>
              </h3>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
                Min Increment: ₹0.50
              </span>
            </div>

            <form onSubmit={handlePlaceBid} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Buyer Organization</label>
                <input
                  type="text"
                  value={bidderName}
                  onChange={(e) => setBidderName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Your Bid Rate (Must be higher than ₹{currentPrice}/kg)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    step="0.5"
                    placeholder={`e.g. ${currentPrice + 1}`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-base font-black text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl transition transform active:scale-95"
              >
                Place Bid Now (₹{bidAmount || currentPrice + 1}/kg)
              </button>
            </form>
          </div>

          {/* Real-time Bid History Feed */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Live Bid Stream ({bidsCount} total)</span>
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {bidHistory.map((b) => (
                <div key={b.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{b.buyer}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold">{b.time}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-slate-900 text-sm">₹{b.amount.toFixed(2)} / kg</div>
                    <span className={`text-[10px] font-bold ${b.badge === 'High Bidder' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {b.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
