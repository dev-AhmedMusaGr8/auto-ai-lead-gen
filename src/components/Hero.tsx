
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white pt-20">
      <div className="kepli-gradient absolute inset-0 z-0"></div>
      <div className="container relative z-10 mx-auto px-4 py-20 md:py-28">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="mb-8 flex space-x-2">
            <div className="h-8 w-8 rounded-full bg-yellow-100 border border-yellow-300"></div>
            <div className="h-8 w-8 rounded-full bg-blue-100 border border-blue-300"></div>
            <div className="h-8 w-8 rounded-full bg-green-100 border border-green-300"></div>
          </div>
          <h1 className="mb-6 text-4xl font-bold text-kepli-darkGray max-w-3xl md:text-5xl">
            Simplify Your Customer Communication Across Every Channel
          </h1>
          <p className="mb-8 max-w-2xl text-kepli-gray text-lg">
            Connect with customers across multiple channels and streamline all your conversations in one powerful CRM platform.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button size="lg" className="bg-kepli-purple hover:bg-kepli-darkPurple rounded-lg">
              Get Started Free
            </Button>
          </div>
        </div>
        
        <div className="relative mx-auto max-w-5xl">
          <div className="rounded-xl bg-white p-4 shadow-lg">
            <img
              src="/lovable-uploads/8a731499-4ec2-47bf-a2a1-66c79a2e95d5.png"
              alt="Kepli Dashboard"
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
