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

Object.assign(statusTone, { Sent: "info", Accepted: "success", Rejected: "danger", Confirmed: "success", Cancelled: "danger", Scheduled: "info", Done: "success", Today: "warning", Planned: "neutral", Completed: "success", Approved: "success", Submitted: "warning", Admin: "info", Manager: "neutral", Dispatcher: "neutral", Accountant: "neutral" });

export const contacts = [
  { id: "CT-501", name: "Priya Nair", role: "Logistics Head", company: "Coastline Pharma", phone: "+91 98470 11223", email: "priya@coastline.in" },
  { id: "CT-502", name: "Sandeep Gill", role: "Owner", company: "Gill Steel Works", phone: "+91 98150 44567", email: "sandeep@gillsteel.com" },
  { id: "CT-503", name: "Kavita Joshi", role: "Supply Chain Mgr", company: "FreshFarm Foods", phone: "+91 98220 77881", email: "kavita@freshfarm.in" },
  { id: "CT-504", name: "Mohan Das", role: "Procurement", company: "Bharat Cement Ltd.", phone: "+91 94252 33190", email: "mohan@bharatcement.com" },
  { id: "CT-505", name: "Farah Khan", role: "Ops Manager", company: "Urban Retail Co.", phone: "+91 98110 55602", email: "farah@urbanretail.in" },
];
export const followups = [
  { id: "FU-81", subject: "Rate revision call", with: "Gill Steel Works", due: "Today, 15:00", owner: "Ankit S.", status: "Today" },
  { id: "FU-80", subject: "Send reefer quote", with: "FreshFarm Foods", due: "Oct 3", owner: "Vikas T.", status: "Scheduled" },
  { id: "FU-79", subject: "Payment reminder INV-3390", with: "Coastline Pharma", due: "Today, 11:00", owner: "Neha R.", status: "Today" },
  { id: "FU-78", subject: "Contract renewal meeting", with: "Bharat Cement Ltd.", due: "Oct 7", owner: "Manisha A.", status: "Scheduled" },
  { id: "FU-77", subject: "Feedback after delivery", with: "Urban Retail Co.", due: "Oct 1", owner: "Vikas T.", status: "Done" },
];
export const quotations = [
  { id: "QT-2207", customer: "Gill Steel Works", lane: "Jamshedpur → Pune", vehicle: "32 ft MXL", amount: 148000, valid: "Oct 10", status: "Sent" },
  { id: "QT-2206", customer: "FreshFarm Foods", lane: "Nashik → Kolkata", vehicle: "Reefer 32 ft", amount: 212000, valid: "Oct 8", status: "Draft" },
  { id: "QT-2205", customer: "Coastline Pharma", lane: "Kochi → Delhi", vehicle: "Reefer 24 ft", amount: 186000, valid: "Oct 5", status: "Accepted" },
  { id: "QT-2204", customer: "Deccan Textiles", lane: "Surat → Chennai", vehicle: "32 ft MXL", amount: 132000, valid: "Sep 30", status: "Rejected" },
  { id: "QT-2203", customer: "Bharat Cement Ltd.", lane: "Raipur → Hyderabad", vehicle: "Trailer 40 ft", amount: 165000, valid: "Oct 12", status: "Accepted" },
];
export const bookings = [
  { id: "BK-9031", customer: "Bharat Cement Ltd.", lane: "Raipur → Hyderabad", pickup: "Oct 4, 08:00", material: "Cement bags", weight: "28 t", status: "Confirmed" },
  { id: "BK-9030", customer: "FreshFarm Foods", lane: "Nashik → Kolkata", pickup: "Oct 2, 06:00", material: "Grapes (chilled)", weight: "12 t", status: "Confirmed" },
  { id: "BK-9029", customer: "Coastline Pharma", lane: "Kochi → Delhi", pickup: "Sep 30, 10:00", material: "Medicines", weight: "8 t", status: "Completed" },
  { id: "BK-9028", customer: "Urban Retail Co.", lane: "Delhi → Lucknow", pickup: "Oct 6, 09:00", material: "Apparel cartons", weight: "5 t", status: "Pending" },
  { id: "BK-9027", customer: "Deccan Textiles", lane: "Surat → Chennai", pickup: "Sep 28, 07:00", material: "Fabric rolls", weight: "18 t", status: "Cancelled" },
];
export const trips = [
  { id: "TR-4412", route: "Jamshedpur → Pune", km: 1640, vehicle: "MH12 AB 4521", driver: "Ramesh Yadav", start: "Sep 30", fuel: 52000, status: "In transit" },
  { id: "TR-4411", route: "Kochi → Delhi", km: 2690, vehicle: "KL07 CD 9910", driver: "Suresh Pillai", start: "Oct 1", fuel: 86000, status: "In transit" },
  { id: "TR-4410", route: "Raipur → Nagpur", km: 290, vehicle: "CG04 EF 3302", driver: "Ajay Verma", start: "Oct 1", fuel: 11000, status: "Delayed" },
  { id: "TR-4409", route: "Delhi → Jaipur", km: 280, vehicle: "DL01 JK 1204", driver: "Manoj Kumar", start: "Oct 1", fuel: 8200, status: "Completed" },
  { id: "TR-4408", route: "Raipur → Hyderabad", km: 780, vehicle: "—", driver: "—", start: "Oct 4", fuel: 0, status: "Planned" },
];
export const expenses = [
  { id: "EX-711", date: "Oct 1", category: "Fuel", trip: "TR-4411", vendor: "IOCL Thrissur", amount: 38400, status: "Approved" },
  { id: "EX-710", date: "Oct 1", category: "Toll", trip: "TR-4412", vendor: "FASTag", amount: 6200, status: "Approved" },
  { id: "EX-709", date: "Sep 30", category: "Repair", trip: "—", vendor: "Shree Auto Works", amount: 42500, status: "Submitted" },
  { id: "EX-708", date: "Sep 30", category: "Driver allowance", trip: "TR-4410", vendor: "Ajay Verma", amount: 3000, status: "Submitted" },
  { id: "EX-707", date: "Sep 29", category: "Loading labour", trip: "TR-4409", vendor: "Delhi Hub Crew", amount: 4500, status: "Rejected" },
];
export const team = [
  { id: "U-1", name: "Manisha Aneja", email: "manisha@haulwise.in", role: "Admin", status: "Active" },
  { id: "U-2", name: "Ankit Sharma", email: "ankit@haulwise.in", role: "Manager", status: "Active" },
  { id: "U-3", name: "Neha Rao", email: "neha@haulwise.in", role: "Accountant", status: "Active" },
  { id: "U-4", name: "Vikas Thakur", email: "vikas@haulwise.in", role: "Dispatcher", status: "Inactive" },
];
