export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "tutor" | "admin";
  status: "active" | "inactive" | "blocked";
  mobile: string;
  isVerified: boolean;
  joinedDate: string;
}

export interface TutorVerification {
  id: string;
  tutorName: string;
  email: string;
  institution: string;
  department: string;
  yearOfStudy: string;
  subjects: string[];
  certificateUrl: string;
  nidCardUrl: string;
  status: "Pending" | "Approved" | "Rejected";
  submissionDate: string;
}

export interface AdminTuitionPost {
  id: string;
  studentName: string;
  classLevel: string;
  subjects: string[];
  budget: number;
  mode: "Home" | "Online" | "Both";
  frequency: string;
  location: string;
  status: "Active" | "Paused" | "Closed";
  createdAt: string;
}

export interface AdminTransaction {
  id: string;
  userName: string;
  userRole: "student" | "tutor";
  amount: number;
  type: "Invoice Payment" | "Tutor Payout";
  status: "Success" | "Pending" | "Failed";
  date: string;
  method: "bKash" | "Nagad" | "Bank Transfer" | "Card";
  reference: string;
}

export interface AdminSettings {
  platformFeePercent: number;
  maintenanceMode: boolean;
  supportEmail: string;
  smsGatewayActive: boolean;
  autoApproveTutors: boolean;
}

export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: "usr-1",
    name: "Mahmudul Hasan",
    email: "mahmudul.buet@gmail.com",
    role: "tutor",
    status: "active",
    mobile: "+8801712345678",
    isVerified: true,
    joinedDate: "2026-02-15"
  },
  {
    id: "usr-2",
    name: "Anika Tasnim",
    email: "anika.du@yahoo.com",
    role: "tutor",
    status: "active",
    mobile: "+8801812345678",
    isVerified: false,
    joinedDate: "2026-04-10"
  },
  {
    id: "usr-3",
    name: "Zara Tabassum",
    email: "zara.tabassum@hotmail.com",
    role: "student",
    status: "active",
    mobile: "+8801912345678",
    isVerified: true,
    joinedDate: "2026-01-20"
  },
  {
    id: "usr-4",
    name: "Fahim Shahriar",
    email: "fahim.shahriar@gmail.com",
    role: "student",
    status: "active",
    mobile: "+8801512345678",
    isVerified: false,
    joinedDate: "2026-05-12"
  },
  {
    id: "usr-5",
    name: "Imtiaz Ahmed",
    email: "imtiaz.nsu@gmail.com",
    role: "tutor",
    status: "blocked",
    mobile: "+8801312345678",
    isVerified: false,
    joinedDate: "2026-03-01"
  },
  {
    id: "usr-6",
    name: "Tasneem Rahman",
    email: "tasneem.hsc@gmail.com",
    role: "student",
    status: "inactive",
    mobile: "+8801612345678",
    isVerified: false,
    joinedDate: "2026-06-25"
  },
  {
    id: "usr-7",
    name: "Rahat Kabir",
    email: "rahat.admin@tutorkhujo.com",
    role: "admin",
    status: "active",
    mobile: "+8801700000000",
    isVerified: true,
    joinedDate: "2026-01-01"
  }
];

export const MOCK_ADMIN_VERIFICATIONS: TutorVerification[] = [
  {
    id: "ver-1",
    tutorName: "Nafis Fuad",
    email: "nafis.fuad@du.ac.bd",
    institution: "University of Dhaka",
    department: "Applied Chemistry & Chemical Engineering",
    yearOfStudy: "3rd Year",
    subjects: ["Chemistry", "Organic Chemistry", "General Science"],
    certificateUrl: "du_transcript_nafis.pdf",
    nidCardUrl: "nid_nafis_fuad.jpg",
    status: "Pending",
    submissionDate: "2026-08-04"
  },
  {
    id: "ver-2",
    tutorName: "Tahsina Alam",
    email: "tahsina.nsu@gmail.com",
    institution: "North South University",
    department: "Computer Science & Engineering",
    yearOfStudy: "Graduated",
    subjects: ["Mathematics", "ICT", "Programming (C/Java)"],
    certificateUrl: "nsu_certificate_tahsina.pdf",
    nidCardUrl: "nid_tahsina_alam.jpg",
    status: "Pending",
    submissionDate: "2026-08-03"
  },
  {
    id: "ver-3",
    tutorName: "Sajid Hasan",
    email: "sajid.buet@gmail.com",
    institution: "BUET",
    department: "Mechanical Engineering",
    yearOfStudy: "4th Year",
    subjects: ["Physics", "Higher Mathematics", "Calculus"],
    certificateUrl: "buet_id_sajid.pdf",
    nidCardUrl: "nid_sajid.jpg",
    status: "Approved",
    submissionDate: "2026-07-28"
  },
  {
    id: "ver-4",
    tutorName: "Kamrun Nahar",
    email: "kamrun.nahar@gmail.com",
    institution: "Brac University",
    department: "English literature",
    yearOfStudy: "2nd Year",
    subjects: ["English Language", "English Literature", "IELTS"],
    certificateUrl: "brac_id_kamrun.pdf",
    nidCardUrl: "nid_kamrun.jpg",
    status: "Rejected",
    submissionDate: "2026-07-25"
  }
];

export const MOCK_ADMIN_TUITION_POSTS: AdminTuitionPost[] = [
  {
    id: "post-1",
    studentName: "Zara Tabassum",
    classLevel: "Class 10 (SSC)",
    subjects: ["Mathematics", "Higher Mathematics"],
    budget: 5000,
    mode: "Both",
    frequency: "3 Days / Week",
    location: "Dhanmondi, Dhaka",
    status: "Active",
    createdAt: "2026-07-10"
  },
  {
    id: "post-2",
    studentName: "Adnan Chowdhury",
    classLevel: "HSC (1st Year)",
    subjects: ["Chemistry", "Biology"],
    budget: 8000,
    mode: "Home",
    frequency: "3 Days / Week",
    location: "Gulshan, Dhaka",
    status: "Active",
    createdAt: "2026-08-02"
  },
  {
    id: "post-3",
    studentName: "Maliha Islam",
    classLevel: "Class 9",
    subjects: ["General Mathematics", "General Science"],
    budget: 6000,
    mode: "Online",
    frequency: "3 Days / Week",
    location: "Banani, Dhaka",
    status: "Paused",
    createdAt: "2026-07-31"
  },
  {
    id: "post-4",
    studentName: "Fahim Shahriar",
    classLevel: "HSC (2nd Year)",
    subjects: ["ICT", "C Programming"],
    budget: 5500,
    mode: "Online",
    frequency: "2 Days / Week",
    location: "Mirpur, Dhaka",
    status: "Closed",
    createdAt: "2026-05-10"
  }
];

export const MOCK_ADMIN_TRANSACTIONS: AdminTransaction[] = [
  {
    id: "tx-1",
    userName: "Zara Tabassum",
    userRole: "student",
    amount: 5000,
    type: "Invoice Payment",
    status: "Success",
    date: "2026-08-02",
    method: "bKash",
    reference: "BK-TXN-982341"
  },
  {
    id: "tx-2",
    userName: "Mahmudul Hasan",
    userRole: "tutor",
    amount: 4500,
    type: "Tutor Payout",
    status: "Success",
    date: "2026-08-02",
    method: "Bank Transfer",
    reference: "DBBL-OUT-10023"
  },
  {
    id: "tx-3",
    userName: "Fahim Shahriar",
    userRole: "student",
    amount: 5500,
    type: "Invoice Payment",
    status: "Success",
    date: "2026-08-01",
    method: "Nagad",
    reference: "NG-TXN-112349"
  },
  {
    id: "tx-4",
    userName: "Anika Tasnim",
    userRole: "tutor",
    amount: 5000,
    type: "Tutor Payout",
    status: "Pending",
    date: "2026-08-05",
    method: "bKash",
    reference: "BK-PAY-771239"
  },
  {
    id: "tx-5",
    userName: "Adnan Chowdhury",
    userRole: "student",
    amount: 8000,
    type: "Invoice Payment",
    status: "Failed",
    date: "2026-08-02",
    method: "Card",
    reference: "CRD-TXN-55412"
  }
];

export const MOCK_ADMIN_SETTINGS: AdminSettings = {
  platformFeePercent: 10,
  maintenanceMode: false,
  supportEmail: "support@tutorkhujo.com",
  smsGatewayActive: true,
  autoApproveTutors: false
};
