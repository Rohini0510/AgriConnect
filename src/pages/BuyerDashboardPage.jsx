import React, { useState } from 'react';
import { LayoutDashboard, Store, Layers, ShoppingBag, Gavel, Truck, DollarSign, BarChart2, User, Plus, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BuyerDashboardPage({ currentLang, setActivePage }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [product, setProduct] = useState('Tomatoes (Grade A)');
  const [quantity, setQuantity] = useState('500 kg');
  const [grade, setGrade] = useState('Grade A');
  const [location, setLocation] = useState('Nagpur');
  const [requiredDate, setRequiredDate] = useState('2026-09-22');
  const [budget, setBudget] = useState('₹18,000');
  const [formAlert, setFormAlert] = useState('');

  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'marketplace', label: 'Marketplace', icon: Store },
    { id: 'requirements', label: 'My Requirements', icon: Layers },
    { id: 'bulk-orders', label: 'Bulk Orders', icon: ShoppingBag },
    { id: 'bids', label: 'Bids & Auctions', icon: Gavel },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleCreateRequirement = (e) => {
    e.preventDefault();
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setFormAlert(`New Requirement for ${quantity} of ${product} created successfully! Added to Nagpur aggregation pool.`);
    setIsFormOpen(false);
    setTimeout(() => setFormAlert(''), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              Verified Bulk Buyer
            </span>
            <span className="text-xs text-slate-400 font-medium font-mono">ID: BUY-9901-NGP</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Sharma Restaurant Group Procurement</h1>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Requirement</span>
        </button>
      </div>

      {formAlert && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{formAlert}</span>
          </div>
        </div>
      )}

      {/* CREATE REQUIREMENT MODAL / FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 max-w-lg w-full space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-slate-900">Create New Produce Requirement</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateRequirement} className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-slate-700 mb-1">Select Product</label>
                <select value={product} onChange={(e) => setProduct(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-50">
                  <option value="Tomatoes (Grade A)">Tomatoes (Grade A)</option>
                  <option value="Potatoes (Grade A)">Potatoes (Grade A)</option>
                  <option value="Onions (Grade B)">Onions (Grade B)</option>
                  <option value="Nagpur Oranges">Nagpur Oranges</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1">Quantity</label>
                  <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-50" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Grade</label>
                  <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-50">
                    <option value="Grade A">Grade A</option>
                    <option value="Grade B">Grade B</option>
                    <option value="Grade C">Grade C</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 mb-1">Delivery Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-50" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1">Required Date</label>
                  <input type="date" value={requiredDate} onChange={(e) => setRequiredDate(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-50" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Budget Allocation</label>
                <input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full p-2.5 rounded-xl border bg-slate-50" />
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setIsFormOpen(false)} className="w-1/2 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold">Cancel</button>
                <button type="submit" className="w-1/2 py-2.5 rounded-xl bg-emerald-600 text-white font-black shadow-md">Post Requirement</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-2">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Buyer Portal Navigation
            </div>
            {sidebarLinks.map((link) => {
              const IconComp = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    if (link.id === 'marketplace') setActivePage('marketplace');
                    if (link.id === 'requirements') setActivePage('demand');
                    if (link.id === 'bids') setActivePage('auctions');
                    if (link.id === 'logistics') setActivePage('logistics');
                    if (link.id === 'payments') setActivePage('payments');
                    if (link.id === 'analytics') setActivePage('ai-demand');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Dashboard Main Widgets */}
        <main className="lg:col-span-9 space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Weekly Requirements</span>
              <div className="text-3xl font-black text-slate-900">1,050 kg</div>
              <span className="text-[10px] font-bold text-emerald-600 mt-1 block">Active in Nagpur Pool</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Active Orders</span>
              <div className="text-3xl font-black text-slate-900">4 Orders</div>
              <span className="text-[10px] font-bold text-blue-600 mt-1 block">1 In Transit</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Saved FPOs</span>
              <div className="text-3xl font-black text-slate-900">8 FPOs</div>
              <span className="text-[10px] font-bold text-purple-600 mt-1 block">Verified Partners</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Total Procurement</span>
              <div className="text-3xl font-black text-emerald-700">₹1,85,400</div>
              <span className="text-[10px] font-bold text-emerald-600 mt-1 block">Direct FPO Savings: 12%</span>
            </div>
          </div>

          {/* Active Requirements List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">My Active Requirements</h3>
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900">Organic Tomatoes (Grade A)</h4>
                  <p className="text-slate-500 font-semibold">500 kg/week • Nagpur Central Hub</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Pooled (Contracted @ ₹35/kg)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900">Fresh Potatoes (Grade A)</h4>
                  <p className="text-slate-500 font-semibold">300 kg/week • Nagpur Restaurant Kitchen</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  In Transit (Truck #NX205)
                </span>
              </div>
            </div>
          </div>

        </main>

      </div>
    </div>
  );
}
