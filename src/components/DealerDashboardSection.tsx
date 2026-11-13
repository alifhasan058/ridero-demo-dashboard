import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Download,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import {
  INITIAL_DEALER_DEALS,
  LENDER_APPROVAL_SHARES,
  MONTHLY_DEALS_DATA,
} from '../data/mockData';
import { DealerPipelineDeal, DealerRegion, DealStatus } from '../types';

export function DealerDashboardSection() {
  const [deals, setDeals] = useState<DealerPipelineDeal[]>(INITIAL_DEALER_DEALS);
  const [regionFilter, setRegionFilter] = useState<DealerRegion>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | DealStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const [activeLender, setActiveLender] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<DealerPipelineDeal | null>(null);

  const approvedDelta = useMemo(() => {
    const initialApproved = INITIAL_DEALER_DEALS.filter((d) => d.status === 'Approved').length;
    const currentApproved = deals.filter((d) => d.status === 'Approved').length;
    return currentApproved - initialApproved;
  }, [deals]);

  // Exact KPI metrics specified by prompt for "All", plus coherent regional slices
  const kpis = useMemo(() => {
    if (regionFilter === 'Northeast') {
      return {
        activeDeals: 74,
        approvalRate: Math.min(99, 88 + approvedDelta * 2),
        avgMonthly: 426,
        lenderPartners: 11,
      };
    }
    if (regionFilter === 'Southern US') {
      return {
        activeDeals: 54,
        approvalRate: Math.min(99, 83 + approvedDelta * 2),
        avgMonthly: 393,
        lenderPartners: 10,
      };
    }
    return {
      activeDeals: 128,
      approvalRate: Math.min(99, 86 + approvedDelta),
      avgMonthly: 412,
      lenderPartners: 14,
    };
  }, [regionFilter, approvedDelta]);

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      if (regionFilter !== 'All' && deal.region !== regionFilter) return false;
      if (statusFilter !== 'All' && deal.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          deal.vehicle.toLowerCase().includes(q) ||
          deal.lender.toLowerCase().includes(q) ||
          deal.dealerName.toLowerCase().includes(q) ||
          deal.id.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [deals, regionFilter, statusFilter, searchQuery]);

  // Chart calculations
  const monthlySeries = useMemo(() => {
    return MONTHLY_DEALS_DATA.map((item) => {
      const value =
        regionFilter === 'Northeast'
          ? item.northeast
          : regionFilter === 'Southern US'
          ? item.southern
          : item.northeast + item.southern;
      return {
        ...item,
        value,
      };
    });
  }, [regionFilter]);

  const maxMonthlyVal = useMemo(
    () => Math.max(...monthlySeries.map((m) => m.value), 1),
    [monthlySeries]
  );

  // Donut calculations
  const donutData = useMemo(() => {
    const total = LENDER_APPROVAL_SHARES.reduce((acc, s) => acc + s.approvals, 0);
    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    let cumulative = 0;

    const segments = LENDER_APPROVAL_SHARES.map((item) => {
      const fraction = item.approvals / total;
      const strokeLength = fraction * circumference;
      const offset = -cumulative * circumference;
      cumulative += fraction;
      return {
        ...item,
        percentage: Math.round(fraction * 100),
        strokeLength,
        offset,
        circumference,
      };
    });

    return { total, radius, circumference, segments };
  }, []);

  const focusedLenderObj = useMemo(
    () => donutData.segments.find((s) => s.lender === activeLender) || null,
    [donutData, activeLender]
  );

  const handleApprovePending = (dealId: string) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? {
              ...d,
              status: 'Approved',
              aiConfidence: 'Approved via Dealer Desk demo',
              updatedAt: 'Just now',
            }
          : d
      )
    );
    setSelectedDeal((prev) =>
      prev && prev.id === dealId
        ? {
            ...prev,
            status: 'Approved',
            aiConfidence: 'Approved via Dealer Desk demo',
            updatedAt: 'Just now',
          }
        : prev
    );
  };

  const handleExportCsv = () => {
    const headers = [
      'Deal ID',
      'Vehicle',
      'Region',
      'Dealer',
      'Lender',
      'Term (Months)',
      'Residual %',
      'Residual Value',
      'Monthly Payment',
      'Status',
    ];
    const rows = filteredDeals.map((d) => [
      d.id,
      `"${d.vehicle}"`,
      d.region,
      `"${d.dealerName}"`,
      `"${d.lender}"`,
      d.termMonths,
      `${d.residualPercent}%`,
      d.residualAmount,
      d.monthlyPayment,
      d.status,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ridero-dealer-deals-${regionFilter.toLowerCase().replace(/\s+/g, '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Location Filter */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0F2040] tracking-tight">
            Dealer Dashboard
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600">
            Real-time lease structuring pipeline, regional approval metrics, and lender distribution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Dealer Location Segmented Control */}
          <div
            className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/70"
            role="group"
            aria-label="Filter by dealer location"
          >
            <span className="pl-2.5 pr-1 text-xs font-medium text-slate-500 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Location:</span>
            </span>
            {(['All', 'Northeast', 'Southern US'] as DealerRegion[]).map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setRegionFilter(region)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  regionFilter === region
                    ? 'bg-white text-[#0F2040] shadow-xs'
                    : 'text-slate-600 hover:text-[#0F2040]'
                }`}
              >
                {region === 'All' ? 'All Locations' : region}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0F2040] hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 min-h-[38px]"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,32,64,0.04)] p-6">
          <div className="text-xs font-medium text-slate-500">Active deals</div>
          <div className="mt-2 font-display text-3xl font-bold text-[#0F2040] tabular-nums">
            {kpis.activeDeals}
          </div>
          <div className="mt-2 text-xs text-slate-600">
            <span className="font-semibold text-[#10B981] tabular-nums">+12.4%</span> vs. prior 30 days
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,32,64,0.04)] p-6">
          <div className="text-xs font-medium text-slate-500">Approval rate</div>
          <div className="mt-2 font-display text-3xl font-bold text-[#0F2040] tabular-nums">
            {kpis.approvalRate}%
          </div>
          <div className="mt-2 text-xs text-slate-600">
            AI waterfall first-pass match
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,32,64,0.04)] p-6">
          <div className="text-xs font-medium text-slate-500">Avg monthly payment</div>
          <div className="mt-2 font-display text-3xl font-bold text-[#0F2040] tabular-nums">
            ${kpis.avgMonthly}
          </div>
          <div className="mt-2 text-xs text-slate-600">
            36-month median balloon term
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,32,64,0.04)] p-6">
          <div className="text-xs font-medium text-slate-500">Lender partners</div>
          <div className="mt-2 font-display text-3xl font-bold text-[#0F2040] tabular-nums">
            {kpis.lenderPartners}
          </div>
          <div className="mt-2 text-xs text-slate-600">
            Active automated underwriting lines
          </div>
        </div>
      </div>

      {/* Charts Row: Bar Chart + Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Deals by Month Bar Chart */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,32,64,0.04)] p-6 flex flex-col justify-between">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-[#0F2040]">
                Deals by month
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Structured lease volume ({regionFilter === 'All' ? 'All US regions' : regionFilter})
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              {regionFilter !== 'Southern US' && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-[#0F2040]" aria-hidden="true" />
                  <span>Northeast</span>
                </span>
              )}
              {regionFilter !== 'Northeast' && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-xs bg-[#10B981]" aria-hidden="true" />
                  <span>Southern US</span>
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4">
            <div className="h-56 flex items-end gap-3 sm:gap-5 border-b border-slate-200 pb-3 relative">
              {monthlySeries.map((item) => {
                const totalHeightPct = Math.round((item.value / maxMonthlyVal) * 100);
                const neHeightPct =
                  regionFilter === 'Southern US'
                    ? 0
                    : Math.round((item.northeast / item.value) * 100);
                const isHovered = hoveredMonth === item.month;

                return (
                  <div
                    key={item.month}
                    onMouseEnter={() => setHoveredMonth(item.month)}
                    onMouseLeave={() => setHoveredMonth(null)}
                    className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer"
                  >
                    {/* Hover value label */}
                    <div
                      className={`mb-1.5 font-mono text-xs font-semibold tabular-nums transition-opacity ${
                        isHovered ? 'opacity-100 text-[#0F2040]' : 'opacity-70 text-slate-500'
                      }`}
                    >
                      {item.value}
                    </div>

                    {/* Bar */}
                    <div
                      style={{ height: `${Math.max(12, totalHeightPct * 0.78)}%` }}
                      className={`w-full max-w-[44px] rounded-t-lg overflow-hidden flex flex-col justify-end transition-transform duration-150 ${
                        isHovered ? 'scale-[1.03]' : ''
                      }`}
                    >
                      {regionFilter === 'All' ? (
                        <>
                          <div
                            style={{ height: `${100 - neHeightPct}%` }}
                            className="w-full bg-[#10B981]"
                            title={`Southern US: ${item.southern} deals`}
                          />
                          <div
                            style={{ height: `${neHeightPct}%` }}
                            className="w-full bg-[#0F2040]"
                            title={`Northeast: ${item.northeast} deals`}
                          />
                        </>
                      ) : (
                        <div
                          className={`w-full h-full ${
                            regionFilter === 'Northeast' ? 'bg-[#0F2040]' : 'bg-[#10B981]'
                          }`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-2.5 px-1">
              {monthlySeries.map((item) => (
                <div
                  key={item.month}
                  className="flex-1 text-center text-xs font-medium text-slate-500"
                >
                  {item.month}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Approvals by Lender Donut Chart */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,32,64,0.04)] p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-[#0F2040]">
              Approvals by lender
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hover or select a partner to inspect origination share
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative h-44 w-44 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 150 150" className="h-full w-full -rotate-90">
                {donutData.segments.map((seg) => {
                  const isFocused = !activeLender || activeLender === seg.lender;
                  return (
                    <circle
                      key={seg.lender}
                      cx="75"
                      cy="75"
                      r={donutData.radius}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth={activeLender === seg.lender ? 20 : 16}
                      strokeDasharray={`${seg.strokeLength} ${seg.circumference}`}
                      strokeDashoffset={seg.offset}
                      opacity={isFocused ? 1 : 0.3}
                      className="transition-all duration-150 cursor-pointer"
                      onMouseEnter={() => setActiveLender(seg.lender)}
                      onMouseLeave={() => setActiveLender(null)}
                      onClick={() =>
                        setActiveLender((prev) => (prev === seg.lender ? null : seg.lender))
                      }
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                <div className="font-display text-2xl font-bold text-[#0F2040] tabular-nums">
                  {focusedLenderObj ? `${focusedLenderObj.percentage}%` : donutData.total}
                </div>
                <div className="text-[11px] font-medium text-slate-500 truncate max-w-[92px]">
                  {focusedLenderObj ? focusedLenderObj.lender : 'Total approvals'}
                </div>
              </div>
            </div>

            <div className="w-full space-y-2.5">
              {donutData.segments.map((seg) => (
                <button
                  key={seg.lender}
                  type="button"
                  onMouseEnter={() => setActiveLender(seg.lender)}
                  onMouseLeave={() => setActiveLender(null)}
                  onClick={() =>
                    setActiveLender((prev) => (prev === seg.lender ? null : seg.lender))
                  }
                  className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    activeLender === seg.lender ? 'bg-slate-100' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span
                      className="h-2.5 w-2.5 rounded-xs shrink-0"
                      style={{ backgroundColor: seg.color }}
                      aria-hidden="true"
                    />
                    <span>{seg.lender}</span>
                  </span>
                  <span className="font-mono font-semibold text-[#0F2040] tabular-nums">
                    {seg.approvals} ({seg.percentage}%)
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Built Lease Deals Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,32,64,0.04)] overflow-hidden">
        <div className="p-6 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-[#0F2040]">
              Pre-built vehicle lease deals
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any deal row to inspect AI underwriting notes or update pending status
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vehicle, dealer, lender..."
                aria-label="Search dealer deals"
                className="w-56 rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0F2040] focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100">
              {(['All', 'Approved', 'Pending'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    statusFilter === status
                      ? 'bg-white text-[#0F2040] shadow-xs'
                      : 'text-slate-600 hover:text-[#0F2040]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500">
                <th className="py-3 px-6">Deal ID</th>
                <th className="py-3 px-4">Vehicle &amp; Dealer</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Lender</th>
                <th className="py-3 px-4 text-right">Residual</th>
                <th className="py-3 px-4 text-right">Monthly</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredDeals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-sm text-slate-500">
                    No deals match the current location or status filter.
                  </td>
                </tr>
              ) : (
                filteredDeals.map((deal) => (
                  <tr
                    key={deal.id}
                    onClick={() => setSelectedDeal(deal)}
                    className="hover:bg-slate-50/90 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-6 font-mono text-xs font-semibold text-[#0F2040] whitespace-nowrap">
                      {deal.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{deal.vehicle}</div>
                      <div className="text-xs text-slate-500">{deal.dealerName}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                      {deal.region}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-700 whitespace-nowrap">
                      {deal.lender}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-700 tabular-nums whitespace-nowrap">
                      {deal.residualPercent}% · ${deal.residualAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-sm font-bold text-[#0F2040] tabular-nums whitespace-nowrap">
                      ${deal.monthlyPayment}/mo
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {deal.status === 'Approved' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10B981]">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          <span>Approved</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                          <Clock className="h-4 w-4 shrink-0" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDeal(deal);
                        }}
                        className="text-xs font-semibold text-[#0F2040] hover:text-[#10B981] transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deal Inspection Slide-Over Drawer */}
      {selectedDeal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dealer-deal-title"
        >
          <div className="h-full w-full max-w-md bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="font-mono text-xs font-semibold text-slate-500">
                    {selectedDeal.id} · VIN ends {selectedDeal.vinLast6}
                  </div>
                  <h3
                    id="dealer-deal-title"
                    className="mt-1 font-display text-xl font-bold text-[#0F2040]"
                  >
                    {selectedDeal.vehicle}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDeal(null)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close deal details"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Status</span>
                  {selectedDeal.status === 'Approved' ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#10B981]">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Approved</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-amber-600">
                      <Clock className="h-4 w-4" />
                      <span>Pending</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Monthly Payment</span>
                  <span className="font-mono font-bold text-[#0F2040] tabular-nums">
                    ${selectedDeal.monthlyPayment}/mo ({selectedDeal.termMonths} mo)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Guaranteed Residual</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {selectedDeal.residualPercent}% (${selectedDeal.residualAmount.toLocaleString()})
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Matched Lender</span>
                  <span className="font-semibold text-slate-900">{selectedDeal.lender}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Dealer Location</span>
                  <span className="text-slate-800">
                    {selectedDeal.dealerName} ({selectedDeal.region})
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Credit Band</span>
                  <span className="font-medium text-slate-800">{selectedDeal.creditTier}</span>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#0F2040]">
                  AI Underwriting Summary
                </div>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                  {selectedDeal.aiConfidence}. Last synced {selectedDeal.updatedAt}. Residual curve calibrated for {selectedDeal.region} market resale demand.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 space-y-3">
              {selectedDeal.status === 'Pending' && (
                <button
                  type="button"
                  onClick={() => handleApprovePending(selectedDeal.id)}
                  className="w-full rounded-xl bg-[#10B981] px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors min-h-[44px]"
                >
                  Simulate Lender Approval (Demo)
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedDeal(null)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F2040] hover:bg-slate-50 transition-colors min-h-[44px]"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
