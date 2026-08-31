/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  User, 
  BookOpen, 
  Sliders, 
  Briefcase, 
  Loader2, 
  Save, 
  CheckCircle,
  AlertCircle
} from "lucide-react";
import PersonalInfoStep from "../tutor-onboarding/steps/PersonalInfoStep";
import EducationStep from "../tutor-onboarding/steps/EducationStep";
import PreferencesStep from "../tutor-onboarding/steps/PreferencesStep";
import ExperienceStep from "../tutor-onboarding/steps/ExperienceStep";
import api from "@/lib/api";

// Interfaces
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

export default function ProfileClient() {
  const { user, updateUser } = useAuth();
  
  // Loading & Action states
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Profile Form States
  const [profilePic, setProfilePic] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [gender, setGender] = useState<string>("Male");
  const [city, setCity] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [certificateUrl, setCertificateUrl] = useState<string>("");
  const [nidCardUrl, setNidCardUrl] = useState<string>("");
  const [studentIdCardUrl, setStudentIdCardUrl] = useState<string>("");
  
  // Education States
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  
  // Preferences States
  const [tuitionModes, setTuitionModes] = useState<string[]>(["Online"]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subjectSearch, setSubjectSearch] = useState<string>("");
  const [salary, setSalary] = useState<number>(5000);
  const [videoIntroUrl, setVideoIntroUrl] = useState<string>("");
  const [curriculums, setCurriculums] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  
  // Availability States
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const times = ["Morning", "Afternoon", "Evening"];
  const DEFAULT_AVAILABILITY: Record<string, Record<string, boolean>> = {
    Morning: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
    Afternoon: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
    Evening: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false }
  };
  const [availability, setAvailability] = useState<Record<string, Record<string, boolean>>>(DEFAULT_AVAILABILITY);

  // Experience States
  const [totalYearsExp, setTotalYearsExp] = useState<string>("Less than 1 year");
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const subjectSuggestions = ["Chemistry", "Algebra", "Linear Algebra", "Programming", "Biology", "English", "ICT"];

  // Fetch current user details from DB
  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        setLoading(true);
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
          if (dbUser.studentIdCardUrl) setStudentIdCardUrl(dbUser.studentIdCardUrl);
          if (Array.isArray(dbUser.curriculums)) setCurriculums(dbUser.curriculums);
          if (Array.isArray(dbUser.specializations)) setSpecializations(dbUser.specializations);
        }
      } catch (err) {
        console.error("Failed to load profile details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => { isMounted = false; };
  }, []);

  // Qualification Handlers
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

  // Preference Handlers
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
    setAvailability((prev) => {
      const current = prev || DEFAULT_AVAILABILITY;
      const timeObj = current[time] || DEFAULT_AVAILABILITY[time] || {};
      return {
        ...current,
        [time]: {
          ...timeObj,
          [day]: !timeObj[day]
        }
      };
    });
  };

  const handleToggleCurriculum = (curr: string) => {
    setCurriculums((prev) =>
      prev.includes(curr) ? prev.filter((c) => c !== curr) : [...prev, curr]
    );
  };

  const handleToggleSpecialization = (spec: string) => {
    setSpecializations((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  // Experience Handlers
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Profile Save handler
  const handleSaveProfile = async () => {
    setSaveStatus(null);
    setIsSaving(true);

    const payload: any = {
      fullName,
      dob,
      gender,
      city,
      bio,
      profilePic,
    };

    if (user?.role === "tutor") {
      payload.qualifications = qualifications;
      payload.tuitionModes = tuitionModes;
      payload.subjects = subjects;
      payload.expectedSalary = Number(salary);
      payload.availability = availability;
      payload.totalYearsExp = totalYearsExp;
      payload.experiences = experiences;
      payload.certificateUrl = certificateUrl;
      payload.nidCardUrl = nidCardUrl;
      payload.studentIdCardUrl = studentIdCardUrl;
      payload.videoIntroUrl = videoIntroUrl;
      payload.curriculums = curriculums;
      payload.specializations = specializations;
    }

    try {
      const endpoint = "/user/me";
      const res = await api.patch(endpoint, payload);
      
      if (res.data?.data && updateUser) {
        updateUser(res.data.data);
      }

      setSaveStatus({
        type: "success",
        message: "Your profile details have been saved successfully!"
      });
      
      // Auto-clear notification after 4s
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err: any) {
      console.error("Save profile error:", err);
      setSaveStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to update profile settings."
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-87.5 gap-3">
        <Loader2 className="w-8 h-8 text-[#0F5B47] animate-spin" />
        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Loading your profile details...</p>
      </div>
    );
  }

  const isTutor = user?.role === "tutor";

  return (
    <div className="flex flex-col xl:flex-row w-full gap-8 max-w-6xl mx-auto">
      {/* Sidebar navigation tabs (Desktop) / Row (Mobile) */}
      <aside className="xl:w-64 shrink-0 flex flex-col gap-2">
        <div className="flex flex-row xl:flex-col overflow-x-auto xl:overflow-x-visible pb-2 xl:pb-0 gap-1.5 border-b xl:border-b-0 border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab("personal")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              activeTab === "personal"
                ? "bg-[#0F5B47] text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Personal & ID Docs</span>
          </button>
          
          {isTutor && (
            <>
              <button
                onClick={() => setActiveTab("education")}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === "education"
                    ? "bg-[#0F5B47] text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Education Details</span>
              </button>

              <button
                onClick={() => setActiveTab("preferences")}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === "preferences"
                    ? "bg-[#0F5B47] text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Tuition Preferences</span>
              </button>

              <button
                onClick={() => setActiveTab("experience")}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === "experience"
                    ? "bg-[#0F5B47] text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Teaching Experience</span>
              </button>
            </>
          )}
        </div>

        {/* Save button card */}
        <div className="hidden xl:block p-4 border border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-500/5 dark:bg-zinc-900/20 mt-4 space-y-4">
          <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
            Ensure all tabs are updated correctly before submitting. Changing preferences will update live search filters instantly.
          </p>
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#0F5B47] hover:bg-[#0c4a39] text-white font-bold rounded-2xl text-xs transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Details</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Form Fields Container */}
      <main className="flex-1 flex flex-col gap-6">
        {/* Success / Error Banners */}
        {saveStatus && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 border text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-2 duration-300 ${
              saveStatus.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
            }`}
          >
            {saveStatus.type === "success" ? (
              <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            <span>{saveStatus.message}</span>
          </div>
        )}

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs">
          {activeTab === "personal" && (
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
              studentIdCardUrl={studentIdCardUrl}
              setStudentIdCardUrl={setStudentIdCardUrl}
              fileInputRef={fileInputRef}
              triggerFileInput={triggerFileInput}
            />
          )}

          {isTutor && activeTab === "education" && (
            <EducationStep
              qualifications={qualifications}
              handleAddQualification={handleAddQualification}
              handleUpdateQualification={handleUpdateQualification}
              handleDeleteQualification={handleDeleteQualification}
            />
          )}

          {isTutor && activeTab === "preferences" && (
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
              videoIntroUrl={videoIntroUrl}
              setVideoIntroUrl={setVideoIntroUrl}
              curriculums={curriculums}
              handleToggleCurriculum={handleToggleCurriculum}
              specializations={specializations}
              handleToggleSpecialization={handleToggleSpecialization}
            />
          )}

          {isTutor && activeTab === "experience" && (
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

        {/* Save button (Mobile only) */}
        <div className="xl:hidden">
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#0F5B47] hover:bg-[#0c4a39] text-white font-bold rounded-2xl text-xs transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Details</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
