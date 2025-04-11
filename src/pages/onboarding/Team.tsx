
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus, User, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

const Team = () => {
  const { setCurrentStep } = useOnboarding();
  const navigate = useNavigate();

  const handleContinue = () => {
    setCurrentStep('complete');
    navigate('/onboarding/complete');
  };

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-kepli-darkGray mb-4">
          Invite your team
        </h1>
        <p className="text-kepli-gray text-lg mb-8">
          Collaborate with your sales, service, and management teams to maximize your dealership's potential.
        </p>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex gap-2">
              <Input id="email" placeholder="Enter team member's email" className="flex-1" />
              <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Invited Team Members</h3>
            </div>
            
            <div className="space-y-3 border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <User className="h-6 w-6" />
                  </Avatar>
                  <div>
                    <p className="font-medium">sales@example.com</p>
                    <p className="text-sm text-kepli-gray">Sales Team</p>
                  </div>
                </div>
                <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Pending</span>
              </div>
              
              <div className="border-t"></div>
              
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <User className="h-6 w-6" />
                  </Avatar>
                  <div>
                    <p className="font-medium">service@example.com</p>
                    <p className="text-sm text-kepli-gray">Service Department</p>
                  </div>
                </div>
                <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Pending</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
          <Users className="h-5 w-5 text-blue-500" />
          <p className="text-sm text-blue-700">
            You can invite more team members after completing the onboarding process.
          </p>
        </div>
        
        <Button
          onClick={handleContinue}
          className="mt-10 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-md px-6 py-2 h-12 font-medium flex items-center justify-center gap-2 w-full md:w-auto"
        >
          Continue
          <ArrowRight size={16} />
        </Button>
      </div>
      
      <div className="hidden md:flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=80" 
          alt="Team collaboration" 
          className="rounded-lg shadow-xl max-w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default Team;
