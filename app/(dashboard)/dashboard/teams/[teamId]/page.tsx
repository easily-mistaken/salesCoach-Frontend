"use client";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import {
  UserPlus,
  Phone,
  FileText,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetTeamById } from "@/services/teams/query";

const TeamDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;

  // Fetch team data
  const {
    data: team,
    isLoading: teamLoading,
    error: teamError,
  } = useGetTeamById(teamId);

  const handleNavigateToMember = (memberId: string) => {
    router.push(`/dashboard/user/${memberId}`);
  };

  const handleBack = () => {
    router.push("/dashboard/teams");
  };

  if (teamLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p>Loading team details...</p>
      </div>
    );
  }

  if (teamError || !team) {
    return (
      <div className="container mx-auto p-8">
        <Button
          variant="ghost"
          className="mb-4 pl-0 flex items-center text-gray-600"
          onClick={handleBack}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Teams
        </Button>
        <div className="text-center py-10">
          <h3 className="text-xl font-medium text-gray-900">
            Error: {teamError?.message}
          </h3>
          <p className="mt-2 text-gray-600">
            We couldnt find the team youre looking for.
          </p>
          <Button onClick={handleBack} className="mt-4">
            Return to Teams
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto"
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4 pl-0 flex items-center text-gray-600"
          onClick={handleBack}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Teams
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
            {team.description && (
              <p className="text-gray-600 mt-1">{team.description}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
              <span>Created: {team.createdAt}</span>
              <span>•</span>
              <span>Last active: {team.updatedAt}</span>
              <span>•</span>
              <span>{1} members</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
        </div>

        {team.members.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {team.members.map((member) => (
              <Card
                key={member.userId}
                className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                onClick={() => handleNavigateToMember(member.userId)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage
                        src={""}
                        alt={member.userOrg.user.firstName}
                      />
                      <AvatarFallback>
                        {member.userOrg.user.firstName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {member.userOrg.user.firstName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {member.userOrg.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-1" />
                      <span>{"3"}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{"5"}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>{"4"}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No team members yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start by inviting sales representatives to your team.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeamDetailPage;
