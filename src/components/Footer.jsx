import React from 'react';
import { Sprout, Github } from 'lucide-react';
import { translations } from '../data/translations';

export default function Footer({ currentLang }) {
  const t = translations[currentLang] || translations.en;

  return (
    <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="font-bold text-white text-sm">{t.brand}</span>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          {t.footerCopy}
        </p>
        <a
          href="https://github.com/Rohini0510/AgriConnect.git"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1.5"
        >
          <Github className="w-4 h-4" /> GitHub Repository
        </a>
      </div>
    </footer>
  );
}
