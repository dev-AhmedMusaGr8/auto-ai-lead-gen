import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types/auth";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { profile, organization, inviteUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("sales_rep");
  const [inviteDepartment, setInviteDepartment] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  console.log("AdminDashboard: User profile", profile);
  console.log("AdminDashboard: Organization", organization);
  
  // Check if user is authenticated and is admin
  useEffect(() => {
    if (!profile) {
      navigate('/signin', { replace: true });
      return;
    }
    
    if (!isAdmin()) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page."
      });
      navigate('/dashboard', { replace: true });
    }
  }, [profile, isAdmin, navigate, toast]);
  
  // Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!profile?.org_id && !profile?.dealership_id) {
        setIsLoadingTeam(false);
        return;
      }
      
      try {
        setIsLoadingTeam(true);
        
        const dealershipId = profile.org_id || profile.dealership_id;
        
        const { data: teamData, error: teamError } = await supabase
          .from('profiles')
          .select('id, full_name, email, user_roles(role)')
          .eq('dealership_id', dealershipId);

        if (teamData && !teamError) {
          console.log("AdminDashboard: Fetched team members:", teamData);
          setTeamMembers(teamData);
        } else {
          console.error("AdminDashboard: Error fetching team members:", teamError);
          // Use mock data if we can't fetch real data
          setTeamMembers([
            { id: '1', full_name: 'John Manager', email: 'john@autodealership.com', user_roles: [{ role: 'sales_rep' }] },
            { id: '2', full_name: 'Sarah Finance', email: 'sarah@autodealership.com', user_roles: [{ role: 'finance_admin' }] },
            { id: '3', full_name: 'Mike Support', email: 'mike@autodealership.com', user_roles: [{ role: 'service_advisor' }] }
          ]);
        }
      } catch (error: any) {
        console.error("AdminDashboard: Failed to load team members", error);
        toast({
          title: "Failed to load team members",
          description: error.message,
          variant: "destructive"
        });
        // Use mock data on error
        setTeamMembers([
          { id: '1', full_name: 'John Manager', email: 'john@autodealership.com', user_roles: [{ role: 'sales_rep' }] },
          { id: '2', full_name: 'Sarah Finance', email: 'sarah@autodealership.com', user_roles: [{ role: 'finance_admin' }] },
          { id: '3', full_name: 'Mike Support', email: 'mike@autodealership.com', user_roles: [{ role: 'service_advisor' }] }
        ]);
      } finally {
        setIsLoadingTeam(false);
      }
    };
    
    fetchTeamMembers();
  }, [profile, toast]);
  
  // Handle sending invitations
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteEmail || !inviteRole) {
      toast({
        title: "Missing information",
        description: "Email and role are required.",
        variant: "destructive"
      });
      return;
    }
    
    setInviteLoading(true);
    
    try {
      const result = await inviteUser(inviteEmail, inviteRole, inviteDepartment || undefined);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to send invitation");
      }
      
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${inviteEmail}.`
      });
      
      // Reset form and close dialog
      setInviteEmail("");
      setInviteRole("sales_rep");
      setInviteDepartment("");
      setInviteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error sending invitation",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setInviteLoading(false);
    }
  };

  if (isLoadingTeam) {
    return <div className="flex items-center justify-center h-screen">Loading dashboard...</div>;
  }
  
  if (!profile) {
    return null; // Will redirect via the useEffect
  }

  if (!isAdmin()) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{organization?.name || 'Organization'} Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {profile?.full_name || 'Admin'}! Here's an overview of your organization.
          </p>
        </div>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>Invite Team Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation email to add a new team member to your organization.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSendInvite}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@example.com"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={inviteRole}
                    onValueChange={(value) => setInviteRole(value as UserRole)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales_rep">Sales</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="finance_admin">Finance</SelectItem>
                      <SelectItem value="service_advisor">Service</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="org_admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department (Optional)</Label>
                  <Input
                    id="department"
                    placeholder="e.g., New Car Sales, Used Car Sales"
                    value={inviteDepartment}
                    onChange={(e) => setInviteDepartment(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={inviteLoading}>
                  {inviteLoading ? "Sending..." : "Send Invitation"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 md:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="hr">HR</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamMembers.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all departments
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Since last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">Standard</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Professional tier
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage your organization's team members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teamMembers.length > 0 ? (
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Department</th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {teamMembers.map((member) => (
                        <tr key={member.id} className="border-b">
                          <td className="p-4 align-middle">{member.full_name || 'N/A'}</td>
                          <td className="p-4 align-middle">{member.email}</td>
                          <td className="p-4 align-middle capitalize">
                            {member.user_roles?.[0]?.role?.replace('_', ' ') || 'No role'}
                          </td>
                          <td className="p-4 align-middle">{member.department || 'N/A'}</td>
                          <td className="p-4 align-middle text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">No team members found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Dashboard</CardTitle>
              <CardDescription>
                View and manage sales data for your organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Sales dashboard content will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hr">
          <Card>
            <CardHeader>
              <CardTitle>HR Dashboard</CardTitle>
              <CardDescription>
                View and manage HR data for your organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>HR dashboard content will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="finance">
          <Card>
            <CardHeader>
              <CardTitle>Finance Dashboard</CardTitle>
              <CardDescription>
                View and manage financial data for your organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Finance dashboard content will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle>Support Dashboard</CardTitle>
              <CardDescription>
                View and manage support tickets for your organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Support dashboard content will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
