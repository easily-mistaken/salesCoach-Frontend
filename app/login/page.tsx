"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import zod from "zod";
import GoogleSignin from "./GoogleSignin";
import { login } from "./action";

const Login = () => {
  const schema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  if (isLoading) {
    console.log("handle this");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when submission starts

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

      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      if (response.error) {
        toast.error(response.message);
      } else {
        toast.success("Logged in successfully! Welcome back to CloseDash.");
        // Redirect to dashboard
        navigate.push("/dashboard");
      }
    } catch (error) {
      if (error instanceof zod.ZodError) {
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
      }
    } finally {
      setIsLoading(false); // Set loading to false when submission ends
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Button variant="ghost" size="sm" className="mb-6" asChild>
              <Link href="/" className="flex items-center text-navy-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to home
              </Link>
            </Button>

            <h1 className="text-2xl font-bold text-navy-800 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600">Log in to your CloseDash account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" required />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgotPassword"
                    className="text-sm text-[#0284c7] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Log in
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-gray-500 text-sm">
                  Or continue with
                </span>
              </div>
            </div>

            {/* <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Login"
                )}
              </Button> */}
            <div className="flex justify-center">
              <GoogleSignin />
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#0284c7] font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
