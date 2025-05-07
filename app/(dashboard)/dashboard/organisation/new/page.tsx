"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCreateOrganisationMutation from "@/services/organisation/mutation";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import useCurrentOrg from "@/store/useCurrentOrg";

const CreateOrganizationPage = () => {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { mutateAsync: createOrganisation } = useCreateOrganisationMutation();
  const queryClient = useQueryClient();
  const { setCurrentOrg } = useCurrentOrg();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orgName.trim()) {
      setError("Organization name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Call the mutation function
      const newOrg = await createOrganisation({ name: orgName });

      // If we got a valid organization object back, set it as current
      if (newOrg && newOrg.id) {
        // Type assertion to match Organization interface expected by setCurrentOrg
        setCurrentOrg(newOrg as any);

        // Invalidate queries to refresh user data
        await queryClient.invalidateQueries({ queryKey: ["user"] });
        await queryClient.invalidateQueries({ queryKey: ["organisations"] });

        toast.success("Organization created successfully");

        // Short delay before redirect to ensure state is updated
        setTimeout(() => {
          router.push("/dashboard");
        }, 300);
      } else {
        // If we didn't get a valid org back, something went wrong
        console.error("Invalid organization data received:", newOrg);
        throw new Error("Invalid organization data received");
      }
    } catch (err) {
      console.error("Error creating organization:", err);
      toast.error("Failed to create organization. Please try again.");
      setError("Failed to create organization. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="w-full max-w-md px-4 py-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-navy-100 mb-4">
            <Building className="h-8 w-8 text-navy-800" />
          </div>
          <h1 className="text-3xl font-bold text-navy-800">
            Create Organization
          </h1>
          <p className="text-gray-600 mt-2">
            Set up your organization to start using CloseDash
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl text-navy-800">
              Organization Details
            </CardTitle>
            <CardDescription>
              Enter your organization name to get started with sales coaching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="organization-name" className="text-navy-800">
                  Organization Name
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="organization-name"
                    placeholder="Acme Inc."
                    className="pl-10 border-gray-300 focus:border-sky-500 focus:ring-sky-500"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    disabled={isLoading}
                    autoComplete="organization"
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500 mt-1 flex items-center">
                    {error}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="default"
                  className="w-full bg-navy-800 hover:bg-navy-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Organization...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Create Organization
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pt-0 pb-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-navy-800"
              asChild
            >
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>
            Need help? Contact our{" "}
            <a
              href="/help"
              className="text-sky-600 hover:text-sky-800 font-medium"
            >
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganizationPage;
