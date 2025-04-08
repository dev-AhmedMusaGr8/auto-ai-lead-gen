
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative overflow-hidden bg-white pt-20">
      <div className="kepli-gradient absolute inset-0 z-0"></div>
      <div className="container relative z-10 mx-auto px-4 py-20 md:py-28">
        <div className="flex flex-col items-center text-center mx-auto max-w-4xl mb-20">
          <div className="mb-10 flex space-x-3">
            <div className="h-10 w-10 rounded-full bg-yellow-100 border border-yellow-300"></div>
            <div className="h-10 w-10 rounded-full bg-blue-100 border border-blue-300"></div>
            <div className="h-10 w-10 rounded-full bg-green-100 border border-green-300"></div>
          </div>
          <h1 className="mb-8 text-5xl font-bold text-kepli-darkGray max-w-3xl leading-tight md:text-6xl">
            AI-Powered CRM for the Automotive Industry
          </h1>
          <p className="mb-10 max-w-2xl text-kepli-gray text-xl">
            Streamline your dealership operations, boost sales performance, and deliver exceptional customer experiences with our intelligent automotive CRM solution.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
            <Button size="lg" className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-md text-sm px-8 py-3 h-12 font-medium shadow-md">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/5 rounded-md text-sm px-8 py-3 h-12 font-medium">
              Book a Demo
            </Button>
          </div>
        </div>
        
        <div className="relative mx-auto max-w-5xl">
          <div className="rounded-xl bg-white p-4 shadow-lg">
            <img
              src="/lovable-uploads/8a731499-4ec2-47bf-a2a1-66c79a2e95d5.png"
              alt="AutoCRMAI Dashboard"
              className="w-full rounded-lg shadow-sm"
            />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-6">
          {Array(6).fill(null).map((_, i) => (
            <div key={i} className="flex items-center justify-center opacity-60">
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
