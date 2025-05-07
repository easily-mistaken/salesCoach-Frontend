"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Send, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetTeams } from "@/services/teams/query";
import { useGetUser } from "@/services/user/query";
import { Role } from "@/services/user/api";
import { useInviteToOrganisationMutation } from "@/services/organisation/mutation";
import { Textarea } from "@/components/ui/textarea";

// interface Team {
//   id: string;
//   name: string;
// }

interface FormErrors {
  email?: string;
  emailList?: string;
  role?: string;
  [key: string]: string | undefined;
}

interface SelectedTeam {
  id: string;
  name: string;
  selected: boolean;
}

const InviteTeamMemberPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teamId = searchParams.get("teamId");

  const { data: user } = useGetUser();
  const organizationId = user?.organizations?.[0]?.organizationId;
  const { data: teamsData, isLoading: teamsLoading } = useGetTeams(
    organizationId || ""
  );

  const [selectedRole, setSelectedRole] = useState<Role | "">("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [emailList, setEmailList] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeam[]>([]);

  const inviteToOrganisationMutation = useInviteToOrganisationMutation();

  // Initialize selected teams when teams data is loaded
  useEffect(() => {
    if (teamsData) {
      const initialSelectedTeams = teamsData.map((team) => ({
        id: team.id,
        name: team.name,
        selected: teamId !== null && teamId === team.id, // Pre-select the team from URL if it matches
      }));
      setSelectedTeams(initialSelectedTeams);
    }
  }, [teamsData, teamId]);

  // Add email to the list
  const addEmail = () => {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (currentEmail && emailRegex.test(currentEmail)) {
      if (!emailList.includes(currentEmail)) {
        setEmailList([...emailList, currentEmail]);
        setCurrentEmail("");
        setFormErrors({ ...formErrors, email: undefined });
      }
    } else {
      setFormErrors({
        ...formErrors,
        email: "Please enter a valid email address",
      });
    }
  };

  // Remove email from the list
  const removeEmail = (email: string) => {
    setEmailList(emailList.filter((e) => e !== email));
  };

  // Toggle team selection
  const toggleTeamSelection = (teamId: string) => {
    setSelectedTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamId ? { ...team, selected: !team.selected } : team
      )
    );
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (emailList.length === 0) {
      errors.emailList = "Please add at least one email address";
      isValid = false;
    }

    if (!selectedRole) {
      errors.role = "Please select a role";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle form submission for email invites
  const handleEmailInvite = () => {
    if (!validateForm()) {
      return;
    }

    const selectedTeamIds = selectedTeams
      .filter((team) => team.selected)
      .map((team) => team.id);

    if (selectedTeamIds.length === 0) {
      setFormErrors({
        ...formErrors,
        teams: "Please select at least one team",
      });
      return;
    }

    setIsSubmitting(true);

    // For each email in the list, send an invitation
    emailList.forEach((email) => {
      if (organizationId && selectedRole) {
        inviteToOrganisationMutation.mutate(
          {
            email,
            role: selectedRole as Role,
            organizationId: organizationId,
            teamIds: selectedTeamIds,
          },
          {
            onSuccess: () => {
              setIsSubmitting(false);
              toast({
                title: "Invitations Sent",
                description: `Invitations sent to ${emailList.length} recipient(s).`,
                variant: "default",
              });
              router.push("/dashboard/teams");
            },
            onError: () => {
              setIsSubmitting(false);
            },
          }
        );
      }
    });
  };

  // Handle back button click
  const handleBack = () => {
    router.push("/dashboard/teams");
  };

  // Check if the selected team is valid
  if (teamId && !selectedTeams) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            The specified team could not be found.
            <Button
              variant="link"
              onClick={handleBack}
              className="p-0 h-auto font-normal"
            >
              Return to Teams
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto"
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4 pl-0 flex items-center text-gray-600"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Teams
        </Button>

        <h1 className="text-3xl font-bold text-gray-900">
          Invite People to Organisation
        </h1>
        {selectedTeams && (
          <div className="flex items-center mt-2">
            <p className="text-gray-600">Organisation</p>
            <Badge variant="outline" className="ml-2">
              {"Sales Team"}
            </Badge>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add People to Your Organisation</CardTitle>
          <CardDescription>
            Invite people to join your organisation and assign them to teams.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Email Input Section */}
            <div className="space-y-2">
              <Label htmlFor="email-input">Email Addresses</Label>
              <div className="flex gap-2">
                <Input
                  id="email-input"
                  placeholder="Enter email address"
                  type="email"
                  value={currentEmail}
                  onChange={(e) => setCurrentEmail(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addEmail())
                  }
                />
                <Button onClick={addEmail}>Add</Button>
              </div>

              {formErrors.email && (
                <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
              )}

              {emailList.length > 0 && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-gray-50">
                    {emailList.map((email) => (
                      <Badge
                        key={email}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {email}
                        <button
                          onClick={() => removeEmail(email)}
                          className="rounded-full hover:bg-gray-200 p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {formErrors.emailList && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.emailList}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role-select">Role</Label>
              <Select
                onValueChange={(value) => setSelectedRole(value as Role)}
                value={selectedRole}
              >
                <SelectTrigger id="role-select">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                  <SelectItem value={Role.MANAGER}>Manager</SelectItem>
                  <SelectItem value={Role.COACH}>Coach</SelectItem>
                  <SelectItem value={Role.SALES_REP}>Sales Rep</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.role && (
                <p className="text-sm text-red-500 mt-1">{formErrors.role}</p>
              )}
            </div>

            {/* Team Selection */}
            <div className="space-y-2">
              <Label>Team Access</Label>
              <div className="border rounded-md p-4 space-y-2">
                {teamsLoading ? (
                  <p className="text-sm text-gray-500">Loading teams...</p>
                ) : selectedTeams.length > 0 ? (
                  selectedTeams.map((team) => (
                    <div key={team.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`team-${team.id}`}
                        checked={team.selected}
                        onCheckedChange={() => toggleTeamSelection(team.id)}
                      />
                      <Label
                        htmlFor={`team-${team.id}`}
                        className="cursor-pointer"
                      >
                        {team.name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No teams available</p>
                )}
                {formErrors.teams && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.teams}
                  </p>
                )}
              </div>
            </div>

            {/* Optional Message */}
            <div className="space-y-2">
              <Label htmlFor="custom-message">Message (Optional)</Label>
              <Textarea
                id="custom-message"
                placeholder="Add a personal message"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleEmailInvite}
                disabled={isSubmitting || emailList.length === 0}
              >
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Invitations
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InviteTeamMemberPage;