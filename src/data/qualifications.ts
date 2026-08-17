export interface QualificationOption {
  value: string;
  label: string;
  category: string;
}

export const BANGLADESH_QUALIFICATIONS: {
  category: string;
  options: { value: string; label: string }[];
}[] = [
  {
    category: "✨ General & Broad Preferences (Recommended)",
    options: [
      { value: "Any", label: "Any Qualification / Open for All (No Restriction)" },
      { value: "Any Public University", label: "Any Public University (DU, BUET, JU, RU, CU, etc.)" },
      { value: "Any Engineering University", label: "Any Engineering University (BUET, CUET, RUET, KUET, MIST, etc.)" },
      { value: "Any Medical College", label: "Any Medical College (DMC, SSMC, Govt./Private MBBS/BDS)" },
      { value: "Any Top Private University", label: "Any Top Private University (NSU, BRAC, AUST, AIUB, EWU, UIU)" },
      { value: "English Medium (O/A Level)", label: "English Medium Background (Cambridge / Edexcel O/A Level)" },
      { value: "Science Background", label: "Science Background Student / Graduate" },
      { value: "Business / Commerce Background", label: "Business / BBA / Accounting Background" },
      { value: "Arts / Humanities Background", label: "Arts / Humanities / Law / Social Science Background" },
      { value: "Madrasah / Islamic Studies", label: "Madrasah / Islamic Studies / Kamil Background" },
    ],
  },
  {
    category: "🏛️ Top Engineering & Tech Universities",
    options: [
      { value: "BUET", label: "Bangladesh University of Engineering & Technology (BUET)" },
      { value: "CUET", label: "Chittagong University of Engineering & Technology (CUET)" },
      { value: "RUET", label: "Rajshahi University of Engineering & Technology (RUET)" },
      { value: "KUET", label: "Khulna University of Engineering & Technology (KUET)" },
      { value: "BUTEX", label: "Bangladesh University of Textiles (BUTEX)" },
      { value: "MIST", label: "Military Institute of Science and Technology (MIST)" },
      { value: "IUT", label: "Islamic University of Technology (IUT)" },
      { value: "DUET", label: "Dhaka University of Engineering & Technology (DUET)" },
    ],
  },
  {
    category: "🎓 Top Public General Universities",
    options: [
      { value: "University of Dhaka", label: "University of Dhaka (DU)" },
      { value: "Jahangirnagar University", label: "Jahangirnagar University (JU)" },
      { value: "Rajshahi University", label: "University of Rajshahi (RU)" },
      { value: "Chittagong University", label: "University of Chittagong (CU)" },
      { value: "Jagannath University", label: "Jagannath University (JnU)" },
      { value: "BUP", label: "Bangladesh University of Professionals (BUP)" },
      { value: "Khulna University", label: "Khulna University (KU)" },
      { value: "Comilla University", label: "Comilla University (CoU)" },
      { value: "University of Barishal", label: "University of Barishal (BU)" },
      { value: "JKKNIU", label: "Jatiya Kabi Kazi Nazrul Islam University (JKKNIU)" },
      { value: "Begum Rokeya University", label: "Begum Rokeya University, Rangpur (BRUR)" },
    ],
  },
  {
    category: "🔬 Science & Technology Universities (Public)",
    options: [
      { value: "SUST", label: "Shahjalal University of Science & Technology (SUST)" },
      { value: "JUST", label: "Jashore University of Science and Technology (JUST)" },
      { value: "MBSTU", label: "Mawlana Bhashani Science & Technology University (MBSTU)" },
      { value: "NSTU", label: "Noakhali Science and Technology University (NSTU)" },
      { value: "PUST", label: "Pabna University of Science and Technology (PUST)" },
      { value: "PSTU", label: "Patuakhali Science and Technology University (PSTU)" },
      { value: "HSTU", label: "Hajee Mohammad Danesh Science & Technology University (HSTU)" },
    ],
  },
  {
    category: "🩺 Medical Colleges (MBBS / BDS / Dental)",
    options: [
      { value: "Dhaka Medical College", label: "Dhaka Medical College (DMC)" },
      { value: "Sir Salimullah Medical College", label: "Sir Salimullah Medical College (SSMC / Mitford)" },
      { value: "Shaheed Suhrawardy Medical College", label: "Shaheed Suhrawardy Medical College (ShSMC)" },
      { value: "Mymensingh Medical College", label: "Mymensingh Medical College (MMC)" },
      { value: "Chittagong Medical College", label: "Chittagong Medical College (CMC)" },
      { value: "Rajshahi Medical College", label: "Rajshahi Medical College (RMC)" },
      { value: "MAG Osmani Medical College", label: "Sylhet MAG Osmani Medical College" },
      { value: "Rangpur Medical College", label: "Rangpur Medical College (RpMC)" },
    ],
  },
  {
    category: "🏢 Top Private Universities",
    options: [
      { value: "North South University", label: "North South University (NSU)" },
      { value: "BRAC University", label: "BRAC University (BRACU)" },
      { value: "AUST", label: "Ahsanullah University of Science and Technology (AUST)" },
      { value: "AIUB", label: "American International University-Bangladesh (AIUB)" },
      { value: "East West University", label: "East West University (EWU)" },
      { value: "UIU", label: "United International University (UIU)" },
      { value: "IUB", label: "Independent University, Bangladesh (IUB)" },
      { value: "ULAB", label: "University of Liberal Arts Bangladesh (ULAB)" },
      { value: "Daffodil International University", label: "Daffodil International University (DIU)" },
      { value: "Green University", label: "Green University of Bangladesh (GUB)" },
      { value: "University of Asia Pacific", label: "University of Asia Pacific (UAP)" },
      { value: "Stamford University", label: "Stamford University Bangladesh" },
      { value: "Southeast University", label: "Southeast University (SEU)" },
    ],
  },
  {
    category: "🌾 Agricultural Universities",
    options: [
      { value: "BAU", label: "Bangladesh Agricultural University (BAU), Mymensingh" },
      { value: "BSMRAU", label: "Bangabandhu Sheikh Mujibur Rahman Agricultural University (BSMRAU)" },
      { value: "SAU", label: "Sher-e-Bangla Agricultural University (SAU)" },
      { value: "Sylhet Agricultural University", label: "Sylhet Agricultural University (SAU)" },
    ],
  },
  {
    category: "🏫 Premier National University Colleges",
    options: [
      { value: "Dhaka College", label: "Dhaka College" },
      { value: "Eden Mohila College", label: "Eden Mohila College" },
      { value: "Government Titumir College", label: "Government Titumir College" },
      { value: "Govt. Bangla College", label: "Govt. Bangla College" },
      { value: "Kabi Nazrul Govt. College", label: "Kabi Nazrul Govt. College" },
      { value: "Begum Badrunnesa Govt. Girls College", label: "Begum Badrunnesa Govt. Girls College" },
      { value: "Govt. Shaheed Suhrawardy College", label: "Govt. Shaheed Suhrawardy College" },
      { value: "Chittagong College", label: "Chittagong College" },
      { value: "Rajshahi College", label: "Rajshahi College" },
      { value: "Ananda Mohan College", label: "Ananda Mohan College, Mymensingh" },
      { value: "MC College", label: "Murari Chand College (MC College), Sylhet" },
      { value: "National University (Honors/Masters)", label: "National University (Any Affiliated College)" },
    ],
  },
  {
    category: "🏆 Specialized Colleges & Cadet Background",
    options: [
      { value: "Notre Dame College", label: "Notre Dame College (NDC Alumni)" },
      { value: "Holy Cross College", label: "Holy Cross College (Alumni)" },
      { value: "Cadet College Background", label: "Ex-Cadet / Cadet College Background" },
      { value: "Dhaka Residential Model College", label: "DRMC Alumni" },
      { value: "Rajuk Uttara Model College", label: "RUMC Alumni" },
    ],
  },
];
