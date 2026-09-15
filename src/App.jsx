import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import PitchModal from './components/PitchModal';

// Pages
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import TradingDeskPage from './pages/TradingDeskPage';
import LogisticsDeskPage from './pages/LogisticsDeskPage';
import PaymentsPage from './pages/PaymentsPage';
import MobileSimulatorPage from './pages/MobileSimulatorPage';
import CalculatorsPage from './pages/CalculatorsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AboutTeamPage from './pages/AboutTeamPage';

export default function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const [activePage, setActivePage] = useState('home');
  const [userRole, setUserRole] = useState('farmer'); // 'farmer', 'buyer', 'logistics', 'admin'
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage currentLang={currentLang} setActivePage={setActivePage} />;
      case 'marketplace':
        return <MarketplacePage currentLang={currentLang} />;
      case 'trading':
        return <TradingDeskPage userRole={userRole} />;
      case 'logistics-desk':
        return <LogisticsDeskPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'simulator':
        return <MobileSimulatorPage currentLang={currentLang} />;
      case 'calculators':
        return <CalculatorsPage currentLang={currentLang} />;
      case 'analytics':
        return <AnalyticsPage currentLang={currentLang} />;
      case 'team':
        return <AboutTeamPage currentLang={currentLang} />;
      default:
        return <HomePage currentLang={currentLang} setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Sub-header Bar: Role Switcher & Live Platform Shortcuts */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs font-semibold border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">Platform Mode:</span>
            <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => setUserRole('farmer')}
                className={`px-2.5 py-1 rounded-md text-[11px] transition ${
                  userRole === 'farmer' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Farmer / FPO Lead
              </button>
              <button
                onClick={() => setUserRole('buyer')}
                className={`px-2.5 py-1 rounded-md text-[11px] transition ${
                  userRole === 'buyer' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bulk Buyer
              </button>
              <button
                onClick={() => setUserRole('logistics')}
                className={`px-2.5 py-1 rounded-md text-[11px] transition ${
                  userRole === 'logistics' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Logistics Partner
              </button>
            </div>
          </div>

          {/* Quick Platform Page Switcher */}
          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={() => setActivePage('trading')}
              className={`hover:underline ${activePage === 'trading' ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}
            >
              ⚡ Live Auctions
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => setActivePage('logistics-desk')}
              className={`hover:underline ${activePage === 'logistics-desk' ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}
            >
              🚚 Shared Freight Desk
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => setActivePage('payments')}
              className={`hover:underline ${activePage === 'payments' ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}
            >
              💳 3-Day Settlements
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <Navbar
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenPitchModal={() => setIsPitchModalOpen(true)}
      />

      {/* Main Dynamic Page Content */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer currentLang={currentLang} />

      {/* Floating Kisaan Mitra AI Assistant */}
      <Chatbot currentLang={currentLang} />

      {/* Pitch Deck Modal */}
      <PitchModal
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
      />
    </div>
  );
}
