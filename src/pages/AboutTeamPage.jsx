import React from 'react';
import { Award, GraduationCap, ShieldCheck, CheckCircle2, Heart } from 'lucide-react';
import { translations } from '../data/translations';

export default function AboutTeamPage({ currentLang }) {
  const t = translations[currentLang] || translations.en;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-800 text-center space-y-6">
        <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
          Smart India Hackathon 2026 Team
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{t.teamTitle}</h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto font-medium">{t.teamCollege}</p>
        <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-300 pt-2">
          <span className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">Problem Statement ID: SIH26033</span>
          <span className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">{t.teamGrade}</span>
          <span className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">Category: Software</span>
        </div>
      </div>

      {/* College & Project Credentials Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Cummins College of Engg.</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Maharshi Karve Stree Shikshan Samstha's Cummins College of Engineering for Women, Nagpur. NAAC A+ Accredited Autonomous Institute.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">SIH 2026 Problem Statement</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            SIH26033: Multiple Intermediaries reduce farmers earnings and increase consumer prices. Theme: Agriculture, FoodTech & Rural Development.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Team Nexora</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Dedicated team of engineering innovators building accessible, AI-powered tech solutions for Indian agriculture and rural prosperity.
          </p>
        </div>
      </div>
    </div>
  );
}
