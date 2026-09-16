import { type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  Download,
  Eye,
  EyeOff,
  FileCheck2,
  FileText,
  Filter,
  Globe2,
  Handshake,
  Landmark,
  LockKeyhole,
  LogIn,
  Mail,
  Leaf,
  ListFilter,
  Phone,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  Sprout,
  Tractor,
  UploadCloud,
  Users,
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
  useListAdminFpos,
  useListFpos,
  useListMembers,
  useSubmitFpoOnboarding,
  getGetAdminFpoQueryKey,
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

type Role = 'fpo' | 'farmer' | 'admin';

function statusTone(status?: string) {
  if (status === 'Verified' || status === 'Accepted') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (status === 'Rejected') return 'bg-rose-100 text-rose-800 border-rose-200';
  if (status === 'Under Review') return 'bg-amber-100 text-amber-900 border-amber-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

function StatusPill({ status }: { status?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusTone(status)}`} data-testid={`status-${status?.toLowerCase().replaceAll(' ', '-')}`}>
      {status === 'Verified' ? <BadgeCheck className="h-3.5 w-3.5" /> : null}
      {status || 'Pending'}
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

function AppShell({ children, role, setRole }: { children: ReactNode; role: Role; setRole: (role: Role) => void }) {
  const [mobileNav, setMobileNav] = useState(false);
  const [location] = useLocation();
  const nav = role === 'fpo'
    ? [
        { href: '/workspace', label: 'Overview', icon: Building2 },
        { href: '/fpo/onboarding', label: 'Verification', icon: ClipboardCheck },
        { href: '/fpo/status', label: 'Application status', icon: FileCheck2 },
        { href: '/fpo/members', label: 'Members', icon: Users },
      ]
    : role === 'farmer'
      ? [
          { href: '/workspace', label: 'My starting point', icon: Tractor },
          { href: '/farmer/fpos', label: 'Find an FPO', icon: Search },
        ]
      : [
          { href: '/workspace', label: 'Review desk', icon: ClipboardCheck },
          { href: '/admin/fpos', label: 'FPO submissions', icon: FileText },
        ];

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
          <span className="font-mono-app text-[10px] uppercase tracking-[.18em] text-sidebar-foreground/50">You are using</span>
          <div className="mt-2 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-sidebar-primary/90 text-sidebar-primary-foreground">
              {role === 'fpo' ? <Building2 className="h-4 w-4" /> : role === 'farmer' ? <Tractor className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            </span>
            <div>
              <p className="text-sm font-semibold">{role === 'fpo' ? 'FPO secretary' : role === 'farmer' ? 'Farmer' : 'Review officer'}</p>
              <p className="text-xs text-sidebar-foreground/55">Demo workspace</p>
            </div>
          </div>
        </div>
        <nav className="mt-8 space-y-1.5" aria-label="Main navigation">
          <p className="mb-3 px-3 font-mono-app text-[10px] uppercase tracking-[.18em] text-sidebar-foreground/40">Workspace</p>
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
              <p className="text-sm font-semibold">Trust, made visible</p>
              <p className="mt-1 text-xs leading-5 text-sidebar-foreground/55">Every verified FPO has a clear paper trail for farmers and buyers.</p>
            </div>
          </div>
        </div>
      </aside>
      {mobileNav ? <button className="fixed inset-0 z-30 bg-[hsl(var(--foreground)/.35)] lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close navigation" data-testid="button-navigation-overlay" /> : null}
      <main className="app-shell min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-border/70 bg-background/80 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 hover:bg-muted lg:hidden" onClick={() => setMobileNav(true)} data-testid="button-open-navigation"><Menu className="h-5 w-5" /></button>
            <div className="hidden text-sm text-muted-foreground sm:block">Good morning, <span className="font-semibold text-foreground">{role === 'fpo' ? 'Nandini' : role === 'farmer' ? 'Ravi' : 'Asha'}</span></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center rounded-lg border border-border bg-card/70 p-1 sm:flex">
              {(['fpo', 'farmer', 'admin'] as Role[]).map((item) => (
                <button key={item} onClick={() => setRole(item)} className={`rounded-md px-2.5 py-1.5 text-xs font-semibold capitalize transition-colors ${role === item ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`} data-testid={`button-switch-role-${item}`}>{item === 'admin' ? 'Reviewer' : item}</button>
              ))}
            </div>
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" data-testid="button-notifications" onClick={() => window.alert('You are all caught up.')}>
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
            </button>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[hsl(var(--accent)/.18)] text-sm font-bold text-[hsl(var(--accent))]" data-testid="avatar-current-user">{role === 'fpo' ? 'NG' : role === 'farmer' ? 'RK' : 'AS'}</div>
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
              <p className="font-mono-app text-[10px] uppercase tracking-[.2em] text-accent">One shared place, three ways in</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">Choose the work you need to do.</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Sign in to a workspace built around your role. You can switch viewpoints later from inside the demo.</p>
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
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

function RoleLogin({ setRole }: { setRole: (role: Role) => void }) {
  const { role: rawRole } = useParams<{ role: string }>();
  const [, navigate] = useLocation();
  const role: Role = rawRole === 'fpo' || rawRole === 'admin' ? rawRole : 'farmer';
  const option = loginOptions.find((item) => item.role === role) ?? loginOptions[0];
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const Icon = option.icon;
  const isFpo = role === 'fpo';
  const isAdmin = role === 'admin';
  const identityLabel = isFpo ? 'Registered mobile or email' : isAdmin ? 'Official email or employee ID' : 'Mobile number';
  const identityPlaceholder = isFpo ? 'secretary@yourfpo.org' : isAdmin ? 'reviewer@agri.gov.in' : '+91 98765 43210';
  const heading = isFpo ? 'Welcome back, secretary.' : isAdmin ? 'Welcome to the review desk.' : 'Welcome back, farmer.';
  const subheading = isFpo ? 'Pick up your FPO journey where you left it.' : isAdmin ? 'Keep every verification decision clear and accountable.' : 'Find your collective and keep your membership close.';

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setRole(role);
    window.setTimeout(() => navigate(role === 'fpo' ? '/workspace' : role === 'farmer' ? '/farmer/fpos' : '/admin/fpos'), 220);
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
                    <input className="field w-full pl-10 text-sm" value={identity} onChange={(event) => setIdentity(event.target.value)} placeholder={identityPlaceholder} required data-testid={`input-login-${role}-identity`} />
                    {isAdmin ? <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /> : <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />}
                  </div>
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold">Password</span>
                  <div className="relative">
                    <input className="field w-full pl-10 pr-11 text-sm" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required minLength={4} data-testid={`input-login-${role}-password`} />
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </div>
                </label>
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-muted-foreground"><input type="checkbox" className="accent-[hsl(var(--primary))]" /> Keep me signed in</label>
                  <button type="button" className="font-semibold text-accent hover:underline">Forgot password?</button>
                </div>
                <button type="submit" disabled={submitted} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60" data-testid={`button-login-${role}`}>
                  {submitted ? 'Opening workspace…' : 'Sign in'} <LogIn className="h-4 w-4" />
                </button>
              </form>
              <div className="mt-6 flex items-start gap-2 rounded-xl border border-[hsl(var(--accent)/.22)] bg-[hsl(var(--accent)/.07)] p-3.5 text-xs leading-5 text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>Demo mode: any valid-looking details will open the {option.label.toLowerCase()} workspace.</span>
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

function Home({ role, setRole }: { role: Role; setRole: (role: Role) => void }) {
  const { data, isLoading, isError } = useListFpos(undefined, { query: { queryKey: getListFposQueryKey(undefined) } });
  const fpos = data?.length ? data : fallbackFpos;
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
            {role === 'farmer' ? <Link href="/farmer/fpos" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90" data-testid="link-home-primary-action">Find a verified FPO <ArrowRight className="h-4 w-4" /></Link> : null}
            {role === 'admin' ? <Link href="/admin/fpos" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90" data-testid="link-home-primary-action">Open review desk <ArrowRight className="h-4 w-4" /></Link> : null}
            <button onClick={() => setRole(role === 'fpo' ? 'farmer' : role === 'farmer' ? 'admin' : 'fpo')} className="rounded-xl border border-border bg-card/75 px-4 py-3 text-sm font-semibold text-foreground hover:bg-card" data-testid="button-home-switch-role">Try another view</button>
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
  const fpo = data || fallbackFpos[0];
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
  const members = data?.length ? data : fallbackMembers;
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
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [crop, setCrop] = useState('');
  const params = { search: search || undefined, state: state || undefined, crop: crop || undefined };
  const { data, isLoading, isError } = useListFpos(params, { query: { queryKey: getListFposQueryKey(params) } });
  const fpos = (data?.length ? data : fallbackFpos).filter((fpo) => (!search || `${fpo.name} ${fpo.district}`.toLowerCase().includes(search.toLowerCase())) && (!state || fpo.state === state) && (!crop || fpo.crops.includes(crop)));
  return <div><PageHeader eyebrow="Farmer / discovery" title="Find a collective near you." description="Explore verified farmer producer organisations, understand their work and request membership when it feels right." /><div className="panel mb-6 p-4 sm:p-5"><div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_auto]"><label className="relative block"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input className="field w-full pl-9 text-sm" placeholder="Search FPO name or district" value={search} onChange={(event) => setSearch(event.target.value)} data-testid="input-search-fpos" /></label><SelectField label="State" value={state} options={['', ...states]} onChange={setState} /><SelectField label="Crop" value={crop} options={['', ...cropOptions]} onChange={setCrop} /><button onClick={() => { setSearch(''); setState(''); setCrop(''); }} className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-3 text-sm font-semibold hover:bg-muted" data-testid="button-clear-filters"><ListFilter className="h-4 w-4" /> Clear</button></div></div>{isLoading && !data ? <LoadingPage /> : fpos.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{fpos.map((fpo, index) => <FpoCard fpo={fpo} key={fpo.id} index={index} />)}</div> : <EmptyOrError error={isError} label="No FPOs match these filters" />}</div>;
}

function FpoCard({ fpo, index }: { fpo: Fpo; index?: number }) {
  return <Link href={`/farmer/fpos/${fpo.id}`} className={`panel lift enter enter-delay-${Math.min((index || 0) + 1, 3)} block overflow-hidden p-5`} data-testid={`card-fpo-${fpo.id}`}><div className="flex items-start justify-between gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Sprout className="h-5 w-5" /></span><StatusPill status={fpo.status} /></div><h2 className="mt-6 font-display text-xl font-bold leading-tight">{fpo.name}</h2><p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {fpo.block}, {fpo.district}, {fpo.state}</p><p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">{fpo.description}</p><div className="mt-5 flex items-center justify-between border-t border-border pt-4"><span className="text-xs text-muted-foreground"><strong className="text-foreground">{fpo.memberCount}</strong> members</span><span className="text-xs font-semibold text-accent">View profile <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></span></div></Link>;
}

function FpoProfile() {
  const { id = 'fpo-1' } = useParams<{ id: string }>();
  const { data, isLoading } = useGetFpo(id, { query: { enabled: Boolean(id), queryKey: getGetFpoQueryKey(id) } });
  const fpo = data || fallbackFpos.find((item) => item.id === id) || fallbackFpos[0];
  if (isLoading && !data) return <LoadingPage />;
  return <div className="mx-auto max-w-5xl"><Link href="/farmer/fpos" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground" data-testid="link-back-fpos"><ChevronLeft className="h-4 w-4" /> All FPOs</Link><div className="panel overflow-hidden"><div className="bg-primary p-6 text-primary-foreground sm:p-9"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start"><div className="flex items-start gap-4"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground"><Sprout className="h-7 w-7" /></span><div><StatusPill status={fpo.status} /><h1 className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight">{fpo.name}</h1><p className="mt-2 flex items-center gap-1.5 text-sm text-primary-foreground/70"><MapPin className="h-4 w-4" /> {fpo.block}, {fpo.district}, {fpo.state}</p></div></div><Link href={`/farmer/join/${fpo.id}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-sidebar-primary px-4 py-3 text-sm font-bold text-sidebar-primary-foreground hover:opacity-90" data-testid="link-join-fpo">Request membership <ArrowRight className="h-4 w-4" /></Link></div></div><div className="grid gap-6 p-6 sm:p-9 lg:grid-cols-[1.1fr_.9fr]"><div><p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-accent">About this collective</p><p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">{fpo.description}</p><div className="mt-8 grid gap-4 sm:grid-cols-3"><Metric label="Members" value={String(fpo.memberCount)} /><Metric label="Land represented" value={`${fpo.totalArea} ac`} /><Metric label="Villages" value={String(fpo.villages.length)} /></div><div className="mt-8"><h2 className="font-display text-xl font-bold">What members grow</h2><div className="mt-3 flex flex-wrap gap-2">{fpo.crops.map((crop) => <span className="rounded-full bg-muted px-3 py-2 text-xs font-semibold" key={crop}>{crop}</span>)}</div></div></div><div className="rounded-2xl bg-muted/50 p-5"><p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-muted-foreground">Contact & reach</p><div className="mt-5 space-y-5"><div><p className="text-xs text-muted-foreground">Secretary</p><p className="mt-1 text-sm font-semibold">{fpo.contactName}</p></div><div><p className="text-xs text-muted-foreground">Phone</p><p className="mt-1 font-mono-app text-sm font-medium">{fpo.contactMobile}</p></div><div><p className="text-xs text-muted-foreground">Villages served</p><p className="mt-1 text-sm font-semibold leading-6">{fpo.villages.join(' · ')}</p></div><div><p className="text-xs text-muted-foreground">Registration</p><p className="mt-1 font-mono-app text-sm font-medium">{fpo.registrationNumber}</p></div></div></div></div></div></div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-border bg-card p-4"><p className="font-display text-2xl font-bold text-primary">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>;
}

function JoinFpo() {
  const { id = 'fpo-1' } = useParams<{ id: string }>();
  const fpo = fallbackFpos.find((item) => item.id === id) || fallbackFpos[0];
  const [stage, setStage] = useState<'details' | 'otp' | 'done'>('details');
  const [otp, setOtp] = useState('');
  const [form, setForm] = useState({ name: '', village: '', mobile: '', landholding: '', crops: 'Ragi' });
  const createRequest = useCreateJoinRequest();
  const [requestId, setRequestId] = useState('');
  const queryClient = useQueryClient();
  const submit = () => createRequest.mutate({ data: { fpoId: fpo.id, name: form.name, village: form.village, mobile: form.mobile, landholding: Number(form.landholding), crops: [form.crops] } }, { onSuccess: (request) => { setRequestId(request.requestId); setStage('done'); queryClient.invalidateQueries({ queryKey: getGetJoinRequestQueryKey(request.requestId) }); } });
  return <div className="mx-auto max-w-4xl"><Link href={`/farmer/fpos/${fpo.id}`} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground" data-testid="link-back-profile"><ChevronLeft className="h-4 w-4" /> Back to {fpo.name}</Link><div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr]"><div className="rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8"><p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-primary-foreground/55">Membership request</p><h1 className="mt-5 font-display text-3xl font-bold leading-tight">A stronger harvest starts together.</h1><p className="mt-4 text-sm leading-6 text-primary-foreground/70">Tell {fpo.name} a little about yourself. Your request will go to their secretary for review.</p><div className="mt-10 border-t border-primary-foreground/15 pt-5"><p className="text-xs text-primary-foreground/55">Joining</p><p className="mt-1 text-sm font-semibold">{fpo.name}</p><p className="mt-1 text-xs text-primary-foreground/60">{fpo.district}, {fpo.state}</p></div></div><div className="panel p-6 sm:p-8">{stage === 'details' ? <><p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-accent">Step 01 / your details</p><h2 className="mt-2 font-display text-2xl font-bold">Let the FPO know you.</h2><div className="mt-7 grid gap-4 sm:grid-cols-2"><Field label="Full name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} /><Field label="Village" value={form.village} onChange={(value) => setForm({ ...form, village: value })} /><Field label="Mobile number" value={form.mobile} onChange={(value) => setForm({ ...form, mobile: value })} /><Field label="Landholding (acres)" value={form.landholding} onChange={(value) => setForm({ ...form, landholding: value })} /><SelectField label="Main crop" value={form.crops} options={cropOptions} onChange={(value) => setForm({ ...form, crops: value })} /></div><button onClick={() => setStage('otp')} disabled={!form.name || !form.mobile} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-45" data-testid="button-send-otp">Send verification code <ArrowRight className="h-4 w-4" /></button></> : null}{stage === 'otp' ? <><p className="font-mono-app text-[10px] uppercase tracking-[.18em] text-accent">Step 02 / verify mobile</p><h2 className="mt-2 font-display text-2xl font-bold">A quick check for your safety.</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">We sent a four-digit code to {form.mobile}. For this demo, use <span className="font-mono-app font-semibold text-foreground">1234</span>.</p><label className="mt-7 block"><span className="mb-2 block text-xs font-semibold">Verification code</span><input className="field w-full text-center font-mono-app text-lg tracking-[.5em]" value={otp} onChange={(event) => setOtp(event.target.value)} maxLength={4} inputMode="numeric" placeholder="0000" data-testid="input-otp" /></label><button onClick={submit} disabled={otp !== '1234' || createRequest.isPending} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-45" data-testid="button-verify-submit">{createRequest.isPending ? 'Sending request…' : 'Verify and send request'} <ArrowRight className="h-4 w-4" /></button><button onClick={() => setStage('details')} className="mt-3 w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted" data-testid="button-edit-join-details">Edit details</button>{createRequest.isError ? <p className="mt-3 text-sm text-destructive">We could not send the request. Try again.</p> : null}</> : null}{stage === 'done' ? <JoinConfirmation requestId={requestId} fpo={fpo} /> : null}</div></div></div>;
}

function JoinConfirmation({ requestId, fpo }: { requestId: string; fpo: Fpo }) {
  const { data } = useGetJoinRequest(requestId || 'pending', { query: { enabled: Boolean(requestId), queryKey: getGetJoinRequestQueryKey(requestId || 'pending') } });
  return <div className="py-4 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><Check className="h-7 w-7" /></span><p className="mt-6 font-mono-app text-[10px] uppercase tracking-[.2em] text-accent">Request sent</p><h2 className="mt-2 font-display text-3xl font-bold">You are on the way in.</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">{fpo.name} has your request. The secretary will call you after a quick review.</p><div className="mx-auto mt-7 max-w-sm rounded-xl bg-muted/60 p-4 text-left"><p className="text-xs text-muted-foreground">Request reference</p><p className="mt-1 font-mono-app text-sm font-semibold">{data?.requestId || requestId || 'Pending'}</p><p className="mt-3 text-xs text-muted-foreground">Status</p><p className="mt-1 text-sm font-semibold">{data?.status || 'Pending review'}</p></div><Link href="/farmer/fpos" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline" data-testid="link-back-discovery">Explore more FPOs <ArrowRight className="h-4 w-4" /></Link></div>;
}

function AdminFpos() {
  const [status, setStatus] = useState('');
  const params = { status: status || undefined };
  const { data, isLoading } = useListAdminFpos(params, { query: { queryKey: getListAdminFposQueryKey(params) } });
  const fpos = data?.length ? data : fallbackFpos;
  return <div><PageHeader eyebrow="Review desk / queue" title="Make the next decision clear." description="A focused queue for checking FPO identity, documents and the people behind each submission." action={<div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-semibold"><Filter className="h-4 w-4 text-accent" /><select className="bg-transparent outline-none" value={status} onChange={(event) => setStatus(event.target.value)} data-testid="select-review-status"><option value="">All statuses</option><option value="Pending">Pending</option><option value="Under Review">Under Review</option><option value="Verified">Verified</option><option value="Rejected">Rejected</option></select></div>} /><div className="grid gap-4 sm:grid-cols-3">{[['Needs attention', fpos.filter((f) => f.status === 'Pending').length + 4], ['In review', fpos.filter((f) => f.status === 'Under Review').length + 2], ['Verified this month', 18]].map(([label, value]) => <div className="panel p-5" key={label as string}><p className="text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground">{label as string}</p><p className="mt-4 font-display text-3xl font-bold text-primary">{value as number}</p></div>)}</div><div className="panel mt-6 overflow-hidden">{isLoading && !data ? <LoadingPage /> : <div className="divide-y divide-border">{fpos.filter((fpo) => !status || fpo.status === status).map((fpo) => <Link href={`/admin/fpos/${fpo.id}`} className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/35 sm:flex-row sm:items-center sm:px-6" key={fpo.id} data-testid={`row-review-fpo-${fpo.id}`}><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Building2 className="h-5 w-5" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-bold">{fpo.name}</h2><StatusPill status={fpo.status} /></div><p className="mt-1 text-xs text-muted-foreground">{fpo.registrationNumber} · {fpo.district}, {fpo.state}</p></div><div className="grid grid-cols-2 gap-6 text-left sm:flex sm:items-center"><div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Documents</p><p className="mt-1 text-sm font-semibold">{fpo.documents.length} submitted</p></div><div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Received</p><p className="mt-1 text-sm font-semibold">12 Jun 2024</p></div><ArrowRight className="hidden h-4 w-4 text-muted-foreground sm:block" /></div></Link>)}</div>}</div></div>;
}

function AdminDetail() {
  const { id = 'fpo-1' } = useParams<{ id: string }>();
  const { data, isLoading } = useGetAdminFpo(id, { query: { enabled: Boolean(id), queryKey: getGetAdminFpoQueryKey(id) } });
  const review = data || { fpo: fallbackFpos.find((item) => item.id === id) || fallbackFpos[0], auditLog: [{ id: '1', actor: 'Review desk', action: 'Application received', at: '12 Jun 2024', detail: 'Documents are ready for review.' }] };
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

function Router({ role, setRole }: { role: Role; setRole: (role: Role) => void }) {
  const [location] = useLocation();
  const isPublic = location === '/' || location.startsWith('/login/');
  const publicRoutes = <Switch><Route path="/" component={LandingPage} /><Route path="/login/:role" component={() => <RoleLogin setRole={setRole} />} /><Route component={NotFound} /></Switch>;
  const workspaceRoutes = <AppShell role={role} setRole={setRole}><Switch><Route path="/workspace" component={() => <Home role={role} setRole={setRole} />} /><Route path="/fpo/onboarding" component={FpoOnboarding} /><Route path="/fpo/status" component={FpoStatus} /><Route path="/fpo/members" component={Members} /><Route path="/farmer/fpos" component={FarmerFpos} /><Route path="/farmer/fpos/:id" component={FpoProfile} /><Route path="/farmer/join/:id" component={JoinFpo} /><Route path="/admin/fpos" component={AdminFpos} /><Route path="/admin/fpos/:id" component={AdminDetail} /><Route component={NotFound} /></Switch></AppShell>;
  return <ErrorBoundary resetKey={location}>{isPublic ? publicRoutes : workspaceRoutes}</ErrorBoundary>;
}

function App() {
  const [role, setRole] = useState<Role>('fpo');
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router role={role} setRole={setRole} /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;