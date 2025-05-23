"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Category } from "@/types/category";
import { useEffect, useRef, useState } from "react";
import { ClientOnlyIcon } from "./client-only-icon";
import { Input } from "./ui/input";
import { HomeIcon, Search, X, MoreHorizontal } from "lucide-react";

interface MainCategoriesHeaderProps {
  categories: Category[];
  isScrolled?: boolean;
}

export function MainCategoriesHeader({
  categories,
  isScrolled = false,
}: MainCategoriesHeaderProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const [isExtraCategoriesOpen, setIsExtraCategoriesOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const extraCategoriesRef = useRef<HTMLDivElement>(null);
  const mainCategories = categories.filter((category) => !category.parentId);

  const isHomepage = pathname === "/";

  // Determine text styling based on page and scroll position
  const getTextStyling = () => {
    if (!isHomepage) {
      // Other pages: white text on black background (light mode), black text on white background (dark mode)
      return {
        navClass:
          "text-white dark:text-black hover:text-gray-300 dark:hover:text-gray-600",
        iconClass:
          "text-white dark:text-black hover:text-gray-300 dark:hover:text-gray-600",
        textShadow: {},
      };
    }

    if (isScrolled) {
      // Homepage scrolled: black text in light mode, white in dark mode
      return {
        navClass:
          "text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-300",
        iconClass:
          "text-gray-500 dark:text-white hover:text-gray-700 dark:hover:text-gray-300",
        textShadow: {},
      };
    }

    // Homepage not scrolled: white text with shadows
    return {
      navClass: "text-white hover:text-gray-300 drop-shadow-md",
      iconClass: "text-white hover:text-gray-300 drop-shadow-md",
      textShadow: { textShadow: "1px 1px 2px rgba(0,0,0,0.7)" },
    };
  };

  const styling = getTextStyling();

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        closeSearch();
      }
      if (
        extraCategoriesRef.current &&
        !extraCategoriesRef.current.contains(event.target as Node)
      ) {
        setIsExtraCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeSearch]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      closeSearch();
    }
  };

  return (
    <nav className="text-gray-800 dark:text-white">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <ul className="flex space-x-6">
          {mainCategories.slice(0, 6).map((category) => (
            <li key={category.id}>
              <Link
                href={`/${category.slug}`}
                className={`text-sm font-medium transition-colors relative ${
                  styling.navClass
                } ${pathname === `/${category.slug}` ? "font-bold" : ""}`}
                style={styling.textShadow}
              >
                {category.name}
              </Link>
            </li>
          ))}
          {mainCategories.length > 6 && (
            <li>
              <div className="relative z-50" ref={extraCategoriesRef}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsExtraCategoriesOpen(!isExtraCategoriesOpen);
                  }}
                  className={`text-sm font-medium transition-colors ${styling.navClass}`}
                  style={styling.textShadow}
                  aria-label="Toggle extra categories"
                >
                  {
                    <ClientOnlyIcon
                      icon={isExtraCategoriesOpen ? X : MoreHorizontal}
                      className="h-5 w-5"
                    />
                  }
                </button>
                {isExtraCategoriesOpen && (
                  <div className="absolute bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-white/20 dark:border-gray-700/30 p-4 mt-2 rounded-xl shadow-lg">
                    <ul className="space-y-2">
                      {mainCategories.slice(6).map((category) => (
                        <li key={category.id}>
                          <Link
                            href={`/${category.slug}`}
                            className={`text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors relative
                              ${
                                pathname === `/${category.slug}`
                                  ? "text-gray-900 dark:text-white font-bold"
                                  : "text-gray-700 dark:text-gray-300"
                              }
                            `}
                            onClick={() => setIsExtraCategoriesOpen(false)}
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </li>
          )}
        </ul>

        <div ref={searchRef} className="relative flex items-center">
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className={`w-48 h-8 pl-3 pr-10 text-sm bg-white/20 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/50 rounded backdrop-blur-sm transition-colors ${
                  !isHomepage
                    ? "text-white dark:text-black placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    : isScrolled
                    ? "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    : "text-white dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-400"
                }`}
              />
              <button
                type="submit"
                className={`absolute right-0 top-0 h-full px-3 transition-colors ${
                  !isHomepage
                    ? "text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-black"
                    : isScrolled
                    ? "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                    : "text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white"
                }`}
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <div className="flex items-center space-x-4">
              {pathname !== "/" && (
                <Link
                  href="/"
                  className={`transition-colors ${styling.iconClass}`}
                  style={styling.textShadow}
                >
                  <ClientOnlyIcon icon={HomeIcon} className="h-5 w-5" />
                </Link>
              )}
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`transition-colors ${styling.iconClass}`}
                style={styling.textShadow}
                aria-label="Search"
              >
                <ClientOnlyIcon icon={Search} className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
