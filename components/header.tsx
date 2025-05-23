"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import type { Category } from "@/types/category";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "./ui/input";

const TopHeader = dynamic(
  () => import("./top-header").then((mod) => mod.TopHeader),
  { ssr: false }
);
const MainCategoriesHeader = dynamic(
  () =>
    import("./main-categories-header").then((mod) => mod.MainCategoriesHeader),
  {
    ssr: false,
  }
);
const SubCategoriesHeader = dynamic(
  () =>
    import("./sub-categories-header").then((mod) => mod.SubCategoriesHeader),
  {
    ssr: false,
  }
);
const MobileHeader = dynamic(
  () => import("./mobile-header").then((mod) => mod.MobileHeader),
  { ssr: false }
);

interface HeaderProps {
  categories: Category[];
}

export function Header({ categories }: HeaderProps) {
  const [selectedParentSlug, setSelectedParentSlug] = useState<string | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isHomepage = pathname === "/";

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 1100; // Adjust this breakpoint as needed
      setIsMobile(isMobileView);
      localStorage.setItem("isMobileView", JSON.stringify(isMobileView));
    };

    const storedIsMobile = localStorage.getItem("isMobileView");
    if (storedIsMobile !== null) {
      setIsMobile(JSON.parse(storedIsMobile));
    } else {
      checkMobile();
    }

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isHomepage) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight * 0.8; // Approximate hero section height
      setIsScrolled(scrollPosition > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomepage]);

  useEffect(() => {
    const pathParts = pathname.split("/").filter(Boolean);
    if (pathParts.length > 0) {
      const parentCategory = categories.find((c) => c.slug === pathParts[0]);
      setSelectedParentSlug(parentCategory?.slug || null);
    } else {
      setSelectedParentSlug(null);
    }
  }, [pathname, categories]);

  if (!isClient) {
    return null; // Return null on the server-side and during initial client-side render
  }

  if (isMobile) {
    return <MobileHeader categories={categories} />;
  }

  const toggleCategories = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  // Determine ChevronDown styling based on page and scroll position
  const getChevronStyling = () => {
    if (!isHomepage) {
      // Other pages: white icon on black background (light mode), black icon on white background (dark mode)
      return {
        iconClass: "text-black dark:text-white",
        textShadow: {},
      };
    }

    if (isScrolled) {
      // Homepage scrolled: black icon in light mode, white in dark mode
      return {
        iconClass: "text-gray-700 dark:text-white",
        textShadow: {},
      };
    }

    // Homepage not scrolled: white icon with shadow
    return {
      iconClass: "text-white drop-shadow-md",
      textShadow: { textShadow: "1px 1px 2px rgba(0,0,0,0.7)" },
    };
  };

  const chevronStyling = getChevronStyling();

  return (
    <header
      className={`fixed top-0 z-50 w-full ${isHomepage ? "" : "relative"}`}
    >
      <div
        className={`w-full relative transition-all duration-300 ${
          isHomepage ? "pt-8" : ""
        }`}
      >
        {isHomepage ? (
          <div className="container mx-auto px-8">
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-xl shadow-lg transition-all duration-300">
              <TopHeader isScrolled={isScrolled} />
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div className="bg-black dark:bg-white w-full shadow-lg py-2">
              <TopHeader isScrolled={isScrolled} />
            </div>
          </div>
        )}
      </div>

      {categoriesOpen && (
        <>
          <div className={isHomepage ? "mt-1 px-6" : ""}>
            {isHomepage ? (
              <div className="container mx-auto">
                <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-xl shadow-lg transition-all duration-300">
                  <MainCategoriesHeader
                    categories={categories}
                    isScrolled={isScrolled}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="bg-black dark:bg-white w-full shadow-lg border-b border-t border-white/20 dark:border-black/20">
                  <MainCategoriesHeader
                    categories={categories}
                    isScrolled={isScrolled}
                  />
                </div>
              </div>
            )}
          </div>
          <div className={isHomepage ? "px-6" : ""}>
            {isHomepage ? (
              <div className="container mx-auto">
                <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-xl shadow-lg transition-all duration-300">
                  <SubCategoriesHeader
                    categories={categories}
                    selectedParentSlug={selectedParentSlug}
                    isScrolled={isScrolled}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="bg-black dark:bg-white w-full shadow-lg">
                  <SubCategoriesHeader
                    categories={categories}
                    selectedParentSlug={selectedParentSlug}
                    isScrolled={isScrolled}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <div
        className="flex justify-center cursor-pointer mt-1"
        onClick={toggleCategories}
      >
        <div className="py-1">
          <ChevronDown
            className={`h-5 w-5 transition-all duration-300 ${
              chevronStyling.iconClass
            } ${categoriesOpen ? "rotate-180" : ""}`}
            style={isHomepage ? chevronStyling.textShadow : {}}
          />
        </div>
      </div>
    </header>
  );
}
