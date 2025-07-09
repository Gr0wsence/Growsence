import { motion } from "framer-motion";
import { UserPlus, DollarSign, Users, TrendingUp } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: UserPlus,
      title: "Learn",
      description: "Enroll in our premium courses and start your learning journey with expert guidance.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      number: 2,
      icon: DollarSign,
      title: "Earn",
      description: "Start earning through our affiliate system with up to 58% commission on referrals.",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      number: 3,
      icon: Users,
      title: "Educate",
      description: "Share your knowledge and help others succeed while building your network.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      number: 4,
      icon: TrendingUp,
      title: "Grow",
      description: "Scale your income and impact as you master new skills and expand your reach.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How It{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your journey to success in 4 simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="relative mb-8">
                <div className={`w-24 h-24 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transition-all duration-300`}>
                  <step.icon className="text-white text-2xl" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
