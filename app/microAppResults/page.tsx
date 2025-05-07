"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import LeadMagnetForm from "@/components/LeadMagnetForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Sample data for the micro app results
const sampleData = {
  sentiment: {
    positive: 65,
    neutral: 23,
    negative: 12,
    timeline: [
      { time: "0:00", score: 0.6 },
      { time: "1:00", score: 0.7 },
      { time: "2:00", score: 0.5 },
      { time: "3:00", score: 0.3 },
      { time: "4:00", score: 0.2 },
      { time: "5:00", score: 0.4 },
      { time: "6:00", score: 0.5 },
      { time: "7:00", score: 0.7 },
      { time: "8:00", score: 0.8 },
      { time: "9:00", score: 0.9 },
    ],
  },
  keyInsights: [
    "Prospect showed high engagement at the beginning and end of the call",
    "Price was mentioned as a potential concern",
    "Implementation timeline discussion led to decreased sentiment",
    "Demo portion of the call elicited the most positive response",
    "Multiple stakeholders will be involved in decision-making process",
  ],
  objections: [
    {
      text: "We're concerned about the implementation timeline",
      suggestion:
        "Offer a phased implementation approach with clear milestones",
      importance: "High",
    },
    {
      text: "The pricing seems higher than we budgeted",
      suggestion: "Focus on ROI and value proposition when discussing cost",
      importance: "Medium",
    },
  ],
  talkRatio: {
    salesperson: 62,
    prospect: 38,
  },
};

const MicroAppResults = () => {
  const [formVisible, setFormVisible] = useState(false);

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
          <div className="max-w-4xl mx-auto">
            <motion.div variants={itemVariants} className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Your Sample Analysis Results
              </h1>
              <p className="text-lg text-gray-600">
                Below is a preview of the insights our AI can generate from your
                sales calls
              </p>
            </motion.div>

            <Alert className="mb-8 bg-blue-50 border-blue-200">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                This is a limited preview. Sign up for a free trial to access
                your full analysis.
              </AlertDescription>
            </Alert>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            >
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Sentiment Analysis</CardTitle>
                    <CardDescription>
                      Emotional tone throughout the call
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-1">
                          Overall Sentiment
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-500">
                                Positive
                              </span>
                              <span className="text-xs font-medium">
                                {sampleData.sentiment.positive}%
                              </span>
                            </div>
                            <Progress
                              value={sampleData.sentiment.positive}
                              className="h-2"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-500">
                                Neutral
                              </span>
                              <span className="text-xs font-medium">
                                {sampleData.sentiment.neutral}%
                              </span>
                            </div>
                            <Progress
                              value={sampleData.sentiment.neutral}
                              className="h-2"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-500">
                                Negative
                              </span>
                              <span className="text-xs font-medium">
                                {sampleData.sentiment.negative}%
                              </span>
                            </div>
                            <Progress
                              value={sampleData.sentiment.negative}
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-1">
                          Sentiment Timeline
                        </h3>
                        {/* <div className="h-40">
                          <SentimentChart 
                            data={sampleData.sentiment.timeline} 
                            timeKey="time"
                            scoreKey="score"
                            showLegend={true}
                          />
                        </div> */}
                        <div className="mt-3 text-xs text-center text-gray-500">
                          * Timeline shows emotional tone throughout the
                          conversation
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle>Key Insights</CardTitle>
                    <CardDescription>
                      Important takeaways from your call
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {sampleData.keyInsights.map((insight, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: index * 0.1 + 0.5,
                            duration: 0.3,
                          }}
                          className="flex items-start"
                        >
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-800 text-xs mr-2 mt-0.5 shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-sm text-gray-700">
                            {insight}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Objection Analysis</CardTitle>
                  <CardDescription>
                    Identified objections and response suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sampleData.objections.map((objection, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <h3 className="font-medium text-gray-900">
                            {objection.text}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              objection.importance === "High"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {objection.importance} Priority
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Suggestion:</span>{" "}
                          {objection.suggestion}
                        </p>
                      </div>
                    ))}

                    <div className="flex justify-center">
                      <Link href="/register">
                        <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                          Unlock Full Objection Analysis
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Talk Ratio</CardTitle>
                  <CardDescription>
                    Balance of speaking time in the conversation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Sales Rep</span>
                        <span className="text-sm font-medium">
                          {sampleData.talkRatio.salesperson}%
                        </span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${sampleData.talkRatio.salesperson}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Prospect</span>
                        <span className="text-sm font-medium">
                          {sampleData.talkRatio.prospect}%
                        </span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${sampleData.talkRatio.prospect}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Best practice: Keep your talk ratio below 60% to ensure
                    you&apos;re listening to your prospect.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg p-8 text-center"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready for the full analysis?
              </h2>
              <p className="text-gray-600 mb-6">
                This is just a preview of what our AI sales coach can do. Sign
                up for a free trial to unlock all features, including advanced
                objection handling analysis, comprehensive sentiment insights,
                and personalized coaching.
              </p>

              {!formVisible ? (
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setFormVisible(true)}
                >
                  Start Free Trial
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <LeadMagnetForm />
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default MicroAppResults;
