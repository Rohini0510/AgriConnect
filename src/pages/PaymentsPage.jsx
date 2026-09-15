import React from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Download, ArrowUpRight, QrCode } from 'lucide-react';

const MOCK_PAYMENTS = [
  {
    id: 'TXN-9021',
    batchId: 'BATCH-101',
    buyer: 'Pune Retailers Direct Pool',
    fpo: 'Sahyadri Farmers Producer Co.',
    amount: '₹97,500',
    date: '2026-09-14',
    status: 'SETTLED_3_DAYS',
    qrCodeUrl: 'QR-VERIFIED'
  },
  {
    id: 'TXN-9022',
    batchId: 'BATCH-102',
    buyer: 'Mumbai Restaurant Group',
    fpo: 'Narayangaon Vegetable FPO',
    amount: '₹3,42,000',
    date: '2026-09-13',
    status: 'SETTLED_3_DAYS',
    qrCodeUrl: 'QR-VERIFIED'
  },
  {
    id: 'TXN-9023',
    batchId: 'BATCH-103',
    buyer: 'Nagpur Supermarket Chain',
    fpo: 'Vidarbha Agro Producer Co.',
    amount: '₹1,72,125',
    date: '2026-09-15',
    status: 'ESCROW_PROCESSING',
    qrCodeUrl: 'QR-VERIFIED'
  }
];

export default function PaymentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">3-Day Fast Digital Settlements</span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">Payments & QR Receipt Ledger</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Transparent escrow bank transfers cutting turnaround time from 14 days down to 3 days
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Settled Volume</p>
          <p className="text-3xl font-black text-emerald-600">₹6,11,625</p>
          <p className="text-[11px] text-slate-500 font-medium">Direct FPO Bank Settlements</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase">Average Payment Speed</p>
          <p className="text-3xl font-black text-amber-600">2.8 Days</p>
          <p className="text-[11px] text-slate-500 font-medium">vs 14 Days Mandi Baseline</p>
        </div>

        <div className="p-6 rounded-3xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 space-y-1">
          <p className="text-xs font-bold text-emerald-200 uppercase">Escrow Safety Guarantee</p>
          <p className="text-2xl font-black">100% Guaranteed</p>
          <p className="text-[11px] text-emerald-100 font-medium">Automated Release on QR Receipt Scan</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm overflow-x-auto space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Recent Bank Settlement Logs</h2>

        <table className="w-full text-left text-xs font-medium text-slate-700">
          <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100">
            <tr>
              <th className="p-3">Txn ID</th>
              <th className="p-3">Produce Batch</th>
              <th className="p-3">FPO Recipient</th>
              <th className="p-3">Buyer</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_PAYMENTS.map((pay) => (
              <tr key={pay.id} className="hover:bg-slate-50/80 transition">
                <td className="p-3 font-bold text-slate-900">{pay.id}</td>
                <td className="p-3 font-semibold text-emerald-700">{pay.batchId}</td>
                <td className="p-3">{pay.fpo}</td>
                <td className="p-3">{pay.buyer}</td>
                <td className="p-3 font-black text-slate-900">{pay.amount}</td>
                <td className="p-3">
                  {pay.status === 'SETTLED_3_DAYS' ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Settled (3 Days)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] inline-flex items-center gap-1">
                      Escrow Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
