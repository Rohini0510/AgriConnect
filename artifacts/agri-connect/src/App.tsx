import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { LanguageProvider, locales, useLang, type Locale, type TKey } from './i18n';
import { Chatbot } from './components/Chatbot';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Bell,
  Bot,
  Building2,
  Calculator,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  DollarSign,
  Download,
  Droplets,
  Eye,
  EyeOff,
  FileCheck2,
  FileStack,
  FileText,
  Filter,
  FlaskConical,
  Gavel,
  Globe2,
  Gauge,
  Handshake,
  IndianRupee,
  Landmark,
  LockKeyhole,
  LogIn,
  LogOut,
  Mail,
  Leaf,
  ListFilter,
  Navigation,
  Package,
  PackageCheck,
  Phone,
  MapPin,
  Menu,
  MessageCircle,
  Receipt,
  Scale,
  Search,
  Send,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Sprout,
  Store,
  Sun,
  Timer,
  Tractor,
  TrendingDown,
  TrendingUp,
  Truck,
  UploadCloud,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import {
  useAddMember,
  useCreateJoinRequest,
  useDecideFpo,
  useGetAdminFpo,
  useGetFpo,
  useGetFpoOnboarding,
  useGetJoinRequest,
  useGetAuthSession,
  useListAdminFpos,
  useListFpos,
  useListMembers,
  useSubmitFpoOnboarding,
  useSignIn,
  useSignOut,
  getGetAdminFpoQueryKey,
  getGetAuthSessionQueryKey,
  getGetFpoOnboardingQueryKey,
  getGetFpoQueryKey,
  getGetJoinRequestQueryKey,
  getListAdminFposQueryKey,
  getListFposQueryKey,
  getListMembersQueryKey,
  type DocumentStatus,
  type Fpo,
  type FpoOnboardingInput,
  type Member,
  type AuthSession,
  type AuthUser,
  type AuthSignInInputRole,
} from '@workspace/api-client-react';
import {
  Link,
  Route,
  Switch,
  useLocation,
  useParams,
  Router as WouterRouter,
} from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

export function LanguageSelector({ className = '' }: { className?: string }) {
  const { locale, setLocale, t } = useLang();
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-xl border border-border bg-card/90 p-1 shadow-sm ${className}`}
      role="group"
      aria-label={t('shell.language')}
      data-testid="lang-switcher"
    >
      <Globe2 className="h-3.5 w-3.5 ml-1 text-muted-foreground shrink-0" />
      {locales.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => setLocale(item.code)}
          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
            locale === item.code
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
          data-testid={`lang-${item.code}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

const fallbackFpos: Fpo[] = [
  {
    id: 'fpo-1',
    name: 'Kaveri Harvest Producer Co.',
    registrationNumber: 'FPO-KA-2021-084',
    state: 'Karnataka',
    district: 'Mandya',
    block: 'Maddur',
    villages: ['Koppa', 'Huliyur', 'Somanahalli', 'Malavalli'],
    crops: ['Sugarcane', 'Ragi', 'Coconut'],
    memberCount: 248,
    totalArea: 684.5,
    status: 'Verified',
    description: 'A farmer-led collective helping Mandya growers sell together, share advice and reach reliable buyers.',
    contactName: 'Nandini Gowda',
    contactMobile: '+91 98451 22018',
    documents: [
      { id: 'inc', name: 'Certificate of incorporation', status: 'Verified', fileName: 'kaveri-incorporation.pdf' },
      { id: 'pan', name: 'PAN card', status: 'Verified', fileName: 'kaveri-pan.pdf' },
      { id: 'act', name: 'Legal act / bylaws', status: 'Verified', fileName: 'kaveri-bylaws.pdf' },
    ],
  },
  {
    id: 'fpo-2',
    name: 'Sahyadri Millet Collective',
    registrationNumber: 'FPO-MH-2022-113',
    state: 'Maharashtra',
    district: 'Satara',
    block: 'Karad',
    villages: ['Oholi', 'Vadgaon', 'Umbraj'],
    crops: ['Millets', 'Tur dal', 'Groundnut'],
    memberCount: 126,
    totalArea: 392,
    status: 'Under Review',
    description: 'Smallholder growers building a stronger local millet economy across the Karad plateau.',
    contactName: 'Mahesh Jadhav',
    contactMobile: '+91 98227 55410',
    documents: [
      { id: 'inc', name: 'Certificate of incorporation', status: 'Verified', fileName: 'sahyadri-incorporation.pdf' },
      { id: 'pan', name: 'PAN card', status: 'Under Review', fileName: 'sahyadri-pan.pdf' },
      { id: 'act', name: 'Legal act / bylaws', status: 'Pending', fileName: 'sahyadri-bylaws.pdf' },
    ],
  },
  {
    id: 'fpo-3',
    name: 'Narmada Valley Growers',
    registrationNumber: 'FPO-MP-2023-047',
    state: 'Madhya Pradesh',
    district: 'Harda',
    block: 'Timarni',
    villages: ['Bichhapur', 'Chhipaner', 'Khirkiya'],
    crops: ['Soybean', 'Wheat', 'Chickpea'],
    memberCount: 89,
    totalArea: 214.7,
    status: 'Pending',
    description: 'An emerging collective for resilient grain farming along the Narmada valley.',
    contactName: 'Rakesh Patidar',
    contactMobile: '+91 98932 11442',
    documents: [
      { id: 'inc', name: 'Certificate of incorporation', status: 'Pending', fileName: 'narmada-incorporation.pdf' },
      { id: 'pan', name: 'PAN card', status: 'Pending', fileName: 'narmada-pan.pdf' },
    ],
  },
];

const fallbackMembers: Member[] = [
  { id: 'm-1', farmerId: 'KA-MD-0018', name: 'Suresh K.', village: 'Koppa', mobile: '+91 98804 11720', landholding: 2.4, crops: ['Sugarcane', 'Ragi'] },
  { id: 'm-2', farmerId: 'KA-MD-0042', name: 'Lakshmi N.', village: 'Huliyur', mobile: '+91 98452 83941', landholding: 1.8, crops: ['Coconut', 'Ragi'] },
  { id: 'm-3', farmerId: 'KA-MD-0077', name: 'Mohan B.', village: 'Somanahalli', mobile: '+91 99001 44518', landholding: 3.1, crops: ['Sugarcane'] },
  { id: 'm-4', farmerId: 'KA-MD-0084', name: 'Pooja R.', village: 'Malavalli', mobile: '+91 99642 70355', landholding: 1.2, crops: ['Coconut', 'Ragi'] },
];

const states = ['Karnataka', 'Maharashtra', 'Madhya Pradesh', 'Odisha', 'Tamil Nadu'];
const cropOptions = ['Sugarcane', 'Ragi', 'Coconut', 'Millets', 'Tur dal', 'Soybean', 'Wheat', 'Chickpea', 'Tomato', 'Onion', 'Chilli', 'Groundnut', 'Pomegranate'];

const buyerNodes = ['Karad node', 'Maddur node', 'Timarni node', 'Umbraj node', 'Malavalli node'];
const inr = (value: number) => `₹${value.toLocaleString('en-IN')}`;

function buyerStatusTone(status: string) {
  if (['Delivered', 'Paid', 'Matched', 'Verified', 'सत्यापित', 'भरणा पूर्ण', 'वितरित', 'जुळले'].includes(status)) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (['Overdue', 'Delayed', 'Rejected', 'अतिदेय', 'थकीत', 'विलंबित', 'अस्वीकृत', 'नाकारले'].includes(status)) return 'bg-rose-100 text-rose-800 border-rose-200';
  if (['In transit', 'Pooling', 'Negotiating', 'At weighbridge', 'Due', 'मार्ग में', 'वाहतुकीत', 'पूलिंग', 'बाकी', 'देय'].includes(status)) return 'bg-amber-100 text-amber-900 border-amber-200';
  if (['Scheduled', 'On time', 'Ready', 'समय पर', 'वेळेवर', 'सज्ज', 'तैयार', 'नियोजित'].includes(status)) return 'bg-sky-100 text-sky-800 border-sky-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

function Pill({ label, tone }: { label: string; tone?: string }) {
  const { localizeStatus } = useLang();
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${tone ?? buyerStatusTone(label)}`} data-testid={`pill-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>{localizeStatus(label)}</span>;
}

const buyerMarketPrices = [
  { crop: 'Tur dal', grade: 'Grade A', node: 'Karad node', price: 11240, change: 1.8 },
  { crop: 'Soybean', grade: 'FAQ', node: 'Timarni node', price: 4180, change: -0.6 },
  { crop: 'Ragi', grade: 'Millet', node: 'Maddur node', price: 3640, change: 2.4 },
  { crop: 'Groundnut', grade: 'Kernels', node: 'Umbraj node', price: 6890, change: 0.9 },
  { crop: 'Wheat', grade: 'Sharbati', node: 'Harda node', price: 2950, change: -1.2 },
  { crop: 'Coconut', grade: 'Milling', node: 'Malavalli node', price: 1420, change: 0.5 },
];

type BuyerAuction = { id: string; crop: string; grade: string; fpo: string; node: string; quantity: string; lots: number; basePrice: number; topBid: number; bids: number; closesIn: string; live: boolean };

const buyerAuctions: BuyerAuction[] = [
  { id: 'AUC-0421', crop: 'Tur dal', grade: 'Grade A', fpo: 'Sahyadri Millet Collective', node: 'Karad node', quantity: '18 MT', lots: 3, basePrice: 11100, topBid: 11240, bids: 8, closesIn: '32 min', live: true },
  { id: 'AUC-0422', crop: 'Soybean', grade: 'FAQ', fpo: 'Narmada Valley Growers', node: 'Timarni node', quantity: '24 MT', lots: 4, basePrice: 4090, topBid: 4180, bids: 5, closesIn: '1 hr 12 min', live: true },
  { id: 'AUC-0419', crop: 'Groundnut', grade: 'Kernels', fpo: 'Kaveri Harvest Producer Co.', node: 'Umbraj node', quantity: '9 MT', lots: 2, basePrice: 6820, topBid: 6890, bids: 6, closesIn: '2 hr 40 min', live: true },
  { id: 'AUC-0418', crop: 'Ragi', grade: 'Millet', fpo: 'Kaveri Harvest Producer Co.', node: 'Maddur node', quantity: '12 MT', lots: 2, basePrice: 3560, topBid: 3640, bids: 11, closesIn: 'Closed 10 Nov', live: false },
];

type BuyerDemand = { id: string; crop: string; grade: string; volume: number; repeat: string; window: string; node: string; offer: number; status: string; matched: number };

const fallbackDemands: BuyerDemand[] = [
  { id: 'DEM-203', crop: 'Tur dal', grade: 'Grade A', volume: 12, repeat: 'Monthly', window: 'Nov – Jan', node: 'Karad node', offer: 11450, status: 'Pooling', matched: 68 },
  { id: 'DEM-198', crop: 'Ragi', grade: 'Millet', volume: 8, repeat: 'Bi-weekly', window: 'Oct – Dec', node: 'Maddur node', offer: 3600, status: 'Matched', matched: 100 },
  { id: 'DEM-191', crop: 'Soybean', grade: 'FAQ', volume: 20, repeat: 'One-time', window: 'Nov', node: 'Timarni node', offer: 4150, status: 'Negotiating', matched: 45 },
];

const demandCalendar = [
  { day: 'Mon', crop: 'Tur dal', volume: 4, node: 'Karad node' },
  { day: 'Tue', crop: 'Ragi', volume: 2, node: 'Maddur node' },
  { day: 'Wed', crop: 'Soybean', volume: 6, node: 'Timarni node' },
  { day: 'Thu', crop: 'Tur dal', volume: 3, node: 'Karad node' },
  { day: 'Fri', crop: 'Groundnut', volume: 5, node: 'Umbraj node' },
  { day: 'Sat', crop: 'Ragi', volume: 3, node: 'Maddur node' },
  { day: 'Sun', crop: 'Coconut', volume: 1, node: 'Malavalli node' },
];

const poolRequisitions = [
  { fpo: 'Sahyadri Millet Collective', crop: 'Tur dal', quantity: '6 MT', offer: 11450, available: 'Ready', window: '18 – 22 Nov' },
  { fpo: 'Narmada Valley Growers', crop: 'Soybean', quantity: '14 MT', offer: 4150, available: 'In 4 days', window: '20 – 26 Nov' },
  { fpo: 'Kaveri Harvest Producer Co.', crop: 'Ragi', quantity: '5 MT', offer: 3600, available: 'Ready', window: '17 – 21 Nov' },
  { fpo: 'Kaveri Harvest Producer Co.', crop: 'Coconut', quantity: '2 MT', offer: 1420, available: 'In 2 days', window: '19 – 23 Nov' },
];

type BuyerOrder = { id: string; crop: string; quantity: string; fpo: string; vehicle: string; eta: string; status: string; progress: number };

const fallbackOrders: BuyerOrder[] = [
  { id: 'ORD-5581', crop: 'Tur dal', quantity: '12 MT', fpo: 'Sahyadri Millet Collective', vehicle: 'MH-12 TB 4482', eta: 'Today, 4:10 PM', status: 'In transit', progress: 62 },
  { id: 'ORD-5578', crop: 'Ragi', quantity: '8 MT', fpo: 'Kaveri Harvest Producer Co.', vehicle: 'KA-11 AC 2190', eta: 'Tomorrow, 9:00 AM', status: 'Scheduled', progress: 12 },
  { id: 'ORD-5571', crop: 'Soybean', quantity: '20 MT', fpo: 'Narmada Valley Growers', vehicle: 'MP-09 GH 7721', eta: 'At gate now', status: 'At weighbridge', progress: 92 },
  { id: 'ORD-5564', crop: 'Groundnut', quantity: '9 MT', fpo: 'Sahyadri Millet Collective', vehicle: 'MH-14 JN 8834', eta: 'Delivered 12 Nov', status: 'Delivered', progress: 100 },
];

const fleetTelemetry = [
  { vehicle: 'MH-12 TB 4482', driver: 'Santosh Pawar', route: 'Karad → Pune', load: '12 MT Tur dal', speed: '48 km/h', eta: '4:10 PM', status: 'On time', progress: 62 },
  { vehicle: 'KA-11 AC 2190', driver: 'Girish Naik', route: 'Maddur → Bengaluru', load: '8 MT Ragi', speed: '0 km/h', eta: 'Tomorrow, 9:00 AM', status: 'Scheduled', progress: 12 },
  { vehicle: 'MP-09 GH 7721', driver: 'Imran Shaikh', route: 'Timarni → Indore', load: '20 MT Soybean', speed: '—', eta: 'At gate now', status: 'Delayed', progress: 92 },
];

const weighbridgeLedger = [
  { slip: 'WB-7741', fpo: 'Sahyadri Millet Collective', crop: 'Tur dal', gross: '12.08 MT', tare: '1.92 MT', net: '10.16 MT', at: '12 Nov, 6:40 PM' },
  { slip: 'WB-7728', fpo: 'Kaveri Harvest Producer Co.', crop: 'Groundnut', gross: '9.24 MT', tare: '2.10 MT', net: '7.14 MT', at: '12 Nov, 11:15 AM' },
  { slip: 'WB-7716', fpo: 'Narmada Valley Growers', crop: 'Soybean', gross: '20.42 MT', tare: '3.06 MT', net: '17.36 MT', at: '11 Nov, 5:05 PM' },
];

const fallbackInvoices = [
  { id: 'INV-2210', order: 'ORD-5564', fpo: 'Sahyadri Millet Collective', amount: 812400, due: '18 Nov 2024', status: 'Due' },
  { id: 'INV-2196', order: 'ORD-5541', fpo: 'Kaveri Harvest Producer Co.', amount: 288000, due: '10 Nov 2024', status: 'Paid' },
  { id: 'INV-2183', order: 'ORD-5528', fpo: 'Narmada Valley Growers', amount: 836000, due: '02 Nov 2024', status: 'Overdue' },
];

type Role = 'fpo' | 'farmer' | 'admin' | 'buyer';

function prototypeSession(role: Role): AuthSession {
  const displayName = role === 'fpo' ? 'Prototype FPO secretary' : role === 'admin' ? 'Prototype review officer' : role === 'buyer' ? 'Prototype procurement lead' : 'Prototype farmer';
  return {
    authenticated: true,
    user: {
      id: `prototype-${role}`,
      role,
      displayName,
      identity: `prototype-${role}`,
    },
  };
}

function workspacePath(role: Role) {
  return role === 'fpo' ? '/workspace' : role === 'farmer' ? '/farmer/fpos' : role === 'admin' ? '/admin/fpos' : '/buyer/marketplace';
}

function statusTone(status?: string) {
  if (['Verified', 'Accepted', 'सत्यापित', 'स्वीकृत'].includes(status || '')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (['Rejected', 'अस्वीकृत', 'नाकारले'].includes(status || '')) return 'bg-rose-100 text-rose-800 border-rose-200';
  if (['Under Review', 'समीक्षाधीन', 'पुनरावलोकनाधीन'].includes(status || '')) return 'bg-amber-100 text-amber-900 border-amber-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

function StatusPill({ status }: { status?: string }) {
  const { localizeStatus } = useLang();
  const raw = status || 'Pending';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusTone(raw)}`} data-testid={`status-${raw.toLowerCase().replaceAll(' ', '-')}`}>
      {raw === 'Verified' || raw === 'सत्यापित' ? <BadgeCheck className="h-3.5 w-3.5" /> : null}
      {localizeStatus(raw)}
    </span>
  );
}

function Logo({ href = '/workspace', inverse = false }: { href?: string; inverse?: boolean }) {
  const { t } = useLang();
  return (
    <Link href={href} className="flex items-center gap-3" data-testid="link-logo">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] shadow-sm">
        <Sprout className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <span>
        <span className={`block font-display text-lg font-bold tracking-tight ${inverse ? 'text-primary' : 'text-[hsl(var(--sidebar-foreground))]'}`}>{t('common.appName')}</span>
        <span className={`block font-mono-app text-[9px] uppercase tracking-[0.22em] ${inverse ? 'text-muted-foreground' : 'text-[hsl(var(--sidebar-foreground)/.58)]'}`}>{t('common.fpoHub')}</span>
      </span>
    </Link>
  );
}

function AppShell({ children, user, onSignOut }: { children: ReactNode; user: AuthUser; onSignOut: () => void }) {
  const role = user.role;
  const { locale, setLocale, t, localizeName } = useLang();
  const [mobileNav, setMobileNav] = useState(false);
  const [location] = useLocation();

  const nav = role === 'fpo'
    ? [
        { href: '/workspace', label: t('nav.fpoOverview'), icon: Building2 },
        { href: '/fpo/onboarding', label: t('nav.fpoVerification'), icon: ClipboardCheck },
        { href: '/fpo/status', label: t('nav.fpoStatus'), icon: FileCheck2 },
        { href: '/fpo/members', label: t('nav.fpoMembers'), icon: Users },
        { href: '/fpo/demand', label: t('nav.fpoDemand'), icon: Store },
        { href: '/fpo/logistics', label: t('nav.fpoLogistics'), icon: Truck },
        { href: '/fpo/analytics', label: t('nav.fpoAnalytics'), icon: BarChart3 },
      ]
    : role === 'farmer'
      ? [
          { href: '/workspace', label: t('nav.kisanOverview'), icon: Sprout },
          { href: '/farmer/sales', label: t('nav.sales'), icon: IndianRupee },
          { href: '/farmer/payments', label: t('nav.payments'), icon: Receipt },
          { href: '/farmer/logistics', label: t('nav.logistics'), icon: Truck },
          { href: '/farmer/fpos', label: t('nav.fpos'), icon: Search },
          { href: '/farmer/passbook', label: t('nav.passbook'), icon: Wallet },
        ]
      : role === 'buyer'
        ? [
            { href: '/buyer/marketplace', label: t('nav.buyerMarketplace'), icon: Gavel },
            { href: '/buyer/demands', label: t('nav.buyerDemands'), icon: FileStack },
            { href: '/buyer/orders', label: t('nav.buyerOrders'), icon: Truck },
            { href: '/buyer/invoices', label: t('nav.buyerInvoices'), icon: Receipt },
          ]
        : [
            { href: '/workspace', label: t('nav.adminDesk'), icon: ClipboardCheck },
            { href: '/admin/fpos', label: t('nav.adminFpos'), icon: FileText },
          ];

  const rolePerson = role === 'fpo' ? 'Nandini' : role === 'farmer' ? 'Ravi' : role === 'buyer' ? 'Meera' : 'Asha';
  const roleWorkspace = role === 'fpo' ? t('shell.roleFpo') : role === 'farmer' ? t('shell.roleFarmer') : role === 'buyer' ? t('shell.roleBuyer') : t('shell.roleAdmin');

  return (
    <div className="grain flex min-h-[100dvh] bg-background text-foreground">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col bg-sidebar px-5 py-6 text-sidebar-foreground transition-transform duration-200 lg:static lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <Logo />
          <button className="rounded-lg p-2 text-sidebar-foreground/70 hover:bg-sidebar-accent lg:hidden" onClick={() => setMobileNav(false)} data-testid="button-close-navigation">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-7 rounded-2xl border border-sidebar-border bg-sidebar-accent/65 p-3">
          <span className="font-mono-app text-[10px] uppercase tracking-[.18em] text-sidebar-foreground/50">{t('shell.youAreUsing')}</span>
          <div className="mt-2 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-sidebar-primary/90 text-sidebar-primary-foreground">
              {role === 'fpo' ? <Building2 className="h-4 w-4" /> : role === 'farmer' ? <Tractor className="h-4 w-4" /> : role === 'buyer' ? <ShoppingCart className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            </span>
            <div>
              <p className="text-sm font-semibold">{roleWorkspace}</p>
              <p className="text-xs text-sidebar-foreground/55">{t('shell.signedInWorkspace')}</p>
            </div>
          </div>
        </div>
        <nav className="mt-6 space-y-1.5 overflow-y-auto max-h-[calc(100vh-280px)] pr-1" aria-label="Main navigation">
          <p className="mb-2 px-3 font-mono-app text-[10px] uppercase tracking-[.18em] text-sidebar-foreground/40">{t('shell.workspace')}</p>
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === '/workspace' ? location === '/workspace' : location.startsWith(href);
            return (
              <Link key={href} href={href} onClick={() => setMobileNav(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' : 'text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span className="truncate">{label}</span>
                {active ? <ChevronRight className="ml-auto h-4 w-4 shrink-0" /> : null}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-4">
          <div className="rounded-2xl border border-sidebar-border/80 p-3.5">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sidebar-primary" />
              <div>
                <p className="text-xs font-semibold">{t('shell.trustTitle')}</p>
                <p className="mt-1 text-[11px] leading-4 text-sidebar-foreground/55">{t('shell.trustBody')}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      {mobileNav ? <button className="fixed inset-0 z-30 bg-[hsl(var(--foreground)/.35)] lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close navigation" data-testid="button-navigation-overlay" /> : null}
      <main className="app-shell min-w-0 flex-1 flex flex-col">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/85 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 hover:bg-muted lg:hidden" onClick={() => setMobileNav(true)} data-testid="button-open-navigation"><Menu className="h-5 w-5" /></button>
            <div className="hidden text-sm text-muted-foreground sm:block">
              {t('shell.greeting', { name: '' })}<span className="font-semibold text-foreground">{localizeName(rolePerson)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            <span className="hidden text-xs font-semibold text-muted-foreground md:block">{user.identity}</span>
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" data-testid="button-notifications" onClick={() => window.alert('You are all caught up.')}>
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
            </button>
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[hsl(var(--accent)/.18)] text-sm font-bold text-[hsl(var(--accent))]" data-testid="avatar-current-user">
              {user.displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <button onClick={onSignOut} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" data-testid="button-sign-out">
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">{t('shell.signOut')}</span>
            </button>
          </div>
        </header>
        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-7 lg:px-10 lg:py-8 flex-1">{children}</div>
      </main>
    </div>
  );
}

const loginOptions: { role: Role; labelKey: TKey; eyebrowKey: TKey; descKey: TKey; icon: typeof Building2; tone: string; href: string }[] = [
  {
    role: 'farmer',
    labelKey: 'login.farmerRole',
    eyebrowKey: 'login.farmerEyebrow',
    descKey: 'login.farmerDesc',
    icon: Tractor,
    tone: 'bg-[hsl(var(--accent)/.12)] text-accent',
    href: '/login/farmer',
  },
  {
    role: 'fpo',
    labelKey: 'login.fpoRole',
    eyebrowKey: 'login.fpoEyebrow',
    descKey: 'login.fpoDesc',
    icon: Building2,
    tone: 'bg-[hsl(var(--primary)/.1)] text-primary',
    href: '/login/fpo',
  },
  {
    role: 'admin',
    labelKey: 'login.adminRole',
    eyebrowKey: 'login.adminEyebrow',
    descKey: 'login.adminDesc',
    icon: Landmark,
    tone: 'bg-[hsl(var(--sidebar-primary)/.28)] text-primary',
    href: '/login/admin',
  },
  {
    role: 'buyer',
    labelKey: 'login.buyerRole',
    eyebrowKey: 'login.buyerEyebrow',
    descKey: 'login.buyerDesc',
    icon: Store,
    tone: 'bg-[hsl(var(--chart-4)/.16)] text-[hsl(var(--chart-4))]',
    href: '/login/buyer',
  },
];

function PublicHeader() {
  const { t } = useLang();
  return (
    <header className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-8 lg:px-16 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <Logo href="/" inverse />
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <a href="#how-it-works" className="transition-colors hover:text-foreground">{t('landing.seeHow')}</a>
          <a href="#login-options" className="transition-colors hover:text-foreground">{t('landing.chooseWorkspace')}</a>
        </div>
        <LanguageSelector />
        <Link href="/login/farmer" className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/90 px-3 py-1.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-card shadow-sm">
          {t('landing.continueLogin')} <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}

function LandingPage() {
  const { t, localizeFpo, localizeState, localizeStatus } = useLang();
  return (
    <div className="grain min-h-[100dvh] overflow-hidden bg-background text-foreground flex flex-col justify-between">
      <div>
        <PublicHeader />
        <main>
          <section className="relative px-5 pb-16 pt-10 sm:px-10 sm:pb-24 sm:pt-16 lg:px-16 lg:pt-20">
            <div className="absolute -right-20 -top-20 hidden h-80 w-80 rounded-full border-[34px] border-accent/10 lg:block pointer-events-none" />
            <div className="mx-auto grid max-w-[1380px] items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
              <div className="relative z-10 max-w-2xl enter">
                <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--primary)/.16)] bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-primary">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  {t('landing.eyebrow')}
                </div>
                <h1 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-[-.05em] text-primary sm:text-6xl">
                  {t('landing.heroTitle1')} <span className="text-accent">{t('landing.heroTitle2')}</span>
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {t('landing.heroBody')}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a href="#login-options" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5">
                    {t('landing.chooseWorkspace')} <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-5 py-3 text-sm font-semibold hover:bg-card">
                    {t('landing.seeHow')}
                  </a>
                </div>
                <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border/80 pt-6">
                  {[
                    ['24', t('landing.statFpos')],
                    ['4,816', t('landing.statFarmers')],
                    ['8', t('landing.statStates')],
                  ].map(([value, label]) => (
                    <div key={label}>
                      <p className="font-display text-2xl font-bold text-primary sm:text-3xl">{value}</p>
                      <p className="mt-1 text-xs text-muted-foreground leading-tight">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative enter enter-delay-1">
                <div className="soft-grid relative overflow-hidden rounded-[2rem] border border-[hsl(var(--primary)/.14)] bg-[hsl(var(--primary)/.06)] p-5 sm:p-7">
                  <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border-[18px] border-accent/15 pointer-events-none" />
                  <div className="relative z-10 rounded-2xl border border-border bg-card/95 p-5 shadow-xl shadow-primary/5 sm:p-6">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <div>
                        <p className="font-mono-app text-[10px] uppercase tracking-[.2em] text-accent">{t('landing.networkTitle')}</p>
                        <p className="mt-1 font-display text-lg font-bold">{t('landing.networkSub')}</p>
                      </div>
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--sidebar-primary)/.75)] text-primary">
                        <Handshake className="h-5 w-5" />
                      </span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {[
                        ['Sahyadri Farmer Producer Company', 'Pune, Maharashtra', 'Verified', 'bg-emerald-100 text-emerald-800'],
                        ['Pragati Krushi Vikas FPO', 'Nashik, Maharashtra', 'Under Review', 'bg-amber-100 text-amber-900'],
                        ['Narmada Valley Growers', 'Harda, Madhya Pradesh', 'Pending', 'bg-slate-100 text-slate-700'],
                      ].map(([name, location, status, tone], index) => (
                        <div className="flex items-center gap-3 rounded-xl border border-border bg-background/80 p-3" key={name}>
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                            {index === 0 ? <BadgeCheck className="h-4 w-4" /> : index === 1 ? <ClipboardCheck className="h-4 w-4" /> : <Sprout className="h-4 w-4" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold">{localizeFpo(name)}</span>
                            <span className="mt-0.5 block truncate text-xs text-muted-foreground">{location}</span>
                          </span>
                          <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${tone}`}>{localizeStatus(status)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-3 rounded-xl bg-primary px-4 py-3 text-primary-foreground">
                      <ShieldCheck className="h-5 w-5 shrink-0 text-sidebar-primary" />
                      <p className="text-xs leading-relaxed text-primary-foreground/90">{t('landing.networkNote')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="login-options" className="scroll-mt-6 border-y border-border bg-card/45 px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
            <div className="mx-auto max-w-[1380px]">
              <div className="max-w-xl">
                <p className="font-mono-app text-[10px] uppercase tracking-[.2em] text-accent">{t('landing.rolesEyebrow')}</p>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight">{t('landing.rolesTitle')}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{t('landing.rolesSub')}</p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {loginOptions.map(({ role, labelKey, eyebrowKey, descKey, icon: Icon, tone, href }, index) => (
                  <Link href={href} className={`group panel lift enter enter-delay-${index + 1} flex flex-col justify-between p-5 sm:p-6 min-h-[260px]`} key={role} data-testid={`link-login-${role}`}>
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <span className={`grid h-12 w-12 place-items-center rounded-2xl ${tone}`}><Icon className="h-5 w-5" /></span>
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                      <p className="mt-6 font-mono-app text-[10px] uppercase tracking-[.18em] text-muted-foreground">{t(eyebrowKey)}</p>
                      <h3 className="mt-1 font-display text-xl font-bold">{t(labelKey)}</h3>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">{t(descKey)}</p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-accent">
                      {t('landing.continueLogin')} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section id="how-it-works" className="scroll-mt-6 px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
            <div className="mx-auto max-w-[1380px]">
              <div className="max-w-xl">
                <p className="font-mono-app text-[10px] uppercase tracking-[.2em] text-accent">{t('landing.howEyebrow')}</p>
                <h2 className="mt-2 max-w-md font-display text-2xl sm:text-3xl font-bold leading-tight tracking-tight">{t('landing.howTitle')}</h2>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { step: '01', titleKey: 'landing.step1Title', bodyKey: 'landing.step1Body' },
                  { step: '02', titleKey: 'landing.step2Title', bodyKey: 'landing.step2Body' },
                  { step: '03', titleKey: 'landing.step3Title', bodyKey: 'landing.step3Body' },
                  { step: '04', titleKey: 'landing.step4Title', bodyKey: 'landing.step4Body' },
                ].map(({ step, titleKey, bodyKey }) => (
                  <div className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between" key={step}>
                    <div>
                      <span className="font-mono-app text-xs font-bold text-accent">{step}</span>
                      <h3 className="mt-4 font-display text-base font-bold">{t(titleKey as TKey)}</h3>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">{t(bodyKey as TKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
      <footer className="border-t border-border px-5 py-6 sm:px-10 lg:px-16 bg-card/30">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{t('common.appName')} · {t('common.fpoHub')}</p>
          <p className="flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5" /> Built for farmer collectives & verified food chains</p>
        </div>
      </footer>
    </div>
  );
}

function RoleLogin({ onSignedIn }: { onSignedIn: (session: AuthSession) => void }) {
  const { role: rawRole } = useParams<{ role: string }>();
  const [, navigate] = useLocation();
  const { t } = useLang();
  const role: Role = rawRole === 'fpo' || rawRole === 'admin' || rawRole === 'buyer' ? rawRole : 'farmer';
  const option = loginOptions.find((item) => item.role === role) ?? loginOptions[0];
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const signIn = useSignIn();
  const Icon = option.icon;
  const isFpo = role === 'fpo';
  const isAdmin = role === 'admin';
  const isBuyer = role === 'buyer';
  const identityPlaceholder = isFpo ? 'secretary@yourfpo.org' : isAdmin ? 'reviewer@agri.gov.in' : isBuyer ? 'buyer@amulyaagri.in' : '+91 98765 43210';

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signIn.mutate(
      { data: { role: role as AuthSignInInputRole, identity, password, rememberMe } },
      {
        onSuccess: (session) => {
          onSignedIn(session);
          navigate(workspacePath(role));
        },
      },
    );
  };

  const skipLogin = () => {
    onSignedIn(prototypeSession(role));
    navigate(workspacePath(role));
  };

  return (
    <div className="grain min-h-[100dvh] bg-background text-foreground">
      <div className="mx-auto grid min-h-[100dvh] max-w-[1500px] lg:grid-cols-[.85fr_1.15fr]">
        <div className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-14">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border-[28px] border-sidebar-primary/15 pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full border-[20px] border-primary-foreground/10 pointer-events-none" />
          <div className="relative z-10"><Logo href="/" /></div>
          <div className="relative z-10 max-w-md">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"><Icon className="h-6 w-6" /></span>
            <p className="mt-8 font-mono-app text-[10px] uppercase tracking-[.2em] text-primary-foreground/55">{t(option.eyebrowKey)}</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight">{t(option.labelKey)}</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/70">{t(option.descKey)}</p>
          </div>
          <p className="relative z-10 text-xs text-primary-foreground/45">{t('common.appName')} · {t('shell.trustTitle')}</p>
        </div>
        <div className="flex min-h-[100dvh] flex-col px-5 py-6 sm:px-10 sm:py-10 lg:px-20">
          <div className="flex items-center justify-between">
            <Logo href="/" inverse />
            <div className="flex items-center gap-3">
              <LanguageSelector />
              <Link href="/" className="text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground">{t('common.back')}</Link>
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-md flex-1 items-center py-10">
            <div className="w-full enter">
              <div className={`grid h-12 w-12 place-items-center rounded-2xl ${option.tone} lg:hidden`}><Icon className="h-5 w-5" /></div>
              <p className="mt-5 font-mono-app text-[10px] uppercase tracking-[.2em] text-accent lg:mt-0">{t(option.eyebrowKey)}</p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight">{t(option.labelKey)}</h2>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{t(option.descKey)}</p>
              <form className="mt-6 space-y-4" onSubmit={submit}>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold">{t('login.phoneLabel')}</span>
                  <div className="relative">
                    <input className="field w-full pl-10 text-sm" value={identity} onChange={(event) => setIdentity(event.target.value)} placeholder={identityPlaceholder} autoComplete="username" required data-testid={`input-login-${role}-identity`} />
                    {isAdmin || isBuyer ? <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /> : <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />}
                  </div>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold">{t('login.otpLabel')}</span>
                  <div className="relative">
                    <input className="field w-full pl-10 pr-11 text-sm" type={showPassword ? 'text' : 'password'} value={password || '123456'} onChange={(event) => setPassword(event.target.value)} placeholder="123456" autoComplete="current-password" required data-testid={`input-login-${role}-password`} />
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </div>
                </label>
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-muted-foreground cursor-pointer"><input type="checkbox" className="accent-[hsl(var(--primary))]" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} /> Keep me signed in</label>
                </div>
                <button type="submit" disabled={signIn.isPending} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60" data-testid={`button-login-${role}`}>
                  {signIn.isPending ? t('common.loading') : t('login.enterWorkspace')} <LogIn className="h-4 w-4" />
                </button>
              </form>
              <button type="button" onClick={skipLogin} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-accent/45 bg-accent/5 px-4 py-2.5 text-xs font-bold text-accent hover:bg-accent/10" data-testid={`button-skip-login-${role}`}>
                {t('login.enterWorkspace')} (Demo) <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <p className="mt-2 text-center text-[10px] text-muted-foreground">{t('login.quickDemoNote')}</p>
              {signIn.isError ? <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm leading-5 text-rose-800" role="alert" data-testid={`text-login-${role}-error`}>Sign in failed. Check credentials and retry.</p> : null}
              <div className="mt-6 flex items-start gap-2 rounded-xl border border-[hsl(var(--accent)/.22)] bg-[hsl(var(--accent)/.07)] p-3 text-xs leading-relaxed text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{t('shell.trustBody')}</span>
              </div>
              <div className="mt-6 border-t border-border pt-5">
                <p className="text-xs font-semibold text-muted-foreground">{t('login.switchRole')}</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {loginOptions.filter((item) => item.role !== role).map((item) => (
                    <Link href={item.href} className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted" key={item.role}>
                      {t(item.labelKey)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="enter">
        <p className="font-mono-app text-[10px] font-medium uppercase tracking-[.2em] text-accent">{eyebrow}</p>
        <h1 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold tracking-[-.03em] text-foreground">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function EmptyOrError({ error, label }: { error?: boolean; label?: string }) {
  const { t } = useLang();
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
      <CircleAlert className={`h-8 w-8 ${error ? 'text-destructive' : 'text-muted-foreground'}`} />
      <p className="mt-3 text-sm font-semibold">{label ?? t('common.noRecords')}</p>
    </div>
  );
}

function Home({ role }: { role: Role }) {
  if (role === 'farmer') return <FarmerOverview />;
  if (role === 'buyer') return <BuyerMarketplace />;
  if (role === 'admin') return <AdminFpos />;
  return <FpoOnboarding />;
}

function LoadingPage() {
  const { t } = useLang();
  return (
    <div className="flex h-72 items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        {t('common.loading')}
      </div>
    </div>
  );
}

interface OnboardingFormState {
  name: string;
  registrationNumber: string;
  state: string;
  district: string;
  block: string;
  villages: string;
  crops: string[];
  memberCount: number;
  totalArea: number;
  contactName: string;
  contactMobile: string;
}

function FpoOnboarding() {
  const { t, localizeState, localizeCrop } = useLang();
  const [form, setForm] = useState<OnboardingFormState>({
    name: 'Sahyadri Farmer Producer Co.',
    registrationNumber: 'FPO-MH-2023-902',
    state: 'Maharashtra',
    district: 'Pune',
    block: 'Junnar',
    villages: 'Otur, Narayangaon, Dingore',
    crops: ['Tomato', 'Onion', 'Chilli'],
    memberCount: 312,
    totalArea: 780,
    contactName: 'Mahesh Jadhav',
    contactMobile: '+91 98227 55410',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8 text-center max-w-xl mx-auto enter">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
          <BadgeCheck className="h-8 w-8" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold text-emerald-950">{t('fpo.statusTitle')}</h2>
        <p className="mt-2 text-sm text-emerald-800 leading-relaxed">{t('fpo.statusSub')}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/fpo/status" className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm">
            {t('common.view')} {t('fpo.statusTitle')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        eyebrow={t('shell.roleFpo')}
        title={t('fpo.onboardingTitle')}
        description={t('fpo.onboardingSub')}
      />
      <form onSubmit={handleSubmit} className="panel p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="font-display text-base font-bold text-primary">{t('fpo.basicInfo')}</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold">{t('fpo.fpoName')}</span>
              <input className="field w-full text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold">{t('fpo.regNo')}</span>
              <input className="field w-full text-sm font-mono-app" value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} required />
            </label>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <h3 className="font-display text-base font-bold text-primary">{t('fpo.location')}</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold">{t('fpo.state')}</span>
              <select className="field w-full text-sm" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
                {states.map((s) => <option key={s} value={s}>{localizeState(s)}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold">{t('fpo.district')}</span>
              <input className="field w-full text-sm" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} required />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold">{t('fpo.block')}</span>
              <input className="field w-full text-sm" value={form.block} onChange={(e) => setForm({ ...form, block: e.target.value })} required />
            </label>
          </div>
          <label className="block mt-3">
            <span className="mb-1 block text-xs font-semibold">{t('fpo.villages')}</span>
            <input className="field w-full text-sm" value={form.villages} onChange={(e) => setForm({ ...form, villages: e.target.value })} required />
          </label>
        </div>

        <div className="border-t border-border pt-5">
          <h3 className="font-display text-base font-bold text-primary">{t('fpo.crops')}</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold">{t('fpo.memberCount')}</span>
              <input className="field w-full text-sm" type="number" value={form.memberCount} onChange={(e) => setForm({ ...form, memberCount: Number(e.target.value) })} required />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold">{t('fpo.totalArea')}</span>
              <input className="field w-full text-sm" type="number" value={form.totalArea} onChange={(e) => setForm({ ...form, totalArea: Number(e.target.value) })} required />
            </label>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <h3 className="font-display text-base font-bold text-primary">{t('fpo.contact')}</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold">{t('fpo.contactName')}</span>
              <input className="field w-full text-sm" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} required />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold">{t('fpo.contactMobile')}</span>
              <input className="field w-full text-sm" value={form.contactMobile} onChange={(e) => setForm({ ...form, contactMobile: e.target.value })} required />
            </label>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <h3 className="font-display text-base font-bold text-primary">{t('fpo.docTitle')}</h3>
          <div className="mt-3 space-y-2.5">
            {[t('fpo.docInc'), t('fpo.docPan'), t('fpo.docAct')].map((docName) => (
              <div key={docName} className="flex items-center justify-between rounded-xl border border-border bg-background/60 p-3">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold">{docName}</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  <BadgeCheck className="h-3 w-3" /> Ready
                </span>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-95 disabled:opacity-50">
          {loading ? t('common.loading') : t('fpo.submitOnboarding')} <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function FpoStatus() {
  const { t, localizeStatus } = useLang();
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        eyebrow={t('shell.roleFpo')}
        title={t('fpo.statusTitle')}
        description={t('fpo.statusSub')}
      />
      <div className="panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="font-display text-lg font-bold">Sahyadri Farmer Producer Co.</h3>
            <p className="text-xs text-muted-foreground font-mono-app">CIN: FPO-MH-2023-902 · Maharashtra</p>
          </div>
          <StatusPill status="Under Review" />
        </div>
        <div className="space-y-3 pt-2">
          {[
            { name: 'Certificate of incorporation', file: 'sahyadri-inc.pdf', status: 'Verified' },
            { name: 'PAN card verification', file: 'sahyadri-pan.pdf', status: 'Under Review' },
            { name: 'Bylaws & member roster', file: 'sahyadri-bylaws.pdf', status: 'Pending' },
          ].map((d) => (
            <div key={d.name} className="flex items-center justify-between rounded-xl border border-border bg-card/60 p-3.5">
              <div className="flex items-center gap-3">
                <FileCheck2 className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs font-semibold">{d.name}</p>
                  <p className="text-[11px] text-muted-foreground font-mono-app">{d.file}</p>
                </div>
              </div>
              <StatusPill status={d.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Members() {
  const { t, localizeCrop, localizeName } = useLang();
  const [membersList, setMembersList] = useState(fallbackMembers);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [mobile, setMobile] = useState('');
  const [land, setLand] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newM: Member = {
      id: `m-${Date.now()}`,
      farmerId: `KA-MD-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name || 'New Farmer',
      village: village || 'Koppa',
      mobile: mobile || '+91 98765 00000',
      landholding: Number(land) || 2.0,
      crops: ['Sugarcane', 'Tomato'],
    };
    setMembersList([newM, ...membersList]);
    setShowAdd(false);
    setName('');
    setVillage('');
    setMobile('');
    setLand('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('shell.roleFpo')}
        title={t('fpo.membersTitle')}
        description={t('fpo.membersSub')}
        action={
          <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-95">
            <Users className="h-4 w-4" /> {t('fpo.addMember')}
          </button>
        }
      />
      {showAdd && (
        <form onSubmit={handleAdd} className="panel p-5 space-y-4 max-w-xl mx-auto enter border-primary/40">
          <h3 className="font-display text-base font-bold">{t('fpo.addMember')}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder={t('fpoDir.farmerName')} value={name} onChange={(e) => setName(e.target.value)} className="field text-xs" required />
            <input placeholder={t('fpoDir.farmerVillage')} value={village} onChange={(e) => setVillage(e.target.value)} className="field text-xs" required />
            <input placeholder={t('fpoDir.farmerMobile')} value={mobile} onChange={(e) => setMobile(e.target.value)} className="field text-xs" required />
            <input placeholder={t('fpoDir.landholding')} type="number" step="0.1" value={land} onChange={(e) => setLand(e.target.value)} className="field text-xs" required />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAdd(false)} className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold">{t('common.cancel')}</button>
            <button type="submit" className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground">{t('common.save')}</button>
          </div>
        </form>
      )}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[640px]">
            <thead className="bg-muted/40 font-mono-app text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">{t('fpo.farmerId')}</th>
                <th className="px-4 py-3">{t('fpo.farmerNameCol')}</th>
                <th className="px-4 py-3">{t('fpo.villageCol')}</th>
                <th className="px-4 py-3">{t('fpo.mobileCol')}</th>
                <th className="px-4 py-3">{t('fpo.landCol')}</th>
                <th className="px-5 py-3">{t('fpo.cropsCol')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {membersList.map((m) => (
                <tr key={m.id} className="hover:bg-muted/20">
                  <td className="px-5 py-3.5 font-mono-app font-semibold text-primary">{m.farmerId}</td>
                  <td className="px-4 py-3.5 font-semibold">{localizeName(m.name)}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{m.village}</td>
                  <td className="px-4 py-3.5 font-mono-app">{m.mobile}</td>
                  <td className="px-4 py-3.5">{m.landholding} ac</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {m.crops.map((c) => (
                        <span key={c} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          {localizeCrop(c)}
                        </span>
                      ))}
                    </div>
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

function FarmerFpos() {
  const { t, localizeState, localizeCrop, localizeFpo } = useLang();
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [cropFilter, setCropFilter] = useState('All');

  const filtered = fallbackFpos.filter((fpo) => {
    const matchesSearch = fpo.name.toLowerCase().includes(search.toLowerCase()) || fpo.district.toLowerCase().includes(search.toLowerCase());
    const matchesState = stateFilter === 'All' || fpo.state === stateFilter;
    const matchesCrop = cropFilter === 'All' || fpo.crops.includes(cropFilter);
    return matchesSearch && matchesState && matchesCrop;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('shell.roleFarmer')}
        title={t('fpoDir.title')}
        description={t('fpoDir.sub')}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="relative sm:col-span-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('fpoDir.searchPlaceholder')}
            className="field w-full pl-9 text-xs"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="field text-xs">
          <option value="All">{t('fpoDir.allStates')}</option>
          {states.map((s) => <option key={s} value={s}>{localizeState(s)}</option>)}
        </select>
        <select value={cropFilter} onChange={(e) => setCropFilter(e.target.value)} className="field text-xs">
          <option value="All">{t('fpoDir.allCrops')}</option>
          {cropOptions.map((c) => <option key={c} value={c}>{localizeCrop(c)}</option>)}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((fpo) => (
          <div key={fpo.id} className="panel p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </span>
                <StatusPill status={fpo.status} />
              </div>
              <h3 className="mt-3 font-display text-base font-bold leading-snug">{localizeFpo(fpo.name)}</h3>
              <p className="mt-1 text-xs text-muted-foreground font-mono-app">{fpo.district}, {localizeState(fpo.state)}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">{fpo.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {fpo.crops.map((c) => (
                  <span key={c} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground">
                    {localizeCrop(c)}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">{t('fpoDir.members', { count: fpo.memberCount })}</span>
              <Link href={`/farmer/fpo/${fpo.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                {t('fpoDir.viewProfile')} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FpoProfile() {
  const { id } = useParams<{ id: string }>();
  const { t, localizeFpo, localizeState, localizeCrop, localizeName } = useLang();
  const fpo = fallbackFpos.find((f) => f.id === id) ?? fallbackFpos[0];
  const [showJoin, setShowJoin] = useState(false);
  const [joined, setJoined] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/farmer/fpos" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> {t('common.back')}
        </Link>
        <StatusPill status={fpo.status} />
      </div>

      <div className="panel p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="font-display text-2xl font-bold">{localizeFpo(fpo.name)}</h1>
            <p className="text-xs text-muted-foreground font-mono-app mt-0.5">
              {fpo.registrationNumber} · {fpo.district}, {localizeState(fpo.state)}
            </p>
          </div>
          <button onClick={() => setShowJoin(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-95">
            {t('fpoDir.requestJoin')} <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">{fpo.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-border bg-background/60 p-3.5">
            <p className="text-[10px] font-mono-app uppercase text-muted-foreground">{t('fpo.memberCount')}</p>
            <p className="mt-1 font-display text-xl font-bold text-primary">{fpo.memberCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-background/60 p-3.5">
            <p className="text-[10px] font-mono-app uppercase text-muted-foreground">{t('fpo.totalArea')}</p>
            <p className="mt-1 font-display text-xl font-bold text-primary">{fpo.totalArea} ac</p>
          </div>
          <div className="rounded-xl border border-border bg-background/60 p-3.5">
            <p className="text-[10px] font-mono-app uppercase text-muted-foreground">{t('fpo.contactName')}</p>
            <p className="mt-1 text-xs font-bold truncate">{localizeName(fpo.contactName)}</p>
          </div>
          <div className="rounded-xl border border-border bg-background/60 p-3.5">
            <p className="text-[10px] font-mono-app uppercase text-muted-foreground">{t('fpo.contactMobile')}</p>
            <p className="mt-1 text-xs font-bold font-mono-app truncate">{fpo.contactMobile}</p>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold text-primary mb-2">{t('fpo.supportedCrops')}</h3>
          <div className="flex flex-wrap gap-1.5">
            {fpo.crops.map((c) => (
              <span key={c} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {localizeCrop(c)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {showJoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="panel max-w-md w-full p-6 space-y-4 bg-card animate-in fade-in">
            <h3 className="font-display text-lg font-bold">{t('fpoDir.joinModalTitle', { name: localizeFpo(fpo.name) })}</h3>
            <p className="text-xs text-muted-foreground">{t('fpoDir.joinModalSub')}</p>
            <div className="space-y-3">
              <input placeholder={t('fpoDir.farmerName')} className="field text-xs w-full" defaultValue="Ravi Sharma" />
              <input placeholder={t('fpoDir.farmerVillage')} className="field text-xs w-full" defaultValue="Niphad" />
              <input placeholder={t('fpoDir.farmerMobile')} className="field text-xs w-full" defaultValue="+91 98451 22000" />
              <input placeholder={t('fpoDir.landholding')} className="field text-xs w-full" defaultValue="3.5" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowJoin(false)} className="rounded-xl border border-border px-4 py-2 text-xs font-semibold">{t('common.cancel')}</button>
              <button onClick={() => { setShowJoin(false); setJoined(true); }} className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">{t('fpoDir.submitJoin')}</button>
            </div>
          </div>
        </div>
      )}

      {joined && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900 flex items-center gap-3">
          <BadgeCheck className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{t('fpoDir.joinSuccessTitle')} {t('fpoDir.joinSuccessBody', { id: 'REQ-4902' })}</span>
        </div>
      )}
    </div>
  );
}

function AdminFpos() {
  const { t, localizeState, localizeFpo } = useLang();
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('shell.roleAdmin')}
        title={t('admin.deskTitle')}
        description={t('admin.deskSub')}
      />
      <div className="space-y-3">
        {fallbackFpos.map((fpo) => (
          <div key={fpo.id} className="panel p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-bold">{localizeFpo(fpo.name)}</h3>
                <StatusPill status={fpo.status} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground font-mono-app">{fpo.registrationNumber} · {fpo.district}, {localizeState(fpo.state)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted">{t('common.details')}</button>
              <button className="rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-95">{t('admin.approve')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FpoDemandListings() {
  const { t, localizeCrop, localizeGrade, localizeNode } = useLang();
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('shell.roleFpo')}
        title={t('fpo.demandTitle')}
        description={t('fpo.demandSub')}
        action={
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm">
            <Store className="h-4 w-4" /> {t('fpo.createListing')}
          </button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {poolRequisitions.map((req, i) => (
          <div key={i} className="panel p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-base font-bold">{localizeCrop(req.crop)}</h3>
                <p className="text-xs text-muted-foreground">{req.quantity} · {req.window}</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">{req.available}</span>
            </div>
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono-app">₹{req.offer}/MT</span>
              <button className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/20">Supply lot</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FpoLogistics() {
  const { t, localizeCrop, localizeName, localizeStatus } = useLang();
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('shell.roleFpo')}
        title={t('fpo.logisticsTitle')}
        description={t('fpo.logisticsSub')}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {fleetTelemetry.map((truck) => (
          <div key={truck.vehicle} className="panel p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono-app text-xs font-bold text-primary">{truck.vehicle}</span>
              <Pill label={truck.status} />
            </div>
            <p className="text-xs font-semibold">{truck.route}</p>
            <p className="text-xs text-muted-foreground">{truck.load} · Driver: {localizeName(truck.driver)}</p>
            <div className="border-t border-border pt-2 text-xs flex justify-between text-muted-foreground">
              <span>ETA: {truck.eta}</span>
              <span>Speed: {truck.speed}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FpoAnalytics() {
  const { t } = useLang();
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('shell.roleFpo')}
        title={t('fpo.analyticsTitle')}
        description={t('fpo.analyticsSub')}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Gross produce sales', val: '₹42,85,400', note: '+24.0% vs prev month' },
          { label: 'Avg. realized price', val: '₹22.40/kg', note: '+16.8% vs mandi' },
          { label: 'Total extra income', val: '₹5,12,600', note: '~₹791 / farmer net' },
          { label: 'Freight pooling savings', val: '₹1,48,200', note: 'Avg ₹3,900 / trip' },
        ].map((s) => (
          <div key={s.label} className="panel p-5">
            <p className="text-[10px] font-mono-app uppercase text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-primary">{s.val}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FarmerOverview() {
  const { t, localizeCrop, localizeName } = useLang();
  const [supplyQty, setSupplyQty] = useState(500);
  const [notice, setNotice] = useState('');

  const confirmSupply = () => {
    setNotice(t('overview.supplying', { qty: `${supplyQty} kg` }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('overview.eyebrow')}
        title={t('overview.title')}
        description={t('overview.description')}
        action={
          <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold shadow-sm">
            <Sun className="h-4 w-4 text-amber-500" />
            <span>{t('overview.weatherLocation')} · {t('overview.weatherNow')}</span>
          </div>
        }
      />

      {notice && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 animate-in fade-in">
          {notice}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
        {/* Escrow Hero Banner */}
        <div className="panel p-6 sm:p-7 space-y-4 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[18px] border-sidebar-primary/20 pointer-events-none" />
          <div className="inline-flex items-center gap-2 rounded-full bg-sidebar-primary/20 px-3 py-1 text-xs font-bold text-sidebar-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> {t('overview.slaBadge')}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight max-w-lg">
            {t('overview.heroTitle1')} {t('overview.heroTitle2')}
          </h2>
          <p className="text-xs leading-relaxed text-primary-foreground/80 max-w-lg">
            {t('overview.heroBody')}
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link href="/farmer/sales" className="rounded-xl bg-sidebar-primary px-4 py-2.5 text-xs font-bold text-sidebar-primary-foreground shadow-sm hover:opacity-90">
              {t('overview.scheduleWeighing')}
            </Link>
            <Link href="/farmer/passbook" className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2.5 text-xs font-semibold hover:bg-primary-foreground/20">
              {t('overview.openPassbook')}
            </Link>
          </div>
        </div>

        {/* Live Rates & Mandi comparison */}
        <div className="panel p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-display text-sm font-bold">{t('overview.ratesTitle')}</h3>
              <p className="text-[11px] text-muted-foreground">{t('overview.ratesSub')}</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">{t('overview.realTime')}</span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40">
              <span className="font-bold">{localizeCrop('Tomato')}</span>
              <span className="font-mono-app font-bold text-emerald-700">₹19.50/kg (+15%)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40">
              <span className="font-bold">{localizeCrop('Onion')}</span>
              <span className="font-mono-app font-bold text-emerald-700">₹28.00/kg (Stable)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40">
              <span className="font-bold">{localizeCrop('Chilli')}</span>
              <span className="font-mono-app font-bold text-emerald-700">₹44.00/kg (+8%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Demand & Regular Pickup Cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="panel p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold text-accent">
              {t('overview.urgent')} · {t('overview.urgentDays')}
            </span>
            <span className="text-xs font-bold text-primary font-mono-app">₹19.50/kg</span>
          </div>
          <h3 className="font-display text-base font-bold">{t('overview.urgentTitle')}</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">{t('overview.urgentBody')}</p>
          <div className="flex items-center gap-3 pt-2">
            <input
              type="number"
              value={supplyQty}
              onChange={(e) => setSupplyQty(Number(e.target.value))}
              step="50"
              className="field text-xs w-28"
            />
            <button onClick={confirmSupply} className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm">
              {t('overview.iCanSupply')}
            </button>
          </div>
        </div>

        <div className="panel p-6 space-y-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold text-primary">
            {t('overview.pickupLabel')}
          </span>
          <h3 className="font-display text-base font-bold">{t('overview.pickupTitle')}</h3>
          <p className="text-xs text-muted-foreground">{t('overview.pickupPoint')}: <strong className="text-foreground">{t('overview.pickupPointVal')}</strong> ({t('overview.pickupPointNote')})</p>
          <p className="text-xs text-muted-foreground">{t('overview.driver')}: <strong className="text-foreground">{localizeName('Santosh Pawar')}</strong> · {t('overview.driverNote')}</p>
          <div className="rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-900 flex items-center justify-between">
            <span>{t('overview.pooling')}:</span>
            <strong className="text-emerald-700 font-mono-app">{t('overview.poolingVal')}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function FarmerPassbook() {
  const { t, localizeCrop } = useLang();
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('passbook.eyebrow')}
        title={t('passbook.title')}
        description={t('passbook.description')}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: t('passbook.statLifetime'), val: '₹1,94,820', note: t('passbook.statLifetimeNote') },
          { label: t('passbook.statEscrow'), val: '₹97,440', note: t('passbook.statEscrowNote') },
          { label: t('passbook.statBypassed'), val: '₹14,280', note: t('passbook.statBypassedNote') },
          { label: t('passbook.statSpeed'), val: t('passbook.statSpeedUnit'), note: t('passbook.statSpeedNote') },
        ].map((s) => (
          <div key={s.label} className="panel p-5">
            <p className="text-[10px] font-mono-app uppercase text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-primary">{s.val}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="panel p-6 space-y-4">
        <h3 className="font-display text-base font-bold">{t('passbook.tableTitle')}</h3>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[640px] text-xs">
            <thead className="bg-muted/40 font-mono-app text-[10px] uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">{t('passbook.thDispatch')}</th>
                <th className="px-4 py-3">{t('passbook.thNet')}</th>
                <th className="px-4 py-3">{t('passbook.thCredit')}</th>
                <th className="px-4 py-3">{t('passbook.thStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { lot: '#AG-8829', crop: 'Tomato', wt: '650 kg', credit: '₹12,185', utr: 'SBI928371940', status: 'Verified' },
                { lot: '#AG-8714', crop: 'Onion', wt: '1,200 kg', credit: '₹33,600', utr: 'SBI810293811', status: 'Verified' },
                { lot: '#AG-8602', crop: 'Chilli', wt: '450 kg', credit: '₹19,800', utr: 'SBI719284729', status: 'Verified' },
              ].map((row) => (
                <tr key={row.lot} className="hover:bg-muted/20">
                  <td className="px-4 py-3.5 font-semibold">{row.lot} · {localizeCrop(row.crop)}</td>
                  <td className="px-4 py-3.5">{row.wt}</td>
                  <td className="px-4 py-3.5 font-bold font-mono-app text-emerald-700">{row.credit}</td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      {row.utr}
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

function FarmerSales() {
  const { t, localizeCrop } = useLang();
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('sales.eyebrow')}
        title={t('sales.title')}
        description={t('sales.description')}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { crop: 'Tomato', rate: '₹19.50/kg', mandi: '₹17.00/kg', delta: '+₹2.50/kg' },
          { crop: 'Onion', rate: '₹28.00/kg', mandi: '₹27.80/kg', delta: '+₹0.20/kg' },
          { crop: 'Chilli', rate: '₹44.00/kg', mandi: '₹40.50/kg', delta: '+₹3.50/kg' },
        ].map((s) => (
          <div key={s.crop} className="panel p-5 space-y-2">
            <h3 className="font-display text-base font-bold">{localizeCrop(s.crop)}</h3>
            <p className="text-xs font-mono-app text-emerald-700 font-bold">FPO: {s.rate}</p>
            <p className="text-xs text-muted-foreground">Mandi: {s.mandi} ({s.delta})</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FarmerPayments() {
  const { t, localizeCrop } = useLang();
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        eyebrow={t('payments.eyebrow')}
        title={t('payments.title')}
        description={t('payments.description')}
      />
      <div className="panel p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="font-display text-lg font-bold">{t('payments.slipTitle')}</h3>
            <p className="text-xs text-muted-foreground font-mono-app">{t('payments.auditVerified')}</p>
          </div>
          <span className="font-display text-2xl font-bold text-emerald-700 font-mono-app">₹12,185</span>
        </div>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between py-2 border-b border-border/60">
            <span>{t('payments.step1Label')} ({t('payments.step1Sub')})</span>
            <span className="font-mono-app font-semibold">₹12,675.00</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/60 text-emerald-700">
            <span>{t('payments.step2Label')} ({t('payments.step2Sub')})</span>
            <span className="font-mono-app font-semibold">- ₹388.00</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/60 text-muted-foreground">
            <span>{t('payments.step3Label')} ({t('payments.step3Sub')})</span>
            <span className="font-mono-app font-semibold">- ₹102.00</span>
          </div>
          <div className="flex justify-between py-2 font-bold text-sm">
            <span>{t('payments.netCredited')} ({t('payments.toBank')})</span>
            <span className="font-mono-app text-emerald-700">₹12,185.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FarmerLogistics() {
  const { t, localizeName } = useLang();
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        eyebrow={t('logistics.eyebrow')}
        title={t('logistics.title')}
        description={t('logistics.description')}
      />
      <div className="panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            <h3 className="font-display text-base font-bold">{t('logistics.shipmentTitle')}</h3>
          </div>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">{t('logistics.inTransit')}</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 text-xs">
          <div className="p-3 rounded-xl bg-muted/40">
            <p className="text-muted-foreground font-mono-app uppercase text-[10px]">{t('logistics.mapOrigin')}</p>
            <p className="font-bold mt-1">Narayangaon Hub (09:15)</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/40">
            <p className="text-muted-foreground font-mono-app uppercase text-[10px]">{t('logistics.mapNow')}</p>
            <p className="font-bold mt-1">NH-60 (48 km/h)</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/40">
            <p className="text-muted-foreground font-mono-app uppercase text-[10px]">{t('logistics.mapDest')}</p>
            <p className="font-bold mt-1">Pune Aggregation DC (2:30 PM)</p>
          </div>
        </div>
        <div className="rounded-xl border border-border p-3.5 text-xs flex justify-between items-center">
          <span>Driver: <strong>{localizeName('Santosh Pawar')}</strong> · MH-14-GH-2384</span>
          <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">{t('logistics.callDriver')}</button>
        </div>
      </div>
    </div>
  );
}

function BuyerMarketplace() {
  const { t, localizeCrop, localizeGrade, localizeFpo, localizeNode } = useLang();
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('shell.roleBuyer')}
        title={t('buyer.marketTitle')}
        description={t('buyer.marketSub')}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {buyerAuctions.map((auc) => (
          <div key={auc.id} className="panel p-5 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono-app text-xs font-bold text-primary">{auc.id}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${auc.live ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                  {auc.live ? `Live · ${auc.closesIn}` : 'Closed'}
                </span>
              </div>
              <h3 className="mt-2 font-display text-base font-bold">{localizeCrop(auc.crop)}</h3>
              <p className="text-xs text-muted-foreground">{localizeGrade(auc.grade)} · {auc.quantity}</p>
              <p className="mt-1 text-xs text-muted-foreground font-mono-app">{localizeFpo(auc.fpo)}</p>
            </div>
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground">Top bid</p>
                <p className="font-mono-app text-sm font-bold text-emerald-700">₹{auc.topBid}/MT</p>
              </div>
              <button className="rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-95">
                Place bid
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BuyerDemands() {
  const { t, localizeCrop, localizeGrade, localizeNode } = useLang();
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('shell.roleBuyer')}
        title={t('buyer.demandsTitle')}
        description={t('buyer.demandsSub')}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {fallbackDemands.map((dem) => (
          <div key={dem.id} className="panel p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono-app text-xs font-bold text-primary">{dem.id}</span>
              <Pill label={dem.status} />
            </div>
            <h3 className="font-display text-base font-bold">{localizeCrop(dem.crop)}</h3>
            <p className="text-xs text-muted-foreground">{dem.volume} MT · {dem.repeat} · {dem.window}</p>
            <div className="border-t border-border pt-2 flex justify-between text-xs font-mono-app">
              <span>Offer: ₹{dem.offer}/MT</span>
              <span className="text-emerald-700 font-bold">{dem.matched}% matched</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BuyerOrders() {
  const { t, localizeCrop, localizeFpo } = useLang();
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('shell.roleBuyer')}
        title={t('buyer.ordersTitle')}
        description={t('buyer.ordersSub')}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fallbackOrders.map((ord) => (
          <div key={ord.id} className="panel p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono-app text-xs font-bold text-primary">{ord.id}</span>
              <Pill label={ord.status} />
            </div>
            <h3 className="font-display text-base font-bold">{localizeCrop(ord.crop)} ({ord.quantity})</h3>
            <p className="text-xs text-muted-foreground">{localizeFpo(ord.fpo)} · {ord.vehicle}</p>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${ord.progress}%` }} />
            </div>
            <p className="text-[11px] text-muted-foreground text-right">ETA: {ord.eta}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BuyerInvoices() {
  const { t, localizeFpo } = useLang();
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('shell.roleBuyer')}
        title={t('buyer.invoicesTitle')}
        description={t('buyer.invoicesSub')}
      />
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left min-w-[600px] text-xs">
            <thead className="bg-muted/40 font-mono-app text-[10px] uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Invoice</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">FPO</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Due date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {fallbackInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/20">
                  <td className="px-5 py-3.5 font-mono-app font-semibold text-primary">{inv.id}</td>
                  <td className="px-4 py-3.5 font-mono-app">{inv.order}</td>
                  <td className="px-4 py-3.5 font-semibold">{localizeFpo(inv.fpo)}</td>
                  <td className="px-4 py-3.5 font-bold font-mono-app">₹{inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{inv.due}</td>
                  <td className="px-5 py-3.5"><Pill label={inv.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Router({ session, onSignedIn, onSignOut }: { session: AuthSession; onSignedIn: (session: AuthSession) => void; onSignOut: () => void }) {
  const [location] = useLocation();
  const isPublic = location === '/' || location.startsWith('/login/');
  const user = session.user;

  if (isPublic || !user) {
    return (
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/login/:role">
          <RoleLogin onSignedIn={onSignedIn} />
        </Route>
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <AppShell user={user} onSignOut={onSignOut}>
      <Switch>
        <Route path="/workspace"><Home role={user.role as Role} /></Route>
        <Route path="/fpo/onboarding" component={FpoOnboarding} />
        <Route path="/fpo/status" component={FpoStatus} />
        <Route path="/fpo/members" component={Members} />
        <Route path="/fpo/demand" component={FpoDemandListings} />
        <Route path="/fpo/logistics" component={FpoLogistics} />
        <Route path="/fpo/analytics" component={FpoAnalytics} />
        <Route path="/farmer/sales" component={FarmerSales} />
        <Route path="/farmer/payments" component={FarmerPayments} />
        <Route path="/farmer/logistics" component={FarmerLogistics} />
        <Route path="/farmer/fpos" component={FarmerFpos} />
        <Route path="/farmer/fpo/:id" component={FpoProfile} />
        <Route path="/farmer/passbook" component={FarmerPassbook} />
        <Route path="/buyer/marketplace" component={BuyerMarketplace} />
        <Route path="/buyer/demands" component={BuyerDemands} />
        <Route path="/buyer/orders" component={BuyerOrders} />
        <Route path="/buyer/invoices" component={BuyerInvoices} />
        <Route path="/admin/fpos" component={AdminFpos} />
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function AuthenticatedApp() {
  const [session, setSession] = useState<AuthSession>(() => {
    try {
      const saved = window.localStorage.getItem('agri-connect-auth-session');
      if (saved) return JSON.parse(saved);
    } catch {}
    return prototypeSession('farmer');
  });

  const handleSignedIn = (newSession: AuthSession) => {
    setSession(newSession);
    try {
      window.localStorage.setItem('agri-connect-auth-session', JSON.stringify(newSession));
    } catch {}
  };

  const handleSignOut = () => {
    setSession({ authenticated: false, user: null });
    try {
      window.localStorage.removeItem('agri-connect-auth-session');
    } catch {}
  };

  return (
    <div className="relative min-h-[100dvh]">
      <Router session={session} onSignedIn={handleSignedIn} onSignOut={handleSignOut} />
      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <AuthenticatedApp />
            <Toaster />
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}