import { Suspense } from "react";
import { Category } from "@prisma/client";
import dynamic from "next/dynamic";
import { Advertisement } from "@/components/advertisement";
import {
  ArticleListSkeleton,
  TrendingNewsSkeleton,
} from "@/components/skeletons";
import { fetchArticles } from "@/lib/api";
import { LoadingScreen } from "@/components/loading-screen";
import { MentorshipSection } from "@/components/mentorship-card";
import BottomSection from "@/components/bottom-section";

const ArticleList = dynamic(() => import("@/components/article-list"), {
  loading: () => <ArticleListSkeleton />,
});

const TrendingNews = dynamic(() => import("@/components/trending-news"), {
  loading: () => <TrendingNewsSkeleton />,
});

interface PageProps {
  searchParams: {
    page?: string;
    category?: Category;
  };
}

export default async function Home({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = 7;
  const category = searchParams.category;

  const { articles, totalArticles } = await fetchArticles(
    page,
    pageSize,
    category
  );

  return (
    <Suspense fallback={<LoadingScreen />}>
      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/7tt5SmYy/1054131eabc7d40e4d3a526bdd919540b398fce4.png')",
        }}
      >
        {/* Lighter overlay for better image visibility */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Hero content */}
        <div className="relative z-10 flex items-center justify-center h-full pt-32">
          <div className="text-center text-white max-w-5xl mx-auto px-4">
            <h1
              className="mb-4 text-white drop-shadow-2xl w-full"
              style={{
                fontWeight: 400,
                fontSize: "50px",
                lineHeight: "100%",
                letterSpacing: "0.5px",
                textAlign: "center",
                verticalAlign: "middle",
                textTransform: "uppercase",
                textShadow:
                  "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)",
              }}
            >
              CLARITY. INSIGHT. JUSTICE — YOUR LEGAL GUIDE ONLINE.
            </h1>
            <p
              className="mb-6 text-gray-100 drop-shadow-xl"
              style={{
                fontWeight: 400,
                fontSize: "34px",
                lineHeight: "100%",
                letterSpacing: "0%",
                textAlign: "center",
                verticalAlign: "middle",
                textShadow:
                  "1px 1px 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5)",
              }}
            >
              Empowering You with Legal Knowledge
            </p>
            <button className="bg-white text-gray-800 px-6 py-3 text-base font-medium rounded hover:bg-gray-50 transition-colors duration-300 shadow-lg border border-gray-200">
              Join Community
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Advertisement position="TOP_BANNER" />
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 mt-5">
          <h1 className="text-5xl font-bold leading-[64px] md:col-span-2">
            Exploring New <br />
            Articles
          </h1>
          <p className="w-96 my-auto leading-8 text-lg">
            Dive into a world of insights, ideas, and inspiration. Stay updated
            with the latest trends shaping our present and future.
          </p>
        </div> */}

        {/* Full-width article list */}
        <div className="mb-12">
          <Suspense fallback={<ArticleListSkeleton />}>
            <ArticleList
              initialArticles={articles}
              totalArticles={totalArticles}
              currentPage={page}
              pageSize={pageSize}
              category={category}
              isHomepage={true}
            />
          </Suspense>
        </div>

        <MentorshipSection />

        {/* Bottom Section with Shared Category Navigation */}
        <div className="mb-12">
          <Suspense
            fallback={
              <div className="animate-pulse bg-gray-300 dark:bg-gray-700 h-64 w-full rounded"></div>
            }
          >
            <BottomSection />
          </Suspense>
        </div>
      </div>
    </Suspense>
  );
}
