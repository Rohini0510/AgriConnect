import React, { useState } from 'react';
import { Store, TrendingUp, TrendingDown, Minus, RefreshCw, Filter, Sparkles } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function MandiPricesPage({ currentLang, setActivePage }) {
  const [selectedCommodity, setSelectedCommodity] = useState('Tomato');

  const mandiPrices = [
    { produce: 'Tomato (Grade A)', localMandi: 32, eNam: 33, nexora: 35, trend: 'up', diff: '+₹3/kg vs Mandi' },
    { produce: 'Potato (Grade A)', localMandi: 24, eNam: 25, nexora: 26, trend: 'up', diff: '+₹2/kg vs Mandi' },
    { produce: 'Onion (Grade B)', localMandi: 28, eNam: 29, nexora: 28, trend: 'flat', diff: 'Equal Rate' },
    { produce: 'Sharbati Wheat', localMandi: 28, eNam: 29.5, nexora: 31, trend: 'up', diff: '+₹3/kg vs Mandi' },
    { produce: 'Basmati Rice 1121', localMandi: 65, eNam: 68, nexora: 72, trend: 'up', diff: '+₹7/kg vs Mandi' },
    { produce: 'Yellow Toor Dal', localMandi: 84, eNam: 86, nexora: 89, trend: 'up', diff: '+₹5/kg vs Mandi' },
    { produce: 'Nagpur Oranges', localMandi: 40, eNam: 42, nexora: 46, trend: 'up', diff: '+₹6/kg vs Mandi' },
  ];

  const trendData = [
    { day: 'Mon', localMandi: 31, eNam: 32, nexora: 34 },
    { day: 'Tue', localMandi: 30, eNam: 32, nexora: 35 },
    { day: 'Wed', localMandi: 32, eNam: 33, nexora: 35 },
    { day: 'Thu', localMandi: 31, eNam: 33, nexora: 36 },
    { day: 'Fri', localMandi: 32, eNam: 33, nexora: 36 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Mandi & eNAM Intelligence</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Live Mandi Price Discovery Index</h1>
          <p className="text-xs text-slate-500 font-medium">Real-time rate comparison between local APMC Mandis, eNAM portal, and Nexora Direct rates</p>
        </div>

        <button
          onClick={() => setActivePage('auctions')}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md"
        >
          Sell at Nexora Rates
        </button>
      </div>

      {/* COMPARISON TABLE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-600" />
            <span>Commodity Price Comparison Matrix</span>
          </h3>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Synced with Agmarknet API
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 px-3">Produce</th>
                <th className="pb-3 px-3">Local APMC Mandi</th>
                <th className="pb-3 px-3">eNAM National Rate</th>
                <th className="pb-3 px-3">Nexora Direct Rate</th>
                <th className="pb-3 px-3">Trend</th>
                <th className="pb-3 px-3">Farmer Realization Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-slate-700">
              {mandiPrices.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-3 font-extrabold text-slate-900">{item.produce}</td>
                  <td className="py-3.5 px-3 text-slate-500 font-bold">₹{item.localMandi} / kg</td>
                  <td className="py-3.5 px-3 text-blue-600 font-bold">₹{item.eNam} / kg</td>
                  <td className="py-3.5 px-3 font-black text-emerald-700 text-base">₹{item.nexora} / kg</td>
                  <td className="py-3.5 px-3">
                    {item.trend === 'up' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <TrendingUp className="w-4 h-4" /> ↑
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 font-bold">
                        <Minus className="w-4 h-4" /> →
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {item.diff}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRICE TREND ANALYSIS RECHARTS GRAPH */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">Price Trend Analysis</h3>
            <p className="text-xs text-slate-500 font-medium">5-Day comparative rate trajectory</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Select Commodity:</span>
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
            >
              <option value="Tomato">Tomato</option>
              <option value="Potato">Potato</option>
              <option value="Onion">Onion</option>
              <option value="Wheat">Wheat</option>
            </select>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} domain={[25, 40]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="localMandi" name="Local Mandi Rate" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="eNam" name="eNAM Portal Rate" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="nexora" name="Nexora Direct Price" stroke="#10b981" strokeWidth={4} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
