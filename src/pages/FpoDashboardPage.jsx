import React, { useState } from 'react';
import {
  LayoutDashboard, ShoppingBag, ShoppingCart, Gavel, TrendingUp, Truck, DollarSign,
  Store, Users, Bell, User, ArrowUpRight, ArrowDownRight, ChevronRight, CheckCircle2, Clock
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function FpoDashboardPage({ currentLang, setActivePage }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [forecastRange, setForecastRange] = useState('14');

  // Sidebar Links
  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'produce', label: 'My Produce', icon: ShoppingBag },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'auctions', label: 'Auctions', icon: Gavel },
    { id: 'forecast', label: 'Demand Forecast', icon: TrendingUp },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'prices', label: 'Market Prices', icon: Store },
    { id: 'farmers', label: 'Farmers Directory', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'FPO Profile', icon: User },
  ];

  // Recharts Data for Demand Forecast (7/14/30 days)
  const demandData14Days = [
    { day: 'Day 1', demand: 2.1, forecast: 2.3 },
    { day: 'Day 3', demand: 2.5, forecast: 2.8 },
    { day: 'Day 5', demand: 2.8, forecast: 3.1 },
    { day: 'Day 7', demand: 3.2, forecast: 3.5 },
    { day: 'Day 9', demand: 3.0, forecast: 3.6 },
    { day: 'Day 11', demand: 3.4, forecast: 4.0 },
    { day: 'Day 14', demand: 3.8, forecast: 4.2 },
  ];

  // Price comparison data: Local Mandi vs eNAM vs Nexora
  const priceTrendsData = [
    { month: 'Week 1', localMandi: 31, eNam: 32, nexora: 35 },
    { month: 'Week 2', localMandi: 32, eNam: 33, nexora: 36 },
    { month: 'Week 3', localMandi: 30, eNam: 32, nexora: 36 },
    { month: 'Week 4', localMandi: 33, eNam: 34, nexora: 37 },
  ];

  // Recent Orders table
  const recentOrders = [
    { id: 'ORD-901', buyer: 'Sharma Restaurant Group', product: 'Premium Tomato (Grade A)', quantity: '500 kg', price: '₹36/kg', total: '₹18,000', status: 'Confirmed', statusBg: 'bg-emerald-100 text-emerald-800' },
    { id: 'ORD-902', buyer: 'Nagpur Fresh Retail Mart', product: 'Organic Potato (Grade A)', quantity: '1.2 Tonnes', price: '₹26/kg', total: '₹31,200', status: 'Processing', statusBg: 'bg-blue-100 text-blue-800' },
    { id: 'ORD-903', buyer: 'Metro Food Supplies', product: 'Red Onion (Grade B)', quantity: '2.0 Tonnes', price: '₹28/kg', total: '₹56,000', status: 'In Transit', statusBg: 'bg-purple-100 text-purple-800' },
    { id: 'ORD-904', buyer: 'Akola Fresh Mart', product: 'Yellow Toor Dal', quantity: '800 kg', price: '₹89/kg', total: '₹71,200', status: 'Delivered', statusBg: 'bg-teal-100 text-teal-800' },
    { id: 'ORD-905', buyer: 'Vidarbha Caterers', product: 'Nagpur Oranges', quantity: '1.5 Tonnes', price: '₹46/kg', total: '₹69,000', status: 'Pending Payment', statusBg: 'bg-amber-100 text-amber-800' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Verified FPO Admin
            </span>
            <span className="text-xs text-slate-400 font-medium">Registration: FPO-MH-2024-889</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Sahyadri Farmer Producer Co. Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('fpo-onboarding')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border"
          >
            + Onboard New Member
          </button>
          <button
            onClick={() => setActivePage('auctions')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
          >
            + Create New Auction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-2">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              FPO Navigation Desk
            </div>
            {sidebarLinks.map((link) => {
              const IconComp = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    if (link.id === 'auctions') setActivePage('auctions');
                    if (link.id === 'forecast') setActivePage('ai-demand');
                    if (link.id === 'logistics') setActivePage('logistics');
                    if (link.id === 'payments') setActivePage('payments');
                    if (link.id === 'prices') setActivePage('mandi');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.id === 'notifications' && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white font-bold">3</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Stats Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">FPO Credit Score</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">AAA Grade</span>
            </div>
            <div className="text-2xl font-black">94 / 100</div>
            <p className="text-[11px] text-slate-300">Eligible for 0% commission pooled freight logistics</p>
          </div>
        </aside>

        {/* Main Dashboard Widgets & Charts Content */}
        <main className="lg:col-span-9 space-y-8">
          
          {/* Dashboard Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Today's Sales</span>
              <div className="text-2xl font-black text-slate-900">₹48,500</div>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-3 h-3" /> +18% vs Mandi
              </span>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Pending Orders</span>
              <div className="text-2xl font-black text-slate-900">12</div>
              <span className="text-[10px] font-semibold text-blue-600 mt-1 block">Awaiting Dispatch</span>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Active Listings</span>
              <div className="text-2xl font-black text-slate-900">24</div>
              <span className="text-[10px] font-semibold text-emerald-600 mt-1 block">Across 5 Commodities</span>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Average Price</span>
              <div className="text-2xl font-black text-slate-900">₹36/kg</div>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-3 h-3" /> +₹4 vs eNAM
              </span>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">Upcoming Payments</span>
              <div className="text-2xl font-black text-slate-900">₹82,400</div>
              <span className="text-[10px] font-semibold text-purple-600 mt-1 block">Escrow Settling in 48h</span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* AI Demand Forecast Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">AI Demand Forecast</h3>
                  <p className="text-xs text-slate-400 font-medium">Expected crop demand (Tonnes)</p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  {['7', '14', '30'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setForecastRange(range)}
                      className={`px-2 py-1 rounded-lg transition ${forecastRange === range ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
                    >
                      {range}D
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={demandData14Days}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="demand" name="Actual Demand" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="forecast" name="AI Forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Price Trends Comparison Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Price Trend Discovery</h3>
                  <p className="text-xs text-slate-400 font-medium">Local Mandi vs eNAM vs Nexora (₹/kg)</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Tomato Grade A
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} domain={[25, 40]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="localMandi" name="Local Mandi" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="eNam" name="eNAM Rate" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="nexora" name="Nexora Direct" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Recent Orders Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Recent Procurement Orders</h3>
                <p className="text-xs text-slate-400 font-medium">Direct orders received from verified buyers</p>
              </div>
              <button
                onClick={() => setActivePage('payments')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>View Settlements</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 px-3">Order ID</th>
                    <th className="pb-3 px-3">Buyer Name</th>
                    <th className="pb-3 px-3">Product</th>
                    <th className="pb-3 px-3">Quantity</th>
                    <th className="pb-3 px-3">Rate</th>
                    <th className="pb-3 px-3">Total</th>
                    <th className="pb-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {recentOrders.map(ord => (
                    <tr key={ord.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-3 font-bold text-slate-900">{ord.id}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-800">{ord.buyer}</td>
                      <td className="py-3.5 px-3">{ord.product}</td>
                      <td className="py-3.5 px-3">{ord.quantity}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">{ord.price}</td>
                      <td className="py-3.5 px-3 font-extrabold text-emerald-700">{ord.total}</td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${ord.statusBg}`}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>

      </div>
    </div>
  );
}
