"use client";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
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
  
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-indigo-50 via-blue-50 to-slate-100">
      <Navbar />
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex-1"
      >
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xs p-8">
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
              <p className="text-gray-600">
                Last updated: June 15, 2023
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="prose max-w-none">
              <h2>1. Introduction</h2>
              <p>
                Welcome to SalesCoach.Guru! As you have just clicked our Terms of Service, please
                pause, grab a cup of coffee and carefully read the following pages. It will take you approximately 20 minutes.
              </p>
              <p>
                These Terms of Service  govern your use of our web application SalesCoach.Guru (together
                or individually &quot;Service&quot;) operated by SalesCoach.Guru.
              </p>
              <p>
                Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information
                that results from your use of our web pages. Please read it here.
              </p>
              <p>
                Your agreement with us includes these Terms and our Privacy Policy (&quot;Agreements&quot;). You acknowledge that you have read and
                understood Agreements, and agree to be bound by them.
              </p>
              <p>
                If you do not agree with (or cannot comply with) Agreements, then you may not use the Service, but please let us know by
                emailing at support@salescoach.guru so we can try to find a solution. These Terms apply to all visitors, users and others
                who wish to access or use Service.
              </p>
              
              <h2>2. Communications</h2>
              <p>
                By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we
                may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe
                link or by emailing at support@salescoach.guru.
              </p>
              
              <h2>3. Purchases</h2>
              <p>
                If you wish to purchase any product or service made available through Service (&quot;Purchase&quot;), you may be asked to supply certain
                information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit
                card, your billing address, and your shipping information.
              </p>
              <p>
                You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment method(s) in connection
                with any Purchase; and that (ii) the information you supply to us is true, correct and complete.
              </p>
              <p>
                We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product or service
                availability, errors in the description or price of the product or service, error in your order or other reasons.
              </p>
              
              <h2>4. Subscriptions</h2>
              <p>
                Some parts of Service are billed on a subscription basis (&quot;Subscription(s)&quot;). You will be billed in advance on a recurring and
                periodic basis (&quot;Billing Cycle&quot;). Billing cycles are set either on a monthly or annual basis, depending on the type of
                subscription plan you select when purchasing a Subscription.
              </p>
              <p>
                At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel
                it or SalesCoach.Guru cancels it. You may cancel your Subscription renewal either through your online account management page
                or by contacting SalesCoach.Guru customer support team.
              </p>
              
              <h2>5. Free Trial</h2>
              <p>
                SalesCoach.Guru may, at its sole discretion, offer a Subscription with a free trial for a limited period of time (&quot;Free Trial&quot;).
              </p>
              <p>
                You may be required to enter your billing information in order to sign up for Free Trial.
              </p>
              <p>
                If you do enter your billing information when signing up for Free Trial, you will not be charged by SalesCoach.Guru until Free
                Trial has expired. On the last day of Free Trial period, unless you cancelled your Subscription, you will be automatically charged
                the applicable subscription fee for the type of Subscription you have selected.
              </p>
              
              <h2>6. Intellectual Property</h2>
              <p>
                Service and its original content (excluding Content provided by users), features and functionality are and will remain the
                exclusive property of SalesCoach.Guru and its licensors. Service is protected by copyright, trademark, and other laws of both
                the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service
                without the prior written consent of SalesCoach.Guru.
              </p>
              
              <h2>7. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to Service immediately, without prior notice or liability, under our
                sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of Terms.
              </p>
              <p>
                If you wish to terminate your account, you may simply discontinue using Service.
              </p>
              <p>
                All provisions of Terms which by their nature should survive termination shall survive termination, including, without limitation,
                ownership provisions, warranty disclaimers, indemnity and limitations of liability.
              </p>
              
              <h2>8. Changes to Service</h2>
              <p>
                We reserve the right to withdraw or amend our Service, and any service or material we provide via Service, in our sole discretion
                without notice. We will not be liable if for any reason all or any part of Service is unavailable at any time or for any period.
              </p>
              
              <h2>9. Contact Us</h2>
              <p>
                Please send your feedback, comments, requests for technical support by email: support@salescoach.guru.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default Terms; 