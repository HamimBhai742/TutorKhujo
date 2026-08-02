import React from "react";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import PopularSubjects from "@/components/home/PopularSubjects";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CTABanner from "@/components/home/CTABanner";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black font-sans antialiased selection:bg-teal-100 selection:text-teal-900 dark:selection:bg-teal-900 dark:selection:text-teal-100">
      {/* Hero Section */}
      <Hero />

      {/* How It Works Section */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* Popular Subjects Section */}
      <PopularSubjects />

      {/* Why Choose TutorKhujo Section */}
      <WhyChooseUs />

      {/* CTA Call To Action Banner */}
      <CTABanner />
    </div>
  );
}
