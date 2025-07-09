import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

export default function Pricing() {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const basicFeatures = [
    "5 Core Courses",
    "Affiliate System Access",
    "58% Commission on Sales",
    "CareSense Basic Features",
    "Certificate of Completion",
    "WhatsApp Support"
  ];

  const proFeatures = [
    "Everything in Basic +",
    "11 Advanced Courses",
    "Premium Affiliate Tools",
    "CareSense Pro Features",
    "1-on-1 Mentorship",
    "Priority Support"
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Success Path
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Transform your career with our premium learning experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Basic Package */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Basic Package
              </h3>
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ₹1,499
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-2 line-through">
                  ₹2,999
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Perfect for beginners starting their journey
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {basicFeatures.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="text-green-500 mr-3 h-5 w-5" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-4 text-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105">
              Get Started
            </Button>
          </motion.div>

          {/* Pro Package */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200/50 dark:border-gray-700/50 relative"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-semibold text-sm flex items-center">
              <Star className="mr-1 h-4 w-4" />
              MOST POPULAR
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Pro Package
              </h3>
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ₹2,999
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-2 line-through">
                  ₹5,999
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Complete solution for serious learners
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {proFeatures.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="text-green-500 mr-3 h-5 w-5" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 py-4 text-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105">
              Go Pro Now
            </Button>
          </motion.div>
        </div>

        {/* Offer Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Limited Time Offer!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Get 50% off on all packages. Offer expires in:
            </p>
            <div className="flex justify-center space-x-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{timeLeft.days}</div>
                <div className="text-sm text-gray-500">Days</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{timeLeft.hours}</div>
                <div className="text-sm text-gray-500">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{timeLeft.minutes}</div>
                <div className="text-sm text-gray-500">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{timeLeft.seconds}</div>
                <div className="text-sm text-gray-500">Seconds</div>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              *Offer valid for new enrollments only
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
