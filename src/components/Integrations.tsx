
import { Button } from "@/components/ui/button";

const Integrations = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-3xl font-bold text-kepli-darkGray md:text-4xl">
          Seamlessly Connect with Your Favorite Tools and Platforms
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-center text-kepli-gray">
          Integrate with the tools you already use to streamline your workflow
        </p>

        <div className="relative mx-auto max-w-3xl">
          <div className="relative z-10 flex items-center justify-center">
            <div className="platform-circle absolute -z-10 h-24 w-24 rounded-full bg-kepli-purple opacity-20"></div>
            <div className="h-16 w-16 rounded-full bg-kepli-purple flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">K</span>
            </div>
          </div>
          
          {/* Connection lines - simplified representation */}
          <div className="absolute inset-0 z-0">
            <svg className="h-full w-full" viewBox="0 0 400 400" fill="none">
              <path d="M200 100 L100 200" stroke="#E0E7FF" strokeWidth="2" />
              <path d="M200 100 L300 200" stroke="#E0E7FF" strokeWidth="2" />
              <path d="M200 100 L200 300" stroke="#E0E7FF" strokeWidth="2" />
              <path d="M200 100 L120 300" stroke="#E0E7FF" strokeWidth="2" />
              <path d="M200 100 L280 300" stroke="#E0E7FF" strokeWidth="2" />
            </svg>
          </div>
          
          {/* Integration platform circles */}
          <div className="absolute left-1/4 top-1/4 -translate-x-1/2 transform">
            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
              <span className="text-lg font-bold text-white">F</span>
            </div>
          </div>
          
          <div className="absolute right-1/4 top-1/4 translate-x-1/2 transform">
            <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center shadow-md">
              <span className="text-lg font-bold text-white">I</span>
            </div>
          </div>
          
          <div className="absolute bottom-1/4 left-1/6 transform">
            <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center shadow-md">
              <span className="text-lg font-bold text-white">W</span>
            </div>
          </div>
          
          <div className="absolute bottom-1/4 right-1/6 transform">
            <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center shadow-md">
              <span className="text-lg font-bold text-white">S</span>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 transform">
            <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center shadow-md">
              <span className="text-lg font-bold text-white">G</span>
            </div>
          </div>
        </div>

        <div className="mt-32 text-center">
          <h3 className="mb-4 text-2xl font-bold text-kepli-darkGray">
            Connect Your Entire Tech Stack
          </h3>
          <p className="mx-auto mb-8 max-w-xl text-kepli-gray">
            Kepli integrates with over 100+ apps and services to unify your customer data and streamline your operations.
          </p>
          <Button className="bg-kepli-purple hover:bg-kepli-darkPurple text-white rounded-lg">
            View All Integrations
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Integrations;
