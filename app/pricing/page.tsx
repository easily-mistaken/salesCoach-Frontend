"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PricingCard from "@/components/PricingCard";
import TestimonialCard from "@/components/TestimonialCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Sparkles } from "lucide-react";

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
const pricingPlans: PricingPlans = {
  monthly: [
    {
      id: "starter",
      name: "Starter",
      description: "Perfect for individual sales reps",
      price: "$49",
      period: "/month",
      features: [
        "10 transcript uploads per month",
        "Basic sentiment analysis",
        "Objection identification",
        "Performance metrics",
        "1 user",
        "Email support",
      ],
      buttonText: "Start Free Trial",
      isPopular: false,
    },
    {
      id: "pro",
      name: "Professional",
      description: "Ideal for growing sales teams",
      price: "$99",
      period: "/month",
      features: [
        "50 transcript uploads per month",
        "Advanced sentiment analysis",
        "Detailed objection handling insights",
        "Customizable reports",
        "5 users",
        "Priority email & chat support",
        "Export data in various formats",
      ],
      buttonText: "Get Pro",
      isPopular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large sales organizations",
      price: "$249",
      period: "/month",
      features: [
        "Unlimited transcript uploads",
        "Full sentiment & tone analysis",
        "Custom AI coaching models",
        "Team performance analytics",
        "Unlimited users",
        "24/7 dedicated support",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
      ],
      buttonText: "Contact Sales",
      isPopular: false,
    },
  ],
  annual: [
    {
      id: "starter",
      name: "Starter",
      description: "Perfect for individual sales reps",
      price: "$39",
      period: "/month, billed annually",
      features: [
        "10 transcript uploads per month",
        "Basic sentiment analysis",
        "Objection identification",
        "Performance metrics",
        "1 user",
        "Email support",
      ],
      buttonText: "Start Free Trial",
      isPopular: false,
    },
    {
      id: "pro",
      name: "Professional",
      description: "Ideal for growing sales teams",
      price: "$79",
      period: "/month, billed annually",
      features: [
        "50 transcript uploads per month",
        "Advanced sentiment analysis",
        "Detailed objection handling insights",
        "Customizable reports",
        "5 users",
        "Priority email & chat support",
        "Export data in various formats",
      ],
      buttonText: "Get Pro",
      isPopular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large sales organizations",
      price: "$199",
      period: "/month, billed annually",
      features: [
        "Unlimited transcript uploads",
        "Full sentiment & tone analysis",
        "Custom AI coaching models",
        "Team performance analytics",
        "Unlimited users",
        "24/7 dedicated support",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
      ],
      buttonText: "Contact Sales",
      isPopular: false,
    },
  ],
};

// Define type for FAQ items
interface FaqItem {
  question: string;
  answer: string;
}

// Define type for testimonial items
interface TestimonialItem {
  quote: string;
  name: string;
  title: string;
  rating: number;
  gradientFrom?: string;
  gradientTo?: string;
}

// FAQ data
const faqs: FaqItem[] = [
  {
    question: "How does the free trial work?",
    answer:
      "Our 14-day free trial gives you full access to all features in our Professional plan. No credit card required until you decide to continue. You can cancel anytime during the trial period with no obligation.",
  },
  {
    question: "Can I upgrade or downgrade my plan later?",
    answer:
      "Yes, you can easily upgrade or downgrade your plan at any time through your account settings. When upgrading, you'll be billed the prorated amount for the remainder of your billing cycle. When downgrading, the new rate will apply at the start of your next billing cycle.",
  },
  {
    question: "What file formats do you support for transcripts?",
    answer:
      "We support a wide range of transcript formats including TXT, PDF, VTT, DOC, and DOCX. If you have transcripts in other formats, please contact our support team to discuss options.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We employ industry-standard encryption and security practices. Your data is stored securely and never shared with third parties. We are fully compliant with GDPR and other privacy regulations.",
  },
  {
    question: "Do you offer custom enterprise solutions?",
    answer:
      "Yes, our Enterprise plan includes customization options for larger organizations. This includes custom AI coaching models tailored to your specific sales methodology, custom integrations with your existing tools, and dedicated account management.",
  },
];

const Pricing = () => {
  const [pricingPeriod, setPricingPeriod] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const toggleFaq = (index: number) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };

  const handlePlanSelection = (planId: string) => {
    console.log(`Selected plan: ${planId}`);
    // Implement your plan selection logic here
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100">
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1"
      >
        {/* Hero section with decorative elements */}
        <div className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl transform -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-l from-purple-500/10 to-pink-500/10 rounded-full blur-3xl transform translate-y-1/2"></div>

          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block mb-6">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1.5 rounded-full">
                  Transparent Pricing
                </span>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-5xl font-bold text-gray-900 mb-6 tracking-tight"
              >
                Choose Your Perfect Plan
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xl text-gray-600 max-w-2xl mx-auto"
              >
                Accelerate your sales performance with AI-powered coaching. All
                plans include a{" "}
                <span className="font-semibold text-blue-600">
                  14-day free trial
                </span>
                .
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-10"
              >
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
              </motion.div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative"
            >
              {/* Pricing cards using the new PricingCard component */}
              {pricingPlans[pricingPeriod].map((plan) => (
                <motion.div key={plan.id} variants={itemVariants}>
                  <PricingCard
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
                    onClick={() => handlePlanSelection(plan.id)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Added compare features section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-6xl mx-auto mt-20 text-center"
            >
              <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors flex items-center justify-center mx-auto">
                <span>Compare all features</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section with improved styling */}
        <div className="bg-white py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-600 mt-4">
                  Got questions? We&apos;ve got answers to help you make the
                  right decision.
                </p>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={`border border-gray-200 rounded-xl overflow-hidden transition-colors duration-200 ${
                      activeFaq === index
                        ? "bg-blue-50/50 border-blue-200"
                        : "bg-white"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="flex justify-between items-center w-full p-6 text-left"
                    >
                      <h3
                        className={`text-lg font-semibold ${
                          activeFaq === index
                            ? "text-blue-700"
                            : "text-gray-900"
                        }`}
                      >
                        {faq.question}
                      </h3>
                      <div
                        className={`h-6 w-6 flex items-center justify-center rounded-full border ${
                          activeFaq === index
                            ? "border-blue-300 bg-blue-100 text-blue-600"
                            : "border-gray-300 bg-gray-100 text-gray-500"
                        }`}
                      >
                        {activeFaq === index ? "-" : "+"}
                      </div>
                    </button>

                    {activeFaq === index && (
                      <div className="px-6 pb-6">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Custom solution CTA with navy background similar to LeadMagnetForm */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative py-20 text-white overflow-hidden"
        >
          {/* Enhanced background with navy gradients and patterns */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700">
            <div className="absolute inset-0">
              {/* Decorative dots pattern */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>

              {/* Glowing orbs */}
              <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10 transform -translate-y-1/2 -translate-x-1/4"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-10 transform translate-y-1/2 translate-x-1/4"></div>

              {/* Additional decorative element */}
              <div className="absolute top-1/2 right-1/4 w-64 h-64 opacity-20">
                <svg
                  className="w-full h-full text-blue-500"
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="currentColor"
                    d="M42.7,-73.4C54.9,-67.8,64.2,-55.5,71.5,-42.3C78.7,-29.1,84,-15,82.5,-1.9C81,11.3,72.7,22.6,65.3,34.5C58,46.4,51.5,58.9,41.3,66.4C31.1,73.9,17.1,76.3,2.4,73.3C-12.3,70.3,-27.5,61.9,-38.7,51.7C-49.9,41.5,-57.1,29.5,-62.9,16.1C-68.7,2.7,-73,-12.2,-70.4,-25.2C-67.7,-38.3,-58,-49.5,-46.1,-55.1C-34.2,-60.8,-20.1,-60.8,-5.8,-61.3C8.5,-61.8,17,-79,30.5,-79.1C44,-79.2,60.5,-61.1,67.8,-50.8Z"
                    transform="translate(100 100)"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-3xl mx-auto backdrop-blur-sm bg-navy-800/50 p-12 rounded-2xl border border-navy-600/50 shadow-2xl">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-blue-500/20 px-6 py-2 rounded-full backdrop-blur-md border border-blue-400/20 text-sm font-medium flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                <span>Enterprise Solution</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Need a custom solution?
              </h2>
              <p className="text-blue-100 mb-8 text-lg">
                Our enterprise plan is tailored to your specific needs. Contact
                our sales team to discuss how we can help optimize your sales
                coaching process.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-6 text-lg font-medium shadow-lg shadow-blue-900/30 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-blue-500/20"
              >
                Schedule a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Testimonials section */}
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">
                  Trusted by Sales Teams Everywhere
                </h2>
                <p className="text-gray-600 mt-4">
                  See what our customers have to say about their experience
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(
                  [
                    {
                      quote:
                        "The AI-powered coaching has transformed how our team handles objections. We've seen a 34% increase in close rates.",
                      name: "Sarah Johnson",
                      title: "Sales Director, TechCorp",
                      rating: 5,
                      gradientFrom: "blue-600",
                      gradientTo: "indigo-600",
                    },
                    {
                      quote:
                        "The insights from our call transcripts were game-changing. We identified patterns we never would have seen otherwise.",
                      name: "Michael Chen",
                      title: "VP of Sales, GrowthSoft",
                      rating: 5,
                      gradientFrom: "indigo-500",
                      gradientTo: "purple-600",
                    },
                    {
                      quote:
                        "Worth every penny. The ROI was clear within the first month as our team's performance dramatically improved.",
                      name: "Jessica Martinez",
                      title: "Sales Manager, Innovate Inc",
                      rating: 4,
                      gradientFrom: "blue-500",
                      gradientTo: "blue-700",
                    },
                  ] as TestimonialItem[]
                ).map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <TestimonialCard
                      quote={testimonial.quote}
                      name={testimonial.name}
                      title={testimonial.title}
                      gradientFrom={testimonial.gradientFrom}
                      gradientTo={testimonial.gradientTo}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default Pricing;
