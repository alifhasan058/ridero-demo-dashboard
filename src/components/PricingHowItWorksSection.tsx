import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';
import { NavSectionId } from '../types';

interface PricingHowItWorksSectionProps {
  onNavigate: (section: NavSectionId) => void;
}

const STEPS = [
  {
    number: '01',
    title: 'Structure deal',
    description:
      'Select any new or used vehicle, set your target monthly payment, and calibrate down payment, mileage allowance, and balloon residual value.',
    outcome: 'Up to 32% lower monthly obligation vs. conventional 60-month auto loans.',
  },
  {
    number: '02',
    title: 'AI risk check',
    description:
      'Ridero evaluates real-time depreciation curves, regional resale demand, and soft-pull credit & cashflow indicators without impacting borrower credit.',
    outcome: 'Sub-2-second risk score and guaranteed residual floor verification.',
  },
  {
    number: '03',
    title: 'Lender match in minutes',
    description:
      'Automated waterfall routing matches the deal against 14 integrated lender buy-boxes, presenting transparent terms ready for digital eContracting.',
    outcome: '86% average approval rate with zero manual re-keying at the dealership.',
  },
];

const PRICING_TIERS = [
  {
    audience: 'For Drivers',
    name: 'Consumer Direct',
    price: '$0',
    cadence: 'platform fee',
    summary: 'Transparent lease and balloon discovery with no hidden broker markups.',
    specs: [
      'Monthly payment search ($199–$799)',
      'Guaranteed end-of-term buyout price',
      'Soft-pull AI pre-qualification',
      'Trade-in, refinance, or return flexibility',
    ],
    cta: 'Browse vehicle deals',
    targetSection: 'lease-search' as NavSectionId,
  },
  {
    audience: 'For Dealerships',
    name: 'Dealer Desk Pro',
    price: '$499',
    cadence: 'per rooftop / month',
    summary: 'Turn used and new inventory into payment-first lease offers across 14 lenders.',
    specs: [
      'Unlimited AI lease & balloon structuring',
      '14+ automated lender buy-box routes',
      'Regional residual analytics & CSV exports',
      'Digital eContracting & titling workflow',
    ],
    cta: 'View dealer dashboard',
    targetSection: 'dealer-dashboard' as NavSectionId,
  },
  {
    audience: 'For Capital Partners',
    name: 'Institutional Lender',
    price: 'Custom',
    cadence: 'per funded origination',
    summary: 'Plug directly into Ridero’s residual-insured underwriting and servicing API.',
    specs: [
      'Custom credit-band & LTV waterfall rules',
      'Manheim & Black Book residual curve feed',
      'ISO-20022 / REST webhook origination API',
      'Real-time default stress-test analytics',
    ],
    cta: 'Open lender portal',
    targetSection: 'lender-portal' as NavSectionId,
  },
];

export function PricingHowItWorksSection({
  onNavigate,
}: PricingHowItWorksSectionProps) {
  const [vehiclePrice, setVehiclePrice] = useState(34500);
  const [downPayment, setDownPayment] = useState(2500);
  const [termMonths, setTermMonths] = useState<24 | 36 | 48>(36);
  const [modalOpen, setModalOpen] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [roleType, setRoleType] = useState<'Dealer' | 'Lender'>('Dealer');
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState('');

  const comparison = useMemo(() => {
    const residualPct = termMonths === 24 ? 0.66 : termMonths === 36 ? 0.59 : 0.51;
    const residualValue = Math.round(vehiclePrice * residualPct);
    const financed = Math.max(5000, vehiclePrice - downPayment);
    const depreciation = (financed - residualValue) / termMonths;
    const rentCharge = (financed + residualValue) * 0.00195;
    const rideroMonthly = Math.max(199, Math.round(depreciation + rentCharge));

    // Traditional 60-mo loan @ 6.9% APR
    const r = 0.069 / 12;
    const n = 60;
    const loanMonthly = Math.round(
      (financed * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1)
    );
    const monthlySavings = Math.max(0, loanMonthly - rideroMonthly);

    return {
      rideroMonthly,
      loanMonthly,
      monthlySavings,
      residualValue,
      residualPct: Math.round(residualPct * 100),
    };
  }, [vehiclePrice, downPayment, termMonths]);

  const handleRequestDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.includes('@') || !contactEmail.includes('.')) {
      setEmailError('Please enter a valid work email address.');
      return;
    }
    setEmailError('');
    setSubmitted(true);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#0F2040] tracking-tight">
            Pricing &amp; How It Works
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600 max-w-2xl">
            How Ridero structures lower monthly payments in three automated steps—and transparent pricing for consumers, dealers, and lenders.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setModalOpen(true);
            setSubmitted(false);
            setEmailError('');
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0F2040] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#183160] transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
        >
          <span>Request Partner Walkthrough</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* 3 Steps */}
      <section aria-labelledby="steps-heading" className="space-y-5">
        <h2 id="steps-heading" className="font-display text-xl font-bold text-[#0F2040]">
          Three steps from vehicle selection to funded lease
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,32,64,0.04)] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="font-mono text-xs font-semibold text-[#10B981] tabular-nums">
                  Step {step.number}
                </div>
                <h3 className="mt-2 font-display text-xl font-bold text-[#0F2040]">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-medium text-[#0F2040]">
                {step.outcome}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Payment Simulator */}
      <section
        aria-labelledby="simulator-heading"
        className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_6px_24px_rgba(15,32,64,0.05)] p-6 sm:p-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2
                id="simulator-heading"
                className="font-display text-xl font-bold text-[#0F2040]"
              >
                AI Lease / Balloon vs. Traditional Loan Simulator
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Adjust price, down payment, and term to compare monthly cashflow.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span>Vehicle Price</span>
                  <span className="font-mono text-[#0F2040] tabular-nums">
                    ${vehiclePrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={20000}
                  max={65000}
                  step={500}
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(Number(e.target.value))}
                  className="ridero-slider w-full"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span>Down Payment</span>
                  <span className="font-mono text-[#0F2040] tabular-nums">
                    ${downPayment.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={7500}
                  step={250}
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="ridero-slider w-full"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-700 mb-2">
                  Ridero Term
                </span>
                <div className="grid grid-cols-3 gap-2.5 max-w-sm">
                  {([24, 36, 48] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTermMonths(t)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                        termMonths === t
                          ? 'bg-[#0F2040] text-white border-[#0F2040]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {t} months
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-[#0F2040] text-white p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div>
                <div className="text-xs text-slate-300">Ridero AI Lease / Balloon</div>
                <div className="mt-1 font-display text-4xl font-bold tabular-nums">
                  ${comparison.rideroMonthly}
                  <span className="text-sm font-normal text-slate-300">/mo</span>
                </div>
              </div>
              <div className="text-right tabular-nums">
                <div className="text-xs text-slate-300">Monthly Savings</div>
                <div className="mt-1 font-mono text-lg font-bold text-[#10B981]">
                  -${comparison.monthlySavings}/mo
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Traditional 60-mo loan (6.9% APR)</span>
                <span className="font-mono font-semibold text-white tabular-nums">
                  ${comparison.loanMonthly}/mo
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Guaranteed residual ({comparison.residualPct}%)</span>
                <span className="font-mono font-semibold text-[#10B981] tabular-nums">
                  ${comparison.residualValue.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('lease-search')}
              className="w-full rounded-xl bg-white text-[#0F2040] px-4 py-2.5 text-sm font-semibold hover:bg-slate-100 transition-colors min-h-[44px]"
            >
              Match vehicles under ${comparison.rideroMonthly + 50}/mo
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section aria-labelledby="pricing-heading" className="space-y-5">
        <h2 id="pricing-heading" className="font-display text-xl font-bold text-[#0F2040]">
          Program pricing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className="rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(15,32,64,0.04)] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-medium text-slate-500">{tier.audience}</div>
                <h3 className="mt-1.5 font-display text-xl font-bold text-[#0F2040]">
                  {tier.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-2 tabular-nums">
                  <span className="font-display text-3xl font-bold text-[#0F2040]">
                    {tier.price}
                  </span>
                  <span className="text-xs text-slate-500">{tier.cadence}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {tier.summary}
                </p>

                <ul className="mt-5 pt-5 border-t border-slate-100 space-y-2.5">
                  {tier.specs.map((spec) => (
                    <li
                      key={spec}
                      className="flex items-start gap-2 text-xs text-slate-700"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate(tier.targetSection)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-[#0F2040] hover:bg-[#0F2040] hover:text-white hover:border-[#0F2040] transition-colors min-h-[44px]"
                >
                  {tier.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partner Walkthrough Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="walkthrough-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3
                  id="walkthrough-modal-title"
                  className="font-display text-lg font-bold text-[#0F2040]"
                >
                  Partner Walkthrough (Demo)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Simulate a dealer or lender onboarding inquiry
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {submitted ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                  <CheckCircle2 className="h-5 w-5 text-[#10B981]" />
                  <span>Demo Request Recorded</span>
                </div>
                <p className="text-xs text-emerald-900/80 leading-relaxed">
                  Sample {roleType} onboarding packet prepared for {contactEmail}. Remember this is an interactive concept demo only.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestDemo} className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Organization Type
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Dealer', 'Lender'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRoleType(r)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                          roleType === r
                            ? 'bg-[#0F2040] text-white border-[#0F2040]'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {r} Partner
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="partner-email"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Work Email
                  </label>
                  <input
                    id="partner-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@dealership.com"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-[#0F2040] focus:outline-none focus:ring-2 focus:ring-[#0F2040]/15"
                  />
                  {emailError && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">{emailError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#0F2040] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#183160] transition-colors min-h-[44px]"
                >
                  Submit Demo Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
