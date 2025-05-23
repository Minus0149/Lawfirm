"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, MoonIcon, SunIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { redirect, useRouter, usePathname } from "next/navigation";
import { ClientOnlyIcon } from "./client-only-icon";
import ThemeToggle from "./ThemeToggle";

interface TopHeaderProps {
  isScrolled?: boolean;
}

export function TopHeader({ isScrolled = false }: TopHeaderProps) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthorized =
    session?.user?.role &&
    ["SUPER_ADMIN", "ADMIN", "EDITOR", "MANAGER"].includes(session.user.role);

  const isHomepage = pathname === "/";

  // Determine text styling based on page and scroll position
  const getTextStyling = () => {
    if (!isHomepage) {
      // Other pages: white text on black background (light mode), black text on white background (dark mode)
      return {
        brandClass: "text-white dark:text-black",
        navClass:
          "text-white dark:text-black hover:text-gray-300 dark:hover:text-gray-600",
        textShadow: {},
      };
    }

    if (isScrolled) {
      // Homepage scrolled: black text in light mode, white in dark mode
      return {
        brandClass: "text-gray-900 dark:text-white",
        navClass:
          "text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-300",
        textShadow: {},
      };
    }

    // Homepage not scrolled: white text with shadows
    return {
      brandClass: "text-white drop-shadow-lg",
      navClass: "text-white hover:text-gray-300 drop-shadow-md",
      textShadow: { textShadow: "1px 1px 2px rgba(0,0,0,0.7)" },
    };
  };

  const styling = getTextStyling();

  return (
    <div className="container mx-auto px-6 flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <span
          className={`text-lg font-bold italic transition-colors ${styling.brandClass}`}
          style={styling.textShadow}
        >
          Inspiration by
        </span>
        <span
          className={`text-lg font-bold ml-1 transition-colors ${styling.brandClass}`}
          style={styling.textShadow}
        >
          Trazler
        </span>
      </Link>

      <div className="flex items-center space-x-6">
        <Link href="/submit-article">
          <span
            className={`text-sm transition-colors ${styling.navClass}`}
            style={styling.textShadow}
          >
            Submit Article
          </span>
        </Link>

        <Link href="/" scroll={false}>
          <span
            className={`text-sm cursor-pointer transition-colors ${styling.navClass}`}
            style={styling.textShadow}
            onClick={async (e) => {
              e.preventDefault();
              router.push("/#mentorship");
            }}
          >
            Mentorship
          </span>
        </Link>

        <Link href="/experiences">
          <span
            className={`text-sm transition-colors ${styling.navClass}`}
            style={styling.textShadow}
          >
            Job/Internship Experiences
          </span>
        </Link>

        <Link href="/community">
          <span
            className={`text-sm transition-colors ${styling.navClass}`}
            style={styling.textShadow}
          >
            Join Community
          </span>
        </Link>

        <div className="ml-2 mt-1">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
