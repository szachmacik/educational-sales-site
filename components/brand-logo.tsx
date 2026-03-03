"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

interface BrandLogoProps {
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BrandLogo({ showText = true, size = "md", className = "" }: BrandLogoProps) {
  const { t, language } = useLanguage();
  const sizes = {
    sm: { heart: 36, text: "text-base" },
    md: { heart: 44, text: "text-lg" },
    lg: { heart: 56, text: "text-xl" },
  };

  const currentSize = sizes[size];

  return (
    <Link href={`/${language}`} className={`flex items-center gap-3 ${className}`}>
      {/* Heart with UK flag */}
      <div className="relative flex-shrink-0">
        <svg
          width={currentSize.heart}
          height={currentSize.heart}
          viewBox="0 0 100 100"
          className="drop-shadow-md"
        >
          <defs>
            <clipPath id="heartClip">
              <path d="M50 88.5C50 88.5 10 60 10 35C10 20 22 10 35 10C42 10 48 13 50 18C52 13 58 10 65 10C78 10 90 20 90 35C90 60 50 88.5 50 88.5Z" />
            </clipPath>
          </defs>
          {/* UK Flag background */}
          <g clipPath="url(#heartClip)">
            {/* Blue background */}
            <rect x="0" y="0" width="100" height="100" fill="#012169" />
            {/* White diagonal stripes */}
            <path d="M0 0L100 100M100 0L0 100" stroke="white" strokeWidth="16" />
            {/* Red diagonal stripes */}
            <path d="M0 0L100 100M100 0L0 100" stroke="#C8102E" strokeWidth="6" />
            {/* White cross */}
            <rect x="42" y="0" width="16" height="100" fill="white" />
            <rect x="0" y="40" width="100" height="20" fill="white" />
            {/* Red cross */}
            <rect x="45" y="0" width="10" height="100" fill="#C8102E" />
            <rect x="0" y="43" width="100" height="14" fill="#C8102E" />
          </g>
          {/* Heart outline */}
          <path
            d="M50 88.5C50 88.5 10 60 10 35C10 20 22 10 35 10C42 10 48 13 50 18C52 13 58 10 65 10C78 10 90 20 90 35C90 60 50 88.5 50 88.5Z"
            fill="none"
            stroke="white"
            strokeWidth="3"
          />
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <div className="hidden flex-col sm:flex">
          <span
            className={`font-serif ${currentSize.text} font-bold leading-tight tracking-tight text-foreground`}
          >
            {t.brand.educationalMaterials || "Materiały Edukacyjne"}
          </span>
          <span className="text-xs text-muted-foreground">
            {t.brand.byKamila || "by Kamila Łobko-Koziej"}
          </span>
        </div>
      )}
    </Link>
  );
}

