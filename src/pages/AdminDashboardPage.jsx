import React, { useState } from 'react';
import { ShieldCheck, Users, Store, ShoppingBag, DollarSign, Truck, BarChart3, TrendingUp, Layers, CheckCircle2, Award } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function AdminDashboardPage({ currentLang, setActivePage }) {
  const [activeTab, setActiveTab] = useState('overview');

  const adminTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'farmers', label: 'Farmers (1,420)' },
    { id: 'fpos', label: 'FPOs (250)' },
    { id: 'buyers', label: 'Buyers (1,400)' },
    { id: 'products', label: 'Products' },
    { id: 'auctions', label: 'Auctions' },
    { id: 'orders', label: 'Orders' },
    { id: 'payments', label: 'Payments' },
    { id: 'logistics', label: 'Logistics' },
    { id: 'reports', label: 'SIH 2026 Reports' },
  ];

  const transactionData = [
    { month: 'Jan', volume: 1.2 },
    { month: 'Feb', volume: 1.8 },
    { month: 'Mar', volume: 2.5 },
    { month: 'Apr', volume: 3.4 },
    { month: 'May', volume: 4.8 },
    { month: 'Jun', volume: 6.2 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight">NEXORA Admin Control Panel</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-slate-950 uppercase">SuperAdmin</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">Smart India Hackathon 2026 Platform Administration</p>
          </div>
        </div>
      </div>

      {/* ADMIN TOP OVERVIEW METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 block">Total Farmers</span>
          <span className="text-xl font-black text-slate-900">1,420</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 block">Total FPOs</span>
          <span className="text-xl font-black text-slate-900">250</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 block">Active Buyers</span>
          <span className="text-xl font-black text-slate-900">1,400</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 block">Active Orders</span>
          <span className="text-xl font-black text-slate-900">84</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 block">Trade Volume</span>
          <span className="text-xl font-black text-emerald-700">₹6.2 Cr</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 block">Logistics Saved</span>
          <span className="text-xl font-black text-blue-700">₹42.8 L</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 block">Avg Farmer Price</span>
          <span className="text-xl font-black text-emerald-800">₹36/kg</span>
        </div>
      </div>

      {/* MANAGEMENT TABS */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 flex gap-1 overflow-x-auto scrollbar-none text-xs font-bold">
        {adminTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
              activeTab === t.id ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TRANSACTION VOLUME CHART */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">Platform Transaction Volume (₹ Crores)</h3>
            <p className="text-xs text-slate-500 font-medium">Monthly growth across all FPO direct contracts</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            +48% YoY Growth
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="volume" name="Volume (₹ Cr)" stroke="#059669" fill="#10b981" fillOpacity={0.2} strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MANAGEMENT ENTITIES TABLE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4">
        <h3 className="text-base font-extrabold text-slate-900">Registered FPOs Management</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 px-3">FPO Name</th>
                <th className="pb-3 px-3">Registration #</th>
                <th className="pb-3 px-3">Region Hub</th>
                <th className="pb-3 px-3">Members</th>
                <th className="pb-3 px-3">Total Volume</th>
                <th className="pb-3 px-3">KYC Status</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-slate-700">
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-3 font-extrabold text-slate-900">Sahyadri Farmer Producer Co.</td>
                <td className="py-3 px-3 font-mono">FPO-MH-2024-889</td>
                <td className="py-3 px-3">Nagpur</td>
                <td className="py-3 px-3 font-bold">120 Farmers</td>
                <td className="py-3 px-3 font-extrabold text-emerald-700">₹84.2 Lakhs</td>
                <td className="py-3 px-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Verified</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-3 font-extrabold text-slate-900">Green Valley FPO</td>
                <td className="py-3 px-3 font-mono">FPO-MH-2023-412</td>
                <td className="py-3 px-3">Amravati</td>
                <td className="py-3 px-3 font-bold">95 Farmers</td>
                <td className="py-3 px-3 font-extrabold text-emerald-700">₹62.5 Lakhs</td>
                <td className="py-3 px-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Verified</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-3 font-extrabold text-slate-900">Wardha Agro Producer Co.</td>
                <td className="py-3 px-3 font-mono">FPO-MH-2024-901</td>
                <td className="py-3 px-3">Wardha</td>
                <td className="py-3 px-3 font-bold">140 Farmers</td>
                <td className="py-3 px-3 font-extrabold text-emerald-700">₹98.0 Lakhs</td>
                <td className="py-3 px-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Verified</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
