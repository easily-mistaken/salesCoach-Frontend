"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, ArrowRight, Building2 } from "lucide-react";
import useCurrentOrg, { Organization } from "@/store/useCurrentOrg";
import { useGetOrgs } from "@/services/organisation/query";
import { useQueryClient } from "@tanstack/react-query";

export default function OrganizationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: orgs, isLoading, refetch } = useGetOrgs();
  const { setCurrentOrg } = useCurrentOrg();

  // Force refetch organizations when this page loads
  useEffect(() => {
    refetch();

    queryClient.invalidateQueries({ queryKey: ["organisations"] });
  }, [refetch, queryClient]);

  const handleSelectOrg = (orgName: Organization) => {
    setCurrentOrg(orgName);
    router.push("/dashboard");
  };

  const handleCreateOrg = () => {
    router.push("/dashboard/organisation/new");
  };

  const generateAvatarUrl = (name: string) => {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${
      name ? name[0] : "A"
    }&backgroundColor=0284c7`;
  };

  const handleOrgInfo = (org: Organization) => {
    setCurrentOrg(org);
    router.push(`/dashboard/organisation/${org.id}`);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-navy-800">Organizations</h1>
          <p className="text-gray-500 mt-1">
            Select an organization to access its dashboard
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-sm animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-gray-200 rounded-md w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 mr-3"></div>
                    <div>
                      <div className="h-5 bg-gray-200 rounded-md w-24 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded-md w-16"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded-md w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orgs && orgs.length > 0 ? (
                orgs.map((org) => (
                  <Card
                    key={org.organization.id}
                    className="shadow-sm hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1 hover:bg-blue-50 cursor-pointer border border-transparent hover:border-blue-200"
                    onClick={() =>
                      handleOrgInfo(org.organization as Organization)
                    }
                  >
                    <CardHeader className="pb-2">
                      <CardTitle>{org.organization.name}</CardTitle>
                      <CardDescription>{"member"}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center mb-4">
                        <Avatar className="h-12 w-12 mr-3">
                          <AvatarImage
                            src={generateAvatarUrl(org.organization.name)}
                            alt={`${org.organization.name} Logo`}
                          />
                          <AvatarFallback className="bg-navy-600 text-white">
                            {org.organization.name
                              ? org.organization.name.charAt(0).toUpperCase()
                              : "O"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-navy-800">
                            {org.organization.name}
                          </p>
                          <p className="text-sm text-gray-500">{1} Members</p>
                        </div>
                      </div>
                      <Button
                        className="w-full bg-[#0284c7] hover:bg-blue-600 cursor-pointer transition-colors duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectOrg(org.organization as Organization);
                        }}
                      >
                        Select Organization{" "}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-1 md:col-span-2 lg:col-span-3 shadow-sm">
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Building2 className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-navy-800 mb-2">
                      No Organizations Found
                    </h3>
                    <p className="text-gray-500 text-center mb-6 max-w-md">
                      You dont appear to be a member of any organizations.
                      Create your first organization to get started.
                    </p>
                    <Button
                      className="bg-[#0284c7] hover:bg-blue-600 transition-colors duration-300"
                      onClick={handleCreateOrg}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Create Organization
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="mt-10">
              <Card className="bg-gray-50 border-dashed border-2 border-gray-200 hover:bg-gray-100 transition-colors duration-300 hover:border-gray-300">
                <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6">
                  <div className="mb-4 sm:mb-0 text-center sm:text-left">
                    <h3 className="text-lg font-medium text-navy-800 mb-1">
                      Create a New Organization
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      Set up a new organization for your team to collaborate and
                      manage sales data.
                    </p>
                  </div>
                  <Button
                    className="bg-[#0284c7] hover:bg-blue-600 transition-colors duration-300"
                    onClick={handleCreateOrg}
                  >
                    <Plus className="mr-2 h-4 w-4" /> New Organization
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
}
