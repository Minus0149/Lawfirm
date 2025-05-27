"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  // Debug: Log headings to console
  useEffect(() => {
    console.log("Table of Contents headings:", headings);
  }, [headings]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  return (
    <nav className="my-8 py-6 border-t border-gray-200 dark:border-gray-600">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white uppercase tracking-wider">
        Table of Contents
      </h2>
      <ol className="space-y-4">
        {headings
          .filter((h) => h.level >= 2 && h.level <= 4)
          .map((heading, index) => {
            return (
              <li
                key={heading.id}
                className={`${heading.level > 2 ? "ml-6" : ""}`}
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(heading.id);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={`flex items-start hover:text-emerald-500 transition-colors duration-200 ${
                    activeId === heading.id
                      ? "text-emerald-500 font-semibold"
                      : "text-gray-700 dark:text-gray-300"
                  } ${
                    heading.level === 2 ? "text-base" : "text-sm"
                  } leading-relaxed`}
                >
                  {heading.level === 2 && (
                    <span className="inline-block w-8 text-emerald-500 font-semibold flex-shrink-0 text-lg">
                      {headings.filter((h) => h.level === 2).indexOf(heading) +
                        1}
                      .
                    </span>
                  )}
                  {/* <span className="bg-[#E9ECEF] text-[#4A5158] px-2 rounded-full">
                    {index + 1}
                  </span> */}
                  <span
                    className={`font-medium ${
                      heading.level === 2 ? "" : "ml-2"
                    }`}
                    dangerouslySetInnerHTML={{ __html: heading.text }}
                  ></span>
                </a>
              </li>
            );
          })}
      </ol>
    </nav>
  );
}
