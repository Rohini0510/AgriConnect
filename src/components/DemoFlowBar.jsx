import React, { useState } from 'react';
import { Play, CheckCircle, ChevronRight, RefreshCw, Zap } from 'lucide-react';

export default function DemoFlowBar({ currentStep, setCurrentStep, setActivePage }) {
  const steps = [
    { id: 1, title: '1. FPO Registration', page: 'fpo-onboarding', desc: 'Onboard Sahyadri FPO & verify KYC' },
    { id: 2, title: '2. Add Farmers', page: 'fpo-onboarding', desc: 'Add 120 member farmers to directory' },
    { id: 3, title: '3. Add Produce', page: 'fpo-dash', desc: 'List 5.0 Tonnes Grade-A Tomatoes' },
    { id: 4, title: '4. AI Demand Forecast', page: 'ai-demand', desc: 'Predict +18% demand in Nagpur' },
    { id: 5, title: '5. Buyer Requirement', page: 'buyer-dash', desc: 'Sharma Resto submits 500kg order' },
    { id: 6, title: '6. Demand Aggregation', page: 'demand', desc: 'Combine 25 buyers = 4.5T bulk order' },
    { id: 7, title: '7. Price Discovery / Auction', page: 'auctions', desc: 'Live auction starts @ ₹30/kg' },
    { id: 8, title: '8. Buyer Places Bid', page: 'auctions', desc: 'Highest bid reached @ ₹36/kg' },
    { id: 9, title: '9. Order Confirmation', page: 'fpo-dash', desc: 'FPO confirms bulk order sale' },
    { id: 10, title: '10. AI Route Optimization', page: 'logistics', desc: 'Pooled truck route cuts cost 25%' },
    { id: 11, title: '11. Produce Delivery', page: 'logistics', desc: 'Truck #NX204 delivers to hub' },
    { id: 12, title: '12. Digital Payment', page: 'payments', desc: 'Instant 3-day escrow settlement' },
    { id: 13, title: '13. Farmer Dashboard', page: 'fpo-dash', desc: 'Farmer earnings reflect +22% gain' },
  ];

  const handleStepClick = (step) => {
    setCurrentStep(step.id);
    setActivePage(step.page);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      const nextStep = steps.find(s => s.id === currentStep + 1);
      setCurrentStep(nextStep.id);
      setActivePage(nextStep.page);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setActivePage('fpo-onboarding');
  };

  const activeStepObj = steps.find(s => s.id === currentStep) || steps[0];

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white border-b border-emerald-800 shadow-lg py-2.5 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-800/80 rounded-lg text-emerald-200 text-xs font-bold border border-emerald-700">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>SIH 2026 Core Flow Demo:</span>
          </div>
          <span className="text-xs font-bold text-white bg-emerald-700/60 px-2 py-0.5 rounded-md">
            Step {currentStep} / {steps.length}
          </span>
        </div>

        {/* Current Active Step info */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1 scrollbar-none max-w-full">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step)}
                title={step.desc}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition flex items-center gap-1 border ${
                  isCurrent
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-md font-extrabold scale-105'
                    : isCompleted
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                ) : (
                  <span>{step.id}.</span>
                )}
                <span>{step.title.split('. ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Next / Reset Controller */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Reset Core Demo Flow"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentStep >= steps.length}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
              currentStep >= steps.length
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold shadow-md'
            }`}
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description Tooltip Banner */}
      <div className="max-w-7xl mx-auto mt-1 flex items-center justify-between text-[11px] text-emerald-200/90 border-t border-emerald-800/60 pt-1">
        <span className="font-semibold text-amber-300 flex items-center gap-1">
          📌 Active Demo Stage: <span className="text-white font-bold">{activeStepObj.title}</span> — {activeStepObj.desc}
        </span>
        <span className="hidden sm:inline text-slate-400 text-[10px]">Click any step to inspect corresponding platform module</span>
      </div>
    </div>
  );
}
