
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

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Management />
        <CustomerExperience />
        <Testimonials />
        <Pricing />
        <Integrations />
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
