import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function MentorshipSection() {
  return (
    <section className="py-16" id="mentorship">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Our Attorneys
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Varius quisque odio mauris lectus consequat sollicitudin purus
            feugiat volutpat pell
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {siteConfig.mentors.map((mentor) => (
            <div key={mentor.name} className="flex flex-col items-center">
              {/* Attorney Image */}
              <div className="w-64 h-80 relative mb-8 rounded-lg overflow-hidden">
                <Image
                  src={mentor.photo || "/placeholder.svg"}
                  alt={mentor.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Attorney Info */}
              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {mentor.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {mentor.role}
                  </p>
                </div>

                {/* Social Media Icons */}
                <div className="flex justify-center space-x-3">
                  <a
                    href={mentor.social?.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-black dark:bg-white dark:text-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href={mentor.social?.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-black dark:bg-white dark:text-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={mentor.social?.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-black dark:bg-white dark:text-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href={mentor.social?.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-black dark:bg-white dark:text-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
