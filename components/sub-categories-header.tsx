"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/types/category";
import { ClientOnlyIcon } from "./client-only-icon";
import { MoreHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SubCategoriesHeaderProps {
  categories: Category[];
  selectedParentSlug: string | null;
  isScrolled?: boolean;
}

export function SubCategoriesHeader({
  categories,
  selectedParentSlug,
  isScrolled = false,
}: SubCategoriesHeaderProps) {
  const pathname = usePathname();
  const subCategories = categories.filter((category) => {
    const parent = categories.find((c) => c.id === category.parentId);
    return parent && parent.slug === selectedParentSlug;
  });

  const isHomepage = pathname === "/";

  // Determine text styling based on page and scroll position
  const getTextStyling = () => {
    if (!isHomepage) {
      // Other pages: white text on black background (light mode), black text on white background (dark mode)
      return {
        navClass:
          "text-white dark:text-black hover:text-gray-300 dark:hover:text-gray-600",
        textShadow: {},
      };
    }

    if (isScrolled) {
      // Homepage scrolled: black text in light mode, white in dark mode
      return {
        navClass:
          "text-gray-600 dark:text-white hover:text-gray-700 dark:hover:text-gray-300",
        textShadow: {},
      };
    }

    // Homepage not scrolled: white text with shadows
    return {
      navClass: "text-white hover:text-gray-300 drop-shadow-md",
      textShadow: { textShadow: "1px 1px 2px rgba(0,0,0,0.7)" },
    };
  };

  const styling = getTextStyling();

  const [isExtraCategoriesOpen, setIsExtraCategoriesOpen] = useState(false);

  const extraCategoriesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        extraCategoriesRef.current &&
        !extraCategoriesRef.current.contains(event.target as Node)
      ) {
        setIsExtraCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (subCategories.length === 0) return null;

  return (
    <nav className="text-gray-800 dark:text-white">
      <div className="container mx-auto px-6 py-3">
        <ul className="flex flex-wrap space-x-6">
          {subCategories.slice(0, 7).map((category) => {
            const fullSlug = `/${selectedParentSlug}/${category.slug}`;
            return (
              <li key={category.id}>
                <Link
                  href={fullSlug}
                  className={`text-sm transition-colors ${styling.navClass} ${
                    pathname === fullSlug ? "font-medium" : ""
                  }`}
                  style={styling.textShadow}
                >
                  {category.name}
                </Link>
              </li>
            );
          })}
          {subCategories.length > 7 && (
            <li>
              <div className="relative z-50" ref={extraCategoriesRef}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsExtraCategoriesOpen(!isExtraCategoriesOpen);
                  }}
                  className={`text-sm transition-colors ${styling.navClass}`}
                  style={styling.textShadow}
                  aria-label="Toggle extra categories"
                >
                  <ClientOnlyIcon
                    icon={isExtraCategoriesOpen ? X : MoreHorizontal}
                    className="h-5 w-5"
                  />
                </button>
                {isExtraCategoriesOpen && (
                  <div className="absolute bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/20 dark:border-gray-700/30 p-4 mt-2 rounded-xl shadow-lg">
                    <ul className="space-y-2">
                      {subCategories.slice(7).map((category) => {
                        const fullSlug = `/${selectedParentSlug}/${category.slug}`;
                        return (
                          <li key={category.id}>
                            <Link
                              href={fullSlug}
                              className={`text-sm hover:text-gray-900 dark:hover:text-gray-100 transition-colors
                                ${
                                  pathname === fullSlug
                                    ? "text-gray-900 dark:text-white font-medium"
                                    : "text-gray-600 dark:text-gray-400"
                                }
                              `}
                              onClick={() => setIsExtraCategoriesOpen(false)}
                            >
                              {category.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
