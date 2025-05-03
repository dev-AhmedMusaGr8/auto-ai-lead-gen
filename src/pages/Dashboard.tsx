
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AIAssistant from "@/components/ai/AIAssistant";
import AISummaryCard from "@/components/ai/AISummaryCard";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { profile, isLoading } = useAuth();
  const navigate = useNavigate();
  const role = profile?.roles?.[0] || "admin";
  const [dealershipName, setDealershipName] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !profile) {
      navigate('/signin');
    }
  }, [profile, isLoading, navigate]);

  // Fetch dealership name when profile loads
  useEffect(() => {
    const fetchDealershipName = async () => {
      if (profile?.dealership_id) {
        const { data, error } = await supabase
          .from('dealerships')
          .select('name')
          .eq('id', profile.dealership_id)
          .single();
          
        if (data && !error) {
          setDealershipName(data.name);
        }
      }
    };

    if (profile) {
      fetchDealershipName();
    }
  }, [profile]);

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

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!profile) {
    return null; // Will redirect via the useEffect
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {currentConfig.title} {dealershipName ? `for ${dealershipName}` : ''}
      </h1>
      
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
      
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="bg-secondary/5 rounded-lg p-6 text-center">
          <p className="text-muted-foreground">Your recent activity will appear here.</p>
        </div>
      </div>
      
      {/* AI Assistant */}
      <AIAssistant role={currentConfig.assistantRole as any} />
    </div>
  );
};

export default Dashboard;
