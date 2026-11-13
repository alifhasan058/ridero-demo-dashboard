import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import {
  CREDIT_SCORE_BANDS,
  INITIAL_LAUNCH_CHECKLIST,
  INITIAL_LENDER_CONNECTIONS,
  ORIGINATIONS_DATA,
} from '../data/mockData';
import { ChecklistItem, LenderConnection, OriginationRecord } from '../types';

type StressScenario = 'baseline' | 'downturn' | 'residual-stress';

export function LenderPortalSection() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_LAUNCH_CHECKLIST);
  const [stressScenario, setStressScenario] = useState<StressScenario>('baseline');
  const [originationFilter, setOriginationFilter] = useState<
    'All' | OriginationRecord['status']
  >('All');
  const [connections, setConnections] = useState<LenderConnection[]>(
    INITIAL_LENDER_CONNECTIONS
  );
  const [isTestingSync, setIsTestingSync] = useState(false);

  const completedCount = useMemo(
    () => checklist.filter((item) => item.completed).length,
    [checklist]
  );

  const readinessPercent = Math.round((completedCount / checklist.length) * 100);

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const scenarioMultiplier =
    stressScenario === 'baseline'
      ? 1
      : stressScenario === 'downturn'
      ? 1.45
      : 1.28;

  const scenarioSummary = useMemo(() => {
    const weightedDefault = CREDIT_SCORE_BANDS.reduce(
      (acc, band) =>
        acc + (band.portfolioShare / 100) * band.baseDefaultRisk * scenarioMultiplier,
      0
    );
    return {
      expectedDefault: weightedDefault.toFixed(2),
      reserveCoverage: (weightedDefault * 2.4).toFixed(2),
      portfolioYield:
        stressScenario === 'baseline'
          ? '7.40%'
          : stressScenario === 'downturn'
          ? '6.65%'
          : '6.95%',
    };
  }, [stressScenario, scenarioMultiplier]);

  const filteredOriginations = useMemo(() => {
    if (originationFilter === 'All') return ORIGINATIONS_DATA;
    return ORIGINATIONS_DATA.filter((o) => o.status === originationFilter);
  }, [originationFilter]);

  const runConnectivityCheck = () => {
    setIsTestingSync(true);
    setTimeout(() => {
      setConnections((prev) =>
        prev.map((c) => ({
          ...c,
          lastSync: 'Verified just now',
          avgLatencySec: Number(
            Math.max(1.1, c.avgLatencySec + (Math.random() * 0.2 - 0.1)).toFixed(1)
          ),
        }))
      );
      setIsTestingSync(false);
    }, 550);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0F2040] tracking-tight">
            Lender Portal
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600">
            Program launch governance, credit-band risk analytics, originations ledger, and API connectivity.
          </p>
        </div>

        <div className="text-xs font-medium text-slate-500 tabular-nums">
          Launch readiness: <span className="font-semibold text-[#0F2040]">{readinessPercent}%</span> ({completedCount}/{checklist.length} milestones)
        </div>
      </div>

      {/* Top Grid: Launch Checklist + Risk Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Program Launch Checklist */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,32,64,0.04)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold text-[#0F2040]">
                Program launch checklist
              </h2>
              <span className="font-mono text-xs font-semibold text-[#10B981] tabular-nums">
                {completedCount}/{checklist.length} ready
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Toggle milestones to simulate institutional program sign-off
            </p>

            {/* Progress bar */}
            <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                style={{ width: `${readinessPercent}%` }}
                className="h-full bg-[#10B981] transition-all duration-300"
              />
            </div>

            <div className="mt-5 divide-y divide-slate-100">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleChecklistItem(item.id)}
                  className="w-full py-3 flex items-start gap-3 text-left hover:bg-slate-50/80 rounded-lg px-2 -mx-2 transition-colors"
                >
                  {item.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-[#10B981] shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-sm font-semibold ${
                        item.completed ? 'text-slate-900' : 'text-[#0F2040]'
                      }`}
                    >
                      {item.title}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                      {item.detail}
                    </div>
                    <div className="mt-1 text-[11px] font-medium text-slate-400">
                      {item.owner} · {item.category}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Analytics: Credit Score Bands & Default Risk */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,32,64,0.04)] p-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-[#0F2040]">
                Risk analytics &amp; credit score bands
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Projected 36-month default probability under macro stress scenarios
              </p>
            </div>

            <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100">
              {(
                [
                  { id: 'baseline', label: 'Baseline' },
                  { id: 'downturn', label: 'Mild Downturn' },
                  { id: 'residual-stress', label: 'Residual -5%' },
                ] as const
              ).map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => setStressScenario(scenario.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    stressScenario === scenario.id
                      ? 'bg-white text-[#0F2040] shadow-xs'
                      : 'text-slate-600 hover:text-[#0F2040]'
                  }`}
                >
                  {scenario.label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Strip */}
          <div className="grid grid-cols-3 gap-4 rounded-xl bg-slate-50 border border-slate-200/70 p-4">
            <div>
              <div className="text-xs text-slate-500">Weighted Default Risk</div>
              <div className="mt-1 font-mono text-xl font-bold text-[#0F2040] tabular-nums">
                {scenarioSummary.expectedDefault}%
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Reserve Coverage</div>
              <div className="mt-1 font-mono text-xl font-bold text-[#10B981] tabular-nums">
                {scenarioSummary.reserveCoverage}%
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Net Portfolio Yield</div>
              <div className="mt-1 font-mono text-xl font-bold text-[#0F2040] tabular-nums">
                {scenarioSummary.portfolioYield}
              </div>
            </div>
          </div>

          {/* Credit Band Bars */}
          <div className="space-y-4">
            {CREDIT_SCORE_BANDS.map((band) => {
              const adjRisk = Number((band.baseDefaultRisk * scenarioMultiplier).toFixed(2));
              const isHighRisk = adjRisk >= 4.0;
              return (
                <div key={band.band} className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#0F2040] tabular-nums">
                        {band.band}
                      </span>
                      <span className="font-semibold text-slate-700">{band.label}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 tabular-nums">
                        {band.portfolioShare}% of book
                      </span>
                    </div>
                    <div className="flex items-center gap-4 tabular-nums">
                      <span className="text-slate-600">
                        Approval:{' '}
                        <strong className="text-[#0F2040]">{band.approvalRate}%</strong>
                      </span>
                      <span
                        className={`font-mono font-semibold inline-flex items-center gap-1 ${
                          isHighRisk ? 'text-amber-600' : 'text-[#10B981]'
                        }`}
                      >
                        {isHighRisk && <ShieldAlert className="h-3.5 w-3.5" />}
                        <span>{adjRisk}% default risk</span>
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden flex">
                    <div
                      style={{ width: `${band.portfolioShare}%` }}
                      className="h-full bg-[#0F2040] rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Originations Tracking Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,32,64,0.04)] overflow-hidden">
        <div className="p-6 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-[#0F2040]">
              Originations tracking
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Recent lease and balloon contracts routed through Ridero underwriting
            </p>
          </div>

          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100">
            {(['All', 'Funded', 'Docs Signed', 'In Review'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setOriginationFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  originationFilter === st
                    ? 'bg-white text-[#0F2040] shadow-xs'
                    : 'text-slate-600 hover:text-[#0F2040]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500">
                <th className="py-3 px-6">Origination ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Credit Band</th>
                <th className="py-3 px-4 text-right">Advance %</th>
                <th className="py-3 px-4 text-right">Residual Floor</th>
                <th className="py-3 px-4 text-right">Financed Amount</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredOriginations.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-mono text-xs font-semibold text-[#0F2040]">
                    {row.id}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap tabular-nums">
                    {row.fundedDate}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">{row.vehicle}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                    {row.creditBand}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-700 tabular-nums">
                    {row.advanceRate}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-700 tabular-nums">
                    {row.residualGuarantee}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-sm font-bold text-[#0F2040] tabular-nums">
                    ${row.financedAmount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    {row.status === 'Funded' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10B981]">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>Funded</span>
                      </span>
                    ) : row.status === 'Docs Signed' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F2040]">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>Docs Signed</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>In Review</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Automated Lender Connectivity Status */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,32,64,0.04)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h2 className="font-display text-lg font-bold text-[#0F2040]">
              Automated lender connectivity
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct decisioning bridges across institutional underwriting partners
            </p>
          </div>
          <button
            type="button"
            onClick={runConnectivityCheck}
            disabled={isTestingSync}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#0F2040] hover:bg-slate-50 transition-colors disabled:opacity-60 min-h-[38px]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isTestingSync ? 'animate-spin' : ''}`} />
            <span>{isTestingSync ? 'Checking endpoints...' : 'Run connection check'}</span>
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {connections.map((conn) => (
            <div
              key={conn.id}
              className="rounded-xl border border-slate-200/80 p-4 flex flex-col justify-between gap-3 bg-slate-50/40"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-[#0F2040]">{conn.name}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{conn.protocol}</div>
                </div>
                {conn.status === 'Connected' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#10B981] shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Connected</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 shrink-0">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Sandbox</span>
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200/70 text-xs text-slate-600 tabular-nums">
                <span>Avg decision: {conn.avgLatencySec}s</span>
                <span>{conn.lastSync}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
