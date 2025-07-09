import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const [mood, setMood] = useState("default");
  const [counters, setCounters] = useState({
    courses: 0,
    students: 0,
    earned: 0,
    successRate: 0,
  });

  useEffect(() => {
    // Animate counters
    const targets = { courses: 10, students: 500, earned: 10, successRate: 95 };
    const duration = 2000;
    const steps = 50;
    const stepDuration = duration / steps;

    const intervals = Object.entries(targets).map(([key, target]) => {
      const increment = target / steps;
      let current = 0;
      
      return setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(intervals.find(interval => interval === intervals[0]));
        }
        setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, stepDuration);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  const getMoodGradient = () => {
    switch (mood) {
      case "happy":
        return "from-yellow-400 to-orange-500";
      case "calm":
        return "from-blue-400 to-blue-600";
      case "focused":
        return "from-green-400 to-green-600";
      default:
        return "from-blue-500 to-purple-600";
    }
  };

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br ${getMoodGradient()}`}>
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Learn Skills,{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Earn Money
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Join India's premium online platform that merges education and affiliate-based earning. 
            Transform your digital skills and start earning today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Start Learning Today
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 px-8 py-6 text-lg font-semibold"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {counters.courses}+
              </div>
              <div className="text-gray-300">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {counters.students}+
              </div>
              <div className="text-gray-300">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                ₹{counters.earned}L+
              </div>
              <div className="text-gray-300">Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {counters.successRate}%
              </div>
              <div className="text-gray-300">Success Rate</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <ChevronDown className="h-8 w-8" />
      </div>
    </section>
  );
}
