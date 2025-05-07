"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetUser } from "@/services/user/query";
import useCreateTeamMutation from "@/services/teams/mutation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface FormData {
  name: string;
  description: string;
}

interface FormErrors {
  name?: string;
  description?: string;
}

const NewTeamPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Get current user and organization data
  const { data: user } = useGetUser();
  const orgId = user?.organizations?.[0]?.organization?.id;

  // Use the createTeam mutation
  const createTeamMutation = useCreateTeamMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors when user types
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined,
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Team name is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (orgId) {
      // Call your API to create the team
      createTeamMutation.mutate(
        {
          name: formData.name,
          description: formData.description,
          organizationId: orgId,
        },
        {
          onSuccess: () => {
            // Navigate back to teams page and refetch the teams data
            queryClient.invalidateQueries({ queryKey: ["teams"] });
            queryClient.refetchQueries({ queryKey: ["teams"] });
            toast.success("Team created successfully");
            router.push("/dashboard/teams");
          },
        }
      );
    } else {
      toast.error("Failed to create team");
      // Handle case where orgId is not available
    }
  };

  const handleBack = () => {
    router.push("/dashboard/teams");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto max-w-3xl py-8"
    >
      <Button
        variant="ghost"
        className="mb-6 pl-0 flex items-center text-gray-600 hover:bg-transparent hover:text-gray-900 transition-colors"
        onClick={handleBack}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Teams
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create a New Team
        </h1>
        <p className="text-gray-600">
          Set up a new sales team and start adding members.
        </p>
      </div>

      <Card className="shadow-md border-gray-200">
        <form onSubmit={handleSubmit}>
          <CardHeader className="pb-6 border-b">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <CardTitle>Team Information</CardTitle>
            </div>
            <CardDescription className="text-gray-500">
              Enter the details for your new sales team.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Team Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter team name"
                value={formData.name}
                onChange={handleChange}
                className={`h-11 px-4 ${
                  formErrors.name
                    ? "border-red-500 focus-visible:ring-red-200"
                    : "border-gray-200 focus-visible:ring-blue-200"
                }`}
              />
              {formErrors.name && (
                <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter a brief description of this team"
                value={formData.description}
                onChange={handleChange}
                className="min-h-[120px] px-4 py-3 border-gray-200 focus-visible:ring-blue-200 resize-none"
              />
              {formErrors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.description}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t py-4 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
              disabled={createTeamMutation.isPending}
            >
              {createTeamMutation.isPending ? "Creating..." : "Create Team"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default NewTeamPage;
