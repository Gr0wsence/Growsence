import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does the affiliate system work?",
      answer: "You get a unique referral link after enrollment. Share it with others, and when they purchase through your link, you earn up to 58% commission on direct sales and 12-17% on team sales. Payments are processed automatically every Saturday for earnings above ₹200."
    },
    {
      question: "What is CareSense and how does it help?",
      answer: "CareSense is our emotional intelligence system that tracks your mood and adapts your learning environment accordingly. It includes features like mood tracking, digital therapy rooms, self-care reminders, and motivational content to support your mental well-being."
    },
    {
      question: "Can I upgrade from Basic to Pro later?",
      answer: "Yes, you can upgrade to Pro at any time by paying the difference. Your progress and earnings history will be preserved, and you'll immediately get access to all Pro features and additional courses."
    },
    {
      question: "What is the refund policy?",
      answer: "We offer a 48-hour refund window from the time of purchase. A 5% processing fee applies to all refunds. After 48 hours, refunds are not available, but you can always reach out to our support team for special circumstances."
    },
    {
      question: "How long do I have access to the courses?",
      answer: "You get lifetime access to all courses in your package. This includes any updates or new content added to existing courses. The only exception is access to live sessions, which are available for 1 year from enrollment."
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Got questions? We've got answers!
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`text-gray-500 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-4"
                >
                  <p className="text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
