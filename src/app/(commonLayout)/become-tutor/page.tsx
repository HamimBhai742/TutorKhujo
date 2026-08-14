import React from "react";
import Link from "next/link";
import {
  Wallet,
  Calendar,
  UserCheck,
  TrendingUp,
  Star,
  Shield,
  Clock,
  Sparkles,
  BookOpen,
  Check
} from "lucide-react";
import { TakaIcon } from "@/components/shared/TakaIcon";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function BecomeTutorPage() {
  const benefits = [
    {
      icon: <Wallet className="w-5 h-5 text-rose-500" />,
      iconBg: "bg-rose-50 dark:bg-rose-950/20",
      title: "Set Your Own Rate",
      description: "You control your earnings with transparent pricing. No hidden platform fees or surprises."
    },
    {
      icon: <Calendar className="w-5 h-5 text-sky-500" />,
      iconBg: "bg-sky-50 dark:bg-sky-950/20",
      title: "Flexible Schedule",
      description: "Teach on your own time, home or online. Balance teaching with your studies or full-time career."
    },
    {
      icon: <UserCheck className="w-5 h-5 text-amber-500" />,
      iconBg: "bg-amber-50 dark:bg-amber-950/20",
      title: "Verified Students",
      description: "Connect with real students through our secure platform. We filter requests so you only get serious leads."
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/20",
      title: "Grow Reputation",
      description: "Build trust with student reviews and a professional profile. The better you teach, the more you earn."
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Create your profile",
      description: "Tell us about your expertise, education, and teaching preferences in detail."
    },
    {
      number: "2",
      title: "Get verified",
      description: "Our team reviews your credentials and identity to ensure the highest quality platform."
    },
    {
      number: "3",
      title: "Start receiving requests",
      description: "Instantly match with students in your area or online and start your first session."
    }
  ];

  const testimonials = [
    {
      rating: 5,
      quote: "TutorKhujo transformed how I find students. I filled my entire weekly schedule within just two weeks of getting verified!",
      name: "Rahat Ahmed",
      role: "Math Tutor",
      initials: "RA",
      avatarBg: "bg-emerald-600 dark:bg-emerald-700"
    },
    {
      rating: 5,
      quote: "The platform is incredibly secure. I love that I can set my own rates and focus on teaching while they handle the student matching.",
      name: "Nusrat Jahan",
      role: "English Specialist",
      initials: "NJ",
      avatarBg: "bg-teal-600 dark:bg-teal-700"
    },
    {
      rating: 5,
      quote: "Being a student myself, the flexibility is key. I teach in the evenings and it covers all my monthly expenses comfortably.",
      name: "Tanvir Hasan",
      role: "Physics Tutor",
      initials: "TH",
      avatarBg: "bg-blue-600 dark:bg-blue-700"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      
      {/* 1. Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden border-b border-zinc-100 dark:border-zinc-900 bg-linear-to-b from-zinc-50/50 via-white to-white dark:from-zinc-950/20 dark:via-black dark:to-black">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 md:space-y-8 text-center lg:text-left">
              <ScrollReveal variant="slide-up" delay={50}>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-teal-50 dark:bg-teal-950/40 text-[#0F5B47] dark:text-[#188c6e] border border-teal-100/50 dark:border-teal-900/40 uppercase tracking-widest leading-none">
                  <Sparkles className="w-3.5 h-3.5" />
                  Teach with us
                </span>
              </ScrollReveal>

              <ScrollReveal variant="slide-up" delay={100}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight md:leading-none">
                  Turn your knowledge into <span className="text-[#F26522]">income</span>
                </h1>
              </ScrollReveal>

              <ScrollReveal variant="slide-up" delay={150}>
                <p className="text-sm md:text-base text-zinc-550 dark:text-zinc-400 font-semibold max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Join Bangladesh&apos;s largest tutor community and reach students looking for your expertise. Set your own hours and rates while making a real impact on local education.
                </p>
              </ScrollReveal>

              <ScrollReveal variant="slide-up" delay={200}>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto px-8 py-4 bg-[#F26522] hover:bg-[#d9551a] text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 text-center cursor-pointer"
                  >
                    Join as a Tutor
                  </Link>
                  <a
                    href="#why-teach"
                    className="w-full sm:w-auto px-8 py-4 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-350 font-extrabold text-sm rounded-2xl transition-all text-center cursor-pointer"
                  >
                    Learn More
                  </a>
                </div>
              </ScrollReveal>

              {/* Joined statistics */}
              <ScrollReveal variant="slide-up" delay={250}>
                <div className="flex items-center justify-center lg:justify-start gap-3 pt-4">
                  {/* Overlapping Avatar Mockups */}
                  <div className="flex -space-x-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white dark:border-black flex items-center justify-center text-[10px] font-black text-white shadow-xs">
                      AH
                    </div>
                    <div className="w-9 h-9 rounded-full bg-teal-600 border-2 border-white dark:border-black flex items-center justify-center text-[10px] font-black text-white shadow-xs">
                      NJ
                    </div>
                    <div className="w-9 h-9 rounded-full bg-indigo-600 border-2 border-white dark:border-black flex items-center justify-center text-[10px] font-black text-white shadow-xs">
                      SI
                    </div>
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-zinc-450 dark:text-zinc-500">
                    Joined by <span className="font-extrabold text-zinc-800 dark:text-zinc-200">10,000+ top tutors</span> nationwide
                  </p>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Layered CSS Illustration Mockup */}
            <div className="lg:col-span-6 relative w-full flex items-center justify-center lg:justify-end">
              <ScrollReveal variant="fade" delay={300} duration={850}>
                <div className="relative w-full max-w-lg aspect-square sm:aspect-16/12 lg:aspect-square flex items-center justify-center">
                  
                  {/* Outer glow background blob */}
                  <div className="absolute w-72 h-72 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl -top-12 -left-12 animate-pulse" />
                  <div className="absolute w-72 h-72 rounded-full bg-orange-500/10 dark:bg-orange-500/5 blur-3xl -bottom-12 -right-12 animate-pulse [animation-delay:1.5s]" />

                  {/* Main Dashboard Panel Mockup */}
                  <div className="w-full bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900/60 rounded-3xl p-6 shadow-2xl relative z-10 transition-colors duration-300">
                    
                    {/* Panel Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                        Tutor Portal
                      </span>
                    </div>

                    {/* Dashboard Layout inside Mockup */}
                    <div className="mt-6 space-y-4">
                      
                      {/* Profile Card Mockup */}
                      <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 p-4 rounded-2xl flex gap-3 items-center">
                        <div className="w-12 h-12 rounded-full bg-linear-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-white text-base font-black shadow-md relative shrink-0">
                          NJ
                          <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white dark:border-zinc-950">
                            <Check className="w-2.5 h-2.5 stroke-[3px]" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-black text-zinc-900 dark:text-white truncate">
                            Nusrat Jahan
                          </h3>
                          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">
                            English Specialist &bull; Verified
                          </p>
                        </div>
                        <div className="ml-auto text-right">
                          <span className="text-xs font-black text-[#0F5B47] dark:text-[#188c6e] block">
                            ৳ 6,500/mo
                          </span>
                          <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550 block mt-0.5">
                            Expected
                          </span>
                        </div>
                      </div>

                      {/* Performance Indicators Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        
                        {/* Box 1: Earnings */}
                        <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 p-4 rounded-2xl space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wide">
                            <span>Earnings</span>
                            <TakaIcon className="w-3.5 h-3.5 text-emerald-500" />
                          </div>
                          <p className="text-lg font-black text-zinc-800 dark:text-white leading-none">
                            ৳ 24,500
                          </p>
                          <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-0.5">
                            +12.5% this month
                          </span>
                        </div>

                        {/* Box 2: Booked Hours */}
                        <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 p-4 rounded-2xl space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wide">
                            <span>Classes</span>
                            <Clock className="w-3.5 h-3.5 text-[#F26522]" />
                          </div>
                          <p className="text-lg font-black text-zinc-800 dark:text-white leading-none">
                            18 Hours
                          </p>
                          <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550">
                            3 active students
                          </span>
                        </div>

                      </div>

                      {/* Bottom Activity Slot Widget */}
                      <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-150/40 dark:border-zinc-900/40 p-4 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-zinc-850 dark:text-zinc-200">
                              Upcoming Session
                            </h4>
                            <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5">
                              Today at 5:00 PM &bull; Class 10 Math
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-[#0F5B47] dark:text-[#188c6e] text-[9px] font-extrabold uppercase shrink-0">
                          Online
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Layered floating element: Badge */}
                  <div className="absolute -bottom-6 left-2 sm:-left-6 bg-white dark:bg-zinc-900 border border-zinc-150/60 dark:border-zinc-800/80 p-4 rounded-2xl shadow-xl flex items-center gap-3 z-20 hover:scale-105 transition-transform duration-300">
                    <div className="p-2 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl">
                      <Star className="w-5 h-5 fill-amber-500 text-amber-500 animate-spin-slow" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-zinc-900 dark:text-white">
                        Top Rated Tutor
                      </h4>
                      <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5">
                        Maintaining 4.9+ rating
                      </p>
                    </div>
                  </div>

                  {/* Layered floating element: Shield */}
                  <div className="absolute -top-6 right-2 sm:-right-6 bg-linear-to-br from-[#0F5B47] to-[#0b4234] text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 z-20 hover:scale-105 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white/90 shrink-0" />
                    <div>
                      <h4 className="text-xs font-black">
                        100% Secure
                      </h4>
                      <p className="text-[10px] font-bold text-white/70 mt-0.5">
                        Guaranteed matching
                      </p>
                    </div>
                  </div>

                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Why Teach Section */}
      <section id="why-teach" className="py-20 md:py-28 bg-zinc-50/30 dark:bg-zinc-950/10 scroll-mt-20">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16 md:mb-20">
            <ScrollReveal variant="slide-up" delay={50} className="flex flex-col items-center">
              <h2 className="text-2xl md:text-3.5xl font-black text-zinc-900 dark:text-white tracking-tight">
                Why teach with TutorKhujo?
              </h2>
              <div className="w-20 h-1 bg-[#0F5B47] dark:bg-[#188c6e] mt-4 rounded-full" />
              <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-semibold mt-4 max-w-xl">
                We provide the tools, you provide the knowledge.
              </p>
            </ScrollReveal>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, idx) => (
              <ScrollReveal key={idx} variant="slide-up" delay={100 + idx * 50}>
                <div className="bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xs hover:shadow-md hover:border-teal-500/20 transition-all duration-300 h-full group">
                  <div className={`${benefit.iconBg} p-3 rounded-2xl w-fit group-hover:scale-105 transition-transform duration-250`}>
                    {benefit.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm md:text-base font-black text-zinc-900 dark:text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* 3. How to get started Section */}
      <section className="py-20 md:py-28 bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16 md:mb-24">
            <ScrollReveal variant="slide-up" delay={50} className="flex flex-col items-center">
              <h2 className="text-2xl md:text-3.5xl font-black text-zinc-900 dark:text-white tracking-tight">
                How to get started
              </h2>
              <div className="w-20 h-1 bg-[#0F5B47] dark:bg-[#188c6e] mt-4 rounded-full" />
              <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-semibold mt-4 max-w-xl">
                Your journey to becoming a top tutor takes just three simple steps.
              </p>
            </ScrollReveal>
          </div>

          {/* Steps Timeline Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative">
            
            {/* Connecting Timeline Line for Desktop */}
            <div className="absolute top-10 left-32 right-32 h-0.5 bg-zinc-100 dark:bg-zinc-900 hidden lg:block z-0" />

            {steps.map((step, idx) => (
              <ScrollReveal key={idx} variant="slide-up" delay={100 + idx * 50}>
                <div className="flex flex-col items-center text-center relative z-10 space-y-6 max-w-sm mx-auto lg:max-w-none group">
                  
                  {/* Step Number Badge */}
                  <div className="w-14 h-14 rounded-full bg-[#0F5B47] dark:bg-[#188c6e] text-white flex items-center justify-center text-lg font-black shadow-md border-4 border-white dark:border-black group-hover:scale-105 transition-transform duration-250">
                    {step.number}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm md:text-base font-black text-zinc-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed max-w-xs mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Hear from our Tutors Section */}
      <section className="py-20 md:py-28 bg-zinc-50/30 dark:bg-zinc-950/10 border-t border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-16 md:mb-20">
            <ScrollReveal variant="slide-up" delay={50} className="flex flex-col items-center">
              <h2 className="text-2xl md:text-3.5xl font-black text-zinc-900 dark:text-white tracking-tight">
                Hear from our Tutors
              </h2>
              <div className="w-20 h-1 bg-[#0F5B47] dark:bg-[#188c6e] mt-4 rounded-full" />
              <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-semibold mt-4 max-w-xl">
                Success stories from the community.
              </p>
            </ScrollReveal>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <ScrollReveal key={idx} variant="slide-up" delay={100 + idx * 50}>
                <div className="bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-teal-500/10 transition-all duration-300 h-full gap-8">
                  
                  {/* Rating & Quote */}
                  <div className="space-y-4">
                    <div className="flex gap-0.5 text-amber-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <p className="text-zinc-650 dark:text-zinc-300 text-xs md:text-sm italic leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  {/* Profile Signature */}
                  <div className="flex items-center gap-3 border-t border-zinc-100 dark:border-zinc-900 pt-4">
                    <div className={`w-9 h-9 rounded-full ${t.avatarBg} flex items-center justify-center text-white text-xs font-black shadow-xs shrink-0`}>
                      {t.initials}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-zinc-900 dark:text-white truncate leading-none">
                        {t.name}
                      </h4>
                      <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-1 block truncate">
                        {t.role}
                      </span>
                    </div>
                  </div>

                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Bottom Call to Action Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4 max-w-5xl">
          <ScrollReveal variant="slide-up" delay={50} duration={750}>
            <div className="bg-linear-to-br from-[#0F5B47] to-[#07362a] text-white rounded-3xl p-8 md:p-14 text-center shadow-2xl relative overflow-hidden group">
              
              {/* Floating decorative elements */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-350" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-350" />
              
              <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4.5xl font-black tracking-tight leading-none">
                  Ready to start teaching?
                </h2>
                
                <p className="text-xs md:text-sm text-white/80 font-medium leading-relaxed">
                  Join thousands of educators across Bangladesh and start making a difference today. It only takes 5 minutes to set up your profile.
                </p>

                <div className="pt-2 flex flex-col items-center gap-4">
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto px-10 py-4.5 bg-[#F26522] hover:bg-[#d9551a] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 active:translate-y-0 text-center cursor-pointer"
                  >
                    Join as a Tutor
                  </Link>
                  <span className="text-[10px] font-bold text-white/60 tracking-wider">
                    No credit card required. Free to join.
                  </span>
                </div>
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
