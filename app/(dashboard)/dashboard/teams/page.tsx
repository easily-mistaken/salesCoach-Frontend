"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, PlusCircle, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetUser } from "@/services/user/query";
import { formatDistance } from "date-fns";
import { useGetTeams } from "@/services/teams/query";
import { Skeleton } from "@/components/ui/skeleton";
import useCurrentOrg from "@/store/useCurrentOrg";

const TeamsPage = () => {
  const router = useRouter();
  // In a real app, this would come from authentication context
  const [userRole] = useState<"sales-manager" | "sales-rep">("sales-manager");
  const { data: user, isLoading: isUserLoading } = useGetUser();
  const {currentOrg} = useCurrentOrg(); 
  const { data: teams, isLoading: isTeamsLoading } = useGetTeams(currentOrg?.id as string);
  const [searchQuery, setSearchQuery] = useState("");

  // Determine if we're in a loading state
  const isLoading = isUserLoading || isTeamsLoading;

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

  // Navigate to team creation page
  const handleCreateTeam = () => {
    router.push("/dashboard/teams/new");
  };

  // Skeleton loader for team cards
  const TeamCardSkeleton = () => (
    <Card className="cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-40 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
        {isUserLoading ? (
          <Skeleton className="h-6 w-3/4 mt-2" />
        ) : (
          <p className="text-gray-600 mt-2">
            {userRole === "sales-manager"
              ? "Create and manage your sales teams, and track performance metrics."
              : "View your sales teams and performance metrics."}
          </p>
        )}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Your Teams</h2>
          {!isUserLoading && userRole === "sales-manager" && (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleCreateTeam}
              disabled={isLoading}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          )}
          {isUserLoading && <Skeleton className="h-10 w-32" />}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
        </div>

        {isTeamsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <motion.div key={`skeleton-${index}`} variants={itemVariants}>
                <TeamCardSkeleton />
              </motion.div>
            ))}
          </div>
        ) : teams && teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <motion.div key={team.id} variants={itemVariants}>
                <Link href={`/dashboard/teams/${team.id}`}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center">
                        <span>{team.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {0} members
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Created on{" "}
                        {formatDistance(new Date(team.createdAt), new Date(), {
                          addSuffix: true,
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>
                          Last active:{" "}
                          {formatDistance(
                            new Date(team.updatedAt),
                            new Date(),
                            { addSuffix: true }
                          )}
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No teams found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? "No teams match your search criteria."
                : "You don't have any teams yet."}
            </p>
            {userRole === "sales-manager" && !searchQuery && (
              <div className="mt-6">
                <Button
                  onClick={handleCreateTeam}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create your first team
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TeamsPage;
