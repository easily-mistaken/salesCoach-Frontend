"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Clock, Calendar, User } from "lucide-react";
import SentimentChart from "@/components/SentimentChart";
import ObjectionsList from "@/components/ObjectionsList";
import { transformSentimentData, formatDate } from "@/services/analysis/api";
import { useGetCallAssetWithAnalysis } from "@/services/analysis/query";
import { useToast } from "@/components/ui/use-toast";
import { LoadingCircle } from "@/components/LoadingCircle"; // Assuming you have this component
import { Objection } from "@/services/objections/api";

const AnalysisPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch call asset with analysis
  const { 
    data, 
    isLoading, 
    error,
    isError 
  } = useGetCallAssetWithAnalysis(id as string);

  // Show error toast when request fails
  if (isError && error) {
    toast({
      title: "Error",
      description: "Failed to load analysis data",
      variant: "destructive",
    });
  }

  // Get the asset and analysis data
  const asset = data?.asset;
  const analysis = asset?.analysis;

  // Transform sentiment data for the chart
  const sentimentChartData = analysis?.sentimentEntries 
    ? transformSentimentData(analysis.sentimentEntries) 
    : [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <LoadingCircle />
      </div>
    );
  }

  // Error state when asset or analysis is not found
  if (!asset || !analysis) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900">Analysis not found</h3>
              <p className="text-gray-500 mt-1">
                The requested analysis does not exist or you don't have permission to view it.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {analysis.title || asset.name || "Untitled Analysis"}
            </h1>
            <div className="flex flex-wrap items-center text-gray-600 mt-2 gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(analysis.date)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{analysis.duration}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{analysis.participants.length} Participants</span>
              </div>
            </div>
          </div>
          <Button className="mt-4 md:mt-0" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="objections">Objections</TabsTrigger>
            <TabsTrigger value="transcript">Full Transcript</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Call Summary</CardTitle>
                    <CardDescription>
                      AI-generated summary of the call
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{analysis.summary}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Sentiment Analysis</CardTitle>
                    <CardDescription>
                      Overall sentiment trend during the call
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <SentimentChart data={sentimentChartData} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Key Insights</CardTitle>
                    <CardDescription>
                      Important takeaways from the conversation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.keyInsights.map((insight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-sm mr-3 mt-0.5 shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                    <CardDescription>
                      Suggested next steps based on the analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.recommendations.map(
                        (recommendation, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800 text-sm mr-3 mt-0.5 shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">
                              {recommendation}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="sentiment">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Sentiment Analysis</CardTitle>
                  <CardDescription>
                    Emotional tone throughout the conversation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">
                      Overall Sentiment
                    </h3>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-600 h-4 rounded-full"
                        style={{
                          width: `${analysis.overallSentiment * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>Negative</span>
                      <span>Neutral</span>
                      <span>Positive</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Sentiment Timeline
                    </h3>
                    <div className="h-80">
                      <SentimentChart data={sentimentChartData} />
                    </div>
                  </div>

                  {/* Participant Talk Stats */}
                  {analysis.participantTalkStats && analysis.participantTalkStats.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">
                        Participant Talk Ratio
                      </h3>
                      <div className="space-y-4">
                        {analysis.participantTalkStats.map((stat) => (
                          <div key={stat.id}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{stat.name} ({stat.role})</span>
                              <span className="text-sm text-gray-500">{stat.percentage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  stat.role.toLowerCase().includes('sales') 
                                    ? 'bg-blue-600' 
                                    : 'bg-green-600'
                                }`}
                                style={{ width: `${stat.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="objections">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Objection Handling Analysis</CardTitle>
                  <CardDescription>
                    Review of objections raised and responses provided
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analysis.objections.length > 0 ? (
                    <ObjectionsList objections={analysis.objections as Objection[]} />
                  ) : (
                    <div className="text-center py-6">
                      <p>No objections were detected in this call.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="transcript">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Full Transcript</CardTitle>
                  <CardDescription>
                    Complete conversation with timestamps
                  </CardDescription>
                </CardHeader>
                <CardContent>
  <div className="space-y-4 max-h-[600px] overflow-y-auto p-2">
    {/* For transcript content, you will parse the asset.content */}
    <div className="p-4 text-center text-gray-500">
      {asset.type === 'TEXT' ? (
        // If the asset type is 'text', display the content directly
        <div className="whitespace-pre-wrap break-words">
          {asset.content}
        </div>
      ) : asset.type === 'FILE' && asset.content ? (
        // If the asset type is 'file', and the content is a URL, display the PDF
        <div className="pdf-viewer">
          <iframe
            src={asset.content}
            width="100%"
            height="600px"
            frameBorder="0"
            title="PDF Viewer"
          ></iframe>
        </div>
      ) : (
        // If no content is available, show this fallback message
        <p>Full transcript content is not available</p>
      )}
    </div>
  </div>
</CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </>
  );
};

export default AnalysisPage;