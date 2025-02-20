import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalyticsFilter } from "@/components/analytics-filter"
import { OverviewAnalytics } from "@/components/analytics/overview-analytics"
import { ArticlesAnalytics } from "@/components/analytics/articles-analytics"
import { AdvertisementsAnalytics } from "@/components/analytics/advertisements-analytics"
import { NotesAnalytics } from "@/components/analytics/notes-analytics"
import { ExperiencesAnalytics } from "@/components/analytics/experiences-analytics"
export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      </div>

      <AnalyticsFilter />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="advertisements">Advertisements</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="experiences">Experiences</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <OverviewAnalytics />
        </TabsContent>
        <TabsContent value="articles" className="space-y-4">
          <ArticlesAnalytics />
        </TabsContent>
        <TabsContent value="advertisements" className="space-y-4">
          <AdvertisementsAnalytics />
        </TabsContent>
        <TabsContent value="notes" className="space-y-4">
          <NotesAnalytics />
        </TabsContent>
        <TabsContent value="experiences" className="space-y-4">
          <ExperiencesAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}

