
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CustomerExperience = () => {
  return (
    <section>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="rounded-xl bg-white p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">JD</span>
                    </div>
                    <div>
                      <p className="font-medium text-kepli-darkGray">John Doe</p>
                      <p className="text-xs text-kepli-gray">2 min ago</p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg bg-gray-50 p-3">
                    <p className="text-sm text-kepli-gray">
                      Thank you for your quick response!
                    </p>
                  </div>
                </div>
                
                <div className="rounded-xl bg-white p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                      <span className="text-pink-600 font-medium">JS</span>
                    </div>
                    <div>
                      <p className="font-medium text-kepli-darkGray">Jane Smith</p>
                      <p className="text-xs text-kepli-gray">5 min ago</p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg bg-gray-50 p-3">
                    <p className="text-sm text-kepli-gray">
                      I'd like to upgrade my subscription plan.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 space-y-6">
                <div className="rounded-xl bg-white p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-medium">RM</span>
                    </div>
                    <div>
                      <p className="font-medium text-kepli-darkGray">Robert Miller</p>
                      <p className="text-xs text-kepli-gray">10 min ago</p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg bg-gray-50 p-3">
                    <p className="text-sm text-kepli-gray">
                      Can you help me with the integration?
                    </p>
                  </div>
                  <div className="mt-3 rounded-lg bg-kepli-purple p-3">
                    <p className="text-sm text-white">
                      Sure! I'll send you a guide right away.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col justify-center order-1 lg:order-2">
            <h2 className="mb-6 text-3xl font-bold text-kepli-darkGray">
              Deliver Exceptional Customer Experiences
            </h2>
            
            <p className="mb-6 text-kepli-gray">
              Build meaningful relationships with your customers through personalized communication. Our platform helps you understand customer needs and deliver timely support across all channels.
            </p>
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100">
                  <span className="font-medium text-blue-600">1</span>
                </div>
                <p className="font-medium text-kepli-darkGray">
                  Personalized Customer Journeys
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 flex items-center justify-center rounded-full bg-green-100">
                  <span className="font-medium text-green-600">2</span>
                </div>
                <p className="font-medium text-kepli-darkGray">
                  Faster Response Times
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="mr-3 h-10 w-10 flex items-center justify-center rounded-full bg-purple-100">
                  <span className="font-medium text-purple-600">3</span>
                </div>
                <p className="font-medium text-kepli-darkGray">
                  Consistent Communication
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <Link to="/signin">
                <Button className="btn-primary">
                  Start Improving Experience
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerExperience;
