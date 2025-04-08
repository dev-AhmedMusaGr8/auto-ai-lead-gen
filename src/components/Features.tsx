
import { MessageSquare, Users, Settings, Check, BarChart } from "lucide-react";

const featureGroups = [
  {
    icon: <Users size={24} className="text-white" />,
    bgColor: "feature-icon-purple",
    title: "Lead Management",
    description: "Track and nurture automotive leads through your sales funnel"
  },
  {
    icon: <MessageSquare size={24} className="text-white" />,
    bgColor: "feature-icon-blue",
    title: "Customer Communication",
    description: "Engage customers across email, SMS, & social media"
  },
  {
    icon: <Settings size={24} className="text-white" />,
    bgColor: "feature-icon-green",
    title: "AI-Powered Insights",
    description: "Gain actionable intelligence for better decision making"
  },
  {
    icon: <BarChart size={24} className="text-white" />,
    bgColor: "feature-icon-orange",
    title: "Sales Analytics",
    description: "Track performance with automotive-specific metrics"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-center text-3xl font-bold text-kepli-darkGray md:text-4xl">
          Everything You Need to Manage Your Dealership Efficiently
        </h2>
        
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {featureGroups.map((feature, index) => (
            <div
              key={index}
              className="feature-card-hover rounded-xl bg-white p-6"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor}`}>
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-kepli-darkGray">
                {feature.title}
              </h3>
              <p className="text-kepli-gray">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-3">
          <div className="flex flex-col items-center lg:items-start">
            <div className="mb-4 rounded-full bg-blue-100 p-2 text-blue-600">
              <Users size={24} />
            </div>
            <h3 className="mb-3 text-lg font-semibold text-kepli-darkGray">Inventory Integration</h3>
            <p className="text-center text-kepli-gray lg:text-left">
              Seamlessly connect your vehicle inventory with customer interactions for better sales matching
            </p>
          </div>
          
          <div className="flex flex-col items-center lg:items-start">
            <div className="mb-4 rounded-full bg-green-100 p-2 text-green-600">
              <MessageSquare size={24} />
            </div>
            <h3 className="mb-3 text-lg font-semibold text-kepli-darkGray">Smart Follow-ups</h3>
            <p className="text-center text-kepli-gray lg:text-left">
              AI-powered responses help you reach out to prospects at the right time with the right message
            </p>
          </div>
          
          <div className="flex flex-col items-center lg:items-start">
            <div className="mb-4 rounded-full bg-purple-100 p-2 text-purple-600">
              <Settings size={24} />
            </div>
            <h3 className="mb-3 text-lg font-semibold text-kepli-darkGray">Automotive Workflows</h3>
            <p className="text-center text-kepli-gray lg:text-left">
              Create customized processes that match your dealership's sales and service needs
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
