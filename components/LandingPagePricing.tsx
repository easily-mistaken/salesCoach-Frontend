"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PricingCard from "@/components/PricingCard";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Define types for pricing plans
interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  isPopular: boolean;
}

interface PricingPlans {
  monthly: PricingPlan[];
  annual: PricingPlan[];
}

// Pricing plans data
const landingPricingPlans: PricingPlans = {
  monthly: [
    {
      id: "basic",
      name: "Basic",
      description: "Perfect for individual sales reps.",
      price: "$29",
      period: "/month",
      features: [
        "Up to 20 transcript uploads per month",
        "Basic sentiment analysis",
        "Objection identification",
        "Performance metrics",
        "Email support",
      ],
      buttonText: "Start Free Trial",
      isPopular: false,
    },
    {
      id: "pro",
      name: "Pro",
      description: "Ideal for serious sales professionals.",
      price: "$79",
      period: "/month",
      features: [
        "Up to 100 transcript uploads per month",
        "Advanced sentiment analysis",
        "Objection library with counters",
        "Detailed coaching recommendations",
        "Performance trends over time",
        "Priority email support",
      ],
      buttonText: "Start Free Trial",
      isPopular: true,
    },
    {
      id: "team",
      name: "Team",
      description: "For sales teams of up to 5 members.",
      price: "$199",
      period: "/month",
      features: [
        "Up to 500 transcript uploads per month",
        "Team performance dashboard",
        "Comparative analysis",
        "Custom objection library",
        "Advanced reporting",
        "Priority phone & email support",
      ],
      buttonText: "Start Free Trial",
      isPopular: false,
    },
  ],
  annual: [
    {
      id: "basic",
      name: "Basic",
      description: "Perfect for individual sales reps.",
      price: "$23",
      period: "/month, billed annually",
      features: [
        "Up to 20 transcript uploads per month",
        "Basic sentiment analysis",
        "Objection identification",
        "Performance metrics",
        "Email support",
      ],
      buttonText: "Start Free Trial",
      isPopular: false,
    },
    {
      id: "pro",
      name: "Pro",
      description: "Ideal for serious sales professionals.",
      price: "$63",
      period: "/month, billed annually",
      features: [
        "Up to 100 transcript uploads per month",
        "Advanced sentiment analysis",
        "Objection library with counters",
        "Detailed coaching recommendations",
        "Performance trends over time",
        "Priority email support",
      ],
      buttonText: "Start Free Trial",
      isPopular: true,
    },
    {
      id: "team",
      name: "Team",
      description: "For sales teams of up to 5 members.",
      price: "$159",
      period: "/month, billed annually",
      features: [
        "Up to 500 transcript uploads per month",
        "Team performance dashboard",
        "Comparative analysis",
        "Custom objection library",
        "Advanced reporting",
        "Priority phone & email support",
      ],
      buttonText: "Start Free Trial",
      isPopular: false,
    },
  ],
};

const LandingPagePricing = () => {
  const [pricingPeriod, setPricingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );

  const handleTrialStart = (planId: string) => {
    console.log(`Starting trial for ${planId} plan`);
    // Implement your trial start logic here
  };

  return (
    <section
      id="pricing"
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl transform -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-l from-purple-500/10 to-pink-500/10 rounded-full blur-3xl transform translate-y-1/2"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1.5 rounded-full">
              Transparent Pricing
            </span>
          </div>

          <h2 className="text-4xl font-bold text-navy-800 mb-4 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that&apos;s right for you. All plans include a{" "}
            <span className="font-semibold text-blue-600">
              14-day free trial
            </span>
            .
          </p>

          <div className="mt-10">
            <Tabs
              defaultValue="monthly"
              value={pricingPeriod}
              onValueChange={(value) =>
                setPricingPeriod(value as "monthly" | "annual")
              }
              className="inline-flex bg-white p-1.5 rounded-lg shadow-sm border border-gray-200"
            >
              <TabsList className="grid w-72 grid-cols-2 bg-gray-100/70">
                <TabsTrigger
                  value="monthly"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Monthly
                </TabsTrigger>
                <TabsTrigger
                  value="annual"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  Annual{" "}
                  <span className="ml-1.5 text-xs font-medium text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                    Save 20%
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {landingPricingPlans[pricingPeriod].map((plan) => (
            <PricingCard
              key={plan.id}
              name={plan.name}
              description={plan.description}
              price={plan.price}
              period={plan.period}
              features={plan.features}
              buttonText={plan.buttonText}
              isPopular={plan.isPopular}
              badge={
                plan.isPopular ? (
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium px-4 py-1 rounded-full flex items-center">
                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                    Most Popular
                  </span>
                ) : null
              }
              onClick={() => handleTrialStart(plan.id)}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/pricing"
            className="text-blue-600 font-medium hover:text-blue-700 transition-colors flex items-center justify-center mx-auto"
          >
            <span>View full details and compare all features</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingPagePricing;
