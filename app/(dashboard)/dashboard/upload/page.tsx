"use client";

import { useState, JSX, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { File, Upload as UploadIcon, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generatePresignedUrls } from "./action";
import { createClient } from "@/utils/supabase/client";
import { useUploadAsset } from "@/services/callasset/mutation";
import useCurrentOrg from "@/store/useCurrentOrg";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, usePathname } from "next/navigation";
import { ToastAction } from "@/components/ui/toast";
import {
  setAnalysisStartPage,
  getAnalysisStartPage,
  clearAnalysisStartPage,
  notifyAnalysisComplete,
} from "@/utils/analysisTracking";

type FileStatus =
  | "idle"
  | "uploading"
  | "extracting"
  | "success"
  | "error"
  | "analyzing";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: FileStatus;
  error?: string;
  originalFile: File;
  url?: string; // Store the final URL after upload
  assetId?: string; // Store the asset ID for redirection
}

const UploadPage = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get current path
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upload-file");
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [transcriptText, setTranscriptText] = useState("");
  const [isTextSubmitting, setIsTextSubmitting] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Get current organization from state
  const { currentOrg } = useCurrentOrg();

  // TanStack mutation for API calls
  const uploadAssetMutation = useUploadAsset();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Store the current path when component mounts
  useEffect(() => {
    if (pathname && pathname.includes("/upload")) {
      setAnalysisStartPage(pathname);
    }
  }, [pathname]);

  // Effect to redirect when an analysis completes
  useEffect(() => {
    // Check if any file has a 'success' status and we haven't redirected yet
    const successFile = files.find(
      (file) => file.status === "success" && file.assetId
    );

    if (successFile && !hasRedirected) {
      setHasRedirected(true);

      // Notify that analysis is complete
      notifyAnalysisComplete();

      // Get the page where analysis started
      const startPage = getAnalysisStartPage();

      // Only redirect if the user is still on the upload page
      if (pathname === startPage) {
        toast({
          title: "Analysis complete!",
          description: "Redirecting to analysis...",
        });

        // Clear the stored path
        clearAnalysisStartPage();

        // Redirect to analysis page with asset ID
        router.push(`/dashboard/analysis/${successFile.assetId}`);
      } else {
        // If user navigated away, just show a toast with an option to go to analysis
        toast({
          title: "Analysis complete!",
          description: "Your transcript analysis is ready to view.",
          action: (
            <ToastAction
              altText="View results"
              onClick={() =>
                router.push(`/dashboard/analysis/${successFile.assetId}`)
              }
            >
              View results
            </ToastAction>
          ),
        });
      }
    }
  }, [files, hasRedirected, router, toast, pathname]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (fileList: FileList) => {
    const allowedTypes = [
      "text/plain", // .txt
      "application/pdf", // .pdf
      "text/vtt", // .vtt
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    ];

    const newFiles = Array.from(fileList)
      .filter((file) => allowedTypes.includes(file.type))
      .map((file) => ({
        id: Math.random().toString(36).substring(2, 11),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: "idle" as FileStatus,
        originalFile: file,
      }));

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);

      // Get userId from your authentication context or state
      const supabase = await createClient();
      const userId = (await supabase.auth.getSession()).data.session?.user.id;

      if (!userId) {
        toast({
          title: "Error",
          description: "User not authenticated",
          variant: "destructive",
        });
        return;
      }

      try {
        const presignedUrls = await generatePresignedUrls(
          newFiles.map((file) => file.name),
          "application/octet-stream",
          userId as string
        );

        // Filter out any undefined URLs
        const validUrls = presignedUrls.filter(
          (url): url is string => url !== undefined
        );

        if (validUrls.length === 0) {
          console.log("No valid presigned URLs generated.");
          return; // Exit if no valid URLs
        }

        await uploadFilesToBucket(newFiles, validUrls);
      } catch (error) {
        console.error("Error uploading files:", error);
        toast({
          title: "Error",
          description: "Error generating upload URLs",
          variant: "destructive",
        });
      }
    }
  };

  const uploadFilesToBucket = async (
    files: UploadedFile[],
    presignedUrls: string[]
  ) => {
    await Promise.all(
      files.map(async (file, index) => {
        try {
          // Update file status to uploading
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, status: "uploading", progress: 0 } : f
            )
          );

          // Simulate upload progress
          const progressInterval = setInterval(() => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === file.id && f.progress < 90
                  ? { ...f, progress: f.progress + 10 }
                  : f
              )
            );
          }, 300);

          const response = await fetch(presignedUrls[index], {
            method: "PUT",
            body: file.originalFile,
            headers: {
              "Content-Type": file.type,
            },
          });

          clearInterval(progressInterval);

          if (response.ok) {
            // Extract the file URL from the presigned URL
            // The format is typically the URL without the query parameters

            const baseUrl =
              "https://eszghbzdaorgzigavzkm.supabase.co/storage/v1/object/public";

            // Extract the path after "sign/uploads" from the presigned URL
            const urlParts = presignedUrls[index].split("/");
            const signIndex = urlParts.findIndex((part) => part === "sign");

            // Get the path after "uploads" (should include userId and filename)
            const relativePath = urlParts
              .slice(signIndex + 2)
              .join("/")
              .split("?")[0];

            // Construct the proper public URL
            const fileUrl = `${baseUrl}/uploads/${relativePath}`;

            // Update file status to extracting and store the URL
            setFiles((prev) =>
              prev.map((f) =>
                f.id === file.id
                  ? {
                      ...f,
                      status: "extracting",
                      progress: 100,
                      url: fileUrl,
                    }
                  : f
              )
            );

            // Call the API with the file URL
            if (currentOrg && currentOrg.id) {
              // Update to analyzing status
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === file.id ? { ...f, status: "analyzing" } : f
                )
              );

              try {
                const apiResponse = await uploadAssetMutation.mutateAsync({
                  content: fileUrl,
                  type: "FILE",
                  organisationId: currentOrg.id,
                });

                // Store the asset ID from the response for redirection
                const assetId = apiResponse?.asset?.id;

                // Update to success status after API call completes
                setFiles((prev) =>
                  prev.map((f) =>
                    f.id === file.id ? { ...f, status: "success", assetId } : f
                  )
                );

                // Redirection is handled in the useEffect
              } catch (apiError) {
                console.error("API error:", apiError);
                setFiles((prev) =>
                  prev.map((f) =>
                    f.id === file.id
                      ? { ...f, status: "error", error: "Analysis failed" }
                      : f
                  )
                );

                toast({
                  title: "Analysis failed",
                  description: "There was an error analyzing your file.",
                  variant: "destructive",
                });
              }
            } else {
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === file.id
                    ? {
                        ...f,
                        status: "error",
                        error: "No organization selected",
                      }
                    : f
                )
              );

              toast({
                title: "Error",
                description: "No organization selected",
                variant: "destructive",
              });
            }
          } else {
            // Handle error
            setFiles((prev) =>
              prev.map((f) =>
                f.id === file.id
                  ? { ...f, status: "error", error: "Upload failed" }
                  : f
              )
            );

            toast({
              title: "Upload failed",
              description: "Failed to upload file to server.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.log(error);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? { ...f, status: "error", error: "Upload failed" }
                : f
            )
          );

          toast({
            title: "Upload failed",
            description: "An unexpected error occurred.",
            variant: "destructive",
          });
        }
      })
    );
  };

  // Handle text submission
  const handleTextSubmit = async () => {
    if (!transcriptText.trim()) {
      toast({
        title: "Error",
        description: "Please enter transcript text",
        variant: "destructive",
      });
      return;
    }

    if (!currentOrg || !currentOrg.id) {
      toast({
        title: "Error",
        description: "No organization selected",
        variant: "destructive",
      });
      return;
    }

    setIsTextSubmitting(true);

    try {
      const response = await uploadAssetMutation.mutateAsync({
        content: transcriptText,
        type: "TEXT",
        organisationId: currentOrg.id,
      });

      // Clear the textarea on success
      setTranscriptText("");
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }

      // Get the asset ID from the response
      const assetId = response?.asset?.id;

      if (assetId) {
        toast({
          title: "Analysis complete!",
          description: "Redirecting to analysis...",
        });

        // Notify that analysis is complete
        notifyAnalysisComplete();

        // Redirect to the analysis page
        router.push(`/dashboard/analysis/${assetId}`);
      } else {
        // Fallback if no asset ID
        toast({
          title: "Success",
          description:
            "Text submitted successfully, but couldn't find analysis ID.",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error submitting text:", error);
      toast({
        title: "Error",
        description: "Error submitting text",
        variant: "destructive",
      });
    } finally {
      setIsTextSubmitting(false);
    }
  };

  // Add removeFile function
  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const fileIconMap: Record<string, JSX.Element> = {
    "text/plain": <File className="h-6 w-6 text-blue-500" />,
    "application/pdf": <File className="h-6 w-6 text-red-500" />,
    "text/vtt": <File className="h-6 w-6 text-green-500" />,
    "application/msword": <File className="h-6 w-6 text-blue-500" />,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": (
      <File className="h-6 w-6 text-blue-500" />
    ),
  };

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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getStatusText = (status: FileStatus) => {
    switch (status) {
      case "uploading":
        return "Uploading...";
      case "extracting":
        return "Extracting...";
      case "analyzing":
        return "Analyzing...";
      case "success":
        return "Completed";
      case "error":
        return "Failed";
      default:
        return "";
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-6"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Upload Transcripts
          </h1>
          <p className="text-gray-600 mt-2">
            Upload your sales call transcripts for analysis and get personalized
            coaching insights.
          </p>
        </div>

        <Tabs
          defaultValue="upload-file"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="upload-file">Upload File</TabsTrigger>
            <TabsTrigger value="paste-text">Paste Text</TabsTrigger>
          </TabsList>

          <TabsContent value="upload-file">
            <Card>
              <CardHeader>
                <CardTitle>Upload Transcripts</CardTitle>
                <CardDescription>
                  Supported formats: TXT, PDF, VTT, DOC, DOCX
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex flex-col items-center"
                  >
                    <UploadIcon className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Drag and drop your files here
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      or click to browse files from your computer
                    </p>
                    <Button
                      variant="outline"
                      onClick={() =>
                        document.getElementById("file-input")?.click()
                      }
                    >
                      Select Files
                    </Button>
                    <input
                      id="file-input"
                      type="file"
                      accept=".txt,.pdf,.vtt,.doc,.docx"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </motion.div>
                </div>

                {files.length > 0 && (
                  <motion.div
                    className="mt-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Uploaded Files
                    </h3>
                    <div className="space-y-4">
                      {files.map((file) => (
                        <motion.div
                          key={file.id}
                          variants={itemVariants}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-start mb-3">
                            <div className="mr-4">
                              {fileIconMap[file.type] || (
                                <File className="h-6 w-6 text-gray-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {file.name}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {formatFileSize(file.size)}
                                  </p>
                                </div>
                                <div className="flex items-center">
                                  {(file.status === "uploading" ||
                                    file.status === "extracting" ||
                                    file.status === "analyzing") && (
                                    <span className="text-blue-500 text-sm mr-2">
                                      {getStatusText(file.status)}
                                    </span>
                                  )}
                                  {file.status === "success" && (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  )}
                                  {file.status === "error" && (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                  )}
                                  <button
                                    onClick={() => removeFile(file.id)}
                                    className="ml-2 text-gray-400 hover:text-gray-600"
                                    aria-label="Remove file"
                                  >
                                    <XCircle className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                              {(file.status === "uploading" ||
                                file.status === "extracting" ||
                                file.status === "analyzing") && (
                                <div className="mt-2">
                                  <Progress
                                    value={file.progress}
                                    className="h-2"
                                    // Change color based on status
                                    style={{
                                      backgroundColor:
                                        file.status === "extracting" ||
                                        file.status === "analyzing"
                                          ? "#EBF5FF"
                                          : undefined,
                                    }}
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    {file.status === "uploading"
                                      ? "Uploading file to server..."
                                      : file.status === "extracting"
                                      ? "Extracting content..."
                                      : "Analyzing transcript..."}
                                  </p>
                                </div>
                              )}
                              {file.error && (
                                <p className="text-sm text-red-500 mt-1">
                                  {file.error}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paste-text">
            <Card>
              <CardHeader>
                <CardTitle>Paste Transcript Text</CardTitle>
                <CardDescription>
                  Copy and paste your transcript text directly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <textarea
                    ref={textareaRef}
                    className="w-full h-64 p-4 border rounded-md"
                    placeholder="Paste your transcript text here..."
                    onChange={(e) => setTranscriptText(e.target.value)}
                    value={transcriptText}
                  />
                  <div className="mt-4">
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={handleTextSubmit}
                      disabled={
                        isTextSubmitting ||
                        !transcriptText.trim() ||
                        !currentOrg
                      }
                    >
                      {isTextSubmitting ? "Submitting..." : "Submit Transcript"}
                    </Button>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Alert className="mt-8 bg-blue-50 border-blue-200">
          <AlertDescription>
            After uploading, our AI will analyze your transcripts to identify
            objections, sentiment trends, and provide personalized coaching
            insights for your selected team.
          </AlertDescription>
        </Alert>
      </motion.div>
    </>
  );
};

export default UploadPage;
