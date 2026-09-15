import React, { useState } from 'react';
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, BarChart2, Filter, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function AiDemandPage({ currentLang, setActivePage }) {
  const [selectedDays, setSelectedDays] = useState('30');
  const [selectedCrop, setSelectedCrop] = useState('Tomatoes');

  // Chart datasets for 7, 30, 90 days
  const chartData7 = [
    { period: 'Day 1', historical: 2.1, forecast: 2.1 },
    { period: 'Day 2', historical: 2.3, forecast: 2.4 },
    { period: 'Day 3', historical: 2.2, forecast: 2.6 },
    { period: 'Day 4', historical: 2.5, forecast: 2.8 },
    { period: 'Day 5', historical: 2.7, forecast: 3.0 },
    { period: 'Day 6', historical: null, forecast: 3.2 },
    { period: 'Day 7', historical: null, forecast: 3.4 },
  ];

  const chartData30 = [
    { period: 'Week 1', historical: 10.5, forecast: 10.5 },
    { period: 'Week 2', historical: 11.8, forecast: 12.0 },
    { period: 'Week 3', historical: 12.2, forecast: 13.5 },
    { period: 'Week 4', historical: 13.0, forecast: 15.2 },
  ];

  const chartData90 = [
    { period: 'Month 1', historical: 42, forecast: 42 },
    { period: 'Month 2', historical: 45, forecast: 49 },
    { period: 'Month 3', historical: null, forecast: 56 },
  ];

  const activeData = selectedDays === '7' ? chartData7 : selectedDays === '90' ? chartData90 : chartData30;

  const forecastCards = [
    { crop: 'Tomatoes', trend: '↑ 18%', dir: 'up', color: 'emerald', bg: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
    { crop: 'Potatoes', trend: '↑ 9%', dir: 'up', color: 'teal', bg: 'bg-teal-50 border-teal-200 text-teal-800' },
    { crop: 'Onions', trend: '↓ 4%', dir: 'down', color: 'rose', bg: 'bg-rose-50 border-rose-200 text-rose-800' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600">Machine Learning Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">AI Demand Intelligence</h1>
          <p className="text-xs text-slate-500 font-medium">Predictive market demand analytics to optimize crop planting and FPO harvest schedules</p>
        </div>

        <button
          onClick={() => setActivePage('fpo-dash')}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
        >
          View FPO Supply Plan
        </button>
      </div>

      {/* FORECAST METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {forecastCards.map((c, i) => (
          <div
            key={i}
            onClick={() => setSelectedCrop(c.crop)}
            className={`p-6 rounded-3xl border transition cursor-pointer shadow-sm hover:shadow-md ${
              selectedCrop === c.crop ? 'ring-2 ring-indigo-500 scale-102' : ''
            } ${c.bg}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-extrabold text-slate-900">{c.crop}</span>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-white shadow-sm flex items-center gap-1">
                {c.dir === 'up' ? <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-600" />}
                {c.trend}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">Expected demand shift in next 14 days</p>
          </div>
        ))}
      </div>

      {/* DISTINCT AI INSIGHT RECOMMENDATION CARD */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white border border-indigo-700/60 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-500/40">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">AI Automated Insight</span>
            <h2 className="text-xl font-black text-white">AI Recommendation</h2>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-800 text-sm font-semibold text-slate-200 leading-relaxed">
          “Tomato demand is expected to increase by <span className="text-amber-400 font-extrabold">18% next week</span>. FPOs in Nagpur region can prepare approximately <span className="text-emerald-400 font-extrabold">3.2 tonnes of additional supply</span> to capture premium pricing before market saturation.”
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Confidence Score: 94.2% (Trained on 5 years eNAM & Mandi data)</span>
          </span>
          <button
            onClick={() => setActivePage('fpo-dash')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
          >
            Apply to FPO Harvest Plan
          </button>
        </div>
      </div>

      {/* INTERACTIVE RECHARTS GRAPH CONTAINER */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">Historical Demand vs AI Forecast</h3>
            <p className="text-xs text-slate-500 font-medium">Comparing past mandi volume (Tonnes) with neural forecast model</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Time Range:</span>
            <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold border border-slate-200">
              {['7', '30', '90'].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedDays(range)}
                  className={`px-3.5 py-1.5 rounded-xl transition ${
                    selectedDays === range ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {range} Days
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="historical" name="Historical Mandi Demand" stroke="#64748b" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="forecast" name="AI Predicted Demand" stroke="#6366f1" strokeWidth={4} strokeDasharray="4 4" dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
