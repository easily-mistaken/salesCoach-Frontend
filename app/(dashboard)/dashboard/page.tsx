"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  ChevronDown,
  Download,
  FileText,
  ListFilter,
  MessageSquare,
  PieChart,
  PlusCircle,
  Upload,
} from "lucide-react";
import SentimentChart from "@/components/SentimentChart";
import ObjectionsList, { CategoryObjection } from "@/components/ObjectionsList";
import RecentTranscriptsList from "@/components/RecentTranscriptsList";
import { useToast } from "@/components/ui/use-toast";
import { useGetUser } from "@/services/user/query";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import NoOrganizationScreen from "@/components/NoOrganizationScreen";
import useCurrentOrg from "@/store/useCurrentOrg";
import {
  useGetTranscriptsCount,
  useGetAverageSentiment,
  useGetObjectionsHandled,
  useGetTalkRatio,
  useGetSentimentTrends,
  useGetCommonObjections,
  useGetTranscripts,
} from "@/services/dashboard/query";
import { DoubleLineLoader, SkeletonLoader } from "@/components/SkeletonLoader";
import {
  ANALYSIS_COMPLETE_EVENT,
  getAnalysisStartPage,
  clearAnalysisStartPage,
} from "@/utils/analysisTracking";

const Dashboard = () => {
  const { toast } = useToast();
  const { data: user, isLoading: userLoading } = useGetUser();
  const { currentOrg } = useCurrentOrg();
  const orgId = currentOrg?.id || "";
  const [page, setPage] = useState<number>(1);
  const limit = 5;
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Setup listener for analysis complete events
  useEffect(() => {
    // Function to handle the analysis complete event
    const handleAnalysisComplete = (): void => {
      // Increment the refresh trigger to force react-query to refetch
      setRefreshTrigger((prev) => prev + 1);

      // Get and clear the stored starting page path
      const startPage = getAnalysisStartPage();
      if (startPage) {
        clearAnalysisStartPage();
      }

      toast({
        title: "New analysis added!",
        description: "Dashboard has been updated with latest data.",
      });
    };

    // Add event listener
    window.addEventListener(ANALYSIS_COMPLETE_EVENT, handleAnalysisComplete);

    // Clean up
    return () => {
      window.removeEventListener(
        ANALYSIS_COMPLETE_EVENT,
        handleAnalysisComplete
      );
    };
  }, [toast]);

  // Move all hook calls here, before any conditional returns
  const {
    data: transcriptsCount,
    isLoading: countLoading,
    refetch: refetchCount,
  } = useGetTranscriptsCount(orgId);

  const {
    data: sentiment,
    isLoading: sentimentLoading,
    refetch: refetchSentiment,
  } = useGetAverageSentiment(orgId);

  const {
    data: objections,
    isLoading: objectionsLoading,
    refetch: refetchObjections,
  } = useGetObjectionsHandled(orgId);

  const {
    data: talkRatio,
    isLoading: ratioLoading,
    refetch: refetchRatio,
  } = useGetTalkRatio(orgId);

  const {
    data: sentimentTrends,
    isLoading: trendsLoading,
    refetch: refetchTrends,
  } = useGetSentimentTrends(orgId);

  const {
    data: commonObjections,
    isLoading: commonLoading,
    refetch: refetchCommon,
  } = useGetCommonObjections(orgId);

  const {
    data: transcripts,
    isLoading: transcriptsLoading,
    refetch: refetchTranscripts,
  } = useGetTranscripts(orgId, page, limit);

  // Effect to trigger refetches when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0 && orgId) {
      // Refetch all data
      refetchCount();
      refetchSentiment();
      refetchObjections();
      refetchRatio();
      refetchTrends();
      refetchCommon();
      refetchTranscripts();
    }
  }, [
    refreshTrigger,
    orgId,
    refetchCount,
    refetchSentiment,
    refetchObjections,
    refetchRatio,
    refetchTrends,
    refetchCommon,
    refetchTranscripts,
  ]);

  const isLoading = userLoading || !user;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (user.organizations.length === 0) {
    return <NoOrganizationScreen />;
  }

  if (!orgId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="pt-6">No organization found</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here&apos;s an overview of your sales performance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              toast({
                title: "Filter applied",
                description: "Your dashboard data has been filtered.",
              });
            }}
          >
            <ListFilter className="h-4 w-4" />
            Filter
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              toast({
                title: "Export complete",
                description: "Your dashboard report has been downloaded.",
              });
            }}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button asChild className="flex items-center gap-2">
            <Link href="/dashboard/upload">
              <Upload className="h-4 w-4" />
              Upload Transcript
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Transcripts
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {countLoading ? (
              <SkeletonLoader height="h-8" width="w-16" />
            ) : (
              <div className="text-2xl font-bold text-navy-800">
                {transcriptsCount?.count || 0}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Average Sentiment
            </CardTitle>
            <BarChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {sentimentLoading ? (
              <SkeletonLoader height="h-8" width="w-20" />
            ) : (
              <div className="text-2xl font-bold text-navy-800">
                {sentiment?.averageSentiment || 0}%
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Objections Handled
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {objectionsLoading ? (
              <DoubleLineLoader />
            ) : (
              <div className="text-2xl font-bold text-navy-800">
                {objections?.successful || 0}/{objections?.total || 0}
                <p className="text-xs text-green-600 flex items-center mt-1">
                  Success Rate: {objections?.rate?.toFixed(1) || 0}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Talk Ratio
            </CardTitle>
            <PieChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {ratioLoading ? (
              <SkeletonLoader height="h-8" width="w-16" />
            ) : (
              <div className="text-2xl font-bold text-navy-800">
                {talkRatio?.talkRatio || 0}%
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transcripts">Transcripts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {/* Main Chart */}
            <Card className="md:col-span-4 h-full">
              <CardHeader>
                <CardTitle>Sentiment Trends</CardTitle>
                <CardDescription>
                  Your call sentiment over the last 10 sales calls
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                {trendsLoading ? (
                  <p className="py-8 text-center text-gray-500">
                    Loading sentiment trends...
                  </p>
                ) : sentimentTrends && sentimentTrends.length > 0 ? (
                  <SentimentChart
                    data={sentimentTrends.map((item) => ({
                      name: item.name,
                      positive: parseFloat(item.positive),
                      neutral: parseFloat(item.neutral),
                      negative: parseFloat(item.negative),
                    }))}
                  />
                ) : (
                  <p className="py-8 text-center text-gray-500">
                    No sentiment data available
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Objections List */}
            <Card className="md:col-span-3 h-full flex flex-col">
              <CardHeader>
                <CardTitle>Common Objections</CardTitle>
                <CardDescription>
                  Objections you encountered most frequently
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden">
                {commonLoading ? (
                  <p className="py-8 text-center text-gray-500">
                    Loading objections...
                  </p>
                ) : commonObjections ? (
                  <ObjectionsList objections={commonObjections} />
                ) : (
                  <p className="py-8 text-center text-gray-500">
                    No objection data available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Transcripts */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Transcripts</CardTitle>
                  <CardDescription>
                    Your most recently analyzed sales calls
                  </CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard/transcripts">View all</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {transcriptsLoading ? (
                <p className="py-8 text-center text-gray-500">
                  Loading transcripts...
                </p>
              ) : transcripts &&
                transcripts.data &&
                transcripts.data.length > 0 ? (
                <RecentTranscriptsList data={transcripts.data} />
              ) : (
                <p className="py-8 text-center text-gray-500">
                  No transcripts available. Upload your first transcript to see
                  analysis here.
                  <div className="flex justify-center mt-4">
                    <Button asChild>
                      <Link href="/dashboard/upload">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Upload Transcript
                      </Link>
                    </Button>
                  </div>
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transcripts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Transcripts</CardTitle>
              <CardDescription>
                Browse and analyze all your uploaded sales call transcripts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transcriptsLoading ? (
                <p className="py-8 text-center text-gray-500">
                  Loading transcripts...
                </p>
              ) : transcripts &&
                transcripts.data &&
                transcripts.data.length > 0 ? (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Name</th>
                          <th className="text-left py-2">Date</th>
                          <th className="text-left py-2">Duration</th>
                          <th className="text-left py-2">Sentiment</th>
                          <th className="text-left py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transcripts.data.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="py-2">
                              {item.analysis?.title || "Unnamed"}
                            </td>
                            <td className="py-2">
                              {item.analysis
                                ? new Date(
                                    item.analysis.date
                                  ).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="py-2">
                              {item.analysis?.duration || "N/A"}
                            </td>
                            <td className="py-2">
                              {item.analysis
                                ? `${(
                                    ((item.analysis.overallSentiment + 1) / 2) *
                                    100
                                  ).toFixed(1)}%`
                                : "N/A"}
                            </td>
                            <td className="py-2">
                              <Button
                                size="sm"
                                onClick={() => window.open(item.content)}
                                variant="outline"
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {transcripts.pagination &&
                    transcripts.pagination.pages > 1 && (
                      <div className="flex justify-center mt-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                          >
                            Previous
                          </Button>
                          <span className="text-sm">
                            Page {page} of {transcripts.pagination.pages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={page === transcripts.pagination.pages}
                            onClick={() => setPage(page + 1)}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div>
                  <p className="py-8 text-center text-gray-500">
                    No transcripts available. Upload your first transcript.
                  </p>
                  <div className="flex justify-center">
                    <Button asChild>
                      <Link href="/dashboard/upload">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Upload New Transcript
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Dashboard;
