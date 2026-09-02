/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  User, 
  Sliders, 
  Briefcase, 
  Loader2, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Edit3,
  ExternalLink,
  Share2,
  Camera,
  MapPin,
  Calendar,
  DollarSign,
  ShieldCheck,
  GraduationCap,
  Clock,
  Plus,
  Trash2,
  FileText,
  Video,
  Eye,
  X,
  Award
} from "lucide-react";
import api from "@/lib/api";
import LocationAutocomplete from "@/components/shared/LocationAutocomplete";

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
  const isTutor = user?.role === "tutor";
  
  // UI & Action States
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [activeEditTab, setActiveEditTab] = useState<string>("personal");
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [previewModalImg, setPreviewModalImg] = useState<{ url: string; title: string } | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

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
  const subjectSuggestions = [
    "Physics", "Chemistry", "Higher Math", "General Math", "Biology", 
    "English", "ICT", "Bangla", "Accounting", "Economics", "Computer Science"
  ];

  // Fetch current user details from DB
  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/user/me");
        const dbUser = res.data?.data;
        if (isMounted && dbUser) {
          if (dbUser.fullName || dbUser.name) setFullName(dbUser.fullName || dbUser.name);
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
          } else if (dbUser.salary) {
            setSalary(Number(dbUser.salary));
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
          if (dbUser.videoIntroUrl) setVideoIntroUrl(dbUser.videoIntroUrl);
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

  // Calculate profile strength percentage
  const calculateProfileStrength = () => {
    let score = 0;
    if (fullName) score += 15;
    if (profilePic) score += 15;
    if (bio && bio.length > 20) score += 15;
    if (city) score += 10;
    if (dob) score += 5;
    if (isTutor) {
      if (qualifications.length > 0) score += 15;
      if (subjects.length > 0) score += 10;
      if (nidCardUrl || studentIdCardUrl || certificateUrl) score += 10;
      if (videoIntroUrl) score += 5;
    } else {
      score += 40; // baseline for student
    }
    return Math.min(score, 100);
  };

  const strength = calculateProfileStrength();

  // File Upload Handler (with backend R2 support)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
    fieldName: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadingField(fieldName);

      if (file.type.startsWith("image/")) {
        const localPreview = URL.createObjectURL(file);
        setter(localPreview);
      }

      try {
        const formData = new FormData();
        formData.append("file", file);
        const folder = fieldName === "profilePic" ? "avatars" : "verifications";

        const res = await api.post(`/user/upload?folder=${folder}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data?.data?.url) {
          setter(res.data.data.url);
          setSaveStatus({
            type: "success",
            message: `${fieldName === "profilePic" ? "Profile picture" : "Document"} uploaded successfully! Remember to update your profile.`
          });
          setTimeout(() => setSaveStatus(null), 3000);
          return;
        }
      } catch (err) {
        console.error("Direct upload failed, falling back to local preview:", err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setter(reader.result as string);
        };
        reader.readAsDataURL(file);
      } finally {
        setUploadingField(null);
      }
    }
  };

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
        passingYear: `${new Date().getFullYear()}`
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

  // Save / Update Profile handler
  const handleUpdateProfile = async () => {
    setSaveStatus(null);
    setIsSaving(true);

    const payload: any = {
      fullName,
      name: fullName,
      dob,
      gender,
      city,
      bio,
      profilePic,
    };

    if (isTutor) {
      payload.qualifications = qualifications;
      payload.tuitionModes = tuitionModes;
      payload.subjects = subjects;
      payload.expectedSalary = Number(salary);
      payload.salary = Number(salary);
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
      const res = await api.patch("/user/me", payload);
      
      if (res.data?.data && updateUser) {
        updateUser(res.data.data);
      }

      setSaveStatus({
        type: "success",
        message: "Profile updated successfully! All changes are now live."
      });
      
      // Return to view mode so user sees their updated sleek profile
      setIsEditMode(false);
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err: any) {
      console.error("Update profile error:", err);
      setSaveStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to update profile settings. Please check your network and try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const copyProfileLink = () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/tutors/${user?.id}` : "";
    if (url) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const openEditTab = (tabName: string) => {
    setActiveEditTab(tabName);
    setIsEditMode(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin" />
          <User className="w-6 h-6 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300 animate-pulse">Loading your profile details...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Toast Notification Banner */}
      {saveStatus && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 border text-sm font-semibold shadow-lg backdrop-blur-md transition-all ${
            saveStatus.type === "success"
              ? "bg-emerald-50/90 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200"
              : "bg-rose-50/90 dark:bg-rose-950/80 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {saveStatus.type === "success" ? (
              <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            <span>{saveStatus.message}</span>
          </div>
          <button 
            onClick={() => setSaveStatus(null)}
            className="p-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* HERO BANNER & EXECUTIVE PROFILE HEADER */}
      {/* ========================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md">
        {/* Cover Gradient Backdrop */}
        <div className="h-44 md:h-52 w-full bg-linear-to-r from-[#07362a] via-[#0F5B47] to-[#147a5f] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px]" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
              {isTutor ? (
                <Award className="w-3.5 h-3.5 text-emerald-300" />
              ) : (
                <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />
              )}
              {isTutor ? "Tutor Profile" : "Student Profile"}
            </span>
          </div>
        </div>

        {/* Header Profile Body */}
        <div className="px-6 md:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20">
            {/* Avatar & Main Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              {/* Avatar with Upload Hover Trigger */}
              <div className="relative group shrink-0">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl border-4 border-white dark:border-zinc-900 shadow-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center relative">
                  {profilePic ? (
                    <Image
                      src={profilePic}
                      alt={fullName || "User"}
                      width={144}
                      height={144}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <User className="w-16 h-16 text-zinc-400" />
                  )}
                  {uploadingField === "profilePic" && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                      <Loader2 className="w-7 h-7 text-white animate-spin" />
                    </div>
                  )}
                </div>

                {/* Camera upload overlay button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Change Profile Photo"
                  disabled={uploadingField === "profilePic"}
                  className="absolute bottom-2 right-2 p-2.5 rounded-2xl bg-[#0F5B47] hover:bg-[#0b4737] text-white shadow-lg cursor-pointer border-2 border-white dark:border-zinc-900 transition-transform active:scale-95 group-hover:scale-105"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, setProfilePic, "profilePic")}
                />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-1.5 pt-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                    {fullName || "Your Full Name"}
                  </h1>
                  {isTutor && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Verified
                    </span>
                  )}
                </div>

                <p className="text-xs md:text-sm font-medium text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1">
                  {city ? (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0F5B47]" />
                      {city}
                    </span>
                  ) : (
                    <span className="text-zinc-400 italic">No location set</span>
                  )}
                  {isTutor && totalYearsExp && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#0F5B47]" />
                      {totalYearsExp} experience
                    </span>
                  )}
                  {isTutor && salary > 0 && (
                    <span className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
                      <DollarSign className="w-3.5 h-3.5" />
                      ৳ {salary.toLocaleString()} / mo
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 pt-4 md:pt-0">
              {isTutor && user?.id && (
                <Link
                  href={`/tutors/${user.id}`}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <ExternalLink className="w-4 h-4 text-zinc-500" />
                  <span>Public View</span>
                </Link>
              )}

              {isTutor && (
                <button
                  onClick={copyProfileLink}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Share2 className="w-4 h-4 text-zinc-500" />
                  <span>{copiedLink ? "Copied Link!" : "Share"}</span>
                </button>
              )}

              {/* Edit / View Mode Toggle Button */}
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                  isEditMode
                    ? "bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
                    : "bg-[#0F5B47] hover:bg-[#0b4737] text-white shadow-emerald-950/20"
                }`}
              >
                {isEditMode ? (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>View Profile</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>

              {/* Direct Update Button when in Edit Mode */}
              {isEditMode && (
                <button
                  onClick={handleUpdateProfile}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0F5B47] hover:bg-[#0b4737] text-white text-xs font-extrabold shadow-md cursor-pointer transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Update Profile</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Profile Strength Progress Bar */}
          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-zinc-700 dark:text-zinc-200">
                  Profile Strength
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {strength}%
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-medium">
                {strength === 100
                  ? "🎉 Amazing! Your profile is 100% complete."
                  : "Complete all sections to rank higher in student tutor searches."}
              </span>
            </div>
            <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-emerald-500 to-[#0F5B47] transition-all duration-500 rounded-full"
                style={{ width: `${strength}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODE 1: EDIT MODE (RICH PROFILE EDITOR STUDIO) */}
      {/* ========================================================= */}
      {isEditMode ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Top Sticky Bar for Editor */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#0F5B47] text-white">
                <Edit3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Profile Editor Studio
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Update any field below and click &quot;Update Profile&quot; to apply your changes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateProfile}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0F5B47] hover:bg-[#0b4737] text-white text-xs font-bold shadow-md cursor-pointer transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Editor Tab Navigation */}
            <aside className="lg:w-64 shrink-0 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2">
              <button
                type="button"
                onClick={() => setActiveEditTab("personal")}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  activeEditTab === "personal"
                    ? "bg-[#0F5B47] text-white shadow-sm"
                    : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Personal & Bio</span>
              </button>

              {isTutor && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveEditTab("education")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                      activeEditTab === "education"
                        ? "bg-[#0F5B47] text-white shadow-sm"
                        : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Education & Degrees</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveEditTab("preferences")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                      activeEditTab === "preferences"
                        ? "bg-[#0F5B47] text-white shadow-sm"
                        : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Tuition & Salary</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveEditTab("experience")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                      activeEditTab === "experience"
                        ? "bg-[#0F5B47] text-white shadow-sm"
                        : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Experience History</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveEditTab("availability")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                      activeEditTab === "availability"
                        ? "bg-[#0F5B47] text-white shadow-sm"
                        : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Weekly Availability</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveEditTab("documents")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                      activeEditTab === "documents"
                        ? "bg-[#0F5B47] text-white shadow-sm"
                        : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>ID & Documents</span>
                  </button>
                </>
              )}
            </aside>

            {/* Active Editor Panel Content */}
            <main className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-sm">
              {/* TAB 1: PERSONAL & BIO */}
              {activeEditTab === "personal" && (
                <div className="space-y-6">
                  <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                      Personal Information & Bio
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Update your identity and personal profile overview.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alex Richardson"
                        className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-sm"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                        City / Location
                      </label>
                      <LocationAutocomplete
                        value={city}
                        onChange={setCity}
                        placeholder="e.g. Rampura, Dhaka"
                        inputClassName="bg-zinc-50/50 dark:bg-zinc-950"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                        Professional Bio / About Me
                      </label>
                      <span className="text-[11px] text-zinc-400 font-bold">{bio.length} / 500 characters</span>
                    </div>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value.substring(0, 500))}
                      rows={5}
                      placeholder="Tell students and guardians about your teaching philosophy, subjects of expertise, and academic milestones..."
                      className="w-full p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-sm leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: EDUCATION (TUTOR ONLY) */}
              {isTutor && activeEditTab === "education" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                        Academic Qualifications
                      </h2>
                      <p className="text-xs text-zinc-500">
                        Add your degrees, universities, and academic results.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddQualification}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F5B47] hover:bg-[#0b4737] text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Degree</span>
                    </button>
                  </div>

                  {qualifications.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
                      <GraduationCap className="w-10 h-10 text-zinc-400 mx-auto" />
                      <p className="text-xs text-zinc-500 font-medium">
                        No academic qualifications added yet.
                      </p>
                      <button
                        type="button"
                        onClick={handleAddQualification}
                        className="px-4 py-2 rounded-xl bg-[#0F5B47] text-white text-xs font-bold"
                      >
                        Add Your First Qualification
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {qualifications.map((q, idx) => (
                        <div
                          key={q.id || idx}
                          className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/40 dark:bg-zinc-950 space-y-4 relative group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                              Qualification #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteQualification(q.id)}
                              className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title="Remove Qualification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-zinc-500 uppercase">
                                Degree / Level
                              </label>
                              <select
                                value={q.level}
                                onChange={(e) => handleUpdateQualification(q.id, "level", e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0F5B47]"
                              >
                                <option value="Secondary (SSC / O Levels)">Secondary (SSC / O Levels)</option>
                                <option value="Higher Secondary (HSC / A Levels)">Higher Secondary (HSC / A Levels)</option>
                                <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
                                <option value="Master's Degree">Master&apos;s Degree</option>
                                <option value="Doctorate (PhD)">Doctorate (PhD)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-zinc-500 uppercase">
                                Institution / University
                              </label>
                              <input
                                type="text"
                                value={q.institution}
                                onChange={(e) => handleUpdateQualification(q.id, "institution", e.target.value)}
                                placeholder="e.g. University of Dhaka, BUET"
                                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0F5B47]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-zinc-500 uppercase">
                                Subject / Department
                              </label>
                              <input
                                type="text"
                                value={q.subject}
                                onChange={(e) => handleUpdateQualification(q.id, "subject", e.target.value)}
                                placeholder="e.g. Computer Science & Engineering"
                                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0F5B47]"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-zinc-500 uppercase">
                                  Result / GPA
                                </label>
                                <input
                                  type="text"
                                  value={q.result}
                                  onChange={(e) => handleUpdateQualification(q.id, "result", e.target.value)}
                                  placeholder="e.g. 3.85 / 4.00"
                                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0F5B47]"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-zinc-500 uppercase">
                                  Passing Year
                                </label>
                                <input
                                  type="text"
                                  value={q.passingYear}
                                  onChange={(e) => handleUpdateQualification(q.id, "passingYear", e.target.value)}
                                  placeholder="e.g. 2024"
                                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0F5B47]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PREFERENCES & SALARY (TUTOR ONLY) */}
              {isTutor && activeEditTab === "preferences" && (
                <div className="space-y-6">
                  <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                      Tuition Preferences & Rates
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Configure your preferred subjects, tuition modes, and expected salary.
                    </p>
                  </div>

                  {/* Tuition Modes */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                      Tuition Modes
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {["Online", "Home Tutoring", "Group Tuition"].map((mode) => {
                        const isSelected = tuitionModes.includes(mode);
                        return (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => handleToggleTuitionMode(mode)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#0F5B47] text-white border-[#0F5B47] shadow-xs"
                                : "bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100"
                            }`}
                          >
                            {mode}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expected Salary */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                        Expected Monthly Remuneration (BDT)
                      </label>
                      <span className="text-sm font-extrabold text-emerald-800 dark:text-emerald-400">
                        ৳ {salary.toLocaleString()} / month
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="2000"
                        max="30000"
                        step="500"
                        value={salary}
                        onChange={(e) => setSalary(Number(e.target.value))}
                        className="w-full accent-[#0F5B47] cursor-pointer"
                      />
                      <input
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(Number(e.target.value))}
                        className="w-28 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-900 dark:text-white text-center"
                      />
                    </div>
                  </div>

                  {/* Subjects Picker */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                      Subjects You Teach
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={subjectSearch}
                        onChange={(e) => setSubjectSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSubject(subjectSearch);
                          }
                        }}
                        placeholder="Type a subject name and press Enter..."
                        className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F5B47]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddSubject(subjectSearch)}
                        className="px-4 py-2.5 rounded-xl bg-[#0F5B47] hover:bg-[#0b4737] text-white text-xs font-bold cursor-pointer transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    {/* Selected subjects */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {subjects.map((sub) => (
                        <span
                          key={sub}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        >
                          <span>{sub}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubject(sub)}
                            className="text-emerald-600 hover:text-emerald-950 dark:hover:text-emerald-100 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Quick suggestion tags */}
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-zinc-400 block mb-1.5">
                        Quick Suggestions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {subjectSuggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleAddSubject(s)}
                            disabled={subjects.includes(s)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-emerald-500 disabled:opacity-40 cursor-pointer"
                          >
                            + {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Curriculums */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                      Target Curriculums
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Bangla Medium", "English Version", "English Medium (Cambridge / Edexcel)", "Madrasah"].map((curr) => {
                        const isSelected = curriculums.includes(curr);
                        return (
                          <button
                            key={curr}
                            type="button"
                            onClick={() => handleToggleCurriculum(curr)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border-emerald-400"
                                : "bg-zinc-50 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                            }`}
                          >
                            {curr}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                      Specializations & Focus Areas
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["University Admission", "BUET/Medical Prep", "Board Exam Prep", "Spoken English", "Crash Course", "Skill Development"].map((spec) => {
                        const isSelected = specializations.includes(spec);
                        return (
                          <button
                            key={spec}
                            type="button"
                            onClick={() => handleToggleSpecialization(spec)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border-emerald-400"
                                : "bg-zinc-50 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                            }`}
                          >
                            {spec}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TEACHING EXPERIENCE (TUTOR ONLY) */}
              {isTutor && activeEditTab === "experience" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                        Teaching Experience History
                      </h2>
                      <p className="text-xs text-zinc-500">
                        Highlight your coaching, school, or private tutoring background.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddExperience}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F5B47] hover:bg-[#0b4737] text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Experience</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">
                      Total Years of Teaching Experience
                    </label>
                    <select
                      value={totalYearsExp}
                      onChange={(e) => setTotalYearsExp(e.target.value)}
                      className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs"
                    >
                      <option value="Less than 1 year">Less than 1 year</option>
                      <option value="1 - 2 years">1 - 2 years</option>
                      <option value="3 - 5 years">3 - 5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>

                  {experiences.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
                      <Briefcase className="w-10 h-10 text-zinc-400 mx-auto" />
                      <p className="text-xs text-zinc-500 font-medium">
                        No previous experience entries added yet.
                      </p>
                      <button
                        type="button"
                        onClick={handleAddExperience}
                        className="px-4 py-2 rounded-xl bg-[#0F5B47] text-white text-xs font-bold"
                      >
                        Add An Experience
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {experiences.map((exp, idx) => (
                        <div
                          key={exp.id || idx}
                          className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/40 dark:bg-zinc-950 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                              Role #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteExperience(exp.id)}
                              className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title="Remove Entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-zinc-500 uppercase">
                                Job Title / Role
                              </label>
                              <input
                                type="text"
                                value={exp.title}
                                onChange={(e) => handleUpdateExperience(exp.id, "title", e.target.value)}
                                placeholder="e.g. Senior Math Instructor"
                                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-zinc-500 uppercase">
                                Organization / Coaching
                              </label>
                              <input
                                type="text"
                                value={exp.institution}
                                onChange={(e) => handleUpdateExperience(exp.id, "institution", e.target.value)}
                                placeholder="e.g. Udvash / Private Tutoring"
                                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-zinc-500 uppercase">
                                Start Date
                              </label>
                              <input
                                type="text"
                                value={exp.startDate}
                                onChange={(e) => handleUpdateExperience(exp.id, "startDate", e.target.value)}
                                placeholder="e.g. Jan 2022"
                                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-zinc-500 uppercase">
                                End Date
                              </label>
                              <input
                                type="text"
                                value={exp.endDate}
                                onChange={(e) => handleUpdateExperience(exp.id, "endDate", e.target.value)}
                                placeholder="e.g. Present / Dec 2023"
                                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-zinc-500 uppercase">
                              Description & Key Achievements
                            </label>
                            <textarea
                              rows={2}
                              value={exp.description}
                              onChange={(e) => handleUpdateExperience(exp.id, "description", e.target.value)}
                              placeholder="Briefly describe your responsibilities and student pass rate..."
                              className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: AVAILABILITY (TUTOR ONLY) */}
              {isTutor && activeEditTab === "availability" && (
                <div className="space-y-6">
                  <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                      Weekly Availability Grid
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Click the slots to toggle when you are free to conduct tutoring sessions.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-center">
                      <thead>
                        <tr>
                          <th className="p-3 text-left text-xs font-bold text-zinc-500 uppercase">
                            Time Slot
                          </th>
                          {days.map((day) => (
                            <th key={day} className="p-3 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {times.map((time) => (
                          <tr key={time}>
                            <td className="p-3 text-left text-xs font-bold text-zinc-800 dark:text-zinc-200">
                              {time}
                            </td>
                            {days.map((day) => {
                              const active = availability?.[time]?.[day];
                              return (
                                <td key={day} className="p-2">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleAvailability(time, day)}
                                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                      active
                                        ? "bg-[#0F5B47] text-white shadow-xs"
                                        : "bg-zinc-100 dark:bg-zinc-800/60 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                    }`}
                                  >
                                    {active ? "Free" : "—"}
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: DOCUMENTS & VERIFICATIONS (TUTOR ONLY) */}
              {isTutor && activeEditTab === "documents" && (
                <div className="space-y-6">
                  <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                      ID & Verification Documents
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Upload your official NID, Student ID, or Certificates to earn the Verified Tutor badge.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* NID Card */}
                    <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/40 dark:bg-zinc-950 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-[#0F5B47]" />
                          <span>National ID Card (NID)</span>
                        </h4>
                        {nidCardUrl && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                            Uploaded
                          </span>
                        )}
                      </div>
                      {nidCardUrl ? (
                        <div className="relative rounded-xl overflow-hidden h-36 border border-zinc-200 dark:border-zinc-800">
                          <Image src={nidCardUrl} alt="NID Card" fill className="object-cover" unoptimized />
                          <button
                            type="button"
                            onClick={() => setPreviewModalImg({ url: nidCardUrl, title: "NID Card Preview" })}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-bold"
                          >
                            Click to View
                          </button>
                        </div>
                      ) : (
                        <div className="h-32 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-400 gap-1">
                          <FileText className="w-8 h-8 text-zinc-300" />
                          <span className="text-[11px]">No NID uploaded yet</span>
                        </div>
                      )}
                      <label className="block">
                        <span className="sr-only">Upload NID</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, setNidCardUrl, "nid")}
                          className="block w-full text-xs text-zinc-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0F5B47] file:text-white hover:file:bg-[#0b4737] cursor-pointer"
                        />
                      </label>
                    </div>

                    {/* Student ID Card */}
                    <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/40 dark:bg-zinc-950 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-[#0F5B47]" />
                          <span>Student ID / Institutional ID</span>
                        </h4>
                        {studentIdCardUrl && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                            Uploaded
                          </span>
                        )}
                      </div>
                      {studentIdCardUrl ? (
                        <div className="relative rounded-xl overflow-hidden h-36 border border-zinc-200 dark:border-zinc-800">
                          <Image src={studentIdCardUrl} alt="Student ID" fill className="object-cover" unoptimized />
                          <button
                            type="button"
                            onClick={() => setPreviewModalImg({ url: studentIdCardUrl, title: "Student ID Preview" })}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-bold"
                          >
                            Click to View
                          </button>
                        </div>
                      ) : (
                        <div className="h-32 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-400 gap-1">
                          <GraduationCap className="w-8 h-8 text-zinc-300" />
                          <span className="text-[11px]">No Student ID uploaded</span>
                        </div>
                      )}
                      <label className="block">
                        <span className="sr-only">Upload Student ID</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, setStudentIdCardUrl, "studentId")}
                          className="block w-full text-xs text-zinc-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0F5B47] file:text-white hover:file:bg-[#0b4737] cursor-pointer"
                        />
                      </label>
                    </div>

                    {/* Academic Certificate */}
                    <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/40 dark:bg-zinc-950 space-y-3 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#0F5B47]" />
                          <span>Academic Certificate / Marksheet</span>
                        </h4>
                        {certificateUrl && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                            Uploaded
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {certificateUrl ? (
                          <div className="relative rounded-xl overflow-hidden w-full sm:w-48 h-32 border border-zinc-200 dark:border-zinc-800 shrink-0">
                            <Image src={certificateUrl} alt="Certificate" fill className="object-cover" unoptimized />
                            <button
                              type="button"
                              onClick={() => setPreviewModalImg({ url: certificateUrl, title: "Certificate Preview" })}
                              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-bold"
                            >
                              Preview
                            </button>
                          </div>
                        ) : null}
                        <div className="flex-1 space-y-2">
                          <p className="text-xs text-zinc-500">
                            Upload your graduation certificate or transcript to boost parent trust.
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, setCertificateUrl, "cert")}
                            className="block w-full text-xs text-zinc-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0F5B47] file:text-white hover:file:bg-[#0b4737] cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Video Intro URL */}
                    <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/40 dark:bg-zinc-950 space-y-2 sm:col-span-2">
                      <label className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-[#0F5B47]" />
                        <span>Intro Video URL (YouTube or Vimeo)</span>
                      </label>
                      <input
                        type="url"
                        value={videoIntroUrl}
                        onChange={(e) => setVideoIntroUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white focus:ring-2 focus:ring-[#0F5B47]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* MODE 2: VIEW MODE (EXECUTIVE, GORGEOUS PRESENTATION) */
        /* ========================================================= */
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Executive Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                {isTutor ? "Monthly Rate" : "Status"}
              </span>
              <p className="text-xl md:text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                {isTutor ? `৳ ${salary.toLocaleString()}` : "Active"}
              </p>
              <span className="text-[10px] text-zinc-400 mt-0.5 block">
                {isTutor ? "Expected monthly fee" : "Verified Account"}
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Experience
              </span>
              <p className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white mt-1">
                {isTutor ? totalYearsExp : "Student"}
              </p>
              <span className="text-[10px] text-zinc-400 mt-0.5 block">
                {isTutor ? `${experiences.length} logged positions` : "Learner profile"}
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Subjects
              </span>
              <p className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white mt-1">
                {isTutor ? `${subjects.length} Subjects` : "All Classes"}
              </p>
              <span className="text-[10px] text-zinc-400 mt-0.5 block">
                {isTutor ? "Active teaching list" : "Primary curriculum"}
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Verification
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-lg md:text-xl font-black text-zinc-900 dark:text-white">
                  {isTutor && (nidCardUrl || studentIdCardUrl) ? "Verified" : "Standard"}
                </p>
              </div>
              <span className="text-[10px] text-zinc-400 mt-0.5 block">
                TutorKhojo Trust Badge
              </span>
            </div>
          </div>

          {/* Main 2-Column Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: ABOUT & EDUCATION & EXPERIENCE (2 cols) */}
            <div className="lg:col-span-2 space-y-8">
              {/* SECTION: ABOUT & BIO */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0F5B47]">
                      <User className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                      About Me & Bio
                    </h3>
                  </div>
                  <button
                    onClick={() => openEditTab("personal")}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#0F5B47] hover:underline cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Bio</span>
                  </button>
                </div>

                <div className="pt-5 space-y-4">
                  {bio ? (
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed italic bg-zinc-50/60 dark:bg-zinc-800/30 p-5 rounded-2xl border-l-4 border-[#0F5B47]">
                      &ldquo;{bio}&rdquo;
                    </p>
                  ) : (
                    <div className="p-6 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                      <p className="text-xs text-zinc-500">No bio written yet.</p>
                      <button
                        onClick={() => openEditTab("personal")}
                        className="mt-2 text-xs font-bold text-[#0F5B47] hover:underline cursor-pointer"
                      >
                        + Write a bio to introduce yourself
                      </button>
                    </div>
                  )}

                  {/* Personal Detail Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase block">Gender</span>
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 block">{gender}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase block">Birth Date</span>
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 block">{dob || "Not set"}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase block">Location</span>
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 block">{city || "Not set"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: ACADEMIC QUALIFICATIONS (TUTOR ONLY) */}
              {isTutor && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0F5B47]">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                        Academic Qualifications
                      </h3>
                    </div>
                    <button
                      onClick={() => openEditTab("education")}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#0F5B47] hover:underline cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Education</span>
                    </button>
                  </div>

                  <div className="pt-5">
                    {qualifications.length > 0 ? (
                      <div className="space-y-4">
                        {qualifications.map((q, idx) => (
                          <div
                            key={q.id || idx}
                            className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-850/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 inline-block">
                                {q.level}
                              </span>
                              <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                                {q.institution || "University / College"}
                              </h4>
                              <p className="text-xs text-zinc-500 font-medium">
                                Major: <span className="text-zinc-800 dark:text-zinc-200">{q.subject || "Not specified"}</span>
                              </p>
                            </div>
                            <div className="text-left sm:text-right shrink-0">
                              <span className="text-xs font-black text-[#0F5B47] dark:text-emerald-400 block">
                                GPA / Result: {q.result || "N/A"}
                              </span>
                              <span className="text-[11px] text-zinc-400 font-semibold block mt-0.5">
                                Year: {q.passingYear || "N/A"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                        <GraduationCap className="w-8 h-8 text-zinc-300 mx-auto" />
                        <p className="text-xs text-zinc-500 mt-2">No academic degrees logged.</p>
                        <button
                          onClick={() => openEditTab("education")}
                          className="mt-2 text-xs font-bold text-[#0F5B47] hover:underline cursor-pointer"
                        >
                          + Add your degrees & university
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION: TEACHING EXPERIENCE (TUTOR ONLY) */}
              {isTutor && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#0F5B47]">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                        Teaching Experience
                      </h3>
                    </div>
                    <button
                      onClick={() => openEditTab("experience")}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#0F5B47] hover:underline cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Experience</span>
                    </button>
                  </div>

                  <div className="pt-5">
                    {experiences.length > 0 ? (
                      <div className="space-y-4">
                        {experiences.map((exp, idx) => (
                          <div
                            key={exp.id || idx}
                            className="p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-850/40 space-y-2"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                                {exp.title || "Teaching Role"}
                              </h4>
                              <span className="text-[11px] font-bold text-[#0F5B47] dark:text-emerald-400">
                                {exp.startDate || "Start"} — {exp.endDate || "Present"}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                              {exp.institution || "Institution / Private"}
                            </p>
                            {exp.description && (
                              <p className="text-xs text-zinc-500 leading-relaxed pt-1">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                        <Briefcase className="w-8 h-8 text-zinc-300 mx-auto" />
                        <p className="text-xs text-zinc-500 mt-2">No previous experience history added.</p>
                        <button
                          onClick={() => openEditTab("experience")}
                          className="mt-2 text-xs font-bold text-[#0F5B47] hover:underline cursor-pointer"
                        >
                          + Add your past tutoring or coaching positions
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: PREFERENCES, AVAILABILITY & VERIFIED DOCS */}
            <div className="space-y-8">
              {/* TUITION PREFERENCES CARD */}
              {isTutor && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#0F5B47]" />
                      <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                        Tuition Preferences
                      </h3>
                    </div>
                    <button
                      onClick={() => openEditTab("preferences")}
                      className="text-xs font-bold text-[#0F5B47] hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Modes */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Tuition Modes
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tuitionModes.map((mode) => (
                        <span
                          key={mode}
                          className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        >
                          {mode}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Subjects Offered
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {subjects.length > 0 ? (
                        subjects.map((sub) => (
                          <span
                            key={sub}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                          >
                            {sub}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-zinc-400 italic">No subjects added</span>
                      )}
                    </div>
                  </div>

                  {/* Curriculums */}
                  {curriculums.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                        Curriculums
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {curriculums.map((curr) => (
                          <span
                            key={curr}
                            className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                          >
                            {curr}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AVAILABILITY PREVIEW CARD */}
              {isTutor && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#0F5B47]" />
                      <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                        Weekly Availability
                      </h3>
                    </div>
                    <button
                      onClick={() => openEditTab("availability")}
                      className="text-xs font-bold text-[#0F5B47] hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>

                  <p className="text-xs text-zinc-500">
                    Available times when students can schedule lessons with you.
                  </p>

                  <div className="grid grid-cols-7 gap-1 text-center pt-2">
                    {days.map((day) => (
                      <span key={day} className="text-[10px] font-bold text-zinc-400 uppercase">
                        {day}
                      </span>
                    ))}
                    {days.map((day) => {
                      const hasAnySlot =
                        availability?.["Morning"]?.[day] ||
                        availability?.["Afternoon"]?.[day] ||
                        availability?.["Evening"]?.[day];
                      return (
                        <div
                          key={`slot-${day}`}
                          className={`h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${
                            hasAnySlot
                              ? "bg-[#0F5B47] text-white"
                              : "bg-zinc-100 dark:bg-zinc-800/40 text-zinc-400"
                          }`}
                        >
                          {hasAnySlot ? "✓" : "—"}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* VERIFIED CREDENTIALS CARD */}
              {isTutor && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#0F5B47]" />
                      <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">
                        Credentials & Trust
                      </h3>
                    </div>
                    <button
                      onClick={() => openEditTab("documents")}
                      className="text-xs font-bold text-[#0F5B47] hover:underline cursor-pointer"
                    >
                      Manage
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#0F5B47]" />
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                          National ID (NID)
                        </span>
                      </div>
                      {nidCardUrl ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                          Verified
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-zinc-400">Missing</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2.5">
                        <GraduationCap className="w-4 h-4 text-[#0F5B47]" />
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                          Student ID Card
                        </span>
                      </div>
                      {studentIdCardUrl ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                          Verified
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-zinc-400">Missing</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-[#0F5B47]" />
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                          Degree Certificate
                        </span>
                      </div>
                      {certificateUrl ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                          Verified
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-zinc-400">Missing</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Preview Modal for Verification Documents */}
      {previewModalImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewModalImg(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl p-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                {previewModalImg.title}
              </h3>
              <button
                onClick={() => setPreviewModalImg(null)}
                className="p-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950">
              <Image
                src={previewModalImg.url}
                alt="Document Preview"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
