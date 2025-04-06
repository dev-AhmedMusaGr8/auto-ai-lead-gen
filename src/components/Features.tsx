
import { Car, Database, TrendingUp, Users, MessageSquare } from "lucide-react";

const features = [
  {
    title: "Customer Insights",
    description:
      "Track customer journeys and preferences with AI-powered analytics that predict buying patterns and service needs.",
    icon: Users,
  },
  {
    title: "Vehicle Lifecycle Management",
    description:
      "Manage the entire lifecycle of each vehicle, from inventory to sale and service history, all in one platform.",
    icon: Car,
  },
  {
    title: "Sales Performance",
    description:
      "Boost your team's performance with AI-driven lead scoring and opportunity forecasting tools.",
    icon: TrendingUp,
  },
  {
    title: "Service Scheduling",
    description:
      "Automated service reminders and intelligent scheduling that optimizes your workshop capacity.",
    icon: MessageSquare,
  },
  {
    title: "Inventory Intelligence",
    description:
      "Get real-time inventory insights and market demand predictions to optimize your stock levels.",
    icon: Database,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-automotive-blue md:text-4xl">
          Supercharge Your Automotive Business
        </h2>
        <p className="mx-auto mb-16 max-w-3xl text-center text-lg text-gray-600">
          Our AI-powered CRM delivers powerful tools designed specifically for the unique challenges of the automotive industry.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card-hover rounded-lg border bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-automotive-lightBlue/10 text-automotive-lightBlue">
                <feature.icon size={24} />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-automotive-blue">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
