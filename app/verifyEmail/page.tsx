"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const VerifyEmail = () => {
  const [verificationState, setVerificationState] = useState<
    "loading" | "success" | "error"
  >("loading");
  const location = usePathname();

  useEffect(() => {
    // In a real app, extract the token from the URL and verify it with the backend
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");

    // Mock verification process
    const verifyToken = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // For demo purposes, succeed if there's a token, otherwise fail
        if (token) {
          setVerificationState("success");
        } else {
          setVerificationState("error");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setVerificationState("error");
      }
    };

    verifyToken();
  }, [location]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-blue-50 to-slate-100 p-4">
      <motion.div
        className="bg-white w-full max-w-md rounded-xl shadow-lg p-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Email Verification
            </h1>
          </div>

          {verificationState === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 text-center">
                Verifying your email address...
              </p>
            </motion.div>
          )}

          {verificationState === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Your email has been successfully verified! You can now log in
                  to your account.
                </AlertDescription>
              </Alert>
              <div className="mt-6 text-center">
                <Button
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Link href="/login">Continue to login</Link>
                </Button>
              </div>
            </motion.div>
          )}

          {verificationState === "error" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="bg-red-50 border-red-200">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  We couldn&apos;t verify your email. The verification link may
                  be invalid or expired.
                </AlertDescription>
              </Alert>
              <div className="mt-6 space-y-4 text-center">
                <p className="text-sm text-gray-600">
                  Please try again or request a new verification link.
                </p>
                <Button asChild variant="outline">
                  <Link href="/login">Return to login</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
