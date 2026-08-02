import React from "react";
import { Star, MapPin, BookOpen, ArrowRight, Award } from "lucide-react";
import Link from "next/link";

export default function FeaturedTutors() {
  const tutors = [
    {
      name: "Sultana Razia",
      avatarBg: "bg-emerald-600",
      initials: "SR",
      university: "Dhaka University (DU)",
      department: "B.Sc in Mathematics",
      rating: 5.0,
      reviewsCount: 24,
      subjects: ["Mathematics", "Higher Math", "Physics"],
      salary: "৳ 6,000/month",
      mode: "Home & Online",
      badge: "Top Rated",
    },
    {
      name: "Mahmudul Hasan",
      avatarBg: "bg-blue-600",
      initials: "MH",
      university: "BUET",
      department: "B.Sc in Civil Engineering",
      rating: 4.9,
      reviewsCount: 18,
      subjects: ["Physics", "Chemistry", "Mathematics"],
      salary: "৳ 7,500/month",
      mode: "Home Tutoring",
      badge: "Verified Expert",
    },
    {
      name: "Adnan Chowdhury",
      avatarBg: "bg-indigo-600",
      initials: "AC",
      university: "NSU",
      department: "B.Sc in Computer Science",
      rating: 4.8,
      reviewsCount: 15,
      subjects: ["ICT", "Mathematics", "English"],
      salary: "৳ 5,000/month",
      mode: "Online Only",
      badge: "Popular",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-zinc-50/50 dark:bg-zinc-950/20 transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white">
            Featured Verified Tutors
          </h2>
          <div className="w-24 h-1 bg-[#0F5B47] dark:bg-[#188c6e] mt-4 rounded-full" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4 max-w-xl">
            Book a free trial class with our most requested and highly rated verified tutors.
          </p>
        </div>

        {/* Tutor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutors.map((tutor, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl p-6 md:p-8 flex flex-col space-y-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/40 text-[#0F5B47] dark:text-[#188c6e] border border-teal-100 dark:border-teal-900">
                  <Award className="w-3.5 h-3.5" />
                  {tutor.badge}
                </span>
              </div>

              {/* Header Info */}
              <div className="flex items-center space-x-4">
                {/* Avatar with initials */}
                <div
                  className={`w-14 h-14 rounded-2xl ${tutor.avatarBg} flex items-center justify-center text-white text-lg font-extrabold shadow-sm shrink-0`}
                >
                  {tutor.initials}
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-[#0F5B47] dark:group-hover:text-[#188c6e] transition-colors">
                    {tutor.name}
                  </h3>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {tutor.university}
                  </p>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    {tutor.department}
                  </p>
                </div>
              </div>

              {/* Ratings */}
              <div className="flex items-center space-x-2 text-sm text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span className="ml-1 font-bold text-zinc-900 dark:text-white">
                    {tutor.rating.toFixed(1)}
                  </span>
                </div>
                <span>•</span>
                <span>({tutor.reviewsCount} reviews)</span>
              </div>

              {/* Subjects */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Subjects:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tutor.subjects.map((sub, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer info: Price & Booking */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between mt-auto">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase font-bold tracking-wider">
                    Expected Salary
                  </span>
                  <span className="text-base font-extrabold text-zinc-900 dark:text-white">
                    {tutor.salary}
                  </span>
                </div>

                <div className="flex flex-col items-end text-right space-y-1">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block uppercase font-bold tracking-wider">
                    Preference
                  </span>
                  <span className="text-xs font-semibold text-[#0F5B47] dark:text-[#188c6e] flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {tutor.mode}
                  </span>
                </div>
              </div>

              {/* View Profile Action */}
              <Link
                href="/tutors"
                className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-[#0F5B47] dark:hover:bg-[#188c6e] hover:text-white dark:hover:text-white text-zinc-800 dark:text-zinc-200 font-bold text-sm rounded-xl transition-all duration-200 group/btn"
              >
                <span>View Full Profile</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>

        {/* View All Tutors Link */}
        <div className="text-center mt-12">
          <Link
            href="/tutors"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0F5B47] dark:text-[#188c6e] hover:underline"
          >
            <span>Browse all verified tutors in your area</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
