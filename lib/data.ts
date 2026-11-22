import type {
  ActivityEvent,
  AddOn,
  AuditEntry,
  Company,
  Invoice,
  LoginRecord,
  Plan,
  Ticket,
} from "@/lib/types";

export const INDUSTRIES = [
  "Manufacturing",
  "Construction",
  "Logistics",
  "Energy & Utilities",
  "Pharmaceuticals",
  "Mining & Metals",
  "Chemicals",
  "Infrastructure",
  "Automotive",
  "Textiles",
  "Food & Beverage",
  "Facilities Management",
];

export const PLAN_LIST: Plan[] = [
  {
    id: "Starter",
    name: "Starter",
    tagline: "For small safety teams getting started",
    priceMonthly: 14999,
    priceAnnual: 143990,
    includedSeats: 50,
    includedStorage: 25,
    companies: 0,
    features: [
      "Up to 50 users",
      "Core safety modules",
      "Employee safety passport",
      "Email support",
      "25 GB storage",
    ],
  },
  {
    id: "Growth",
    name: "Growth",
    tagline: "For multi-site organisations scaling safety",
    priceMonthly: 39999,
    priceAnnual: 383990,
    includedSeats: 250,
    includedStorage: 200,
    companies: 0,
    popular: true,
    features: [
      "Up to 250 users",
      "All core + advanced modules",
      "CSMS drive & audit workflows",
      "Priority support (4h SLA)",
      "200 GB storage",
      "Custom domain",
    ],
  },
  {
    id: "Enterprise",
    name: "Enterprise",
    tagline: "For enterprises with complex compliance needs",
    priceMonthly: 89999,
    priceAnnual: 863990,
    includedSeats: 1000,
    includedStorage: 1024,
    companies: 0,
    features: [
      "Unlimited users",
      "All Growth features",
      "Dedicated success manager",
      "99.9% uptime SLA",
      "1 TB storage",
      "SSO & SCIM provisioning",
      "Custom contracts & invoicing",
    ],
  },
];

export const ADDONS: AddOn[] = [
  {
    id: "asset-management",
    name: "Asset Management",
    description: "Track equipment, inspections, calibration cycles and asset-level risk scores.",
    price: 249,
    unit: "user / month",
    icon: "Boxes",
    enabled: true,
    companies: 31,
    revenue: 214000,
    color: "text-chart-2",
  },
  {
    id: "salary-slip",
    name: "Salary Slip",
    description: "Generate compliant salary slips and share securely with field employees.",
    price: 199,
    unit: "user / month",
    icon: "ReceiptIndianRupee",
    enabled: true,
    companies: 22,
    revenue: 148000,
    color: "text-chart-3",
  },
  {
    id: "email-integration",
    name: "Email Integration",
    description: "Transactional email delivery on the company's own verified domain.",
    price: 499,
    unit: "company / month",
    icon: "Mail",
    enabled: false,
    companies: 9,
    revenue: 61000,
    color: "text-chart-4",
  },
];

export const BASE_FEATURES = [
  { name: "Dashboard", description: "Live safety KPIs and executive overview", icon: "LayoutDashboard" },
  { name: "Employee Management", description: "Workforce records, org structure and access", icon: "Users" },
  { name: "Employee Safety Passport", description: "Digital passport for every worker on site", icon: "BadgeCheck" },
  { name: "Near Miss", description: "Capture and close near-miss observations", icon: "AlertTriangle" },
  { name: "Hazard", description: "Hazard register with risk matrix and controls", icon: "Flame" },
  { name: "Safety Observation", description: "Behaviour-based safety observation cards", icon: "Eye" },
  { name: "Training", description: "Training calendar, attendance and certifications", icon: "GraduationCap" },
  { name: "TBT", description: "Toolbox talks with digital attendance", icon: "MessagesSquare" },
  { name: "Audit", description: "Audit templates, scoring and findings", icon: "ClipboardCheck" },
  { name: "Incident", description: "Incident reporting, investigation and RCA", icon: "ShieldAlert" },
  { name: "CAPA", description: "Corrective and preventive action tracking", icon: "ListChecks" },
  { name: "CSMS Drive", description: "Contractor safety management system", icon: "Truck" },
  { name: "Reports", description: "Compliance packs and scheduled reporting", icon: "FileBarChart" },
  { name: "Emergency Contacts", description: "Site emergency directory and escalation", icon: "PhoneCall" },
  { name: "Notice Board", description: "Safety announcements and circulars", icon: "Megaphone" },
  { name: "Settings", description: "Company-level configuration and roles", icon: "Settings" },
];

const COLORS = ["#0F766E", "#2563EB", "#7C3AED", "#C2410C", "#0891B2", "#4F46E5", "#B45309", "#BE123C", "#15803D", "#A21CAF"];

type Seed = {
  id: string;
  name: string;
  shortName: string;
  industry: string;
  city: string;
  plan: Plan["id"];
  status: Company["status"];
  health: Company["health"];
  addons: string[];
  adminName: string;
  adminEmail: string;
  users: number;
  maxUsers: number;
  employees: number;
  locations: number;
  storage: number;
  storageLimit: number;
  api: number;
  apiLimit: number;
  mrr: number;
  expiry: string;
  createdAt: string;
  lastActive: string;
  customDomain?: string;
  paymentStatus?: Company["paymentStatus"];
  billingCycle?: Company["billingCycle"];
};

const SEED: Seed[] = [
  { id: "cmp_001", name: "Tata Steel Works", shortName: "TSW", industry: "Mining & Metals", city: "Jamshedpur", plan: "Enterprise", status: "Active", health: "Healthy", addons: ["asset-management", "salary-slip", "email-integration"], adminName: "Rohit Malhotra", adminEmail: "rohit.malhotra@tatasteelworks.in", users: 842, maxUsers: 1000, employees: 1240, locations: 14, storage: 640, storageLimit: 1024, api: 412000, apiLimit: 500000, mrr: 89999, expiry: "2027-08-14", createdAt: "2024-02-14", lastActive: "2026-11-22T14:02:00", customDomain: "safety.tatasteelworks.in" },
  { id: "cmp_002", name: "Larsen Infra Projects", shortName: "LIP", industry: "Infrastructure", city: "Mumbai", plan: "Enterprise", status: "Active", health: "Healthy", addons: ["asset-management", "salary-slip"], adminName: "Priya Nair", adminEmail: "priya.nair@larseninfra.com", users: 674, maxUsers: 1000, employees: 980, locations: 22, storage: 412, storageLimit: 1024, api: 288000, apiLimit: 500000, mrr: 89999, expiry: "2027-03-01", createdAt: "2024-04-02", lastActive: "2026-11-22T13:44:00", billingCycle: "Annual" },
  { id: "cmp_003", name: "Adani Renewables", shortName: "ARN", industry: "Energy & Utilities", city: "Ahmedabad", plan: "Growth", status: "Active", health: "Healthy", addons: ["asset-management", "email-integration"], adminName: "Karan Desai", adminEmail: "karan.desai@adanirenewables.com", users: 231, maxUsers: 250, employees: 310, locations: 9, storage: 118, storageLimit: 200, api: 94000, apiLimit: 150000, mrr: 39999, expiry: "2027-01-19", createdAt: "2024-07-19", lastActive: "2026-11-22T12:58:00" },
  { id: "cmp_004", name: "Sun Pharma Labs", shortName: "SPL", industry: "Pharmaceuticals", city: "Vadodara", plan: "Growth", status: "Active", health: "At risk", addons: ["salary-slip"], adminName: "Dr. Ananya Bose", adminEmail: "ananya.bose@sunpharmalabs.com", users: 244, maxUsers: 250, employees: 402, locations: 6, storage: 186, storageLimit: 200, api: 138000, apiLimit: 150000, mrr: 39999, expiry: "2026-12-04", createdAt: "2024-09-04", lastActive: "2026-11-22T11:20:00", paymentStatus: "Overdue" },
  { id: "cmp_005", name: "Mahindra Auto Components", shortName: "MAC", industry: "Automotive", city: "Pune", plan: "Enterprise", status: "Active", health: "Healthy", addons: ["asset-management", "salary-slip", "email-integration"], adminName: "Sameer Joshi", adminEmail: "sameer.joshi@mahindraauto.com", users: 918, maxUsers: 1200, employees: 1420, locations: 11, storage: 588, storageLimit: 1024, api: 376000, apiLimit: 600000, mrr: 109999, expiry: "2027-06-30", createdAt: "2023-11-11", lastActive: "2026-11-22T14:15:00" },
  { id: "cmp_006", name: "Blue Dart Logistics", shortName: "BDL", industry: "Logistics", city: "Bengaluru", plan: "Growth", status: "Trial", health: "Healthy", addons: ["email-integration"], adminName: "Meera Krishnan", adminEmail: "meera.k@bluedartlogistics.in", users: 88, maxUsers: 250, employees: 132, locations: 4, storage: 21, storageLimit: 200, api: 18400, apiLimit: 150000, mrr: 0, expiry: "2026-12-06", createdAt: "2026-11-06", lastActive: "2026-11-22T09:41:00", paymentStatus: "Pending" },
  { id: "cmp_007", name: "UltraTech Cement", shortName: "UTC", industry: "Manufacturing", city: "Nagpur", plan: "Enterprise", status: "Active", health: "Healthy", addons: ["asset-management", "salary-slip"], adminName: "Vikram Shetty", adminEmail: "vikram.shetty@ultratechcement.com", users: 1104, maxUsers: 1200, employees: 1680, locations: 18, storage: 812, storageLimit: 1024, api: 442000, apiLimit: 600000, mrr: 109999, expiry: "2027-09-12", createdAt: "2023-08-12", lastActive: "2026-11-22T14:22:00", billingCycle: "Annual" },
  { id: "cmp_008", name: "Dr. Reddy's Facilities", shortName: "DRF", industry: "Facilities Management", city: "Hyderabad", plan: "Starter", status: "Active", health: "Healthy", addons: [], adminName: "Aisha Rahman", adminEmail: "aisha.rahman@drreddysfacilities.com", users: 46, maxUsers: 50, employees: 74, locations: 2, storage: 14, storageLimit: 25, api: 8200, apiLimit: 40000, mrr: 14999, expiry: "2027-02-22", createdAt: "2025-02-22", lastActive: "2026-11-21T18:30:00" },
  { id: "cmp_009", name: "JSW Mining Division", shortName: "JMD", industry: "Mining & Metals", city: "Bellary", plan: "Growth", status: "Suspended", health: "Critical", addons: ["asset-management"], adminName: "Naveen Reddy", adminEmail: "naveen.reddy@jswmining.in", users: 209, maxUsers: 250, employees: 288, locations: 5, storage: 96, storageLimit: 200, api: 41000, apiLimit: 150000, mrr: 39999, expiry: "2026-10-30", createdAt: "2024-10-30", lastActive: "2026-10-28T16:12:00", paymentStatus: "Overdue" },
  { id: "cmp_010", name: "Godrej Chemicals", shortName: "GCH", industry: "Chemicals", city: "Bhiwadi", plan: "Growth", status: "Active", health: "Healthy", addons: ["salary-slip", "asset-management"], adminName: "Tanvi Mehta", adminEmail: "tanvi.mehta@godrejchemicals.com", users: 198, maxUsers: 250, employees: 266, locations: 7, storage: 142, storageLimit: 200, api: 87000, apiLimit: 150000, mrr: 39999, expiry: "2027-04-18", createdAt: "2024-12-18", lastActive: "2026-11-22T10:33:00" },
  { id: "cmp_011", name: "Bharat Heavy Electricals", shortName: "BHEL", industry: "Energy & Utilities", city: "Bhopal", plan: "Enterprise", status: "Active", health: "At risk", addons: ["asset-management", "email-integration"], adminName: "Arjun Prakash", adminEmail: "arjun.prakash@bhel.in", users: 1160, maxUsers: 1200, employees: 1520, locations: 16, storage: 964, storageLimit: 1024, api: 388000, apiLimit: 600000, mrr: 109999, expiry: "2026-12-28", createdAt: "2024-01-28", lastActive: "2026-11-22T08:15:00", customDomain: "safety.bhel.in" },
  { id: "cmp_012", name: "Reliance Petrochem", shortName: "RPC", industry: "Chemicals", city: "Jamnagar", plan: "Enterprise", status: "Active", health: "Healthy", addons: ["asset-management", "salary-slip", "email-integration"], adminName: "Sneha Kapoor", adminEmail: "sneha.kapoor@relpetrochem.com", users: 786, maxUsers: 1000, employees: 1120, locations: 12, storage: 702, storageLimit: 1024, api: 316000, apiLimit: 500000, mrr: 89999, expiry: "2027-05-09", createdAt: "2023-06-09", lastActive: "2026-11-22T13:05:00" },
  { id: "cmp_013", name: "Apollo Hospitals Group", shortName: "AHG", industry: "Facilities Management", city: "Chennai", plan: "Growth", status: "Active", health: "Healthy", addons: ["salary-slip"], adminName: "Dr. Nikhil Menon", adminEmail: "nikhil.menon@apollofacilities.in", users: 176, maxUsers: 250, employees: 214, locations: 8, storage: 88, storageLimit: 200, api: 54000, apiLimit: 150000, mrr: 39999, expiry: "2027-01-05", createdAt: "2025-01-05", lastActive: "2026-11-22T12:12:00" },
  { id: "cmp_014", name: "Vardhman Textiles", shortName: "VTL", industry: "Textiles", city: "Ludhiana", plan: "Starter", status: "Active", health: "Healthy", addons: [], adminName: "Harpreet Singh", adminEmail: "harpreet.singh@vardhmantex.com", users: 38, maxUsers: 50, employees: 61, locations: 2, storage: 9, storageLimit: 25, api: 6400, apiLimit: 40000, mrr: 14999, expiry: "2027-03-16", createdAt: "2025-03-16", lastActive: "2026-11-20T17:20:00" },
  { id: "cmp_015", name: "Britannia Foods Plant", shortName: "BFP", industry: "Food & Beverage", city: "Kolkata", plan: "Growth", status: "Trial", health: "Healthy", addons: ["asset-management"], adminName: "Abhishek Ghosh", adminEmail: "abhishek.ghosh@britanniafoods.in", users: 64, maxUsers: 250, employees: 96, locations: 3, storage: 18, storageLimit: 200, api: 14600, apiLimit: 150000, mrr: 0, expiry: "2026-12-12", createdAt: "2026-11-12", lastActive: "2026-11-22T07:52:00", paymentStatus: "Pending" },
  { id: "cmp_016", name: "Suzuki Manufacturing", shortName: "SMF", industry: "Automotive", city: "Gurugram", plan: "Enterprise", status: "Draft", health: "Healthy", addons: ["asset-management", "salary-slip"], adminName: "Ritika Bansal", adminEmail: "ritika.bansal@suzukimfg.in", users: 0, maxUsers: 1000, employees: 0, locations: 1, storage: 0, storageLimit: 512, api: 0, apiLimit: 500000, mrr: 0, expiry: "2027-11-18", createdAt: "2026-11-18", lastActive: "2026-11-21T15:40:00" },
  { id: "cmp_017", name: "Aditya Birla Retail", shortName: "ABR", industry: "Food & Beverage", city: "Navi Mumbai", plan: "Growth", status: "Draft", health: "Healthy", addons: [], adminName: "Farhan Shaikh", adminEmail: "farhan.shaikh@abretail.in", users: 0, maxUsers: 250, employees: 0, locations: 1, storage: 0, storageLimit: 200, api: 0, apiLimit: 150000, mrr: 0, expiry: "2027-11-10", createdAt: "2026-11-10", lastActive: "2026-11-20T11:10:00" },
  { id: "cmp_018", name: "Essar Steel (Archived)", shortName: "ESS", industry: "Mining & Metals", city: "Hazira", plan: "Starter", status: "Archived", health: "Critical", addons: [], adminName: "Manoj Verma", adminEmail: "manoj.verma@essarsteel.in", users: 12, maxUsers: 50, employees: 34, locations: 1, storage: 6, storageLimit: 25, api: 900, apiLimit: 40000, mrr: 0, expiry: "2025-12-01", createdAt: "2024-06-01", lastActive: "2026-08-14T10:05:00", paymentStatus: "Overdue" },
  { id: "cmp_019", name: "Cipla Manufacturing", shortName: "CML", industry: "Pharmaceuticals", city: "Indore", plan: "Growth", status: "Archived", health: "Healthy", addons: ["salary-slip"], adminName: "Aarav Iyer", adminEmail: "aarav.iyer@ciplamfg.in", users: 92, maxUsers: 250, employees: 140, locations: 3, storage: 44, storageLimit: 200, api: 22000, apiLimit: 150000, mrr: 0, expiry: "2025-09-30", createdAt: "2024-03-30", lastActive: "2026-09-18T09:30:00" },
];

function buildCompany(seed: Seed, index: number): Company {
  const initials = seed.shortName.slice(0, 3).toUpperCase();
  return {
    id: seed.id,
    name: seed.name,
    shortName: seed.shortName,
    initials,
    logoColor: COLORS[index % COLORS.length],
    industry: seed.industry,
    subdomain: `${seed.shortName.toLowerCase().replace(/[^a-z0-9]/g, "")}.safex.app`,
    customDomain: seed.customDomain,
    sslStatus: seed.customDomain ? "Active" : "Issued",
    admin: {
      name: seed.adminName,
      designation: "Head of EHS",
      email: seed.adminEmail,
      phone: `+91 9${(800000000 + index * 1234567).toString().slice(0, 9)}`,
      username: seed.adminEmail.split("@")[0],
      lastLogin: seed.lastActive,
    },
    plan: seed.plan,
    billingCycle: seed.billingCycle ?? "Monthly",
    status: seed.status,
    health: seed.health,
    paymentStatus: seed.paymentStatus ?? "Paid",
    addons: seed.addons,
    users: seed.users,
    maxUsers: seed.maxUsers,
    employees: seed.employees,
    maxEmployees: Math.round(seed.maxUsers * 1.5),
    locations: seed.locations,
    maxLocations: seed.plan === "Enterprise" ? 50 : seed.plan === "Growth" ? 15 : 5,
    storageUsed: seed.storage,
    storageLimit: seed.storageLimit,
    apiCalls: seed.api,
    apiLimit: seed.apiLimit,
    mrr: seed.mrr,
    expiry: seed.expiry,
    createdAt: seed.createdAt,
    lastActive: seed.lastActive,
    country: "India",
    email: seed.adminEmail,
    phone: `+91 22 ${40000000 + index * 79191}`,
    address: `${seed.city}, India`,
  };
}

export const companies: Company[] = SEED.map(buildCompany).map((c, i) => ({
  ...c,
  phone: SEED[i].status === "Active" ? `+91 22 ${41000000 + i * 35719}` : c.phone,
}));

export const planCounts = PLAN_LIST.map((plan) => ({
  ...plan,
  companies: companies.filter((c) => c.plan === plan.id && c.status !== "Draft").length,
}));

export const KPIS = {
  totalCompanies: 214,
  activeCompanies: 186,
  trialCompanies: 19,
  suspendedCompanies: 9,
  monthlyRevenue: 12845000,
  totalEmployees: 184620,
  activeUsers: 42618,
  storageUsed: 8.4,
  revenueGrowth: 18.4,
  companyGrowth: 12.6,
  activeUserGrowth: 9.2,
  churnRate: 1.4,
};

export const companyGrowth = [
  { month: "Dec", companies: 132, active: 112 },
  { month: "Jan", companies: 141, active: 119 },
  { month: "Feb", companies: 148, active: 126 },
  { month: "Mar", companies: 155, active: 132 },
  { month: "Apr", companies: 162, active: 139 },
  { month: "May", companies: 168, active: 145 },
  { month: "Jun", companies: 174, active: 151 },
  { month: "Jul", companies: 181, active: 158 },
  { month: "Aug", companies: 188, active: 164 },
  { month: "Sep", companies: 195, active: 171 },
  { month: "Oct", companies: 205, active: 179 },
  { month: "Nov", companies: 214, active: 186 },
];

export const revenueTrend = [
  { month: "Dec", revenue: 68.2, addons: 9.4, target: 70 },
  { month: "Jan", revenue: 71.4, addons: 10.2, target: 72 },
  { month: "Feb", revenue: 74.8, addons: 11.1, target: 74 },
  { month: "Mar", revenue: 79.6, addons: 12.4, target: 78 },
  { month: "Apr", revenue: 82.1, addons: 13.2, target: 80 },
  { month: "May", revenue: 86.9, addons: 14.6, target: 84 },
  { month: "Jun", revenue: 91.2, addons: 15.8, target: 88 },
  { month: "Jul", revenue: 96.4, addons: 17.1, target: 92 },
  { month: "Aug", revenue: 101.8, addons: 18.9, target: 96 },
  { month: "Sep", revenue: 108.6, addons: 20.4, target: 102 },
  { month: "Oct", revenue: 118.2, addons: 22.8, target: 110 },
  { month: "Nov", revenue: 128.5, addons: 25.9, target: 120 },
];

export const subscriptionDistribution = [
  { name: "Enterprise", value: 61, color: "var(--chart-2)" },
  { name: "Growth", value: 104, color: "var(--chart-1)" },
  { name: "Starter", value: 49, color: "var(--chart-3)" },
];

export const addonRevenue = [
  { month: "Jun", asset: 4.8, salary: 3.2, email: 1.1 },
  { month: "Jul", asset: 5.3, salary: 3.5, email: 1.2 },
  { month: "Aug", asset: 6.1, salary: 3.9, email: 1.4 },
  { month: "Sep", asset: 6.8, salary: 4.2, email: 1.5 },
  { month: "Oct", asset: 7.6, salary: 4.7, email: 1.7 },
  { month: "Nov", asset: 8.9, salary: 5.4, email: 1.9 },
];

export const activeUsersTrend = [
  { month: "Jun", users: 31200 },
  { month: "Jul", users: 33400 },
  { month: "Aug", users: 35100 },
  { month: "Sep", users: 37900 },
  { month: "Oct", users: 40200 },
  { month: "Nov", users: 42618 },
];

export const topCompanies = [
  { name: "UltraTech Cement", plan: "Enterprise", users: 1104, revenue: 109999, storage: 812, health: "Healthy" },
  { name: "Bharat Heavy Electricals", plan: "Enterprise", users: 1160, revenue: 109999, storage: 964, health: "At risk" },
  { name: "Mahindra Auto Components", plan: "Enterprise", users: 918, revenue: 109999, storage: 588, health: "Healthy" },
  { name: "Tata Steel Works", plan: "Enterprise", users: 842, revenue: 89999, storage: 640, health: "Healthy" },
  { name: "Reliance Petrochem", plan: "Enterprise", users: 786, revenue: 89999, storage: 702, health: "Healthy" },
  { name: "Larsen Infra Projects", plan: "Enterprise", users: 674, revenue: 89999, storage: 412, health: "Healthy" },
];

export const recentActivity: ActivityEvent[] = [
  { id: "act_01", title: "Company published", description: "Suzuki Manufacturing was published with Enterprise plan and 2 add-ons.", actor: "Priya Sharma", timestamp: "2026-11-22T14:12:00", type: "company" },
  { id: "act_02", title: "Payment received", description: "₹1,09,999 collected from UltraTech Cement for annual renewal.", actor: "System", timestamp: "2026-11-22T13:48:00", type: "billing" },
  { id: "act_03", title: "Custom domain connected", description: "safety.tatasteelworks.in is live with an issued SSL certificate.", actor: "Priya Sharma", timestamp: "2026-11-22T12:30:00", type: "domain" },
  { id: "act_04", title: "Company suspended", description: "JSW Mining Division suspended due to an overdue invoice of ₹39,999.", actor: "Rahul Verma", timestamp: "2026-11-22T11:05:00", type: "company" },
  { id: "act_05", title: "Add-on enabled", description: "Email Integration enabled for Adani Renewables.", actor: "Priya Sharma", timestamp: "2026-11-22T10:22:00", type: "feature" },
  { id: "act_06", title: "Support ticket escalated", description: "Ticket #SUP-2841 escalated to high priority by the company admin.", actor: "Ananya Bose", timestamp: "2026-11-22T09:40:00", type: "support" },
  { id: "act_07", title: "Limit increased", description: "Maximum users increased from 1,000 to 1,200 for Bharat Heavy Electricals.", actor: "Priya Sharma", timestamp: "2026-11-21T18:14:00", type: "feature" },
  { id: "act_08", title: "Trial started", description: "Britannia Foods Plant started a 30-day Growth trial.", actor: "System", timestamp: "2026-11-21T16:02:00", type: "company" },
  { id: "act_09", title: "Admin password reset", description: "Password reset link issued for Meera Krishnan (Blue Dart Logistics).", actor: "Rahul Verma", timestamp: "2026-11-21T14:26:00", type: "security" },
];

export const tickets: Ticket[] = [
  {
    id: "SUP-2841", subject: "Bulk employee import failing for 4,200 records", company: "Sun Pharma Labs", requester: "Dr. Ananya Bose", priority: "Urgent", status: "Open", category: "Data import", assignedTo: "Rahul Verma", createdAt: "2026-11-22T09:32:00", updatedAt: "2026-11-22T10:12:00",
    messages: [
      { id: "m1", author: "Dr. Ananya Bose", role: "Company Admin", body: "We are importing 4,200 employee records from our HRMS export and the job fails at around 62% with a validation timeout. This blocks our site rollout on Monday.", timestamp: "2026-11-22T09:32:00" },
      { id: "m2", author: "Rahul Verma", role: "SAFEX Support", body: "Thanks for reporting. We can see the import job timing out on the employee passport validator. Please split the file into batches of 1,000 for now while we raise the worker timeout.", timestamp: "2026-11-22T10:12:00" },
    ],
  },
  {
    id: "SUP-2840", subject: "Custom domain SSL pending for 36 hours", company: "Bharat Heavy Electricals", requester: "Arjun Prakash", priority: "High", status: "In progress", category: "Domain & SSL", assignedTo: "Priya Sharma", createdAt: "2026-11-21T15:18:00", updatedAt: "2026-11-22T08:55:00",
    messages: [
      { id: "m1", author: "Arjun Prakash", role: "Company Admin", body: "The CNAME verification is complete but the certificate still shows pending. Our security team needs HTTPS enforced before the audit.", timestamp: "2026-11-21T15:18:00" },
      { id: "m2", author: "Priya Sharma", role: "SAFEX Support", body: "We have re-issued the certificate through the CA and it is propagating. Expected to be live within 2 hours.", timestamp: "2026-11-22T08:55:00" },
    ],
  },
  {
    id: "SUP-2839", subject: "Request to enable Salary Slip add-on", company: "Apollo Hospitals Group", requester: "Dr. Nikhil Menon", priority: "Medium", status: "Waiting on company", category: "Billing", assignedTo: "Meera Iyer", createdAt: "2026-11-21T12:04:00", updatedAt: "2026-11-21T17:30:00",
    messages: [
      { id: "m1", author: "Dr. Nikhil Menon", role: "Company Admin", body: "We would like to enable the Salary Slip add-on for 176 users from the next billing cycle.", timestamp: "2026-11-21T12:04:00" },
      { id: "m2", author: "Meera Iyer", role: "SAFEX Support", body: "Shared the revised order form — once signed, we will enable it immediately.", timestamp: "2026-11-21T17:30:00" },
    ],
  },
  {
    id: "SUP-2838", subject: "Near-miss analytics not loading on mobile", company: "Godrej Chemicals", requester: "Tanvi Mehta", priority: "Medium", status: "In progress", category: "Product issue", assignedTo: "Rahul Verma", createdAt: "2026-11-20T18:44:00", updatedAt: "2026-11-21T10:15:00",
    messages: [
      { id: "m1", author: "Tanvi Mehta", role: "Company Admin", body: "Charts on the near-miss dashboard spin indefinitely on Android Chrome.", timestamp: "2026-11-20T18:44:00" },
    ],
  },
  {
    id: "SUP-2837", subject: "Increase maximum locations from 15 to 25", company: "Adani Renewables", requester: "Karan Desai", priority: "Low", status: "Resolved", category: "Account", assignedTo: "Priya Sharma", createdAt: "2026-11-19T11:12:00", updatedAt: "2026-11-20T09:02:00",
    messages: [
      { id: "m1", author: "Karan Desai", role: "Company Admin", body: "Two new solar sites go live next month, please raise our location limit.", timestamp: "2026-11-19T11:12:00" },
      { id: "m2", author: "Priya Sharma", role: "SAFEX Support", body: "Location limit updated to 25 on your Growth plan at no additional cost.", timestamp: "2026-11-20T09:02:00" },
    ],
  },
  {
    id: "SUP-2836", subject: "Invoice GST number correction", company: "Vardhman Textiles", requester: "Harpreet Singh", priority: "High", status: "Resolved", category: "Billing", assignedTo: "Meera Iyer", createdAt: "2026-11-18T16:30:00", updatedAt: "2026-11-19T12:20:00",
    messages: [
      { id: "m1", author: "Harpreet Singh", role: "Company Admin", body: "Our GSTIN was entered incorrectly on invoice INV-2026-1049.", timestamp: "2026-11-18T16:30:00" },
      { id: "m2", author: "Meera Iyer", role: "SAFEX Support", body: "Corrected and re-issued. The revised invoice is available in your billing history.", timestamp: "2026-11-19T12:20:00" },
    ],
  },
  {
    id: "SUP-2835", subject: "SSO configuration for Azure AD", company: "Larsen Infra Projects", requester: "Priya Nair", priority: "Medium", status: "Open", category: "Security", assignedTo: "Rahul Verma", createdAt: "2026-11-18T10:08:00", updatedAt: "2026-11-21T14:40:00",
    messages: [
      { id: "m1", author: "Priya Nair", role: "Company Admin", body: "We need the SAML metadata endpoint for our Azure AD tenant.", timestamp: "2026-11-18T10:08:00" },
    ],
  },
  {
    id: "SUP-2834", subject: "Storage usage approaching plan limit", company: "Reliance Petrochem", requester: "Sneha Kapoor", priority: "Low", status: "Open", category: "Account", assignedTo: "Unassigned", createdAt: "2026-11-17T09:26:00", updatedAt: "2026-11-17T09:26:00",
    messages: [
      { id: "m1", author: "Sneha Kapoor", role: "Company Admin", body: "We are at 702 GB of 1 TB. Please share options to expand storage.", timestamp: "2026-11-17T09:26:00" },
    ],
  },
];

export const invoices: Invoice[] = [
  { id: "INV-2026-1062", company: "UltraTech Cement", plan: "Enterprise", amount: 109999, cycle: "Monthly", status: "Paid", issued: "2026-11-22" },
  { id: "INV-2026-1061", company: "Tata Steel Works", plan: "Enterprise", amount: 89999, cycle: "Monthly", status: "Paid", issued: "2026-11-21" },
  { id: "INV-2026-1060", company: "Mahindra Auto Components", plan: "Enterprise", amount: 109999, cycle: "Monthly", status: "Paid", issued: "2026-11-20" },
  { id: "INV-2026-1059", company: "Sun Pharma Labs", plan: "Growth", amount: 39999, cycle: "Monthly", status: "Overdue", issued: "2026-11-04", due: "2026-11-19" },
  { id: "INV-2026-1058", company: "Adani Renewables", plan: "Growth", amount: 39999, cycle: "Monthly", status: "Paid", issued: "2026-11-18" },
  { id: "INV-2026-1057", company: "Godrej Chemicals", plan: "Growth", amount: 39999, cycle: "Monthly", status: "Paid", issued: "2026-11-17" },
  { id: "INV-2026-1056", company: "Bharat Heavy Electricals", plan: "Enterprise", amount: 109999, cycle: "Monthly", status: "Pending", issued: "2026-11-15", due: "2026-11-30" },
  { id: "INV-2026-1055", company: "Reliance Petrochem", plan: "Enterprise", amount: 89999, cycle: "Monthly", status: "Paid", issued: "2026-11-14" },
  { id: "INV-2026-1054", company: "Larsen Infra Projects", plan: "Enterprise", amount: 863990, cycle: "Annual", status: "Paid", issued: "2026-11-12" },
  { id: "INV-2026-1053", company: "JSW Mining Division", plan: "Growth", amount: 39999, cycle: "Monthly", status: "Overdue", issued: "2026-10-30", due: "2026-11-14" },
  { id: "INV-2026-1052", company: "Apollo Hospitals Group", plan: "Growth", amount: 39999, cycle: "Monthly", status: "Paid", issued: "2026-11-10" },
  { id: "INV-2026-1051", company: "Vardhman Textiles", plan: "Starter", amount: 14999, cycle: "Monthly", status: "Paid", issued: "2026-11-09" },
];

export const auditLogs: AuditEntry[] = [
  { id: "AUD-9912", action: "company.published", actor: "priya.sharma@safex.app", target: "Suzuki Manufacturing", ip: "103.42.18.204", timestamp: "2026-11-22T14:12:00", severity: "info" },
  { id: "AUD-9911", action: "company.suspended", actor: "rahul.verma@safex.app", target: "JSW Mining Division", ip: "103.42.18.198", timestamp: "2026-11-22T11:05:00", severity: "warning" },
  { id: "AUD-9910", action: "addon.enabled", actor: "priya.sharma@safex.app", target: "Adani Renewables · Email Integration", ip: "103.42.18.204", timestamp: "2026-11-22T10:22:00", severity: "info" },
  { id: "AUD-9909", action: "domain.connected", actor: "priya.sharma@safex.app", target: "safety.tatasteelworks.in", ip: "103.42.18.204", timestamp: "2026-11-22T12:30:00", severity: "info" },
  { id: "AUD-9908", action: "limits.updated", actor: "priya.sharma@safex.app", target: "Bharat Heavy Electricals · maxUsers", ip: "103.42.18.204", timestamp: "2026-11-21T18:14:00", severity: "info" },
  { id: "AUD-9907", action: "admin.password_reset", actor: "rahul.verma@safex.app", target: "Blue Dart Logistics · Meera Krishnan", ip: "103.42.18.198", timestamp: "2026-11-21T14:26:00", severity: "warning" },
  { id: "AUD-9906", action: "auth.failed_attempt", actor: "unknown", target: "admin@safex.app", ip: "45.88.201.13", timestamp: "2026-11-21T03:12:00", severity: "critical" },
  { id: "AUD-9905", action: "plan.upgraded", actor: "priya.sharma@safex.app", target: "Mahindra Auto Components · Enterprise", ip: "103.42.18.204", timestamp: "2026-11-20T16:45:00", severity: "info" },
  { id: "AUD-9904", action: "invoice.marked_paid", actor: "meera.iyer@safex.app", target: "INV-2026-1054", ip: "103.42.18.177", timestamp: "2026-11-20T11:02:00", severity: "info" },
  { id: "AUD-9903", action: "smtp.settings_updated", actor: "admin@safex.app", target: "System SMTP", ip: "103.42.18.100", timestamp: "2026-11-19T19:30:00", severity: "warning" },
];

export const loginHistory: LoginRecord[] = [
  { id: "log_1", device: "MacBook Pro · Chrome 142", browser: "Chrome", ip: "103.42.18.204", location: "Bengaluru, IN", timestamp: "2026-11-22T09:14:00", status: "Success", current: true },
  { id: "log_2", device: "iPhone 16 Pro · Safari", browser: "Safari", ip: "49.207.18.62", location: "Bengaluru, IN", timestamp: "2026-11-21T20:48:00", status: "Success" },
  { id: "log_3", device: "Windows 11 · Edge 142", browser: "Edge", ip: "103.42.18.209", location: "Mumbai, IN", timestamp: "2026-11-20T11:02:00", status: "Success" },
  { id: "log_4", device: "Unknown device", browser: "Chrome", ip: "45.88.201.13", location: "Frankfurt, DE", timestamp: "2026-11-19T03:12:00", status: "Failed" },
  { id: "log_5", device: "MacBook Pro · Chrome 142", browser: "Chrome", ip: "103.42.18.204", location: "Bengaluru, IN", timestamp: "2026-11-18T08:55:00", status: "Success" },
];

export const currentUser = {
  name: "Priya Sharma",
  role: "Super Admin",
  email: "priya.sharma@safex.app",
  initials: "PS",
  phone: "+91 98450 22114",
  timezone: "Asia/Kolkata",
  lastLogin: "2026-11-22T09:14:00",
  joined: "2023-04-12",
};

export const notifications = [
  { id: "n1", title: "Invoice overdue", body: "Sun Pharma Labs has an overdue invoice of ₹39,999.", time: "12m ago", unread: true, type: "billing" },
  { id: "n2", title: "Storage limit reached", body: "Bharat Heavy Electricals is at 94% of storage.", time: "48m ago", unread: true, type: "warning" },
  { id: "n3", title: "New support ticket", body: "SUP-2841 marked urgent by Sun Pharma Labs.", time: "2h ago", unread: true, type: "support" },
  { id: "n4", title: "Domain verified", body: "safety.tatasteelworks.in SSL is active.", time: "3h ago", unread: false, type: "domain" },
  { id: "n5", title: "Trial ending soon", body: "Blue Dart Logistics trial ends in 4 days.", time: "5h ago", unread: false, type: "company" },
];

export const paymentGateways = [
  { id: "razorpay", name: "Razorpay", description: "Cards, UPI, netbanking and subscriptions for India.", status: "Connected", mode: "Live", lastSync: "2026-11-22T08:00:00" },
  { id: "stripe", name: "Stripe", description: "International cards and multi-currency billing.", status: "Connected", mode: "Test", lastSync: "2026-11-21T22:30:00" },
  { id: "payu", name: "PayU", description: "Enterprise invoicing and pay-later options.", status: "Not connected", mode: "—", lastSync: "—" },
];

export const smtpConfig = {
  host: "smtp.postmarkapp.com",
  port: "587",
  username: "safex-prod",
  fromName: "SAFEX Platform",
  fromEmail: "no-reply@safex.app",
  encryption: "TLS",
  status: "Verified",
};

export const whatsappConfig = {
  provider: "Meta Cloud API",
  phoneNumberId: "109283746510293",
  businessName: "SAFEX Technologies",
  templateCount: 14,
  status: "Connected",
  quality: "High",
};
