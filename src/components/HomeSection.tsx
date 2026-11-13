import { ArrowRight, BarChart3, CarFront, Landmark, ShieldCheck } from 'lucide-react';
import { HERO_IMAGE } from '../data/mockData';
import { NavSectionId } from '../types';
import { VehicleImage } from './VehicleImage';

interface HomeSectionProps {
  onNavigate: (section: NavSectionId) => void;
}

const PROOF_METRICS = [
  {
    value: '14',
    label: 'Integrated lender partners',
    detail: 'Automated buy-box routing',
  },
  {
    value: '86%',
    label: 'Average dealer approval rate',
    detail: 'Across prime & near-prime tiers',
  },
  {
    value: '< 3 min',
    label: 'AI underwriting decision',
    detail: 'Residual + credit waterfall',
  },
  {
    value: '$199/mo',
    label: 'Flexible lease entry',
    detail: 'New & pre-owned inventory',
  },
];

const PLATFORM_TRACKS: {
  id: NavSectionId;
  title: string;
  audience: string;
  summary: string;
  cta: string;
  icon: typeof CarFront;
}[] = [
  {
    id: 'lease-search',
    title: 'Consumer Lease Search',
    audience: 'For Drivers',
    summary:
      'Filter verified new and pre-owned vehicles strictly by monthly payment ($199–$799), mileage, and residual-backed balloon options.',
    cta: 'Browse 6 sample vehicles',
    icon: CarFront,
  },
  {
    id: 'dealer-dashboard',
    title: 'Dealer Desk & Analytics',
    audience: 'For Dealerships',
    summary:
      'Track 128 active lease structures, compare Northeast vs. Southern US performance, and inspect instant lender approvals.',
    cta: 'Open dealer dashboard',
    icon: BarChart3,
  },
  {
    id: 'lender-portal',
    title: 'Lender Risk & Originations',
    audience: 'For Capital Partners',
    summary:
      'Monitor credit score bands, stress-test residual curves, review funded originations, and manage automated API connectivity.',
    cta: 'Explore lender portal',
    icon: Landmark,
  },
];

export function HomeSection({ onNavigate }: HomeSectionProps) {
  return (
    <div className="space-y-12">
      {/* Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgba(15,32,64,0.06)] p-7 sm:p-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>AI Auto Finance Platform</span>
              <span aria-hidden="true">·</span>
              <span>New &amp; Used Lease + Balloon</span>
            </div>

            <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#0F2040] leading-[1.08] text-balance">
              Leasing, finally affordable
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Ridero brings AI-powered lease and balloon financing to both new and pre-owned cars. Dynamic residual modeling lowers monthly payments while matching borrowers and dealers with 14 institutional lenders in minutes.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => onNavigate('lease-search')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2040] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#183160] transition-colors whitespace-nowrap shrink-0 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2040] focus-visible:ring-offset-2"
              >
                <span>Search by monthly payment</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('dealer-dashboard')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-[#0F2040] hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2040] focus-visible:ring-offset-2"
              >
                <span>For Dealers</span>
              </button>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-[#10B981] shrink-0" />
              <span>
                Soft credit pre-qualification with transparent residual buyout values
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex">
          <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200/80 shadow-[0_8px_30px_rgba(15,32,64,0.06)] bg-slate-100 min-h-[280px]">
            <VehicleImage
              src={HERO_IMAGE}
              alt="Electric crossover parked in minimalist white architectural pavilion"
              fallbackLabel="Ridero AI Lease Showcase"
              className="w-full h-full lg:h-full object-cover aspect-16/9 lg:aspect-auto"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0F2040]/90 via-[#0F2040]/45 to-transparent p-6 sm:p-7 text-white">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-xs font-medium text-slate-200">
                    Featured AI Balloon Structure · 36 Months
                  </div>
                  <div className="mt-1 font-display text-lg sm:text-xl font-semibold">
                    Lower payments on EVs, hybrids &amp; sedans
                  </div>
                </div>
                <div className="text-right tabular-nums">
                  <div className="text-xs text-slate-200">Starting from</div>
                  <div className="font-mono text-xl font-semibold text-[#10B981]">
                    $199/mo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width 4-Column Proof Strip */}
      <section
        aria-label="Platform highlights"
        className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,32,64,0.04)] overflow-hidden"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
          {PROOF_METRICS.map((item) => (
            <div key={item.label} className="p-6">
              <div className="font-display text-3xl font-bold text-[#0F2040] tabular-nums">
                {item.value}
              </div>
              <div className="mt-1.5 text-sm font-semibold text-slate-900">
                {item.label}
              </div>
              <div className="mt-0.5 text-xs text-slate-500">{item.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Three Core Workspaces */}
      <section aria-labelledby="workspaces-heading" className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="workspaces-heading"
              className="font-display text-2xl font-bold text-[#0F2040] tracking-tight"
            >
              One platform across drivers, dealers, and lenders
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Explore each interactive module in this Ridero concept demo.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('how-it-works')}
            className="text-sm font-semibold text-[#0F2040] hover:text-slate-600 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>See 3-step underwriting flow</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLATFORM_TRACKS.map((track) => {
            const Icon = track.icon;
            return (
              <div
                key={track.id}
                className="flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,32,64,0.04)] p-6 hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-slate-500">
                      {track.audience}
                    </span>
                    <Icon className="h-5 w-5 text-[#0F2040]" strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold text-[#0F2040]">
                    {track.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {track.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onNavigate(track.id)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F2040] hover:text-[#10B981] transition-colors whitespace-nowrap"
                  >
                    <span>{track.cta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
