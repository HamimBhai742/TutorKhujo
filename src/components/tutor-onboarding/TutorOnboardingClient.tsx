/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { HelpCircle, ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import SidebarSteps from "./steps/SidebarSteps";
import PersonalInfoStep from "./steps/PersonalInfoStep";
import EducationStep from "./steps/EducationStep";
import PreferencesStep from "./steps/PreferencesStep";
import ExperienceStep from "./steps/ExperienceStep";
import api from "@/lib/api";

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
  const { user, updateUser } = useAuth();
  
  // Active step (1 to 4)
  const [activeStep, setActiveStep] = useState<number>(1);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [stepError, setStepError] = useState<string | null>(null);
  
  // Step 1: Personal Info
  const [profilePic, setProfilePic] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [gender, setGender] = useState<string>("Male");
  const [city, setCity] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [certificateUrl, setCertificateUrl] = useState<string>("");
  const [nidCardUrl, setNidCardUrl] = useState<string>("");
  
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

  // Load profile from server DB on mount
  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        const res = await api.get("/user/me");
        const dbUser = res.data?.data;
        if (isMounted && dbUser) {
          if (dbUser.name) setFullName(dbUser.name);
          if (dbUser.dob) setDob(dbUser.dob);
          if (dbUser.gender) setGender(dbUser.gender);
          if (dbUser.city) setCity(dbUser.city);
          if (dbUser.bio) setBio(dbUser.bio);
          if (dbUser.profilePic) setProfilePic(dbUser.profilePic);
          if (Array.isArray(dbUser.qualifications) && dbUser.qualifications.length > 0) {
            setQualifications(dbUser.qualifications);
          } else if (dbUser.institution || dbUser.department) {
            setQualifications([
              {
                id: "primary",
                level: dbUser.yearOfStudy || "Bachelor's Degree",
                institution: dbUser.institution || "",
                subject: dbUser.department || "",
                result: "",
                passingYear: "2024"
              }
            ]);
          }
          if (Array.isArray(dbUser.tuitionModes) && dbUser.tuitionModes.length > 0) {
            setTuitionModes(dbUser.tuitionModes);
          }
          if (Array.isArray(dbUser.subjects) && dbUser.subjects.length > 0) {
            setSubjects(dbUser.subjects);
          }
          if (dbUser.expectedSalary) {
            setSalary(Number(dbUser.expectedSalary));
          }
          if (dbUser.availability) {
            setAvailability(dbUser.availability);
          }
          if (dbUser.totalYearsExp) {
            setTotalYearsExp(dbUser.totalYearsExp);
          }
          if (Array.isArray(dbUser.experiences) && dbUser.experiences.length > 0) {
            setExperiences(dbUser.experiences);
          }
          if (dbUser.certificateUrl) setCertificateUrl(dbUser.certificateUrl);
          if (dbUser.nidCardUrl) setNidCardUrl(dbUser.nidCardUrl);
        }
      } catch (err) {
        console.error("Failed to fetch user profile from server:", err);
        const savedData = localStorage.getItem("tutor_onboarding_data");
        if (savedData && isMounted) {
          try {
            const data = JSON.parse(savedData);
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
            if (data.certificateUrl) setCertificateUrl(data.certificateUrl);
            if (data.nidCardUrl) setNidCardUrl(data.nidCardUrl);
          } catch (_) {}
        }
      }
    };

    loadProfile();
    return () => { isMounted = false; };
  }, [user]);

  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Save Progress Function
  const saveProgress = async (silent = false) => {
    if (typeof window !== "undefined") {
      const dataToSave = {
        fullName,
        dob,
        gender,
        city,
        bio,
        qualifications,
        tuitionModes,
        subjects,
        salary,
        availability,
        totalYearsExp,
        experiences,
        profilePic,
        certificateUrl,
        nidCardUrl,
      };

      try {
        setIsSaving(true);
        const res = await api.patch("/user/me/onboard", dataToSave);
        if (res.data?.data && updateUser) {
          updateUser(res.data.data);
        }
        localStorage.removeItem("tutor_onboarding_data");
        if (!silent) {
          alert("Progress saved successfully to database!");
        }
      } catch (err: any) {
        console.error("Failed to save progress to server:", err);
        if (!silent) {
          alert(err.response?.data?.message || "Failed to save progress to server.");
        }
      } finally {
        setIsSaving(false);
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

  const validateCurrentStep = (): boolean => {
    setStepError(null);

    // Step 1: Personal Info Validation
    if (activeStep === 1) {
      if (!fullName.trim() || fullName.trim().length < 3) {
        setStepError("Please enter your full name (minimum 3 characters).");
        return false;
      }
      if (!gender || (gender !== "Male" && gender !== "Female")) {
        setStepError("Please select your gender (Male or Female).");
        return false;
      }
      if (!dob.trim()) {
        setStepError("Please enter your date of birth.");
        return false;
      }
      if (!city.trim() || city.trim().length < 2) {
        setStepError("Please specify your city or primary tuition area.");
        return false;
      }
      if (!bio.trim() || bio.trim().length < 15) {
        setStepError("Please write a short bio introducing yourself (at least 15 characters).");
        return false;
      }
      return true;
    }

    // Step 2: Education Validation
    if (activeStep === 2) {
      if (!qualifications || qualifications.length === 0) {
        setStepError("Please add at least one educational qualification.");
        return false;
      }
      const primary = qualifications[0];
      if (!primary.institution.trim() || primary.institution.trim().length < 2) {
        setStepError("Please enter your primary university/institution name.");
        return false;
      }
      if (!primary.subject.trim() || primary.subject.trim().length < 2) {
        setStepError("Please enter your department/major/field of study.");
        return false;
      }
      return true;
    }

    // Step 3: Preferences Validation
    if (activeStep === 3) {
      if (!subjects || subjects.length === 0) {
        setStepError("Please add at least one subject you wish to teach.");
        return false;
      }
      if (!tuitionModes || tuitionModes.length === 0) {
        setStepError("Please select at least one tuition mode (Home, Online, or Both).");
        return false;
      }
      if (!salary || salary <= 0) {
        setStepError("Please enter your expected minimum monthly salary.");
        return false;
      }
      return true;
    }

    // Step 4: Experience Validation
    if (activeStep === 4) {
      if (!totalYearsExp.trim()) {
        setStepError("Please select your total teaching experience.");
        return false;
      }
      return true;
    }

    return true;
  };

  // Navigation handlers
  const handleNext = async () => {
    if (!validateCurrentStep()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    await saveProgress(true);
    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowSuccessModal(true);
    }
  };

  const handleBack = () => {
    setStepError(null);
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSkip = () => {
    if (validateCurrentStep()) {
      saveProgress(true);
      window.location.href = "/dashboard";
    }
  };

  const handleFinishOnboarding = async () => {
    await saveProgress(true);
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
            {/* Step Validation Error Banner */}
            {stepError && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{stepError}</span>
              </div>
            )}

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
                certificateUrl={certificateUrl}
                setCertificateUrl={setCertificateUrl}
                nidCardUrl={nidCardUrl}
                setNidCardUrl={setNidCardUrl}
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
              disabled={isSaving || (activeStep === 1 && !fullName)}
              className="w-full sm:w-auto px-8 py-3 bg-[#F26A1B] hover:bg-[#db5b14] disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 flex items-center justify-center space-x-2 transition-all duration-200 text-xs md:text-sm cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>{activeStep === 4 ? "Complete Profile" : "Save & Continue"}</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
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
