"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Loader2,
  MessageSquare,
  Mail,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const LeadMagnetForm = () => {
  const router = useRouter();
  const [objectionText, setObjectionText] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Store the data in localStorage
    localStorage.setItem("objectionText", objectionText);
    localStorage.setItem("userEmail", email);

    // Redirect to the microApp results page
    router.push("/microAppResults");

    // Show toast notification
    toast.success("Analysis complete!");
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-navy-600/50 shadow-2xl">
      {/* Enhanced background with gradients and patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 z-0">
        <div className="absolute inset-0 opacity-30">
          {/* Decorative dots pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          {/* Glowing orbs */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-10 transform -translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-10 transform translate-y-1/2 translate-x-1/2"></div>
        </div>
      </div>

      {/* Content with glass effect */}
      <div className="relative z-10 p-8 backdrop-blur-sm bg-navy-800/50">
        <div className="absolute top-0 right-0 w-20 h-20">
          <svg
            className="w-full h-full text-blue-500/10"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M42.7,-73.4C54.9,-67.8,64.2,-55.5,71.5,-42.3C78.7,-29.1,84,-15,82.5,-1.9C81,11.3,72.7,22.6,65.3,34.5C58,46.4,51.5,58.9,41.3,66.4C31.1,73.9,17.1,76.3,2.4,73.3C-12.3,70.3,-27.5,61.9,-38.7,51.7C-49.9,41.5,-57.1,29.5,-62.9,16.1C-68.7,2.7,-73,-12.2,-70.4,-25.2C-67.7,-38.3,-58,-49.5,-46.1,-55.1C-34.2,-60.8,-20.1,-60.8,-5.8,-61.3C8.5,-61.8,17,-79,30.5,-79.1C44,-79.2,60.5,-61.1,67.8,-50.8Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        <div className="mb-6">
          <div className="inline-flex items-center px-3 py-1 mb-3 bg-blue-500/20 rounded-full border border-blue-400/20">
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
            <span className="text-xs font-medium text-blue-300">
              AI-Powered Analysis
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Sales Objection Analyzer
          </h2>
          <p className="text-gray-300 text-sm">
            Get instant insights on how to handle customer objections
            effectively
          </p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-navy-700/50 rounded-lg p-4 border border-navy-600/50">
              <label
                htmlFor="objection"
                className="flex items-center text-sm font-medium mb-2 text-gray-200"
              >
                <MessageSquare className="h-4 w-4 mr-2 text-blue-400" />
                Paste your sales call objection
              </label>
              <Textarea
                id="objection"
                placeholder="Example: I think your product is too expensive compared to other options we're looking at."
                className="bg-navy-600/70 border-navy-500/70 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows={4}
                value={objectionText}
                onChange={(e) => setObjectionText(e.target.value)}
                required
              />
            </div>

            <div className="bg-navy-700/50 rounded-lg p-4 border border-navy-600/50">
              <label
                htmlFor="email"
                className="flex items-center text-sm font-medium mb-2 text-gray-200"
              >
                <Mail className="h-4 w-4 mr-2 text-blue-400" />
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-navy-600/70 border-navy-500/70 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-gray-400 mt-2 ml-6">
                We&apos;ll email you the analysis and tips for handling similar
                objections.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 py-5 font-medium text-white shadow-lg shadow-blue-900/30 mt-6 border border-blue-500/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Objection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-5">
            <h3 className="font-semibold text-lg text-white flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-400" />
              Objection Analysis
            </h3>
            <div className="bg-navy-600/70 backdrop-blur-md rounded-lg p-5 text-white border border-navy-500/70">
              {result}
            </div>
            <div className="text-sm text-gray-300 mt-4 bg-blue-900/30 backdrop-blur-sm p-4 rounded-lg border border-blue-800/30">
              <p className="font-medium mb-1">Want more insights like this?</p>
              <p className="text-gray-400">
                Sign up for a free trial to access our premium analysis tools!
              </p>
            </div>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 py-5 font-medium text-white shadow-lg shadow-blue-900/30 border border-blue-500/20"
            >
              <Link href="/signup">
                Sign Up for Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadMagnetForm;
