import React from 'react';
import { Smartphone, Calculator, ShoppingBag, Users, Layers, Truck, TrendingUp, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { translations } from '../data/translations';

export default function HomePage({ currentLang, setActivePage }) {
  const t = translations[currentLang] || translations.en;

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden bg-gradient-to-b from-emerald-50/60 via-slate-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold mb-6 border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Smart India Hackathon 2026 • Agriculture & FoodTech</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight">
                {t.heroTitle}
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                {t.heroSubtitle}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="glass-panel p-4 rounded-2xl border-emerald-100">
                  <p className="text-2xl sm:text-3xl font-black text-emerald-600">{t.heroStat1Val}</p>
                  <p className="text-xs font-bold text-slate-500 mt-1">{t.heroStat1Label}</p>
                </div>
                <div className="glass-panel p-4 rounded-2xl border-emerald-100">
                  <p className="text-2xl sm:text-3xl font-black text-amber-600">{t.heroStat2Val}</p>
                  <p className="text-xs font-bold text-slate-500 mt-1">{t.heroStat2Label}</p>
                </div>
                <div className="glass-panel p-4 rounded-2xl border-emerald-100">
                  <p className="text-2xl sm:text-3xl font-black text-emerald-600">{t.heroStat3Val}</p>
                  <p className="text-xs font-bold text-slate-500 mt-1">{t.heroStat3Label}</p>
                </div>
                <div className="glass-panel p-4 rounded-2xl border-emerald-100">
                  <p className="text-2xl sm:text-3xl font-black text-emerald-600">{t.heroStat4Val}</p>
                  <p className="text-xs font-bold text-slate-500 mt-1">{t.heroStat4Label}</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => setActivePage('simulator')}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 transition flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4" /> {t.ctaApp}
                </button>
                <button
                  onClick={() => setActivePage('calculators')}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-lg hover:bg-slate-800 transition flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4" /> {t.ctaRoi}
                </button>
                <button
                  onClick={() => setActivePage('marketplace')}
                  className="px-6 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-800 font-bold text-sm hover:bg-slate-100 transition flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-600" /> {t.ctaMarketplace}
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="glass-panel p-6 rounded-3xl shadow-2xl border-white relative overflow-hidden space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">SIH 2026 Problem Abstract</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80">
                  <p class="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">{t.problemHeading}</p>
                  <p className="text-xs font-bold text-slate-900 leading-relaxed">{t.problemDesc}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80">
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">{t.solutionHeading}</p>
                  <p className="text-xs font-bold text-slate-900 leading-relaxed">{t.solutionDesc}</p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-medium border-t border-slate-100">
                  <span>Cummins College of Engg. for Women, Nagpur</span>
                  <span className="font-bold text-emerald-700">NAAC A+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Solution Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span class="text-xs font-bold text-emerald-600 uppercase tracking-widest">Architectural Solution</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">{t.pillarsTitle}</h2>
          <p className="text-slate-600 mt-2 font-medium">An integrated end-to-end framework eliminating middleman friction</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-5 group-hover:bg-emerald-600 group-hover:text-white transition">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t.pillar1Title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">{t.pillar1Desc}</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition group">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-5 group-hover:bg-amber-600 group-hover:text-white transition">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t.pillar2Title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">{t.pillar2Desc}</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition group">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-5 group-hover:bg-blue-600 group-hover:text-white transition">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t.pillar3Title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">{t.pillar3Desc}</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition group">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-5 group-hover:bg-purple-600 group-hover:text-white transition">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t.pillar4Title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">{t.pillar4Desc}</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition group md:col-span-2 lg:col-span-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-5 group-hover:bg-emerald-600 group-hover:text-white transition">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{t.pillar5Title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">{t.pillar5Desc}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
