import React, { RefObject } from "react";
import Image from "next/image";
import { User, Camera, MapPin } from "lucide-react";

interface PersonalInfoStepProps {
  fullName: string;
  setFullName: (name: string) => void;
  dob: string;
  setDob: (dob: string) => void;
  gender: string;
  setGender: (gender: string) => void;
  city: string;
  setCity: (city: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  profilePic: string;
  setProfilePic: (pic: string) => void;
  certificateUrl: string;
  setCertificateUrl: (url: string) => void;
  nidCardUrl: string;
  setNidCardUrl: (url: string) => void;
  studentIdCardUrl: string;
  setStudentIdCardUrl: (url: string) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileInput: () => void;
}

export default function PersonalInfoStep({
  fullName,
  setFullName,
  dob,
  setDob,
  gender,
  setGender,
  city,
  setCity,
  bio,
  setBio,
  profilePic,
  setProfilePic,
  certificateUrl,
  setCertificateUrl,
  nidCardUrl,
  setNidCardUrl,
  studentIdCardUrl,
  setStudentIdCardUrl,
  fileInputRef,
  handleImageChange,
  triggerFileInput
}: PersonalInfoStepProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Let&apos;s get to know you
        </h1>
        <p className="text-sm text-zinc-550 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Complete your personal profile to help students find their perfect match. You can edit this later in your settings.
        </p>
      </div>

      {/* Profile Pic Upload Section */}
      <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group cursor-pointer" onClick={triggerFileInput}>
          <div className="w-28 h-28 rounded-full border-4 border-emerald-500/10 dark:border-emerald-500/20 overflow-hidden flex items-center justify-center bg-zinc-100 dark:bg-zinc-850">
            {profilePic ? (
              <Image
                src={profilePic}
                alt="Profile"
                width={112}
                height={112}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <User className="w-12 h-12 text-zinc-400" />
            )}
          </div>
          <div className="absolute bottom-1 right-1 bg-[#F26A1B] text-white p-2 rounded-full shadow-lg border border-white group-hover:scale-110 transition-transform">
            <Camera className="w-4 h-4" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        <div className="text-center sm:text-left space-y-2.5">
          <h3 className="font-bold text-zinc-800 dark:text-white">Profile Picture</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal max-w-sm">
            A professional photo increases your chance of getting bookings by 40%.
          </p>
          <div className="flex items-center justify-center sm:justify-start space-x-4">
            <button
              type="button"
              onClick={triggerFileInput}
              className="text-xs font-bold text-[#0F5B47] dark:text-[#188c6e] hover:underline cursor-pointer"
            >
              Upload new photo
            </button>
            {profilePic && (
              <button
                type="button"
                onClick={() => setProfilePic("")}
                className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider pl-1">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Alex Richardson"
            className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm"
          />
        </div>

        {/* Date of Birth */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider pl-1">
            Date of Birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm"
          />
        </div>

        {/* Gender */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider pl-1">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* City / District */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider pl-1">
            City / Location
          </label>
          <div className="relative">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Mirpur, Dhaka"
              className="w-full px-4 py-3 pl-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm"
            />
            <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        {/* Short Bio */}
        <div className="space-y-1 md:col-span-2">
          <div className="flex justify-between items-center pl-1">
            <label className="text-xs font-bold text-zinc-555 dark:text-zinc-400 uppercase tracking-wider">
              Short Bio
            </label>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold">{bio.length} / 500 characters</span>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.substring(0, 500))}
            rows={4}
            placeholder="Tell students about yourself, your teaching style, and what motivates you..."
            className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm resize-none"
          />
        </div>

        {/* Identity & Academic Verification Documents */}
        <div className="space-y-4 md:col-span-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Verification Documents & Blue Badge Proof</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Upload your NID and University ID to receive the <b>Verified Tutor Badge</b> (Blue Tick) and boost student trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* NID / Smart Card */}
            <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/40 space-y-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                NID / Smart Card
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload(e, setNidCardUrl)}
                className="text-xs text-zinc-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-xl file:border-0 file:text-[11px] file:font-semibold file:bg-[#0F5B47] file:text-white hover:file:bg-[#0c4a3a] cursor-pointer"
              />
              {nidCardUrl && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-emerald-600 font-bold">Attached ✓</span>
                  <button
                    type="button"
                    onClick={() => setNidCardUrl("")}
                    className="text-[10px] text-red-500 font-bold hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Varsity Student ID */}
            <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/40 space-y-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                University Student ID
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload(e, setStudentIdCardUrl)}
                className="text-xs text-zinc-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-xl file:border-0 file:text-[11px] file:font-semibold file:bg-[#0F5B47] file:text-white hover:file:bg-[#0c4a3a] cursor-pointer"
              />
              {studentIdCardUrl && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-emerald-600 font-bold">Attached ✓</span>
                  <button
                    type="button"
                    onClick={() => setStudentIdCardUrl("")}
                    className="text-[10px] text-red-500 font-bold hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Academic Certificate / Transcript */}
            <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/40 space-y-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                Academic Certificate / Transcript
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload(e, setCertificateUrl)}
                className="text-xs text-zinc-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-xl file:border-0 file:text-[11px] file:font-semibold file:bg-[#0F5B47] file:text-white hover:file:bg-[#0c4a3a] cursor-pointer"
              />
              {certificateUrl && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-emerald-600 font-bold">Attached ✓</span>
                  <button
                    type="button"
                    onClick={() => setCertificateUrl("")}
                    className="text-[10px] text-red-500 font-bold hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
