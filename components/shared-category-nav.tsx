"use client";

import { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface SharedCategoryNavProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export default function SharedCategoryNav({
  selectedCategory,
  onCategoryChange,
}: SharedCategoryNavProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Flatten categories for navigation
  const flattenCategories = (cats: Category[]): Category[] => {
    return cats.reduce((acc: Category[], category: Category) => {
      acc.push(category);
      if (category.children) {
        acc.push(...flattenCategories(category.children));
      }
      return acc;
    }, []);
  };

  const allCategories = flattenCategories(categories);

  return (
    <div className="flex flex-wrap gap-2 p-4 pb-3 rounded-lg border-b border-gray-200 dark:border-gray-700 rounded-none">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
          selectedCategory === null
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
        }`}
      >
        All
      </button>
      {allCategories.slice(0, 6).map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            selectedCategory === category.id
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
