
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const ManagementSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h2 className="mb-6 text-3xl font-bold text-kepli-darkGray">
              Easy Way to Manage Your Dealership with AutoCRMAI
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-kepli-purple">
                  <Check size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-kepli-darkGray">
                    Organize and manage leads, prospects, and customers in one platform
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-kepli-purple">
                  <Check size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-kepli-darkGray">
                    Access customer conversations from any channel - email, SMS, social
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-kepli-purple">
                  <Check size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-kepli-darkGray">
                    Track customer journey from first contact to purchase and service
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Button className="bg-kepli-purple hover:bg-kepli-darkPurple text-white rounded-lg">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="screen-gradient absolute -bottom-6 -right-6 h-4/5 w-4/5 rounded-xl"></div>
            <div className="relative z-10 overflow-hidden rounded-xl bg-white p-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="h-6 w-32 rounded bg-gray-100"></div>
              </div>
              <div className="p-4">
                <div className="flex flex-col space-y-4">
                  <div className="h-16 w-full rounded-lg bg-blue-50 p-4">
                    <div className="h-8 w-32 rounded bg-blue-100"></div>
                  </div>
                  <div className="h-16 w-full rounded-lg bg-purple-50 p-4">
                    <div className="h-8 w-48 rounded bg-purple-100"></div>
                  </div>
                  <div className="h-16 w-full rounded-lg bg-green-50 p-4">
                    <div className="h-8 w-40 rounded bg-green-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManagementSection;
