import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DemoFlowBar from './components/DemoFlowBar';
import NotificationsModal from './components/NotificationsModal';
import MobileNav from './components/MobileNav';
import Chatbot from './components/Chatbot';
import PitchModal from './components/PitchModal';

// Pages
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import FpoDashboardPage from './pages/FpoDashboardPage';
import FpoOnboardingPage from './pages/FpoOnboardingPage';
import AuctionPage from './pages/AuctionPage';
import DemandAggregationPage from './pages/DemandAggregationPage';
import AiDemandPage from './pages/AiDemandPage';
import LogisticsPage from './pages/LogisticsPage';
import PaymentsPage from './pages/PaymentsPage';
import BuyerDashboardPage from './pages/BuyerDashboardPage';
import MandiPricesPage from './pages/MandiPricesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CalculatorsPage from './pages/CalculatorsPage';
import AboutTeamPage from './pages/AboutTeamPage';

export default function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const [activePage, setActivePage] = useState('home');
  const [userRole, setUserRole] = useState('farmer'); // 'farmer', 'buyer', 'logistics', 'admin'
  const [currentDemoStep, setCurrentDemoStep] = useState(1);

  // Modals
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage currentLang={currentLang} setActivePage={setActivePage} />;
      case 'marketplace':
        return <MarketplacePage currentLang={currentLang} setActivePage={setActivePage} />;
      case 'auctions':
        return <AuctionPage currentLang={currentLang} setActivePage={setActivePage} />;
      case 'fpo-dash':
        return <FpoDashboardPage currentLang={currentLang} setActivePage={setActivePage} />;
      case 'fpo-onboarding':
        return <FpoOnboardingPage currentLang={currentLang} setActivePage={setActivePage} />;
      case 'demand':
        return <DemandAggregationPage currentLang={currentLang} setActivePage={setActivePage} />;
      case 'ai-demand':
        return <AiDemandPage currentLang={currentLang} setActivePage={setActivePage} />;
      case 'logistics':
        return <LogisticsPage currentLang={currentLang} setActivePage={setActivePage} />;
      case 'payments':
        return <PaymentsPage currentLang={currentLang} setActivePage={setActivePage} />;
      case 'buyer-dash':
        return <BuyerDashboardPage currentLang={currentLang} setActivePage={setActivePage} />;
      case 'mandi':
        return <MandiPricesPage currentLang={currentLang} setActivePage={setActivePage} />;
      case 'admin':
        return <AdminDashboardPage currentLang={currentLang} setActivePage={setActivePage} />;
      case 'calculators':
        return <CalculatorsPage currentLang={currentLang} />;
      case 'team':
        return <AboutTeamPage currentLang={currentLang} />;
      default:
        return <HomePage currentLang={currentLang} setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-500 selection:text-white pb-16 md:pb-0">
      
      {/* Interactive SIH 2026 Core Demo Walkthrough Controller Bar */}
      <DemoFlowBar
        currentStep={currentDemoStep}
        setCurrentStep={setCurrentDemoStep}
        setActivePage={setActivePage}
      />

      {/* Primary Top Navbar */}
      <Navbar
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        activePage={activePage}
        setActivePage={setActivePage}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main Dynamic Page Container */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer currentLang={currentLang} setActivePage={setActivePage} />

      {/* Mobile Bottom Navigation */}
      <MobileNav activePage={activePage} setActivePage={setActivePage} />

      {/* Floating Kisaan AI Assistant */}
      <Chatbot currentLang={currentLang} />

      {/* Notifications Drawer Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Pitch Deck Modal */}
      <PitchModal
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
      />
    </div>
  );
}
