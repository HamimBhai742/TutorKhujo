import React, { Suspense } from "react";
import { Metadata } from "next";
import LeaderboardClient from "@/components/leaderboard/LeaderboardClient";

export const metadata: Metadata = {
  title: "Tutor Leaderboard - Top Rated Verified Educators | TutorKhojo",
  description:
    "Explore TutorKhojo's official Educator Leaderboard and Hall of Fame. Discover the highest-rated verified tutors in Dhaka for Physics, Mathematics, Chemistry, English, and more.",
};

export default function LeaderboardPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 text-center font-semibold text-zinc-500 animate-pulse">
          Loading Educator Leaderboard...
        </div>
      }
    >
      <LeaderboardClient />
    </Suspense>
  );
}
