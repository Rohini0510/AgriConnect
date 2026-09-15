import React, { useState } from 'react';
import { Bell, CheckCircle2, TrendingUp, AlertTriangle, Truck, DollarSign, Gavel, X, Sparkles } from 'lucide-react';

export default function NotificationsModal({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'auction',
      icon: Gavel,
      title: '🔔 New Auction Available',
      message: 'Green Valley FPO listed 5.0 Tonnes of Organic Tomatoes (Grade A). Bidding starts at ₹30/kg.',
      time: '10 mins ago',
      read: false,
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-300'
    },
    {
      id: 2,
      type: 'bid',
      icon: TrendingUp,
      title: '🔔 Buyer Placed a Bid',
      message: 'Sharma Restaurant placed a new bid of ₹36/kg on Tomato Lot #NX-882.',
      time: '25 mins ago',
      read: false,
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-300'
    },
    {
      id: 3,
      type: 'order',
      icon: CheckCircle2,
      title: '🔔 Order Confirmed',
      message: 'Order #NX-ORD-902 for 1.2 Tonnes Potato approved by Wardha Farmers FPO.',
      time: '1 hour ago',
      read: true,
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-300'
    },
    {
      id: 4,
      type: 'payment',
      icon: DollarSign,
      title: '🔔 Payment Released',
      message: '₹48,500 settled directly into Sahyadri FPO Bank account via 3-Day Escrow.',
      time: '3 hours ago',
      read: true,
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-300'
    },
    {
      id: 5,
      type: 'ai',
      icon: Sparkles,
      title: '🔔 AI Demand Alert',
      message: 'Tomato demand expected to rise by 18% next week in Nagpur region. Stock early!',
      time: '5 hours ago',
      read: false,
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-300'
    },
    {
      id: 6,
      type: 'logistics',
      icon: Truck,
      title: '🔔 Logistics Update',
      message: 'Truck #NX204 departed Nagpur hub for Amravati distribution center (Route Optimized).',
      time: 'Yesterday',
      read: true,
      badgeColor: 'bg-teal-100 text-teal-700 border-teal-300'
    },
    {
      id: 7,
      type: 'price',
      icon: AlertTriangle,
      title: '🔔 Price Increase Alert',
      message: 'eNAM Onion price jumped +12% across Maharashtra mandis today.',
      time: 'Yesterday',
      read: true,
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-300'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const filteredNotifications = activeFilter === 'unread'
    ? notifications.filter(n => !n.read)
    : activeFilter === 'ai'
    ? notifications.filter(n => n.type === 'ai')
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Notifications Center
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 font-medium">Real-time alerts across auctions, bids, orders & AI insights</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between text-xs bg-white">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${activeFilter === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${activeFilter === 'unread' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setActiveFilter('ai')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${activeFilter === 'ai' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              🤖 AI Alerts
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold">No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map((n) => {
              const IconComp = n.icon;
              return (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex gap-3.5 items-start ${
                    n.read ? 'bg-white border-slate-100 opacity-80 hover:opacity-100' : 'bg-emerald-50/40 border-emerald-200 shadow-sm'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl border ${n.badgeColor}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                      <span className="text-[10px] font-medium text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                  </div>
                  {!n.read && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] font-semibold text-slate-500">
            Powered by Nexora Real-time Notification Engine • SIH 2026
          </p>
        </div>
      </div>
    </div>
  );
}
