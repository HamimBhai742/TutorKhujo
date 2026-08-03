/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { HelpCircle, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import SidebarSteps from "./steps/SidebarSteps";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import EducationStep from "./steps/EducationStep";
import PreferencesStep from "./steps/PreferencesStep";
import ExperienceStep from "./steps/ExperienceStep";

// Types
interface Qualification {
  id: string;
  level: string;
  institution: string;
  subject: string;
  result: string;
  passingYear: string;
}

interface ExperienceEntry {
  id: string;
  title: string;
  institution: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export default function TutorOnboardingClient() {
  const { user } = useAuth();
  
  // Active step (1 to 4)
  const [activeStep, setActiveStep] = useState<number>(1);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  
  // Step 1: Personal Info
  const [profilePic, setProfilePic] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [gender, setGender] = useState<string>("Male");
  const [city, setCity] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  
  // Step 2: Education
  const [qualifications, setQualifications] = useState<Qualification[]>([
    {
      id: "primary",
      level: "Bachelor's Degree",
      institution: "Stanford University",
      subject: "Mathematics & Pedagogy",
      result: "3.92",
      passingYear: "2022"
    }
  ]);
  
  // Step 3: Preferences
  const [tuitionModes, setTuitionModes] = useState<string[]>(["Online"]);
  const [subjects, setSubjects] = useState<string[]>(["Mathematics", "Physics", "Calculus"]);
  const [subjectSearch, setSubjectSearch] = useState<string>("");
  const [salary, setSalary] = useState<number>(5000);
  
  // Availability Matrix: rows = Morning/Afternoon/Evening, cols = Mon/Tue/Wed/Thu/Fri/Sat/Sun
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const times = ["Morning", "Afternoon", "Evening"];
  const [availability, setAvailability] = useState<Record<string, Record<string, boolean>>>({
    Morning: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
    Afternoon: { Mon: true, Tue: true, Wed: true, Thu: false, Fri: false, Sat: false, Sun: false },
    Evening: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: true, Sun: true }
  });
  
  // Step 4: Experience
  const [totalYearsExp, setTotalYearsExp] = useState<string>("Less than 1 year");
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([
    {
      id: "exp-1",
      title: "Mathematics Teacher",
      institution: "Dhaka Science Academy",
      startDate: "",
      endDate: "",
      isCurrent: true,
      description: ""
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("tutor_onboarding_data");
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          // Defer the state updates to avoid synchronous setState calls within the effect
          setTimeout(() => {
            if (data.fullName) setFullName(data.fullName);
            if (data.dob) setDob(data.dob);
            if (data.gender) setGender(data.gender);
            if (data.city) setCity(data.city);
            if (data.bio) setBio(data.bio);
            if (data.qualifications) setQualifications(data.qualifications);
            if (data.tuitionModes) setTuitionModes(data.tuitionModes);
            if (data.subjects) setSubjects(data.subjects);
            if (data.salary) setSalary(data.salary);
            if (data.availability) setAvailability(data.availability);
            if (data.totalYearsExp) setTotalYearsExp(data.totalYearsExp);
            if (data.experiences) setExperiences(data.experiences);
            if (data.profilePic) setProfilePic(data.profilePic);
          }, 0);
        } catch (e) {
          console.error("Error loading onboarding data from localStorage:", e);
        }
      } else if (user?.name) {
        setTimeout(() => {
          setFullName(user.name);
        }, 0);
      }
    }
  }, [user]);

  // Save Progress Function
  const saveProgress = (silent = false) => {
    if (typeof window !== "undefined") {
      const dataToSave = {
        fullName, dob, gender, city, bio,
        qualifications, tuitionModes, subjects, salary, availability,
        totalYearsExp, experiences, profilePic
      };
      localStorage.setItem("tutor_onboarding_data", JSON.stringify(dataToSave));
      if (!silent) {
        alert("Progress saved successfully! You can resume or edit anytime.");
      }
    }
  };

  // Image Upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Step 2 Handlers
  const handleAddQualification = () => {
    setQualifications([
      ...qualifications,
      {
        id: `qual-${Date.now()}`,
        level: "Bachelor's Degree",
        institution: "",
        subject: "",
        result: "",
        passingYear: "2024"
      }
    ]);
  };

  const handleUpdateQualification = (id: string, field: keyof Qualification, value: string) => {
    setQualifications(
      qualifications.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleDeleteQualification = (id: string) => {
    setQualifications(qualifications.filter((q) => q.id !== id));
  };

  // Step 3 Handlers
  const handleToggleTuitionMode = (mode: string) => {
    if (tuitionModes.includes(mode)) {
      if (tuitionModes.length > 1) {
        setTuitionModes(tuitionModes.filter((m) => m !== mode));
      }
    } else {
      setTuitionModes([...tuitionModes, mode]);
    }
  };

  const handleAddSubject = (subjectName: string) => {
    const cleanSub = subjectName.trim();
    if (cleanSub && !subjects.includes(cleanSub)) {
      setSubjects([...subjects, cleanSub]);
    }
    setSubjectSearch("");
  };

  const handleRemoveSubject = (sub: string) => {
    setSubjects(subjects.filter((s) => s !== sub));
  };

  const handleToggleAvailability = (time: string, day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [time]: {
        ...prev[time],
        [day]: !prev[time][day]
      }
    }));
  };

  // Step 4 Handlers
  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: `exp-${Date.now()}`,
        title: "",
        institution: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: ""
      }
    ]);
  };

  const handleUpdateExperience = (id: string, field: keyof ExperienceEntry, value: any) => {
    setExperiences(
      experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
  };

  // Navigation handlers
  const handleNext = () => {
    saveProgress(true);
    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
      window.scrollTo(0, 0);
    } else {
      setShowSuccessModal(true);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSkip = () => {
    saveProgress(true);
    window.location.href = "/dashboard";
  };

  const handleFinishOnboarding = () => {
    window.location.href = "/dashboard";
  };

  // Suggestions for subjects
  const subjectSuggestions = ["Chemistry", "Algebra", "Linear Algebra", "Programming", "Biology", "English", "ICT"];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col font-sans transition-colors duration-200">
      
      {/* Premium Header */}
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800/80 px-6 py-4 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl md:text-2xl font-extrabold text-[#0F5B47] dark:text-[#188c6e] tracking-tight">
            TutorKhujo
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <button className="text-zinc-500 hover:text-[#0F5B47] dark:text-zinc-400 dark:hover:text-[#188c6e] transition-colors cursor-pointer">
            <HelpCircle className="w-5.5 h-5.5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#0F5B47] text-white flex items-center justify-center font-bold text-xs">
            {fullName ? fullName.charAt(0).toUpperCase() : "T"}
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto container px-4 lg:px-6 py-8 gap-8">
        
        {/* Left Sidebar - Step Navigation */}
        <aside className="lg:w-64 shrink-0 flex flex-col justify-between bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 h-fit sticky lg:top-24">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white">Complete Profile</h2>
              <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 font-medium">Step {activeStep} of 4</p>
            </div>

            {/* Sidebar indicator steps */}
            <SidebarSteps activeStep={activeStep} setActiveStep={setActiveStep} fullName={fullName} />
          </div>

          <button
            onClick={() => saveProgress()}
            className="w-full mt-8 py-3 bg-[#5F6E6B] hover:bg-[#4E5B58] dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold rounded-2xl shadow-sm text-xs transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Save Progress</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col justify-between">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm p-6 md:p-10 space-y-8 min-h-125">
            
            {/* Step 1: Personal Info */}
            {activeStep === 1 && (
              <PersonalInfoStep
                fullName={fullName}
                setFullName={setFullName}
                dob={dob}
                setDob={setDob}
                gender={gender}
                setGender={setGender}
                city={city}
                setCity={setCity}
                bio={bio}
                setBio={setBio}
                profilePic={profilePic}
                setProfilePic={setProfilePic}
                fileInputRef={fileInputRef}
                handleImageChange={handleImageChange}
                triggerFileInput={triggerFileInput}
              />
            )}

            {/* Step 2: Education */}
            {activeStep === 2 && (
              <EducationStep
                qualifications={qualifications}
                handleAddQualification={handleAddQualification}
                handleUpdateQualification={handleUpdateQualification}
                handleDeleteQualification={handleDeleteQualification}
              />
            )}

            {/* Step 3: Preferences */}
            {activeStep === 3 && (
              <PreferencesStep
                tuitionModes={tuitionModes}
                handleToggleTuitionMode={handleToggleTuitionMode}
                subjects={subjects}
                handleAddSubject={handleAddSubject}
                handleRemoveSubject={handleRemoveSubject}
                subjectSearch={subjectSearch}
                setSubjectSearch={setSubjectSearch}
                salary={salary}
                setSalary={setSalary}
                availability={availability}
                handleToggleAvailability={handleToggleAvailability}
                days={days}
                times={times}
                subjectSuggestions={subjectSuggestions}
              />
            )}

            {/* Step 4: Experience */}
            {activeStep === 4 && (
              <ExperienceStep
                totalYearsExp={totalYearsExp}
                setTotalYearsExp={setTotalYearsExp}
                experiences={experiences}
                handleAddExperience={handleAddExperience}
                handleUpdateExperience={handleUpdateExperience}
                handleDeleteExperience={handleDeleteExperience}
              />
            )}

          </div>

          {/* Action Buttons Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800/80">
            {activeStep > 1 ? (
              <button
                onClick={handleBack}
                className="w-full sm:w-auto px-6 py-3 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs md:text-sm rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                onClick={handleSkip}
                className="w-full sm:w-auto px-6 py-3 text-zinc-550 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors font-bold text-xs md:text-sm cursor-pointer text-center"
              >
                Skip for now
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={activeStep === 1 && !fullName}
              className="w-full sm:w-auto px-8 py-3 bg-[#F26A1B] hover:bg-[#db5b14] disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 flex items-center justify-center space-x-2 transition-all duration-200 text-xs md:text-sm cursor-pointer"
            >
              <span>{activeStep === 4 ? "Complete Profile" : "Save & Continue"}</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </main>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-[2.5rem] shadow-2xl p-8 w-full max-w-md mx-4 space-y-6 text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Profile Completed!</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Fantastic! Your tutor profile has been successfully set up. Students and parents will now be able to search and view your credentials.
              </p>
            </div>
            <button
              onClick={handleFinishOnboarding}
              className="w-full py-3.5 bg-[#0F5B47] hover:bg-[#0c4a3a] text-white font-bold rounded-2xl shadow-md transition-all cursor-pointer text-xs md:text-sm"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
