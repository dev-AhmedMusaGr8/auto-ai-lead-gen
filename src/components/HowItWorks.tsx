
import { Button } from "@/components/ui/button";

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="mb-2 text-center text-3xl font-bold text-kepli-darkGray md:text-4xl">
          How AutoCRMAI Works
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-kepli-gray">
          Simple, streamlined, and built specifically for automotive professionals
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-kepli-purple text-2xl font-bold text-white">
              1
            </div>
            <h3 className="mb-3 text-xl font-semibold text-kepli-darkGray">Connect Your Data</h3>
            <p className="mb-4 text-kepli-gray">
              Easily import your existing customer and inventory data or start fresh with our intuitive setup wizard.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-kepli-purple text-2xl font-bold text-white">
              2
            </div>
            <h3 className="mb-3 text-xl font-semibold text-kepli-darkGray">Activate AI Insights</h3>
            <p className="mb-4 text-kepli-gray">
              Our AI engine analyzes your data to provide actionable insights, predict customer needs, and identify sales opportunities.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-kepli-purple text-2xl font-bold text-white">
              3
            </div>
            <h3 className="mb-3 text-xl font-semibold text-kepli-darkGray">Grow Your Business</h3>
            <p className="mb-4 text-kepli-gray">
              Automate routine tasks, close more deals, and improve customer satisfaction with our comprehensive platform.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button 
            size="lg" 
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-md text-sm px-8 py-3 h-12 font-medium shadow-md"
          >
            See It In Action
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
