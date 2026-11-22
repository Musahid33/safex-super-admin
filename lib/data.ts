export type CompanyStatus = "Active" | "Trial" | "Suspended" | "Draft" | "Archived";
export type Plan = "Starter" | "Professional" | "Enterprise";
export type Company = {
  id: string;
  name: string;
  shortName: string;
  industry: string;
  sub: string;
  admin: string;
  email: string;
  plan: Plan;
  billing: "Monthly" | "Yearly";
  addons: string[];
  users: number;
  activeUsers: number;
  employees: number;
  locations: number;
  storage: number;
  storageUsed: number;
  expiry: string;
  status: CompanyStatus;
  health: "Healthy" | "Attention" | "At risk";
};

export const companies: Company[] = [
  { id:"sfx-1024", name:"Emveess Infraventures", shortName:"Emveess", industry:"Construction", sub:"emveess", admin:"Musahid Alam", email:"admin@emveess.com", plan:"Enterprise", billing:"Yearly", addons:["Asset Management","Email Integration"], users:320, activeUsers:268, employees:1240, locations:8, storage:200, storageUsed:146, expiry:"2027-03-31", status:"Active", health:"Healthy" },
  { id:"sfx-1023", name:"Tata Steel West Bokaro", shortName:"Tata Steel", industry:"Steel", sub:"tata-westbokaro", admin:"R. Singh", email:"admin@tatasteel.com", plan:"Enterprise", billing:"Yearly", addons:["Asset Management","Salary Slip","Email Integration"], users:1800, activeUsers:1420, employees:6240, locations:12, storage:500, storageUsed:382, expiry:"2027-01-15", status:"Active", health:"Healthy" },
  { id:"sfx-1022", name:"Jharkhand Mining Co.", shortName:"JMC", industry:"Mining", sub:"jharkhand-mining", admin:"A. Kumar", email:"admin@jmc.in", plan:"Professional", billing:"Monthly", addons:["Email Integration"], users:150, activeUsers:88, employees:520, locations:3, storage:100, storageUsed:84, expiry:"2026-12-10", status:"Trial", health:"Attention" },
  { id:"sfx-1021", name:"Ramgarh Logistics", shortName:"Ramgarh", industry:"Logistics", sub:"ramgarh-logistics", admin:"S. Devi", email:"admin@ramgarhlogistics.in", plan:"Starter", billing:"Monthly", addons:[], users:60, activeUsers:0, employees:92, locations:2, storage:50, storageUsed:12, expiry:"2026-11-02", status:"Suspended", health:"At risk" },
  { id:"sfx-1020", name:"Bokaro Fabricators", shortName:"Bokaro", industry:"Manufacturing", sub:"bokaro-fab", admin:"P. Sharma", email:"admin@bokarofab.in", plan:"Professional", billing:"Yearly", addons:["Asset Management"], users:220, activeUsers:184, employees:860, locations:5, storage:100, storageUsed:41, expiry:"2027-06-30", status:"Active", health:"Healthy" },
  { id:"sfx-1019", name:"Eastern Coalfields", shortName:"ECF", industry:"Mining", sub:"eastern-coalfields", admin:"A. Das", email:"admin@ecf.co.in", plan:"Enterprise", billing:"Yearly", addons:["Asset Management","Salary Slip"], users:900, activeUsers:640, employees:3450, locations:9, storage:400, storageUsed:310, expiry:"2027-04-18", status:"Active", health:"Attention" },
  { id:"sfx-1018", name:"Patna Infrastructure Group", shortName:"PIG", industry:"Construction", sub:"patna-infra", admin:"N. Verma", email:"admin@patnainfra.in", plan:"Starter", billing:"Monthly", addons:[], users:85, activeUsers:57, employees:310, locations:4, storage:50, storageUsed:16, expiry:"2026-12-28", status:"Active", health:"Healthy" },
  { id:"sfx-1017", name:"Northstar Manufacturing", shortName:"Northstar", industry:"Manufacturing", sub:"northstar-mfg", admin:"M. Joseph", email:"it@northstarmfg.com", plan:"Professional", billing:"Monthly", addons:["Email Integration"], users:320, activeUsers:210, employees:1240, locations:6, storage:150, storageUsed:138, expiry:"2026-12-01", status:"Active", health:"Attention" },
  { id:"sfx-1016", name:"Ganga Ports & Terminals", shortName:"Ganga Ports", industry:"Logistics", sub:"ganga-ports", admin:"K. Prasad", email:"admin@gangaports.in", plan:"Enterprise", billing:"Yearly", addons:["Asset Management","Email Integration"], users:1200, activeUsers:954, employees:4820, locations:7, storage:500, storageUsed:202, expiry:"2027-08-09", status:"Active", health:"Healthy" },
  { id:"sfx-1015", name:"Apex Cement Works", shortName:"Apex Cement", industry:"Manufacturing", sub:"apex-cement", admin:"V. Gupta", email:"admin@apexcement.in", plan:"Professional", billing:"Monthly", addons:["Salary Slip"], users:180, activeUsers:113, employees:690, locations:3, storage:100, storageUsed:52, expiry:"2027-02-12", status:"Active", health:"Healthy" },
];

export const baseFeatures = ["Dashboard","Employee Management","Employee Safety Passport","Near Miss","Hazard","Safety Observation","Training","TBT","Audit","Incident","CAPA","CSMS Drive","Reports","Emergency Contacts","Notice Board","Settings"];
export const addonCatalog = [
  { name:"Asset Management", price:249, description:"Track assets, inspections and maintenance." },
  { name:"Salary Slip", price:199, description:"Secure employee payslip distribution." },
  { name:"Email Integration", price:0, description:"Connect alerts and workflows to email." },
];
export const tickets = [
  { id:"SFX-2841", subject:"Custom domain SSL pending verification", company:"Tata Steel West Bokaro", priority:"High", status:"Open", assignee:"Anita Sharma", updated:"12 min ago" },
  { id:"SFX-2839", subject:"Bulk employee import validation", company:"Eastern Coalfields", priority:"Critical", status:"In progress", assignee:"Rohit Kumar", updated:"48 min ago" },
  { id:"SFX-2836", subject:"Invoice GST details correction", company:"Apex Cement Works", priority:"Normal", status:"Waiting", assignee:"Anita Sharma", updated:"2 hours ago" },
  { id:"SFX-2831", subject:"Unable to access archived reports", company:"Northstar Manufacturing", priority:"Low", status:"Resolved", assignee:"Dev Patel", updated:"Yesterday" },
];
export const activities = [
  { title:"Tata Steel West Bokaro upgraded to Enterprise", detail:"Subscription · by you", time:"10 min ago", type:"plan" },
  { title:"New company workspace created", detail:"Bokaro Fabricators · by Anita Sharma", time:"1 hour ago", type:"company" },
  { title:"Asset Management enabled", detail:"Eastern Coalfields · by you", time:"3 hours ago", type:"addon" },
  { title:"Payment received · ₹49,999", detail:"Emveess Infraventures · invoice #INV-2481", time:"Yesterday", type:"payment" },
];
export const revenue = [
  { month:"Jun", revenue:12.4, companies:78, addons:1.8 }, { month:"Jul", revenue:13.8, companies:84, addons:2.1 },
  { month:"Aug", revenue:14.1, companies:91, addons:2.5 }, { month:"Sep", revenue:16.7, companies:99, addons:2.8 },
  { month:"Oct", revenue:17.2, companies:108, addons:3.1 }, { month:"Nov", revenue:19.6, companies:118, addons:3.8 },
];
export const plans = [{ name:"Starter", value:38 }, { name:"Professional", value:52 }, { name:"Enterprise", value:28 }];
