"use client";
import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Download,
  FileText,
  ListFilter,
  Search,
  ChevronDown,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast, Toaster } from "react-hot-toast";
import { useGetTranscripts } from "@/services/dashboard/query";
import useCurrentOrg from "@/store/useCurrentOrg";
import Link from "next/link";
import { useDeleteAsset } from "@/services/callasset/mutation";

// Define the status type for type safety
type TranscriptStatus = "PENDING" | "SUCCESS" | "FAIL";

// Map API status to UI status
const statusMap: Record<
  TranscriptStatus,
  "processing" | "processed" | "failed"
> = {
  PENDING: "processing",
  SUCCESS: "processed",
  FAIL: "failed",
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error in TranscriptsPage:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-red-600 mb-2">
                  Something went wrong
                </h2>
                <p className="text-gray-600 mb-4">
                  We're having trouble loading the transcripts. Please try again
                  later.
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

const TranscriptsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { currentOrg } = useCurrentOrg();
  const orgId = currentOrg?.id || "";

  const {
    data: transcripts,
    isLoading,
    isError,
    refetch,
  } = useGetTranscripts(orgId, page, limit);

  // Filter transcripts based on search term
  const filteredTranscripts = React.useMemo(() => {
    if (!transcripts?.data) return [];
    return transcripts.data.filter((transcript) =>
      (transcript.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transcripts?.data, searchTerm]);

  // Handle page change
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (transcripts?.pagination && page < transcripts.pagination.pages) {
      setPage(page + 1);
    }
  };

  // Calculate sentiment percentage if analysis is available
  const calculateSentiment = React.useCallback((transcript: any) => {
    if (!transcript?.analysis?.overallSentiment) return null;
    // Convert from -1 to 1 scale to 0 to 100 scale
    return ((transcript.analysis.overallSentiment + 1) / 2) * 100;
  }, []);

  // Error handling
  useEffect(() => {
    if (isError) {
      toast.error("Failed to load transcripts. Please try again.");
    }
  }, [isError]);

  // Move the hook call before any conditional return statements
  const { mutate: deleteAsset } = useDeleteAsset();

  if (!orgId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="pt-6">
            No organization selected. Please select an organization first.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        }
      >
        <Toaster />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-navy-800">Transcripts</h1>
              <p className="text-gray-600">
                Browse and analyze your call transcripts
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  toast.success("Filter applied!");
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
                  toast.success("Data exported successfully!");
                }}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search transcripts..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.success("Advanced search applied!");
                  }}
                >
                  Advanced Search
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Transcripts</CardTitle>
              <CardDescription>
                {isLoading
                  ? "Loading transcripts..."
                  : `${filteredTranscripts.length} transcripts found (${
                      transcripts?.pagination?.total || 0
                    } total)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  <span className="ml-2 text-gray-500">
                    Loading transcripts...
                  </span>
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center py-16 text-red-500">
                  <p>Failed to load transcripts. Please try again.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => refetch()}
                  >
                    Retry
                  </Button>
                </div>
              ) : filteredTranscripts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <FileText className="h-12 w-12 mb-3 text-gray-400" />
                  <p>No transcripts found</p>
                  <p className="text-sm mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="max-w-[200px]">Title</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Sentiment</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-[80px] text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTranscripts.map((transcript) => {
                          const sentiment = calculateSentiment(transcript);
                          const status =
                            statusMap[transcript.status as TranscriptStatus] ||
                            "processing";
                          const analysisDate =
                            transcript.analysis?.date || transcript.createdAt;

                          return (
                            <TableRow key={transcript.id}>
                              <TableCell className="font-medium max-w-[200px]">
                                <Link
                                  href={`/dashboard/analysis/${transcript.id}`}
                                  className="hover:underline flex items-center truncate"
                                >
                                  <FileText className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                                  <span className="truncate">
                                    {transcript.analysis?.title ||
                                      "Unnamed Transcript"}
                                  </span>
                                </Link>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center text-gray-600">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  {formatDate(analysisDate)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center text-gray-600">
                                  <Clock className="h-4 w-4 mr-2" />
                                  {transcript.analysis?.duration || "N/A"}
                                </div>
                              </TableCell>
                              <TableCell>
                                {status === "processed" &&
                                sentiment !== null ? (
                                  <div className="flex items-center">
                                    <div className="mr-2 h-2 w-full max-w-24 rounded-full bg-gray-200">
                                      <div
                                        className={`h-2 rounded-full ${
                                          sentiment > 70
                                            ? "bg-green-500"
                                            : sentiment > 40
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                        }`}
                                        style={{ width: `${sentiment}%` }}
                                      />
                                    </div>
                                    <span>{Math.round(sentiment)}%</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-500">--</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    status === "processed"
                                      ? "bg-green-100 text-green-800"
                                      : status === "processing"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {status === "processed"
                                    ? "Processed"
                                    : status === "processing"
                                    ? "Processing"
                                    : "Failed"}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                    >
                                      <span className="sr-only">Open menu</span>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem>
                                      <Link
                                        href={`/dashboard/analysis/${transcript.id}`}
                                      >
                                        View Analysis
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        if (transcript.type === "FILE") {
                                          window.open(transcript.content);
                                        } else {
                                          navigator.clipboard
                                            .writeText(transcript.content)
                                            .then(() =>
                                              toast.success(
                                                "Transcript copied successfully"
                                              )
                                            );
                                        }
                                      }}
                                    >
                                      Download Transcript
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => {
                                        deleteAsset({ id: transcript.id });
                                      }}
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {transcripts?.pagination &&
                    transcripts.pagination.pages > 1 && (
                      <div className="flex justify-center mt-6">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={handlePreviousPage}
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
                            onClick={handleNextPage}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default TranscriptsPage;
