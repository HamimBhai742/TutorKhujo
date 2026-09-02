"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Loader2, X, Check } from "lucide-react";

export interface LocationSuggestion {
  displayName: string;
  subTitle?: string;
  lat?: string;
  lon?: string;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}

export default function LocationAutocomplete({
  value,
  onChange,
  placeholder = "e.g. Rampura, Dhaka",
  className = "",
  inputClassName = "",
  disabled = false,
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState<string>(value || "");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize internal query state with parent value during render
  const [prevPropValue, setPrevPropValue] = useState<string>(value);
  if (value !== prevPropValue) {
    setPrevPropValue(value);
    setQuery(value || "");
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch real-time Bangladesh locations dynamically via Next.js server route
  const fetchDynamicLocations = async (searchQuery: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/locations?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.success && Array.isArray(json?.data)) {
          setSuggestions(json.data);
          setIsOpen(true);
        }
      }
    } catch (err) {
      console.warn("Location autocomplete fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (text: string) => {
    setQuery(text);
    onChange(text);
    setSelectedIndex(-1);

    const clean = text.trim();
    if (!clean || clean.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // Debounce live dynamic search (300ms)
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      fetchDynamicLocations(clean);
    }, 300);
  };

  const handleSelect = (loc: LocationSuggestion) => {
    setQuery(loc.displayName);
    onChange(loc.displayName);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (query.trim().length >= 2 && suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pl-10 pr-9 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B47] text-sm transition-all ${inputClassName}`}
        />

        {/* Left MapPin Icon */}
        <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

        {/* Right Status / Loader / Clear */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {loading ? (
            <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
          ) : query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                onChange("");
                setSuggestions([]);
                setIsOpen(false);
              }}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer rounded-full"
              title="Clear"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Dynamic Autocomplete Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40">
            <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
              Relevant Bangladesh Locations
            </span>
          </div>

          {suggestions.length > 0 ? (
            <ul className="py-1 divide-y divide-zinc-50 dark:divide-zinc-800/50">
              {suggestions.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <li
                    key={`${item.displayName}-${index}`}
                    onClick={() => handleSelect(item)}
                    className={`px-3.5 py-2.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-[#0F5B47] shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">
                        {item.displayName}
                      </p>
                      {item.subTitle && (
                        <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                          {item.subTitle}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : query.trim().length >= 2 && !loading ? (
            <div className="p-4 text-center">
              <p className="text-xs font-medium text-zinc-500">
                No matching locations found for &quot;{query}&quot;.
              </p>
              <button
                type="button"
                onClick={() => {
                  onChange(query);
                  setIsOpen(false);
                }}
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-[#0F5B47] hover:underline"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Use &quot;{query}&quot; anyway</span>
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
