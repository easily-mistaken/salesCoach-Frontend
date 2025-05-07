"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Upload, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadMagnetForm from "@/components/LeadMagnetForm";

const MicroApp = () => {
  const navigate = useRouter();
  const [activeTab, setActiveTab] = useState("upload");
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    setFile(file);
  };

  const handleUpload = () => {
    if (!file) return;

    setIsUploading(true);

    // In a real app, this would upload the file to the server
    setTimeout(() => {
      setIsUploading(false);
      navigate.push("/microAppResults");
    }, 2000);
  };

  const handleTextSubmit = (text: string) => {
    // In a real app, this would process the text
    setTimeout(() => {
      console.log(text);
      navigate.push("/microAppResults");
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
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

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-indigo-50 via-blue-50 to-slate-100">
      <Navbar />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex-1"
      >
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <motion.h1
                variants={itemVariants}
                className="text-4xl font-bold text-gray-900 mb-4"
              >
                Free Sales Call Analyzer
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-600"
              >
                Upload a transcript and get instant AI-powered insights without
                creating an account.
              </motion.p>
            </div>

            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Analyze Your Sales Call</CardTitle>
                  <CardDescription>
                    Upload a transcript or paste text to get a free sample
                    analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs
                    defaultValue="upload"
                    value={activeTab}
                    onValueChange={setActiveTab}
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="upload">Upload File</TabsTrigger>
                      <TabsTrigger value="paste">Paste Text</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload">
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
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
                          {!file ? (
                            <>
                              <Upload className="h-10 w-10 text-gray-400 mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-1">
                                Drag and drop your transcript file
                              </h3>
                              <p className="text-sm text-gray-500 mb-4">
                                Supports TXT, PDF, VTT, DOC, DOCX (max 10MB)
                              </p>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  document.getElementById("file-input")?.click()
                                }
                              >
                                Browse Files
                              </Button>
                              <input
                                id="file-input"
                                type="file"
                                accept=".txt,.pdf,.vtt,.doc,.docx"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                            </>
                          ) : (
                            <div className="w-full">
                              <div className="flex items-center justify-center mb-4">
                                <FileText className="h-8 w-8 text-blue-500 mr-3" />
                                <div className="text-left">
                                  <p className="font-medium text-gray-900">
                                    {file.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>

                              <div className="flex space-x-3">
                                <Button
                                  variant="outline"
                                  onClick={() => setFile(null)}
                                  className="flex-1"
                                >
                                  Remove
                                </Button>
                                <Button
                                  onClick={handleUpload}
                                  disabled={isUploading}
                                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  {isUploading ? "Uploading..." : "Analyze Now"}
                                  {!isUploading && (
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </TabsContent>

                    <TabsContent value="paste">
                      <div className="space-y-4">
                        <textarea
                          className="w-full h-40 p-3 border rounded-md"
                          placeholder="Paste your transcript text here..."
                        />
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleTextSubmit("Sample text")}
                        >
                          Analyze Text <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-12 bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Get Full Access
              </h2>
              <p className="text-gray-600 mb-8">
                Sign up for a free trial to unlock the full power of our AI
                sales coaching platform. The complete version includes:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start">
                  <div className="shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p>Advanced objection handling analysis</p>
                </div>
                <div className="flex items-start">
                  <div className="shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p>Comprehensive sentiment analysis</p>
                </div>
                <div className="flex items-start">
                  <div className="shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p>Personalized coaching recommendations</p>
                </div>
                <div className="flex items-start">
                  <div className="shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p>Performance tracking over time</p>
                </div>
              </div>

              <LeadMagnetForm />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default MicroApp;
