"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Download,
  ListFilter,
  MessageSquare,
  TrendingUp,
  Zap,
  ChevronDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SentimentChart from "@/components/SentimentChart";
import { CategoryTrendChart } from "@/components/CategoryTrendChart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetQuestionsRate,
  useGetTopicCoherence,
  useGetTalkRatio,
  useGetObjectionsHandled,
  useGetSentimentTrends,
} from "@/services/dashboard/query";
import useCurrentOrg from "@/store/useCurrentOrg";
import { useToast } from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const InsightsPage: React.FC = () => {
  const { currentOrg } = useCurrentOrg();
  const orgId = currentOrg?.id || "";
  const { toast } = useToast();

  // Calculate date range for charts
  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  };

  const { startDate, endDate } = getDateRange();

  // Fetch data from APIs
  const { data: questionsRateData, isLoading: questionsLoading } =
    useGetQuestionsRate(orgId);
  const { data: topicCoherenceData, isLoading: topicLoading } =
    useGetTopicCoherence(orgId);
  const { data: talkRatioData, isLoading: talkRatioLoading } =
    useGetTalkRatio(orgId);
  const { data: objectionsData, isLoading: objectionsLoading } =
    useGetObjectionsHandled(orgId);
  const { data: sentimentTrends, isLoading: sentimentLoading } =
    useGetSentimentTrends(orgId);

  // Check if any data is still loading
  const isLoading =
    questionsLoading ||
    topicLoading ||
    talkRatioLoading ||
    objectionsLoading ||
    sentimentLoading;

  const handleExport = async () => {
    try {
      const element = document.getElementById("insights-content");
      if (!element) return;

      // Create a temporary container for the PDF content
      const tempContainer = document.createElement("div");
      tempContainer.style.width = "800px";
      tempContainer.style.padding = "20px";
      tempContainer.style.backgroundColor = "white";
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      tempContainer.style.visibility = "hidden";

      // Clone the content
      const content = element.cloneNode(true) as HTMLElement;

      // Function to convert any color to RGB
      const convertToRGB = (color: string): string => {
        if (
          color.includes("oklch") ||
          color.includes("hsl") ||
          color.includes("hwb")
        ) {
          return "#000000"; // Default to black for text
        }
        return color;
      };

      // Make all text selectable and fix color issues
      content.querySelectorAll("*").forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.userSelect = "text";
          el.style.webkitUserSelect = "text";

          // Convert all colors to RGB
          const computedStyle = window.getComputedStyle(el);

          // Handle background colors
          const bgColor = computedStyle.backgroundColor;
          if (
            bgColor &&
            bgColor !== "transparent" &&
            bgColor !== "rgba(0, 0, 0, 0)"
          ) {
            el.style.backgroundColor = convertToRGB(bgColor);
          } else {
            el.style.backgroundColor = "#ffffff";
          }

          // Handle text colors
          const textColor = computedStyle.color;
          if (textColor) {
            el.style.color = convertToRGB(textColor);
          }

          // Handle border colors
          const borderColor = computedStyle.borderColor;
          if (borderColor && borderColor !== "transparent") {
            el.style.borderColor = convertToRGB(borderColor);
          }
        }
      });

      // Remove loading skeletons and disabled states
      content.querySelectorAll(".animate-pulse").forEach((el) => el.remove());
      content.querySelectorAll("[disabled]").forEach((el) => {
        if (el instanceof HTMLElement) {
          el.removeAttribute("disabled");
        }
      });

      // Remove any elements that might cause issues
      content
        .querySelectorAll("script, style, link, svg, path, g")
        .forEach((el) => el.remove());

      // Remove any inline styles that might cause issues
      content.querySelectorAll('[style*="oklch"]').forEach((el) => {
        if (el instanceof HTMLElement) {
          el.removeAttribute("style");
        }
      });

      tempContainer.appendChild(content);

      // Add to document temporarily
      document.body.appendChild(tempContainer);

      // Wait for images to load
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Convert to canvas with higher quality
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: true,
        removeContainer: true,
        onclone: (clonedDoc) => {
          // Additional cleanup on the cloned document
          const clonedContent = clonedDoc.getElementById("insights-content");
          if (clonedContent) {
            clonedContent.querySelectorAll("*").forEach((el) => {
              if (el instanceof HTMLElement) {
                // Remove any remaining problematic styles
                el.style.removeProperty("background");
                el.style.removeProperty("background-color");
                el.style.removeProperty("color");
                el.style.removeProperty("border-color");
                // Set basic styles
                el.style.backgroundColor = "#ffffff";
                el.style.color = "#000000";
              }
            });
          }
        },
      });

      // Ensure the temporary container is removed
      if (tempContainer.parentNode) {
        tempContainer.parentNode.removeChild(tempContainer);
      }

      // Create PDF with better quality
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Add title and date
      pdf.setFontSize(20);
      pdf.text("Sales Insights Report", 20, 20);
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

      // Calculate dimensions
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdfHeight - 40; // Leave space for header
      const totalPages = Math.ceil(imgHeight / pageHeight);

      // Add content to each page
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        const sourceY = i * pageHeight;
        const sourceHeight = Math.min(pageHeight, imgHeight - sourceY);

        // Calculate the height to maintain aspect ratio
        const height = (sourceHeight * imgWidth) / canvas.width;

        // Add the image to the PDF
        pdf.addImage(
          imgData,
          "PNG",
          0,
          40,
          imgWidth,
          height,
          undefined,
          "FAST"
        );
      }

      // Add page numbers
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(`Page ${i} of ${totalPages}`, pdfWidth - 30, pdfHeight - 10);
      }

      // Save the PDF
      pdf.save("sales-insights.pdf");

      toast({
        title: "Export Successful",
        description: "Your insights have been exported to PDF",
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your insights",
        variant: "destructive",
      });
    }
  };

  // Prepare sentiment data for the chart
  const sentimentChartData = React.useMemo(() => {
    if (!sentimentTrends) return [];
    return sentimentTrends.map((item) => ({
      name: item.name,
      positive: parseFloat(item.positive),
      neutral: parseFloat(item.neutral),
      negative: parseFloat(item.negative),
    }));
  }, [sentimentTrends]);

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

  // Performance metrics that use real API data
  const performanceMetrics = [
    {
      name: "Talk Ratio",
      value: talkRatioLoading
        ? "Loading..."
        : talkRatioData
        ? `${talkRatioData.talkRatio}%`
        : "N/A",
      change: 0, // You would calculate this from historical data
      target: "50:50",
      description: "Sales rep vs prospect talking time",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-600",
      isLoading: talkRatioLoading,
    },
    {
      name: "Question Rate",
      value: questionsLoading
        ? "Loading..."
        : questionsRateData
        ? questionsRateData.averageQuestionsRate.toFixed(1)
        : "N/A",
      change: 0, // You would calculate this from historical data
      target: "8+",
      description: questionsLoading
        ? "Loading..."
        : questionsRateData
        ? `${questionsRateData.averageQuestionsPerCall.toFixed(
            0
          )} questions per call`
        : "No data available",
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-green-100 text-green-600",
      isLoading: questionsLoading,
    },
    {
      name: "Objection Success",
      value: objectionsLoading
        ? "Loading..."
        : objectionsData
        ? `${objectionsData.rate.toFixed(0)}%`
        : "N/A",
      change: 0, // You would calculate this from historical data
      target: "80%",
      description: objectionsLoading
        ? "Loading..."
        : objectionsData
        ? `${objectionsData.successful} of ${objectionsData.total} objections handled`
        : "No data available",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "bg-yellow-100 text-yellow-600",
      isLoading: objectionsLoading,
    },
    {
      name: "Topic Coherence",
      value: topicLoading
        ? "Loading..."
        : topicCoherenceData
        ? `${topicCoherenceData.averageCoherence.toFixed(0)}%`
        : "N/A",
      change: 0, // You would calculate this from historical data
      target: "90%",
      description: "Staying on relevant topics during calls",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-600",
      isLoading: topicLoading,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Sales Insights</h1>
          <p className="text-gray-600 max-w-4xl">
            Welcome back, last week you struggled with pacing and timing
            objections, this week let&apos;s focus on slowing down and driving
            timelines with your prospects
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <ListFilter className="h-4 w-4" />
            Filter
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleExport}
            disabled={isLoading}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <motion.div
        id="insights-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceMetrics.map((metric, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center">
                    <div
                      className={`mr-3 h-8 w-8 rounded-full ${metric.color} flex items-center justify-center`}
                    >
                      {metric.icon}
                    </div>
                    <CardTitle className="text-sm font-medium text-gray-700">
                      {metric.name}
                    </CardTitle>
                  </div>
                  {metric.isLoading ? (
                    <Skeleton className="h-6 w-12 rounded-full" />
                  ) : (
                    <div
                      className={`text-xs rounded-full px-2 py-1 ${
                        metric.change > 0
                          ? "bg-green-100 text-green-800"
                          : metric.change < 0
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {metric.change > 0 ? "+" : ""}
                      {metric.change}%
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {metric.isLoading ? (
                    <Skeleton className="h-8 w-16 mb-2" />
                  ) : (
                    <div className="text-2xl font-bold text-navy-800">
                      {metric.value}
                    </div>
                  )}
                  <div className="flex justify-between mt-2">
                    {metric.isLoading ? (
                      <Skeleton className="h-4 w-full" />
                    ) : (
                      <>
                        <p className="text-xs text-gray-500">
                          {metric.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          Target: {metric.target}
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Objection Trends - Using the real API data */}
        <motion.div variants={itemVariants}>
          {orgId ? (
            <CategoryTrendChart
              organizationId={orgId}
              startDate={startDate}
              endDate={endDate}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Sales Objection Categories</CardTitle>
                <CardDescription>
                  Select an organization to view data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-500">No organization selected</p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Sentiment Trends */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Trends Over Time</CardTitle>
              <CardDescription>
                Track how your call sentiment has evolved across your last 10
                calls
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {sentimentLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : sentimentChartData && sentimentChartData.length > 0 ? (
                <SentimentChart data={sentimentChartData} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No sentiment data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default InsightsPage;
