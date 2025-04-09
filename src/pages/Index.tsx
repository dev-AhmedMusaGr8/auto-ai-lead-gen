
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Management from "@/components/Management";
import CustomerExperience from "@/components/CustomerExperience";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Integrations from "@/components/Integrations";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="max-w-[1920px] mx-auto">
        <Hero />
        <div className="px-4 md:px-8 lg:px-16 xl:px-24">
          <Features />
          <Management />
          <HowItWorks />
          <CustomerExperience />
          <Testimonials />
          <Pricing />
          <Integrations />
          <FAQ />
          <ContactForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
