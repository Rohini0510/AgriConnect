import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Home, ShoppingBag, CreditCard, Truck, Users, Sun, CheckCircle2 } from 'lucide-react';
import { translations } from '../data/translations';

export default function MobileSimulatorPage({ currentLang }) {
  const t = translations[currentLang] || translations.en;
  const [committedKg, setCommittedKg] = useState(0);
  const [toastMsg, setToastMsg] = useState(null);

  const targetKg = 2500; // 2.5 Tons

  const handleSupply = (amount) => {
    const nextVal = committedKg + amount;
    setCommittedKg(nextVal);
    setToastMsg(`${t.suppliedSuccess || 'Offer submitted for'} ${amount} kg!`);

    setTimeout(() => {
      setToastMsg(null);
    }, 3000);

    if (nextVal >= targetKg) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
    }
  };

  const progressPercent = Math.min(100, Math.round((committedKg / targetKg) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          <div>
            <p className="text-xs font-bold">{toastMsg}</p>
            <p className="text-[10px] text-slate-400">Order logged into AgriConnect Direct Pool</p>
          </div>
        </div>
      )}

      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Interactive Prototype</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">{t.appDemoTitle}</h1>
        <p className="text-slate-600 mt-2 font-medium">{t.appDemoSub}</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-center">
        {/* Phone Frame Mockup */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="phone-mockup">
            <div className="phone-notch"></div>
            <div className="phone-screen text-slate-800">
              {/* Mobile App Header */}
              <div className="bg-emerald-700 text-white p-4 pt-7 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">AG</div>
                    <div>
                      <p className="font-bold text-sm leading-none">{t.brand}</p>
                      <p className="text-[10px] text-emerald-200">{t.fpoName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] bg-emerald-800/60 px-2 py-0.5 rounded-full">{t.weather}</p>
                  </div>
                </div>
              </div>

              {/* Mobile App Main Content */}
              <div className="p-3.5 space-y-3">
                {/* Greeting Card */}
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{t.greeting}</h4>
                    <p className="text-[11px] text-slate-500">Today's Crop Rates (Narayangaon Hub)</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xs">
                    <Sun className="w-4 h-4" />
                  </div>
                </div>

                {/* Mandi Ticker */}
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs pb-1 border-b border-slate-100">
                    <span className="font-bold text-slate-800">{t.tomatoName}</span>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600 text-xs">{t.tomatoRate}</span>
                      <span className="block text-[9px] text-emerald-500 font-semibold">{t.tomatoDiff}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{t.onionName}</span>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600 text-xs">{t.onionRate}</span>
                      <span className="block text-[9px] text-slate-400">{t.onionDiff}</span>
                    </div>
                  </div>
                </div>

                {/* Urgent Demand Banner (Slide 5 Feature) */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-3.5 rounded-2xl shadow-md space-y-2 relative overflow-hidden">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                    <span className="bg-amber-700/60 px-2 py-0.5 rounded-full">{t.urgentDemandHeader}</span>
                  </div>
                  <h4 className="font-bold text-xs">{t.urgentDemandTitle}</h4>
                  <p className="text-[11px] text-amber-100">{t.urgentDemandDesc}</p>
                  <p className="text-xs font-bold text-white bg-black/20 p-1.5 rounded-lg inline-block">{t.netOffer}</p>

                  {/* Supply Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px]">
                      <span>{committedKg} / {targetKg} kg Committed ({progressPercent}%)</span>
                    </div>
                    <div className="w-full bg-amber-700/50 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-white h-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Quick Supply Buttons */}
                  <div className="pt-2 flex gap-1.5">
                    <button
                      onClick={() => handleSupply(200)}
                      className="flex-1 bg-white text-amber-800 font-extrabold text-[11px] py-1.5 rounded-lg shadow active:scale-95 transition"
                    >
                      {t.supply200}
                    </button>
                    <button
                      onClick={() => handleSupply(500)}
                      className="flex-1 bg-white text-amber-800 font-extrabold text-[11px] py-1.5 rounded-lg shadow active:scale-95 transition"
                    >
                      {t.supply500}
                    </button>
                    <button
                      onClick={() => handleSupply(1000)}
                      className="flex-1 bg-white text-amber-800 font-extrabold text-[11px] py-1.5 rounded-lg shadow active:scale-95 transition"
                    >
                      {t.supply1000}
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-around text-[10px] font-bold text-slate-500">
                <div className="text-emerald-600 flex flex-col items-center">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Sales</span>
                </div>
                <div className="flex flex-col items-center">
                  <CreditCard className="w-4 h-4" />
                  <span>Pay</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="w-4 h-4" />
                  <span>Logistics</span>
                </div>
                <div className="flex flex-col items-center">
                  <Users className="w-4 h-4" />
                  <span>FPO</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Explanations */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Slide 5 Interface Highlights</h3>
            <ul className="space-y-4 text-sm text-slate-600 font-medium">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                <span><strong class="text-slate-900">Multilingual Switcher:</strong> Accessible in English, Hindi, and Marathi for low-digital literacy hand-holding.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
                <span><strong className="text-slate-900">Rate Discovery:</strong> Real-time comparison between traditional mandi rates and AgriConnect direct pool offers.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
                <span><strong className="text-slate-900">1-Tap Commitments:</strong> Farmers can tap <code className="bg-slate-100 px-1.5 py-0.5 rounded text-amber-700">+200kg</code> or <code className="bg-slate-100 px-1.5 py-0.5 rounded text-amber-700">+500kg</code> to immediately fulfill city-wide demand pools.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
