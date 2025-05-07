"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Header Section Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-5 w-72 bg-gray-200 rounded-md"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
          <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
        </div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded-md mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="opacity-50">
              Overview
            </TabsTrigger>
            <TabsTrigger value="transcripts" className="opacity-50">
              Transcripts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {/* Main Chart Skeleton */}
              <Card className="md:col-span-4">
                <CardHeader>
                  <div className="h-6 w-36 bg-gray-200 rounded-md mb-2"></div>
                  <div className="h-4 w-64 bg-gray-200 rounded-md"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full bg-gray-200 rounded-md"></div>
                </CardContent>
              </Card>

              {/* Objections Skeleton */}
              <Card className="md:col-span-3">
                <CardHeader>
                  <div className="h-6 w-40 bg-gray-200 rounded-md mb-2"></div>
                  <div className="h-4 w-56 bg-gray-200 rounded-md"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center"
                      >
                        <div className="h-5 w-36 bg-gray-200 rounded-md"></div>
                        <div className="h-5 w-16 bg-gray-200 rounded-md"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transcripts Skeleton */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="h-6 w-40 bg-gray-200 rounded-md mb-2"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded-md"></div>
                  </div>
                  <div className="h-8 w-20 bg-gray-200 rounded-md"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                        <div>
                          <div className="h-5 w-48 bg-gray-200 rounded-md mb-2"></div>
                          <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 w-20 bg-gray-200 rounded-md"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tab skeletons would be similar, but we'll keep them empty */}
          <TabsContent value="transcripts"></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
