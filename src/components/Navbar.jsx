import React from 'react';
import { Sprout, Languages, FileText } from 'lucide-react';
import { translations } from '../data/translations';

export default function Navbar({ currentLang, setCurrentLang, activePage, setActivePage, onOpenPitchModal }) {
  const t = translations[currentLang] || translations.en;

  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'marketplace', label: t.navMarketplace },
    { id: 'simulator', label: t.navSimulator },
    { id: 'calculators', label: t.navCalculators },
    { id: 'analytics', label: t.navAnalytics },
    { id: 'team', label: t.navTeam },
  ];

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-200/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setActivePage('home')}
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">{t.brand}</span>
            <span className="block text-xs font-semibold text-emerald-600">{t.sihBadge}</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === item.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-200/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Language Switcher & Pitch Deck */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 rounded-xl px-2.5 py-1.5 border border-slate-200">
            <Languages className="w-4 h-4 text-slate-500 mr-2" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>

          <button
            onClick={onOpenPitchModal}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-lg hover:bg-slate-800 transition"
          >
            <FileText className="w-4 h-4" /> Pitch Deck
          </button>
        </div>
      </div>
    </header>
  );
}
