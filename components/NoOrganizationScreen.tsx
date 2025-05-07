"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

const NoOrganizationScreen = () => {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="text-center max-w-md mx-auto p-8 rounded-xl shadow-lg bg-white">
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 rounded-full bg-navy-100 flex items-center justify-center">
            <PlusCircle className="h-12 w-12 text-navy-800" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-navy-800 mb-3">
          No Organization Found
        </h1>
        <p className="text-gray-600 mb-8">
          To get started with CloseDash, you need to create or join an
          organization. Create your organization now to start analyzing your
          sales conversations.
        </p>

        <Button asChild size="lg" className="w-full">
          <Link href="/dashboard/organisation/new">
            <PlusCircle className="h-5 w-5 mr-2" />
            Create Organization
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NoOrganizationScreen;
