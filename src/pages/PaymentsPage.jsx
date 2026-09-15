import React, { useState } from 'react';
import { DollarSign, CheckCircle2, Clock, ShieldCheck, ArrowUpRight, ArrowDownRight, Filter, Download } from 'lucide-react';

export default function PaymentsPage({ currentLang, setActivePage }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const transactions = [
    { id: 'ORD-NX-901', buyer: 'Sharma Restaurant Group', amount: '₹18,000', date: '2026-09-15', status: 'Paid', statusBg: 'bg-emerald-100 text-emerald-800' },
    { id: 'ORD-NX-902', buyer: 'Nagpur Fresh Retail Mart', amount: '₹31,200', date: '2026-09-14', status: 'Processing', statusBg: 'bg-blue-100 text-blue-800' },
    { id: 'ORD-NX-903', buyer: 'Metro Food Supplies', amount: '₹56,000', date: '2026-09-12', status: 'Paid', statusBg: 'bg-emerald-100 text-emerald-800' },
    { id: 'ORD-NX-904', buyer: 'Akola Fresh Mart', amount: '₹71,200', date: '2026-09-10', status: 'Paid', statusBg: 'bg-emerald-100 text-emerald-800' },
    { id: 'ORD-NX-905', buyer: 'Vidarbha Caterers', amount: '₹38,500', date: '2026-09-08', status: 'Pending', statusBg: 'bg-amber-100 text-amber-800' },
    { id: 'ORD-NX-906', buyer: 'Pune Wholesale Group', amount: '₹30,900', date: '2026-09-05', status: 'Paid', statusBg: 'bg-emerald-100 text-emerald-800' },
  ];

  const filtered = activeFilter === 'All'
    ? transactions
    : transactions.filter(t => t.status === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Automated Escrow Settlements</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Digital Payments & Settlement Tracking</h1>
          <p className="text-xs text-slate-500 font-medium">Instant 3-day guaranteed bank transfers following quality verification</p>
        </div>

        <button
          onClick={() => alert('Downloading Escrow Settlement Statement PDF...')}
          className="px-4 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Statement</span>
        </button>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
          <span className="text-xs font-bold text-slate-400 block mb-1">Total Gross Earnings</span>
          <div className="text-3xl font-black text-slate-900">₹2,45,800</div>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4" /> +22% vs Traditional Mandi
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
          <span className="text-xs font-bold text-slate-400 block mb-1">Pending Payments</span>
          <div className="text-3xl font-black text-amber-600">₹38,500</div>
          <span className="text-xs font-medium text-slate-500 mt-2 block">Escrow verification in progress</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
          <span className="text-xs font-bold text-slate-400 block mb-1">Completed Payments</span>
          <div className="text-3xl font-black text-emerald-700">₹2,07,300</div>
          <span className="text-xs font-semibold text-emerald-600 mt-2 block">Settled directly to Bank Account</span>
        </div>
      </div>

      {/* DIGITAL SETTLEMENT TIMELINE */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-950 p-8 rounded-3xl text-white shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
          <h2 className="text-xl font-black text-white">Digital Settlement Timeline</h2>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
            Guaranteed 3-Day Cycle
          </span>
        </div>

        {/* Horizontal Timeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center mx-auto">
              1
            </div>
            <h4 className="text-xs font-bold text-white">Order Confirmed</h4>
            <p className="text-[11px] text-slate-400 font-medium">Buyer locks funds into Escrow</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center mx-auto">
              2
            </div>
            <h4 className="text-xs font-bold text-white">Produce Delivered</h4>
            <p className="text-[11px] text-slate-400 font-medium">Truck arrives at destination hub</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center mx-auto">
              3
            </div>
            <h4 className="text-xs font-bold text-white">Quality Verified</h4>
            <p className="text-[11px] text-slate-400 font-medium">Digital grading score checked</p>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold space-y-2 shadow-lg">
            <div className="w-9 h-9 rounded-full bg-white text-emerald-800 font-black text-sm flex items-center justify-center mx-auto">
              4
            </div>
            <h4 className="text-xs font-black text-white">Payment Released</h4>
            <p className="text-[11px] text-emerald-100 font-medium">Instant transfer to FPO Bank</p>
          </div>

        </div>
      </div>

      {/* TRANSACTION TABLE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-base font-extrabold text-slate-900">Settlement Transactions</h3>

          {/* Status Filter */}
          <div className="flex gap-1.5 text-xs font-bold">
            {['All', 'Paid', 'Processing', 'Pending'].map((st) => (
              <button
                key={st}
                onClick={() => setActiveFilter(st)}
                className={`px-3 py-1.5 rounded-xl transition ${
                  activeFilter === st ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 px-3">Order ID</th>
                <th className="pb-3 px-3">Buyer Name</th>
                <th className="pb-3 px-3">Amount</th>
                <th className="pb-3 px-3">Transaction Date</th>
                <th className="pb-3 px-3">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-slate-700">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-3 font-bold text-slate-900">{t.id}</td>
                  <td className="py-3.5 px-3 font-semibold text-slate-800">{t.buyer}</td>
                  <td className="py-3.5 px-3 font-extrabold text-slate-900">{t.amount}</td>
                  <td className="py-3.5 px-3 text-slate-500">{t.date}</td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${t.statusBg}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
