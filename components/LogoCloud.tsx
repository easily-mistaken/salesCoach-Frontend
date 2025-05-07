"use client";
import React from "react";
import Image from "next/image";

const LogoCloud = () => {
  // Array of company logos with image paths
  const companyLogos = [
    {
      name: "Salesforce",
      imgSrc: "/logos/salesforce.png",
      alt: "Salesforce logo",
    },
    {
      name: "HubSpot",
      imgSrc: "/logos/hubspot.svg",
      alt: "HubSpot logo",
    },
    {
      name: "Slack",
      imgSrc: "/logos/slack.png",
      alt: "Slack logo",
    },
    {
      name: "Zoom",
      imgSrc: "/logos/zoom.svg",
      alt: "Zoom logo",
    },
    {
      name: "Microsoft",
      imgSrc: "/logos/microsoft.png",
      alt: "Microsoft logo",
    },
    {
      name: "Adobe",
      imgSrc: "/logos/adobe.png",
      alt: "Adobe logo",
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-b border-gray-100 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wide mb-8">
          Trusted by sales teams worldwide
        </p>

        {/* Logo animation container */}
        <div className="relative">
          {/* Hide scrollbar and overflow */}
          <div className="overflow-hidden relative">
            {/* Marquee container */}
            <div className="flex logo-marquee">
              {/* First set of logos */}
              {companyLogos.map((company, index) => (
                <div key={`first-${index}`} className="flex-shrink-0 mx-8">
                  <Image
                    src={company.imgSrc}
                    alt={company.alt}
                    className="h-10 md:h-12 w-auto object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                    width={120}
                    height={60}
                  />
                </div>
              ))}

              {/* Duplicate set of logos for seamless loop */}
              {companyLogos.map((company, index) => (
                <div key={`second-${index}`} className="flex-shrink-0 mx-8">
                  <Image
                    src={company.imgSrc}
                    alt={company.alt}
                    className="h-10 md:h-12 w-auto object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                    width={120}
                    height={60}
                  />
                </div>
              ))}

              {/* Third set to ensure there's always content visible */}
              {companyLogos.map((company, index) => (
                <div key={`third-${index}`} className="flex-shrink-0 mx-8">
                  <Image
                    src={company.imgSrc}
                    alt={company.alt}
                    className="h-10 md:h-12 w-auto object-contain filter grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                    width={120}
                    height={60}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add the required CSS animations */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(
              calc(-1 * (120px + 2rem) * ${companyLogos.length})
            );
          }
        }

        .logo-marquee {
          display: flex;
          animation: marquee 20s linear infinite;
          width: fit-content;
        }
      `}</style>
    </section>
  );
};

export default LogoCloud;
