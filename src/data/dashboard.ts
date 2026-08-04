export interface TuitionRequest {
  id: string;
  studentName: string;
  subject: string;
  classLevel: string;
  location: string;
  salary: number;
  mode: "Home" | "Online" | "Both";
  frequency: string;
  status: "Pending" | "Accepted" | "Declined";
  date: string;
}

export interface ActiveTuition {
  id: string;
  studentName: string;
  subject: string;
  classLevel: string;
  location: string;
  salary: number;
  mode: "Home" | "Online" | "Both";
  frequency: string;
  status: "Active" | "Completed" | "Suspended";
  progress: string;
  startDate: string;
  nextSession: string;
}

export interface Payout {
  id: string;
  amount: number;
  status: "Paid" | "Processing" | "Failed";
  date: string;
  method: string;
  description: string;
}

export const MOCK_REQUESTS: TuitionRequest[] = [
  {
    id: "req-1",
    studentName: "Adnan Chowdhury",
    subject: "Chemistry & Biology",
    classLevel: "HSC (1st Year)",
    location: "Gulshan, Dhaka",
    salary: 8000,
    mode: "Home",
    frequency: "3 Days / Week",
    status: "Pending",
    date: "Aug 02, 2026"
  },
  {
    id: "req-2",
    studentName: "Maliha Islam",
    subject: "General Mathematics",
    classLevel: "Class 9",
    location: "Banani, Dhaka",
    salary: 6000,
    mode: "Online",
    frequency: "3 Days / Week",
    status: "Pending",
    date: "Jul 31, 2026"
  },
  {
    id: "req-3",
    studentName: "Taseen Rahman",
    subject: "Physics",
    classLevel: "HSC (2nd Year)",
    location: "Uttara, Dhaka",
    salary: 7500,
    mode: "Home",
    frequency: "3 Days / Week",
    status: "Pending",
    date: "Jul 29, 2026"
  }
];

export const MOCK_ACTIVE_TUITIONS: ActiveTuition[] = [
  {
    id: "act-1",
    studentName: "Sakib Rahman",
    subject: "Mathematics & Physics",
    classLevel: "SSC (Class 10)",
    location: "Dhanmondi, Dhaka",
    salary: 5000,
    mode: "Both",
    frequency: "3 Days / Week",
    status: "Active",
    progress: "Trigonometry & Optics completed. Preparing for half-yearly model test.",
    startDate: "Jan 15, 2026",
    nextSession: "Today at 5:00 PM"
  },
  {
    id: "act-2",
    studentName: "Zara Tabassum",
    subject: "Chemistry",
    classLevel: "HSC (1st Year)",
    location: "Gulshan, Dhaka",
    salary: 8000,
    mode: "Home",
    frequency: "3 Days / Week",
    status: "Active",
    progress: "Chemical Bonds completed. Started Organic Chemistry basic concepts.",
    startDate: "Mar 01, 2026",
    nextSession: "Tomorrow at 4:30 PM"
  },
  {
    id: "act-3",
    studentName: "Fahim Shahriar",
    subject: "ICT",
    classLevel: "HSC (2nd Year)",
    location: "Mirpur, Dhaka",
    salary: 5500,
    mode: "Online",
    frequency: "2 Days / Week",
    status: "Active",
    progress: "HTML & CSS completed. Currently teaching C programming syntax.",
    startDate: "May 10, 2026",
    nextSession: "Thursday at 7:00 PM"
  }
];

export const MOCK_PAYOUTS: Payout[] = [
  {
    id: "pay-1",
    amount: 5000,
    status: "Paid",
    date: "Aug 02, 2026",
    method: "bKash",
    description: "July Tuition Fee - Sakib Rahman"
  },
  {
    id: "pay-2",
    amount: 8000,
    status: "Paid",
    date: "Aug 01, 2026",
    method: "Bank Transfer (DBBL)",
    description: "July Tuition Fee - Zara Tabassum"
  },
  {
    id: "pay-3",
    amount: 5500,
    status: "Paid",
    date: "Aug 01, 2026",
    method: "bKash",
    description: "July Tuition Fee - Fahim Shahriar"
  },
  {
    id: "pay-4",
    amount: 5000,
    status: "Paid",
    date: "Jul 02, 2026",
    method: "bKash",
    description: "June Tuition Fee - Sakib Rahman"
  },
  {
    id: "pay-5",
    amount: 8000,
    status: "Paid",
    date: "Jul 01, 2026",
    method: "Bank Transfer (DBBL)",
    description: "June Tuition Fee - Zara Tabassum"
  }
];
