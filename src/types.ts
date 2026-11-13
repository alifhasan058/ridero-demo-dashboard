export type NavSectionId =
  | 'home'
  | 'lease-search'
  | 'dealer-dashboard'
  | 'lender-portal'
  | 'how-it-works';

export type DealerRegion = 'All' | 'Northeast' | 'Southern US';

export type DealStatus = 'Approved' | 'Pending';

export interface VehicleDeal {
  id: string;
  make: string;
  model: string;
  trim: string;
  year: number;
  mileage: number;
  condition: 'New' | 'Certified Pre-Owned';
  msrp: number;
  monthlyPayment: number;
  downPayment: number;
  termMonths: number;
  residualPercent: number;
  residualValue: number;
  moneyFactor: number;
  lenderName: string;
  region: Exclude<DealerRegion, 'All'>;
  imageUrl: string;
  drivetrain: string;
  fuelType: string;
}

export interface DealerPipelineDeal {
  id: string;
  vehicle: string;
  vinLast6: string;
  region: Exclude<DealerRegion, 'All'>;
  dealerName: string;
  lender: string;
  termMonths: number;
  residualPercent: number;
  residualAmount: number;
  monthlyPayment: number;
  status: DealStatus;
  creditTier: string;
  aiConfidence: string;
  updatedAt: string;
}

export interface MonthlyDealMetric {
  month: string;
  northeast: number;
  southern: number;
}

export interface LenderShareMetric {
  lender: string;
  approvals: number;
  color: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  owner: string;
  category: string;
  completed: boolean;
  detail: string;
}

export interface CreditBandMetric {
  band: string;
  label: string;
  portfolioShare: number;
  approvalRate: number;
  baseDefaultRisk: number;
  avgMonthly: number;
}

export interface OriginationRecord {
  id: string;
  fundedDate: string;
  vehicle: string;
  creditBand: string;
  advanceRate: number;
  residualGuarantee: number;
  financedAmount: number;
  status: 'Funded' | 'In Review' | 'Docs Signed';
}

export interface LenderConnection {
  id: string;
  name: string;
  protocol: string;
  avgLatencySec: number;
  status: 'Connected' | 'Sandbox';
  lastSync: string;
  approvalShare: string;
}
