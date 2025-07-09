import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import CoursePackages from "@/components/CoursePackages";
import Testimonials from "@/components/Testimonials";
import HowItWorks from "@/components/HowItWorks";
import CareSense from "@/components/CareSense";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navigation />
      <main>
        <Hero />
        <About />
        <CoursePackages />
        <Testimonials />
        <HowItWorks />
        <CareSense />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
      <WhatsAppButton />
    </div>
  );
}
