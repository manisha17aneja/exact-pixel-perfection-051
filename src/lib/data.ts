export type Tone = "success" | "warning" | "danger" | "info" | "neutral";

export const statusTone: Record<string, Tone> = {
  New: "info", Contacted: "neutral", Qualified: "success", Lost: "danger", Negotiation: "warning",
  Active: "success", Inactive: "neutral", "On hold": "warning",
  "In transit": "info", Delivered: "success", Delayed: "danger", Booked: "neutral", Loading: "warning",
  Available: "success", "On trip": "info", Maintenance: "warning",
  Paid: "success", Pending: "warning", Overdue: "danger", Draft: "neutral",
};

export const leads = [
  { id: "LD-1042", name: "Rohit Mehra", company: "Mehra Agro Exports", source: "Website", route: "Ludhiana → Mumbai", value: 185000, status: "New", owner: "Ankit S." },
  { id: "LD-1041", name: "Priya Nair", company: "Coastline Pharma", source: "Referral", route: "Kochi → Delhi", value: 420000, status: "Qualified", owner: "Neha R." },
  { id: "LD-1040", name: "Sandeep Gill", company: "Gill Steel Works", source: "Cold call", route: "Jamshedpur → Pune", value: 760000, status: "Negotiation", owner: "Ankit S." },
  { id: "LD-1039", name: "Farah Khan", company: "Urban Retail Co.", source: "LinkedIn", route: "Delhi → Jaipur", value: 95000, status: "Contacted", owner: "Vikas T." },
  { id: "LD-1038", name: "Arjun Rao", company: "Deccan Textiles", source: "Website", route: "Surat → Chennai", value: 310000, status: "Lost", owner: "Neha R." },
  { id: "LD-1037", name: "Kavita Joshi", company: "FreshFarm Foods", source: "Trade show", route: "Nashik → Kolkata", value: 540000, status: "Qualified", owner: "Vikas T." },
  { id: "LD-1036", name: "Imran Sheikh", company: "Sheikh Electricals", source: "Referral", route: "Ahmedabad → Indore", value: 128000, status: "New", owner: "Ankit S." },
];

export const customers = [
  { id: "CU-210", name: "Coastline Pharma", contact: "Priya Nair", city: "Kochi", shipments: 48, revenue: 3820000, outstanding: 240000, status: "Active" },
  { id: "CU-209", name: "Gill Steel Works", contact: "Sandeep Gill", city: "Jamshedpur", shipments: 112, revenue: 9150000, outstanding: 0, status: "Active" },
  { id: "CU-208", name: "FreshFarm Foods", contact: "Kavita Joshi", city: "Nashik", shipments: 31, revenue: 1640000, outstanding: 185000, status: "Active" },
  { id: "CU-207", name: "Urban Retail Co.", contact: "Farah Khan", city: "Delhi", shipments: 9, revenue: 410000, outstanding: 62000, status: "On hold" },
  { id: "CU-206", name: "Deccan Textiles", contact: "Arjun Rao", city: "Surat", shipments: 67, revenue: 4270000, outstanding: 0, status: "Inactive" },
  { id: "CU-205", name: "Bharat Cement Ltd.", contact: "Mohan Das", city: "Raipur", shipments: 154, revenue: 12400000, outstanding: 910000, status: "Active" },
];

export const shipments = [
  { id: "SH-58213", customer: "Gill Steel Works", origin: "Jamshedpur", dest: "Pune", vehicle: "MH12 AB 4521", driver: "Ramesh Yadav", eta: "Oct 3, 18:00", weight: "24 t", status: "In transit", progress: 62 },
  { id: "SH-58212", customer: "Coastline Pharma", origin: "Kochi", dest: "Delhi", vehicle: "KL07 CD 9910", driver: "Suresh Pillai", eta: "Oct 5, 09:00", weight: "8 t", status: "In transit", progress: 28 },
  { id: "SH-58211", customer: "Bharat Cement Ltd.", origin: "Raipur", dest: "Nagpur", vehicle: "CG04 EF 3302", driver: "Ajay Verma", eta: "Oct 2, 14:30", weight: "30 t", status: "Delayed", progress: 71 },
  { id: "SH-58210", customer: "FreshFarm Foods", origin: "Nashik", dest: "Kolkata", vehicle: "MH15 GH 7788", driver: "Prakash Jadhav", eta: "Oct 4, 22:00", weight: "12 t", status: "Loading", progress: 5 },
  { id: "SH-58209", customer: "Urban Retail Co.", origin: "Delhi", dest: "Jaipur", vehicle: "DL01 JK 1204", driver: "Manoj Kumar", eta: "Oct 1, 16:00", weight: "4 t", status: "Delivered", progress: 100 },
  { id: "SH-58208", customer: "Bharat Cement Ltd.", origin: "Raipur", dest: "Hyderabad", vehicle: "—", driver: "—", eta: "Oct 6, 12:00", weight: "28 t", status: "Booked", progress: 0 },
];

export const vehicles = [
  { reg: "MH12 AB 4521", type: "32 ft MXL", capacity: "24 t", driver: "Ramesh Yadav", location: "Near Nagpur", service: "Nov 12", status: "On trip" },
  { reg: "KL07 CD 9910", type: "Reefer 24 ft", capacity: "10 t", driver: "Suresh Pillai", location: "Bengaluru bypass", service: "Oct 28", status: "On trip" },
  { reg: "CG04 EF 3302", type: "Trailer 40 ft", capacity: "32 t", driver: "Ajay Verma", location: "Bhandara", service: "Oct 9", status: "On trip" },
  { reg: "DL01 JK 1204", type: "19 ft Container", capacity: "6 t", driver: "Manoj Kumar", location: "Jaipur hub", service: "Dec 2", status: "Available" },
  { reg: "MH15 GH 7788", type: "Reefer 32 ft", capacity: "14 t", driver: "Prakash Jadhav", location: "Nashik yard", service: "Nov 20", status: "Available" },
  { reg: "GJ01 LM 5566", type: "Trailer 40 ft", capacity: "32 t", driver: "—", location: "Ahmedabad workshop", service: "Due now", status: "Maintenance" },
];

export const invoices = [
  { id: "INV-3391", customer: "Bharat Cement Ltd.", shipment: "SH-58190", issued: "Sep 18", due: "Oct 3", amount: 910000, status: "Pending" },
  { id: "INV-3390", customer: "Coastline Pharma", shipment: "SH-58184", issued: "Sep 10", due: "Sep 25", amount: 240000, status: "Overdue" },
  { id: "INV-3389", customer: "Gill Steel Works", shipment: "SH-58180", issued: "Sep 8", due: "Sep 23", amount: 612000, status: "Paid" },
  { id: "INV-3388", customer: "FreshFarm Foods", shipment: "SH-58177", issued: "Sep 5", due: "Sep 20", amount: 185000, status: "Overdue" },
  { id: "INV-3387", customer: "Urban Retail Co.", shipment: "SH-58209", issued: "Oct 1", due: "Oct 16", amount: 62000, status: "Draft" },
  { id: "INV-3386", customer: "Deccan Textiles", shipment: "SH-58170", issued: "Aug 30", due: "Sep 14", amount: 338000, status: "Paid" },
];

export const revenueTrend = [
  { m: "Apr", revenue: 42, expense: 31 }, { m: "May", revenue: 48, expense: 33 },
  { m: "Jun", revenue: 45, expense: 34 }, { m: "Jul", revenue: 56, expense: 38 },
  { m: "Aug", revenue: 61, expense: 40 }, { m: "Sep", revenue: 68, expense: 43 },
];

export const inr = (n: number) =>
  "₹" + (n >= 100000 ? (n / 100000).toFixed(n >= 1000000 ? 1 : 2) + " L" : n.toLocaleString("en-IN"));
