
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DealershipLogos from "@/components/DealershipLogos";
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
import SectionTitle from "@/components/SectionTitle";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden font-inter">
      <Navbar />
      <main className="max-w-[1920px] mx-auto">
        <Hero />
        <DealershipLogos />
        
        <div className="bg-white py-12 md:py-20">
          <div className="px-4 md:px-8 lg:px-16 xl:px-24 max-w-[1400px] mx-auto">
            <SectionTitle title="WHY CHOOSE US" />
            <Features />
          </div>
        </div>
        
        <div className="bg-gray-50 py-12 md:py-20">
          <div className="px-4 md:px-8 lg:px-16 xl:px-24 max-w-[1400px] mx-auto">
            <SectionTitle title="BENEFIT" />
            <Management />
          </div>
        </div>
        
        <div className="bg-white py-12 md:py-20">
          <div className="px-4 md:px-8 lg:px-16 xl:px-24 max-w-[1400px] mx-auto">
            <SectionTitle title="HOW IT WORKS" />
            <HowItWorks />
          </div>
        </div>
        
        <div className="bg-gray-50 py-12 md:py-20">
          <div className="px-4 md:px-8 lg:px-16 xl:px-24 max-w-[1400px] mx-auto">
            <SectionTitle title="CUSTOMER EXPERIENCE" />
            <CustomerExperience />
          </div>
        </div>
        
        <div className="bg-white py-12 md:py-20">
          <div className="px-4 md:px-8 lg:px-16 xl:px-24 max-w-[1400px] mx-auto">
            <SectionTitle title="TESTIMONIAL" />
            <Testimonials />
          </div>
        </div>
        
        <div className="bg-gray-50 py-12 md:py-20">
          <div className="px-4 md:px-8 lg:px-16 xl:px-24 max-w-[1400px] mx-auto">
            <SectionTitle title="PRICING" />
            <Pricing />
          </div>
        </div>
        
        <div className="bg-white py-12 md:py-20">
          <div className="px-4 md:px-8 lg:px-16 xl:px-24 max-w-[1400px] mx-auto">
            <SectionTitle title="INTEGRATION" />
            <Integrations />
          </div>
        </div>
        
        <div className="bg-gray-50 py-12 md:py-20">
          <div className="px-4 md:px-8 lg:px-16 xl:px-24 max-w-[1400px] mx-auto">
            <SectionTitle title="FAQ" />
            <FAQ />
          </div>
        </div>
        
        <div className="bg-white py-12 md:py-20">
          <div className="px-4 md:px-8 lg:px-16 xl:px-24 max-w-[1400px] mx-auto">
            <SectionTitle title="CONTACT US" />
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
