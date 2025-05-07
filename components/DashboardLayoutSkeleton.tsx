"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  PieChart,
  Settings,
  Upload,
  Users,
} from "lucide-react";

const DashboardLayoutSkeleton = () => {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Teams", href: "/dashboard/teams", icon: Users },
    { name: "Upload", href: "/dashboard/upload", icon: Upload },
    { name: "Transcripts", href: "/dashboard/transcripts", icon: FileText },
    { name: "Objections", href: "/dashboard/objections", icon: MessageSquare },
    { name: "Insights", href: "/dashboard/insights", icon: PieChart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Real Sidebar - not a skeleton */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col h-full bg-navy-800 overflow-y-auto">
          {/* Sidebar header */}
          <div className="flex items-center h-16 shrink-0 px-4 border-b border-navy-700">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-white">
                CloseDash<span className="text-[#0284c7]">.io</span>
              </span>
            </Link>
          </div>

          {/* Sidebar navigation */}
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-navy-700 hover:text-white"
                >
                  <item.icon className="mr-3 shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Upload section */}
          <div className="p-4 border-t border-navy-700">
            <div className="rounded-md overflow-hidden">
              <div className="px-3 py-2 bg-navy-700 text-white text-sm font-medium">
                Quick Upload
              </div>
              <div className="p-3 bg-navy-700 bg-opacity-50">
                <label
                  htmlFor="sidebar-dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-24 border border-navy-600 border-dashed rounded-md cursor-pointer hover:bg-navy-700 transition-colors duration-200"
                >
                  <div className="flex flex-col items-center justify-center p-2">
                    <Upload className="h-5 w-5 text-gray-400 mb-1" />
                    <p className="text-xs text-gray-300 text-center">
                      <span className="font-medium">Click to upload</span> or
                      drag files
                    </p>
                  </div>
                  <input
                    id="sidebar-dropzone-file"
                    type="file"
                    className="hidden"
                    disabled={true}
                    accept=".txt,.pdf,.vtt,.doc,.docx"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Help section */}
          <div className="p-4 border-t border-navy-700">
            <div className="rounded-md">
              <Link
                href="/help"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-navy-700 hover:text-white"
              >
                <HelpCircle className="mr-3 shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
                Help & Support
              </Link>
            </div>
          </div>

          {/* Organization section skeleton */}
          <div className="p-4 border-t border-navy-700 mt-auto">
            <div className="rounded-md bg-navy-700 bg-opacity-50 p-3">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gray-500 rounded-full mr-3"></div>
                <div className="overflow-hidden">
                  <div className="h-4 w-20 bg-gray-500 rounded-md mb-1"></div>
                  <div className="h-3 w-16 bg-gray-500 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu - just a placeholder when in loading state */}
      <div className="md:hidden fixed inset-0 flex z-40 transition-opacity duration-300 opacity-0 pointer-events-none">
        {/* Mobile menu will be handled by the regular component after loading */}
      </div>

      {/* Main content skeleton */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top navigation skeleton */}
        <div className="sticky top-0 z-10 md:hidden shrink-0 flex h-16 bg-white border-b border-gray-200">
          <div className="px-4 flex items-center justify-between w-full">
            <div className="h-6 w-40 bg-gray-200 rounded-md"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Top bar desktop skeleton */}
        <div className="hidden md:flex sticky top-0 z-10 shrink-0 h-16 bg-white border-b border-gray-200">
          <div className="flex-1 flex justify-end px-4">
            <div className="ml-4 flex items-center">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 p-6 animate-pulse">
          {/* Content skeleton */}
          <div className="h-8 w-48 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-4 w-72 bg-gray-200 rounded-md mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-md"></div>
            ))}
          </div>

          <div className="h-4 w-32 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-80 bg-gray-200 rounded-md mb-6"></div>
          <div className="h-60 bg-gray-200 rounded-md"></div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayoutSkeleton;
