"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SharedCategoryNav from "./shared-category-nav";

const FeaturedArticlesSection = dynamic(
  () => import("./featured-articles-section"),
  {
    ssr: false,
  }
);

const MangaReadsSection = dynamic(() => import("./manga-reads-section"), {
  ssr: false,
});

export default function BottomSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="space-y-4">
      {/* Shared Category Navigation */}
      <SharedCategoryNav
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Bottom Section: Featured Articles and Manga Reads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <FeaturedArticlesSection
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        <div className="lg:col-span-1">
          <MangaReadsSection selectedCategory={selectedCategory} />
        </div>
      </div>
    </div>
  );
}
