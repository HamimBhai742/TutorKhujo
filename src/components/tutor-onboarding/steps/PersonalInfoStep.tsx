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
  fileInputRef,
  handleImageChange,
  triggerFileInput
}: PersonalInfoStepProps) {
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

        {/* Gender Selector */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-zinc-555 dark:text-zinc-400 uppercase tracking-wider pl-1">
            Gender
          </label>
          <div className="flex flex-wrap gap-6 pt-1">
            {["Male", "Female", "Non-binary"].map((g) => (
              <label key={g} className="flex items-center space-x-2.5 cursor-pointer text-xs md:text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={gender === g}
                  onChange={() => setGender(g)}
                  className="w-4 h-4 accent-[#F26A1B] cursor-pointer"
                />
                <span>{g}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location / City */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-bold text-zinc-555 dark:text-zinc-400 uppercase tracking-wider pl-1">
            Location / City
          </label>
          <div className="relative">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-xs md:text-sm appearance-none cursor-pointer"
            >
              <option value="">Select your city</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Khulna">Khulna</option>
              <option value="Barisal">Barisal</option>
              <option value="Rangpur">Rangpur</option>
              <option value="Mymensingh">Mymensingh</option>
            </select>
            <MapPin className="w-4 h-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
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
      </div>
    </div>
  );
}
