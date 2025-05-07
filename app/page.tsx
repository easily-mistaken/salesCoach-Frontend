"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart2,
  CheckCircle,
  PlayCircle,
  Shield,
  Upload,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LogoCloud from "@/components/LogoCloud";
import HeroIllustration from "@/components/HeroIllustration";
import TestimonialCard from "@/components/TestimonialCard";
import LeadMagnetForm from "@/components/LeadMagnetForm";
import LandingPagePricing from "@/components/LandingPagePricing";
import { useState } from "react";
import { DemoModal } from "@/components/DemoModal";

const Index = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 text-white">
        {/* Background gradient with overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-navy-800 via-navy-700 to-accent/90 z-0"></div>

        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-up">
              <div className="inline-block bg-white/10 backdrop-blur-xs px-4 py-1 rounded-full text-sm font-medium text-accent mb-2">
                AI-Powered Sales Coaching
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                Transform Your Sales Calls Into{" "}
                <span className="text-accent">Coaching Insights</span>
              </h1>
              <p className="text-xl text-gray-200 max-w-xl">
                Upload your sales call transcripts and get personalized
                coaching, objection handling advice, and performance metrics in
                seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-white font-medium"
                >
                  <Link href="/signup">Start for Free</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-medium"
                >
                  <Link
                    href="#how-it-works"
                    className="flex items-center gap-2"
                  >
                    <PlayCircle className="h-5 w-5" />
                    How It Works
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-white font-medium"
                >
                  <Link href="/microApp">Try Our Objection Analyzer</Link>
                </Button>
              </div>
              <p className="text-sm text-gray-300 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                No credit card required for 14-day trial
              </p>
            </div>
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-full max-w-md">
                <div
                  className="absolute -left-6 -top-6 w-24 h-24 bg-accent/20 rounded-full z-0 animate-pulse"
                  style={{ animationDuration: "4s" }}
                ></div>
                <div
                  className="absolute -right-10 -bottom-4 w-32 h-32 bg-[#0d9488]/20 rounded-full z-0 animate-pulse"
                  style={{ animationDuration: "6s" }}
                ></div>
                <HeroIllustration />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Cloud */}
      <LogoCloud />

      {/* Features Section */}
      <section
        id="features"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-gray-50 to-white"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          ></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <span className="bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
              Key Features
            </span>
            <h2 className="text-4xl font-bold text-navy-800 mb-4">
              Powerful Sales Coaching at Your Fingertips
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              CloseDash helps you improve your sales calls with AI-powered
              insights and personalized coaching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-lg shadow-blue-100/60 border border-gray-200 overflow-hidden group hover:-translate-y-2 transition-all duration-300">
              <div className="p-8">
                <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-navy-800 mb-3">
                  Easy Transcript Upload
                </h3>
                <p className="text-gray-600">
                  Upload transcripts in multiple formats and get insights in
                  seconds. No complicated setup required.
                </p>
              </div>
              <div className="h-2 bg-linear-to-r from-blue-500 to-blue-600"></div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-lg shadow-teal-100/60 border border-gray-200 overflow-hidden group hover:-translate-y-2 transition-all duration-300">
              <div className="p-8">
                <div className="h-14 w-14 bg-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart2 className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-navy-800 mb-3">
                  Detailed Analytics
                </h3>
                <p className="text-gray-600">
                  Get comprehensive metrics on talk time, questions asked,
                  objections handled, and customer sentiment.
                </p>
              </div>
              <div className="h-2 bg-linear-to-r from-teal-500 to-teal-600"></div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-lg shadow-purple-100/60 border border-gray-200 overflow-hidden group hover:-translate-y-2 transition-all duration-300">
              <div className="p-8">
                <div className="h-14 w-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-navy-800 mb-3">
                  Secure & Private
                </h3>
                <p className="text-gray-600">
                  Your sales data stays private. We use enterprise-grade
                  encryption to protect all your information.
                </p>
              </div>
              <div className="h-2 bg-linear-to-r from-purple-500 to-purple-600"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        {/* Enhanced background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30"></div>
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-teal-500/5 to-emerald-500/5 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>

        {/* Decorative dots pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <span className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block border border-blue-200/30">
              Simple Process
            </span>
            <h2 className="text-4xl font-bold text-navy-800 mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started with CloseDash is simple and takes just minutes.
            </p>
          </div>

          {/* Connected steps with line */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connection line (visible on md and up screens) */}
            <div className="hidden md:block absolute top-24 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-gradient-to-r from-blue-300 via-teal-300 to-purple-300"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-200 rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center mb-6 font-semibold text-lg shadow-lg shadow-blue-200/50 transform transition-all duration-500 group-hover:scale-110 relative z-10">
                  <Upload className="h-8 w-8" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl w-full">
                <h3 className="text-xl font-semibold text-navy-800 mb-3">
                  Upload Transcripts
                </h3>
                <p className="text-gray-600">
                  Upload your sales call transcripts in TXT, PDF, VTT, DOC, or
                  DOCX format.
                </p>
                <div className="mt-6 flex justify-center">
                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                    Step 1
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-200 rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div className="h-20 w-20 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-full flex items-center justify-center mb-6 font-semibold text-lg shadow-lg shadow-teal-200/50 transform transition-all duration-500 group-hover:scale-110 relative z-10">
                  <BarChart2 className="h-8 w-8" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl w-full">
                <h3 className="text-xl font-semibold text-navy-800 mb-3">
                  AI Analysis
                </h3>
                <p className="text-gray-600">
                  Our AI analyzes your calls for objections, sentiment, talk
                  time, and more.
                </p>
                <div className="mt-6 flex justify-center">
                  <span className="bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full font-medium">
                    Step 2
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-200 rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300"></div>
                <div className="h-20 w-20 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-full flex items-center justify-center mb-6 font-semibold text-lg shadow-lg shadow-purple-200/50 transform transition-all duration-500 group-hover:scale-110 relative z-10">
                  <CheckCircle className="h-8 w-8" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl w-full">
                <h3 className="text-xl font-semibold text-navy-800 mb-3">
                  Get Coaching
                </h3>
                <p className="text-gray-600">
                  Receive personalized coaching advice and actionable insights
                  to improve your sales calls.
                </p>
                <div className="mt-6 flex justify-center">
                  <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-medium">
                    Step 3
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg font-medium shadow-lg shadow-blue-900/20 transition-all duration-300 hover:shadow-xl hover:scale-105 rounded-full"
            >
              <Link href="/signup">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <div className="mt-8 flex justify-center items-center">
              <Button
                variant="ghost"
                onClick={() => setIsDemoModalOpen(true)}
                className="flex items-center text-navy-800 hover:text-blue-600 hover:bg-transparent transition-colors"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Watch Demo</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Magnet */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-linear-to-br from-navy-800 via-navy-700 to-navy-900"></div>

        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Blurred circles */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#0d9488] opacity-20 rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-accent text-sm font-medium mb-6">
                <div className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse"></div>
                Free Tool
              </div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Try Our Free Sales Objection Analyzer
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Paste a section of your sales call where a customer raised an
                objection, and see how our AI can help you handle it better.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs p-3 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-accent/20 shrink-0 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-accent" />
                  </div>
                  <p className="text-white font-medium">
                    Identify objection type and underlying concerns
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs p-3 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-accent/20 shrink-0 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-accent" />
                  </div>
                  <p className="text-white font-medium">
                    Get suggested responses that actually work
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs p-3 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-accent/20 shrink-0 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-accent" />
                  </div>
                  <p className="text-white font-medium">
                    Improve your objection handling skills instantly
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-8 shadow-xl relative">
              <div className="absolute -top-4 -right-4 bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                100% Free
              </div>
              <LeadMagnetForm />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30"></div>
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl transform -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-l from-purple-500/5 to-pink-500/5 rounded-full blur-3xl transform translate-y-1/2"></div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-20 opacity-20 hidden lg:block">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M120 60C120 93.1371 93.1371 120 60 120C26.8629 120 0 93.1371 0 60C0 26.8629 26.8629 0 60 0C93.1371 0 120 26.8629 120 60ZM12 60C12 86.5097 33.4903 108 60 108C86.5097 108 108 86.5097 108 60C108 33.4903 86.5097 12 60 12C33.4903 12 12 33.4903 12 60Z"
              fill="#4F46E5"
              fillOpacity="0.1"
            />
          </svg>
        </div>

        <div className="absolute left-20 bottom-20 opacity-20 hidden lg:block">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="80"
              height="80"
              rx="8"
              fill="#0284C7"
              fillOpacity="0.1"
            />
          </svg>
        </div>

        {/* Large quote marks */}
        <div className="absolute left-0 top-1/3 text-[120px] font-serif text-blue-500/10 -z-10 hidden lg:block">
          &quot;
        </div>
        <div className="absolute right-0 bottom-1/3 text-[120px] font-serif text-blue-500/10 -z-10 hidden lg:block">
          &quot;
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <span className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block border border-blue-200/30">
              Success Stories
            </span>
            <h2 className="text-4xl font-bold text-navy-800 mb-4 tracking-tight">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join hundreds of sales professionals who are improving their calls
              with CloseDash.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="The objection handling advice alone is worth the price. I've seen a 15% increase in my close rate since using CloseDash."
              name="Sarah Johnson"
              title="Account Executive, TechCorp"
              gradientFrom="blue-500"
              gradientTo="blue-700"
            />
            <TestimonialCard
              quote="As a new sales rep, this tool has been invaluable for my training. I can learn from my calls and improve much faster."
              name="Michael Chen"
              title="SDR, GrowthSoft"
              gradientFrom="teal-500"
              gradientTo="teal-700"
            />
            <TestimonialCard
              quote="I was skeptical at first, but the insights are spot on. It's like having a sales coach review every one of my calls."
              name="Jessica Miller"
              title="Sales Manager, FinServe"
              gradientFrom="purple-500"
              gradientTo="purple-700"
            />
          </div>

          {/* View more testimonials button */}
          {/* <div className="mt-12 text-center">
            <Button
              asChild
              variant="outline"
              className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 font-medium px-6 py-3 rounded-full transition-colors"
            >
              <Link href="/testimonials">
                View More Testimonials
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div> */}
        </div>
      </section>

      {/* Pricing Section */}
      <LandingPagePricing />

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden text-white">
        {/* Enhanced background with navy gradients and patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700">
          <div className="absolute inset-0">
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
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10 transform -translate-y-1/2 -translate-x-1/4"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-10 transform translate-y-1/2 translate-x-1/4"></div>

            {/* Additional decorative element */}
            <div className="absolute top-1/2 right-1/4 w-64 h-64 opacity-20">
              <svg
                className="w-full h-full text-blue-500"
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
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto backdrop-blur-sm bg-navy-800/40 p-12 rounded-2xl border border-navy-600/30 shadow-2xl">
            <div className="inline-flex items-center px-4 py-1.5 mb-6 bg-blue-500/20 rounded-full border border-blue-400/20">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">
                AI-Powered Coaching
              </span>
            </div>

            <h2 className="text-3xl font-bold mb-6">
              Ready to improve your sales conversations?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of sales professionals who are using AI to improve
              their sales skills and close more deals.
            </p>

            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-6 text-lg font-medium shadow-lg shadow-blue-900/30 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-blue-500/20"
            >
              <Link href="/signup">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </div>
  );
};

export default Index;
