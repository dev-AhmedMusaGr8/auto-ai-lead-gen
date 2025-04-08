
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    name: "Basic",
    price: "$199",
    description: "Perfect for small dealerships",
    features: [
      "Up to 5 user accounts",
      "Basic lead management",
      "Email integration",
      "Limited AI recommendations",
      "Mobile access",
    ],
    cta: "Start Free Trial",
    highlighted: false,
    badge: "",
  },
  {
    name: "Professional",
    price: "$499",
    description: "Best for growing dealerships",
    features: [
      "Up to 25 user accounts",
      "Advanced lead tracking",
      "Multichannel integration",
      "Full AI recommendations",
      "Custom reports and analytics",
      "24/7 priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
    badge: "MOST POPULAR",
  },
  {
    name: "Enterprise",
    price: "$999",
    description: "For multi-location groups",
    features: [
      "Unlimited user accounts",
      "Enterprise-grade security",
      "Advanced API access",
      "Custom integrations",
      "Dedicated account manager",
      "White-label options",
      "Multi-location management",
    ],
    cta: "Contact Sales",
    highlighted: false,
    badge: "",
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="bg-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-3xl font-bold text-kepli-darkGray md:text-4xl">
          Flexible Plans for Dealerships of All Sizes
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-kepli-gray">
          Choose the perfect plan for your automotive business needs
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`overflow-hidden border ${
                plan.highlighted
                  ? "border-kepli-purple shadow-lg"
                  : "border-gray-200 shadow-sm"
              }`}
            >
              {plan.highlighted && plan.badge && (
                <div className="bg-kepli-purple py-1 text-center text-sm font-semibold text-white">
                  {plan.badge}
                </div>
              )}
              <CardHeader
                className={`pb-6 pt-6 text-center`}
              >
                <h3 className="text-xl font-bold text-kepli-darkGray">
                  {plan.name}
                </h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-kepli-darkGray">{plan.price}</span>
                  <span className="text-kepli-gray">/month</span>
                </div>
                <p className="mt-2 text-kepli-gray">{plan.description}</p>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-kepli-purple" />
                      <span className="text-kepli-darkGray">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-kepli-purple hover:bg-kepli-darkPurple"
                      : "bg-white border-2 border-kepli-purple text-kepli-purple hover:bg-kepli-purple/5"
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-kepli-gray">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
