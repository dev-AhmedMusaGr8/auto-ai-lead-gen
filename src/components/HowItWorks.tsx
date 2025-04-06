
import { Button } from "@/components/ui/button";

const HowItWorks = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-3xl font-bold tracking-tight text-automotive-blue md:text-4xl">
          How AutoCRMAI Works
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-gray-600">
          Simple, streamlined, and built specifically for automotive professionals
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-automotive-blue text-2xl font-bold text-white">
              1
            </div>
            <h3 className="mb-3 text-xl font-semibold text-automotive-blue">Connect Your Data</h3>
            <p className="mb-4 text-gray-600">
              Easily import your existing customer and inventory data or start fresh with our intuitive setup wizard.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-automotive-blue text-2xl font-bold text-white">
              2
            </div>
            <h3 className="mb-3 text-xl font-semibold text-automotive-blue">Activate AI Insights</h3>
            <p className="mb-4 text-gray-600">
              Our AI engine analyzes your data to provide actionable insights, predict customer needs, and identify sales opportunities.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-automotive-blue text-2xl font-bold text-white">
              3
            </div>
            <h3 className="mb-3 text-xl font-semibold text-automotive-blue">Grow Your Business</h3>
            <p className="mb-4 text-gray-600">
              Automate routine tasks, close more deals, and improve customer satisfaction with our comprehensive platform.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button 
            size="lg" 
            className="bg-automotive-accent hover:bg-automotive-accent/90"
          >
            See It In Action
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
