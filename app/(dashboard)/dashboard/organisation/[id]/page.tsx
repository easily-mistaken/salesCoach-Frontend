"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import {
  Users,
  UserPlus,
  Search,
  Building,
  Mail,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetOrgByID } from "@/services/organisation/query";
import { OrgUser } from "@/services/organisation/api";
import { Loader2 } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
  avatar?: string;
}

const OrganizationInfoPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useGetOrgByID(id);
  const org = data?.organization;

  // Get current user role - assuming the first user is the current user
  // In a real app, you'd compare with the authenticated user ID
  const userRole = getUserRole();

  function getUserRole(): "admin" | "member" {
    if (!org?.users || org.users.length === 0) return "member";

    // In a real app, you'd match this with the authenticated user ID
    // Here we're just assuming the first user with ADMIN role is the current user
    const adminUser = org.users.find((user) => user.role === "ADMIN");
    return adminUser ? "admin" : "member";
  }

  // Transform API users to members format
  const transformedMembers: Member[] =
    org?.users?.map((orgUser: OrgUser) => ({
      id: orgUser.user.id,
      name: `${orgUser.user.firstName || ''} ${orgUser.user.lastName || ''}`.trim(),
      email: orgUser.user.email,
      role: orgUser.role === "ADMIN" ? "Admin" : "Member",
      joinedAt: orgUser.user.createdAt,
      avatar: "",
    })) || [];

  // Filter members based on search query
  const filteredMembers = transformedMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animation variants
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Loading organization details...</span>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <h2 className="text-2xl font-bold mb-2">Organization not found</h2>
            <p className="text-gray-500 mb-4">
              The requested organization could not be found.
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto pb-10"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Organization</h1>
        <p className="text-gray-600 mt-2">
          Manage your organization settings and members
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <Tabs defaultValue="info" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            {userRole === "admin" && (
              <Button
                className="bg-blue-600 hover:bg-blue-700 ml-4"
                onClick={() => router.push("/dashboard/organisation/invite")}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            )}
          </div>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
                <CardDescription>
                  View and update your organization information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-base">{org.name}</p>
                    </div>
                  </div>

                  {org.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Phone
                        </p>
                        <p className="text-base">{org.phone}</p>
                      </div>
                    </div>
                  )}

                  {(org.address || org.city || org.state || org.country) && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Address
                        </p>
                        <p className="text-base">
                          {[
                            org.address,
                            org.city,
                            org.state,
                            org.zip,
                            org.country,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Created
                      </p>
                      <p className="text-base">
                        {formatDistance(new Date(org.createdAt), new Date(), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Members
                      </p>
                      <p className="text-base">
                        {transformedMembers.length} active members
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Badge variant="outline">Organization</Badge>
                {userRole === "admin" && (
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Organization Members</CardTitle>
                <CardDescription>
                  Manage the members of your organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-4">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <motion.div
                        key={member.id}
                        variants={itemVariants}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .filter((part) => part && part !== "null")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-500">
                              {member.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge
                            variant={
                              member.role === "Admin" ? "default" : "outline"
                            }
                          >
                            {member.role}
                          </Badge>
                          <p className="text-xs text-gray-500">
                            Joined{" "}
                            {formatDistance(
                              new Date(member.joinedAt),
                              new Date(),
                              { addSuffix: true }
                            )}
                          </p>
                          {userRole === "admin" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Change Role
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No members found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchQuery
                          ? "No members match your search criteria."
                          : "Your organization doesn't have any members yet."}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>
                  Manage your subscription and billing details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Badge className="bg-blue-600">Standard</Badge>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          Your current plan
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            You are currently on the Standard plan with{" "}
                            {transformedMembers.length} members.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {userRole === "admin" && (
                    <div className="flex justify-end">
                      <Button variant="outline" className="mr-2">
                        Billing History
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Manage Subscription
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default OrganizationInfoPage;
