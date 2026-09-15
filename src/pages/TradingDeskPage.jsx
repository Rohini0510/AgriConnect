import React, { useState } from 'react';
import { ShoppingBag, Plus, Filter, ShieldCheck, Clock, ArrowUpRight, CheckCircle2, X } from 'lucide-react';

const INITIAL_BATCHES = [
  {
    id: 'BATCH-101',
    crop: 'Tomato (Grade A)',
    fpo: 'Sahyadri Farmers Producer Co.',
    location: 'Narayangaon, Pune',
    quantity: '5.0 Tons',
    basePrice: 19.50,
    currentBid: 21.00,
    bidsCount: 6,
    harvestDate: '2026-09-14',
    timeLeft: '04h 20m',
    grade: 'A',
    status: 'ACTIVE_AUCTION'
  },
  {
    id: 'BATCH-102',
    crop: 'Onion (Grade B)',
    fpo: 'Narayangaon Vegetable FPO',
    location: 'Nashik, MH',
    quantity: '12.0 Tons',
    basePrice: 24.00,
    currentBid: 26.50,
    bidsCount: 11,
    harvestDate: '2026-09-13',
    timeLeft: '18h 45m',
    grade: 'B',
    status: 'ACTIVE_AUCTION'
  },
  {
    id: 'BATCH-103',
    crop: 'Potato (Jyoti)',
    fpo: 'Vidarbha Agro Producer Co.',
    location: 'Nagpur, MH',
    quantity: '8.5 Tons',
    basePrice: 18.00,
    currentBid: 20.25,
    bidsCount: 4,
    harvestDate: '2026-09-15',
    timeLeft: '01d 02h',
    grade: 'A',
    status: 'ACTIVE_AUCTION'
  }
];

export default function TradingDeskPage({ userRole }) {
  const [batches, setBatches] = useState(INITIAL_BATCHES);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  // New batch form state
  const [newCrop, setNewCrop] = useState('Tomato (Grade A)');
  const [newQty, setNewQty] = useState('3.0 Tons');
  const [newPrice, setNewPrice] = useState('20.00');
  const [newGrade, setNewGrade] = useState('A');

  const handlePlaceBid = (e) => {
    e.preventDefault();
    if (!selectedBatch || !bidAmount) return;

    const numericBid = parseFloat(bidAmount);
    if (numericBid <= selectedBatch.currentBid) {
      alert('Bid must be higher than the current bid!');
      return;
    }

    setBatches(batches.map(b => b.id === selectedBatch.id ? {
      ...b,
      currentBid: numericBid,
      bidsCount: b.bidsCount + 1
    } : b));

    setSelectedBatch(null);
    setBidAmount('');
  };

  const handleCreateBatch = (e) => {
    e.preventDefault();
    const newEntry = {
      id: `BATCH-${Date.now().toString().slice(-3)}`,
      crop: newCrop,
      fpo: 'Sahyadri Farmers Producer Co.',
      location: 'Narayangaon, Pune',
      quantity: newQty,
      basePrice: parseFloat(newPrice),
      currentBid: parseFloat(newPrice),
      bidsCount: 0,
      harvestDate: new Date().toISOString().slice(0, 10),
      timeLeft: '24h 00m',
      grade: newGrade,
      status: 'ACTIVE_AUCTION'
    };

    setBatches([newEntry, ...batches]);
    setIsListModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Live Produce Trading Desk</span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">Direct Crop Auction Marketplace</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Time-bound transparent auctions backed by eNAM Mandi price benchmarks
          </p>
        </div>

        <button
          onClick={() => setIsListModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> List Crop Produce Batch
        </button>
      </div>

      {/* Produce Batches Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <div key={batch.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 hover:shadow-xl transition relative">
            <div className="flex justify-between items-center text-xs">
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Grade {batch.grade} Verified
              </span>
              <span className="flex items-center gap-1 font-bold text-slate-500">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> {batch.timeLeft}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{batch.id}</span>
              <h3 className="font-black text-slate-900 text-lg">{batch.crop}</h3>
              <p className="text-xs text-slate-500 font-medium">{batch.fpo} • {batch.location}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Current High Bid</p>
                <p className="text-xl font-black text-emerald-600">₹{batch.currentBid.toFixed(2)} <span className="text-xs font-normal">/ kg</span></p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Quantity</p>
                <p className="text-xs font-bold text-slate-700">{batch.quantity}</p>
                <p className="text-[10px] text-slate-400 font-medium">{batch.bidsCount} Bids</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedBatch(batch)}
              className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition flex items-center justify-center gap-2"
            >
              Place Live Bid <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Place Bid Modal */}
      {selectedBatch && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95">
            <button onClick={() => setSelectedBatch(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase">Place Auction Bid</span>
              <h3 className="text-xl font-black text-slate-900">{selectedBatch.crop}</h3>
              <p className="text-xs text-slate-500">{selectedBatch.fpo} ({selectedBatch.quantity})</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Current Highest Bid</p>
                <p className="text-xl font-black text-emerald-700">₹{selectedBatch.currentBid.toFixed(2)} / kg</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Base Price</p>
                <p className="text-xs font-bold text-slate-600">₹{selectedBatch.basePrice.toFixed(2)}</p>
              </div>
            </div>

            <form onSubmit={handlePlaceBid} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Bid Rate (₹ / kg)</label>
                <input
                  type="number"
                  step="0.25"
                  min={selectedBatch.currentBid + 0.25}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Min bid: ₹${(selectedBatch.currentBid + 0.25).toFixed(2)}`}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button type="submit" className="w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition">
                Confirm & Submit Bid
              </button>
            </form>
          </div>
        </div>
      )}

      {/* List Produce Batch Modal */}
      {isListModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95">
            <button onClick={() => setIsListModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase">FPO Produce Listing</span>
              <h3 className="text-xl font-black text-slate-900">List New Crop Batch</h3>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 mb-1">Crop Type & Variety</label>
                <input
                  type="text"
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Quantity (Tons)</label>
                  <input
                    type="text"
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Base Price (₹/kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Quality Grade</label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="A">Grade A (Premium)</option>
                  <option value="B">Grade B (Standard)</option>
                  <option value="C">Grade C (Processing)</option>
                </select>
              </div>

              <button type="submit" className="w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-lg transition">
                Publish Batch to Live Auction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
