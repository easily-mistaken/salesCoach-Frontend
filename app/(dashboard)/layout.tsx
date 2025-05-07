"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Toaster } from "@/components/ui/toaster";

const DashboardLayoutWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <DashboardLayout>{children}</DashboardLayout>
      <Toaster />
    </>
  );
};

export default DashboardLayoutWrapper;
