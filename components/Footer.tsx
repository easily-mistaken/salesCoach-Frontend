import React from "react";
import Image from "next/image";
import { Mail, ArrowRight } from "lucide-react"; // Import icons

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const mailtoLink = "mailto:shimmy@closedash.io";

  return (
    <footer className="bg-navy-800 text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center space-y-6 mb-12">
          {/* Brand */}
          <div className="relative">
            <Image
              src="/closedash_full.jpeg"
              alt="CloseDash Logo"
              width={240}
              height={100}
              className="mb-4 rounded-lg shadow-blur"
            />
          </div>

          <p className="text-gray-300 text-lg">
            Be among the first to experience AI-driven sales coaching that
            actually feels human.
          </p>

          {/* Enhanced Support Email Section */}
          <div className="bg-navy-700 rounded-xl p-6 w-full max-w-md shadow-lg border border-gray-700 mt-4">
            <div className="flex items-center justify-center mb-3">
              <Mail className="text-blue-400 mr-2" size={20} />
              <h3 className="text-lg font-medium text-white">Need Support?</h3>
            </div>

            <p className="text-gray-300 mb-4">
              Our team is ready to help with any questions or issues you might
              have.
            </p>

            <a
              href={mailtoLink}
              className="group flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl"
            >
              <span>Contact Support</span>
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={18}
              />
            </a>

            <p className="text-gray-400 text-sm mt-3">
              Or email us directly at{" "}
              <a
                href="mailto:shimmy@closedash.io"
                className="text-blue-400 hover:text-blue-300 underline transition-colors"
              >
                shimmy@closedash.io
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8 text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {currentYear} CloseDash. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
