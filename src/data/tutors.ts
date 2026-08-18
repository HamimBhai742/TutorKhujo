export interface Tutor {
  id: string;
  name: string;
  avatarBg: string;
  initials: string;
  university: string;
  department: string;
  rating: number;
  reviewsCount: number;
  subjects: string[];
  classLevels: string[];
  location: string;
  city: string;
  salary: number;
  mode: "Home" | "Online" | "Both";
  badge: string;
  gender: "Male" | "Female";
  about?: string;
  education?: { degree: string; institution: string }[];
  reviews?: { reviewer: string; date: string; rating: number; comment: string }[];
  classFrequency?: string;
  trialClass?: string;
  responseRate?: string;
}

export const MOCK_TUTORS: Tutor[] = [
  {
    id: "1",
    name: "Ahsan Habib",
    avatarBg: "bg-emerald-600 dark:bg-emerald-700",
    initials: "AH",
    university: "Dhaka University (DU)",
    department: "B.Sc in Mathematics",
    rating: 4.9,
    reviewsCount: 32,
    subjects: ["Mathematics", "Physics"],
    classLevels: ["Class 6-9", "SSC", "HSC"],
    location: "Dhanmondi",
    city: "Dhaka",
    salary: 5000,
    mode: "Both",
    badge: "Top Rated",
    gender: "Male",
    about: "I am a dedicated Mathematics tutor with a strong focus on building analytical and problem-solving skills. I have over 4 years of experience preparing students for board exams (SSC/HSC) and university admission tests, making complex mathematical concepts easy to grasp.",
    education: [
      { degree: "B.Sc in Mathematics", institution: "University of Dhaka" },
      { degree: "HSC (Science Group)", institution: "Notre Dame College" }
    ],
    reviews: [
      { reviewer: "Anika Rahman", date: "Nov 12, 2023", rating: 5, comment: "Ahsan brother is amazing at explaining calculus and coordinate geometry. Highly recommended!" },
      { reviewer: "Mahmudul Hasan", date: "Oct 05, 2023", rating: 4, comment: "Very punctual and detailed explanations. Helped me improve my math grades in HSC." }
    ],
    classFrequency: "3 Days / Week",
    trialClass: "Free First Class",
    responseRate: "Ahsan usually responds within 1 hour to new requests."
  },
  {
    id: "2",
    name: "Nusrat Jahan",
    avatarBg: "bg-teal-600 dark:bg-teal-700",
    initials: "NJ",
    university: "Dhaka University (DU)",
    department: "B.A in English Literature",
    rating: 4.8,
    reviewsCount: 21,
    subjects: ["English", "Biology"],
    classLevels: ["Class 1-5", "Class 6-9", "SSC"],
    location: "Banani",
    city: "Dhaka",
    salary: 6500,
    mode: "Online",
    badge: "Verified Expert",
    gender: "Female",
    about: "I specialize in teaching English grammar, literature, and communications. I also enjoy tutoring Biology up to SSC level, linking biological concepts with practical daily examples. I aim to build confidence in my students' reading and writing abilities.",
    education: [
      { degree: "B.A in English Literature", institution: "University of Dhaka" },
      { degree: "HSC (Humanities Group)", institution: "Viqarunnisa Noon College" }
    ],
    reviews: [
      { reviewer: "Tariqul Islam", date: "Dec 01, 2023", rating: 5, comment: "Nusrat apu's online class is very interactive and engaging. She helped me with my speaking skills." },
      { reviewer: "Sabrina Chowdhury", date: "Nov 15, 2023", rating: 5, comment: "Excellent biology explanations. Her structured slides and notes are very helpful." }
    ],
    classFrequency: "3 Days / Week",
    trialClass: "Free First Class",
    responseRate: "Nusrat usually responds within 2 hours to new requests."
  },
  {
    id: "3",
    name: "Tamvir Ahmed",
    avatarBg: "bg-blue-600 dark:bg-blue-700",
    initials: "TA",
    university: "BUET",
    department: "B.Sc in Computer Science (CSE)",
    rating: 4.7,
    reviewsCount: 15,
    subjects: ["Mathematics", "Physics"],
    classLevels: ["SSC", "HSC"],
    location: "Uttara",
    city: "Dhaka",
    salary: 4500,
    mode: "Home",
    badge: "Popular",
    gender: "Male",
    about: "I am a CSE student at BUET with a strong passion for teaching mathematics and physics. My goal is to instil deep logical reasoning in students, preparing them not just to get high marks but also to develop a genuine love for natural sciences and logic.",
    education: [
      { degree: "B.Sc in Computer Science (CSE)", institution: "BUET" },
      { degree: "HSC (Science Group)", institution: "Rajuk Uttara Model College" }
    ],
    reviews: [
      { reviewer: "Sakib Al-Hasan", date: "Jan 10, 2024", rating: 5, comment: "Outstanding physics tutor. Made mechanics and electricity crystal clear." }
    ],
    classFrequency: "3 Days / Week",
    trialClass: "Free First Class",
    responseRate: "Tamvir usually responds within 3 hours to new requests."
  },
  {
    id: "4",
    name: "Farhana Akter",
    avatarBg: "bg-rose-600 dark:bg-rose-700",
    initials: "FA",
    university: "North South University (NSU)",
    department: "B.Sc in Biochemistry",
    rating: 5.0,
    reviewsCount: 42,
    subjects: ["Chemistry", "Biology"],
    classLevels: ["Class 6-9", "SSC", "HSC"],
    location: "Gulshan",
    city: "Dhaka",
    salary: 8000,
    mode: "Home",
    badge: "Top Rated",
    gender: "Female",
    about: "I am a passionate Chemistry educator with over 5 years of experience helping students excel in their board exams. I believe in making complex concepts simple and engaging. My teaching methodology focuses on conceptual clarity rather than rote memorization, ensuring that students not only perform well in exams but also develop a genuine interest in the sciences.",
    education: [
      { degree: "B.Sc in Chemistry", institution: "University of Dhaka" },
      { degree: "M.Sc in Biochemistry", institution: "University of Dhaka" }
    ],
    reviews: [
      { reviewer: "Anisur Rahman", date: "Oct 12, 2023", rating: 5, comment: "Farhana ma'am has a unique way of explaining organic chemistry. My grades improved significantly in just three months!" },
      { reviewer: "Sultana Ahmed", date: "Sep 28, 2023", rating: 5, comment: "Very punctual and patient. She explains each topic until the student fully understands. Highly recommended for HSC preparation." }
    ],
    classFrequency: "3 Days / Week",
    trialClass: "Free First Class",
    responseRate: "Farhana usually responds within 2 hours to new student requests."
  },
  {
    id: "5",
    name: "Saiful Islam",
    avatarBg: "bg-indigo-600 dark:bg-indigo-700",
    initials: "SI",
    university: "BUET",
    department: "B.Sc in Electrical Engineering (EEE)",
    rating: 4.8,
    reviewsCount: 29,
    subjects: ["Physics", "Mathematics"],
    classLevels: ["SSC", "HSC"],
    location: "Mirpur",
    city: "Dhaka",
    salary: 5500,
    mode: "Both",
    badge: "Verified Expert",
    gender: "Male",
    about: "With EEE background, I specialize in mathematical modeling, electronics, electromagnetism, and classical physics. I prioritize deep logical proofs and practice questions to prepare students thoroughly for top-tier exams and academic tests.",
    education: [
      { degree: "B.Sc in Electrical Engineering (EEE)", institution: "BUET" },
      { degree: "HSC (Science)", institution: "Dhaka College" }
    ],
    reviews: [
      { reviewer: "Fahim Shahriar", date: "Feb 18, 2024", rating: 5, comment: "Exceptional electrical physics concepts. Guided me through tough mathematical derivations." }
    ],
    classFrequency: "3 Days / Week",
    trialClass: "Free First Class",
    responseRate: "Saiful usually responds within 1 hour."
  },
  {
    id: "6",
    name: "Sabrina Yasmin",
    avatarBg: "bg-orange-600 dark:bg-orange-700",
    initials: "SY",
    university: "Dhaka University (DU)",
    department: "M.A in English Literature",
    rating: 4.8,
    reviewsCount: 19,
    subjects: ["English"],
    classLevels: ["Class 1-5", "Class 6-9", "SSC", "HSC"],
    location: "Banasree",
    city: "Dhaka",
    salary: 7000,
    mode: "Online",
    badge: "Popular",
    gender: "Female",
    about: "I am an experienced English tutor teaching literature, composition, spelling, and academic English for over 3 years. My curriculum includes custom reading challenges, grammar workbooks, and mock tests designed to build solid communication skills.",
    education: [
      { degree: "M.A in English Literature", institution: "Dhaka University (DU)" },
      { degree: "B.A in English Literature", institution: "Dhaka University (DU)" }
    ],
    reviews: [
      { reviewer: "Lamia Hasan", date: "Mar 02, 2024", rating: 5, comment: "Sabrina Apu's classes helped me score A+ in HSC English Literature. She is very encouraging!" }
    ],
    classFrequency: "3 Days / Week",
    trialClass: "Free First Class",
    responseRate: "Sabrina usually responds within 2 hours."
  },
  {
    id: "7",
    name: "Tanvir Rahman",
    avatarBg: "bg-sky-600 dark:bg-sky-700",
    initials: "TR",
    university: "Dhaka Medical College (DMC)",
    department: "MBBS (Final Year)",
    rating: 4.9,
    reviewsCount: 11,
    subjects: ["Biology", "Chemistry"],
    classLevels: ["SSC", "HSC"],
    location: "Mohammadpur",
    city: "Dhaka",
    salary: 6000,
    mode: "Home",
    badge: "Verified Expert",
    gender: "Male",
    about: "As a final-year medical student, I have an in-depth understanding of biology, anatomy, physiology, and chemistry. I assist college students in mastering biological diagrams, cellular mechanisms, and organic equations for academic excellence.",
    education: [
      { degree: "MBBS (Final Year)", institution: "Dhaka Medical College (DMC)" },
      { degree: "HSC (Science)", institution: "Notre Dame College" }
    ],
    reviews: [
      { reviewer: "Tawhid Alam", date: "Jan 22, 2024", rating: 5, comment: "Excellent biological structures and genetics classes. Very helpful for medical admission exams." }
    ],
    classFrequency: "3 Days / Week",
    trialClass: "Free First Class",
    responseRate: "Tanvir usually responds within 2 hours."
  },
  {
    id: "8",
    name: "Anika Tabassum",
    avatarBg: "bg-purple-600 dark:bg-purple-700",
    initials: "AT",
    university: "North South University (NSU)",
    department: "B.Sc in Microbiology",
    rating: 4.9,
    reviewsCount: 26,
    subjects: ["Biology", "English"],
    classLevels: ["Class 1-5", "Class 6-9", "SSC"],
    location: "Bashundhara",
    city: "Dhaka",
    salary: 7500,
    mode: "Both",
    badge: "Top Rated",
    gender: "Female",
    about: "Microbiology background helps me bring science concepts to life. I offer comprehensive tuition for biology and English grammar/literature. I design creative assessments to test understanding in real-time.",
    education: [
      { degree: "B.Sc in Microbiology", institution: "North South University (NSU)" },
      { degree: "HSC (Science)", institution: "Viqarunnisa Noon College" }
    ],
    reviews: [
      { reviewer: "Zarin Tasnim", date: "Dec 18, 2023", rating: 5, comment: "Very thorough with concepts. Her microbiology insights make biology extremely interesting." }
    ],
    classFrequency: "3 Days / Week",
    trialClass: "Free First Class",
    responseRate: "Anika usually responds within 1 hour."
  },
  {
    id: "9",
    name: "Kazi Nafis",
    avatarBg: "bg-cyan-600 dark:bg-cyan-700",
    initials: "KN",
    university: "IUT",
    department: "B.Sc in Mechanical Engineering",
    rating: 4.6,
    reviewsCount: 8,
    subjects: ["Mathematics", "Physics"],
    classLevels: ["Class 6-9", "SSC"],
    location: "Wari",
    city: "Dhaka",
    salary: 5000,
    mode: "Online",
    badge: "Popular",
    gender: "Male",
    about: "Mechanical engineering student focusing on physics mechanics, mathematics, algebra, and geometry. I use interactive digital whiteboards for physics simulations and step-by-step math workouts.",
    education: [
      { degree: "B.Sc in Mechanical Engineering", institution: "IUT" },
      { degree: "HSC (Science)", institution: "Dhaka College" }
    ],
    reviews: [
      { reviewer: "Imran Khan", date: "Feb 05, 2024", rating: 4.5, comment: "Clear instruction in physics mechanics. Great whiteboard presentations." }
    ],
    classFrequency: "3 Days / Week",
    trialClass: "Free First Class",
    responseRate: "Kazi usually responds within 3 hours."
  },
  {
    id: "10",
    name: "Tasnim Alam",
    avatarBg: "bg-fuchsia-600 dark:bg-fuchsia-700",
    initials: "TA",
    university: "BRAC University",
    department: "B.Sc in Physics",
    rating: 4.9,
    reviewsCount: 14,
    subjects: ["Physics", "Mathematics"],
    classLevels: ["Class 6-9", "SSC", "HSC"],
    location: "Dhanmondi",
    city: "Dhaka",
    salary: 7000,
    mode: "Home",
    badge: "Top Rated",
    gender: "Female",
    about: "Dedicated physics major offering math and physics tutorial programs. I focus on developing deep theoretical backgrounds, graphical representations, and solving past exam question banks.",
    education: [
      { degree: "B.Sc in Physics", institution: "BRAC University" },
      { degree: "HSC (Science)", institution: "Holcross College" }
    ],
    reviews: [
      { reviewer: "Ayesha Siddiqua", date: "Nov 28, 2023", rating: 5, comment: "Very polite, clear, and methodical. My daughter's physics grades improved significantly." }
    ],
    classFrequency: "3 Days / Week",
    trialClass: "Free First Class",
    responseRate: "Tasnim usually responds within 2 hours."
  },
  {
    id: "11",
    name: "Rafid Al-Hasan",
    avatarBg: "bg-violet-600 dark:bg-violet-700",
    initials: "RH",
    university: "MIST",
    department: "B.Sc in Civil Engineering",
    rating: 4.7,
    reviewsCount: 12,
    subjects: ["Mathematics", "Physics", "Chemistry"],
    classLevels: ["SSC", "HSC"],
    location: "Mirpur",
    city: "Dhaka",
    salary: 4800,
    mode: "Both",
    badge: "Verified Expert",
    gender: "Male",
    about: "Civil Engineering student at MIST with solid credentials in math, engineering mechanics, and chemistry. I provide structured daily worksheets, home tasks, and performance updates to parents.",
    education: [
      { degree: "B.Sc in Civil Engineering", institution: "MIST" },
      { degree: "HSC (Science)", institution: "Cantonment Public School" }
    ],
    reviews: [
      { reviewer: "Naimur Rahman", date: "Jan 15, 2024", rating: 5, comment: "Very organized tutor. He provides excellent chemistry and math materials." }
    ],
    classFrequency: "3 Days / Week",
    trialClass: "Free First Class",
    responseRate: "Rafid usually responds within 2 hours."
  },
  {
    id: "12",
    name: "Sumaiya Afrin",
    avatarBg: "bg-pink-600 dark:bg-pink-700",
    initials: "SA",
    university: "Dhaka University (DU)",
    department: "B.Sc in Chemistry",
    rating: 4.8,
    reviewsCount: 17,
    subjects: ["Chemistry", "Mathematics"],
    classLevels: ["Class 6-9", "SSC", "HSC"],
    location: "Banani",
    city: "Dhaka",
    salary: 5200,
    mode: "Online",
    badge: "Popular",
    gender: "Female",
    about: "Chemistry major helping students build solid conceptual foundations. I make learning enjoyable through practical animations, periodic table tricks, and interactive practice tests.",
    education: [
      { degree: "B.Sc in Chemistry", institution: "Dhaka University (DU)" },
      { degree: "HSC (Science)", institution: "Viqarunnisa Noon College" }
    ],
    reviews: [
      { reviewer: "Maliha Islam", date: "Dec 05, 2023", rating: 5, comment: "She is a wonderful chemistry teacher. Makes tough organic reactions feel simple." }
    ],
    classFrequency: "3 Days / Week",
    trialClass: "Free First Class",
    responseRate: "Sumaiya usually responds within 2 hours."
  }
];

export function mapDbTutorToFrontend(user: any): Tutor {
  const name = user.name || "Tutor";
  const nameParts = name.trim().split(" ");
  const initials = nameParts.length > 1
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();

  const colorIndex = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % 7;
  const colors = [
    "bg-emerald-600 dark:bg-emerald-700",
    "bg-teal-600 dark:bg-teal-700",
    "bg-blue-600 dark:bg-blue-700",
    "bg-indigo-600 dark:bg-indigo-700",
    "bg-rose-600 dark:bg-rose-700",
    "bg-amber-600 dark:bg-amber-700",
    "bg-purple-600 dark:bg-purple-700",
  ];

  const rating =
    user.reviewsReceived && user.reviewsReceived.length > 0
      ? Number(
          (
            user.reviewsReceived.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) /
            user.reviewsReceived.length
          ).toFixed(1)
        )
      : 5.0;

  const reviews = Array.isArray(user.reviewsReceived)
    ? user.reviewsReceived.map((r: any) => ({
        reviewer: r.student?.name || "Verified Student",
        date: r.createdAt
          ? new Date(r.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : "Recently",
        rating: r.rating || 5,
        comment: r.comment || "Great tutor!",
      }))
    : [];

  const qualifications = Array.isArray(user.qualifications) ? user.qualifications : [];
  const education = qualifications.map((q: any) => ({
    degree: q.degree || q.subject || q.level || "Degree",
    institution: q.institution || "Institution",
  }));

  if (education.length === 0 && (user.institution || user.department)) {
    education.push({
      degree: user.department ? `B.Sc in ${user.department}` : (user.yearOfStudy || "Bachelor's Degree"),
      institution: user.institution || "Dhaka University",
    });
  }

  let badge = "Top Rated";
  if (user.isTutorOfTheMonth) badge = "Tutor of Month";
  else if (user.verificationStatus === "Approved" || user.isVerified) badge = "Verified Expert";
  else if (user.isPriorityListed) badge = "Popular";

  const mode = user.tuitionModes?.includes("Both")
    ? "Both"
    : user.tuitionModes?.includes("Online")
    ? "Online"
    : "Home";

  const classLevels =
    user.curriculums && user.curriculums.length > 0
      ? user.curriculums
      : ["Class 6-9", "SSC", "HSC"];

  return {
    id: user.id,
    name: user.name,
    avatarBg: user.profilePic || colors[colorIndex],
    initials,
    university: user.institution || "Dhaka University",
    department: user.department || "Science & Mathematics",
    rating,
    reviewsCount: reviews.length,
    subjects:
      Array.isArray(user.subjects) && user.subjects.length > 0
        ? user.subjects
        : ["Mathematics", "Physics"],
    classLevels,
    location: user.city || "Dhaka",
    city: user.city || "Dhaka",
    salary: user.expectedSalary || 5000,
    mode,
    badge,
    gender: (user.gender === "Female" ? "Female" : "Male") as "Male" | "Female",
    about:
      user.bio ||
      `${user.name} is an experienced tutor providing high quality lessons in ${
        user.subjects?.join(", ") || "various subjects"
      }.`,
    education,
    reviews,
    classFrequency: "3 Days / Week",
    trialClass: "Free Demo Class Available",
    responseRate: `${user.name} usually responds within 1 hour.`,
  };
}
