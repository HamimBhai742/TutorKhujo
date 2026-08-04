"use client";

import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Share2,
  Users,
  MessageSquare,
  Send,
  ChevronDown
} from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function AboutClient() {
  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5 text-[#0F5B47] dark:text-[#188c6e]" />,
      title: "Email",
      detail: "support@tutorkhujo.com",
      subtext: "Our support team is online 24/7.",
      href: "mailto:support@tutorkhujo.com"
    },
    {
      icon: <Phone className="w-5 h-5 text-[#0F5B47] dark:text-[#188c6e]" />,
      title: "Phone",
      detail: "+880 1XXX-XXXXXX",
      subtext: "Mon-Fri from 9am to 6pm.",
      href: "tel:+880123456789"
    },
    {
      icon: <MapPin className="w-5 h-5 text-[#0F5B47] dark:text-[#188c6e]" />,
      title: "Office Address",
      detail: "Gulshan, Dhaka, Bangladesh",
      subtext: "Visit us for a cup of coffee.",
      href: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50/40 dark:bg-black transition-colors duration-300 pb-20 pt-10 md:pt-16">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="max-w-2xl mb-12 md:mb-16">
          <ScrollReveal variant="slide-up" delay={50}>
            <span className="text-xs font-black uppercase tracking-wider text-[#F26522] block mb-3">
              Get In Touch
            </span>
          </ScrollReveal>
          
          <ScrollReveal variant="slide-up" delay={100}>
            <h1 className="text-3xl md:text-4.5xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
              We&apos;re here to help you excel
            </h1>
          </ScrollReveal>
          
          <ScrollReveal variant="slide-up" delay={150}>
            <p className="text-sm md:text-base text-zinc-550 dark:text-zinc-400 font-semibold leading-relaxed">
              Have questions about our tutors or how the platform works? Drop us a line and our support team will get back to you within 24 hours.
            </p>
          </ScrollReveal>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Contact Form */}
          <div className="col-span-1 lg:col-span-7">
            <ScrollReveal variant="slide-up" delay={200}>
              <div className="bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900 rounded-3xl p-6 md:p-10 shadow-xs">
                <h2 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white mb-8 tracking-tight">
                  Send us a message
                </h2>
                
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                  
                  {/* Name and Email Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-xs font-black text-zinc-500 dark:text-zinc-450 uppercase tracking-wide">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        placeholder="John Doe"
                        className="w-full px-4 py-3.5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-sm font-semibold rounded-xl outline-hidden transition-all text-zinc-800 dark:text-white dark:placeholder-zinc-600"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-black text-zinc-500 dark:text-zinc-450 uppercase tracking-wide">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="john@example.com"
                        className="w-full px-4 py-3.5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-sm font-semibold rounded-xl outline-hidden transition-all text-zinc-800 dark:text-white dark:placeholder-zinc-600"
                        required
                      />
                    </div>
                  </div>

                  {/* Subject Select Option */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs font-black text-zinc-500 dark:text-zinc-450 uppercase tracking-wide">
                      Subject
                    </label>
                    <div className="relative">
                      <select
                        id="subject"
                        className="w-full px-4 py-3.5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-sm font-semibold rounded-xl outline-hidden appearance-none transition-all text-zinc-800 dark:text-white cursor-pointer"
                        defaultValue=""
                        required
                      >
                        <option value="" disabled>Select a reason for contacting</option>
                        <option value="tutor-inquiry">I want to find a tutor</option>
                        <option value="become-tutor">I want to become a tutor</option>
                        <option value="billing">Billing or Payment inquiries</option>
                        <option value="technical">Technical Support</option>
                        <option value="other">Other general query</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Message Textarea */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-black text-zinc-500 dark:text-zinc-450 uppercase tracking-wide">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3.5 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 focus:border-[#0F5B47] dark:focus:border-[#188c6e] text-sm font-semibold rounded-xl outline-hidden transition-all text-zinc-800 dark:text-white dark:placeholder-zinc-600 resize-none leading-relaxed"
                      required
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#F26522] hover:bg-[#d9551a] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Send Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>

                </form>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column - Info Cards & Map */}
          <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
            
            {/* Info Cards Stack */}
            <div className="space-y-4">
              {contactInfo.map((info, idx) => (
                <ScrollReveal key={idx} variant="slide-up" delay={250 + idx * 50}>
                  <a
                    href={info.href}
                    className="bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900 rounded-2xl p-5 flex gap-4 items-start shadow-2xs hover:shadow-sm hover:border-[#0F5B47]/20 dark:hover:border-[#188c6e]/20 transition-all duration-200 group"
                  >
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl shrink-0 group-hover:scale-102 transition-transform duration-200">
                      {info.icon}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h4 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                        {info.title}
                      </h4>
                      <p className="text-sm font-black text-zinc-900 dark:text-white group-hover:text-[#0F5B47] dark:group-hover:text-[#188c6e] transition-colors truncate">
                        {info.detail}
                      </p>
                      <p className="text-[11px] font-semibold text-zinc-450 dark:text-zinc-555 leading-none">
                        {info.subtext}
                      </p>
                    </div>
                  </a>
                </ScrollReveal>
              ))}
            </div>

            {/* Social Follow Widget */}
            <ScrollReveal variant="slide-up" delay={400}>
              <div className="bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900 rounded-2xl p-6 shadow-2xs space-y-4">
                <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
                  Follow Us
                </h4>
                <div className="flex gap-3">
                  {[
                    { id: "globe", icon: <Globe className="w-4 h-4" /> },
                    { id: "share", icon: <Share2 className="w-4 h-4" /> },
                    { id: "users", icon: <Users className="w-4 h-4" /> },
                    { id: "message", icon: <MessageSquare className="w-4 h-4" /> }
                  ].map((item) => (
                    <button
                      key={item.id}
                      className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-550 hover:text-[#0F5B47] hover:border-[#0F5B47] dark:text-zinc-400 dark:hover:text-[#188c6e] dark:hover:border-[#188c6e] flex items-center justify-center transition-all cursor-pointer hover:scale-105"
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Greyscale SVGMockup Map Widget */}
            <ScrollReveal variant="slide-up" delay={450}>
              <div className="bg-white dark:bg-zinc-950 border border-zinc-150/60 dark:border-zinc-900 rounded-2xl p-2.5 shadow-2xs overflow-hidden relative group">
                <div className="aspect-21/9 sm:aspect-16/7 lg:aspect-16/10 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 flex items-center justify-center overflow-hidden relative border border-zinc-100 dark:border-zinc-900">
                  
                  {/* Inline Stylized SVG Greyscale Map Mockup */}
                  <svg
                    className="absolute inset-0 w-full h-full opacity-60 dark:opacity-40"
                    viewBox="0 0 400 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Background */}
                    <rect width="400" height="200" fill="#EAEAEA" className="dark:fill-zinc-800" />
                    
                    {/* Waterbody / Lake Mockup */}
                    <path
                      d="M 50 200 Q 120 150 100 100 T 150 40 T 260 50 Q 300 120 330 200 Z"
                      fill="#D8D8D8"
                      className="dark:fill-zinc-700"
                    />
                    
                    {/* Streets Grids */}
                    <line x1="0" y1="30" x2="400" y2="30" stroke="#FFFFFF" strokeWidth="2" className="dark:stroke-zinc-600" />
                    <line x1="0" y1="85" x2="400" y2="85" stroke="#FFFFFF" strokeWidth="3.5" className="dark:stroke-zinc-600" />
                    <line x1="0" y1="140" x2="400" y2="140" stroke="#FFFFFF" strokeWidth="2" className="dark:stroke-zinc-600" />
                    <line x1="0" y1="180" x2="400" y2="180" stroke="#FFFFFF" strokeWidth="1.5" className="dark:stroke-zinc-600" />

                    <line x1="60" y1="0" x2="60" y2="200" stroke="#FFFFFF" strokeWidth="2" className="dark:stroke-zinc-600" />
                    <line x1="180" y1="0" x2="180" y2="200" stroke="#FFFFFF" strokeWidth="4" className="dark:stroke-zinc-600" />
                    <line x1="280" y1="0" x2="280" y2="200" stroke="#FFFFFF" strokeWidth="2.5" className="dark:stroke-zinc-600" />
                    <line x1="350" y1="0" x2="350" y2="200" stroke="#FFFFFF" strokeWidth="1.5" className="dark:stroke-zinc-600" />

                    {/* Bridge Road */}
                    <path
                      d="M 100 100 C 130 100, 250 100, 280 100"
                      stroke="#FFFFFF"
                      strokeWidth="5"
                      className="dark:stroke-zinc-600"
                    />
                  </svg>

                  {/* Marker representing TutorKhujo Office */}
                  <div className="absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group-hover:scale-105 transition-transform duration-300">
                    {/* Ring Pulse */}
                    <div className="absolute w-10 h-10 rounded-full bg-[#0F5B47]/20 dark:bg-[#188c6e]/30 animate-ping" />
                    
                    {/* Map Marker Pin */}
                    <div className="w-8 h-8 rounded-full bg-[#0F5B47] dark:bg-[#188c6e] border-2 border-white dark:border-zinc-950 flex items-center justify-center shadow-lg relative z-10">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    
                    {/* Pin tail tooltip */}
                    <div className="mt-1.5 px-2 py-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[9px] font-black rounded-md whitespace-nowrap shadow-md">
                      TutorKhujo HQ
                    </div>
                  </div>

                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </div>
  );
}
