import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';

export default function PitchModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-emerald-600 uppercase">SIH 2026 Pitch Deck Summary</span>
          <h3 class="text-2xl font-black">AgriConnect Presentation Highlights</h3>
        </div>

        <div className="space-y-4 text-sm font-medium">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900 text-base">Slide 1: Problem Statement & Team Details</h4>
            <p className="text-slate-600 text-xs">
              SIH26033: Multiple intermediaries reduce farmers earnings and increase consumer prices. Theme: Agriculture, FoodTech & Rural Development. Team Nexora, Cummins College of Engineering for Women, Nagpur.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900 text-base">Slide 2: Proposed Solution Pillars</h4>
            <p className="text-slate-600 text-xs">
              FPO Onboarding & capacity building, Demand aggregation pooling, Shared logistics load consolidation, Transparent time-bound auction price discovery (eNAM/Agmarknet), Unified digital workflow.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900 text-base">Slide 3: Technical Architecture & Tech Stack</h4>
            <p className="text-slate-600 text-xs">
              React Native & Next.js Frontend, Node.js / Laravel REST APIs with JWT role-based security, MySQL/PostgreSQL DB, AI/Analytics demand & route optimization engine.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900 text-base">Slide 4 & 5: Feasibility, Viability & Benefits</h4>
            <p className="text-slate-600 text-xs">
              Raises net farmer price realization from ~60% to ~75%, cuts logistics cost by 25%, reduces post-harvest loss from 18% to 10%, and reduces payment turnaround from 14 days to 3 days.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900 text-base">Slide 6: Research & Academic Evidence</h4>
            <p className="text-slate-600 text-xs">
              Cites Emerald Journal 2023 (+₹7,254 - ₹8,133 annual return), Punjab FPO study (+15.71% income), Bihar Bhojpur study (+30.6% income rise), and Meghalaya FPO cases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
