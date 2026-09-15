import React from 'react';
import { ArrowRight, Sprout, TrendingUp, Truck, ShieldCheck, DollarSign, Users, Award, CheckCircle2, ChevronRight, Zap, RefreshCw, BarChart3 } from 'lucide-react';
import { translations } from '../data/translations';

export default function HomePage({ currentLang, setActivePage }) {
  const t = translations[currentLang] || translations.en;

  const stats = [
    { value: '15–25%', label: 'Increase in Farmer Income', icon: TrendingUp, color: 'emerald' },
    { value: '25%', label: 'Lower Logistics Cost', icon: Truck, color: 'teal' },
    { value: '18% → 10%', label: 'Post-Harvest Loss Reduction', icon: ShieldCheck, color: 'blue' },
    { value: '14 → 3 Days', label: 'Harvest-to-Payment Settlement', icon: DollarSign, color: 'purple' },
  ];

  const steps = [
    { num: '1', title: 'Onboard FPO', desc: 'Verify credentials, digitize member farmer directory, and access multilingual training.' },
    { num: '2', title: 'Aggregate Demand', desc: 'Pool weekly produce requirements from retailers, restaurants, and bulk buyers in city hubs.' },
    { num: '3', title: 'Discover Fair Prices', desc: 'Transparent market-linked rates powered by live Mandi data and time-bound digital auctions.' },
    { num: '4', title: 'Pool Logistics', desc: 'AI-optimized route planning and shared transport consolidation reduces freight costs by 25%.' },
    { num: '5', title: 'Receive Digital Payment', desc: 'Guaranteed 3-day direct bank settlement following instant quality verification.' },
  ];

  const whyCards = [
    { title: 'Fair Prices', desc: 'Transparent, market-linked pricing eliminating broker commissions.', icon: DollarSign, bg: 'from-emerald-50 to-teal-50 border-emerald-200' },
    { title: 'Direct Buyers', desc: 'Connect directly with retailers, restaurants and bulk buyers nationwide.', icon: Users, bg: 'from-blue-50 to-indigo-50 border-blue-200' },
    { title: 'Smart Logistics', desc: 'AI-powered route optimization and shared transportation networks.', icon: Truck, bg: 'from-purple-50 to-pink-50 border-purple-200' },
    { title: 'Predictable Demand', desc: 'AI demand forecasting helps FPOs plan crop supply and lower harvest risk.', icon: BarChart3, bg: 'from-amber-50 to-orange-50 border-amber-200' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950 text-white pt-20 pb-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Smart India Hackathon 2026 Agriculture Solution</span>
              </div>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.15]">
                From Farm to Market, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                  Without the Middlemen.
                </span>
              </h1>

              <p className="text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
                Nexora connects farmers and FPOs directly with buyers through transparent pricing, intelligent demand forecasting and pooled logistics.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => setActivePage('fpo-onboarding')}
                  className="px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>Start Selling</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setActivePage('marketplace')}
                  className="px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition flex items-center gap-2"
                >
                  <span>Explore Marketplace</span>
                  <ChevronRight className="w-5 h-5 text-emerald-400" />
                </button>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-6 border-t border-slate-800/80 flex items-center gap-6 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>eNAM & Agmarknet Synced</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Guaranteed 3-Day Escrow</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>250+ FPOs Onboarded</span>
                </div>
              </div>
            </div>

            {/* Right Hero Ecosystem Visual */}
            <div className="lg:col-span-5 relative">
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Nexora Unified Ecosystem</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* Ecosystem Flow Diagram */}
                <div className="space-y-4">
                  {/* Node 1: Farmer */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                        🧑‍🌾
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">1. Farmer / Producer</h4>
                        <p className="text-[11px] text-slate-400">Harvests Grade-A Produce</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-300 text-[10px] font-bold">Origin</span>
                  </div>

                  {/* Connecting Line 1 */}
                  <div className="flex justify-center -my-1">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-amber-400 to-emerald-400 animate-pulse" />
                  </div>

                  {/* Node 2: FPO */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        🏬
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">2. FPO Aggregator</h4>
                        <p className="text-[11px] text-slate-400">Quality Grading & Lot Creation</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-bold">Sahyadri FPO</span>
                  </div>

                  {/* Connecting Line 2 */}
                  <div className="flex justify-center -my-1">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 animate-pulse" />
                  </div>

                  {/* Node 3: Nexora SaaS Hub */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900/90 to-teal-900/90 border border-emerald-500/40 flex items-center justify-between shadow-xl ring-2 ring-emerald-500/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                        <Sprout className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white">3. NEXORA Digital Platform</h4>
                        <p className="text-[11px] text-emerald-200">AI Price Auction & Route Optimizer</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">Core Engine</span>
                  </div>

                  {/* Connecting Line 3 */}
                  <div className="flex justify-center -my-1">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-teal-400 to-blue-400 animate-pulse" />
                  </div>

                  {/* Node 4: Buyer */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                        🛒
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">4. Retailer / Restaurant</h4>
                        <p className="text-[11px] text-slate-400">Direct Purchase & Bid Winning</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-300 text-[10px] font-bold">Sharma Resto</span>
                  </div>

                  {/* Connecting Line 4 */}
                  <div className="flex justify-center -my-1">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-blue-400 to-purple-400 animate-pulse" />
                  </div>

                  {/* Node 5: Delivery */}
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                        🚚
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">5. Pooled Express Logistics</h4>
                        <p className="text-[11px] text-slate-400">25% Cost Reduction Delivery</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-300 text-[10px] font-bold">Truck #NX204</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Quantifiable Impact Model</h2>
          <p className="text-xs text-slate-500 font-medium">Derived from verified Indian agriculture FPO pilot benchmarks</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg hover:shadow-xl transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <IconComp className="w-6 h-6" />
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-slate-600 leading-snug">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How Nexora Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-100/70 p-10 rounded-3xl border border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Streamlined Process</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">How Nexora Works</h2>
          <p className="text-sm text-slate-600 mt-2 font-medium">A complete 5-step digital transformation from harvest to bank payment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-400 transition">
              <div>
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-3">
                  {step.num}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{step.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] font-bold text-emerald-600">
                <span>View Module</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Nexora? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Core Advantages</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">Why Nexora?</h2>
          <p className="text-sm text-slate-600 mt-2 font-medium">Empowering Indian agriculture with cutting-edge tech infrastructure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyCards.map((card, i) => {
            const IconComp = card.icon;
            return (
              <div key={i} className={`p-6 rounded-3xl bg-gradient-to-br ${card.bg} border shadow-md hover:shadow-lg transition`}>
                <div className="w-12 h-12 rounded-2xl bg-white text-slate-900 flex items-center justify-center shadow-md mb-4">
                  <IconComp className="w-6 h-6 text-emerald-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Direct Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-slate-900 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Ready to transform your agricultural trade?</h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Join 250+ FPOs and 1,400+ verified bulk buyers on India's premier AgriTech SaaS platform.
            </p>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <button
              onClick={() => setActivePage('fpo-onboarding')}
              className="px-6 py-3.5 rounded-2xl bg-white text-slate-950 font-black text-xs hover:bg-slate-100 shadow-lg transition"
            >
              Onboard Your FPO
            </button>
            <button
              onClick={() => setActivePage('demand')}
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition"
            >
              Post Buyer Requirement
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
