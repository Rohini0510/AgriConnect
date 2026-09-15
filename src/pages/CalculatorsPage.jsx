import React, { useState } from 'react';
import { Calculator, Truck, TrendingUp, DollarSign } from 'lucide-react';
import { translations } from '../data/translations';

const CROP_DATA = {
  tomato: { name: "Tomato (Grade A)", mandi: 16.50, agriconnect: 20.00 },
  onion: { name: "Onion (Grade B)", mandi: 24.00, agriconnect: 28.50 },
  potato: { name: "Potato (Jyoti)", mandi: 18.00, agriconnect: 22.00 },
  wheat: { name: "Sharbati Wheat", mandi: 25.00, agriconnect: 29.00 },
  rice: { name: "Basmati Rice", mandi: 45.00, agriconnect: 52.00 }
};

export default function CalculatorsPage({ currentLang }) {
  const t = translations[currentLang] || translations.en;

  // ROI Calculator state
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [qtyQuintals, setQtyQuintals] = useState(50);

  // Logistics Calculator state
  const [tonnage, setTonnage] = useState(5);
  const [distanceKm, setDistanceKm] = useState(120);

  // ROI Math
  const crop = CROP_DATA[selectedCrop] || CROP_DATA.tomato;
  const qtyKg = qtyQuintals * 100;
  const mandiGross = qtyKg * crop.mandi;
  const mandiNet = mandiGross * 0.60;
  const agriGross = qtyKg * crop.agriconnect;
  const agriNet = agriGross * 0.78;
  const extraGain = agriNet - mandiNet;
  const percentGain = Math.round((extraGain / mandiNet) * 100);

  // Logistics Math
  const standaloneCost = tonnage * distanceKm * 18;
  const pooledCost = standaloneCost * 0.75;
  const logisticsSavings = standaloneCost - pooledCost;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Financial & Operational Intelligence</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">Nexora Impact Calculators</h1>
        <p className="text-slate-600 mt-2 font-medium">Estimate net income gains and shared truck freight savings instantly</p>
      </div>

      {/* 1. Farmer ROI Calculator */}
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t.calcTitle}</h2>
            <p className="text-xs text-slate-500 font-medium">{t.calcSub}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t.cropLabel}</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="tomato">Tomato (Grade A)</option>
                <option value="onion">Onion (Grade B)</option>
                <option value="potato">Potato (Jyoti)</option>
                <option value="wheat">Sharbati Wheat</option>
                <option value="rice">Basmati Rice</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t.acreageLabel}</label>
              <input
                type="range"
                min="10"
                max="500"
                value={qtyQuintals}
                onChange={(e) => setQtyQuintals(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 font-bold mt-1">
                <span>10 Qtl</span>
                <span className="text-emerald-700 font-black text-sm">{qtyQuintals} Quintals ({qtyKg.toLocaleString()} kg)</span>
                <span>500 Qtl</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase">{t.mandiIncome}</p>
              <p className="text-2xl font-black text-slate-800">₹{Math.round(mandiNet).toLocaleString()}</p>
              <span className="inline-block text-[11px] font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">~60% Realization</span>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-2">
              <p className="text-xs font-bold text-emerald-800 uppercase">{t.agriIncome}</p>
              <p className="text-2xl font-black text-emerald-700">₹{Math.round(agriNet).toLocaleString()}</p>
              <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">~78% Realization</span>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 space-y-2">
              <p className="text-xs font-bold text-emerald-200 uppercase">{t.extraGain}</p>
              <p className="text-2xl font-black">+₹{Math.round(extraGain).toLocaleString()} (+{percentGain}%)</p>
              <span className="inline-block text-[11px] font-semibold text-white bg-emerald-700/80 px-2.5 py-1 rounded-full">Net Farmer Benefit</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Shared Logistics Pooling Calculator */}
      <div className="space-y-8 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Shared Logistics Freight Calculator</h2>
            <p className="text-xs text-slate-500 font-medium">Consolidate loads across FPOs onto shared trucks to cut freight costs by 25%</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Truck Load Tonnage (Tons)</label>
              <input
                type="range"
                min="1"
                max="25"
                value={tonnage}
                onChange={(e) => setTonnage(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 font-bold mt-1">
                <span>1 Ton</span>
                <span className="text-emerald-700 font-black text-sm">{tonnage} Tons</span>
                <span>25 Tons</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Transport Distance (km)</label>
              <input
                type="range"
                min="20"
                max="500"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 font-bold mt-1">
                <span>20 km</span>
                <span className="text-emerald-700 font-black text-sm">{distanceKm} km</span>
                <span>500 km</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase">Individual Truck Cost</p>
              <p className="text-2xl font-black text-slate-700 mt-2">₹{Math.round(standaloneCost).toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Standard unpooled transport</p>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/30">
              <p className="text-xs font-bold text-emerald-200 uppercase">AgriConnect Shared Pool</p>
              <p className="text-2xl font-black mt-2">₹{Math.round(pooledCost).toLocaleString()}</p>
              <p className="text-xs text-emerald-100 font-extrabold mt-1">₹{Math.round(logisticsSavings).toLocaleString()} Saved (25%)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
