import React from 'react';
import { Sprout, Github, Award, ArrowUpRight } from 'lucide-react';
import { translations } from '../data/translations';

export default function Footer({ currentLang, setActivePage }) {
  const t = translations[currentLang] || translations.en;

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-emerald-500/20">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="font-black text-2xl text-white tracking-tight">NEXORA</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              "Connecting farms directly to markets." <br />
              Nexora is an AI-powered digital SaaS marketplace eliminating agricultural intermediaries, maximizing farmer incomes, and streamlining pooled logistics.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-bold">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Smart India Hackathon 2026 Presentation Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><button onClick={() => setActivePage('marketplace')} className="hover:text-emerald-400 transition">Marketplace</button></li>
              <li><button onClick={() => setActivePage('auctions')} className="hover:text-emerald-400 transition">Live Auctions</button></li>
              <li><button onClick={() => setActivePage('demand')} className="hover:text-emerald-400 transition">Demand Aggregation</button></li>
              <li><button onClick={() => setActivePage('ai-demand')} className="hover:text-emerald-400 transition">AI Demand Intelligence</button></li>
              <li><button onClick={() => setActivePage('logistics')} className="hover:text-emerald-400 transition">Smart Logistics</button></li>
            </ul>
          </div>

          {/* Dashboards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Dashboards</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><button onClick={() => setActivePage('fpo-dash')} className="hover:text-emerald-400 transition">Farmer & FPO Dashboard</button></li>
              <li><button onClick={() => setActivePage('buyer-dash')} className="hover:text-emerald-400 transition">Buyer Procurement</button></li>
              <li><button onClick={() => setActivePage('admin')} className="hover:text-emerald-400 transition">Admin Panel</button></li>
              <li><button onClick={() => setActivePage('payments')} className="hover:text-emerald-400 transition">Digital Settlements</button></li>
              <li><button onClick={() => setActivePage('mandi')} className="hover:text-emerald-400 transition">Mandi Price Index</button></li>
            </ul>
          </div>

          {/* Onboarding & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Onboarding & Legal</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><button onClick={() => setActivePage('fpo-onboarding')} className="hover:text-emerald-400 transition">FPO Registration Flow</button></li>
              <li><button onClick={() => setActivePage('team')} className="hover:text-emerald-400 transition">About Nexora</button></li>
              <li><a href="#" className="hover:text-emerald-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">Contact Support</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          <p className="text-slate-500 text-center sm:text-left">
            © 2026 NEXORA • Smart India Hackathon 2026. All rights reserved.
          </p>
          <a
            href="https://github.com/Rohini0510/AgriConnect.git"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold border border-slate-800 transition"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Codebase</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </div>
      </div>
    </footer>
  );
}
