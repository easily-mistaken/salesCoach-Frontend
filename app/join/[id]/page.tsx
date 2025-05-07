"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import { ArrowLeft, Building, User, Loader2, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleSignin from "@/app/login/GoogleSignin";
import { z } from "zod";
import { useInviteFlow, useInviteValidity } from "../hook";

const JoinPage = () => {
  const params = useParams();
  const inviteId = params.id as string;

  // Use our custom hooks for invitation handling
  const {
    inviteDetails,
    isLoggedIn,
    isLoadingInvite,
    inviteError,
    isProcessing,
    handleAuthSuccess,
    setIsLoggedIn,
  } = useInviteFlow(inviteId);

  // Check if invitation is valid
  const { isValid, isExpired } = useInviteValidity(inviteId);

  if (isLoadingInvite) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="grow flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            <p>Loading invitation details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (inviteError || !isValid) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="grow flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4 max-w-md text-center">
            <div className="text-red-500 text-lg font-semibold">
              Invitation Error
            </div>
            <p>
              {isExpired
                ? "This invitation has expired or has already been accepted."
                : "There was a problem loading this invitation. It may have been revoked."}
            </p>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="grow flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left column: Invitation info */}
            <div>
              <Button variant="ghost" size="sm" className="mb-4" asChild>
                <Link href="/" className="flex items-center text-navy-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to home
                </Link>
              </Button>

              {inviteDetails && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-navy-800 mb-3">
                    You've been invited to join{" "}
                    {inviteDetails.organizationName || "CloseDash"}
                  </h2>

                  <div className="flex items-start space-x-2 mb-2">
                    <Building className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-navy-700 text-sm">
                        Organization
                      </p>
                      <p className="text-gray-600 text-sm">
                        {inviteDetails.organizationName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 mb-3">
                    <User className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-navy-700 text-sm">
                        Invited by
                      </p>
                      <p className="text-gray-600 text-sm">
                        {inviteDetails.inviterName}
                      </p>
                    </div>
                  </div>

                  {inviteDetails.teams && inviteDetails.teams.length > 0 && (
                    <div className="flex items-start space-x-2 mb-3">
                      <Users className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-navy-700 text-sm">
                          Teams
                        </p>
                        <p className="text-gray-600 text-sm">
                          {inviteDetails.teams
                            .map((team: { name: string }) => team.name)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  )}

                  {isProcessing && (
                    <div className="mt-3 pt-2 border-t border-blue-200 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 text-blue-600 animate-spin mr-2" />
                      <p className="text-sm">Processing your invitation...</p>
                    </div>
                  )}
                </div>
              )}

              {/* Toggle buttons */}
              <div className="flex justify-center space-x-4 mt-4">
                <Button
                  variant={isLoggedIn ? "default" : "outline"}
                  onClick={() => setIsLoggedIn(true)}
                  size="sm"
                  className="w-28"
                  disabled={isProcessing}
                >
                  Login
                </Button>
                <Button
                  variant={!isLoggedIn ? "default" : "outline"}
                  onClick={() => setIsLoggedIn(false)}
                  size="sm"
                  className="w-28"
                  disabled={isProcessing}
                >
                  Sign Up
                </Button>
              </div>
            </div>

            {/* Right column: Form */}
            <div className="bg-white rounded-lg shadow-md p-5">
              {isLoggedIn ? (
                <LoginForm
                  inviteDetails={inviteDetails}
                  onSuccess={handleAuthSuccess}
                  isDisabled={isProcessing}
                />
              ) : (
                <SignupForm
                  inviteDetails={inviteDetails}
                  onSuccess={handleAuthSuccess}
                  isDisabled={isProcessing}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Define props for form components
interface FormProps {
  inviteDetails: any;
  onSuccess: (user: any) => void;
  isDisabled: boolean;
}

// Login Form Component
const LoginForm: React.FC<FormProps> = ({
  inviteDetails,
  onSuccess,
  isDisabled,
}) => {
  const schema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Get form data from the form elements
    const formData = {
      email: (e.currentTarget.elements.namedItem("email") as HTMLInputElement)
        .value,
      password: (
        e.currentTarget.elements.namedItem("password") as HTMLInputElement
      ).value,
    };

    try {
      // Validate form data against schema
      schema.parse(formData);

      // Call the server action
      const response = await login(formData);

      if (response.error) {
        toast.error(
          response.message || "Login failed. Please check your credentials."
        );
      } else {
        toast.success("Logged in successfully!");
        onSuccess(response.user);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Extract and set validation errors
        const newErrors = { email: "", password: "" };

        error.errors.forEach((err) => {
          const path = err.path[0] as keyof typeof newErrors;
          if (path in newErrors) {
            newErrors[path] = err.message;
          }
        });

        setErrors(newErrors);
        toast.error("Please fix the form errors");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-navy-800 mb-1">Welcome back</h1>
        <p className="text-gray-600 text-sm">Log in to accept invitation</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              required
              defaultValue={inviteDetails?.email || ""}
              disabled={isDisabled}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgotPassword"
                className="text-xs text-[#0284c7] hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              disabled={isDisabled}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || isDisabled}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Log in & Accept Invitation"
          )}
        </Button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-gray-500 text-xs">
              Or continue with
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleSignin />
        </div>
      </form>
    </div>
  );
};

// Signup Form Component
const SignupForm: React.FC<FormProps> = ({
  inviteDetails,
  onSuccess,
  isDisabled,
}) => {
  const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must include a number")
      .regex(/[^a-zA-Z0-9]/, "Password must include a symbol"),
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Get form data from the form elements
    const formData = {
      firstName: (
        e.currentTarget.elements.namedItem("firstName") as HTMLInputElement
      ).value,
      lastName: (
        e.currentTarget.elements.namedItem("lastName") as HTMLInputElement
      ).value,
      email: (e.currentTarget.elements.namedItem("email") as HTMLInputElement)
        .value,
      password: (
        e.currentTarget.elements.namedItem("password") as HTMLInputElement
      ).value,
    };

    try {
      // Validate form data against schema
      schema.parse(formData);

      // Call the server action
      const response = await registerUser(formData);

      if (response.error) {
        toast.error(
          response.message || "Registration failed. Please try again."
        );
      } else {
        toast.success(response.message || "Account created successfully!");
        onSuccess({
          id: response.user?.id,
          email: formData.email,
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Extract and set validation errors
        const newErrors = {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        };

        error.errors.forEach((err) => {
          const path = err.path[0] as keyof typeof newErrors;
          if (path in newErrors) {
            newErrors[path] = err.message;
          }
        });

        setErrors(newErrors);
        toast.error("Please fix the form errors");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-navy-800 mb-1">Create account</h1>
        <p className="text-gray-600 text-sm">
          Join {inviteDetails?.organizationName || "CloseDash"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-sm">
                First name
              </Label>
              <Input
                id="firstName"
                required
                className="h-9"
                disabled={isDisabled}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-sm">
                Last name
              </Label>
              <Input
                id="lastName"
                required
                className="h-9"
                disabled={isDisabled}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              required
              className="h-9"
              defaultValue={inviteDetails?.email || ""}
              readOnly={!!inviteDetails?.email}
              disabled={isDisabled || !!inviteDetails?.email}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              required
              className="h-9"
              disabled={isDisabled}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
            <p className="text-xs text-gray-500">
              Must be at least 8 characters with a number and symbol.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || isDisabled}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Create account & Accept Invitation"
          )}
        </Button>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-gray-500 text-xs">
              Or continue with
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleSignin />
        </div>
      </form>

      <p className="mt-3 text-center text-xs text-gray-500">
        By signing up, you agree to our{" "}
        <Link href="/terms" className="text-navy-700 hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-navy-700 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};

// Import server actions
const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  // This is a placeholder that would call your server action
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    return await response.json();
  } catch (error) {
    return {
      error: true,
      message: "Failed to login. Please try again.",
    };
  }
};

const registerUser = async ({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  // This is a placeholder that would call your server action
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });

    return await response.json();
  } catch (error) {
    return {
      error: true,
      message: "Failed to register. Please try again.",
    };
  }
};

export default JoinPage;
