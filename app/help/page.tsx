"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Search, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const Help = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold mb-4">CloseDash Help Center</h1>
            <p className="text-gray-600 mb-6">
              Find answers to common questions and learn how to get the most out
              of CloseDash
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for help articles..."
                className="pl-10 py-2"
              />
            </div>
          </div>

          <div className="space-y-8 mb-12">
            {/* Getting Started Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                Getting Started
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-blue-600 hover:underline">
                    Creating your account
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline">
                    Uploading your first transcript
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline">
                    Understanding your analysis results
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline">
                    Subscription plans and billing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Using the Platform Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                Using the Platform
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-blue-600 hover:underline">
                    Transcript upload formats and requirements
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline">
                    How to interpret the analytics dashboard
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline">
                    Team management features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline">
                    Exporting and sharing insights
                  </Link>
                </li>
              </ul>
            </div>

            {/* Troubleshooting Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                Troubleshooting
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-blue-600 hover:underline">
                    Common upload issues
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline">
                    Payment and billing problems
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline">
                    Account access issues
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-600 hover:underline">
                    Improving analysis results
                  </Link>
                </li>
              </ul>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">
                    What file formats do you support?
                  </h3>
                  <p className="text-gray-600">
                    We support TXT, PDF, VTT, DOC, and DOCX formats for
                    transcript uploads.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-lg">
                    How accurate is the AI analysis?
                  </h3>
                  <p className="text-gray-600">
                    Our AI has been trained on thousands of sales calls and
                    provides highly relevant insights in over 90% of cases
                    according to our users.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-lg">Is my data secure?</h3>
                  <p className="text-gray-600">
                    Yes, we use enterprise-grade encryption for all data, both
                    in transit and at rest. Your transcripts are never shared
                    with third parties.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-lg">
                    Can I cancel my subscription?
                  </h3>
                  <p className="text-gray-600">
                    Yes, you can cancel your subscription at any time from your
                    account settings. We also offer a 14-day money-back
                    guarantee.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 text-center">
            <h2 className="text-xl font-semibold mb-2">Still Need Help?</h2>
            <p className="text-gray-600 mb-4">
              Our support team is ready to assist you with any questions
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-blue-600">
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-blue-600 text-blue-600"
              >
                <Link
                  href="mailto:shimmy@closedash.io"
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Help;
