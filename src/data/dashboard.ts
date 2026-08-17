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

export interface MessageReactionItem {
  id?: string;
  userId: string;
  emoji: string;
}

export interface ChatMessage {
  id: string;
  sender: "tutor" | "student";
  content: string;
  time: string;
  createdAt?: string | Date;
  isRead?: boolean;
  reactions?: MessageReactionItem[];
}

export interface ChatContact {
  id: string;
  recipientId?: string;
  studentName: string;
  role?: string;
  avatarBg: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isBlocked?: boolean;
  blockedById?: string;
  messages: ChatMessage[];
}

export const MOCK_CHATS: ChatContact[] = [
  {
    id: "chat-1",
    studentName: "Zara Tabassum",
    avatarBg: "bg-purple-500",
    lastMessage: "Sir, next class key offline hobe nki online?",
    time: "8:30 PM",
    unreadCount: 1,
    messages: [
      { id: "m1", sender: "student", content: "Assalamu Alaikum Sir, chemistry assignment ti ready korechi.", time: "4:00 PM" },
      { id: "m2", sender: "tutor", content: "Walaikum Assalamu Zara. assignment er photo pathao, ami check kore dicchi.", time: "4:15 PM" },
      { id: "m3", sender: "student", content: "Sir, details upload korechi drive link a.", time: "5:00 PM" },
      { id: "m4", sender: "tutor", content: "Ami dekhlam, organic structure clear ache. keep it up.", time: "5:30 PM" },
      { id: "m5", sender: "student", content: "Sir, next class key offline hobe nki online?", time: "8:30 PM" }
    ]
  },
  {
    id: "chat-2",
    studentName: "Sakib Rahman",
    avatarBg: "bg-blue-500",
    lastMessage: "Sure Sir, dynamic routing clear built-in chat setup dynamic.",
    time: "Yesterday",
    unreadCount: 0,
    messages: [
      { id: "m6", sender: "tutor", content: "Sakib, today's math session starts at 5:00 PM.", time: "Yesterday" },
      { id: "m7", sender: "student", content: "Yes Sir, I am prepared with the formula sheets.", time: "Yesterday" },
      { id: "m8", sender: "tutor", content: "Good. We will practice trigonometry proofs today.", time: "Yesterday" },
      { id: "m9", sender: "student", content: "Sure Sir, dynamic routing clear built-in chat setup dynamic.", time: "Yesterday" }
    ]
  },
  {
    id: "chat-3",
    studentName: "Fahim Shahriar",
    avatarBg: "bg-orange-500",
    lastMessage: "Okay sir, thursday 7 pm a class hobe.",
    time: "Aug 02",
    unreadCount: 0,
    messages: [
      { id: "m10", sender: "student", content: "Sir, C programming er loop concepts niye problem hocche.", time: "Aug 02" },
      { id: "m11", sender: "tutor", content: "Worry not Fahim. We will solve 5 examples in the next class.", time: "Aug 02" },
      { id: "m12", sender: "student", content: "Okay sir, thursday 7 pm a class hobe.", time: "Aug 02" }
    ]
  }
];

export interface TuitionPost {
  id: string;
  classLevel: string;
  subjects: string[];
  budget: number;
  mode: "Home" | "Online" | "Both";
  frequency: string;
  location: string;
  genderPreference?: string;
  tutorQualification?: string;
  extraNotes?: string;
  status: "Active" | "Paused" | "Closed";
  date: string;
}

export interface TutorApplication {
  id: string;
  postId?: string;
  tutorId: string;
  tutorName: string;
  institution: string;
  subject: string;
  rating: number;
  salaryBid: number;
  avatarBg: string;
  location?: string;
  appliedDate?: string;
  status: "Pending" | "Shortlisted" | "Hired" | "Rejected";
}

export interface Invoice {
  id: string;
  amount: number;
  status: "Paid" | "Unpaid" | "Overdue";
  date: string;
  method: string;
  description: string;
  billingMonth: string;
}

export const MOCK_TUITION_POSTS: TuitionPost[] = [
  {
    id: "post-1",
    classLevel: "Class 10 (SSC)",
    subjects: ["Mathematics", "Higher Mathematics"],
    budget: 5000,
    mode: "Both",
    frequency: "3 Days / Week",
    location: "Dhanmondi, Dhaka",
    status: "Active",
    date: "Jul 10, 2026"
  },
  {
    id: "post-2",
    classLevel: "Class 8 (JSC)",
    subjects: ["English", "General Science"],
    budget: 4500,
    mode: "Home",
    frequency: "3 Days / Week",
    location: "Dhanmondi, Dhaka",
    status: "Paused",
    date: "Jun 15, 2026"
  }
];

export const MOCK_TUTOR_APPLICATIONS: TutorApplication[] = [
  {
    id: "app-1",
    tutorId: "5",
    tutorName: "Saiful Islam",
    institution: "BUET • Electrical Engineering",
    subject: "Mathematics & Physics",
    rating: 4.8,
    salaryBid: 5500,
    avatarBg: "bg-emerald-600",
    location: "Mirpur, Dhaka",
    appliedDate: "Today, 4:30 PM",
    status: "Pending"
  },
  {
    id: "app-2",
    tutorId: "4",
    tutorName: "Farhana Akter",
    institution: "Dhaka University • Chemistry",
    subject: "Chemistry & Biology",
    rating: 5.0,
    salaryBid: 5000,
    avatarBg: "bg-rose-600",
    location: "Gulshan, Dhaka",
    appliedDate: "Yesterday",
    status: "Pending"
  },
  {
    id: "app-3",
    tutorId: "1",
    tutorName: "Ahsan Habib",
    institution: "Dhaka University • Mathematics",
    subject: "Higher Mathematics & Statistics",
    rating: 4.9,
    salaryBid: 4500,
    avatarBg: "bg-indigo-600",
    location: "Dhanmondi, Dhaka",
    appliedDate: "2 days ago",
    status: "Pending"
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    amount: 5000,
    status: "Paid",
    date: "Aug 02, 2026",
    method: "bKash",
    description: "Tuition Fee - Sakib Rahman",
    billingMonth: "July 2026"
  },
  {
    id: "inv-2",
    amount: 8000,
    status: "Paid",
    date: "Aug 01, 2026",
    method: "Bank Transfer (DBBL)",
    description: "Tuition Fee - Zara Tabassum",
    billingMonth: "July 2026"
  },
  {
    id: "inv-3",
    amount: 5500,
    status: "Paid",
    date: "Aug 01, 2026",
    method: "bKash",
    description: "Tuition Fee - Fahim Shahriar",
    billingMonth: "July 2026"
  },
  {
    id: "inv-4",
    amount: 5000,
    status: "Paid",
    date: "Jul 02, 2026",
    method: "bKash",
    description: "Tuition Fee - Sakib Rahman",
    billingMonth: "June 2026"
  }
];
