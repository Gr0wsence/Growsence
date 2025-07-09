import { motion } from "framer-motion";
import { GraduationCap, DollarSign, Brain, Smartphone, Trophy, Headphones } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: GraduationCap,
      title: "Premium Education",
      description: "High-quality courses designed by industry experts with hands-on projects and real-world applications.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: DollarSign,
      title: "Earn While Learning",
      description: "Complete affiliate system with auto-tracking and payouts. Earn up to 58% on direct sales.",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: Brain,
      title: "CareSense AI",
      description: "Revolutionary emotional intelligence system that adapts to your mood and supports your mental well-being.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Smartphone,
      title: "Mobile-First",
      description: "Seamless experience across all devices with offline capabilities and progressive web app features.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Trophy,
      title: "Gamification",
      description: "XP system, leaderboards, and animated badges to keep you motivated throughout your learning journey.",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock support via WhatsApp, AI chatbot, and dedicated success managers.",
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Growsence
            </span>
            ?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We're not just another learning platform. We're your partner in growth, combining cutting-edge 
            education with real earning opportunities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center mb-6`}>
                <feature.icon className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
