import {
  BarChart3,
  CarFront,
  Compass,
  Landmark,
  Layers,
  X,
} from 'lucide-react';
import { NavSectionId } from '../types';

interface SidebarProps {
  activeSection: NavSectionId;
  onSelectSection: (section: NavSectionId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: {
  id: NavSectionId;
  label: string;
  description: string;
  icon: typeof Compass;
}[] = [
  {
    id: 'home',
    label: 'Overview',
    description: 'Platform hero & summary',
    icon: Compass,
  },
  {
    id: 'lease-search',
    label: 'Lease Search',
    description: 'Consumer monthly finder',
    icon: CarFront,
  },
  {
    id: 'dealer-dashboard',
    label: 'Dealer Dashboard',
    description: 'Pipeline & lender mix',
    icon: BarChart3,
  },
  {
    id: 'lender-portal',
    label: 'Lender Portal',
    description: 'Risk & originations API',
    icon: Landmark,
  },
  {
    id: 'how-it-works',
    label: 'Pricing & Flow',
    description: '3-step AI underwriting',
    icon: Layers,
  },
];

export function Sidebar({
  activeSection,
  onSelectSection,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const handleSelect = (id: NavSectionId) => {
    onSelectSection(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#0F2040] text-white select-none">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <button
            type="button"
            onClick={() => handleSelect('home')}
            className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0F2040] shadow-sm">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 17L10 7h7.5a3.5 3.5 0 0 1 0 7H11l5.5 3" />
              </svg>
            </div>
            <div>
              <div className="font-display text-lg font-bold tracking-tight text-white leading-none">
                Ridero
              </div>
              <div className="mt-1 text-[11px] font-medium text-slate-300/80 whitespace-nowrap">
                AI Auto Finance · Demo
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Primary navigation" className="px-3 py-5 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-left transition-all duration-150 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  isActive
                    ? 'bg-white text-[#0F2040] shadow-sm'
                    : 'text-slate-300 hover:bg-white/8 hover:text-white'
                }`}
              >
                <Icon
                  className={`h-4.5 w-4.5 shrink-0 ${
                    isActive ? 'text-[#0F2040]' : 'text-slate-400'
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-sm font-semibold whitespace-nowrap truncate ${
                      isActive ? 'text-[#0F2040]' : 'text-white'
                    }`}
                  >
                    {item.label}
                  </div>
                  <div
                    className={`text-xs truncate ${
                      isActive ? 'text-slate-600' : 'text-slate-400'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Context */}
      <div className="px-5 py-5 border-t border-white/10 space-y-3">
        <div className="rounded-xl bg-white/6 p-3.5 border border-white/10">
          <div className="text-xs font-semibold text-white">
            Concept Prototype
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-300/90">
            Interactive fintech showcase using sample vehicle, dealer, and lender data. Not the official Ridero website.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop persistent sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64 lg:border-r lg:border-slate-200/20">
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
