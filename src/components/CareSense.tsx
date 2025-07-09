import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Leaf, Eye, CloudRain, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CareSense() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [emotionalBalance, setEmotionalBalance] = useState(75);

  const moods = [
    { id: "happy", icon: Smile, label: "Happy", color: "from-yellow-400 to-orange-500" },
    { id: "calm", icon: Leaf, label: "Calm", color: "from-blue-400 to-blue-600" },
    { id: "focused", icon: Eye, label: "Focused", color: "from-green-400 to-green-600" },
    { id: "stressed", icon: CloudRain, label: "Stressed", color: "from-purple-400 to-purple-600" },
  ];

  const features = [
    {
      icon: Heart,
      title: "Mood Tracking",
      description: "AI-powered mood detection that adapts your learning environment based on your emotional state.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: Leaf,
      title: "Digital Therapy",
      description: "Access to digital therapy rooms and private vent spaces for emotional support.",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: Eye,
      title: "Smart Reminders",
      description: "Personalized self-care reminders and motivational content delivered at the right time.",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    // Update emotional balance based on mood
    const balanceMap: { [key: string]: number } = {
      happy: 90,
      calm: 85,
      focused: 80,
      stressed: 45
    };
    setEmotionalBalance(balanceMap[moodId] || 75);
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Meet{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CareSense
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Our revolutionary emotional intelligence system that adapts to your mood and supports 
              your mental well-being throughout your learning journey.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center mr-4 mt-1`}>
                    <feature.icon className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smile className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  How are you feeling today?
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {moods.map((mood) => (
                  <Button
                    key={mood.id}
                    variant={selectedMood === mood.id ? "default" : "outline"}
                    className={`p-4 h-auto flex flex-col items-center justify-center bg-gradient-to-r ${mood.color} text-white hover:shadow-lg transition-all duration-300 ${
                      selectedMood === mood.id ? "ring-4 ring-white" : ""
                    }`}
                    onClick={() => handleMoodSelect(mood.id)}
                  >
                    <mood.icon className="text-2xl mb-2" />
                    <span>{mood.label}</span>
                  </Button>
                ))}
              </div>

              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Your learning environment will adapt to your mood
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${emotionalBalance}%` }}
                    initial={{ width: "75%" }}
                    animate={{ width: `${emotionalBalance}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Emotional Balance: {emotionalBalance}%
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
