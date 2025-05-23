"use client";

import { useEffect, useState } from "react";
import { Link } from "lucide-react";

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
    <nav className="sticky top-4">
      <h2 className="text-lg font-semibold mb-2 text-white">
        Table of Contents
      </h2>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`pl-${(heading.level - 1) * 4} ${
              activeId === heading.id
                ? "text-blue-400 font-medium"
                : "text-gray-300"
            }`}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(heading.id);
                if (element) {
                  console.log(`Scrolling to: ${heading.id}`);
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="flex items-center hover:text-blue-300 transition-colors text-xl"
            >
              <Link className="w-4 h-4 mr-2" />
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
