import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { LanguageProvider, locales, useLang, type Locale, type TKey } from './i18n';
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
const cropOptions = ['Sugarcane', 'Ragi', 'Coconut', 'Millets', 'Tur dal', 'Soybean', 'Wheat', 'Chickpea'];

const buyerNodes = ['Karad node', 'Maddur node', 'Timarni node', 'Umbraj node', 'Malavalli node'];
const inr = (value: number) => `₹${value.toLocaleString('en-IN')}`;

function buyerStatusTone(status: string) {
  if (['Delivered', 'Paid', 'Matched', 'Verified'].includes(status)) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (['Overdue', 'Delayed', 'Rejected'].includes(status)) return 'bg-rose-100 text-rose-800 border-rose-200';
  if (['In transit', 'Pooling', 'Negotiating', 'At weighbridge', 'Due'].includes(status)) return 'bg-amber-100 text-amber-900 border-amber-200';
  if (['Scheduled', 'On time', 'Ready'].includes(status)) return 'bg-sky-100 text-sky-800 border-sky-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

function Pill({ label, tone }: { label: string; tone?: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${tone ?? buyerStatusTone(label)}`} data-testid={`pill-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>{label}</span>;
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
  if (status === 'Verified' || status === 'Accepted') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (status === 'Rejected') return 'bg-rose-100 text-rose-800 border-rose-200';
  if (status === 'Under Review') return 'bg-amber-100 text-amber-900 border-amber-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

function StatusPill({ status }: { status?: string }) {
  const { localizeStatus } = useLang();
  const rawStatus = status || 'Pending';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusTone(status)}`} data-testid={`status-${rawStatus.toLowerCase().replaceAll(' ', '-')}`}>
      {rawStatus === 'Verified' ? <BadgeCheck className="h-3.5 w-3.5" /> : null}
      {localizeStatus ? localizeStatus(rawStatus) : rawStatus}
    </span>
  );
}

function Logo({ href = '/workspace', inverse = false }: { href?: string; inverse?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-3" data-testid="link-logo">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] shadow-sm">
        <Sprout className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <span>
        <span className={`block font-display text-lg font-bold tracking-tight ${inverse ? 'text-primary' : 'text-[hsl(var(--sidebar-foreground))]'}`}>AgriConnect</span>
        <span className={`block font-mono-app text-[9px] uppercase tracking-[0.22em] ${inverse ? 'text-muted-foreground' : 'text-[hsl(var(--sidebar-foreground)/.58)]'}`}>FPO hub</span>
      </span>
    </Link>
  );
}

function AppShell({ children, user, onSignOut }: { children: ReactNode; user: AuthUser; onSignOut: () => void }) {
  const role = user.role;
  const { locale, setLocale } = useLang();
  const [mobileNav, setMobileNav] = useState(false);
  const [location] = useLocation();
  const t = useLang().t;
  const nav = role === 'fpo'
    ? [
        { href: '/workspace', label: 'Overview', icon: Building2 },
        { href: '/fpo/onboarding', label: 'Verification', icon: ClipboardCheck },
        { href: '/fpo/status', label: 'Application status', icon: FileCheck2 },
        { href: '/fpo/members', label: 'Members', icon: Users },
        { href: '/fpo/demand', label: 'Demand & Listings', icon: Store },
        { href: '/fpo/logistics', label: 'Logistics & Pooling', icon: Truck },
        { href: '/fpo/analytics', label: 'Analytics', icon: BarChart3 },
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
            { href: '/buyer/marketplace', label: 'Live marketplace', icon: Gavel },
            { href: '/buyer/demands', label: 'Sourcing demands', icon: FileStack },
            { href: '/buyer/orders', label: 'Orders & tracking', icon: Truck },
            { href: '/buyer/invoices', label: 'Invoices & settlement', icon: Receipt },
          ]
        : [
            { href: '/workspace', label: 'Review desk', icon: ClipboardCheck },
            { href: '/admin/fpos', label: 'FPO submissions', icon: FileText },
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
        <div className="mt-9 rounded-2xl border border-sidebar-border bg-sidebar-accent/65 p-3">
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
        <nav className="mt-8 space-y-1.5" aria-label="Main navigation">
          <p className="mb-3 px-3 font-mono-app text-[10px] uppercase tracking-[.18em] text-sidebar-foreground/40">{t('shell.workspace')}</p>
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === '/workspace' ? location === '/workspace' : location.startsWith(href);
            return (
              <Link key={href} href={href} onClick={() => setMobileNav(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${active ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' : 'text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>
                <Icon className="h-[18px] w-[18px]" />
                {label}
                {active ? <ChevronRight className="ml-auto h-4 w-4" /> : null}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl border border-sidebar-border/80 p-4">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-sidebar-primary" />
            <div>
              <p className="text-sm font-semibold">{t('shell.trustTitle')}</p>
              <p className="mt-1 text-xs leading-5 text-sidebar-foreground/55">{t('shell.trustBody')}</p>
            </div>
          </div>
        </div>
      </aside>
      {mobileNav ? <button className="fixed inset-0 z-30 bg-[hsl(var(--foreground)/.35)] lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close navigation" data-testid="button-navigation-overlay" /> : null}
      <main className="app-shell min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/80 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 hover:bg-muted lg:hidden" onClick={() => setMobileNav(true)} data-testid="button-open-navigation"><Menu className="h-5 w-5" /></button>
            <div className="hidden text-sm text-muted-foreground sm:block">{t('shell.greeting', { name: '' })}<span className="font-semibold text-foreground">{rolePerson}</span></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {role === 'farmer' ? (
              <div className="hidden items-center gap-0.5 rounded-xl border border-border bg-card p-1 sm:flex" role="group" aria-label={t('shell.language')} data-testid="lang-switcher">
                {locales.map((item) => (
                  <button key={item.code} onClick={() => setLocale(item.code)} className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-colors ${locale === item.code ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} data-testid={`lang-${item.code}`}>{item.label}</button>
                ))}
              </div>
            ) : null}
             <span className="hidden text-xs font-semibold text-muted-foreground sm:block">{user.identity}</span>
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" data-testid="button-notifications" onClick={() => window.alert('You are all caught up.')}>
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
            </button>
             <div className="grid h-9 w-9 place-items-center rounded-full bg-[hsl(var(--accent)/.18)] text-sm font-bold text-[hsl(var(--accent))]" data-testid="avatar-current-user">{user.displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</div>
             <button onClick={onSignOut} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground" data-testid="button-sign-out">
               <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sign out</span>
             </button>
          </div>
        </header>
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-7 lg:px-10 lg:py-9">{children}</div>
      </main>
    </div>
  );
}

const loginOptions: { role: Role; label: string; eyebrow: string; description: string; icon: typeof Building2; tone: string; href: string }[] = [
  {
    role: 'farmer',
    label: 'Farmer login',
    eyebrow: 'For individual farmers',
    description: 'Find a trusted collective, send a join request and keep your membership details in one place.',
    icon: Tractor,
    tone: 'bg-[hsl(var(--accent)/.12)] text-accent',
    href: '/login/farmer',
  },
  {
    role: 'fpo',
    label: 'FPO login',
    eyebrow: 'For FPO secretaries',
    description: 'Complete verification, manage members and give your farmer network a clear public identity.',
    icon: Building2,
    tone: 'bg-[hsl(var(--primary)/.1)] text-primary',
    href: '/login/fpo',
  },
  {
    role: 'admin',
    label: 'Reviewer / Government',
    eyebrow: 'For review officers',
    description: 'Review applications, verify documents and make decisions with a transparent audit trail.',
    icon: Landmark,
    tone: 'bg-[hsl(var(--sidebar-primary)/.28)] text-primary',
    href: '/login/admin',
  },
  {
    role: 'buyer',
    label: 'Buyer login',
    eyebrow: 'For procurement teams',
    description: 'Source verified produce at fair prices, pool demand with other buyers and track every delivery live.',
    icon: Store,
    tone: 'bg-[hsl(var(--chart-4)/.16)] text-[hsl(var(--chart-4))]',
    href: '/login/buyer',
  },
];

function PublicHeader() {
  return (
    <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-10 lg:px-16">
      <Logo href="/" inverse />
      <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
        <a href="#how-it-works" className="transition-colors hover:text-foreground">How it works</a>
        <a href="#login-options" className="transition-colors hover:text-foreground">Choose your role</a>
        <Link href="/login/farmer" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/75 px-3.5 py-2.5 text-sm font-semibold text-foreground hover:bg-card">
          Sign in <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <Link href="/login/farmer" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/75 px-3 py-2 text-xs font-semibold md:hidden">
        Sign in <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </header>
  );
}

function LandingPage() {
  return (
    <div className="grain min-h-[100dvh] overflow-hidden bg-background text-foreground">
      <PublicHeader />
      <main>
        <section className="relative px-5 pb-16 pt-12 sm:px-10 sm:pb-24 sm:pt-16 lg:px-16 lg:pt-20">
          <div className="absolute -right-20 -top-20 hidden h-80 w-80 rounded-full border-[34px] border-accent/10 lg:block" />
          <div className="mx-auto grid max-w-[1380px] items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
            <div className="relative z-10 max-w-2xl enter">
              <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--primary)/.16)] bg-card/80 px-3 py-1.5 text-xs font-semibold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                A clearer path from farm to market
              </div>
              <h1 className="mt-6 max-w-2xl font-display text-5xl font-bold leading-[.98] tracking-[-.06em] text-primary sm:text-7xl">
                Stronger farms begin with <span className="text-accent">stronger circles.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                AgriConnect helps farmers, FPOs and public reviewers work from the same trusted record—so good produce gets a fairer route to the people who need it.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#login-options" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5">
                  Choose your workspace <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/75 px-5 py-3 text-sm font-semibold hover:bg-card">
                  See how it works
                </a>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-border/80 pt-6">
                {[
                  ['24', 'verified collectives'],
                  ['4,816', 'farmers connected'],
                  ['8', 'states growing together'],
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="font-display text-2xl font-bold text-primary">{value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative enter enter-delay-1">
              <div className="soft-grid relative overflow-hidden rounded-[2rem] border border-[hsl(var(--primary)/.14)] bg-[hsl(var(--primary)/.06)] p-5 sm:p-7">
                <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border-[18px] border-accent/15" />
                <div className="absolute -bottom-24 left-16 h-64 w-64 rounded-full border-[16px] border-primary/10" />
                <div className="relative z-10 rounded-2xl border border-border bg-card/90 p-5 shadow-xl shadow-primary/5 sm:p-6">
                  <div className="flex items-center justify-between border-b border-border pb-5">
                    <div>
                      <p className="font-mono-app text-[10px] uppercase tracking-[.2em] text-accent">Today in the network</p>
                      <p className="mt-2 font-display text-xl font-bold">Trust, made visible.</p>
                    </div>
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--sidebar-primary)/.75)] text-primary">
                      <Handshake className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-5 space-y-3">
                    {[
                      ['Sahyadri Farmer Producer Company', 'Pune, Maharashtra', 'Verified', 'bg-emerald-100 text-emerald-800'],
                      ['Pragati Krushi Vikas FPO', 'Nashik, Maharashtra', 'Under review', 'bg-amber-100 text-amber-900'],
                      ['Narmada Valley Growers', 'Harda, Madhya Pradesh', 'New application', 'bg-muted text-muted-foreground'],
                    ].map(([name, location, status, tone], index) => (
                      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/70 p-3" key={name}>
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          {index === 0 ? <BadgeCheck className="h-4 w-4" /> : index === 1 ? <ClipboardCheck className="h-4 w-4" /> : <Sprout className="h-4 w-4" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{name}</span>
                          <span className="mt-1 block truncate text-xs text-muted-foreground">{location}</span>
                        </span>
                        <span className={`hidden rounded-full px-2 py-1 text-[10px] font-semibold sm:inline-flex ${tone}`}>{status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-3 rounded-xl bg-primary px-4 py-3 text-primary-foreground">
                    <ShieldCheck className="h-5 w-5 text-sidebar-primary" />
                    <p className="text-xs leading-5 text-primary-foreground/80">Every application carries its own document trail, status and next step.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="login-options" className="scroll-mt-6 border-y border-border bg-card/45 px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
          <div className="mx-auto max-w-[1380px]">
            <div className="max-w-xl">
              <p className="font-mono-app text-[10px] uppercase tracking-[.2em] text-accent">One shared place, four ways in</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">Choose the work you need to do.</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Sign in to a workspace built around your role. You can switch viewpoints later from inside the demo.</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {loginOptions.map(({ role, label, eyebrow, description, icon: Icon, tone, href }, index) => (
                <Link href={href} className={`group panel lift enter enter-delay-${index + 1} relative overflow-hidden p-5 sm:p-6`} key={role} data-testid={`link-login-${role}`}>
                  <div className="flex items-start justify-between gap-4">
                    <span className={`grid h-12 w-12 place-items-center rounded-2xl ${tone}`}><Icon className="h-5 w-5" /></span>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                  <p className="mt-7 font-mono-app text-[10px] uppercase tracking-[.18em] text-muted-foreground">{eyebrow}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold">{label}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent">Continue to sign in <ArrowRight className="h-4 w-4" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-6 px-5 py-16 sm:px-10 sm:py-20 lg:px-16">
          <div className="mx-auto grid max-w-[1380px] gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="font-mono-app text-[10px] uppercase tracking-[.2em] text-accent">How AgriConnect works</p>
              <h2 className="mt-3 max-w-md font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Small, clear steps build public trust.</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">From the first FPO form to a farmer’s first request, every important action leaves a simple, understandable record.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['01', 'Share once', 'FPOs submit their identity and core documents in one guided flow.'],
                ['02', 'Review clearly', 'Officers see the same details, files and status history.'],
                ['03', 'Grow together', 'Farmers discover verified collectives and request membership.'],
              ].map(([number, title, body]) => (
                <div className="rounded-2xl border border-border bg-card p-5" key={number}>
                  <span className="font-mono-app text-xs font-semibold text-accent">{number}</span>
                  <h3 className="mt-8 font-display text-xl font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border px-5 py-6 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>AgriConnect · FPO hub</p>
          <p className="flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5" /> Built for farmer collectives across India</p>
        </div>
      </footer>
    </div>
  );
}

function RoleLogin({ onSignedIn }: { onSignedIn: (session: AuthSession) => void }) {
  const { role: rawRole } = useParams<{ role: string }>();
  const [, navigate] = useLocation();
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
  const identityLabel = isFpo ? 'Registered mobile or email' : isAdmin ? 'Official email or employee ID' : isBuyer ? 'Business email or buyer ID' : 'Mobile number';
  const identityPlaceholder = isFpo ? 'secretary@yourfpo.org' : isAdmin ? 'reviewer@agri.gov.in' : isBuyer ? 'buyer@amulyaagri.in' : '+91 98765 43210';
  const heading = isFpo ? 'Welcome back, secretary.' : isAdmin ? 'Welcome to the review desk.' : isBuyer ? 'Welcome back, buyer.' : 'Welcome back, farmer.';
  const subheading = isFpo ? 'Pick up your FPO journey where you left it.' : isAdmin ? 'Keep every verification decision clear and accountable.' : isBuyer ? 'Pool demand, win fair auctions and watch every delivery in real time.' : 'Find your collective and keep your membership close.';

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
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border-[28px] border-sidebar-primary/15" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full border-[20px] border-primary-foreground/10" />
          <div className="relative z-10"><Logo href="/" /></div>
          <div className="relative z-10 max-w-md">
            <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm`}><Icon className="h-6 w-6" /></span>
            <p className="mt-8 font-mono-app text-[10px] uppercase tracking-[.2em] text-primary-foreground/55">{option.eyebrow}</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight">{heading}</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/70">{subheading}</p>
          </div>
          <p className="relative z-10 text-xs text-primary-foreground/45">AgriConnect · Trust, made visible.</p>
        </div>
        <div className="flex min-h-[100dvh] flex-col px-5 py-6 sm:px-10 sm:py-10 lg:px-20">
          <div className="flex items-center justify-between">
            <Logo href="/" inverse />
            <Link href="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground">Back to home</Link>
          </div>
          <div className="mx-auto flex w-full max-w-md flex-1 items-center py-12">
            <div className="w-full enter">
              <div className={`grid h-12 w-12 place-items-center rounded-2xl ${option.tone} lg:hidden`}><Icon className="h-5 w-5" /></div>
              <p className="mt-6 font-mono-app text-[10px] uppercase tracking-[.2em] text-accent lg:mt-0">{option.eyebrow}</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{subheading}</p>
              <form className="mt-8 space-y-5" onSubmit={submit}>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold">{identityLabel}</span>
                  <div className="relative">
                   <input className="field w-full pl-10 text-sm" value={identity} onChange={(event) => setIdentity(event.target.value)} placeholder={identityPlaceholder} autoComplete="username" required data-testid={`input-login-${role}-identity`} />
                    {isAdmin || isBuyer ? <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /> : <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />}
                  </div>
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold">Password</span>
                  <div className="relative">
                     <input className="field w-full pl-10 pr-11 text-sm" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required minLength={4} data-testid={`input-login-${role}-password`} />
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </div>
                </label>
                <div className="flex items-center justify-between text-xs">
                   <label className="flex items-center gap-2 text-muted-foreground"><input type="checkbox" className="accent-[hsl(var(--primary))]" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} /> Keep me signed in</label>
                  <button type="button" className="font-semibold text-accent hover:underline">Forgot password?</button>
                </div>
                 <button type="submit" disabled={signIn.isPending} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60" data-testid={`button-login-${role}`}>
                   {signIn.isPending ? 'Checking details…' : 'Sign in'} <LogIn className="h-4 w-4" />
                </button>
              </form>
              <button type="button" onClick={skipLogin} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-accent/45 bg-accent/5 px-4 py-3 text-sm font-semibold text-accent hover:bg-accent/10" data-testid={`button-skip-login-${role}`}>
                Skip login <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">Prototype access only · no account required</p>
               {signIn.isError ? <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm leading-5 text-rose-800" role="alert" data-testid={`text-login-${role}-error`}>That {option.label.toLowerCase()} did not work. Check your {isAdmin ? 'official email or employee ID' : isFpo ? 'registered mobile or email' : isBuyer ? 'business email or buyer ID' : 'mobile number'} and password, then try again.</p> : null}
              <div className="mt-6 flex items-start gap-2 rounded-xl border border-[hsl(var(--accent)/.22)] bg-[hsl(var(--accent)/.07)] p-3.5 text-xs leading-5 text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                 <span>Your role and session are checked securely before the workspace opens. You can sign out at any time.</span>
              </div>
              <div className="mt-8 border-t border-border pt-6">
                <p className="text-xs font-semibold text-muted-foreground">Sign in as another role</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {loginOptions.filter((item) => item.role !== role).map((item) => <Link href={item.href} className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-muted" key={item.role}>{item.role === 'admin' ? 'Reviewer / Government' : item.label}</Link>)}
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground">By continuing, you agree to use AgriConnect for your collective’s work.</p>
        </div>
      </div>
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div className="enter">
        <p className="font-mono-app text-[10px] font-medium uppercase tracking-[.2em] text-accent">{eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-[-.035em] text-foreground sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="enter enter-delay-1 shrink-0">{action}</div> : null}
    </div>
  );
}

function EmptyOrError({ error, label = 'No records found' }: { error?: boolean; label?: string }) {
  return (
    <div className="panel flex min-h-48 flex-col items-center justify-center px-6 text-center">
      <div className={`grid h-11 w-11 place-items-center rounded-xl ${error ? 'bg-rose-100 text-rose-700' : 'bg-muted text-muted-foreground'}`}>{error ? <CircleAlert className="h-5 w-5" /> : <Leaf className="h-5 w-5" />}</div>
      <p className="mt-3 text-sm font-semibold">{error ? 'Something needs another look' : label}</p>
      <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">{error ? 'The demo data is shown where possible. Try again in a moment.' : 'When new information arrives, it will appear here.'}</p>
    </div>
  );
}

function Home({ role }: { role: Role }) {
  const { data, isLoading, isError } = useListFpos(undefined, { query: { queryKey: getListFposQueryKey(undefined) } });
  const fpos = Array.isArray(data) && data.length ? data : fallbackFpos;
  if (role === 'buyer') return <BuyerMarketplace />;
  if (role === 'farmer') return <FarmerOverview />;
  if (isLoading && !data) return <LoadingPage />;
  const verifiedCount = fpos.filter((fpo) => fpo.status === 'Verified').length;
  return (
    <div className="space-y-8">
      <section className="soft-grid relative overflow-hidden rounded-3xl border border-[hsl(var(--primary)/.15)] bg-[hsl(var(--primary)/.05)] p-6 sm:p-9 lg:p-12">
        <div className="relative z-10 max-w-2xl enter">
          <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--primary)/.16)] bg-card/75 px-3 py-1.5 text-xs font-semibold text-primary"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> A clearer path from farm to market</div>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-[1.02] tracking-[-.055em] text-primary sm:text-6xl">The people behind <span className="text-accent">stronger farms.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">One shared place for farmer collectives to prove who they are, grow their membership and earn trust in every village.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {role === 'fpo' ? <Link href="/fpo/onboarding" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90" data-testid="link-home-primary-action">Continue verification <ArrowRight className="h-4 w-4" /></Link> : null}
            {role === 'admin' ? <Link href="/admin/fpos" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90" data-testid="link-home-primary-action">Open review desk <ArrowRight className="h-4 w-4" /></Link> : null}
          </div>
        </div>
        <div className="absolute -right-12 -top-16 hidden h-72 w-72 rounded-full border-[28px] border-accent/15 lg:block" />
        <div className="absolute bottom-[-90px] right-20 hidden h-64 w-64 rounded-full border-[20px] border-primary/10 lg:block" />
        <span className="absolute bottom-8 right-10 hidden font-mono-app text-[10px] uppercase tracking-[.25em] text-primary/35 lg:block">Field note 01 / collective power</span>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'FPOs in the network', value: fpos.length + 17, note: 'across 8 states', icon: Building2 },
          { label: 'Verified collectives', value: verifiedCount + 23, note: 'ready for membership', icon: ShieldCheck },
          { label: 'Farmers connected', value: '4,816', note: 'and growing every week', icon: Users },
        ].map(({ label, value, note, icon: Icon }, index) => (
          <div className={`panel enter enter-delay-${index + 1} p-5`} key={label} data-testid={`metric-${label.toLowerCase().replaceAll(' ', '-')}`}>
            <div className="flex items-start justify-between"><p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{label}</p><Icon className="h-4 w-4 text-accent" /></div>
            <p className="mt-5 font-display text-3xl font-bold tracking-tight text-primary">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{note}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
            <div><h2 className="font-display text-xl font-bold">A living network</h2><p className="mt-1 text-xs text-muted-foreground">Recent FPOs and their verification journey</p></div>
            <Link href={role === 'admin' ? '/admin/fpos' : '/farmer/fpos'} className="text-xs font-semibold text-accent hover:underline" data-testid="link-view-network">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {fpos.slice(0, 3).map((fpo) => <Link href={`/farmer/fpos/${fpo.id}`} className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/60 sm:px-6" key={fpo.id} data-testid={`row-home-fpo-${fpo.id}`}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[hsl(var(--primary)/.08)] text-primary"><Sprout className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{fpo.name}</span><span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {fpo.district}, {fpo.state}</span></span>
              <StatusPill status={fpo.status} />
            </Link>)}
          </div>
        </div>
        <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
          <div className="flex items-center justify-between"><p className="font-mono-app text-[10px] uppercase tracking-[.2em] text-primary-foreground/60">How it works</p><span className="text-3xl font-display font-bold text-sidebar-primary">03</span></div>
          <h2 className="mt-10 max-w-xs font-display text-2xl font-bold leading-tight">Trust is built in small, clear steps.</h2>
          <div className="mt-8 space-y-4">
            {['Share your FPO details once', 'See every document status', 'Open the door for farmers'].map((item, index) => <div className="flex gap-3" key={item}><span className="font-mono-app text-xs text-sidebar-primary">0{index + 1}</span><p className="text-sm text-primary-foreground/75">{item}</p></div>)}
          </div>
        </div>
      </section>
      {isError ? <p className="text-xs text-muted-foreground" data-testid="text-home-api-note">Showing the latest saved demo records while the network reconnects.</p> : null}
    </div>
  );
}

function LoadingPage() {
  return <div className="space-y-6"><div className="h-5 w-28 animate-pulse rounded bg-muted" /><div className="h-12 w-80 animate-pulse rounded bg-muted" /><div className="grid gap-4 sm:grid-cols-3"><div className="h-32 animate-pulse rounded-2xl bg-muted" /><div className="h-32 animate-pulse rounded-2xl bg-muted" /><div className="h-32 animate-pulse rounded-2xl bg-muted" /></div><div className="h-72 animate-pulse rounded-2xl bg-muted" /></div>;
}

const onboardingSteps = ['Organisation', 'People', 'Legal identity', 'Documents', 'Review'];

function FpoOnboarding() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const submit = useSubmitFpoOnboarding();
  const [form, setForm] = useState<FpoOnboardingInput>({
    name: 'Kaveri Harvest Producer Co.',
    state: 'Karnataka',
    district: 'Mandya',
    block: 'Maddur',
    contactName: 'Nandini Gowda',
    mobile: '+91 98451 22018',
    email: 'secretary@kaveriharvest.org',
    registrationNumber: 'FPO-KA-2021-084',
    incorporationDate: '2021-08-17',
    pan: 'AAECK2841M',
    gst: '',
    legalAct: 'Companies Act, 2013',
    crops: ['Sugarcane', 'Ragi'],
    documents: [
      { id: 'inc', name: 'Certificate of incorporation', status: 'Pending', fileName: 'kaveri-incorporation.pdf' },
      { id: 'pan', name: 'PAN card', status: 'Pending', fileName: 'kaveri-pan.pdf' },
      { id: 'act', name: 'Legal act / bylaws', status: 'Pending', fileName: 'kaveri-bylaws.pdf' },
    ],
  });
  const update = (key: keyof FpoOnboardingInput, value: string) => setForm((old) => ({ ...old, [key]: value }));
  const toggleCrop = (crop: string) => setForm((old) => ({ ...old, crops: old.crops?.includes(crop) ? old.crops.filter((item) => item !== crop) : [...(old.crops || []), crop] }));
  const handleSubmit = () => submit.mutate({ data: form }, { onSuccess: () => setSubmitted(true) });
  if (submitted) return <SuccessPanel title="Your FPO is in the review queue" body="We have received Kaveri Harvest Producer Co.'s details. Keep this page handy for your document status." href="/fpo/status" action="See application status" />;
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader eyebrow="FPO secretary / verification" title="Make your collective easy to trust." description="A five-minute guided application. You can move between steps before submitting." action={<Link href="/fpo/status" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline" data-testid="link-onboarding-status">Already submitted? Check status <ArrowRight className="h-4 w-4" /></Link>} />
      <div className="panel overflow-hidden">
        <div className="border-b border-border bg-muted/35 px-5 py-5 sm:px-8">
          <div className="flex items-center justify-between gap-2 overflow-x-auto">
            {onboardingSteps.map((label, index) => <button key={label} onClick={() => index <= step && setStep(index)} className="group flex min-w-max items-center gap-2 text-left" data-testid={`button-onboarding-step-${index + 1}`}><span className={`grid h-8 w-8 place-items-center rounded-full border text-xs font-bold ${index < step ? 'border-primary bg-primary text-primary-foreground' : index === step ? 'border-accent bg-accent text-accent-foreground' : 'border-border bg-card text-muted-foreground'}`}>{index < step ? <Check className="h-4 w-4" /> : `0${index + 1}`}</span><span className={`hidden text-xs font-semibold sm:block ${index === step ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>{index < onboardingSteps.length - 1 ? <span className="mx-1 h-px w-6 bg-border sm:w-12" /> : null}</button>)}
          </div>
        </div>
        <div className="min-h-[410px] px-5 py-7 sm:px-8 sm:py-9">
          {step === 0 ? <FormSection title="Start with the organisation" note="Use the name exactly as it appears on your registration certificate."><div className="grid gap-5 md:grid-cols-2"><Field label="FPO legal name" value={form.name} onChange={(value) => update('name', value)} wide /><SelectField label="State" value={form.state} options={states} onChange={(value) => update('state', value)} /><Field label="District" value={form.district} onChange={(value) => update('district', value)} /><Field label="Block / taluk" value={form.block} onChange={(value) => update('block', value)} /></div></FormSection> : null}
          {step === 1 ? <FormSection title="Give farmers a person to reach" note="This person will be shown to reviewers and used for important updates."><div className="grid gap-5 md:grid-cols-2"><Field label="Secretary / contact name" value={form.contactName} onChange={(value) => update('contactName', value)} /><Field label="Mobile number" value={form.mobile} onChange={(value) => update('mobile', value)} /><Field label="Email address" value={form.email} onChange={(value) => update('email', value)} /><Field label="Registration number" value={form.registrationNumber} onChange={(value) => update('registrationNumber', value)} /></div></FormSection> : null}
          {step === 2 ? <FormSection title="Your legal identity" note="These details help us match your application to the right public record."><div className="grid gap-5 md:grid-cols-2"><Field label="Incorporation date" type="date" value={form.incorporationDate} onChange={(value) => update('incorporationDate', value)} /><Field label="PAN" value={form.pan} onChange={(value) => update('pan', value)} /><SelectField label="Legal act" value={form.legalAct} options={['Companies Act, 2013', 'Co-operative Societies Act', 'Producer Company Act']} onChange={(value) => update('legalAct', value)} /><Field label="GSTIN (optional)" value={form.gst || ''} onChange={(value) => update('gst', value)} /></div></FormSection> : null}
          {step === 3 ? <FormSection title="Add the papers behind the name" note="PDF, JPG or PNG files are accepted. In this demo, the file names are ready for review."><div className="space-y-3">{(form.documents || []).map((doc, index) => <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/25 p-4 sm:flex-row sm:items-center" key={doc.id}><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/12 text-accent"><FileText className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{doc.name}</p><p className="mt-1 truncate text-xs text-muted-foreground">{doc.fileName}</p></div><button onClick={() => setForm((old) => ({ ...old, documents: old.documents?.map((item, itemIndex) => itemIndex === index ? { ...item, fileName: item.fileName ? undefined : `${item.id}-document.pdf` } : item) }))} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-muted" data-testid={`button-upload-document-${doc.id}`}><UploadCloud className="h-3.5 w-3.5" /> {doc.fileName ? 'Replace file' : 'Choose file'}</button></div>)}</div><div className="mt-7"><p className="mb-3 text-sm font-semibold">Main crops</p><div className="flex flex-wrap gap-2">{cropOptions.slice(0, 6).map((crop) => <button key={crop} onClick={() => toggleCrop(crop)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${form.crops?.includes(crop) ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:border-primary/40'}`} data-testid={`button-crop-${crop.toLowerCase().replaceAll(' ', '-')}`}>{crop}</button>)}</div></div></FormSection> : null}
          {step === 4 ? <FormSection title="One last look" note="Check the details below before sending your application to the review desk."><div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">{[['Organisation', form.name], ['Location', `${form.block}, ${form.district}, ${form.state}`], ['Contact', `${form.contactName} · ${form.mobile}`], ['Legal identity', `${form.registrationNumber} · ${form.pan}`], ['Legal act', form.legalAct], ['Crops', form.crops?.join(', ') || 'Not added']].map(([label, value]) => <div key={label}><p className="font-mono-app text-[10px] uppercase tracking-[.15em] text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>)}</div><div className="mt-7 rounded-xl border border-[hsl(var(--accent)/.25)] bg-[hsl(var(--accent)/.07)] p-4 text-sm leading-6 text-foreground"><ShieldCheck className="mb-2 h-5 w-5 text-accent" /><p>By submitting, you confirm that these details belong to your FPO and that the documents can be reviewed by AgriConnect staff.</p></div></FormSection> : null}
        </div>
        <div className="flex items-center justify-between border-t border-border bg-muted/20 px-5 py-4 sm:px-8">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40" data-testid="button-onboarding-back"><ChevronLeft className="h-4 w-4" /> Back</button>
          {step < 4 ? <button onClick={() => setStep(Math.min(4, step + 1))} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90" data-testid="button-onboarding-next">Save and continue <ChevronRight className="h-4 w-4" /></button> : <button onClick={handleSubmit} disabled={submit.isPending} className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-60" data-testid="button-submit-onboarding">{submit.isPending ? 'Sending application…' : 'Submit for review'} <ArrowRight className="h-4 w-4" /></button>}
        </div>
      </div>
      {submit.isError ? <p className="mt-3 text-sm text-destructive" data-testid="text-onboarding-error">We could not send this yet. Please check the details and try again.</p> : null}
    </div>
  );
}

function FormSection({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return <div><h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2><p className="mt-2 text-sm text-muted-foreground">{note}</p><div className="mt-7">{children}</div></div>;
}

function Field({ label, value, onChange, type = 'text', wide = false, placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; wide?: boolean; placeholder?: string }) {
  return <label className={`block ${wide ? 'md:col-span-2' : ''}`}><span className="mb-2 block text-xs font-semibold text-foreground">{label}</span><input className="field w-full text-sm" type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} data-testid={`input-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`} /></label>;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-2 block text-xs font-semibold text-foreground">{label}</span><select className="field w-full text-sm" value={value} onChange={(event) => onChange(event.target.value)} data-testid={`select-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function SuccessPanel({ title, body, href, action }: { title: string; body: string; href: string; action: string }) {
  return <div className="mx-auto flex min-h-[65vh] max-w-xl items-center justify-center"><div className="panel w-full p-8 text-center sm:p-12"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><Check className="h-7 w-7" /></span><p className="mt-6 font-mono-app text-[10px] uppercase tracking-[.2em] text-accent">All set</p><h1 className="mt-2 font-display text-3xl font-bold tracking-tight">{title}</h1><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">{body}</p><Link href={href} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground" data-testid="link-success-next">{action} <ArrowRight className="h-4 w-4" /></Link></div></div>;
}

function FpoStatus() {
  const fpoId = 'fpo-1';
  const { data, isLoading, isError } = useGetFpoOnboarding(fpoId, { query: { enabled: Boolean(fpoId), queryKey: getGetFpoOnboardingQueryKey(fpoId) } });
  const fpo = data && typeof data === 'object' ? data : fallbackFpos[0];
  if (isLoading && !data) return <LoadingPage />;
  const docs = fpo.documents || [];
  return <div className="mx-auto max-w-5xl"><PageHeader eyebrow="FPO secretary / application" title="Your application, in plain sight." description="A transparent view of what has been received, what is being checked and what comes next." action={<StatusPill status={fpo.status} />} /><div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><div className="space-y-6"><div className="panel p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-muted-foreground">Application</p><h2 className="mt-2 font-display text-2xl font-bold">{fpo.name}</h2><p className="mt-1 text-sm text-muted-foreground">{fpo.registrationNumber} · submitted 12 Jun 2024</p></div><span className="hidden h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary sm:grid"><ClipboardCheck className="h-5 w-5" /></span></div><div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-3"><div><p className="text-xs text-muted-foreground">Location</p><p className="mt-1 text-sm font-semibold">{fpo.district}, {fpo.state}</p></div><div><p className="text-xs text-muted-foreground">Contact person</p><p className="mt-1 text-sm font-semibold">{fpo.contactName}</p></div><div><p className="text-xs text-muted-foreground">Main crops</p><p className="mt-1 text-sm font-semibold">{fpo.crops.slice(0, 2).join(' · ')}</p></div></div></div><div className="panel overflow-hidden"><div className="border-b border-border px-5 py-4 sm:px-7"><h2 className="font-display text-xl font-bold">Document trail</h2><p className="mt-1 text-xs text-muted-foreground">Each file gets its own review status.</p></div><div className="divide-y divide-border">{docs.map((doc) => <DocumentRow doc={doc} key={doc.id} />)}</div></div></div><div className="space-y-6"><div className="rounded-2xl bg-primary p-6 text-primary-foreground"><p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-primary-foreground/55">Next step</p><h2 className="mt-4 font-display text-2xl font-bold">Keep your phone close.</h2><p className="mt-3 text-sm leading-6 text-primary-foreground/70">A reviewer may call if a document needs a clearer copy. No need to resubmit the whole application.</p><div className="mt-6 flex items-center gap-2 text-sm font-semibold text-sidebar-primary"><Bell className="h-4 w-4" /> Updates will appear here</div></div><div className="panel p-5"><p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-muted-foreground">Application timeline</p><div className="mt-5 space-y-5">{[['Application started', '12 Jun 2024', true], ['Documents received', '12 Jun 2024', true], ['Review in progress', 'Current stage', fpo.status === 'Under Review']].map(([label, date, active]) => <div className="flex gap-3" key={label as string}><span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${active ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>{active ? <Check className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />}</span><div><p className="text-sm font-semibold">{label as string}</p><p className="mt-0.5 text-xs text-muted-foreground">{date as string}</p></div></div>)}</div></div></div></div>{isError ? <p className="mt-4 text-xs text-muted-foreground" data-testid="text-status-api-note">Showing the saved application record while we reconnect.</p> : null}</div>;
}

function DocumentRow({ doc }: { doc: DocumentStatus }) {
  return <div className="flex items-center gap-3 px-5 py-4 sm:px-7" data-testid={`row-document-${doc.id}`}><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : doc.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'}`}>{doc.status === 'Verified' ? <Check className="h-4 w-4" /> : <FileText className="h-4 w-4" />}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{doc.name}</p><p className="mt-1 truncate text-xs text-muted-foreground">{doc.fileName || 'File not uploaded'}</p></div><StatusPill status={doc.status} /></div>;
}

function Members() {
  const fpoId = 'fpo-1';
  const { data } = useListMembers(fpoId, { query: { enabled: true, queryKey: getListMembersQueryKey(fpoId) } });
  const members = Array.isArray(data) && data.length ? data : fallbackMembers;
  const addMember = useAddMember();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', village: '', mobile: '', landholding: '', crops: 'Ragi' });
  const visible = members.filter((member) => `${member.name} ${member.village} ${member.farmerId}`.toLowerCase().includes(search.toLowerCase()));
  const submit = () => addMember.mutate({ fpoId, data: { ...newMember, landholding: Number(newMember.landholding), crops: [newMember.crops] } }, { onSuccess: () => { setModal(false); setNewMember({ name: '', village: '', mobile: '', landholding: '', crops: 'Ragi' }); queryClient.invalidateQueries({ queryKey: getListMembersQueryKey(fpoId) }); } });
  const download = () => { const csv = ['Farmer ID,Name,Village,Mobile,Landholding (acres),Crops', ...members.map((m) => `${m.farmerId},${m.name},${m.village},${m.mobile},${m.landholding},${m.crops.join(' / ')}`)].join('\n'); const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); const link = document.createElement('a'); link.href = url; link.download = 'kaveri-harvest-members.csv'; link.click(); URL.revokeObjectURL(url); };
  return <div><PageHeader eyebrow="FPO secretary / people" title="Your member directory." description="Keep the collective's people easy to find, easy to contact and ready to act together." action={<div className="flex flex-wrap gap-2"><button onClick={download} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm font-semibold hover:bg-muted" data-testid="button-download-members"><Download className="h-4 w-4" /> CSV</button><button onClick={() => setModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90" data-testid="button-add-member"><span className="text-lg leading-none">+</span> Add farmer</button></div>} /><div className="panel overflow-hidden"><div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><div className="relative w-full max-w-md"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input className="field w-full pl-9 text-sm" placeholder="Search by name, village or farmer ID" value={search} onChange={(event) => setSearch(event.target.value)} data-testid="input-search-members" /></div><p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">{visible.length}</span> of {members.length} members</p></div>{visible.length ? <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead className="bg-muted/45 font-mono-app text-[10px] uppercase tracking-[.13em] text-muted-foreground"><tr><th className="px-5 py-3 font-medium">Farmer</th><th className="px-5 py-3 font-medium">Village</th><th className="px-5 py-3 font-medium">Mobile</th><th className="px-5 py-3 font-medium">Holding</th><th className="px-5 py-3 font-medium">Crops</th></tr></thead><tbody className="divide-y divide-border">{visible.map((member) => <tr className="transition-colors hover:bg-muted/35" key={member.id} data-testid={`row-member-${member.id}`}><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-accent/12 text-xs font-bold text-accent">{member.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><div><p className="text-sm font-semibold">{member.name}</p><p className="mt-0.5 font-mono-app text-[10px] text-muted-foreground">{member.farmerId}</p></div></div></td><td className="px-5 py-4 text-sm">{member.village}</td><td className="px-5 py-4 font-mono-app text-xs">{member.mobile}</td><td className="px-5 py-4 text-sm">{member.landholding} acres</td><td className="px-5 py-4"><div className="flex flex-wrap gap-1.5">{member.crops.map((crop) => <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-medium" key={crop}>{crop}</span>)}</div></td></tr>)}</tbody></table></div> : <div className="p-5"><EmptyOrError label="No member matches that search" /></div>}</div>{modal ? <Modal title="Add a farmer" onClose={() => setModal(false)}><div className="grid gap-4 sm:grid-cols-2"><Field label="Farmer name" value={newMember.name} onChange={(value) => setNewMember({ ...newMember, name: value })} /><Field label="Village" value={newMember.village} onChange={(value) => setNewMember({ ...newMember, village: value })} /><Field label="Mobile" value={newMember.mobile} onChange={(value) => setNewMember({ ...newMember, mobile: value })} /><Field label="Landholding (acres)" value={newMember.landholding} onChange={(value) => setNewMember({ ...newMember, landholding: value })} /><SelectField label="Primary crop" value={newMember.crops} options={cropOptions} onChange={(value) => setNewMember({ ...newMember, crops: value })} /></div><ModalActions onCancel={() => setModal(false)} onConfirm={submit} loading={addMember.isPending} confirm="Add to directory" /></Modal> : null}</div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-[hsl(var(--foreground)/.38)] p-4" role="dialog" aria-modal="true"><div className="panel max-h-[90dvh] w-full max-w-lg overflow-auto bg-card p-6 shadow-2xl sm:p-7"><div className="flex items-center justify-between"><h2 className="font-display text-2xl font-bold">{title}</h2><button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-muted" data-testid="button-close-modal"><X className="h-5 w-5" /></button></div><div className="mt-6">{children}</div></div></div>;
}

function ModalActions({ onCancel, onConfirm, loading, confirm, disabled }: { onCancel: () => void; onConfirm: () => void; loading?: boolean; confirm: string; disabled?: boolean }) {
  return <div className="mt-7 flex justify-end gap-2"><button onClick={onCancel} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted" data-testid="button-modal-cancel">Cancel</button><button onClick={onConfirm} disabled={loading || disabled} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50" data-testid="button-modal-confirm">{loading ? 'Saving…' : confirm}</button></div>;
}

function FarmerFpos() {
  const { t, localizeState, localizeCrop } = useLang();
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [crop, setCrop] = useState('');
  const params = { search: search || undefined, state: state || undefined, crop: crop || undefined };
  const { data, isLoading, isError } = useListFpos(params, { query: { queryKey: getListFposQueryKey(params) } });
  const fpos = (Array.isArray(data) && data.length ? data : fallbackFpos).filter((fpo) => (!search || `${fpo.name} ${fpo.district}`.toLowerCase().includes(search.toLowerCase())) && (!state || fpo.state === state) && (!crop || fpo.crops.includes(crop)));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('fpos.eyebrow')}
        title={t('fpos.title')}
        description={t('fpos.description')}
      />
      <div className="panel p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end gap-3.5">
          <div>
            <label className="mb-2 block text-xs font-semibold text-foreground">{t('fpos.searchLabel')}</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="field h-11 w-full pl-9 text-sm"
                placeholder={t('fpos.searchPlaceholder')}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                data-testid="input-search-fpos"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold text-foreground">{t('fpos.stateLabel')}</label>
            <select
              className="field h-11 w-full text-sm"
              value={state}
              onChange={(event) => setState(event.target.value)}
              data-testid="select-state"
            >
              <option value="">{t('fpos.allStates')}</option>
              {states.map((s) => (
                <option key={s} value={s}>{localizeState(s)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold text-foreground">{t('fpos.cropLabel')}</label>
            <select
              className="field h-11 w-full text-sm"
              value={crop}
              onChange={(event) => setCrop(event.target.value)}
              data-testid="select-crop"
            >
              <option value="">{t('fpos.allCrops')}</option>
              {cropOptions.map((c) => (
                <option key={c} value={c}>{localizeCrop(c)}</option>
              ))}
            </select>
          </div>
          <div>
            <button
              onClick={() => { setSearch(''); setState(''); setCrop(''); }}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold hover:bg-muted transition-colors"
              data-testid="button-clear-filters"
            >
              <ListFilter className="h-4 w-4 text-muted-foreground" /> {t('fpos.clearFilters')}
            </button>
          </div>
        </div>
      </div>
      {isLoading && !data ? (
        <LoadingPage />
      ) : fpos.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {fpos.map((fpo, index) => <FpoCard fpo={fpo} key={fpo.id} index={index} />)}
        </div>
      ) : (
        <EmptyOrError error={isError} label={t('fpos.noResults')} />
      )}
    </div>
  );
}

function FpoCard({ fpo, index }: { fpo: Fpo; index?: number }) {
  const { t, localizeState, localizeCrop } = useLang();
  return (
    <Link
      href={`/farmer/fpos/${fpo.id}`}
      className={`panel lift enter enter-delay-${Math.min((index || 0) + 1, 3)} flex flex-col justify-between overflow-hidden p-5 h-full`}
      data-testid={`card-fpo-${fpo.id}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
            <Sprout className="h-5 w-5" />
          </span>
          <StatusPill status={fpo.status} />
        </div>
        <h2 className="mt-5 font-display text-xl font-bold leading-tight">{fpo.name}</h2>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" /> {fpo.block}, {fpo.district}, {localizeState(fpo.state)}
        </p>
        <p className="mt-3.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{fpo.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {fpo.crops.slice(0, 3).map((crop) => (
            <span key={crop} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
              {localizeCrop(crop)}
            </span>
          ))}
          {fpo.crops.length > 3 ? (
            <span className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[11px] text-muted-foreground">
              +{fpo.crops.length - 3}
            </span>
          ) : null}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">
          <strong className="text-foreground font-semibold">{fpo.memberCount}</strong> {t('fpos.membersLabel')}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
          {t('fpos.viewProfile')} <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

function FpoProfile() {
  const { id = 'fpo-1' } = useParams<{ id: string }>();
  const { t, localizeState, localizeCrop } = useLang();
  const { data, isLoading } = useGetFpo(id, { query: { enabled: Boolean(id), queryKey: getGetFpoQueryKey(id) } });
  const fpo = data && typeof data === 'object' ? data : fallbackFpos.find((item) => item.id === id) || fallbackFpos[0];
  if (isLoading && !data) return <LoadingPage />;
  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/farmer/fpos" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground" data-testid="link-back-fpos">
        <ChevronLeft className="h-4 w-4" /> {t('fpos.allFpos')}
      </Link>
      <div className="panel overflow-hidden">
        <div className="bg-primary p-6 text-primary-foreground sm:p-9">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div className="flex items-start gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground">
                <Sprout className="h-7 w-7" />
              </span>
              <div>
                <StatusPill status={fpo.status} />
                <h1 className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight">{fpo.name}</h1>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-primary-foreground/70">
                  <MapPin className="h-4 w-4" /> {fpo.block}, {fpo.district}, {localizeState(fpo.state)}
                </p>
              </div>
            </div>
            <Link href={`/farmer/join/${fpo.id}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-sidebar-primary px-4 py-3 text-sm font-bold text-sidebar-primary-foreground hover:opacity-90" data-testid="link-join-fpo">
              {t('fpos.requestMembership')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="grid gap-6 p-6 sm:p-9 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-accent">{t('fpos.aboutCollective')}</p>
            <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">{fpo.description}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Metric label={t('fpos.membersLabel')} value={String(fpo.memberCount)} />
              <Metric label={t('fpos.landRepresented')} value={`${fpo.totalArea} ac`} />
              <Metric label={t('fpos.villages')} value={String(fpo.villages.length)} />
            </div>
            <div className="mt-8">
              <h2 className="font-display text-xl font-bold">{t('fpos.whatMembersGrow')}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {fpo.crops.map((crop) => (
                  <span className="rounded-full bg-muted px-3 py-2 text-xs font-semibold" key={crop}>
                    {localizeCrop(crop)}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-muted/50 p-5">
            <p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-muted-foreground">{t('fpos.contactReach')}</p>
            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs text-muted-foreground">{t('fpos.secretary')}</p>
                <p className="mt-1 text-sm font-semibold">{fpo.contactName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('fpos.phone')}</p>
                <p className="mt-1 font-mono-app text-sm font-medium">{fpo.contactMobile}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('fpos.villagesServed')}</p>
                <p className="mt-1 text-sm font-semibold leading-6">{fpo.villages.join(' · ')}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('fpos.registration')}</p>
                <p className="mt-1 font-mono-app text-sm font-medium">{fpo.registrationNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-border bg-card p-4"><p className="font-display text-2xl font-bold text-primary">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>;
}

function JoinFpo() {
  const { id = 'fpo-1' } = useParams<{ id: string }>();
  const { t, localizeState, localizeCrop } = useLang();
  const fpo = fallbackFpos.find((item) => item.id === id) || fallbackFpos[0];
  const [stage, setStage] = useState<'details' | 'otp' | 'done'>('details');
  const [otp, setOtp] = useState('');
  const [form, setForm] = useState({ name: '', village: '', mobile: '', landholding: '', crops: 'Ragi' });
  const createRequest = useCreateJoinRequest();
  const [requestId, setRequestId] = useState('');
  const queryClient = useQueryClient();
  const submit = () => createRequest.mutate({ data: { fpoId: fpo.id, name: form.name, village: form.village, mobile: form.mobile, landholding: Number(form.landholding), crops: [form.crops] } }, { onSuccess: (request) => { setRequestId(request.requestId); setStage('done'); queryClient.invalidateQueries({ queryKey: getGetJoinRequestQueryKey(request.requestId) }); } });

  return (
    <div className="mx-auto max-w-4xl">
      <Link href={`/farmer/fpos/${fpo.id}`} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground" data-testid="link-back-profile">
        <ChevronLeft className="h-4 w-4" /> {t('fpos.backTo', { name: fpo.name })}
      </Link>
      <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
        <div className="rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8">
          <p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-primary-foreground/55">{t('fpos.membershipRequest')}</p>
          <h1 className="mt-5 font-display text-3xl font-bold leading-tight">{t('fpos.joinTitle')}</h1>
          <p className="mt-4 text-sm leading-6 text-primary-foreground/70">{t('fpos.joinSubtitle', { name: fpo.name })}</p>
          <div className="mt-10 border-t border-primary-foreground/15 pt-5">
            <p className="text-xs text-primary-foreground/55">{t('fpos.joining')}</p>
            <p className="mt-1 text-sm font-semibold">{fpo.name}</p>
            <p className="mt-1 text-xs text-primary-foreground/60">{fpo.district}, {localizeState(fpo.state)}</p>
          </div>
        </div>
        <div className="panel p-6 sm:p-8">
          {stage === 'details' ? (
            <>
              <p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-accent">{t('fpos.step1')}</p>
              <h2 className="mt-2 font-display text-2xl font-bold">{t('fpos.step1Title')}</h2>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <Field label={t('fpos.fullName')} value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
                <Field label={t('fpos.village')} value={form.village} onChange={(value) => setForm({ ...form, village: value })} />
                <Field label={t('fpos.mobile')} value={form.mobile} onChange={(value) => setForm({ ...form, mobile: value })} />
                <Field label={t('fpos.landholding')} value={form.landholding} onChange={(value) => setForm({ ...form, landholding: value })} />
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-xs font-semibold text-foreground">{t('fpos.mainCrop')}</span>
                  <select className="field w-full text-sm" value={form.crops} onChange={(e) => setForm({ ...form, crops: e.target.value })}>
                    {cropOptions.map((c) => (
                      <option key={c} value={c}>{localizeCrop(c)}</option>
                    ))}
                  </select>
                </label>
              </div>
              <button onClick={() => setStage('otp')} disabled={!form.name || !form.mobile} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-45" data-testid="button-send-otp">
                {t('fpos.sendOtp')} <ArrowRight className="h-4 w-4" />
              </button>
            </>
          ) : null}
          {stage === 'otp' ? (
            <>
              <p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-accent">{t('fpos.step2')}</p>
              <h2 className="mt-2 font-display text-2xl font-bold">{t('fpos.step2Title')}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{t('fpos.otpSentNote', { mobile: form.mobile })}</p>
              <label className="mt-7 block">
                <span className="mb-2 block text-xs font-semibold">{t('fpos.otpLabel')}</span>
                <input className="field w-full text-center font-mono-app text-lg tracking-[.5em]" value={otp} onChange={(event) => setOtp(event.target.value)} maxLength={4} inputMode="numeric" placeholder="0000" data-testid="input-otp" />
              </label>
              <button onClick={submit} disabled={otp !== '1234' || createRequest.isPending} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-45" data-testid="button-verify-submit">
                {createRequest.isPending ? t('fpos.sendingRequest') : t('fpos.verifySubmit')} <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => setStage('details')} className="mt-3 w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted" data-testid="button-edit-join-details">
                {t('fpos.editDetails')}
              </button>
              {createRequest.isError ? <p className="mt-3 text-sm text-destructive">{t('fpos.sendError')}</p> : null}
            </>
          ) : null}
          {stage === 'done' ? <JoinConfirmation requestId={requestId} fpo={fpo} /> : null}
        </div>
      </div>
    </div>
  );
}

function JoinConfirmation({ requestId, fpo }: { requestId: string; fpo: Fpo }) {
  const { t, localizeStatus } = useLang();
  const { data } = useGetJoinRequest(requestId || 'pending', { query: { enabled: Boolean(requestId), queryKey: getGetJoinRequestQueryKey(requestId || 'pending') } });
  return (
    <div className="py-4 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
        <Check className="h-7 w-7" />
      </span>
      <p className="mt-6 font-mono-app text-[10px] uppercase tracking-[.2em] text-accent">{t('fpos.requestSentPill')}</p>
      <h2 className="mt-2 font-display text-3xl font-bold">{t('fpos.requestSentTitle')}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">{t('fpos.requestSentBody', { name: fpo.name })}</p>
      <div className="mx-auto mt-7 max-w-sm rounded-xl bg-muted/60 p-4 text-left">
        <p className="text-xs text-muted-foreground">{t('fpos.requestRef')}</p>
        <p className="mt-1 font-mono-app text-sm font-semibold">{data?.requestId || requestId || 'Pending'}</p>
        <p className="mt-3 text-xs text-muted-foreground">{t('fpos.statusLabel')}</p>
        <p className="mt-1 text-sm font-semibold">{localizeStatus ? localizeStatus(data?.status || 'Pending') : data?.status || 'Pending review'}</p>
      </div>
      <Link href="/farmer/fpos" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline" data-testid="link-back-discovery">
        {t('fpos.exploreMore')} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function AdminFpos() {
  const [status, setStatus] = useState('');
  const params = { status: status || undefined };
  const { data, isLoading } = useListAdminFpos(params, { query: { queryKey: getListAdminFposQueryKey(params) } });
  const fpos = Array.isArray(data) && data.length ? data : fallbackFpos;
  return <div><PageHeader eyebrow="Review desk / queue" title="Make the next decision clear." description="A focused queue for checking FPO identity, documents and the people behind each submission." action={<div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-semibold"><Filter className="h-4 w-4 text-accent" /><select className="bg-transparent outline-none" value={status} onChange={(event) => setStatus(event.target.value)} data-testid="select-review-status"><option value="">All statuses</option><option value="Pending">Pending</option><option value="Under Review">Under Review</option><option value="Verified">Verified</option><option value="Rejected">Rejected</option></select></div>} /><div className="grid gap-4 sm:grid-cols-3">{[['Needs attention', fpos.filter((f) => f.status === 'Pending').length + 4], ['In review', fpos.filter((f) => f.status === 'Under Review').length + 2], ['Verified this month', 18]].map(([label, value]) => <div className="panel p-5" key={label as string}><p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{label as string}</p><p className="mt-4 font-display text-3xl font-bold text-primary">{value as number}</p></div>)}</div><div className="panel mt-6 overflow-hidden">{isLoading && !data ? <LoadingPage /> : <div className="divide-y divide-border">{fpos.filter((fpo) => !status || fpo.status === status).map((fpo) => <Link href={`/admin/fpos/${fpo.id}`} className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/35 sm:flex-row sm:items-center sm:px-6" key={fpo.id} data-testid={`row-review-fpo-${fpo.id}`}><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Building2 className="h-5 w-5" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-bold">{fpo.name}</h2><StatusPill status={fpo.status} /></div><p className="mt-1 text-xs text-muted-foreground">{fpo.registrationNumber} · {fpo.district}, {fpo.state}</p></div><div className="grid grid-cols-2 gap-6 text-left sm:flex sm:items-center"><div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Documents</p><p className="mt-1 text-sm font-semibold">{fpo.documents.length} submitted</p></div><div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Received</p><p className="mt-1 text-sm font-semibold">12 Jun 2024</p></div><ArrowRight className="hidden h-4 w-4 text-muted-foreground sm:block" /></div></Link>)}</div>}</div></div>;
}

function AdminDetail() {
  const { id = 'fpo-1' } = useParams<{ id: string }>();
  const { data, isLoading } = useGetAdminFpo(id, { query: { enabled: Boolean(id), queryKey: getGetAdminFpoQueryKey(id) } });
  const review = data && typeof data === 'object' && 'fpo' in data ? data : { fpo: fallbackFpos.find((item) => item.id === id) || fallbackFpos[0], auditLog: [{ id: '1', actor: 'Review desk', action: 'Application received', at: '12 Jun 2024', detail: 'Documents are ready for review.' }] };
  const decide = useDecideFpo();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState('');
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  if (isLoading && !data) return <LoadingPage />;
  const fpo = review.fpo;
  const complete = fpo.documents.filter((doc) => doc.status === 'Verified').length;
  const submitDecision = () => { if (!decision) return; decide.mutate({ fpoId: id, data: { decision, reason: decision === 'reject' ? reason : null } }, { onSuccess: () => { setDecision(null); queryClient.invalidateQueries({ queryKey: getGetAdminFpoQueryKey(id) }); queryClient.invalidateQueries({ queryKey: getListAdminFposQueryKey(undefined) }); } }); };
  return <div className="mx-auto max-w-6xl"><Link href="/admin/fpos" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground" data-testid="link-back-review-queue"><ChevronLeft className="h-4 w-4" /> Review queue</Link><PageHeader eyebrow="Review desk / case file" title={fpo.name} description={`${fpo.registrationNumber} · ${fpo.district}, ${fpo.state}`} action={<StatusPill status={fpo.status} />} /><div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]"><div className="space-y-6"><div className="panel p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-muted-foreground">Identity details</p><h2 className="mt-2 font-display text-xl font-bold">Does the record line up?</h2></div><div className="text-right"><p className="font-display text-2xl font-bold text-primary">{complete}/{fpo.documents.length}</p><p className="text-xs text-muted-foreground">documents verified</p></div></div><div className="mt-7 grid gap-5 border-t border-border pt-6 sm:grid-cols-2"><ReviewDatum label="FPO legal name" value={fpo.name} /><ReviewDatum label="Contact person" value={`${fpo.contactName} · ${fpo.contactMobile}`} /><ReviewDatum label="Location" value={`${fpo.block}, ${fpo.district}, ${fpo.state}`} /><ReviewDatum label="Member count" value={`${fpo.memberCount} farmers`} /><ReviewDatum label="Registration number" value={fpo.registrationNumber} /><ReviewDatum label="Crops" value={fpo.crops.join(' · ')} /></div></div><div className="panel overflow-hidden"><div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-7"><div><h2 className="font-display text-xl font-bold">Document verification</h2><p className="mt-1 text-xs text-muted-foreground">Check each file before making a decision.</p></div><button onClick={() => window.alert('Document bundle download started.')} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted" data-testid="button-download-document-bundle"><Download className="h-3.5 w-3.5" /> Bundle</button></div><div className="divide-y divide-border">{fpo.documents.map((doc) => <DocumentRow doc={doc} key={doc.id} />)}</div></div></div><div className="space-y-6"><div className="panel p-5 sm:p-6"><p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-accent">Decision</p><h2 className="mt-2 font-display text-2xl font-bold">Ready to close this case?</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Approve when the identity and papers agree. Reject only with a reason the secretary can act on.</p><div className="mt-6 grid gap-3"><button onClick={() => setDecision('approve')} className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm font-semibold text-emerald-800 hover:bg-emerald-100" data-testid="button-approve-fpo">Approve FPO <Check className="h-4 w-4" /></button><button onClick={() => setDecision('reject')} className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-left text-sm font-semibold text-rose-800 hover:bg-rose-100" data-testid="button-reject-fpo">Request changes <X className="h-4 w-4" /></button></div></div><div className="panel p-5"><p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-muted-foreground">Audit trail</p><div className="mt-5 space-y-4">{review.auditLog.map((log) => <div className="flex gap-3" key={log.id}><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" /><div><p className="text-sm font-semibold">{log.action}</p><p className="mt-1 text-xs text-muted-foreground">{log.actor} · {log.at}</p>{log.detail ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{log.detail}</p> : null}</div></div>)}</div></div></div></div>{decision ? <Modal title={decision === 'approve' ? 'Approve this FPO?' : 'Request changes'} onClose={() => setDecision(null)}>{decision === 'approve' ? <p className="text-sm leading-6 text-muted-foreground">This will mark <strong className="text-foreground">{fpo.name}</strong> as verified and make it discoverable to farmers.</p> : <label className="block"><span className="mb-2 block text-xs font-semibold">Reason for the secretary</span><textarea className="field min-h-28 w-full resize-none text-sm" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="For example: please upload a clearer PAN card scan." data-testid="textarea-rejection-reason" /></label>}<ModalActions onCancel={() => setDecision(null)} onConfirm={submitDecision} loading={decide.isPending} confirm={decision === 'approve' ? 'Confirm approval' : 'Send request for changes'} disabled={decision === 'reject' && !reason.trim()} /></Modal> : null}</div>;
}

function ReviewDatum({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold leading-5">{value}</p></div>;
}

type FpoDemandSignal = { id: string; buyer: string; segment: string; location: string; item: string; volume: string; priceRange: string; priceLabel: string; mandiSpot: string; premium: string; window: string; committed: number; committedLabel: string; remainingLabel: string; pct: number; pctTone: string; locked: boolean; lockedBy?: string; action: string; };

const fpoDemandSignals: FpoDemandSignal[] = [
  { id: 'DEM-2024-01', buyer: 'Pune Retailers Consortium', segment: 'Retail Consortium', location: 'Hadapsar & Kothrud Depots', item: '15.0 MT Grade-A Tomato', volume: '15.0 MT', priceLabel: '₹19.50 – ₹21.00 /kg', priceRange: '₹19.50-21.00', mandiSpot: '₹18.20/kg', premium: '+9.8% Premium', window: 'Staggered 7-Day Dispatch', committed: 8.5, committedLabel: '8.5 MT Committed', remainingLabel: '6.5 MT Remaining', pct: 56, pctTone: 'bg-primary', locked: false, action: 'Pool supply against demand' },
  { id: 'DEM-2024-02', buyer: 'Mumbai HoReCa Network', segment: 'Hospitality Corridor', location: 'Andheri & Bandra Central Kitchens', item: '8.0 MT Red Onion (Grade A)', volume: '8.0 MT', priceLabel: '₹28.50 /kg fixed', priceRange: '₹28.50', mandiSpot: '₹26.00/kg', premium: '+9.6% Premium', window: 'Immediate Dispatch (48 hrs)', committed: 8, committedLabel: 'Fully Matched (8.0 / 8.0 MT)', remainingLabel: '100%', pct: 100, pctTone: 'bg-emerald-600', locked: true, lockedBy: 'Locked by Sahyadri Cluster Unit #2', action: 'Capacity reached — waitlist only' },
  { id: 'DEM-2024-03', buyer: 'Navi Mumbai Wholesale Hub', segment: 'Terminal Mandi', location: 'Vashi APMC Market II', item: '3.5 MT Green Chilli (G4)', volume: '3.5 MT', priceLabel: '₹42.00 /kg', priceRange: '₹42.00', mandiSpot: '₹38.50/kg', premium: '+9.1% Premium', window: 'Rolling 5-Day Delivery', committed: 1.5, committedLabel: '1.5 MT Committed', remainingLabel: '2.0 MT Open Deficit', pct: 43, pctTone: 'bg-accent', locked: false, action: 'Fulfil open 2.0 MT deficit' },
];

type FpoProduceLot = { id: string; crop: string; grade: string; gradeTone: string; detail: string; farmers: string; farmersNote: string; cluster: string; volume: string; volumeNote: string; reserve: string; reserveNote: string; benchmark: string; spread: string; topBid: string; bidDelta: string; buyer: string; buyerNote: string; status: string; statusTone: string; statusNote: string; settleTone: string; };

const fpoProduceLots: FpoProduceLot[] = [
  { id: '#AG-8829', crop: 'Roma Tomato (Field Fresh)', grade: 'Grade-A', gradeTone: 'bg-emerald-100 text-emerald-800 border-emerald-200', detail: 'Brix: 4.8° • Shelf-life: 94%', farmers: '4 Farmers Pooled', farmersNote: 'Ramesh Patil (250 kg), S. Shinde, +2', cluster: 'Cluster: Narayangaon West', volume: '650 kg', volumeNote: '26 Crated Bins', reserve: '₹19.00 / kg', reserveNote: 'Min: ₹12,350', benchmark: '₹18.20 / kg', spread: '+9.8% Spread', topBid: '₹20.00 / kg', bidDelta: '+5.2% over min', buyer: 'BigBasket Pune Hub', buyerNote: 'Valid 4h • RBI Escrow ready', status: 'Open (3 Bids)', statusTone: 'bg-amber-100 text-amber-900 border-amber-200', statusNote: 'Escrow Locked: ₹13,000', settleTone: 'bg-amber-100 text-amber-900 border-amber-200' },
  { id: '#AG-8810', crop: 'Red Onion (Nashik Quality)', grade: 'Medium Grade', gradeTone: 'bg-amber-100 text-amber-900 border-amber-200', detail: 'Cured & Sorted • 0% Sprout', farmers: '18 Farmers Pooled', farmersNote: 'Sub-depot Junnar consolidation', cluster: 'Cluster: Pune North Ridge', volume: '4,200 kg', volumeNote: '84 Mesh Bags', reserve: '₹27.50 / kg', reserveNote: 'Min: ₹1,15,500', benchmark: '₹26.00 / kg', spread: '+11.5% Spread', topBid: '₹29.00 / kg', bidDelta: '+5.4%', buyer: 'Sahyadri Fresh Retail', buyerNote: 'Contract ID: #SND-2024-881', status: 'Accepted & Locked', statusTone: 'bg-emerald-100 text-emerald-800 border-emerald-200', statusNote: 'Vehicle arriving 16:30', settleTone: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: '#AG-8840', crop: 'Soybean (JS-335 High Protein)', grade: 'Certified NPOP', gradeTone: 'bg-emerald-100 text-emerald-800 border-emerald-200', detail: 'Moisture < 10% • Lab Verified', farmers: '12 Farmers Pooled', farmersNote: 'Shirur Sub-Cluster Group', cluster: 'Cluster: Pune East Block', volume: '8,500 kg', volumeNote: '170 Jute Bags', reserve: '₹48.00 / kg', reserveNote: 'Min: ₹4,08,000', benchmark: '₹44.50 / kg', spread: '+7.8% Spread', topBid: '₹50.20 / kg', bidDelta: '+4.5% over min', buyer: 'ITC Agri Sourcing Hub', buyerNote: 'Institutional contract draft active', status: 'Under Review (2 Bids)', statusTone: 'bg-amber-100 text-amber-900 border-amber-200', statusNote: 'Escrow Ready: ₹4,26,700', settleTone: 'bg-amber-100 text-amber-900 border-amber-200' },
];

function FpoDemandListings() {
  const [tab, setTab] = useState<'demand' | 'listings'>('demand');
  const [notice, setNotice] = useState('');
  const [lotModal, setLotModal] = useState(false);
  const [acceptOn, setAcceptOn] = useState<FpoProduceLot | null>(null);
  const [crop, setCrop] = useState('Roma Tomato (Grade A Export Quality)');
  const [quantity, setQuantity] = useState('');
  const [reserve, setReserve] = useState('');
  const [selected, setSelected] = useState<string[]>(['Ramesh Patil', 'Suresh Shinde']);
  const showNotice = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 4000); };
  const toggleFarmer = (name: string) => setSelected((old) => (old.includes(name) ? old.filter((item) => item !== name) : [...old, name]));
  const publishLot = () => { setLotModal(false); setCrop('Roma Tomato (Grade A Export Quality)'); setQuantity(''); setReserve(''); setSelected(['Ramesh Patil', 'Suresh Shinde']); showNotice('New produce lot pooled & broadcast to verified institutional buyers.'); };
  const acceptBid = () => { if (!acceptOn) return; setAcceptOn(null); showNotice(`Contract executed for ${acceptOn.id}. Escrow locked under NABARD Tier-1 framework.`); };
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="FPO secretary / demand & listings" title="Match collective harvest with institutional demand." description="Pool smallholder lots, track buyer signals and lock NABARD Tier-1 escrow payouts — all in one place. Prototype view with sample data." action={<div className="flex flex-wrap gap-2"><button onClick={() => setLotModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90" data-testid="button-aggregate-new-lot"><span className="text-lg leading-none">+</span> Aggregate new lot</button><button onClick={() => showNotice('Sourcing matrix download started.')} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold hover:bg-muted" data-testid="button-download-matrix"><Download className="h-4 w-4" /> Download matrix</button></div>} />
      {notice ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" data-testid="text-demand-notice">{notice}</p> : null}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Live pool volume', value: '26.5', unit: 'Metric Tons', note: '+18% vs last week', icon: Scale },
          { label: 'Bids under settlement', value: '₹14.8', unit: 'Lakhs', note: '6 institutional contracts active', icon: Gavel },
          { label: 'Participating smallholders', value: '84', unit: 'Active members', note: '4 village clusters grouped', icon: Users },
          { label: 'Escrow guarantee', value: '100%', unit: 'NABARD Tier-1', note: 'Zero counterparty default risk', icon: ShieldCheck },
        ].map(({ label, value, unit, note, icon: Icon }, index) => (
          <div className={`panel enter enter-delay-${index + 1} p-5`} key={label}>
            <div className="flex items-start justify-between"><p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{label}</p><Icon className="h-4 w-4 text-accent" /></div>
            <p className="mt-4 font-display text-3xl font-bold tracking-tight text-primary">{value} <span className="text-xs font-semibold text-muted-foreground">{unit}</span></p>
            <p className="mt-1 text-xs text-muted-foreground">{note}</p>
          </div>
        ))}
      </section>
      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex self-start gap-1 rounded-xl border border-border bg-card p-1">
            {([['demand', 'Institutional demand signals', '3 live'], ['listings', 'Our lots & bids', `${fpoProduceLots.length} lots`]] as const).map(([key, label, count]) => (
              <button key={key} onClick={() => setTab(key)} className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${tab === key ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} data-testid={`tab-${key}`}>{label}<span className={`rounded-full px-1.5 py-0.5 text-[10px] ${tab === key ? 'bg-primary-foreground/15' : 'bg-muted'}`}>{count}</span></button>
            ))}
          </div>
          {tab === 'demand' ? <div className="flex items-center gap-2 text-xs"><Filter className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Corridor:</span><select className="field w-auto text-xs" defaultValue="All Maharashtra Corridors"><option>All Maharashtra Corridors</option><option>Pune Metropole (PCMC/PMC)</option><option>Navi Mumbai (Vashi APMC)</option><option>Mumbai HoReCa Corridor</option></select></div> : null}
        </div>
      </section>
      {tab === 'demand' ? (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div><h2 className="font-display text-xl font-bold">Institutional sourcing requisitions</h2><p className="mt-1 text-xs text-muted-foreground">Locked bulk orders matching your cluster&apos;s capacity.</p></div>
            <button onClick={() => setTab('listings')} className="text-xs font-semibold text-accent hover:underline">View FPO produce bids <ArrowRight className="ml-1 inline h-3 w-3" /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {fpoDemandSignals.map((signal) => (
              <div className="panel flex flex-col p-5" key={signal.id} data-testid={`card-demand-${signal.id}`}>
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[hsl(var(--primary)/.08)] text-primary"><Store className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5"><span className="rounded-full bg-[hsl(var(--accent)/.12)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">{signal.segment}</span>{signal.locked ? <Pill label="Locked" tone="bg-emerald-100 text-emerald-800 border-emerald-200" /> : null}</div>
                    <h3 className="mt-1.5 font-display text-base font-bold leading-snug">{signal.buyer}</h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3 text-accent" /> {signal.location}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5 rounded-xl bg-muted/45 p-3.5 text-xs">
                  <div className="flex justify-between gap-3"><span className="text-muted-foreground">Requisition:</span><span className="font-semibold">{signal.item}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-muted-foreground">Offered price:</span><span className="font-bold text-emerald-700">{signal.priceLabel}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-muted-foreground">APMC spot:</span><span className="font-semibold">{signal.mandiSpot} <em className="font-bold text-emerald-700">{signal.premium}</em></span></div>
                  <div className="flex justify-between gap-3 border-t border-border pt-1.5"><span className="text-muted-foreground">Delivery:</span><span className="font-semibold">{signal.window}</span></div>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline justify-between text-xs font-semibold"><span className={signal.pct === 100 ? 'text-emerald-700' : ''}>{signal.committedLabel}</span><span className="text-muted-foreground">{signal.remainingLabel}</span></div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${signal.pctTone}`} style={{ width: `${signal.pct}%` }} /></div>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">{signal.locked ? signal.lockedBy : 'Volumes are from verified member weight-checks.'}</p>
                </div>
                <button onClick={() => showNotice(`Supply pooled against ${signal.buyer}. A bid agreement is ready for escrow settlement.`)} disabled={signal.locked} className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground" data-testid={`button-pool-${signal.id}`}>{signal.locked ? <LockKeyhole className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}{signal.action}</button>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="font-display text-xl font-bold">Active pooled lots & buyer bids</h2><p className="mt-1 text-xs text-muted-foreground">Consolidated batches offered to vetted institutional channels.</p></div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800"><ShieldCheck className="h-3.5 w-3.5" /> NABARD escrow active</span>
          </div>
          <div className="panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left">
                <thead className="bg-muted/45 font-mono-app text-[10px] uppercase tracking-[.13em] text-muted-foreground"><tr><th className="px-5 py-3 font-medium">Lot & crop</th><th className="px-4 py-3 font-medium">Farmers pooled</th><th className="px-4 py-3 text-right font-medium">Volume</th><th className="px-4 py-3 text-right font-medium">Reserve</th><th className="px-4 py-3 text-right font-medium">APMC benchmark</th><th className="px-4 py-3 font-medium">Highest bid</th><th className="px-4 py-3 text-center font-medium">Status</th><th className="px-5 py-3 text-right font-medium">Action</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {fpoProduceLots.map((lot) => (
                    <tr className="align-top hover:bg-muted/25" key={lot.id}>
                      <td className="px-5 py-4"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[hsl(var(--primary)/.08)] text-primary"><Package className="h-5 w-5" /></span><div><div className="flex items-center gap-1.5"><p className="font-display text-sm font-bold">{lot.id}</p><Pill label={lot.grade} tone={lot.gradeTone} /></div><p className="mt-0.5 text-xs font-semibold">{lot.crop}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{lot.detail}</p></div></div></td>
                      <td className="px-4 py-4"><p className="flex items-center gap-1 text-xs font-bold"><Users className="h-3.5 w-3.5 text-accent" /> {lot.farmers}</p><p className="mt-0.5 max-w-[170px] truncate text-[11px] text-muted-foreground">{lot.farmersNote}</p><p className="mt-0.5 text-[11px] font-medium text-accent">{lot.cluster}</p></td>
                      <td className="px-4 py-4 text-right"><p className="font-display text-sm font-bold">{lot.volume}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{lot.volumeNote}</p></td>
                      <td className="px-4 py-4 text-right"><p className="text-xs font-semibold">{lot.reserve}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{lot.reserveNote}</p></td>
                      <td className="px-4 py-4 text-right"><p className="text-xs text-muted-foreground">{lot.benchmark}</p><p className="mt-0.5 text-[11px] font-bold text-emerald-700">{lot.spread}</p></td>
                      <td className="px-4 py-4"><div className="rounded-xl border border-border bg-muted/30 p-2.5"><p className="font-display text-sm font-bold text-emerald-700">{lot.topBid}</p><p className="mt-0.5 text-[11px] text-emerald-700">{lot.bidDelta}</p><p className="mt-0.5 truncate text-xs font-semibold">{lot.buyer}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{lot.buyerNote}</p></div></td>
                      <td className="px-4 py-4 text-center"><Pill label={lot.status} tone={lot.settleTone} /><p className="mt-1.5 text-[10px] text-muted-foreground">{lot.statusNote}</p></td>
                      <td className="px-5 py-4 text-right">{lot.status.includes('Accepted') ? <div className="flex flex-col items-end gap-1.5"><button onClick={() => showNotice(`Generating gate pass & e-way manifest for ${lot.id}...`)} className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-bold hover:bg-muted/70" data-testid={`button-dispatch-${lot.id}`}><Truck className="h-3.5 w-3.5 text-accent" /> Gate pass & e-way</button></div> : <div className="flex flex-col items-end gap-1.5"><button onClick={() => setAcceptOn(lot)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90" data-testid={`button-accept-${lot.id}`}><Check className="h-3.5 w-3.5" /> Accept bid</button><div className="flex gap-1.5"><button onClick={() => showNotice(`Counter-offer transmitted to ${lot.buyer} on ${lot.id}.`)} className="rounded-md bg-muted px-2 py-1 text-[11px] font-semibold hover:bg-muted/70">Counter</button><button onClick={() => showNotice(`Bid declined for ${lot.id}. The lot remains active on spot mandi.`)} className="rounded-md bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-rose-50 hover:text-rose-700">Decline</button></div></div>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
      <section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <div className="panel p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5"><Navigation className="h-5 w-5 text-accent" /><div><h3 className="font-display text-base font-bold">Consolidated freight corridor (Pune – Vashi APMC reefer)</h3><p className="mt-0.5 text-xs text-muted-foreground">Member freight savings from shared-line haul.</p></div></div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-800">Member freight savings: 34%</span>
          </div>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">By consolidating Lot #AG-8829 (Roma Tomato) and Lot #AG-8810 (Nashik Onion) into a shared 14-ft reefer vehicle, participating FPO farmers save ₹4,800 on line-haul carriage.</p>
          <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted/30 p-3.5 text-xs sm:grid-cols-4">
            {[['Origin depot', 'Narayangaon', 'Loading 14:00'], ['Consolidation', 'Chakan Agri-Yard', 'Weighment 16:15'], ['Drop 1', 'BigBasket Hub', 'Est. 18:30'], ['Terminal drop', 'Vashi APMC', 'Est. 23:00']].map(([label, value, note]) => (
              <div key={label as string}><p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-0.5 font-display text-sm font-bold">{value}</p><p className="mt-0.5 text-[10px] text-accent">{note}</p></div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Users className="h-3.5 w-3.5 text-accent" /> 22 total farmers bundled in current route transit</div>
            <button onClick={() => setTab('listings')} className="rounded-lg bg-muted px-3.5 py-1.5 text-xs font-bold hover:bg-muted/70">Manage dispatch fleet</button>
          </div>
        </div>
        <div className="panel p-6">
          <div className="flex items-center justify-between"><h3 className="font-display text-base font-bold">Quality assured benchmark</h3><BadgeCheck className="h-5 w-5 text-emerald-600" /></div>
          <p className="mt-3 text-xs leading-6 text-muted-foreground">All member produce undergoes grading assay before digital mandi listing to ensure buyer non-rejection.</p>
          <div className="mt-3 space-y-2 text-xs">
            {[['Refractometer brix', '4.8° Brix (Optimum)'], ['Pesticide MRL clearance', 'Passed lab scan'], ['Physical sorting rejection', 'Only 2.1% (Low)']].map(([label, value]) => (
              <div className="flex items-center justify-between border-b border-border/70 py-1.5 last:border-0" key={label}><span className="text-muted-foreground">{label}</span><span className={value.includes('Passed') ? 'font-bold text-emerald-700' : 'font-bold'}>{value}</span></div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[hsl(var(--accent)/.2)] bg-[hsl(var(--accent)/.07)] p-3 text-[11px]"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><div><p className="font-bold">Buyer rejection guarantee</p><p className="mt-0.5 leading-5 text-muted-foreground">Secondary APMC buyer buffer standing by at Vashi depot in case of gate delay.</p></div></div>
        </div>
      </section>
      {acceptOn ? (
        <Modal title={`Execute contract — ${acceptOn.id}`} onClose={() => setAcceptOn(null)}>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><p className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4" /> 100% NABARD escrow protected</p><p className="mt-1 text-xs leading-5">Buyer funds are parked in an RBI-regulated nodal escrow. Payment releases automatically upon digital weighbridge sign-off at depot.</p></div>
          <div className="mt-4 space-y-2.5 text-xs">
            {[['Buyer', acceptOn.buyer], ['Commodity', acceptOn.crop], ['Lot volume', acceptOn.volume], ['Offered unit price', acceptOn.topBid], ['Total gross escrow', acceptOn.reserveNote], ['Freight contribution', '70% Buyer / 30% FPO Pool']].map(([label, value]) => (
              <div className="flex items-center justify-between border-b border-border/60 py-1.5 last:border-0" key={label}><span className="text-muted-foreground">{label}</span><span className="font-semibold">{value}</span></div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Prototype only — payout splits to member farmers happen on T+1 via UPI/NEFT.</p>
          <ModalActions onCancel={() => setAcceptOn(null)} onConfirm={acceptBid} confirm="Execute & lock in escrow" />
        </Modal>
      ) : null}
      {lotModal ? (
        <Modal title="Aggregate new produce lot" onClose={() => setLotModal(false)}>
          <p className="text-xs text-muted-foreground">Pool smallholder harvests into one institutional batch.</p>
          <div className="mt-5 space-y-4"><Field label="Crop commodity & variety" value={crop} onChange={setCrop} wide /><div className="grid gap-4 sm:grid-cols-2"><Field label="Total quantity (kg)" value={quantity} onChange={setQuantity} /><Field label="FPO reserve price (₹/kg)" value={reserve} onChange={setReserve} /></div></div>
          <div className="mt-5"><p className="mb-2 text-xs font-semibold">Select member farmers for consolidation</p><div className="space-y-2 rounded-xl border border-border bg-muted/25 p-3">{[['Ramesh Patil', '(350 kg Narayangaon)'], ['Suresh Shinde', '(420 kg Junnar)'], ['Ganesh More', '(600 kg Alephata)']].map(([name, note]) => <label className="flex cursor-pointer items-center gap-2.5" key={name}><input type="checkbox" className="h-4 w-4 accent-primary" checked={selected.includes(name)} onChange={() => toggleFarmer(name)} data-testid={`checkbox-farmer-${name.toLowerCase().replaceAll(' ', '-')}`} /><span className="text-xs font-semibold">{name}</span><span className="text-[11px] text-muted-foreground">{note}</span></label>)}</div></div>
          <div className="mt-5"><p className="mb-2 text-xs font-semibold">Target market mandis / corridors</p><div className="flex flex-wrap gap-2"><span className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground">Pune Metro</span><span className="rounded-full bg-muted px-3 py-1.5 text-[11px] font-bold text-muted-foreground">Vashi APMC</span><span className="rounded-full bg-muted px-3 py-1.5 text-[11px] font-bold text-muted-foreground">Mumbai HoReCa</span></div></div>
          <ModalActions onCancel={() => setLotModal(false)} onConfirm={publishLot} confirm="Publish collective lot" disabled={!quantity || !reserve} />
        </Modal>
      ) : null}
    </div>
  );
}

type FpoTruck = { fpo: string; volume: string; pct: number; tone: string };

const fpoTruck: FpoTruck[] = [
  { fpo: 'Sahyadri FPO', volume: '3.2T · 32%', pct: 32, tone: 'bg-[#16332E]' },
  { fpo: 'Junnar Kisan FPO', volume: '4.1T · 41%', pct: 41, tone: 'bg-[#E5A93C]' },
  { fpo: 'Shivneri Organic FPO', volume: '1.8T · 18%', pct: 18, tone: 'bg-emerald-700' },
];

const fpoFreightCompare = [
  { route: 'Narayangaon → Vashi APMC', dedicated: 4800, pooled: 3264, saving: 1536, pct: 32 },
  { route: 'Junnar → Pune Retail Depots', dedicated: 3200, pooled: 2368, saving: 832, pct: 26 },
  { route: 'Alephata → Mumbai HoReCa', dedicated: 6900, pooled: 4830, saving: 2070, pct: 30 },
];

const fpoManifest = [
  { farmer: 'Ramesh Patil', village: 'Narayangaon', fpo: 'Sahyadri FPO', crop: 'Roma Tomato', kg: 250, crates: '10 crates' },
  { farmer: 'Suresh Shinde', village: 'Junnar', fpo: 'Junnar Kisan FPO', crop: 'Red Onion', kg: 420, crates: '8 mesh bags' },
  { farmer: 'Kavita Bhor', village: 'Otur', fpo: 'Shivneri Organic FPO', crop: 'Green Chilli (G4)', kg: 180, crates: '6 crates' },
  { farmer: 'Tukaram Jadhav', village: 'Alephata', fpo: 'Sahyadri FPO', crop: 'Roma Tomato', kg: 300, crates: '12 crates' },
];

function FpoLogistics() {
  const [notice, setNotice] = useState('');
  const showNotice = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 4000); };
  const totalPct = fpoTruck.reduce((sum, item) => sum + item.pct, 0);
  const overallSaving = fpoFreightCompare.reduce((sum, row) => sum + row.saving, 0);
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="FPO secretary / logistics & pooling" title="Share the truck. Keep every rupee on the farm." description="Consolidate produce across FPOs into shared dispatches and cut freight, fuel and hassle per kilo. Prototype view with sample data." action={<div className="flex flex-wrap gap-2"><button onClick={() => showNotice('Multi-FPO dispatch contact sheet ready.')} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold hover:bg-muted" data-testid="button-new-schedule"><FileStack className="h-4 w-4" /> Plan shared dispatch</button><button onClick={() => showNotice('Waybill & manifest download started.')} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90" data-testid="button-download-waybill"><Download className="h-4 w-4" /> Download waybill</button></div>} />
      {notice ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" data-testid="text-logistics-notice">{notice}</p> : null}
      <section className="soft-grid relative overflow-hidden rounded-3xl border border-[hsl(var(--primary)/.15)] bg-[hsl(var(--primary)/.05)] p-6 sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--primary)/.16)] bg-card/75 px-3 py-1.5 text-xs font-semibold text-primary"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Next multi-FPO dispatch</div>
            <h2 className="mt-4 font-display text-2xl font-bold leading-tight text-primary sm:text-3xl">Narayangaon → Vashi APMC reefer leaves in 2h 15m.</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">14 lots from 3 FPOs share one 14-ft chilled truck. Consolidated weighment at Chakan Agri-Yard, terminal drop at Vashi before 23:00.</p>
          </div>
          <div className="grid shrink-0 grid-cols-2 gap-3">
            {[['Capacity used', '91%'], ['Farmers bundled', '38'], ['Est. arrival', '23:00'], ['Per-kg freight', '₹1.62']].map(([label, value]) => (
              <div className="rounded-xl border border-border bg-card/80 px-4 py-3" key={label}><p className="font-display text-xl font-bold text-primary">{value}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{label}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Freight cost saved', value: '32%', note: 'vs dedicated trips', icon: TrendingDown },
          { label: 'Truck capacity used', value: '91%', note: 'across 14 lots', icon: Gauge },
          { label: 'Consolidated farmers', value: '14 Lots', note: 'from 3 FPO clusters', icon: Users },
          { label: 'Transit carbon offset', value: '118 kg', note: 'CO₂e this dispatch', icon: Leaf },
        ].map(({ label, value, note, icon: Icon }, index) => (
          <div className={`panel enter enter-delay-${index + 1} p-5`} key={label}>
            <div className="flex items-start justify-between"><p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{label}</p><Icon className="h-4 w-4 text-accent" /></div>
            <p className="mt-4 font-display text-3xl font-bold tracking-tight text-primary">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{note}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <div className="panel p-6">
          <div className="flex items-center justify-between gap-3"><div><h3 className="font-display text-base font-bold">Shared-truck capacity plan</h3><p className="mt-0.5 text-xs text-muted-foreground">Each segment is a pooled FPO load on this reefer.</p></div><Pill label="14-ft chilled reefer" tone="bg-sky-100 text-sky-800 border-sky-200" /></div>
          <div className="mt-5 flex h-10 w-full overflow-hidden rounded-xl border border-border">
            {fpoTruck.map((segment) => <div key={segment.fpo} className={`${segment.tone} relative flex items-center justify-center text-[10px] font-bold text-primary-foreground`} style={{ width: `${segment.pct}%` }} title={`${segment.fpo} · ${segment.pct}%`}>{segment.pct > 12 ? Math.round(segment.pct) : null}</div>)}
            <div className="flex items-center justify-center bg-muted text-[10px] font-bold text-muted-foreground" style={{ width: `${100 - totalPct}%` }} title="Available">{100 - totalPct}%</div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {fpoTruck.map((segment) => (
              <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/25 px-3.5 py-3" key={segment.fpo}><span className={`h-3 w-3 shrink-0 rounded-full ${segment.tone}`} /><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{segment.fpo}</p><p className="text-[11px] text-muted-foreground">{segment.volume} of 10T capacity</p></div></div>
            ))}
            <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-border px-3.5 py-3"><span className="h-3 w-3 shrink-0 rounded-full bg-muted" /><div className="min-w-0 flex-1"><p className="text-xs font-semibold">Available</p><p className="text-[11px] text-muted-foreground">0.9T open for a nearby FPO</p></div></div>
          </div>
          <button onClick={() => showNotice('Open capacity shared with neighbouring FPO network.')} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-semibold text-accent-foreground hover:opacity-90" data-testid="button-open-capacity">Release open 0.9T capacity <ArrowRight className="h-3.5 w-3.5" /></button>
        </div>
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6"><div><h3 className="font-display text-base font-bold">Freight cost breakdown</h3><p className="mt-0.5 text-xs text-muted-foreground">Dedicated vs pooled trips.</p></div><Pill label={`₹${inr(overallSaving)} saved`} tone="bg-emerald-100 text-emerald-800 border-emerald-200" /></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[480px] text-left"><thead className="bg-muted/45 font-mono-app text-[10px] uppercase tracking-[.13em] text-muted-foreground"><tr><th className="px-5 py-3 font-medium">Route</th><th className="px-3 py-3 text-right font-medium">Dedicated</th><th className="px-3 py-3 text-right font-medium">Pooled</th><th className="px-5 py-3 text-right font-medium">Savings</th></tr></thead><tbody className="divide-y divide-border">{fpoFreightCompare.map((row) => (<tr className="hover:bg-muted/25" key={row.route}><td className="px-5 py-3.5 text-xs font-semibold">{row.route}</td><td className="px-3 py-3.5 text-right text-xs text-muted-foreground">{inr(row.dedicated)}</td><td className="px-3 py-3.5 text-right text-xs font-semibold">{inr(row.pooled)}</td><td className="px-5 py-3.5 text-right text-xs font-bold text-emerald-700">{inr(row.saving)} · {row.pct}%</td></tr>))}</tbody></table></div>
          <div className="border-t border-border bg-muted/20 px-5 py-3 text-xs text-muted-foreground"><span className="font-bold text-foreground">{inr(overallSaving)}</span> pooled for this week&apos;s corridor. <Truck className="ml-0.5 inline h-3.5 w-3.5" /></div>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6"><div><h3 className="font-display text-base font-bold">Route preview & HALT waypoints</h3><p className="mt-0.5 text-xs text-muted-foreground">Mock map of today&apos;s consolidated run.</p></div><span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600" /> Truck moving</span></div>
          <div className="relative">
            <div className="relative h-64 overflow-hidden bg-[#EEF1E8]" data-testid="mock-map">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <pattern id="mock-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#DCE4D2" strokeWidth="1" /></pattern>
                <rect width="600" height="240" fill="url(#mock-grid)" />
                <path d="M-20 190 C 120 150, 200 120, 320 90 S 560 40, 620 20" fill="none" stroke="#C4D3C2" strokeWidth="22" strokeLinecap="round" />
                <path d="M-20 190 C 120 150, 200 120, 320 90 S 560 40, 620 20" fill="none" stroke="#9FB89B" strokeWidth="4" strokeDasharray="10 8" />
                <path d="M-20 120 C 150 110, 320 130, 620 100" fill="none" stroke="#D8E2D3" strokeWidth="12" strokeLinecap="round" />
              </svg>
              {[
                { label: 'Narayangaon', sub: 'Load 14:00', x: 8, y: 66, start: true },
                { label: 'Chakan Agri-Yard', sub: 'Weigh 16:15', x: 32, y: 46 },
                { label: 'BigBasket Hub', sub: '18:30', x: 63, y: 34 },
                { label: 'Vashi APMC', sub: '23:00', x: 88, y: 12, end: true },
              ].map((stop) => (
                <div key={stop.label} className="absolute flex -translate-x-1/2 flex-col items-center" style={{ left: `${stop.x}%`, top: `${stop.y}%` }}>
                  <span className={`grid h-8 w-8 place-items-center rounded-full border-2 border-card text-[10px] font-bold shadow ${stop.start ? 'bg-accent text-accent-foreground' : stop.end ? 'bg-emerald-600 text-white' : 'bg-card text-primary'}`}>{stop.start ? <Truck className="h-4 w-4" /> : stop.end ? <Check className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}</span>
                  <span className="mt-1.5 whitespace-nowrap rounded-md bg-card/90 px-2 py-1 text-center text-[10px] font-bold shadow"><p>{stop.label}</p><p className="font-medium text-muted-foreground">{stop.sub}</p></span>
                </div>
              ))}
              <div className="absolute bottom-3 right-4 rounded-lg bg-card/85 px-2.5 py-1.5 text-[10px] font-semibold text-muted-foreground shadow"><Navigation className="mr-1 inline h-3 w-3 text-accent" /> 148 km · NH-48 / Old Pune–Nashik Rd</div>
            </div>
          </div>
          <div className="divide-y divide-border">
            {[
              { t: '14:00', label: 'Dock loaded at Narayangaon primary depot', note: 'Crate count reconciled against pooled manifest.' },
              { t: '16:15', label: 'Consolidated weighment at Chakan Agri-Yard', note: 'Digital weighbridge receipts issued for all 14 lots.' },
              { t: '18:30', label: 'Drop 1 — BigBasket Pune hub', note: 'Lot #AG-8829 (650 kg Roma Tomato) offloaded.' },
              { t: '23:00', label: 'Terminal drop — Vashi APMC', note: 'Remaining lots cross-docked to buyers; e-way closed.', done: true },
            ].map((step, index) => (
              <div className="flex gap-3.5 px-5 py-4 sm:px-6" key={step.label}>
                <div className="flex flex-col items-center"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[10px] font-bold ${step.done ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>{step.done ? <Check className="h-4 w-4" /> : String(index + 1).padStart(2, '0')}</span>{index < 3 ? <span className="mt-1 h-full w-px bg-border" /> : null}</div>
                <div className="min-w-0 flex-1 pb-1"><p className="text-xs font-bold">{step.label} <span className="ml-1 font-mono-app text-[10px] font-normal text-muted-foreground">{step.t}</span></p><p className="mt-0.5 text-xs leading-5 text-muted-foreground">{step.note}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="panel overflow-hidden">
            <div className="border-b border-border px-5 py-4"><h3 className="font-display text-base font-bold">Dispatch waybill</h3><p className="mt-0.5 text-xs text-muted-foreground">MH-PN-2024-0884 · 14-ft reefer.</p></div>
            <div className="space-y-2.5 p-5 text-xs">
              {[['Operator', 'Sahyadri Logistics Co-op'], ['Driver', 'Sunil Bhor · +91 98500 22114'], ['Vehicle', 'MH 14 EF 2210 (Reefer, 10T)'], ['Cold chain hold', '4°C ± 1°C throughout'], ['Insurance & e-way', '#EWB222409884102']].map(([label, value]) => (
                <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-2 last:border-0" key={label}><span className="text-muted-foreground">{label}</span><span className="max-w-[60%] text-right font-semibold">{value}</span></div>
              ))}
            </div>
          </div>
          <div className="panel overflow-hidden">
            <div className="border-b border-border px-5 py-4"><h3 className="font-display text-base font-bold">Collection manifest</h3><p className="mt-0.5 text-xs text-muted-foreground">Farmer lots in this dispatch.</p></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[420px] text-left"><thead className="bg-muted/45 font-mono-app text-[10px] uppercase tracking-[.13em] text-muted-foreground"><tr><th className="px-5 py-3 font-medium">Farmer</th><th className="px-3 py-3 font-medium">Crop</th><th className="px-3 py-3 text-right font-medium">Kg</th><th className="px-5 py-3 text-right font-medium">Lots</th></tr></thead><tbody className="divide-y divide-border">{fpoManifest.map((row) => (<tr className="hover:bg-muted/25" key={row.farmer}><td className="px-5 py-3.5"><p className="text-xs font-bold">{row.farmer}</p><p className="text-[11px] text-muted-foreground">{row.fpo} · {row.village}</p></td><td className="px-3 py-3.5 text-xs">{row.crop}</td><td className="px-3 py-3.5 text-right text-xs font-semibold">{row.kg}</td><td className="px-5 py-3.5 text-right text-[11px] text-muted-foreground">{row.crates}</td></tr>))}</tbody></table></div>
          </div>
        </div>
      </section>
    </div>
  );
}

const fpoAnalyticsClusters = [
  { cluster: 'Otur North Cluster', crop: 'Tomato (Abhinav / F1 Hybrid)', farmers: 184, tonnage: '64.2 MT', realization: '₹24.80 / kg', diff: '+₹5.60', payout: '₹15,92,160', onTime: '99.1%', tone: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { cluster: 'Alephata West Belt', crop: 'Garhwa Red Onion', farmers: 212, tonnage: '78.5 MT', realization: '₹21.40 / kg', diff: '+₹4.20', payout: '₹16,79,900', onTime: '97.4%', tone: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { cluster: 'Junnar Valley Cluster', crop: 'Dark Green Hot Chilli (G4)', farmers: 146, tonnage: '28.4 MT', realization: '₹28.90 / kg', diff: '+₹6.10', payout: '₹8,20,760', onTime: '98.6%', tone: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { cluster: 'Manchar South Sector', crop: 'Green Bell Capsicum', farmers: 106, tonnage: '20.2 MT', realization: '₹26.20 / kg', diff: '+₹3.80', payout: '₹5,29,240', onTime: '94.2%', tone: 'bg-amber-100 text-amber-900 border-amber-200' },
];

const fpoArbitrage = [
  { week: 'W1 Sep', crop: 'Tomato', mandi: 62, fpo: 82, value: '₹24.8', delta: '+₹6.30' },
  { week: 'W2 Sep', crop: 'Red Onion', mandi: 56, fpo: 70, value: '₹21.2', delta: '+₹4.40' },
  { week: 'W3 Sep', crop: 'Green Chilli', mandi: 74, fpo: 95, value: '₹28.5', delta: '+₹6.40' },
  { week: 'W4 Sep', crop: 'Mixed solanaceous', mandi: 66, fpo: 80, value: '₹23.9', delta: '+₹4.10' },
  { week: 'W1 Oct', crop: 'Forecast', mandi: 70, fpo: 87, value: '₹26.0 (est)', delta: '+₹5.00', forecast: true },
];

function FpoAnalytics() {
  const [notice, setNotice] = useState('');
  const showNotice = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 4000); };
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="FPO secretary / analytics" title="Your collective&apos;s numbers, in the open." description="Price realisations, member premiums and logistics efficiency across every harvest batch. Prototype view with sample data." action={<div className="flex flex-wrap gap-2"><button onClick={() => showNotice('FPO comprehensive ledger export started (PDF & Excel).')} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold hover:bg-muted" data-testid="button-export-report"><Download className="h-4 w-4" /> Export report</button><button onClick={() => showNotice('Encrypted briefing dispatched to 9 board members.')} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90" data-testid="button-share-board"><ArrowUpRight className="h-4 w-4" /> Share with board</button></div>} />
      {notice ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" data-testid="text-analytics-notice">{notice}</p> : null}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Gross produce sales', value: '₹42,85,400', note: '+24.0% vs prev month', icon: DollarSign, tone: 'text-primary' },
          { label: 'Avg. realized price', value: '₹22.40', note: '+16.8% vs ₹19.18 mandi base', icon: Scale, tone: 'text-primary' },
          { label: 'Total extra income', value: '₹5,12,600', note: '~₹791 / farmer net gain', icon: Wallet, tone: 'text-primary' },
          { label: 'Freight pooling savings', value: '₹1,48,200', note: 'Avg. ₹3,900 / trip saved', icon: Truck, tone: 'text-primary' },
        ].map(({ label, value, note, icon: Icon, tone }, index) => (
          <div className={`panel enter enter-delay-${index + 1} p-5`} key={label}>
            <div className="flex items-start justify-between"><p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{label}</p><Icon className="h-4 w-4 text-accent" /></div>
            <p className={`mt-4 font-display text-3xl font-bold tracking-tight ${tone}`}>{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{note}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <div className="panel p-6">
          <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div><h3 className="font-display text-base font-bold">Weekly mandi arbitrage & price realisation</h3><p className="mt-0.5 text-xs text-muted-foreground">Pooled FPO price vs local APMC baseline.</p></div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-semibold"><span className="h-3 w-3 rounded-sm bg-primary" /> FPO realized</span>
              <span className="flex items-center gap-1.5 text-muted-foreground"><span className="h-3 w-3 rounded-sm bg-muted" /> Mandi base</span>
              <span className="flex items-center gap-1.5 font-semibold text-accent"><span className="h-1 w-4 rounded-full bg-accent" /> Forecast</span>
            </div>
          </div>
          <div className="mt-6 flex items-end justify-between gap-3">
            {fpoArbitrage.map((week) => (
              <div className="flex flex-1 flex-col items-center" key={week.week} title={`${week.week} · ${week.crop}`}>
                <p className={`mb-2 text-[10px] font-bold ${week.forecast ? 'text-accent' : 'text-primary'}`}>{week.value}</p>
                <div className="flex h-40 w-full max-w-[42px] items-end justify-center gap-1.5">
                  <div className="w-1/2 rounded-t-[3px] bg-muted" style={{ height: `${week.mandi}%` }} />
                  <div className={`relative w-1/2 rounded-t-[3px] ${week.forecast ? 'bg-[hsl(var(--accent)/.85)]' : 'bg-primary'}`} style={{ height: `${week.fpo}%` }}>
                    <span className={`absolute -top-7 right-0 whitespace-nowrap rounded-md bg-[hsl(var(--primary)/.12)] px-1.5 py-0.5 text-[10px] font-bold ${week.forecast ? 'text-accent' : 'text-primary'}`}>{week.delta}</span>
                  </div>
                </div>
                <p className={`mt-2 text-xs font-bold ${week.forecast ? 'text-accent' : 'text-primary'}`}>{week.week}</p>
                <p className="text-[10px] text-muted-foreground">{week.crop}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-2 rounded-xl border border-border bg-muted/25 p-3.5 text-xs sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-emerald-600" /> Direct institutional contracts insulated farmers during the W2 onion mandi slump.</span>
            <button onClick={() => showNotice('Opening the full mandi ledger…')} className="shrink-0 font-bold text-accent hover:underline">View mandi ledger <ArrowRight className="ml-1 inline h-3 w-3" /></button>
          </div>
        </div>
        <div className="panel p-6">
          <div className="flex items-center justify-between border-b border-border pb-3"><div><h3 className="font-display text-base font-bold">Off-taker channel share</h3><p className="mt-0.5 text-xs text-muted-foreground">Sales volume split by channel.</p></div><Pill label="98.2% QC pass" tone="bg-emerald-100 text-emerald-800 border-emerald-200" /></div>
          <div className="mt-5 flex items-center justify-center gap-6">
            <div className="relative grid h-36 w-36 shrink-0 place-items-center rounded-full" style={{ background: 'conic-gradient(#16332E 0 45%, #C4881C 45% 80%, #E3E3E0 80% 100%)' }}>
              <div className="grid h-20 w-20 place-items-center rounded-full border border-border bg-card text-center"><p className="font-display text-xl font-bold text-primary">191.3</p><p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">MT shipped</p></div>
            </div>
            <div className="flex flex-col gap-2 text-xs">
              {[['Modern retail', '45% · 86.1 MT', 'bg-primary'], ['HoReCa & caterers', '35% · 67.0 MT', 'bg-accent'], ['Mandi arbitrage', '20% · 38.2 MT', 'bg-muted']].map(([label, value, tone]) => (
                <div className="flex items-center gap-2" key={label as string}><span className={`h-3 w-3 rounded-sm ${tone}`} /><div><p className="font-semibold">{label}</p><p className="text-[11px] text-muted-foreground">{value}</p></div></div>
              ))}
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between gap-2 rounded-xl border border-border bg-muted/25 p-3.5 text-xs"><div className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-emerald-700"><BadgeCheck className="h-4 w-4" /></span><div><p className="font-bold">Depot rejection rate: 1.8%</p><p className="text-[11px] text-muted-foreground">Quality tolerance target &lt; 3.5% achieved.</p></div></div><Pill label="Grade-A certified" tone="bg-emerald-100 text-emerald-800 border-emerald-200" /></div>
        </div>
      </section>
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[hsl(var(--primary)/.08)] text-primary"><Truck className="h-7 w-7" /></span>
            <div>
              <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground">Cold chain dispatch active</span><span className="font-mono-app text-[11px] text-muted-foreground">Trip #FC-2024-884 en route to Navi Mumbai</span></div>
              <h3 className="mt-1.5 font-display text-lg font-bold">Narayangaon central sorting & pre-cooling hub</h3>
              <p className="mt-1 max-w-2xl text-xs leading-6 text-muted-foreground">Operating at 92% cold room efficiency. 14 aggregate trucks pooled this week, reducing per-kg freight overhead from ₹2.40 to ₹1.62.</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/25 p-4 text-xs sm:w-72">
            <div className="flex items-baseline justify-between"><span className="text-muted-foreground">Member settlement turnaround:</span><span className="font-display font-bold text-emerald-700">48 hours</span></div>
            <div className="flex items-baseline justify-between"><span className="text-muted-foreground">Direct DBT disbursal:</span><span className="rounded-lg bg-card px-2 py-0.5 font-bold">100% cashless</span></div>
          </div>
        </div>
      </section>
      <section className="panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><h3 className="font-display text-base font-bold">Top performing farmer clusters & commodities</h3><p className="mt-0.5 text-xs text-muted-foreground">Tonnage, price realisation and member payouts by village cluster.</p></div><button onClick={() => showNotice('Cluster filter opened.')} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-muted"><Filter className="h-3.5 w-3.5" /> Filter clusters</button></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-muted/45 font-mono-app text-[10px] uppercase tracking-[.13em] text-muted-foreground"><tr><th className="px-5 py-3 font-medium">Village cluster & lead crop</th><th className="px-3 py-3 font-medium">Active farmers</th><th className="px-3 py-3 font-medium">Total tonnage</th><th className="px-3 py-3 font-medium">Avg. realization</th><th className="px-3 py-3 font-medium">Mandi diff</th><th className="px-3 py-3 font-medium">Total payout</th><th className="px-5 py-3 text-center font-medium">On-time dispatch</th></tr></thead><tbody className="divide-y divide-border">{fpoAnalyticsClusters.map((row) => (
          <tr className="hover:bg-muted/25" key={row.cluster}><td className="px-5 py-3.5"><div className="flex items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[hsl(var(--primary)/.08)] text-primary"><Sprout className="h-4 w-4" /></span><div><p className="text-xs font-bold">{row.cluster}</p><p className="text-[11px] text-muted-foreground">{row.crop}</p></div></div></td><td className="px-3 py-3.5 text-xs text-muted-foreground">{row.farmers}</td><td className="px-3 py-3.5 text-xs font-semibold">{row.tonnage}</td><td className="px-3 py-3.5 text-xs">{row.realization}</td><td className="px-3 py-3.5"><Pill label={row.diff} tone={row.tone} /></td><td className="px-3 py-3.5 font-display text-xs font-bold">{row.payout}</td><td className="px-5 py-3.5 text-center"><span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> {row.onTime}</span></td></tr>
        ))}</tbody></table></div>
      </section>
      <section className="flex flex-col justify-between gap-5 rounded-3xl bg-primary p-6 text-primary-foreground md:flex-row md:items-center">
        <div className="flex items-center gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-foreground/10"><ShieldCheck className="h-6 w-6 text-sidebar-primary" /></span><div><h3 className="font-display text-base font-bold">Statutory governance & member transparency audit</h3><p className="mt-0.5 max-w-xl text-xs leading-5 text-primary-foreground/70">All price realisations and pooling deltas reconciled with NABARD & SFAC compliance standards.</p></div></div>
        <button onClick={() => showNotice('Encrypted monthly performance briefing dispatched to 9 board members via WhatsApp & Email.')} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-sidebar-primary px-4 py-2.5 text-xs font-bold text-sidebar-primary-foreground hover:opacity-90" data-testid="button-board-share">Share with board <ArrowRight className="h-3.5 w-3.5" /></button>
      </section>
    </div>
  );
}

function FarmerOverview() {
  const t = useLang().t;
  const [notice, setNotice] = useState('');
  const [supplyQty, setSupplyQty] = useState(500);
  const [supplied, setSupplied] = useState<string | null>(null);
  const showNotice = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 4000); };
  const confirmSupply = () => {
    setSupplied(`${supplyQty} kg`);
    setNotice(`${t('overview.supplying', { qty: `${supplyQty} kg` })}`);
  };
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t('overview.eyebrow')}
        title={t('overview.title')}
        description={t('overview.description')}
        action={<div className="inline-flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3 text-xs font-semibold shadow-sm"><span className="grid h-5 w-5 place-items-center rounded-full bg-amber-100 text-amber-700"><Sun className="h-3.5 w-3.5" /></span> {t('overview.weatherLocation')} <span className="h-4 w-px bg-border" /> {t('overview.weatherNow')} <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">{t('overview.weatherOptimal')}</span></div>}
      />
      {notice ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" data-testid="text-farmer-overview-notice">{notice}</p> : null}
      <section className="soft-grid relative overflow-hidden rounded-3xl border border-[hsl(var(--primary)/.15)] bg-[hsl(var(--primary)/.05)] p-6 sm:p-9">
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
          <div className="enter">
            <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--primary)/.16)] bg-card/75 px-3 py-1.5 text-xs font-semibold text-primary"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> {t('overview.fairPrice')}</div>
            <h1 className="mt-5 max-w-xl font-display text-3xl font-bold leading-[1.05] tracking-[-.04em] text-primary sm:text-4xl">{t('overview.heroTitle1')} <span className="text-accent">{t('overview.heroTitle2')}</span> {t('overview.heroTitle3')}</h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">{t('overview.heroBody')}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => showNotice('Farmgate weighbridge slot reserved for Saturday 07:00 AM.')} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90" data-testid="button-schedule-weighing"><Truck className="h-4 w-4" /> {t('overview.scheduleWeighing')}</button>
              <Link href="/farmer/passbook" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold hover:bg-muted" data-testid="link-view-escrow-price">{t('overview.viewEscrowPrice')} <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card/85 p-5 enter enter-delay-1">
            <div className="flex items-center justify-between"><p className="flex items-center gap-1.5 font-mono-app text-[10px] uppercase tracking-[.18em] text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-accent" /> {t('overview.slaLabel')}</p><span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">{t('overview.slaBadge')}</span></div>
            <p className="mt-4 font-display text-3xl font-bold tracking-tight text-primary">₹1,97,200 <span className="text-sm font-semibold text-muted-foreground">{t('overview.allocated')}</span></p>
            <p className="mt-1 text-xs text-muted-foreground">{t('overview.slaBody')}</p>
            <div className="mt-4">
              <div className="flex items-baseline justify-between text-xs font-semibold"><span>{t('overview.lotSealed')}</span><span className="text-muted-foreground">6.6 / 8.5 MT</span></div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: '78%' }} /></div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-muted/45 p-3 text-xs"><IndianRupee className="h-4 w-4 shrink-0 text-accent" /><span className="text-muted-foreground">{t('overview.dbtRealized')}</span><span className="font-bold text-emerald-700">₹43,400</span></div>
          </div>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: t('overview.statDbt'), value: '₹2,48,600', note: t('overview.statDbtNote'), icon: Wallet, tone: 'text-accent' },
          { label: t('overview.statEscrow'), value: '₹72,400', note: t('overview.statEscrowNote'), icon: LockKeyhole, tone: 'text-accent' },
          { label: t('overview.statDispatched'), value: '14.2', unit: 'MT', note: t('overview.statDispatchedNote'), icon: Truck, tone: 'text-accent' },
          { label: t('overview.statDelta'), value: '+19.5%', note: t('overview.statDeltaNote'), icon: TrendingUp, tone: 'text-emerald-700' },
        ].map(({ label, value, unit, note, icon: Icon, tone }, index) => (
          <div className={`panel enter enter-delay-${index + 1} p-5`} key={label} data-testid={`metric-${label.toLowerCase().replaceAll(' ', '-').replace(/\(|\)/g, '')}`}>
            <div className="flex items-start justify-between"><p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{label}</p><Icon className={`h-4 w-4 ${tone}`} /></div>
            <p className="mt-4 font-display text-3xl font-bold tracking-tight text-primary">{value} {unit ? <span className="text-xs font-semibold text-muted-foreground">{unit}</span> : null}</p>
            <p className="mt-1 text-xs text-muted-foreground">{note}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
        <div className="space-y-6">
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-accent" /><div><h2 className="font-display text-lg font-bold">{t('overview.ratesTitle')}</h2><p className="mt-0.5 text-xs text-muted-foreground">{t('overview.ratesSub')}</p></div></div>
              <Link href="/farmer/sales" className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline" data-testid="link-sales-rates">{t('overview.allSales')} <ArrowRight className="h-3 w-3" /></Link>
            </div>
            <div className="divide-y divide-border">
              {[
                { name: t('crop.tomato'), grade: t('common.gradeA'), mandi: t('overview.mandiPrice', { price: '₹16.50' }), price: '₹19.50', unit: t('common.perKg'), delta: t('overview.tomatoDelta'), tone: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
                { name: t('crop.onion'), grade: t('common.gradeB'), mandi: t('overview.mandiPrice', { price: '₹26.50' }), price: '₹28.00', unit: t('common.perKg'), delta: t('overview.onionDelta'), tone: 'bg-amber-100 text-amber-900 border-amber-200' },
              ].map((rate) => (
                <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6" key={rate.name}>
                  <div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[hsl(var(--primary)/.08)] text-primary"><Sprout className="h-5 w-5" /></span><div className="min-w-0"><p className="truncate text-sm font-bold">{rate.name} <Pill label={rate.grade} tone="bg-muted text-muted-foreground border-border" /></p><p className="mt-0.5 text-xs text-muted-foreground">{rate.mandi}</p></div></div>
                  <div className="shrink-0 text-right"><p className="font-display text-lg font-bold leading-tight text-primary">{rate.price}<span className="text-xs font-normal text-muted-foreground">{rate.unit}</span></p><span className={`mt-1 inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[10px] font-bold ${rate.tone}`}><ArrowUpRight className="h-3 w-3" /> {rate.delta}</span></div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel overflow-hidden">
            <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
              <div><div className="flex flex-wrap items-center gap-1.5"><span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-700"><CircleAlert className="h-3 w-3" /> {t('overview.urgent')}</span><span className="inline-flex items-center gap-1 text-[11px] font-bold text-accent"><Timer className="h-3 w-3" /> {t('overview.urgentDays')}</span></div><h2 className="mt-2 font-display text-lg font-bold">{t('overview.urgentTitle')}</h2><p className="mt-0.5 text-xs text-muted-foreground">{t('overview.urgentBody')}</p></div>
              <span className="shrink-0 rounded-xl bg-[hsl(var(--primary)/.08)] px-3.5 py-2 text-center"><p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{t('overview.offerLabel')}</p><p className="mt-0.5 font-display text-base font-bold text-primary">₹20.00 / kg</p></span>
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-xs font-semibold text-muted-foreground">{t('overview.chooseQty')}</p>
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {[200, 500, 1000].map((qty) => (
                  <button key={qty} onClick={() => setSupplyQty(qty)} className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors ${supplyQty === qty ? 'border-primary bg-primary text-primary-foreground shadow-sm' : 'border-border bg-muted/40 text-muted-foreground hover:border-primary/40'}`} data-testid={`qty-chip-${qty}`}>+{qty} kg</button>
                ))}
              </div>
              <button onClick={confirmSupply} disabled={!!supplied} className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground" data-testid="button-confirm-supply">{supplied ? <BadgeCheck className="h-4 w-4" /> : <Check className="h-4 w-4" />}{supplied ? t('overview.supplying', { qty: supplied }) : t('overview.iCanSupplySub')}</button>
              {supplied ? <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs font-bold text-emerald-700" data-testid="text-supply-toast">{t('overview.supplyToast')}</p> : null}
            </div>
          </div>
          <div className="panel p-5">
            <div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-full bg-[hsl(var(--primary)/.08)] text-primary"><Truck className="h-4 w-4" /></span><div><p className="font-mono-app text-[10px] font-bold uppercase tracking-[.18em] text-accent">{t('overview.pickupLabel')}</p><h3 className="mt-0.5 font-display text-base font-bold">{t('overview.pickupTitle')}</h3></div></div>
            <div className="mt-3 grid grid-cols-2 gap-2.5 rounded-xl bg-muted/45 p-3.5 text-xs sm:grid-cols-4">
              {[[t('overview.pickupPoint'), t('overview.pickupPointVal'), t('overview.pickupPointNote')], [t('overview.render_vehicle'), 'MH-14-GH-2384', t('overview.vehicleNote')], [t('overview.driver'), t('overview.driverVal'), t('overview.driverNote')], [t('overview.pooling'), t('overview.poolingVal'), t('overview.poolingNote')]].map(([label, value, note]) => (
                <div key={label as string}><p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-0.5 font-bold">{value}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{note}</p></div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="panel p-5">
            <h3 className="font-display text-base font-bold">{t('overview.quickTitle')}</h3>
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              <Link href="/farmer/sales" className="flex flex-col items-center gap-2 rounded-xl bg-muted/45 p-4 text-center transition-colors hover:bg-muted" data-testid="quick-sell-lot"><span className="grid h-11 w-11 place-items-center rounded-full bg-[hsl(var(--primary)/.1)] text-primary"><ShoppingCart className="h-5 w-5" /></span><span className="text-xs font-bold">{t('overview.qSell')}</span><span className="text-[10px] text-muted-foreground">{t('overview.qSellSub')}</span></Link>
              <Link href="/farmer/passbook" className="flex flex-col items-center gap-2 rounded-xl bg-muted/45 p-4 text-center transition-colors hover:bg-muted" data-testid="quick-passbook"><span className="grid h-11 w-11 place-items-center rounded-full bg-[hsl(var(--primary)/.1)] text-primary"><Wallet className="h-5 w-5" /></span><span className="text-xs font-bold">{t('overview.qPassbook')}</span><span className="text-[10px] text-muted-foreground">{t('overview.qPassbook')}</span></Link>
              <button onClick={() => showNotice('Calling FPO support. Dial-1 for field officer, Dial-2 for payment desk.')} className="flex flex-col items-center gap-2 rounded-xl bg-muted/45 p-4 text-center transition-colors hover:bg-muted" data-testid="quick-call-helper"><span className="grid h-11 w-11 place-items-center rounded-full bg-[hsl(var(--primary)/.1)] text-primary"><Phone className="h-5 w-5" /></span><span className="text-xs font-bold">{t('overview.qSupport')}</span><span className="text-[10px] text-muted-foreground">{t('overview.qSupport')}</span></button>
            </div>
          </div>
          <div className="rounded-2xl bg-accent/10 p-5">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/20 text-accent"><Sprout className="h-5 w-5" /></span><div><p className="font-display text-sm font-bold">{t('overview.coopTitle')}</p><p className="mt-0.5 text-xs leading-5 text-muted-foreground">{t('overview.coopBody', { amount: '₹1,240' })}</p></div></div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between"><p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-muted-foreground"><TrendingUp className="mr-1 inline h-3 w-3 text-accent" /> {t('overview.parityTitle')}</p><Link href="/farmer/sales" className="text-[11px] font-bold text-accent hover:underline">{t('overview.parityLink')}</Link></div>
            <div className="mt-3 space-y-2 text-xs">
              {[[t('crop.tomato'), '₹19.50', '+15.0%'], [t('crop.onion'), '₹28.00', t('overview.parityStable')], [t('crop.chilli'), '₹33.60', '+24.0%']].map(([crop, price, delta]) => (
                <div className="flex items-center justify-between border-b border-border/70 pb-1.5 last:border-0" key={crop as string}><span className="font-semibold">{crop} <span className="text-muted-foreground">{t('overview.farmgate')}</span></span><span><span className="font-bold text-primary">{price}</span> <span className={`font-bold ${delta.includes('+') ? 'text-emerald-700' : 'text-muted-foreground'}`}>{delta}</span></span></div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
        <div className="space-y-6">
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
              <div><h2 className="font-display text-xl font-bold">{t('overview.lotsTitle')}</h2><p className="mt-1 text-xs text-muted-foreground">{t('overview.lotsSub')}</p></div>
              <span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-[11px] font-semibold text-muted-foreground">{t('overview.lotsBadge')}</span>
            </div>
            <div className="divide-y divide-border">
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[hsl(var(--primary)/.08)] text-primary"><Package className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1"><p className="font-display text-sm font-bold">{t('overview.lotNo', { id: '#LOT-8810' })} <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">#DIS-2024-8810</span></p><p className="mt-0.5 text-xs font-semibold">{t('overview.lot1Title')}</p></div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-800"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" /> {t('overview.inTransit')}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-800"><IndianRupee className="h-3 w-3" /> {t('overview.escrow')}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-muted/45 p-3.5 text-xs sm:grid-cols-4">
                  {[[t('overview.lotDetailVehicle'), 'MH-15-EM-4091'], [t('overview.lotDetailReefer'), '16.2°C (Optimal)'], [t('overview.lotDetailWeighbridge'), '4,200 kg signed'], [t('overview.lotDetailRate'), '₹23.20 / kg']].map(([label, value]) => (
                    <div key={label as string}><p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-0.5 font-semibold">{value}</p></div>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline justify-between text-xs font-semibold"><span>{t('overview.lot1Route')}</span><span className="text-muted-foreground">{t('overview.lot1Eta')}</span></div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: '58%' }} /></div>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">{t('overview.lot1Advisory')}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => showNotice('Live location shared. Truck MH-15-EM-4091 is at Chakan interchange, ETA 3h 45m.')} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:opacity-90" data-testid="button-track-truck"><Navigation className="h-3.5 w-3.5" /> {t('overview.trackTruck')}</button>
                  <button onClick={() => showNotice('Weighbridge slip PDF generated for #DIS-2024-8810.')} className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-2 text-xs font-bold hover:bg-muted/80" data-testid="button-inward-slip"><FileText className="h-3.5 w-3.5" /> {t('overview.inwardSlip')}</button>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[hsl(var(--primary)/.08)] text-primary"><Package className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1"><p className="font-display text-sm font-bold">{t('overview.lotNo', { id: '#LOT-9014' })} <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{t('overview.lot2Eta')}</span></p><p className="mt-0.5 text-xs font-semibold">{t('overview.lot2Title')}</p></div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-800">{t('overview.lot2Badge')}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-muted/45 p-3.5 text-xs sm:grid-cols-3">
                  {[[t('overview.agronomist'), t('overview.agronomistVal'), t('overview.agronomistNote')], [t('overview.qualityAssay'), t('overview.qualityAssayVal'), t('overview.qualityAssayNote')], [t('overview.areaCovered'), t('overview.areaCoveredVal'), t('overview.areaCoveredNote')]].map(([label, value, sub]) => (
                    <div key={label as string}><p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-0.5 font-semibold">{value}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{sub}</p></div>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">{t('overview.lot2Body')}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => showNotice('Lot readiness confirmed. Farmgate pickup locked for tomorrow 06:30 AM.')} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:opacity-90" data-testid="button-confirm-readiness"><Check className="h-3.5 w-3.5" /> {t('overview.confirmReadiness')}</button>
                  <button onClick={() => showNotice('Pre-harvest escrow estimate: ~₹72,400 (4.0 MT @ ₹18.10/kg avg).')} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold hover:bg-muted" data-testid="button-estimate-escrow"><Calculator className="h-3.5 w-3.5" /> {t('overview.estimateEscrow')}</button>
                </div>
              </div>
            </div>
          </div>
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
              <div><h2 className="font-display text-xl font-bold">{t('overview.telemetryTitle')}</h2><p className="mt-1 text-xs text-muted-foreground">{t('overview.telemetrySub')}</p></div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800">{t('overview.synced')}</span>
            </div>
            <div className="grid gap-px bg-border sm:grid-cols-2">
              {[
                { survey: 'Survey #142/2', area: '2.50 Acres', tag: t('overview.plotTagRabi'), tagTone: 'bg-emerald-100 text-emerald-800 border-emerald-200', crop: t('overview.plot1Crop'), sub: t('overview.plot1Sub'), maturity: '96%', pct: 96, sensor: t('overview.plotSensor1') },
                { survey: 'Survey #142/3', area: '2.00 Acres', tag: t('overview.plotTagFruiting'), tagTone: 'bg-amber-100 text-amber-900 border-amber-200', crop: t('overview.plot2Crop'), sub: t('overview.plot2Sub'), maturity: '72%', pct: 72, sensor: t('overview.plotSensor2') },
              ].map((plot) => (
                <div className="bg-card p-5" key={plot.survey}>
                  <div className="flex items-start justify-between gap-2"><p className="font-display text-sm font-bold">{plot.survey} <span className="ml-1 text-xs font-semibold text-muted-foreground">{plot.area}</span></p><span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${plot.tagTone}`}>{plot.tag}</span></div>
                  <p className="mt-2 text-xs font-semibold">{plot.crop}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{plot.sub}</p>
                  <div className="mt-3 flex items-baseline justify-between text-xs font-semibold"><span>{t('overview.maturity')}</span><span className="text-accent">{plot.maturity}</span></div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${plot.pct}%` }} /></div>
                  <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-muted-foreground"><Gauge className="h-3.5 w-3.5 text-accent" /> {plot.sensor}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/25 p-5">
              <div className="flex items-center gap-2.5 text-xs"><FlaskConical className="h-4 w-4 text-accent" /><span><span className="font-bold">{t('overview.soilCard')}</span> <span className="text-muted-foreground">{t('overview.soilCardBody')}</span></span></div>
              <button onClick={() => showNotice('Detailed 7/12 parcel dossier opened for tehsildar review.')} className="rounded-lg bg-muted px-3 py-1.5 text-xs font-bold hover:bg-muted/80">{t('overview.viewDossier')}</button>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
            <div className="flex items-center justify-between"><p className="flex items-center gap-1.5 font-mono-app text-[10px] uppercase tracking-[.18em] text-primary-foreground/60"><TrendingUp className="h-3.5 w-3.5 text-sidebar-primary" /> {t('overview.liveParity')}</p><span className="text-[10px] font-bold text-sidebar-primary">{t('overview.realTime')}</span></div>
            <div className="mt-4 space-y-3">
              {[[t('crop.onion'), '₹23.30/kg', '+₹3.80', '19.5%'], [t('crop.tomato'), '₹22.50/kg', '+₹4.30', '23.6%'], [t('crop.chilli'), '₹33.60/kg', '+₹6.50', '24.0%']].map(([crop, price, delta, pct]) => (
                <div className="flex items-center justify-between border-b border-primary-foreground/10 pb-2.5 last:border-0" key={crop as string}><div><p className="text-sm font-semibold">{crop}</p><p className="text-[11px] text-primary-foreground/55">{t('overview.farmgateSub')}</p></div><div className="text-right"><p className="font-display text-sm font-bold text-sidebar-primary">{price}</p><p className="text-[11px] font-bold text-emerald-300">{delta} · {pct}</p></div></div>
              ))}
            </div>
          </div>
          <div className="panel p-6">
            <div className="flex items-center gap-2"><Calculator className="h-5 w-5 text-accent" /><h3 className="font-display text-base font-bold">{t('overview.estimateTitle')}</h3></div>
            <p className="mt-3 text-xs leading-6 text-muted-foreground">{t('overview.estimateBody')}</p>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight text-emerald-700">₹17,200</p>
            <p className="mt-1 text-xs text-muted-foreground">{t('overview.estimateVs')}</p>
            <Link href="/farmer/passbook" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline" data-testid="link-open-simulator">{t('overview.openSimulator')} <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="panel overflow-hidden">
            <div className="border-b border-border px-5 py-4"><h3 className="font-display text-base font-bold">{t('overview.deskTitle')}</h3><p className="mt-0.5 text-xs text-muted-foreground">{t('overview.deskSub')}</p></div>
            <div className="p-5">
              <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[hsl(var(--primary)/.08)] text-primary font-display text-sm font-bold">VK</span><div className="min-w-0 flex-1"><p className="text-xs font-bold">{t('overview.deskPerson')}</p><p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{t('overview.deskRole')}<br />{t('overview.deskHours')}</p></div><button onClick={() => showNotice('Calling Dr. Vijay Kadam (agronomist hotline)…')} className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground hover:opacity-90" data-testid="button-call-agronomist"><Phone className="h-3.5 w-3.5" /></button></div>
              <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3.5 text-xs"><p className="flex items-center gap-1.5 font-bold text-accent"><Truck className="h-3.5 w-3.5" /> {t('overview.nextVehicle')}</p><p className="mt-1.5 text-muted-foreground">{t('overview.nextVehicleBody')}</p></div>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col justify-between gap-5 rounded-3xl bg-emerald-700 p-6 text-emerald-50 md:flex-row md:items-center">
        <div className="flex items-center gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10"><Droplets className="h-6 w-6" /></span><div><h3 className="font-display text-base font-bold">{t('overview.welfareTitle')}</h3><p className="mt-0.5 max-w-xl text-xs leading-5 text-emerald-100/80">{t('overview.welfareBody', { amount: '+₹2,000', status: 'active' })}</p></div></div>
        <Link href="/farmer/passbook" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-emerald-800 hover:opacity-90" data-testid="link-open-passbook">{t('overview.openPassbook')} <ArrowRight className="h-3.5 w-3.5" /></Link>
      </section>
    </div>
  );
}

function FarmerPassbook() {
  const t = useLang().t;
  const [notice, setNotice] = useState('');
  const [simCrop, setSimCrop] = useState('Onion');
  const [simWeight, setSimWeight] = useState(4200);
  const showNotice = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 4000); };
  const simRates = { Onion: { farmgate: 23.2, apmc: 19.5 }, Tomato: { farmgate: 22.5, apmc: 18.2 }, Pomegranate: { farmgate: 118, apmc: 104 } } as Record<string, { farmgate: number; apmc: number }>;
  const rate = simRates[simCrop];
  const midmanRoute = (simWeight / 1000) * rate.apmc;
  const escrowRoute = (simWeight / 1000) * rate.farmgate;
  const gain = escrowRoute - midmanRoute;
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t('passbook.eyebrow')}
        title={t('passbook.title')}
        description={t('passbook.description')}
        action={<div className="flex flex-wrap gap-2"><button onClick={() => showNotice('PDF statement export started — 4 dispatches, FY 2025-26.')} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold hover:bg-muted" data-testid="button-export-statement"><Download className="h-4 w-4" /> {t('passbook.export')}</button><button onClick={() => showNotice('Instant cash-flow advance request raised. NABARD-verified credit offer in minutes.')} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90" data-testid="button-cash-advance"><Wallet className="h-4 w-4" /> {t('passbook.advance')}</button></div>}
      />
      {notice ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" data-testid="text-passbook-notice">{notice}</p> : null}
      <section className="flex flex-wrap items-center gap-2">
        {[[t('passbook.chipPfms'), t('passbook.chipPfmsPill')], [t('passbook.chipBank'), t('passbook.chipBankPill')], [t('passbook.chipVault'), t('passbook.chipVaultPill')]].map(([label, pill]) => (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-muted-foreground" key={label}><ShieldCheck className="h-3.5 w-3.5 text-accent" /> {label} <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-700">{pill}</span></span>
        ))}
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: t('passbook.statLifetime'), value: '₹6,84,200', note: t('passbook.statLifetimeNote'), icon: Wallet, tone: 'text-accent' },
          { label: t('passbook.statEscrow'), value: '₹97,440', note: t('passbook.statEscrowNote'), icon: LockKeyhole, tone: 'text-accent' },
          { label: t('passbook.statBypassed'), value: '₹52,800', note: t('passbook.statBypassedNote'), icon: TrendingUp, tone: 'text-emerald-700' },
          { label: t('passbook.statSpeed'), value: 'T+0', unit: t('passbook.statSpeedUnit'), note: t('passbook.statSpeedNote'), icon: Timer, tone: 'text-accent' },
        ].map(({ label, value, unit, note, icon: Icon, tone }, index) => (
          <div className={`panel enter enter-delay-${index + 1} p-5`} key={label}>
            <div className="flex items-start justify-between"><p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{label}</p><Icon className={`h-4 w-4 ${tone}`} /></div>
            <p className="mt-4 font-display text-3xl font-bold tracking-tight text-primary">{value} {unit ? <span className="text-xs font-semibold text-muted-foreground">{unit}</span> : null}</p>
            <p className="mt-1 text-xs text-muted-foreground">{note}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
            <div><h2 className="font-display text-xl font-bold">{t('passbook.tableTitle')}</h2><p className="mt-1 text-xs text-muted-foreground">{t('passbook.tableSub')}</p></div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800">{t('passbook.tableBadge')}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead className="bg-muted/45 font-mono-app text-[10px] uppercase tracking-[.13em] text-muted-foreground"><tr><th className="px-5 py-3 font-medium">{t('passbook.thDispatch')}</th><th className="px-4 py-3 text-right font-medium">{t('passbook.thNet')}</th><th className="px-4 py-3 font-medium">{t('passbook.thAssay')}</th><th className="px-4 py-3 text-right font-medium">{t('passbook.thCredit')}</th><th className="px-5 py-3 font-medium">{t('passbook.thStatus')}</th></tr></thead>
              <tbody className="divide-y divide-border">
                {[
                  { id: '#DIS-2024-8810', crop: t('passbook.pbRowOnion'), detail: 'ES 4 / net 4.2 MT', harvest: '4,350 kg', net: '4,200 kg', assay: '3% grade-out', rate: '₹23.20', delta: '+19.5% vs APMC', credit: '₹97,440', status: t('passbook.inEscrowTransit'), tone: 'bg-amber-100 text-amber-900 border-amber-200', utr: t('passbook.utrLocked') },
                  { id: '#DIS-2024-8422', crop: t('passbook.pbRowTomato'), detail: 'ES 2 / net 4.0 MT', harvest: '4,100 kg', net: '4,050 kg', assay: '4.8° Brix', rate: '₹22.50', delta: '+23.6% vs APMC', credit: '₹91,125', status: t('passbook.dbtSettled'), tone: 'bg-emerald-100 text-emerald-800 border-emerald-200', utr: 'UTR: BOM9481029841' },
                  { id: '#DIS-2024-7930', crop: t('passbook.pbRowChilli'), detail: 'DP 5 / net 1.0 MT', harvest: '1,010 kg', net: '1,000 kg', assay: '6,200 SHU', rate: '₹33.60', delta: '+24.0% vs APMC', credit: '₹33,600', status: t('passbook.dbtSettled'), tone: 'bg-emerald-100 text-emerald-800 border-emerald-200', utr: 'UTR: BOM4709218835' },
                  { id: '#DIS-2024-7104', crop: t('passbook.pbRowPomegranate'), detail: 'PG 6 / net 0.52 MT', harvest: '540 kg', net: '520 kg', assay: '11.5 ct (A+)', rate: '₹118.00', delta: '+13.5% vs APMC', credit: '₹61,360', status: t('passbook.dbtSettled'), tone: 'bg-emerald-100 text-emerald-800 border-emerald-200', utr: 'UTR: BOM3928184071' },
                ].map((row) => (
                  <tr className="align-top hover:bg-muted/25" key={row.id}>
                    <td className="px-5 py-4"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[hsl(var(--primary)/.08)] text-primary"><Package className="h-5 w-5" /></span><div><p className="font-display text-sm font-bold">{row.id}</p><p className="mt-0.5 text-xs font-semibold">{row.crop}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{row.detail}</p></div></div></td>
                    <td className="px-4 py-4 text-right"><p className="text-xs font-semibold">{row.harvest}</p><p className="mt-0.5 text-[11px] text-muted-foreground">→ {row.net} {t('common.signed')}</p></td>
                    <td className="px-4 py-4"><p className="text-xs font-semibold">{row.rate} <span className="text-muted-foreground">{t('common.perKg')}</span></p><p className="mt-0.5 text-[11px] text-muted-foreground">{row.assay} · <span className="font-bold text-emerald-700">{row.delta}</span></p></td>
                    <td className="px-4 py-4 text-right font-display text-sm font-bold text-primary">{row.credit}</td>
                    <td className="px-5 py-4"><Pill label={row.status} tone={row.tone} /><p className="mt-1.5 text-[10px] text-muted-foreground">{row.utr}</p></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col justify-between gap-3 border-t border-border bg-muted/25 p-4 text-xs sm:flex-row sm:items-center">
            <span className="text-muted-foreground">{t('passbook.footerNote')}</span>
            <button onClick={() => showNotice('KYC re-verification of Bank of Maharashtra A/C ****3821 completed.')} className="rounded-lg bg-muted px-3 py-1.5 font-bold hover:bg-muted/80">{t('passbook.verifyKyc')}</button>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
            <div className="flex items-center justify-between"><p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-primary-foreground/60">{t('passbook.arbitrageTitle')}</p><span className="rounded-full bg-sidebar-primary/15 px-2 py-0.5 text-[10px] font-bold text-sidebar-primary">{t('passbook.arbitrageUpdates')}</span></div>
            <div className="mt-4 space-y-2.5">
              {[[t('passbook.arbitrageLasalgaon'), '₹19.50', '−₹3.80 vs farmgate', t('passbook.arbitrageNote1')], [t('passbook.arbitragePimpalgaon'), '₹19.10', '−₹4.20 vs farmgate', t('passbook.arbitrageNote2')], [t('passbook.arbitrageVashi'), '₹24.00', 'net ₹20.80 after freight', t('passbook.arbitrageNote3')]].map(([label, price, delta, note]) => (
                <div className="flex items-center justify-between gap-2 rounded-lg bg-primary-foreground/5 px-3 py-2" key={label as string}><div><p className="text-xs font-semibold">{label}</p><p className="text-[10px] text-primary-foreground/55">{note}</p></div><div className="text-right shrink-0"><p className="font-display text-sm font-bold text-sidebar-primary">{price}<span className="text-[10px] text-primary-foreground/55">/kg</span></p><p className="text-[10px] font-bold text-rose-300">{delta}</p></div></div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg border border-sidebar-primary/20 bg-sidebar-primary/10 px-3 py-2"><div><p className="text-xs font-bold text-sidebar-primary">{t('passbook.farmgateSub')}</p><p className="text-[10px] text-sidebar-primary/70">{t('passbook.zeroDeductions')}</p></div><div className="text-right"><p className="font-display text-sm font-bold text-sidebar-primary">₹23.30<span className="text-[10px] text-sidebar-primary/70">/kg</span></p><p className="text-[10px] font-bold text-emerald-300">{t('passbook.premium')}</p></div></div>
          </div>
          <div className="panel p-6">
            <div className="flex items-center gap-2"><Calculator className="h-5 w-5 text-accent" /><h3 className="font-display text-base font-bold">{t('passbook.simulator')}</h3></div>
            <p className="mt-2 text-xs text-muted-foreground">{t('passbook.simulatorBody')}</p>
            <div className="mt-4 space-y-3">
              <div>
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{t('passbook.crop')}</p>
                <div className="grid grid-cols-3 gap-1.5">{['Onion', 'Tomato', 'Pomegranate'].map((crop) => <button key={crop} onClick={() => setSimCrop(crop)} className={`rounded-lg border px-2 py-2 text-xs font-bold transition-colors ${simCrop === crop ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-muted/40 text-muted-foreground hover:border-primary/40'}`} data-testid={`sim-crop-${crop}`}>{crop}</button>)}</div>
              </div>
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-muted-foreground"><span>{t('passbook.quantity')}</span><span className="font-display text-sm font-bold text-primary">{(simWeight / 1000).toFixed(1)} MT</span></div>
                <input type="range" min={500} max={12000} step={100} value={simWeight} onChange={(event) => setSimWeight(Number(event.target.value))} className="mt-2 w-full accent-primary" data-testid="sim-weight" />
                <div className="flex justify-between text-[10px] text-muted-foreground"><span>500 kg</span><span>12 MT</span></div>
              </div>
            </div>
            <div className="mt-4 space-y-2 rounded-xl bg-muted/45 p-3.5 text-xs">
              <div className="flex items-center justify-between"><span className="text-muted-foreground">{t('passbook.dalalRoute')}</span><span className="font-semibold">≈ {inr(midmanRoute)}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">{t('passbook.escrowRoute')}</span><span className="font-bold text-emerald-700">≈ {inr(escrowRoute)}</span></div>
              <div className="flex items-center justify-between border-t border-border pt-2"><span className="font-semibold">{t('passbook.extraRealization')}</span><span className="font-display text-base font-bold text-primary">+{inr(Math.round(gain))}</span></div>
            </div>
            <button onClick={() => showNotice(`Simulator record saved for ${simCrop} (${(simWeight / 1000).toFixed(1)} MT). Escrow slot booking link shared on WhatsApp.`)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90" data-testid="button-book-escrow-slot"><LockKeyhole className="h-3.5 w-3.5" /> {t('passbook.bookSlot')}</button>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
            <div><p className="font-bold text-emerald-900">{t('passbook.dbtStandard')}</p><p className="mt-1 text-xs leading-5 text-emerald-800">{t('passbook.dbtStandardBody')}</p></div>
          </div>
        </div>
      </section>
      <section className="flex flex-col justify-between gap-5 rounded-3xl bg-primary p-6 text-primary-foreground md:flex-row md:items-center">
        <div className="flex items-center gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-foreground/10"><ShieldCheck className="h-6 w-6 text-sidebar-primary" /></span><div><h3 className="font-display text-base font-bold">{t('passbook.protocolTitle')}</h3><p className="mt-0.5 max-w-xl text-xs leading-5 text-primary-foreground/70">{t('passbook.protocolBody')}</p></div></div>
        <button onClick={() => showNotice('Escrow dispute ticket #ESC-2024-0091 raised for NABARD review. Response SLA: 48 hrs.')} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-sidebar-primary px-4 py-2.5 text-xs font-bold text-sidebar-primary-foreground hover:opacity-90" data-testid="button-raise-dispute">{t('passbook.raiseDispute')} <ArrowRight className="h-3.5 w-3.5" /></button>
      </section>
    </div>
  );
}

function FarmerSales() {
  const t = useLang().t;
  const [filter, setFilter] = useState<'all' | 'tomato' | 'onion' | 'soybean'>('all');
  const [notice, setNotice] = useState('');
  const showNotice = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 4000); };
  const farmerSales = [
    { crop: 'tomato', nameKey: 'sales.saleNameTomato', gradeKey: 'common.gradeA', gradeTone: 'bg-emerald-100 text-emerald-800 border-emerald-200', qty: '650 kg', total: '₹12,675', rate: '₹19.50 / kg', mandi: '₹17.00', extra: '+₹1,625', statusKey: 'sales.statusVerified', tone: 'bg-emerald-100 text-emerald-800 border-emerald-200', noteKey: 'sales.noteTomato', verified: true, detailKey: 'sales.detailTomato' },
    { crop: 'onion', nameKey: 'sales.saleNameOnion', gradeKey: 'common.gradeA', gradeTone: 'bg-emerald-100 text-emerald-800 border-emerald-200', qty: '400 kg', total: '₹11,600', rate: '₹29.00 / kg', mandi: '₹26.50', extra: '+₹1,000', statusKey: 'sales.statusSent', tone: 'bg-slate-100 text-slate-700 border-slate-200', noteKey: 'sales.noteOnion', verified: false, detailKey: 'sales.detailOnion' },
    { crop: 'chilli', nameKey: 'sales.saleNameChilli', gradeKey: 'common.gradeB', gradeTone: 'bg-amber-100 text-amber-900 border-amber-200', qty: '120 kg', total: '₹5,040', rate: '₹42.00 / kg', mandi: '₹39.00', extra: '+₹360', statusKey: 'sales.statusSettled', tone: 'bg-emerald-100 text-emerald-800 border-emerald-200', noteKey: 'sales.noteChilli', verified: false, detailKey: 'sales.detailChilli' },
    { crop: 'soybean', nameKey: 'sales.saleNameSoybean', gradeKey: 'common.gradeA', gradeTone: 'bg-emerald-100 text-emerald-800 border-emerald-200', qty: '300 kg', total: '₹13,200', rate: '₹44.00 / kg', mandi: '₹41.00', extra: '+₹900', statusKey: 'sales.statusVerified', tone: 'bg-emerald-100 text-emerald-800 border-emerald-200', noteKey: 'sales.noteSoybean', verified: true, detailKey: 'sales.detailSoybean' },
  ];
  const visible = filter === 'all' ? farmerSales : farmerSales.filter((sale) => sale.crop === filter);
  const filters: { key: typeof filter; label: string; count: number }[] = [
    { key: 'all', label: t('sales.allCrops'), count: farmerSales.length },
    { key: 'tomato', label: t('crop.tomato'), count: farmerSales.filter((s) => s.crop === 'tomato').length },
    { key: 'onion', label: t('crop.onion'), count: farmerSales.filter((s) => s.crop === 'onion').length },
    { key: 'soybean', label: t('crop.soybean'), count: farmerSales.filter((s) => s.crop === 'soybean').length },
  ];
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t('sales.eyebrow')}
        title={t('sales.title')}
        description={t('sales.description')}
        action={<Link href="/farmer/passbook" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90" data-testid="link-open-passbook-sales"><Wallet className="h-4 w-4" /> {t('sales.openPassbook')}</Link>}
      />
      {notice ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" data-testid="text-sales-notice">{notice}</p> : null}
      <section className="soft-grid relative overflow-hidden rounded-3xl border border-[hsl(var(--primary)/.15)] bg-[hsl(var(--primary)/.05)] p-6 sm:p-8">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <p className="flex items-center gap-1.5 font-mono-app text-[10px] uppercase tracking-[.2em] text-primary"><BadgeCheck className="h-3.5 w-3.5 text-accent" /> {t('sales.transReport')}</p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-primary">{t('sales.youEarned', { amount: '+₹1,480 extra' })}</h2>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">{t('sales.transBody')}</p>
          </div>
          <div className="w-full max-w-md space-y-3">
            <div>
              <div className="flex items-baseline justify-between text-xs font-semibold"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> {t('sales.farmgateReceived')}</span><span className="font-display text-sm font-bold text-primary">₹18,420</span></div>
              <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: '100%' }} /></div>
            </div>
            <div>
              <div className="flex items-baseline justify-between text-xs font-semibold"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" /> {t('sales.mandiEstimate')}</span><span className="font-display text-sm font-bold text-muted-foreground">₹16,940</span></div>
              <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-muted-foreground/40" style={{ width: '91.9%' }} /></div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-card/85 px-3.5 py-2.5 text-xs"><span className="rounded-full bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700">{t('sales.netBonus')}</span><span className="text-muted-foreground">{t('sales.oct2024')}</span></div>
          </div>
        </div>
      </section>
      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="font-display text-xl font-bold">{t('sales.historyTitle')}</h2><p className="mt-1 text-xs text-muted-foreground">{t('sales.historySub')}</p></div>
          <div className="flex flex-wrap gap-2">
            {filters.map(({ key, label, count }) => (
              <button key={key} onClick={() => setFilter(key)} className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${filter === key ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:text-foreground'}`} data-testid={`filter-sales-${key}`}>{label}<span className={`rounded-full px-1.5 py-0.5 text-[10px] ${filter === key ? 'bg-primary-foreground/15' : 'bg-muted'}`}>{count}</span></button>
            ))}
          </div>
        </div>
      </section>
      <section className="space-y-4">
        {visible.map((sale) => (
          <div className="panel p-5" key={sale.crop} data-testid={`card-sale-${sale.crop}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[hsl(var(--primary)/.08)] text-primary"><Sprout className="h-5 w-5" /></span><div><div className="flex items-center gap-2"><p className="font-display text-sm font-bold">{t(sale.nameKey as TKey)}</p><Pill label={t(sale.gradeKey as TKey)} tone={sale.gradeTone} /></div><p className="mt-0.5 text-xs text-muted-foreground">{sale.qty} · {t(sale.detailKey as TKey)}</p></div></div>
              <div className="text-right"><p className="font-display text-base font-bold text-primary">{sale.total}</p><p className="mt-0.5 text-xs font-semibold">{sale.rate}</p></div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[hsl(var(--accent)/.18)] bg-[hsl(var(--accent)/.07)] px-3.5 py-2.5 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground"><FileStack className="h-3.5 w-3.5 text-accent" /> {t('sales.localMandi', { price: sale.mandi })}</span>
              <span className="font-bold text-emerald-700">{t('sales.extraRealized', { amount: sale.extra })}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-700">{sale.verified ? <BadgeCheck className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />} {t(sale.statusKey as TKey)}</span>
              <button onClick={() => showNotice(`${t('sales.viewReceipt')} — ${t(sale.nameKey as TKey)} ${sale.qty} — ${sale.total} (${t(sale.noteKey as TKey)}).`)} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 font-bold hover:bg-muted" data-testid={`button-receipt-${sale.crop}`}><Receipt className="h-3.5 w-3.5 text-accent" /> {t('sales.viewReceipt')}</button>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">{t(sale.noteKey as TKey)}</p>
          </div>
        ))}
        {!visible.length ? <EmptyOrError label={t('sales.noSales')} /> : null}
      </section>
      <section className="flex flex-col justify-between gap-5 rounded-3xl bg-primary p-6 text-primary-foreground md:flex-row md:items-center">
        <div className="flex items-center gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-foreground/10"><Scale className="h-6 w-6 text-sidebar-primary" /></span><div><h3 className="font-display text-base font-bold">{t('sales.transparentTitle')}</h3><p className="mt-0.5 max-w-xl text-xs leading-5 text-primary-foreground/70">{t('sales.transparentBody')}</p></div></div>
        <Link href="/farmer/payments" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-sidebar-primary px-4 py-2.5 text-xs font-bold text-sidebar-primary-foreground hover:opacity-90" data-testid="link-open-payments-sales">{t('sales.seeBreakdown')} <ArrowRight className="h-3.5 w-3.5" /></Link>
      </section>
    </div>
  );
}

function FarmerPayments() {
  const [notice, setNotice] = useState('');
  const t = useLang().t;
  const showNotice = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 4000); };
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t('payments.eyebrow')}
        title={t('payments.title')}
        description={t('payments.description')}
        action={<div className="flex flex-wrap gap-2"><button onClick={() => showNotice('Payment slip PDF generated for lot #AG-8829 (₹12,185.00).')} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold hover:bg-muted" data-testid="button-download-slip"><Download className="h-4 w-4" /> {t('payments.downloadSlip')}</button><button onClick={() => showNotice('Slip share link copied for WhatsApp — send to your household or FPO secretary.')} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90" data-testid="button-share-whatsapp"><ArrowUpRight className="h-4 w-4" /> {t('payments.shareWhatsapp')}</button></div>}
      />
      {notice ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" data-testid="text-payments-notice">{notice}</p> : null}
      <section className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <div className="rounded-2xl bg-primary p-6 text-primary-foreground lg:self-start">
          <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/15 bg-primary-foreground/10 px-3 py-1 text-[11px] font-bold"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sidebar-primary" /> {t('payments.expected')}</span><span className="inline-flex items-center gap-1 rounded-full bg-sidebar-primary/15 px-2 py-1 text-[10px] font-bold text-sidebar-primary"><BadgeCheck className="h-3 w-3" /> {t('payments.verified')}</span></div>
          <p className="mt-5 font-display text-4xl font-bold tracking-tight text-sidebar-primary">₹12,185.00</p>
          <p className="mt-1 text-xs text-primary-foreground/70">{t('payments.expectedBy')}</p>
          <div className="mt-5 rounded-xl bg-primary-foreground/10 p-4 text-xs space-y-2.5">
            <div className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5 text-primary-foreground/75"><Package className="h-3.5 w-3.5 text-sidebar-primary" /> {t('payments.linkedLot')}</span><span className="font-bold">{t('payments.lotValue', { crop: t('crop.tomato') })}</span></div>
            <div className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5 text-primary-foreground/75"><Landmark className="h-3.5 w-3.5 text-sidebar-primary" /> {t('payments.creditedBank')}</span><span className="flex items-center gap-1 font-bold">SBI •••• 4819 <BadgeCheck className="h-3.5 w-3.5 text-sidebar-primary" /></span></div>
          </div>
        </div>
        <div className="panel p-6">
          <div className="flex items-center justify-between"><div><h2 className="flex items-center gap-2 font-display text-lg font-bold"><Receipt className="h-5 w-5 text-accent" /> {t('payments.slipTitle')}</h2><p className="mt-0.5 text-xs text-muted-foreground">{t('payments.slipSub')}</p></div><span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800">{t('payments.auditVerified')}</span></div>
          <div className="mt-5 space-y-3">
            {[
              { step: '1', theme: 'bg-[hsl(var(--primary)/.1)] text-primary', label: t('payments.step1Label'), sub: t('payments.step1Sub'), value: '+₹12,675.00', tone: 'text-foreground' },
              { step: '2', theme: 'bg-rose-100 text-rose-700', label: t('payments.step2Label'), sub: t('payments.step2Sub'), value: '−₹390.00', tone: 'text-rose-700' },
              { step: '3', theme: 'bg-rose-100 text-rose-700', label: t('payments.step3Label'), sub: t('payments.step3Sub'), value: '−₹100.00', tone: 'text-rose-700' },
              { step: '4', theme: 'bg-primary text-primary-foreground', label: t('payments.step4Label'), sub: t('payments.step4Sub'), value: '₹0.00', tone: 'text-emerald-700', highlighted: true },
            ].map((row) => (
              <div className={`flex items-start justify-between gap-3 rounded-xl p-3.5 ${row.highlighted ? 'bg-[hsl(var(--primary)/.07)]' : 'bg-muted/40'}`} key={row.step}>
                <div className="flex gap-3"><span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${row.theme}`}>{row.step}</span><div><p className="text-xs font-bold">{row.label}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{row.sub}</p></div></div>
                <span className={`font-display text-sm font-bold ${row.tone}`}>{row.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-primary p-4 text-primary-foreground">
            <div><p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-sidebar-primary"><LockKeyhole className="h-3.5 w-3.5" /> {t('payments.netCredited')}</p><p className="mt-0.5 text-[11px] text-primary-foreground/70">{t('payments.toBank')}</p></div>
            <p className="font-display text-2xl font-bold text-sidebar-primary">₹12,185.00</p>
          </div>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="panel flex items-center gap-4 p-5">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[hsl(var(--primary)/.08)] text-primary"><Package className="h-6 w-6" /></span>
          <div><p className="text-xs font-bold">{t('payments.produceTitle')}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{t('payments.weighSlip')}</p><p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-700"><BadgeCheck className="h-3.5 w-3.5" /> {t('payments.approved')}</p></div>
        </div>
        <div className="panel p-5">
          <div className="flex items-center gap-2"><h3 className="font-display text-base font-bold">{t('payments.recentTitle')}</h3><span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{t('payments.entries', { count: 2 })}</span></div>
          <div className="mt-3 space-y-2.5">
            {[[t('payments.row1Date'), t('payments.row1Meta'), '₹11,150.00', t('payments.cleared')], [t('payments.row2Date'), t('payments.row2Meta'), '₹4,850.00', t('payments.cleared')]].map(([date, meta, value, status]) => (
              <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3.5 py-3" key={date as string}><div className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-4 w-4" /></span><div><p className="text-xs font-bold">{date} <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">{status}</span></p><p className="mt-0.5 text-[10px] text-muted-foreground">{meta}</p></div></div><p className="font-display text-sm font-bold text-primary">{value}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-[hsl(var(--primary)/.05)] p-5 text-sm">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div><p className="font-bold text-primary">{t('payments.escrowProtection')}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{t('payments.escrowBody')}</p></div>
        </div>
        <div className="flex flex-col justify-center gap-3 rounded-2xl border border-primary/15 bg-[hsl(var(--primary)/.05)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-sm font-bold">{t('payments.queryTitle')}</p><p className="mt-1 text-xs text-muted-foreground">{t('payments.queryBody')}</p></div>
          <button onClick={() => showNotice('Calling FPO secretary Ramesh Verma (block 09:00–17:00).')} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90" data-testid="button-call-secretary"><Phone className="h-3.5 w-3.5" /> {t('payments.callSecretary')}</button>
        </div>
      </section>
    </div>
  );
}

function FarmerLogistics() {
  const t = useLang().t;
  const [notice, setNotice] = useState('');
  const showNotice = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 4000); };
  const steps = [
    { label: t('logistics.step1Label'), time: t('logistics.step1Time'), note: t('logistics.step1Note'), done: true, active: false, icon: 'check' },
    { label: t('logistics.step2Label'), time: t('logistics.step2Time'), note: t('logistics.step2Note'), done: true, active: false, icon: 'check' },
    { label: t('logistics.step3Label'), time: t('logistics.step3Time'), note: t('logistics.step3Note'), done: false, active: true, icon: 'truck' },
    { label: t('logistics.step4Label'), time: t('logistics.step4Time'), note: t('logistics.step4Note'), done: false, active: false, icon: 'store' },
  ];
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t('logistics.eyebrow')}
        title={t('logistics.title')}
        description={t('logistics.description')}
        action={<span className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800" data-testid="text-live-tracking"><span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" /></span> {t('logistics.liveTracking')}</span>}
      />
      {notice ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" data-testid="text-logistics-notice">{notice}</p> : null}
      <section className="rounded-2xl bg-accent p-6 text-accent-foreground">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-foreground/10"><Truck className="h-6 w-6" /></span><div><h2 className="font-display text-lg font-bold">{t('logistics.sharedTitle')}</h2><p className="mt-1 max-w-md text-xs leading-5 text-accent-foreground/80">{t('logistics.sharedBody')}</p></div></div>
          <div className="rounded-xl bg-card/90 px-4 py-3 text-center"><p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{t('logistics.youSaved')}</p><p className="font-display text-xl font-bold text-emerald-700">₹290</p></div>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
            <div><p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{t('logistics.shipmentLabel', { id: 'AG-8829' })}</p><h2 className="mt-0.5 font-display text-lg font-bold">{t('logistics.shipmentTitle')}</h2></div>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-800">{t('logistics.inTransit')}</span>
          </div>
          <div className="relative">
            <div className="relative h-64 overflow-hidden bg-[#EEF1E8]" data-testid="mock-map-farmer">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <pattern id="mock-grid-farmer" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#DCE4D2" strokeWidth="1" /></pattern>
                <rect width="600" height="240" fill="url(#mock-grid-farmer)" />
                <path d="M-20 200 C 130 160, 260 120, 390 80 S 590 30, 630 15" fill="none" stroke="#C4D3C2" strokeWidth="22" strokeLinecap="round" />
                <path d="M-20 200 C 130 160, 260 120, 390 80 S 590 30, 630 15" fill="none" stroke="#9FB89B" strokeWidth="4" strokeDasharray="10 8" />
                <path d="M-20 130 C 150 120, 330 130, 630 95" fill="none" stroke="#D8E2D3" strokeWidth="12" strokeLinecap="round" />
              </svg>
              <div className="absolute left-[6%] top-[72%] flex -translate-x-1/2 flex-col items-center"><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-card bg-accent text-accent-foreground shadow"><Check className="h-4 w-4" /></span><span className="mt-1.5 rounded-md bg-card/90 px-2 py-1 text-center text-[10px] font-bold shadow"><p>{t('logistics.mapOrigin')}</p><p className="font-medium text-muted-foreground">{t('logistics.mapLoaded')}</p></span></div>
              <div className="absolute left-[52%] top-[42%] flex -translate-x-1/2 flex-col items-center"><span className="grid h-9 w-9 place-items-center rounded-full border-2 border-accent bg-primary text-primary-foreground shadow-lg"><Navigation className="h-4 w-4" /></span><span className="mt-1.5 rounded-md bg-card/90 px-2 py-1 text-center text-[10px] font-bold shadow"><p className="text-primary">{t('logistics.mapNow')}</p><p className="font-medium text-muted-foreground">{t('logistics.mapTowards')}</p></span></div>
              <div className="absolute left-[88%] top-[14%] flex -translate-x-1/2 flex-col items-center"><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-card bg-emerald-600 text-white shadow"><Store className="h-4 w-4" /></span><span className="mt-1.5 rounded-md bg-card/90 px-2 py-1 text-center text-[10px] font-bold shadow"><p>{t('logistics.mapDest')}</p><p className="font-medium text-muted-foreground">{t('logistics.mapEta')}</p></span></div>
              <div className="absolute bottom-3 right-4 flex items-center gap-1.5"><span className="rounded-md bg-card/90 px-2 py-1 text-[10px] font-bold shadow"><Gauge className="mr-1 inline h-3 w-3 text-accent" /> {t('logistics.speed')}</span><span className="rounded-md bg-card/90 px-2 py-1 text-[10px] font-bold shadow">{t('logistics.chilled')}</span></div>
            </div>
          </div>
          <div className="divide-y divide-border">
            {steps.map((step, index) => (
              <div className="flex gap-3.5 px-5 py-4 sm:px-6" key={step.label}>
                <div className="flex flex-col items-center"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[10px] font-bold ${step.active ? 'bg-accent text-accent-foreground' : step.done ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>{step.icon === 'check' ? <Check className="h-4 w-4" /> : step.icon === 'truck' ? <Truck className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}</span>{index < 3 ? <span className={`mt-1 h-full w-px ${step.done || step.active ? 'bg-emerald-200' : 'bg-border'}`} /> : null}</div>
                <div className="min-w-0 flex-1 pb-1"><div className="flex items-baseline justify-between gap-1"><p className={`text-xs font-bold ${step.active ? 'text-accent' : ''}`}>{step.label}{step.active ? <span className="ml-1.5 rounded bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-accent">{t('logistics.active')}</span> : null}</p><span className={`font-mono-app text-[10px] font-normal ${step.active ? 'font-bold text-accent' : 'text-muted-foreground'}`}>{step.time}</span></div><p className="mt-0.5 text-xs leading-5 text-muted-foreground">{step.note}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4"><h3 className="font-display text-base font-bold">{t('logistics.vehicleTitle')}</h3><span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700"><BadgeCheck className="h-3.5 w-3.5" /> {t('logistics.certified')}</span></div>
            <div className="p-5">
              <div className="flex items-center gap-3"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[hsl(var(--primary)/.08)] font-display text-sm font-bold text-primary">SS</span><div className="min-w-0 flex-1"><p className="text-sm font-bold">Santosh Shinde <span className="ml-1 text-[11px] font-bold text-accent">★ 4.9</span></p><p className="mt-0.5 text-xs text-muted-foreground">{t('logistics.driverMeta')}</p></div></div>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {([[t('logistics.reefer'), t('logistics.reeferVal'), Gauge], [t('logistics.capacity'), t('logistics.capacityVal'), Package]] as [string, string, typeof Gauge][]).map(([label, value, Icon]) => (
                  <div className="rounded-xl bg-muted/45 p-3" key={label as string}><p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground"><Icon className="h-3.5 w-3.5 text-accent" /> {label}</p><p className="mt-1 text-xs font-bold">{value}</p></div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <button onClick={() => showNotice('Calling driver Santosh Shinde (picked-up route partner).')} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-90" data-testid="button-call-driver"><Phone className="h-3.5 w-3.5" /> {t('logistics.callDriver')}</button>
                <button onClick={() => showNotice('WhatsApp message draft opened for driver Santosh Shinde.')} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-bold hover:bg-muted" data-testid="button-whatsapp-driver"><Mail className="h-3.5 w-3.5" /> {t('logistics.whatsapp')}</button>
              </div>
            </div>
          </div>
          <div className="panel p-5">
            <div className="flex items-center justify-between"><h3 className="font-display text-base font-bold">{t('logistics.pickupCenter')}</h3><span className="text-[11px] font-bold text-accent">{t('logistics.pickupHub')}</span></div>
            <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-muted-foreground"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" /> {t('logistics.pickupAddress')}</p>
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-muted/45 p-3">
              <div className="min-w-0"><p className="text-xs font-bold">{t('logistics.weighSlip')}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{t('logistics.weighMeta')}</p></div>
              <button onClick={() => showNotice('Weigh slip #WS-8829 opened — 650.00 kg net, signed by weighmaster.')} className="shrink-0 rounded-lg bg-muted px-3 py-1.5 text-xs font-bold hover:bg-muted/80" data-testid="button-view-slip">{t('logistics.view')}</button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2.5"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-700"><Phone className="h-4 w-4" /></span><div><p className="text-xs font-bold">{t('logistics.helplineTitle')}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{t('logistics.helplineSub')}</p></div></div>
            <button onClick={() => showNotice('Dialing farmer helpline 1800-0000-123 (24×7).')} className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90" data-testid="button-helpline">{t('logistics.contact')}</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function BuyerMarketplace() {
  const [bidOn, setBidOn] = useState<BuyerAuction | null>(null);
  const [bidValue, setBidValue] = useState('');
  const [placed, setPlaced] = useState<string[]>([]);
  const liveCount = buyerAuctions.filter((auction) => auction.live).length;
  const placeBid = () => {
    if (!bidOn) return;
    setPlaced((old) => [...old, bidOn.id]);
    setBidOn(null);
    setBidValue('');
  };
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Buyer / live marketplace"
        title="Source at a fair price, in real time."
        description="Live lots, pooled prices and verified FPO supply near your delivery nodes. This is a prototype view with sample data."
        action={<Link href="/buyer/demands" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90" data-testid="link-post-demand">Post a demand <ArrowRight className="h-4 w-4" /></Link>}
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Live auctions', value: String(liveCount), note: 'closing in the next 3 hours', icon: Gavel },
          { label: 'Pooled demand', value: '186 MT', note: 'across 6 sourcing nodes', icon: FileStack },
          { label: 'Avg. pooling saving', value: '₹340/q', note: 'against local mandi rates', icon: TrendingDown },
          { label: 'Sourced this month', value: '412 MT', note: 'from 18 verified FPOs', icon: Truck },
        ].map(({ label, value, note, icon: Icon }, index) => (
          <div className={`panel enter enter-delay-${index + 1} p-5`} key={label}>
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{label}</p>
              <Icon className="h-4 w-4 text-accent" />
            </div>
            <p className="mt-5 font-display text-3xl font-bold tracking-tight text-primary">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{note}</p>
          </div>
        ))}
      </section>
      <section className="panel overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-7">
          <div>
            <h2 className="font-display text-xl font-bold">Today&apos;s node prices</h2>
            <p className="mt-1 text-xs text-muted-foreground">Indicative pooled prices from verified FPOs, per quintal.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--accent)/.25)] bg-[hsl(var(--accent)/.08)] px-3 py-1.5 text-xs font-semibold text-accent"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Updating live</span>
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-3">
          {buyerMarketPrices.map((item) => {
            const up = item.change >= 0;
            return (
              <div className="bg-card p-5" key={item.crop}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.crop}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.grade} · {item.node}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${up ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{up ? '+' : ''}{item.change}%
                  </span>
                </div>
                <p className="mt-4 font-display text-2xl font-bold text-primary">{inr(item.price)}<span className="ml-1 text-xs font-semibold text-muted-foreground">/ q</span></p>
              </div>
            );
          })}
        </div>
      </section>
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono-app text-[10px] uppercase tracking-[.2em] text-accent">Produce auctions</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">Bid on graded, ready-to-lift lots.</h2>
          </div>
          <p className="text-xs text-muted-foreground">All lots carry FPO verification and a weighbridge record.</p>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {buyerAuctions.map((auction) => {
            const isPlaced = placed.includes(auction.id);
            return (
              <div className="panel lift p-5 sm:p-6" key={auction.id} data-testid={`card-auction-${auction.id}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[hsl(var(--primary)/.1)] text-primary"><Gavel className="h-5 w-5" /></span>
                    <div>
                      <p className="font-mono-app text-[10px] uppercase tracking-[.16em] text-muted-foreground">{auction.id}</p>
                      <h3 className="mt-1 font-display text-xl font-bold leading-tight">{auction.grade} {auction.crop}</h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {auction.fpo} · {auction.node}</p>
                    </div>
                  </div>
                  <Pill label={auction.live ? 'Live' : 'Closed'} tone={auction.live ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'} />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5 sm:grid-cols-4">
                  {[['Quantity', auction.quantity], ['Lots', `${auction.lots} available`], ['Base price', `${inr(auction.basePrice)} / q`], ['Top bid', `${inr(auction.topBid)} / q`]].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-muted-foreground">{label}</p>
                      <p className="mt-1 text-sm font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Timer className="h-3.5 w-3.5" /> {auction.bids} bids · closes {auction.closesIn}</span>
                  {auction.live ? (
                    isPlaced ? <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700"><Check className="h-4 w-4" /> Bid placed</span> : <button onClick={() => { setBidOn(auction); setBidValue(String(auction.topBid + 50)); }} className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90" data-testid={`button-bid-${auction.id}`}>Place bid <ArrowRight className="h-4 w-4" /></button>
                  ) : <span className="text-xs font-semibold text-muted-foreground">Auction closed</span>}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {bidOn ? (
        <Modal title={`Bid on ${bidOn.grade} ${bidOn.crop}`} onClose={() => setBidOn(null)}>
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm">
            <p className="text-xs text-muted-foreground">{bidOn.id} · {bidOn.fpo} · {bidOn.node}</p>
            <p className="mt-2 font-semibold">{bidOn.quantity} across {bidOn.lots} lots</p>
            <p className="mt-1 text-xs text-muted-foreground">Current top bid {inr(bidOn.topBid)} / q · base {inr(bidOn.basePrice)} / q</p>
          </div>
          <div className="mt-5"><Field label="Your bid (₹ per quintal)" value={bidValue} onChange={setBidValue} /></div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">Prototype only — no contract is created and no payment is captured.</p>
          <ModalActions onCancel={() => setBidOn(null)} onConfirm={placeBid} confirm="Place bid" disabled={!bidValue || Number(bidValue) <= bidOn.topBid} />
        </Modal>
      ) : null}
    </div>
  );
}

function BuyerDemands() {
  const [demands, setDemands] = useState<BuyerDemand[]>(fallbackDemands);
  const [modal, setModal] = useState(false);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({ crop: 'Tur dal', grade: 'Grade A', volume: '', repeat: 'Monthly', window: '', node: buyerNodes[0], offer: '', notes: '' });
  const submit = () => {
    const next: BuyerDemand = {
      id: `DEM-${204 + demands.length}`,
      crop: form.crop,
      grade: form.grade,
      volume: Number(form.volume) || 0,
      repeat: form.repeat,
      window: form.window || 'To be confirmed',
      node: form.node,
      offer: Number(form.offer) || 0,
      status: 'Pooling',
      matched: 0,
    };
    setDemands((old) => [next, ...old]);
    setModal(false);
    setNotice(`${next.id} posted. Nearby FPOs will be matched within a few hours.`);
    setForm({ crop: 'Tur dal', grade: 'Grade A', volume: '', repeat: 'Monthly', window: '', node: buyerNodes[0], offer: '', notes: '' });
  };
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Buyer / sourcing" title="Post once, pool the demand." description="Tell the network what you need and when. Nearby FPOs respond with graded, verified supply." action={<button onClick={() => setModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90" data-testid="button-new-demand"><span className="text-lg leading-none">+</span> New demand</button>} />
      {notice ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" data-testid="text-demand-notice">{notice}</p> : null}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[['Open demands', String(demands.length), 'across 4 crops'], ['Pooled volume', '186 MT', 'this sourcing cycle'], ['Average saving', '₹340 / q', 'vs local mandi'], ['Buyers pooling', '27', 'in your nodes']].map(([label, value, note], index) => (
          <div className={`panel enter enter-delay-${index + 1} p-5`} key={label}>
            <p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{label}</p>
            <p className="mt-4 font-display text-3xl font-bold text-primary">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{note}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <div className="panel overflow-hidden">
          <div className="border-b border-border px-5 py-4 sm:px-6"><h2 className="font-display text-xl font-bold">My sourcing demands</h2><p className="mt-1 text-xs text-muted-foreground">Prototype demands with live match progress.</p></div>
          <div className="divide-y divide-border">
            {demands.map((demand) => (
              <div className="px-5 py-4 sm:px-6" key={demand.id} data-testid={`row-demand-${demand.id}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[hsl(var(--primary)/.08)] text-primary"><FileStack className="h-5 w-5" /></span>
                    <div>
                      <p className="text-sm font-semibold">{demand.grade} {demand.crop} · {demand.volume} MT</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{demand.id} · {demand.repeat} · {demand.node} · offer {inr(demand.offer)} / q</p>
                    </div>
                  </div>
                  <Pill label={demand.status} />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-accent" style={{ width: `${demand.matched}%` }} /></div>
                  <span className="text-[11px] font-semibold text-muted-foreground">{demand.matched}% matched</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel overflow-hidden">
          <div className="border-b border-border px-5 py-4 sm:px-6"><h2 className="font-display text-xl font-bold">This week&apos;s lifting plan</h2><p className="mt-1 text-xs text-muted-foreground">Pickup volumes you have committed to.</p></div>
          <div className="divide-y divide-border">
            {demandCalendar.map((slot, index) => (
              <div className={`flex items-center gap-3 px-5 py-3.5 sm:px-6 ${index === 2 ? 'bg-[hsl(var(--accent)/.06)]' : ''}`} key={slot.day}>
                <span className={`grid h-9 w-9 place-items-center rounded-lg text-xs font-bold ${index === 2 ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>{slot.day.slice(0, 2)}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{slot.crop}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{slot.node}</p></div>
                <span className="text-sm font-semibold text-primary">{slot.volume} MT</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="panel overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
          <div><h2 className="font-display text-xl font-bold">Knock-in pool</h2><p className="mt-1 text-xs text-muted-foreground">Verified FPO lots that match your open demands.</p></div>
          <span className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-semibold text-muted-foreground">{poolRequisitions.length} offers</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-muted/45 font-mono-app text-[10px] uppercase tracking-[.13em] text-muted-foreground">
              <tr><th className="px-5 py-3 font-medium">FPO</th><th className="px-5 py-3 font-medium">Produce</th><th className="px-5 py-3 font-medium">Quantity</th><th className="px-5 py-3 font-medium">Offer</th><th className="px-5 py-3 font-medium">Window</th><th className="px-5 py-3 font-medium">Availability</th><th className="px-5 py-3 font-medium" /></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {poolRequisitions.map((row) => (
                <tr className="transition-colors hover:bg-muted/40" key={`${row.fpo}-${row.crop}`}>
                  <td className="px-5 py-4 text-sm font-semibold">{row.fpo}</td>
                  <td className="px-5 py-4 text-sm">{row.crop}</td>
                  <td className="px-5 py-4 text-sm">{row.quantity}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-primary">{inr(row.offer)} / q</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{row.window}</td>
                  <td className="px-5 py-4"><Pill label={row.available} /></td>
                  <td className="px-5 py-4 text-right"><button onClick={() => setNotice(`Pooled ${row.quantity} of ${row.crop} from ${row.fpo}.`)} className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-muted" data-testid={`button-knock-in-${row.crop.toLowerCase().replaceAll(' ', '-')}`}>Knock in</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {modal ? (
        <Modal title="Post a sourcing demand" onClose={() => setModal(false)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Commodity" value={form.crop} options={cropOptions} onChange={(value) => setForm({ ...form, crop: value })} />
            <SelectField label="Grade / spec" value={form.grade} options={['Grade A', 'Grade B', 'FAQ', 'FAQ+']} onChange={(value) => setForm({ ...form, grade: value })} />
            <Field label="Volume (MT)" value={form.volume} onChange={(value) => setForm({ ...form, volume: value })} />
            <SelectField label="Repeat" value={form.repeat} options={['One-time', 'Weekly', 'Bi-weekly', 'Monthly']} onChange={(value) => setForm({ ...form, repeat: value })} />
            <Field label="Quality window" value={form.window} onChange={(value) => setForm({ ...form, window: value })} placeholder="e.g. Nov – Jan" />
            <SelectField label="Pickup node" value={form.node} options={buyerNodes} onChange={(value) => setForm({ ...form, node: value })} />
            <Field label="Offer price (₹ / quintal)" value={form.offer} onChange={(value) => setForm({ ...form, offer: value })} />
            <Field label="Notes (optional)" value={form.notes} onChange={(value) => setForm({ ...form, notes: value })} />
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">Prototype only — this adds a sample demand to the list on this screen and does not reach any FPO.</p>
          <ModalActions onCancel={() => setModal(false)} onConfirm={submit} confirm="Post demand" disabled={!form.volume || !form.offer} />
        </Modal>
      ) : null}
    </div>
  );
}

function BuyerOrders() {
  const focus = fallbackOrders[0];
  const steps = ['Dispatched', 'In transit', 'Weighbridge', 'Delivered'];
  const activeStep = 1;
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Buyer / logistics" title="Every load, tracked to the kilo." description="Follow dispatch, weighbridge and settlement for each order from verified FPOs." />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'In transit', value: '1', note: 'live shipment', icon: Truck },
          { label: 'At weighbridge', value: '1', note: 'awaiting net weight', icon: Scale },
          { label: 'Delivered this week', value: '7', note: 'orders closed', icon: PackageCheck },
          { label: 'On-time rate', value: '94%', note: 'last 30 dispatches', icon: Navigation },
        ].map(({ label, value, note, icon: Icon }, index) => (
          <div className={`panel enter enter-delay-${index + 1} p-5`} key={label}>
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{label}</p>
              <Icon className="h-4 w-4 text-accent" />
            </div>
            <p className="mt-5 font-display text-3xl font-bold tracking-tight text-primary">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{note}</p>
          </div>
        ))}
      </section>
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono-app text-[10px] uppercase tracking-[.2em] text-accent">Fleet telemetry</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">Where your produce is, right now.</h2>
          </div>
          <p className="text-xs text-muted-foreground">Simulated GPS pings for the prototype.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {fleetTelemetry.map((truck) => (
            <div className="panel p-5" key={truck.vehicle}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--primary)/.1)] text-primary"><Truck className="h-5 w-5" /></span>
                  <div>
                    <p className="text-sm font-bold">{truck.vehicle}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{truck.driver} · {truck.route}</p>
                  </div>
                </div>
                <Pill label={truck.status} />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground"><span>{truck.load}</span><span>{truck.speed}</span></div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${truck.status === 'Delayed' ? 'bg-accent' : 'bg-primary'}`} style={{ width: `${truck.progress}%` }} /></div>
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Navigation className="h-3.5 w-3.5" /> ETA {truck.eta}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="panel overflow-hidden">
        <div className="border-b border-border px-5 py-4 sm:px-6"><h2 className="font-display text-xl font-bold">Orders</h2><p className="mt-1 text-xs text-muted-foreground">Every procurement order and where it stands.</p></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead className="bg-muted/45 font-mono-app text-[10px] uppercase tracking-[.13em] text-muted-foreground">
              <tr><th className="px-5 py-3 font-medium">Order</th><th className="px-5 py-3 font-medium">Produce</th><th className="px-5 py-3 font-medium">FPO</th><th className="px-5 py-3 font-medium">Vehicle</th><th className="px-5 py-3 font-medium">ETA</th><th className="px-5 py-3 font-medium">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {fallbackOrders.map((order) => (
                <tr className="transition-colors hover:bg-muted/40" key={order.id} data-testid={`row-order-${order.id}`}>
                  <td className="px-5 py-4 font-mono-app text-xs font-semibold">{order.id}</td>
                  <td className="px-5 py-4 text-sm">{order.crop} · {order.quantity}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{order.fpo}</td>
                  <td className="px-5 py-4 font-mono-app text-xs text-muted-foreground">{order.vehicle}</td>
                  <td className="px-5 py-4 text-sm">{order.eta}</td>
                  <td className="px-5 py-4"><Pill label={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <div className="panel p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-muted-foreground">{focus.id}</p><h2 className="mt-2 font-display text-xl font-bold">Karad → Pune in motion</h2></div>
            <Pill label={focus.status} />
          </div>
          <div className="mt-7 space-y-4">
            {steps.map((step, index) => (
              <div className="flex items-center gap-3" key={step}>
                <span className={`grid h-7 w-7 place-items-center rounded-full border text-xs font-bold ${index < activeStep ? 'border-primary bg-primary text-primary-foreground' : index === activeStep ? 'border-accent bg-accent text-accent-foreground' : 'border-border bg-card text-muted-foreground'}`}>{index < activeStep ? <Check className="h-3.5 w-3.5" /> : index + 1}</span>
                <span className={`text-sm font-semibold ${index <= activeStep ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</span>
                {index === activeStep ? <span className="ml-auto text-xs text-muted-foreground">{focus.progress}% complete</span> : null}
              </div>
            ))}
          </div>
          <div className="mt-7 rounded-xl border border-[hsl(var(--accent)/.22)] bg-[hsl(var(--accent)/.07)] p-4 text-sm leading-6 text-muted-foreground">
            <Navigation className="mb-2 h-4 w-4 text-accent" />
            Driver Santosh Pawar is 62% along the route. Weighbridge slot is reserved for 4:40 PM.
          </div>
        </div>
        <div className="panel overflow-hidden">
          <div className="border-b border-border px-5 py-4 sm:px-6"><h2 className="font-display text-xl font-bold">Weighbridge ledger</h2><p className="mt-1 text-xs text-muted-foreground">Net weights recorded at the node.</p></div>
          <div className="divide-y divide-border">
            {weighbridgeLedger.map((entry) => (
              <div className="px-5 py-4 sm:px-6" key={entry.slip}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono-app text-xs font-semibold">{entry.slip}</p>
                  <span className="text-xs text-muted-foreground">{entry.at}</span>
                </div>
                <p className="mt-1.5 text-sm font-semibold">{entry.crop} · {entry.fpo}</p>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground"><span>Gross {entry.gross}</span><span>Tare {entry.tare}</span><span className="font-semibold text-primary">Net {entry.net}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function BuyerInvoices() {
  const outstanding = fallbackInvoices.filter((invoice) => invoice.status !== 'Paid').reduce((sum, invoice) => sum + invoice.amount, 0);
  const paid = fallbackInvoices.filter((invoice) => invoice.status === 'Paid').reduce((sum, invoice) => sum + invoice.amount, 0);
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Buyer / finance" title="Settlement without the guesswork." description="Invoice, weighbridge and payment records for every order, in one place." />
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Outstanding', value: inr(outstanding), note: '2 invoices awaiting payment', icon: Wallet },
          { label: 'Paid this cycle', value: inr(paid), note: 'settled on time', icon: Check },
          { label: 'Invoices on file', value: String(fallbackInvoices.length), note: 'prototype records', icon: Receipt },
        ].map(({ label, value, note, icon: Icon }, index) => (
          <div className={`panel enter enter-delay-${index + 1} p-5`} key={label}>
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{label}</p>
              <Icon className="h-4 w-4 text-accent" />
            </div>
            <p className="mt-4 font-display text-2xl font-bold tracking-tight text-primary">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{note}</p>
          </div>
        ))}
      </section>
      <section className="panel overflow-hidden">
        <div className="border-b border-border px-5 py-4 sm:px-6"><h2 className="font-display text-xl font-bold">Invoices</h2><p className="mt-1 text-xs text-muted-foreground">Sample settlement records for the prototype.</p></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-muted/45 font-mono-app text-[10px] uppercase tracking-[.13em] text-muted-foreground">
              <tr><th className="px-5 py-3 font-medium">Invoice</th><th className="px-5 py-3 font-medium">Order</th><th className="px-5 py-3 font-medium">FPO</th><th className="px-5 py-3 font-medium">Amount</th><th className="px-5 py-3 font-medium">Due</th><th className="px-5 py-3 font-medium">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {fallbackInvoices.map((invoice) => (
                <tr className="transition-colors hover:bg-muted/40" key={invoice.id} data-testid={`row-invoice-${invoice.id}`}>
                  <td className="px-5 py-4 font-mono-app text-xs font-semibold">{invoice.id}</td>
                  <td className="px-5 py-4 font-mono-app text-xs text-muted-foreground">{invoice.order}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{invoice.fpo}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-primary">{inr(invoice.amount)}</td>
                  <td className="px-5 py-4 text-sm">{invoice.due}</td>
                  <td className="px-5 py-4"><Pill label={invoice.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="flex items-start gap-3 rounded-2xl border border-[hsl(var(--accent)/.22)] bg-[hsl(var(--accent)/.07)] p-5 text-sm leading-6 text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <p>Every invoice is backed by a weighbridge slip and the FPO&apos;s verification record. Payment terms default to seven days from net-weight acceptance.</p>
      </section>
    </div>
  );
}

type ChatMessage = { id: number; role: 'agent' | 'user'; text: string; time?: string };

function Chatbot() {
  const { t, locale } = useLang();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const replyTimer = useRef<number | undefined>(undefined);

  const getCurrentTime = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    setMessages([{ id: Date.now(), role: 'agent', text: t('chat.greeting'), time: getCurrentTime() }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  useEffect(() => {
    if (open) {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, open, isTyping]);

  useEffect(() => () => window.clearTimeout(replyTimer.current), []);

  const quickReplies: { label: string; reply: string }[] = [
    { label: t('chat.quick1'), reply: t('chat.replyPayment') },
    { label: t('chat.quick2'), reply: t('chat.replyPickup') },
    { label: t('chat.quick3'), reply: t('chat.replyRate') },
    { label: t('chat.quick4'), reply: t('chat.replyJoin') },
    { label: t('chat.quick5'), reply: t('chat.replyEscrow') },
    { label: t('chat.quick6'), reply: t('chat.replyLogistics') },
  ];

  const answerFor = (question: string): string => {
    const q = question.toLowerCase();
    if (/(escrow|dbt|nabard|safe|vault|सुरक्षा|एस्क्रो|खात|डिपॉजिट|रक्कम)/.test(q)) return t('chat.replyEscrow');
    if (/(reefer|cold|storage|freeze|pooling|truck|saving|बचत|कोल्ड|गाड़ी|वाहतूक|भाडे|थंड)/.test(q)) return t('chat.replyLogistics');
    if (/(pay|payment|money|rupee|bank|payout|balance|भुगतान|पैस|रुपय|बैंक|देयक|बँक|पैसे)/.test(q)) return t('chat.replyPayment');
    if (/(pick|collect|schedule|route|पिकअप|संग्रह|ट्रक|वाहन|वेळ)/.test(q)) return t('chat.replyPickup');
    if (/(rate|price|mandi|market|apmc|cost|दर|भाव|मंडी|किंमत|बाजार|किंमती)/.test(q)) return t('chat.replyRate');
    if (/(join|member|fpo|register|apply|सदस्य|जॉइन|सभासद|समूह|गट|नोंदणी)/.test(q)) return t('chat.replyJoin');
    return t('chat.replyFallback');
  };

  const send = (text: string, canned?: string) => {
    const value = text.trim();
    if (!value) return;
    setInput('');
    const time = getCurrentTime();
    setMessages((current) => [...current, { id: Date.now(), role: 'user', text: value, time }]);
    setIsTyping(true);
    window.clearTimeout(replyTimer.current);
    replyTimer.current = window.setTimeout(() => {
      setIsTyping(false);
      setMessages((current) => [...current, { id: Date.now() + 1, role: 'agent', text: canned ?? answerFor(value), time: getCurrentTime() }]);
    }, 600);
  };

  const handleClear = () => {
    setMessages([{ id: Date.now(), role: 'agent', text: t('chat.greeting'), time: getCurrentTime() }]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3" data-testid="chatbot">
      {open ? (
        <div className="flex w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all">
          <div className="flex items-center justify-between border-b border-border bg-[hsl(var(--primary)/.06)] p-3.5 sm:p-4">
            <div className="flex items-center gap-3">
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Bot className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-foreground">{t('chat.title')}</p>
                <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  {t('chat.statusOnline')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                className="rounded-lg px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title={t('chat.clear')}
                data-testid="button-chatbot-clear"
              >
                {t('chat.clear')}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label={t('chat.close')}
                data-testid="button-chatbot-close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div ref={listRef} className="flex max-h-[350px] min-h-[220px] flex-col gap-3 overflow-y-auto p-4" data-testid="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    message.role === 'user'
                      ? 'rounded-br-sm bg-primary text-primary-foreground shadow-sm'
                      : 'rounded-bl-sm border border-border bg-muted/60 text-foreground'
                  }`}
                >
                  {message.text}
                </div>
                {message.time ? (
                  <span className="mt-1 px-1 font-mono-app text-[9px] text-muted-foreground/75">{message.time}</span>
                ) : null}
              </div>
            ))}
            {isTyping ? (
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-muted/60 px-3.5 py-2.5 text-xs text-muted-foreground w-fit">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: '300ms' }} />
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-1.5 border-t border-border bg-muted/20 px-3.5 py-2.5 max-h-[96px] overflow-y-auto">
            {quickReplies.map((item) => (
              <button
                key={item.label}
                onClick={() => send(item.label, item.reply)}
                className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:border-primary/40 hover:bg-muted hover:text-foreground transition-colors"
                data-testid="chatbot-quick-reply"
              >
                {item.label}
              </button>
            ))}
          </div>

          <form onSubmit={(event) => { event.preventDefault(); send(input); }} className="flex items-center gap-2 border-t border-border bg-card p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t('chat.placeholder')}
              className="field h-10 w-full text-xs"
              data-testid="input-chatbot"
            />
            <button
              type="submit"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 shadow-sm transition-opacity"
              disabled={!input.trim()}
              aria-label={t('chat.send')}
              data-testid="button-chatbot-send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : null}

      <button
        onClick={() => setOpen((current) => !current)}
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-2xl transition-transform hover:scale-105 active:scale-95"
        aria-label={open ? t('chat.close') : t('chat.open')}
        data-testid="button-chatbot-toggle"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open ? (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-card bg-accent text-[10px] font-bold text-accent-foreground">
            1
          </span>
        ) : null}
        {!open ? (
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-semibold text-background shadow-md sm:group-hover:block">
            {t('chat.open')}
          </span>
        ) : null}
      </button>
    </div>
  );
}

function Router({ session, onSignedIn, onSignOut }: { session: AuthSession; onSignedIn: (session: AuthSession) => void; onSignOut: () => void }) {
  const [location] = useLocation();
  const isPublic = location === '/' || location.startsWith('/login/');
  const role = session.user?.role;
  useEffect(() => {
    if (!isPublic && !session.user) {
      window.history.replaceState({}, '', '/login/farmer');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [isPublic, session.user]);
  const publicRoutes = <Switch><Route path="/" component={LandingPage} /><Route path="/login/:role" component={() => <RoleLogin onSignedIn={onSignedIn} />} /><Route component={NotFound} /></Switch>;
  const workspaceRoutes = session.user && role ? <AppShell user={session.user} onSignOut={onSignOut}><Switch><Route path="/workspace" component={() => <Home role={role} />} /><Route path="/fpo/onboarding" component={FpoOnboarding} /><Route path="/fpo/status" component={FpoStatus} /><Route path="/fpo/members" component={Members} /><Route path="/fpo/demand" component={FpoDemandListings} /><Route path="/fpo/logistics" component={FpoLogistics} /><Route path="/fpo/analytics" component={FpoAnalytics} /><Route path="/farmer/fpos" component={FarmerFpos} /><Route path="/farmer/fpos/:id" component={FpoProfile} /><Route path="/farmer/join/:id" component={JoinFpo} /><Route path="/farmer/sales" component={FarmerSales} /><Route path="/farmer/payments" component={FarmerPayments} /><Route path="/farmer/logistics" component={FarmerLogistics} /><Route path="/farmer/passbook" component={FarmerPassbook} /><Route path="/admin/fpos" component={AdminFpos} /><Route path="/admin/fpos/:id" component={AdminDetail} /><Route path="/buyer/marketplace" component={BuyerMarketplace} /><Route path="/buyer/demands" component={BuyerDemands} /><Route path="/buyer/orders" component={BuyerOrders} /><Route path="/buyer/invoices" component={BuyerInvoices} /><Route component={NotFound} /></Switch></AppShell> : publicRoutes;
  return <><ErrorBoundary resetKey={location}>{isPublic ? publicRoutes : workspaceRoutes}</ErrorBoundary><Chatbot /></>;
}

function AuthenticatedApp() {
  const sessionQuery = useGetAuthSession();
  const signOut = useSignOut();
  const [sessionOverride, setSessionOverride] = useState<AuthSession | null>(null);
  const session = sessionOverride ?? sessionQuery.data;
  const handleSignedIn = (nextSession: AuthSession) => {
    setSessionOverride(nextSession);
    queryClient.setQueryData(getGetAuthSessionQueryKey(), nextSession);
  };
  const handleSignOut = () => {
    const signedOutSession: AuthSession = { authenticated: false, user: null };
    setSessionOverride(signedOutSession);
    queryClient.clear();
    queryClient.setQueryData(getGetAuthSessionQueryKey(), signedOutSession);
    window.history.replaceState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
    signOut.mutate(undefined, { onError: () => undefined });
  };
  return <TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>{sessionQuery.isLoading && !session ? <LoadingPage /> : <Router session={session ?? { authenticated: false, user: null }} onSignedIn={handleSignedIn} onSignOut={handleSignOut} />}</WouterRouter><Toaster /></TooltipProvider>;
}

function App() {
  return <QueryClientProvider client={queryClient}><LanguageProvider><AuthenticatedApp /></LanguageProvider></QueryClientProvider>;
}

export default App;