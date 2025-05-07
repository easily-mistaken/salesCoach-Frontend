"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronRight,
  Book,
  FileText,
  HelpCircle,
  Code,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const docCategories = [
  {
    title: "Getting Started",
    icon: Book,
    items: [
      { title: "Quick Start Guide", href: "#quick-start" },
      { title: "Account Setup", href: "#account-setup" },
      { title: "First Analysis", href: "#first-analysis" },
      { title: "Understanding Reports", href: "#understanding-reports" },
    ],
  },
  {
    title: "Transcripts & Analysis",
    icon: FileText,
    items: [
      { title: "Uploading Transcripts", href: "#uploading" },
      { title: "Supported Formats", href: "#formats" },
      { title: "Analysis Features", href: "#features" },
      { title: "Exporting Results", href: "#exporting" },
    ],
  },
  {
    title: "API Documentation",
    icon: Code,
    items: [
      { title: "Authentication", href: "#api-auth" },
      { title: "Transcripts API", href: "#transcripts-api" },
      { title: "Analysis API", href: "#analysis-api" },
      { title: "Reports API", href: "#reports-api" },
    ],
  },
  {
    title: "Troubleshooting",
    icon: HelpCircle,
    items: [
      { title: "Common Issues", href: "#common-issues" },
      { title: "Error Messages", href: "#errors" },
      { title: "Contact Support", href: "#support" },
    ],
  },
];

const faqs = [
  {
    question: "How do I upload my first transcript?",
    answer:
      "Navigate to the Dashboard and click on the 'Upload' button. You can drag and drop your transcript file or click to browse your files. Supported formats include TXT, PDF, VTT, DOC, and DOCX.",
  },
  {
    question: "What information does the AI analyze in my transcripts?",
    answer:
      "Our AI analyzes various aspects of your sales calls including sentiment, objections raised and how they were handled, talk ratio between sales rep and prospect, questions asked, and key moments in the conversation.",
  },
  {
    question: "How long does analysis take?",
    answer:
      "Most transcripts are analyzed within 1-2 minutes, depending on length. You'll receive a notification when your analysis is ready to view.",
  },
  {
    question: "Can I export the analysis results?",
    answer:
      "Yes, you can export your results in PDF or CSV format. Go to the Analysis page for a specific transcript and click the 'Export' button in the top-right corner.",
  },
  {
    question: "How do I add team members?",
    answer:
      "On the Pro and Enterprise plans, you can add team members by going to the Team section of your dashboard. Click 'Invite Member' and enter their email address.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we take data security seriously. All data is encrypted both in transit and at rest. We never share your data with third parties, and we are compliant with major privacy regulations.",
  },
];

const apiDocs = `
// Example API request to analyze a transcript
curl -X POST https://api.salescoach.guru/v1/transcripts \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Your transcript text here",
    "options": {
      "includeObjections": true,
      "includeSentiment": true,
      "includeKeyInsights": true
    }
  }'
`;

const Docs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("guides");

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
          <div className="max-w-5xl mx-auto">
            <motion.div variants={itemVariants} className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Documentation
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Everything you need to know about using CloseDash
              </p>

              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search documentation..."
                    className="pl-10 py-6 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </motion.div>

            <Tabs
              defaultValue="guides"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-8 w-full grid grid-cols-3">
                <TabsTrigger value="guides">User Guides</TabsTrigger>
                <TabsTrigger value="api">API Docs</TabsTrigger>
                <TabsTrigger value="faq">FAQs</TabsTrigger>
              </TabsList>

              <TabsContent value="guides">
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {docCategories.map((category) => (
                    <motion.div
                      key={category.title}
                      variants={itemVariants}
                      className="bg-white rounded-xl shadow-xs p-6"
                    >
                      <div className="flex items-center mb-4">
                        <category.icon className="h-6 w-6 text-blue-600 mr-3" />
                        <h2 className="text-xl font-bold">{category.title}</h2>
                      </div>

                      <ul className="space-y-2">
                        {category.items.map((item) => (
                          <li key={item.title}>
                            <a
                              href={item.href}
                              className="flex items-center py-2 px-3 hover:bg-blue-50 rounded-md transition-colors"
                            >
                              <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                              <span>{item.title}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="mt-10 text-center"
                >
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    Can&apos;t find what you&apos;re looking for?
                  </h3>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Contact Support
                  </Button>
                </motion.div>
              </TabsContent>

              <TabsContent value="api">
                <motion.div variants={itemVariants}>
                  <div className="bg-white rounded-xl shadow-xs p-8">
                    <h2 className="text-2xl font-bold mb-4">
                      API Documentation
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Our RESTful API allows you to integrate CloseDash&apos;s
                      powerful analysis capabilities into your own applications
                      and workflows.
                    </p>

                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-3">
                        Authentication
                      </h3>
                      <p className="text-gray-600 mb-3">
                        All API requests require authentication using an API
                        key. You can generate an API key in your account
                        settings.
                      </p>
                      <div className="bg-gray-900 text-white p-4 rounded-md">
                        <pre>
                          <code>
                            curl -H &quot;Authorization&: Bearer
                            YOUR_API_KEY&quot;
                            https://api.salescoach.guru/v1/transcripts
                          </code>
                        </pre>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-3">
                        Example Request
                      </h3>
                      <div className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto">
                        <pre>
                          <code>{apiDocs}</code>
                        </pre>
                      </div>
                    </div>

                    <div className="text-center mt-8">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        View Full API Reference
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="faq">
                <motion.div variants={containerVariants} className="space-y-6">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="bg-white rounded-xl shadow-xs p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </motion.div>
                  ))}

                  <motion.div
                    variants={itemVariants}
                    className="mt-8 text-center"
                  >
                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                      Have more questions?
                    </h3>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Button variant="outline">Browse All FAQs</Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Contact Support
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default Docs;
