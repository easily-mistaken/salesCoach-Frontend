"use client";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Privacy Policy
              </h1>
              <p className="text-gray-600">Last updated: June 15, 2023</p>
            </motion.div>

            <motion.div variants={itemVariants} className="prose max-w-none">
              <h2>1. Introduction</h2>
              <p>
                SalesCoach.Guru (&quot;we&quot;, &quot;our&quot;, or
                &quot;us&quot;) is committed to protecting your privacy. This
                Privacy Policy explains how your personal information is
                collected, used, and disclosed by SalesCoach.Guru. This Privacy
                Policy applies to our website, salescoach.guru, and its
                associated subdomains (collectively, our &quot;Service&quot;).
              </p>
              <p>
                By accessing or using our Service, you signify that you have
                read, understood, and agree to our collection, storage, use, and
                disclosure of your personal information as described in this
                Privacy Policy and our Terms of Service.
              </p>

              <h2>2. Information We Collect</h2>
              <p>
                We collect information from you when you visit our website,
                register on our site, place an order, subscribe to our
                newsletter, respond to a survey, fill out a form, or upload
                transcripts for analysis.
              </p>
              <h3>2.1. Personal Information</h3>
              <p>
                When you register with us through the Service, we will ask you
                for certain personal information, such as your name, email
                address, or billing information. Personal data may also include
                other information, like your phone number, address, and other
                details like gender, occupation, and other demographic
                information.
              </p>
              <h3>2.2. Transcript Data</h3>
              <p>
                When you upload or submit transcripts for analysis, we collect
                the content of those transcripts. This may include dialogue,
                speaker information, timestamps, and other metadata present in
                the transcript.
              </p>
              <h3>2.3. Payment Information</h3>
              <p>
                If you make a purchase, we collect payment information,
                including credit card numbers or payment account information.
                This information is processed securely through our payment
                processors.
              </p>
              <h3>2.4. Log Data</h3>
              <p>
                We automatically collect certain information when you visit, use
                or navigate the Services. This information does not reveal your
                specific identity (like your name or contact information) but
                may include device and usage information, such as your IP
                address, browser and device characteristics, operating system,
                language preferences, referring URLs, device name, country,
                location, information about how and when you use our Services
                and other technical information.
              </p>

              <h2>3. How We Use Your Information</h2>
              <p>
                We use the information we collect in various ways, including to:
              </p>
              <ul>
                <li>Provide, operate, and maintain our Service</li>
                <li>Improve, personalize, and expand our Service</li>
                <li>
                  Analyze your transcripts to provide insights and coaching
                  recommendations
                </li>
                <li>Understand and analyze how you use our Service</li>
                <li>
                  Develop new products, services, features, and functionality
                </li>
                <li>
                  Communicate with you, either directly or through one of our
                  partners, for customer service, updates and other information
                  relating to the Service, and for marketing and promotional
                  purposes
                </li>
                <li>Process your transactions</li>
                <li>Send you emails</li>
                <li>Find and prevent fraud</li>
                <li>For compliance with our legal obligations</li>
              </ul>

              <h2>4. How We Share Your Information</h2>
              <p>
                We may share the information we collect in various ways,
                including the following:
              </p>
              <h3>4.1. Vendors and Service Providers</h3>
              <p>
                We may share your information with third-party vendors, service
                providers, contractors or agents who perform services for us or
                on our behalf and require access to such information to do that
                work.
              </p>
              <h3>4.2. Business Transfers</h3>
              <p>
                We may share or transfer your information in connection with, or
                during negotiations of, any merger, sale of company assets,
                financing, or acquisition of all or a portion of our business to
                another company.
              </p>
              <h3>4.3. Legal Requirements</h3>
              <p>
                We may disclose your information where we are legally required
                to do so in order to comply with applicable law, governmental
                requests, a judicial proceeding, court order, or legal process,
                such as in response to a court order or a subpoena.
              </p>

              <h2>5. Security of Your Information</h2>
              <p>
                We use administrative, technical, and physical security measures
                to help protect your personal information from unauthorized
                access and use. While we take reasonable steps to secure your
                personal information, no system can be completely secure, and we
                cannot guarantee the absolute security of your information.
              </p>

              <h2>6. Your Data Protection Rights</h2>
              <p>
                Depending on your location, you may have the following rights:
              </p>
              <ul>
                <li>
                  The right to access personal information we hold about you
                </li>
                <li>
                  The right to request correction of your personal information
                </li>
                <li>
                  The right to request deletion of your personal information
                </li>
                <li>
                  The right to object to processing of your personal information
                </li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us using the
                contact information provided below.
              </p>

              <h2>7. Childrena&apos;s Privacy</h2>
              <p>
                Our Service does not address anyone under the age of 13. We do
                not knowingly collect personally identifiable information from
                children under 13. If you are a parent or guardian and you are
                aware that your child has provided us with personal information,
                please contact us so that we can take necessary actions.
              </p>

              <h2>8. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the &quot;Last Updated&quot; date at the
                top of this page.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for
                any changes. Changes to this Privacy Policy are effective when
                they are posted on this page.
              </p>

              <h2>9. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <p>By email: privacy@salescoach.guru</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default Privacy;
