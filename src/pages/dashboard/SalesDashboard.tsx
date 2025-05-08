
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const SalesDashboard = () => {
  const { profile } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [leadStats, setLeadStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      if (!profile?.org_id) return;

      try {
        setIsLoading(true);
        
        // For demonstration purposes - in a real app we'd fetch actual leads
        // This is just a stub showing how it would work with our schema
        setLeads([
          { id: '1', name: 'John Doe', email: 'john@example.com', phone: '555-1234', status: 'new' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-5678', status: 'contacted' },
          { id: '3', name: 'Bob Johnson', email: 'bob@example.com', phone: '555-9012', status: 'qualified' }
        ]);
        
        // Calculate lead statistics
        setLeadStats({
          total: 3,
          new: 1,
          contacted: 1,
          qualified: 1
        });
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeads();
  }, [profile?.org_id]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sales Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All leads
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.new}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Not contacted yet
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.contacted}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Initial contact made
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Qualified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadStats.qualified}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready for sale
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>
            Latest potential customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin h-6 w-6 border-2 rounded-full border-t-transparent"></div>
            </div>
          ) : leads.length > 0 ? (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Phone</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b">
                      <td className="p-4 align-middle font-medium">{lead.name}</td>
                      <td className="p-4 align-middle">{lead.email}</td>
                      <td className="p-4 align-middle">{lead.phone}</td>
                      <td className="p-4 align-middle capitalize">{lead.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-4">
              <p className="text-muted-foreground">No leads found. Start adding new leads!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDashboard;
