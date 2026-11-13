import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { VEHICLE_DEALS } from '../data/mockData';
import { VehicleDeal } from '../types';
import { VehicleImage } from './VehicleImage';

type MileageFilter = 'all' | 'new' | 'under-10k' | 'under-20k';
type SortOption = 'payment-asc' | 'payment-desc' | 'residual-desc' | 'down-asc';

export function LeaseSearchSection() {
  const [maxMonthly, setMaxMonthly] = useState<number>(650);
  const [selectedMake, setSelectedMake] = useState<string>('All');
  const [modelQuery, setModelQuery] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [mileageFilter, setMileageFilter] = useState<MileageFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('payment-asc');

  // Interactive deal drawer state
  const [activeDeal, setActiveDeal] = useState<VehicleDeal | null>(null);
  const [customTerm, setCustomTerm] = useState<24 | 36 | 48>(36);
  const [customDown, setCustomDown] = useState<number>(2500);
  const [annualMiles, setAnnualMiles] = useState<10000 | 12000 | 15000>(12000);
  const [creditBand, setCreditBand] = useState<'prime' | 'near-prime' | 'standard'>('prime');
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [submittedDealId, setSubmittedDealId] = useState<string | null>(null);

  const makes = useMemo(() => {
    const unique = Array.from(new Set(VEHICLE_DEALS.map((v) => v.make)));
    return ['All', ...unique];
  }, []);

  const years = useMemo(() => {
    const unique = Array.from(new Set(VEHICLE_DEALS.map((v) => String(v.year)))).sort(
      (a, b) => Number(b) - Number(a)
    );
    return ['All', ...unique];
  }, []);

  const filteredDeals = useMemo(() => {
    return VEHICLE_DEALS.filter((deal) => {
      if (deal.monthlyPayment > maxMonthly) return false;
      if (selectedMake !== 'All' && deal.make !== selectedMake) return false;
      if (selectedYear !== 'All' && String(deal.year) !== selectedYear) return false;
      if (modelQuery.trim()) {
        const q = modelQuery.toLowerCase();
        const match =
          deal.model.toLowerCase().includes(q) ||
          deal.make.toLowerCase().includes(q) ||
          deal.trim.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (mileageFilter === 'new' && deal.mileage > 500) return false;
      if (mileageFilter === 'under-10k' && deal.mileage >= 10000) return false;
      if (mileageFilter === 'under-20k' && deal.mileage >= 20000) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'payment-asc') return a.monthlyPayment - b.monthlyPayment;
      if (sortBy === 'payment-desc') return b.monthlyPayment - a.monthlyPayment;
      if (sortBy === 'residual-desc') return b.residualPercent - a.residualPercent;
      return a.downPayment - b.downPayment;
    });
  }, [maxMonthly, selectedMake, selectedYear, modelQuery, mileageFilter, sortBy]);

  const resetFilters = () => {
    setMaxMonthly(799);
    setSelectedMake('All');
    setModelQuery('');
    setSelectedYear('All');
    setMileageFilter('all');
    setSortBy('payment-asc');
  };

  const openDealConfigurator = (deal: VehicleDeal) => {
    setActiveDeal(deal);
    setCustomTerm((deal.termMonths === 48 ? 48 : 36) as 24 | 36 | 48);
    setCustomDown(deal.downPayment);
    setAnnualMiles(12000);
    setCreditBand('prime');
    setFormError('');
    setSubmittedDealId(null);
  };

  // Real-time lease calculation inside configurator modal
  const configuredQuote = useMemo(() => {
    if (!activeDeal) return null;
    const termResidualAdjust =
      customTerm === 24 ? 0.06 : customTerm === 48 ? -0.07 : 0;
    const milesResidualAdjust =
      annualMiles === 10000 ? 0.02 : annualMiles === 15000 ? -0.03 : 0;
    const effectiveResidualPct = Math.min(
      72,
      Math.max(44, activeDeal.residualPercent + Math.round((termResidualAdjust + milesResidualAdjust) * 100))
    );
    const residualDollars = Math.round((activeDeal.msrp * effectiveResidualPct) / 100);
    const capCost = Math.max(residualDollars + 1500, activeDeal.msrp - customDown);
    const depreciation = (capCost - residualDollars) / customTerm;
    const creditFactor =
      creditBand === 'prime' ? 1 : creditBand === 'near-prime' ? 1.28 : 1.55;
    const mf = activeDeal.moneyFactor * creditFactor;
    const rentCharge = (capCost + residualDollars) * mf;
    const monthly = Math.max(199, Math.round(depreciation + rentCharge));
    const aprEquivalent = Number((mf * 2400).toFixed(2));

    return {
      monthly,
      residualDollars,
      effectiveResidualPct,
      aprEquivalent,
    };
  }, [activeDeal, customTerm, customDown, annualMiles, creditBand]);

  const handleSubmitPreQual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantEmail.includes('@')) {
      setFormError('Please enter your name and a valid email address.');
      return;
    }
    setFormError('');
    if (activeDeal) {
      setSubmittedDealId(`RD-${Math.floor(1000 + Math.random() * 8999)}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0F2040] tracking-tight">
            Consumer Lease Search
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600">
            Shop by your target monthly payment across new and certified pre-owned vehicles.
          </p>
        </div>
        <div className="text-sm text-slate-600 tabular-nums">
          Showing <span className="font-semibold text-[#0F2040]">{filteredDeals.length}</span> of{' '}
          <span className="font-semibold text-[#0F2040]">{VEHICLE_DEALS.length}</span> sample vehicles
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,32,64,0.04)] p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          {/* Monthly Payment Slider ($199 - $799) */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="monthly-slider"
                className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#0F2040]" />
                <span>Max monthly payment</span>
              </label>
              <span className="font-mono text-base font-bold text-[#0F2040] tabular-nums">
                ${maxMonthly}/mo
              </span>
            </div>
            <input
              id="monthly-slider"
              type="range"
              min={199}
              max={799}
              step={10}
              value={maxMonthly}
              onChange={(e) => setMaxMonthly(Number(e.target.value))}
              className="ridero-slider w-full cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400 tabular-nums">
              <span>$199/mo</span>
              <span>$499/mo</span>
              <span>$799/mo</span>
            </div>
          </div>

          {/* Model Search */}
          <div className="lg:col-span-3">
            <label htmlFor="model-search" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Model or trim
            </label>
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="model-search"
                type="text"
                value={modelQuery}
                onChange={(e) => setModelQuery(e.target.value)}
                placeholder="e.g. Civic, Model 3, AWD..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0F2040] focus:outline-none focus:ring-2 focus:ring-[#0F2040]/15 min-h-[42px]"
              />
            </div>
          </div>

          {/* Make */}
          <div className="lg:col-span-2">
            <label htmlFor="make-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Make
            </label>
            <select
              id="make-select"
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-[#0F2040] focus:outline-none focus:ring-2 focus:ring-[#0F2040]/15 min-h-[42px]"
            >
              {makes.map((make) => (
                <option key={make} value={make}>
                  {make === 'All' ? 'All Makes' : make}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="lg:col-span-1">
            <label htmlFor="year-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Year
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-2.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-[#0F2040] focus:outline-none focus:ring-2 focus:ring-[#0F2040]/15 min-h-[42px]"
            >
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  {yr === 'All' ? 'All' : yr}
                </option>
              ))}
            </select>
          </div>

          {/* Mileage */}
          <div className="lg:col-span-2">
            <label htmlFor="mileage-select" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mileage
            </label>
            <select
              id="mileage-select"
              value={mileageFilter}
              onChange={(e) => setMileageFilter(e.target.value as MileageFilter)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-[#0F2040] focus:outline-none focus:ring-2 focus:ring-[#0F2040]/15 min-h-[42px]"
            >
              <option value="all">Any Mileage</option>
              <option value="new">New (&le; 500 mi)</option>
              <option value="under-10k">Under 10,000 mi</option>
              <option value="under-20k">Under 20,000 mi</option>
            </select>
          </div>
        </div>

        {/* Bottom Filter Controls: Sort & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500 mr-1">Sort by:</span>
            {(
              [
                { id: 'payment-asc', label: 'Lowest Monthly' },
                { id: 'residual-desc', label: 'Highest Residual' },
                { id: 'down-asc', label: 'Lowest Down' },
                { id: 'payment-desc', label: 'Highest Monthly' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSortBy(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  sortBy === opt.id
                    ? 'bg-[#0F2040] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0F2040] transition-colors whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset filters</span>
          </button>
        </div>
      </div>

      {/* Results Grid or Empty State */}
      {filteredDeals.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200/80 p-12 text-center shadow-[0_4px_20px_rgba(15,32,64,0.04)]">
          <h3 className="font-display text-lg font-bold text-[#0F2040]">
            No vehicles match your current filters
          </h3>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            Try raising your monthly payment cap above ${maxMonthly}/mo or clearing the make and mileage filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0F2040] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#183160] transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset all filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <article
              key={deal.id}
              className="flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 shadow-[0_6px_24px_rgba(15,32,64,0.05)] overflow-hidden hover:border-slate-300 transition-all duration-150"
            >
              <div>
                <div className="aspect-4/3 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                  <VehicleImage
                    src={deal.imageUrl}
                    alt={`${deal.year} ${deal.make} ${deal.model} ${deal.trim}`}
                    fallbackLabel={`${deal.year} ${deal.make} ${deal.model}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                  />
                </div>

                <div className="p-6">
                  {/* Unboxed clean metadata row */}
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span>{deal.year}</span>
                    <span aria-hidden="true">·</span>
                    <span>{deal.condition}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {deal.mileage.toLocaleString()} mi
                    </span>
                  </div>

                  {/* Title & Monthly Payment */}
                  <div className="mt-2 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-bold text-[#0F2040] leading-tight">
                        {deal.make} {deal.model}
                      </h2>
                      <p className="mt-0.5 text-xs text-slate-500">{deal.trim}</p>
                    </div>
                    <div className="text-right shrink-0 tabular-nums">
                      <div className="font-display text-2xl font-bold text-[#0F2040]">
                        ${deal.monthlyPayment}
                        <span className="text-xs font-medium text-slate-500">/mo</span>
                      </div>
                    </div>
                  </div>

                  {/* Deal Spec Grid */}
                  <dl className="mt-5 grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
                    <div>
                      <dt className="text-slate-500">Down payment</dt>
                      <dd className="mt-0.5 font-mono font-semibold text-slate-900 tabular-nums">
                        ${deal.downPayment.toLocaleString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Term</dt>
                      <dd className="mt-0.5 font-mono font-semibold text-slate-900 tabular-nums">
                        {deal.termMonths} mo
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Residual</dt>
                      <dd className="mt-0.5 font-mono font-semibold text-[#10B981] tabular-nums">
                        {deal.residualPercent}% (${deal.residualValue.toLocaleString()})
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="px-6 pb-6 pt-1">
                <button
                  type="button"
                  onClick={() => openDealConfigurator(deal)}
                  className="w-full rounded-xl bg-[#0F2040] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#183160] transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2040] focus-visible:ring-offset-2"
                >
                  Get this deal
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Interactive Deal Structuring Modal / Drawer */}
      {activeDeal && configuredQuote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="deal-modal-title"
        >
          <div className="relative h-full w-full max-w-lg bg-white shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Drawer Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between bg-white/95 backdrop-blur-xs px-6 py-5 border-b border-slate-200">
                <div>
                  <div className="text-xs font-medium text-slate-500">
                    AI Deal Configurator · Concept Demo
                  </div>
                  <h2
                    id="deal-modal-title"
                    className="font-display text-lg font-bold text-[#0F2040]"
                  >
                    {activeDeal.year} {activeDeal.make} {activeDeal.model}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveDeal(null)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close deal configurator"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Vehicle summary */}
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4">
                  <VehicleImage
                    src={activeDeal.imageUrl}
                    alt={`${activeDeal.make} ${activeDeal.model}`}
                    className="h-20 w-28 rounded-xl object-cover shrink-0 bg-slate-100"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#0F2040] truncate">
                      {activeDeal.trim}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 tabular-nums">
                      MSRP ${activeDeal.msrp.toLocaleString()} · {activeDeal.mileage.toLocaleString()} mi
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Matched Partner: <span className="font-medium text-slate-800">{activeDeal.lenderName}</span>
                    </div>
                  </div>
                </div>

                {/* Live Quote Display */}
                <div className="rounded-2xl bg-[#0F2040] text-white p-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-300">Estimated Monthly Payment</div>
                    <div className="mt-1 font-display text-3xl font-bold tabular-nums">
                      ${configuredQuote.monthly}
                      <span className="text-sm font-normal text-slate-300">/mo</span>
                    </div>
                  </div>
                  <div className="text-right tabular-nums space-y-1">
                    <div className="text-xs text-slate-300">
                      Residual ({configuredQuote.effectiveResidualPct}%)
                    </div>
                    <div className="font-mono text-sm font-semibold text-[#10B981]">
                      ${configuredQuote.residualDollars.toLocaleString()} buyout
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {configuredQuote.aprEquivalent}% est. APR equiv.
                    </div>
                  </div>
                </div>

                {/* Customization Controls */}
                <div className="space-y-4">
                  <div>
                    <span className="block text-xs font-semibold text-slate-700 mb-2">
                      Lease / Balloon Term
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {([24, 36, 48] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setCustomTerm(t)}
                          className={`py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                            customTerm === t
                              ? 'bg-[#0F2040] text-white border-[#0F2040]'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {t} months
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                      <span>Down Payment</span>
                      <span className="font-mono text-[#0F2040] tabular-nums">
                        ${customDown.toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={7500}
                      step={250}
                      value={customDown}
                      onChange={(e) => setCustomDown(Number(e.target.value))}
                      className="ridero-slider w-full"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-slate-700 mb-2">
                      Annual Mileage Allowance
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {([10000, 12000, 15000] as const).map((mi) => (
                        <button
                          key={mi}
                          type="button"
                          onClick={() => setAnnualMiles(mi)}
                          className={`py-2.5 rounded-xl text-xs font-semibold border transition-colors tabular-nums ${
                            annualMiles === mi
                              ? 'bg-[#0F2040] text-white border-[#0F2040]'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {(mi / 1000).toFixed(0)}k mi/yr
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-slate-700 mb-2">
                      Estimated Credit Tier
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { id: 'prime', label: 'Prime 740+' },
                          { id: 'near-prime', label: '680–739' },
                          { id: 'standard', label: '620–679' },
                        ] as const
                      ).map((tier) => (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setCreditBand(tier.id)}
                          className={`py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                            creditBand === tier.id
                              ? 'bg-[#0F2040] text-white border-[#0F2040]'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {tier.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pre-qualification Form / Confirmation */}
                {submittedDealId ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                      <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
                      <span>Instant Demo Pre-Qualification Approved</span>
                    </div>
                    <p className="text-xs text-emerald-900/80 leading-relaxed">
                      Reference <span className="font-mono font-semibold">{submittedDealId}</span> prepared for {applicantName} at ${configuredQuote.monthly}/mo ({customTerm} mo · {activeDeal.lenderName}). No real credit pull was executed.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitPreQual} className="space-y-3 pt-4 border-t border-slate-200">
                    <div className="text-xs font-semibold text-[#0F2040]">
                      Lock this sample structure (Demo Pre-Qualification)
                    </div>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="Full name (sample)"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#0F2040] focus:outline-none focus:ring-2 focus:ring-[#0F2040]/15"
                    />
                    <input
                      type="email"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#0F2040] focus:outline-none focus:ring-2 focus:ring-[#0F2040]/15"
                    />
                    {formError && (
                      <p className="text-xs font-medium text-red-600">{formError}</p>
                    )}
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-[#10B981] px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors min-h-[44px]"
                    >
                      Run Instant AI Pre-Qualification
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
