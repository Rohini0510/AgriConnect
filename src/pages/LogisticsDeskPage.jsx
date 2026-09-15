import React, { useState } from 'react';
import { Truck, MapPin, Layers, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

const INITIAL_POOLED_SHIPMENTS = [
  {
    id: 'POOL-TRUCK-401',
    route: 'Narayangaon → Mumbai Vashi Mandi',
    distance: '165 km',
    capacity: '15.0 Tons',
    loaded: '11.5 Tons',
    fpoParticipants: ['Sahyadri FPO (5T)', 'Narayangaon FPO (6.5T)'],
    costPerTon: '₹540 / Ton',
    savings: '25% vs Solo Truck',
    status: 'OPTIMIZING_ROUTE'
  },
  {
    id: 'POOL-TRUCK-402',
    route: 'Nashik → Pune Retail Cluster',
    distance: '210 km',
    capacity: '20.0 Tons',
    loaded: '18.0 Tons',
    fpoParticipants: ['Nashik Agro (10T)', 'Sahyadri FPO (8T)'],
    costPerTon: '₹680 / Ton',
    savings: '28% vs Solo Truck',
    status: 'IN_TRANSIT'
  }
];

export default function LogisticsDeskPage() {
  const [shipments, setShipments] = useState(INITIAL_POOLED_SHIPMENTS);
  const [joinedTrucks, setJoinedTrucks] = useState([]);

  const handleJoinTruck = (truckId) => {
    if (!joinedTrucks.includes(truckId)) {
      setJoinedTrucks([...joinedTrucks, truckId]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Shared Trucking & Route AI</span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">Pooled Logistics Management Desk</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Consolidate produce loads across neighbouring FPOs to split freight costs transparently
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {shipments.map((truck) => {
          const isJoined = joinedTrucks.includes(truck.id);
          return (
            <div key={truck.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 hover:shadow-xl transition">
              <div className="flex justify-between items-center text-xs">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-700" /> {truck.id}
                </span>
                <span className="font-bold text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" /> {truck.distance}
                </span>
              </div>

              <div>
                <h3 className="font-black text-slate-900 text-lg">{truck.route}</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Participating FPOs: {truck.fpoParticipants.join(', ')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Pooled Rate</p>
                  <p className="text-lg font-black text-emerald-600">{truck.costPerTon}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Efficiency Gain</p>
                  <p className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-0.5">{truck.savings}</p>
                </div>
              </div>

              <button
                onClick={() => handleJoinTruck(truck.id)}
                disabled={isJoined}
                className={`w-full py-3 rounded-2xl font-bold text-xs shadow transition flex items-center justify-center gap-2 ${
                  isJoined
                    ? 'bg-emerald-100 text-emerald-800 cursor-default'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
                }`}
              >
                {isJoined ? <><CheckCircle2 className="w-4 h-4" /> Load Reserved on Truck</> : 'Consolidate My Load on Truck'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
