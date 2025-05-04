
import React, { useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus, User, Users, AlertCircle, ArrowLeft, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Team = () => {
  const { setCurrentStep, goBack } = useOnboarding();
  const { profile, inviteUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("sales_rep");
  const [invitedMembers, setInvitedMembers] = useState<Array<{email: string, role: UserRole}>>([]);
  const [isInviting, setIsInviting] = useState(false);

  const handleContinue = () => {
    setCurrentStep('complete');
    navigate('/onboarding/complete');
  };

  const handleBack = () => {
    goBack();
    navigate('/onboarding/inventory');
  };

  const handleInvite = async () => {
    if (!email || !profile?.dealership_id) return;
    
    setIsInviting(true);
    try {
      const result = await inviteUser(email, role, profile.dealership_id);
      
      if (result.success) {
        // Add to the invited members list
        setInvitedMembers([...invitedMembers, { email, role }]);
        setEmail("");
      }
    } catch (error) {
      console.error("Failed to send invitation:", error);
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveInvitee = (emailToRemove: string) => {
    setInvitedMembers(invitedMembers.filter(member => member.email !== emailToRemove));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // Format role for display
  const formatRole = (role: UserRole): string => {
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Invite your team
        </h1>
        <p className="text-gray-600">
          Add team members to collaborate with you. They'll receive an email invitation to join your dealership.
        </p>
      </motion.div>
      
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            placeholder="Enter team member's email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2"
          />
          
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
            <SelectTrigger className="mb-2">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales_rep">Sales Representative</SelectItem>
              <SelectItem value="service_advisor">Service Advisor</SelectItem>
              <SelectItem value="finance_admin">Finance Administrator</SelectItem>
              <SelectItem value="marketing">Marketing Specialist</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleInvite} 
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] w-full"
            disabled={!email || isInviting}
          >
            {isInviting ? "Sending..." : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Add Team Member
              </>
            )}
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-800">Invited Team Members</h3>
          </div>
          
          <motion.div
            className="space-y-3 border rounded-lg p-4 bg-white"
            variants={{
              hidden: { opacity: 0, height: 0 },
              visible: { 
                opacity: 1,
                height: 'auto',
                transition: { duration: 0.4, delay: 0.2 }
              }
            }}
          >
            {invitedMembers.length > 0 ? (
              invitedMembers.map((member, index) => (
                <React.Fragment key={member.email}>
                  {index > 0 && <div className="border-t"></div>}
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <User className="h-6 w-6" />
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-800">{member.email}</p>
                        <p className="text-sm text-gray-500">{formatRole(member.role)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm px-2 py-1 bg-amber-100 text-amber-700 rounded">Pending</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveInvitee(member.email)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </React.Fragment>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No team members invited yet</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg"
      >
        <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
        <p className="text-sm text-blue-700">
          You can invite more team members after completing the onboarding process from the Team section in your dashboard.
        </p>
      </motion.div>
      
      <motion.div variants={itemVariants} className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
        <Button
          variant="outline"
          onClick={handleBack}
          className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10 w-full sm:w-auto"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        
        <Button
          onClick={handleContinue}
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium w-full sm:w-auto"
        >
          Continue
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Team;
