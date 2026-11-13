import { useState } from 'react';
import { ArrowRight, Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { HomeSection } from './components/HomeSection';
import { LeaseSearchSection } from './components/LeaseSearchSection';
import { DealerDashboardSection } from './components/DealerDashboardSection';
import { LenderPortalSection } from './components/LenderPortalSection';
import { PricingHowItWorksSection } from './components/PricingHowItWorksSection';
import { NavSectionId } from './types';

const SECTION_META: Record<
  NavSectionId,
  {
    breadcrumb: string;
    primaryActionLabel: string;
    primaryActionTarget: NavSectionId;
  }
> = {
  home: {
    breadcrumb: 'Overview',
    primaryActionLabel: 'Search by monthly payment',
    primaryActionTarget: 'lease-search',
  },
  'lease-search': {
    breadcrumb: 'Consumer Lease Search',
    primaryActionLabel: 'View dealer desk',
    primaryActionTarget: 'dealer-dashboard',
  },
  'dealer-dashboard': {
    breadcrumb: 'Dealer Dashboard',
    primaryActionLabel: 'Open lender portal',
    primaryActionTarget: 'lender-portal',
  },
  'lender-portal': {
    breadcrumb: 'Lender Portal',
    primaryActionLabel: 'Pricing & how it works',
    primaryActionTarget: 'how-it-works',
  },
  'how-it-works': {
    breadcrumb: 'Pricing & How It Works',
    primaryActionLabel: 'Search vehicle deals',
    primaryActionTarget: 'lease-search',
  },
};

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelectSection = (section: NavSectionId) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const meta = SECTION_META[activeSection];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col lg:flex-row">
      {/* Left Navy #0F2040 Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* Compact Workspace Top Bar (1 row, mobile sticky cap safe) */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-4 sm:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden rounded-lg p-2 -ml-2 text-[#0F2040] hover:bg-slate-100 min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0 truncate">
              <span className="font-semibold text-[#0F2040] whitespace-nowrap">
                Ridero
              </span>
              <span className="text-slate-300" aria-hidden="true">
                /
              </span>
              <span className="text-slate-600 font-medium truncate">
                {meta.breadcrumb}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSelectSection(meta.primaryActionTarget)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F2040] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#183160] transition-colors whitespace-nowrap shrink-0"
          >
            <span>{meta.primaryActionLabel}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </header>

        {/* Active Page Viewport */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
          {activeSection === 'home' && (
            <HomeSection onNavigate={handleSelectSection} />
          )}
          {activeSection === 'lease-search' && <LeaseSearchSection />}
          {activeSection === 'dealer-dashboard' && <DealerDashboardSection />}
          {activeSection === 'lender-portal' && <LenderPortalSection />}
          {activeSection === 'how-it-works' && (
            <PricingHowItWorksSection onNavigate={handleSelectSection} />
          )}
        </main>

        {/* Quiet Footer */}
        <footer className="border-t border-slate-200/80 bg-white px-4 sm:px-8 py-6 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
            <p>
              Concept demo prepared by Alif Hasan - Logo, Branding &amp; Packaging Designer -{' '}
              <a
                href="https://alifhasan.framer.website"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#0F2040] underline underline-offset-2 hover:text-[#10B981] transition-colors"
              >
                alifhasan.framer.website
              </a>
            </p>
            <p className="text-slate-400">
              Concept demo only · Illustrative sample data · Not the official Ridero website
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
