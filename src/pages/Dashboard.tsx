
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth";
import AIAssistant from "@/components/ai/AIAssistant";
import AISummaryCard from "@/components/ai/AISummaryCard";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle, ClipboardList, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Dashboard = () => {
  const { profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const role = profile?.roles?.[0] || "admin";
  const [dealershipName, setDealershipName] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !profile) {
      console.log("No profile found, redirecting to signin");
      navigate('/signin');
    }
  }, [profile, isLoading, navigate]);

  // Fetch dealership name when profile loads
  useEffect(() => {
    const fetchDealershipData = async () => {
      if (profile?.dealership_id) {
        try {
          setIsLoadingData(true);
          
          // Fetch dealership name
          const { data: dealershipData, error: dealershipError } = await supabase
            .from('dealerships')
            .select('name')
            .eq('id', profile.dealership_id)
            .single();
            
          if (dealershipData && !dealershipError) {
            setDealershipName(dealershipData.name);
            console.log("Fetched dealership name:", dealershipData.name);
          } else {
            console.error("Error fetching dealership name:", dealershipError);
          }

          // Fetch team members if admin
          if (role === 'admin') {
            const { data: teamData, error: teamError } = await supabase
              .from('profiles')
              .select('id, full_name, email, user_roles(role)')
              .eq('dealership_id', profile.dealership_id);

            if (teamData && !teamError) {
              setTeamMembers(teamData);
              console.log("Fetched team members:", teamData.length);
            } else {
              console.error("Error fetching team members:", teamError);
            }
          }
        } catch (error) {
          console.error("Error in fetch operations:", error);
        } finally {
          setIsLoadingData(false);
        }
      }
    };

    if (profile) {
      fetchDealershipData();
    }
  }, [profile, role]);

  const roleConfigurations = {
    sales_rep: {
      title: "Sales Dashboard",
      insights: ["leads", "sales", "inventory", "customers"],
      assistantRole: "sales"
    },
    service_advisor: {
      title: "Service Dashboard",
      insights: ["service", "customers"],
      assistantRole: "service"
    },
    finance_admin: {
      title: "Finance Dashboard",
      insights: ["sales", "customers"],
      assistantRole: "finance"
    },
    marketing: {
      title: "Marketing Dashboard",
      insights: ["leads", "customers"],
      assistantRole: "marketing"
    },
    admin: {
      title: "Admin Dashboard",
      insights: ["leads", "sales", "service", "inventory", "customers"],
      assistantRole: "admin"
    },
    manager: {
      title: "Manager Dashboard",
      insights: ["leads", "sales", "service", "inventory"],
      assistantRole: "admin"
    }
  };

  const currentConfig = roleConfigurations[role as keyof typeof roleConfigurations] || roleConfigurations.admin;

  const renderAdminDashboard = () => {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all departments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground mt-1">
                Sales, Service, Finance, Marketing
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">
                No pending invites
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Team Members</h2>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <PlusCircle size={16} />
              <span>Invite Team Member</span>
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {teamMembers && teamMembers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member: any) => (
                      <TableRow key={member.id}>
                        <TableCell>{member.full_name || 'Unnamed User'}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          {member.user_roles?.[0]?.role || 'No role assigned'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  {isLoadingData ? 'Loading team members...' : 'No team members found'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </>
    );
  };

  const renderRoleDashboard = () => {
    return (
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">AI-Powered Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentConfig.insights.map((insight) => (
            <AISummaryCard 
              key={insight} 
              type={insight as any} 
              title={`${insight.charAt(0).toUpperCase() + insight.slice(1)} Insights`}
            />
          ))}
        </div>
      </div>
    );
  };

  if (isLoading || isLoadingData) {
    return <div className="flex items-center justify-center h-screen">Loading dashboard...</div>;
  }

  if (!profile) {
    return null; // Will redirect via the useEffect
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {currentConfig.title} {dealershipName ? `for ${dealershipName}` : ''}
      </h1>
      
      {role === 'admin' ? renderAdminDashboard() : renderRoleDashboard()}
      
      {role !== 'admin' && (
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="bg-secondary/5 rounded-lg p-6 text-center">
            <p className="text-muted-foreground">Your recent activity will appear here.</p>
          </div>
        </div>
      )}
      
      {/* AI Assistant */}
      <AIAssistant role={currentConfig.assistantRole as any} />
    </div>
  );
};

export default Dashboard;
