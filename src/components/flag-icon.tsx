"use client";

import React from "react";
import { LanguageCode } from "@/lib/i18n/types";

interface FlagIconProps {
  code: LanguageCode;
  className?: string;
}

/**
 * High-definition crisp vector flag component for desktop browsers.
 * Replaces unreliable/missing Windows desktop Unicode emojis with pixel-perfect SVG flags.
 */
export function FlagIcon({ code, className = "" }: FlagIconProps) {
  switch (code) {
    case "id":
      return (
        <svg
          viewBox="0 0 18 12"
          className={`w-[18px] h-[12px] rounded-xs overflow-hidden shrink-0 shadow-2xs border border-black/10 dark:border-white/20 ${className}`}
          aria-hidden="true"
        >
          <rect width="18" height="6" fill="#E70011" />
          <rect y="6" width="18" height="6" fill="#FFFFFF" />
        </svg>
      );
    case "en":
      return (
        <svg
          viewBox="0 0 18 12"
          className={`w-[18px] h-[12px] rounded-xs overflow-hidden shrink-0 shadow-2xs border border-black/10 dark:border-white/20 ${className}`}
          aria-hidden="true"
        >
          <rect width="18" height="12" fill="#012169" />
          <path d="M0,0 L18,12 M18,0 L0,12" stroke="#FFFFFF" strokeWidth="2.5" />
          <path d="M0,0 L18,12 M18,0 L0,12" stroke="#C8102E" strokeWidth="1.2" />
          <path d="M9,0 L9,12 M0,6 L18,6" stroke="#FFFFFF" strokeWidth="4" />
          <path d="M9,0 L9,12 M0,6 L18,6" stroke="#C8102E" strokeWidth="2.2" />
        </svg>
      );
    case "ja":
      return (
        <svg
          viewBox="0 0 18 12"
          className={`w-[18px] h-[12px] rounded-xs overflow-hidden shrink-0 shadow-2xs border border-black/10 dark:border-white/20 ${className}`}
          aria-hidden="true"
        >
          <rect width="18" height="12" fill="#FFFFFF" />
          <circle cx="9" cy="6" r="3.6" fill="#BC002D" />
        </svg>
      );
    case "zh":
      return (
        <svg
          viewBox="0 0 18 12"
          className={`w-[18px] h-[12px] rounded-xs overflow-hidden shrink-0 shadow-2xs border border-black/10 dark:border-white/20 ${className}`}
          aria-hidden="true"
        >
          <rect width="18" height="12" fill="#DE2910" />
          <polygon points="3.6,1.8 4.1,3.2 5.5,3.2 4.4,4 4.8,5.4 3.6,4.5 2.4,5.4 2.8,4 1.7,3.2 3.1,3.2" fill="#FFDE00" />
          <circle cx="7" cy="2" r="0.6" fill="#FFDE00" />
          <circle cx="8.2" cy="3.2" r="0.6" fill="#FFDE00" />
          <circle cx="8.2" cy="4.8" r="0.6" fill="#FFDE00" />
          <circle cx="7" cy="6" r="0.6" fill="#FFDE00" />
        </svg>
      );
    case "es":
      return (
        <svg
          viewBox="0 0 18 12"
          className={`w-[18px] h-[12px] rounded-xs overflow-hidden shrink-0 shadow-2xs border border-black/10 dark:border-white/20 ${className}`}
          aria-hidden="true"
        >
          <rect width="18" height="3" fill="#AA151B" />
          <rect y="3" width="18" height="6" fill="#F1BF00" />
          <rect y="9" width="18" height="3" fill="#AA151B" />
          <circle cx="4.5" cy="6" r="1.5" fill="#AA151B" opacity="0.8" />
        </svg>
      );
    case "ar":
      return (
        <svg
          viewBox="0 0 18 12"
          className={`w-[18px] h-[12px] rounded-xs overflow-hidden shrink-0 shadow-2xs border border-black/10 dark:border-white/20 ${className}`}
          aria-hidden="true"
        >
          <rect width="18" height="12" fill="#006C35" />
          <rect x="4" y="5.2" width="10" height="1.2" fill="#FFFFFF" rx="0.4" />
          <circle cx="9" cy="4" r="1.2" fill="#FFFFFF" />
        </svg>
      );
    default:
      return null;
  }
}
