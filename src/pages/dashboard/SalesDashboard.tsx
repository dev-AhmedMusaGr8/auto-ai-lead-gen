
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SalesDashboard = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch leads
  useEffect(() => {
    const fetchLeads = async () => {
      if (!profile?.org_id) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('org_id', profile.org_id);

        if (error) throw error;
        setLeads(data || []);

        // Set up real-time subscription for leads
        const channel = supabase
          .channel('public:leads')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'leads', filter: `org_id=eq.${profile.org_id}` }, 
            async (payload) => {
              // Refresh leads when changes occur
              const { data: refreshedData } = await supabase
                .from('leads')
                .select('*')
                .eq('org_id', profile.org_id);
              
              if (refreshedData) {
                setLeads(refreshedData);
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error: any) {
        toast({
          title: "Error fetching leads",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, [profile?.org_id, toast]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sales Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isLoading ? "Loading..." : `${leads.filter(l => l.status === 'new').length} new leads`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground mt-1">
              From new leads to deals
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              In negotiation phase
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>
            Latest leads added to your pipeline
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
                <thead>
                  <tr className="border-b">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Phone</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b">
                      <td className="p-4 align-middle">{lead.name}</td>
                      <td className="p-4 align-middle">{lead.email || 'N/A'}</td>
                      <td className="p-4 align-middle">{lead.phone || 'N/A'}</td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                          ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                            lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                            lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                            lead.status === 'lost' ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {lead.status || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-right">
                        {lead.value ? `$${lead.value.toLocaleString()}` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-4">
              <p className="text-muted-foreground">No leads found. Add your first lead to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDashboard;
