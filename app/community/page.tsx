import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, BookOpen, Award } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function CommunityPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Join Our Legal Community
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Connect with fellow legal professionals, share knowledge, and grow
              together
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 bg-black dark:bg-white p-6 rounded-lg">
            {/* Network Card */}
            <Card className="bg-white dark:bg-black text-white border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
                  <Users className="mr-3 h-6 w-6" />
                  Network
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 font-medium">
                  Connect with legal professionals
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                  Build meaningful connections with lawyers, law students, and
                  legal experts from around the world.
                </p>
                <Link href={siteConfig.communityLinks.network}>
                  <Button className="w-full bg-black  hover:bg-black text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 text-white font-semibold py-3">
                    Join Network
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Discussions Card */}
            <Card className="bg-white dark:bg-black text-white border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
                  <MessageCircle className="mr-3 h-6 w-6" />
                  Discussions
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 font-medium">
                  Engage with legal discussions
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                  Participate in thought-provoking discussions about legal
                  cases, legal judgments, and more.
                </p>
                <Link href={siteConfig.communityLinks.discussions}>
                  <Button className="w-full bg-black  hover:bg-black text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 text-white font-semibold py-3">
                    Join Discussions
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Resources Card */}
            <Card className="bg-white dark:bg-black text-white border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
                  <BookOpen className="mr-3 h-6 w-6" />
                  Resources
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 font-medium">
                  Access legal resources
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                  Get access to premium legal resources, templates, and
                  educational materials.
                </p>
                <Link href={siteConfig.communityLinks.resources}>
                  <Button className="w-full bg-black  hover:bg-black text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 text-white font-semibold py-3">
                    Browse Resources
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Mentorship Card */}
            <Card className="bg-white dark:bg-black text-white border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
                  <Award className="mr-3 h-6 w-6" />
                  Mentorship
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 font-medium">
                  Connect with mentors
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                  Build meaningful connections with lawyers, and get legal
                  support from experts around the world.
                </p>
                <Link href={siteConfig.communityLinks.mentorship}>
                  <Button className="w-full bg-black  hover:bg-black text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 text-white font-semibold py-3">
                    Find Mentor
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
