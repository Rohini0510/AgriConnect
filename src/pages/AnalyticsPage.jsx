import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Award, BookOpen, MapPin, TrendingUp, ShieldCheck } from 'lucide-react';
import { translations } from '../data/translations';

const RADAR_DATA = [
  { subject: 'Technical Feasibility', Mandi: 7.0, AgriConnect: 8.5 },
  { subject: 'Data Availability', Mandi: 6.0, AgriConnect: 7.8 },
  { subject: 'Implementation', Mandi: 5.0, AgriConnect: 6.0 },
  { subject: 'Farmer Impact', Mandi: 5.8, AgriConnect: 9.2 },
  { subject: 'Buyer Value', Mandi: 6.8, AgriConnect: 8.8 },
  { subject: 'Scalability', Mandi: 6.8, AgriConnect: 8.8 },
];

const BAR_DATA = [
  { name: 'Farmer Realization %', TraditionalMandi: 60, AgriConnect: 75 },
  { name: 'Post-Harvest Losses %', TraditionalMandi: 18, AgriConnect: 10 },
  { name: 'Logistics Cost Index', TraditionalMandi: 100, AgriConnect: 75 },
  { name: 'Direct Buyer Proc %', TraditionalMandi: 15, AgriConnect: 60 },
];

export default function AnalyticsPage({ currentLang }) {
  const t = translations[currentLang] || translations.en;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Empirical Benchmark Data</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">Impact Analytics & Research Case Studies</h1>
        <p className="text-slate-600 mt-2 font-medium">Validated academic research and comparative metrics evaluating AgriConnect</p>
      </div>

      {/* Visual Analytics */}
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 text-center">Multi-dimensional Feasibility Evaluation</h3>
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_DATA}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 11, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} />
                <Radar name="Traditional Mandi" dataKey="Mandi" stroke="#d97706" fill="#d97706" fillOpacity={0.2} />
                <Radar name="AgriConnect Proposed" dataKey="AgriConnect" stroke="#059669" fill="#059669" fillOpacity={0.4} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 text-center">Impact Benchmark Metrics</h3>
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BAR_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="TraditionalMandi" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="AgriConnect" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Academic Research Case Studies */}
      <div className="space-y-6 pt-6">
        <h2 className="text-xl font-bold text-slate-900 text-center">{t.researchTitle}</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900">{t.emeraldTitle}</h4>
            <p className="text-2xl font-black text-emerald-600">{t.emeraldStat}</p>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{t.emeraldDesc}</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900">{t.punjabTitle}</h4>
            <p className="text-2xl font-black text-amber-600">{t.punjabStat}</p>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{t.punjabDesc}</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900">{t.biharTitle}</h4>
            <p className="text-2xl font-black text-blue-600">{t.biharStat}</p>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{t.biharDesc}</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900">Meghalaya Ri-Lajong FPO</h4>
            <p className="text-2xl font-black text-purple-600">8 - 18%</p>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Consistent net farm income surge across multi-crop portfolios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
