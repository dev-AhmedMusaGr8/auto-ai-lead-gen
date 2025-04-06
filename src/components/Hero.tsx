
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-automotive-blue text-white">
      <div className="hero-gradient absolute inset-0 z-0"></div>
      <div className="container relative z-10 mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-6 animate-fade-in text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            AutoCRM<span className="text-automotive-lightBlue">AI</span>
          </h1>
          <p className="mb-8 max-w-2xl animate-fade-in text-xl text-automotive-gray md:text-2xl">
            Revolutionize your automotive business with the industry's first AI-powered CRM
            designed specifically for dealerships and service centers.
          </p>
          <div className="flex animate-fade-in flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button size="lg" className="bg-automotive-accent hover:bg-automotive-accent/90">
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10"
            >
              Schedule Demo
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="mt-12 animate-fade-in rounded-lg bg-black/20 p-4">
            <p className="text-sm">Trusted by 3,000+ automotive businesses worldwide</p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-10 w-full bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default Hero;
