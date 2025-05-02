
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { 
  Home, Car, Users, Calendar, Settings, LogOut, 
  ClipboardList, Wrench, CreditCard, BarChart 
} from "lucide-react";

const RoleDashboardLayout = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const getRoleBasedNavItems = () => {
    const roleNavItems: { [key: string]: any[] } = {
      sales_rep: [
        { icon: <Home className="h-5 w-5" />, label: "Overview", path: "/dashboard" },
        { icon: <Car className="h-5 w-5" />, label: "Inventory", path: "/inventory" },
        { icon: <Users className="h-5 w-5" />, label: "Leads", path: "/leads" },
        { icon: <Calendar className="h-5 w-5" />, label: "Schedule", path: "/schedule" },
      ],
      service_advisor: [
        { icon: <Home className="h-5 w-5" />, label: "Overview", path: "/dashboard" },
        { icon: <Tool className="h-5 w-5" />, label: "Service", path: "/service" },
        { icon: <Calendar className="h-5 w-5" />, label: "Appointments", path: "/appointments" },
        { icon: <ClipboardList className="h-5 w-5" />, label: "Work Orders", path: "/work-orders" },
      ],
      finance_admin: [
        { icon: <Home className="h-5 w-5" />, label: "Overview", path: "/dashboard" },
        { icon: <CreditCard className="h-5 w-5" />, label: "Financing", path: "/financing" },
        { icon: <ClipboardList className="h-5 w-5" />, label: "Contracts", path: "/contracts" },
      ],
      marketing: [
        { icon: <Home className="h-5 w-5" />, label: "Overview", path: "/dashboard" },
        { icon: <BarChart className="h-5 w-5" />, label: "Campaigns", path: "/campaigns" },
        { icon: <Users className="h-5 w-5" />, label: "Leads", path: "/leads" },
      ],
      admin: [
        { icon: <Home className="h-5 w-5" />, label: "Overview", path: "/dashboard" },
        { icon: <Users className="h-5 w-5" />, label: "Team", path: "/team" },
        { icon: <Settings className="h-5 w-5" />, label: "Settings", path: "/settings" },
      ],
    };

    return profile?.roles?.[0] ? roleNavItems[profile.roles[0]] : [];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="6" fill="#6366F1" />
              <path d="M7.5 7.5H12.5L16.5 12L12.5 16.5H7.5V7.5Z" fill="white" />
            </svg>
            <span className="text-xl font-bold text-gray-800">AutoCRMAI</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {getRoleBasedNavItems().map((item, index) => (
              <li key={index}>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => signOut()}
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            {/* Add any header content here */}
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RoleDashboardLayout;
