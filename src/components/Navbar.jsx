import React from 'react';
import { Sprout, Languages, Bell, UserCheck, ArrowRight, ShieldCheck, ChevronDown } from 'lucide-react';
import { translations } from '../data/translations';

export default function Navbar({
  currentLang,
  setCurrentLang,
  activePage,
  setActivePage,
  userRole,
  setUserRole,
  onOpenNotifications,
  unreadCount = 3
}) {
  const t = translations[currentLang] || translations.en;

  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'marketplace', label: t.navMarketplace },
    { id: 'auctions', label: t.navAuctions },
    { id: 'demand', label: t.navDemand },
    { id: 'ai-demand', label: t.navAi },
    { id: 'logistics', label: t.navLogistics },
    { id: 'mandi', label: t.navMandi },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActivePage('home')}
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900 tracking-tight">{t.brand}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                SaaS v2.6
              </span>
            </div>
            <span className="block text-[11px] font-bold text-emerald-600">{t.sihBadge}</span>
          </div>
        </div>

        {/* Desktop Main Navigation */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === item.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-200/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2.5">
          {/* Dashboard Dropdown Shortcuts */}
          <div className="hidden sm:flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={() => setActivePage('fpo-dash')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activePage === 'fpo-dash' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              FPO
            </button>
            <button
              onClick={() => setActivePage('buyer-dash')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activePage === 'buyer-dash' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Buyer
            </button>
            <button
              onClick={() => setActivePage('admin')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activePage === 'admin' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Multilingual Selector */}
          <div className="flex items-center bg-slate-100 rounded-2xl px-3 py-2 border border-slate-200">
            <Languages className="w-4 h-4 text-emerald-600 mr-1.5" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (HI)</option>
              <option value="mr">मराठी (MR)</option>
            </select>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => setActivePage('fpo-onboarding')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition transform active:scale-95"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
