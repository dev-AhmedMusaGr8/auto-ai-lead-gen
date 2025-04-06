
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    name: "Starter",
    price: "$99",
    description: "Perfect for small dealerships just getting started.",
    features: [
      "Up to 500 customer records",
      "Basic lead management",
      "Sales pipeline tracking",
      "Email integration",
      "Mobile app access",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$249",
    description: "Ideal for established dealerships ready to grow.",
    features: [
      "Unlimited customer records",
      "AI-powered lead scoring",
      "Inventory management",
      "Service scheduling",
      "Custom reports and dashboards",
      "Marketing automation",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For dealership groups and large operations.",
    features: [
      "Multi-location management",
      "Advanced AI insights",
      "Custom integrations",
      "Dedicated account manager",
      "24/7 priority support",
      "White-label options",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-3xl font-bold tracking-tight text-automotive-blue md:text-4xl">
          Simple, Transparent Pricing
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-gray-600">
          Choose the plan that's right for your automotive business
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`overflow-hidden ${
                plan.highlighted
                  ? "border-automotive-lightBlue shadow-lg"
                  : "border shadow"
              }`}
            >
              {plan.highlighted && (
                <div className="bg-automotive-lightBlue py-1 text-center text-sm font-semibold text-white">
                  Most Popular
                </div>
              )}
              <CardHeader
                className={`pb-8 pt-6 text-center ${
                  plan.highlighted ? "bg-automotive-lightBlue/5" : ""
                }`}
              >
                <h3 className="text-xl font-bold text-automotive-blue">
                  {plan.name}
                </h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-gray-500">/month</span>
                  )}
                </div>
                <p className="mt-2 text-gray-500">{plan.description}</p>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-automotive-lightBlue" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-automotive-accent hover:bg-automotive-accent/90"
                      : "bg-automotive-blue hover:bg-automotive-blue/90"
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
