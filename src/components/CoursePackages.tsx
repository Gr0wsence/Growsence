import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { useState } from "react";
import PaymentModal from "./PaymentModal";

export default function CoursePackages() {
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    packageType: "basic" | "pro";
    amount: number;
  }>({
    isOpen: false,
    packageType: "basic",
    amount: 1499,
  });

  const basicFeatures = [
    "Spoken English Mastery",
    "Affiliate Marketing Fundamentals", 
    "Lead Generation Strategies",
    "Communication Skills",
    "Video Editing Basics"
  ];

  const proFeatures = [
    "Everything in Basic +",
    "Share Market Trading",
    "Graphic Design Mastery",
    "Rich Mindset Development",
    "Social Media Marketing",
    "YouTube & Instagram Growth"
  ];

  const handlePaymentClick = (packageType: "basic" | "pro", amount: number) => {
    setPaymentModal({
      isOpen: true,
      packageType,
      amount,
    });
  };

  const closePaymentModal = () => {
    setPaymentModal({
      ...paymentModal,
      isOpen: false,
    });
  };

  const journeySteps = [
    {
      icon: "🎬",
      title: "Watch",
      description: "HD video lessons with interactive elements"
    },
    {
      icon: "📝",
      title: "Practice", 
      description: "Hands-on assignments and real projects"
    },
    {
      icon: "💰",
      title: "Earn",
      description: "Start earning through our affiliate system"
    },
    {
      icon: "🏆",
      title: "Certify",
      description: "Get verified certificates with unique IDs"
    }
  ];

  return (
    <section id="courses" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Course Packages
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose from our carefully crafted course packages designed to transform your career and earning potential.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Basic Package */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Basic Package</h3>
                <p className="text-gray-600 dark:text-gray-300">Perfect for beginners</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ₹1,499
                </div>
                <div className="text-sm text-gray-500 line-through">₹2,999</div>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {basicFeatures.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                  <Check className="text-green-500 mr-3 h-5 w-5" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button 
              onClick={() => handlePaymentClick("basic", 1499)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-4 text-lg font-semibold"
            >
              Choose Basic
            </Button>
          </motion.div>

          {/* Pro Package */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-bl-xl font-semibold text-sm">
              <Star className="inline mr-1 h-4 w-4" />
              POPULAR
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Pro Package</h3>
                <p className="text-gray-600 dark:text-gray-300">For serious learners</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ₹2,999
                </div>
                <div className="text-sm text-gray-500 line-through">₹5,999</div>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                  <Check className="text-green-500 mr-3 h-5 w-5" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button 
              onClick={() => handlePaymentClick("pro", 2999)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-4 text-lg font-semibold shadow-lg"
            >
              Choose Pro
            </Button>
          </motion.div>
        </div>

        {/* Course Journey */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Your Learning Journey
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {journeySteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={closePaymentModal}
        packageType={paymentModal.packageType}
        amount={paymentModal.amount}
        onSuccess={closePaymentModal}
      />
    </section>
  );
}
