
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const Hero = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative overflow-hidden bg-white pt-10">
      <div className="kepli-gradient absolute inset-0 z-0"></div>
      <div className="container relative z-10 mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col items-center text-center mx-auto max-w-4xl mb-12">
          <div className="mb-8 flex -space-x-3">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarImage src="https://images.unsplash.com/photo-1491349174775-aaafddd81942?w=400&auto=format&fit=crop&q=80" alt="Avatar 1" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop&q=80" alt="Avatar 2" />
              <AvatarFallback>JM</AvatarFallback>
            </Avatar>
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80" alt="Avatar 3" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <span className="flex items-center pl-3 text-sm font-medium text-kepli-darkGray">
              1000+ sales persons
            </span>
          </div>
          <h1 className="mb-6 text-5xl font-bold text-kepli-darkGray max-w-3xl leading-tight md:text-6xl">
            AI-Powered CRM for the Automotive Industry
          </h1>
          <p className="mb-8 max-w-2xl text-kepli-gray text-xl">
            Streamline your dealership operations, boost sales performance, and deliver exceptional customer experiences with our intelligent automotive CRM solution.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
            <Link to="/signin">
              <Button size="lg" className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-md text-sm px-8 py-3 h-12 font-medium shadow-md">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/5 rounded-md text-sm px-8 py-3 h-12 font-medium">
              Book a Demo
            </Button>
          </div>
        </div>
        
        <div className="relative mx-auto max-w-5xl mt-4">
          <div className="rounded-xl bg-white p-4 shadow-lg">
            <img
              src="/lovable-uploads/8a731499-4ec2-47bf-a2a1-66c79a2e95d5.png"
              alt="AutoCRMAI Dashboard"
              className="w-full rounded-lg shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
