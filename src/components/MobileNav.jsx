import React from 'react';
import { Home, Store, ShoppingBag, Truck, User } from 'lucide-react';

export default function MobileNav({ activePage, setActivePage }) {
  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'marketplace', label: 'Market', icon: Store },
    { id: 'auctions', label: 'Orders', icon: ShoppingBag },
    { id: 'logistics', label: 'Logistics', icon: Truck },
    { id: 'fpo-dash', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-2xl">
      {items.map((item) => {
        const IconComp = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${
              isActive ? 'text-emerald-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <IconComp className="w-5 h-5" />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
