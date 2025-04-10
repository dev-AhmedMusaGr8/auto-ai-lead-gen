
import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  DollarSign, 
  LogOut, 
  Menu, 
  X,
  Calendar,
  ListTodo,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024 && window.innerHeight > window.innerWidth;
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/signin");
    }

    // Set sidebar collapsed by default on tablet portrait mode
    if (isTablet) {
      setSidebarCollapsed(true);
    }

    // Listen for orientation changes
    const handleResize = () => {
      const isTabletPortrait = window.innerWidth >= 768 && window.innerWidth <= 1024 && window.innerHeight > window.innerWidth;
      if (isTabletPortrait) {
        setSidebarCollapsed(true);
      } else if (window.innerWidth > 1024) {
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/signin");
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar */}
      <div className="md:hidden">
        <div className="fixed inset-0 z-40 flex">
          <div
            className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setSidebarOpen(false)}
          ></div>

          <div
            className={`relative flex-1 flex flex-col max-w-xs w-full bg-[#1A1F2C] transition ease-in-out duration-300 transform ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4 mb-6">
                <div className="bg-[#6366F1] p-1 rounded-lg mr-2">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="6" fill="#6366F1" />
                    <path d="M7.5 7.5H12.5L16.5 12L12.5 16.5H7.5V7.5Z" fill="white" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">AutoCRMAI</span>
              </div>
              <nav className="mt-5 px-2 space-y-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2.5 text-base font-medium rounded-md ${
                      window.location.pathname === item.href
                        ? "bg-[#2D3748] text-white"
                        : "text-gray-300 hover:bg-[#2D3748] hover:text-white"
                    }`}
                  >
                    <item.icon className="mr-4 h-5 w-5" />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 border-t border-gray-700 p-4">
              <div className="space-y-2">
                <a href="#settings" className="group flex items-center px-3 py-2.5 text-base font-medium rounded-md text-gray-300 hover:bg-[#2D3748] hover:text-white">
                  <Settings className="mr-4 h-5 w-5" />
                  Settings
                </a>
                <a href="#help" className="group flex items-center px-3 py-2.5 text-base font-medium rounded-md text-gray-300 hover:bg-[#2D3748] hover:text-white">
                  <HelpCircle className="mr-4 h-5 w-5" />
                  Help & Support
                </a>
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full flex items-center text-gray-300 border-gray-600 hover:bg-transparent hover:text-white hover:border-white"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className={`hidden md:flex md:flex-shrink-0 transition-all duration-300 ${sidebarCollapsed ? 'md:w-20' : 'md:w-64'}`}>
        <div className="flex flex-col w-full">
          <div className="flex flex-col h-0 flex-1 bg-[#1A1F2C]">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-[#1A1F2C] justify-between">
              {!sidebarCollapsed && (
                <>
                  <div className="flex items-center">
                    <div className="bg-[#6366F1] p-1 rounded-lg mr-2">
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="6" fill="#6366F1" />
                        <path d="M7.5 7.5H12.5L16.5 12L12.5 16.5H7.5V7.5Z" fill="white" />
                      </svg>
                    </div>
                    <span className="text-xl font-bold text-white">AutoCRMAI</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleSidebarCollapse}
                    className="text-gray-300 hover:text-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </>
              )}
              {sidebarCollapsed && (
                <div className="flex justify-center w-full">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleSidebarCollapse}
                    className="text-gray-300 hover:text-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md ${
                      window.location.pathname === item.href
                        ? "bg-[#2D3748] text-white"
                        : "text-gray-300 hover:bg-[#2D3748] hover:text-white"
                    } ${sidebarCollapsed ? 'justify-center' : ''}`}
                  >
                    <item.icon className={`${sidebarCollapsed ? '' : 'mr-3'} h-5 w-5`} />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </a>
                ))}
              </nav>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-shrink-0 border-t border-gray-700 p-4">
                <div className="space-y-2">
                  <a href="#settings" className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-[#2D3748] hover:text-white">
                    <Settings className="mr-3 h-5 w-5" />
                    Settings
                  </a>
                  <a href="#help" className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-[#2D3748] hover:text-white">
                    <HelpCircle className="mr-3 h-5 w-5" />
                    Help & Support
                  </a>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 w-full flex items-center justify-center text-gray-300 border-gray-600 hover:bg-transparent hover:text-white hover:border-white"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="flex-shrink-0 border-t border-gray-700 p-4">
                <div className="space-y-2">
                  <a href="#settings" className="group flex items-center justify-center px-3 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-[#2D3748] hover:text-white">
                    <Settings className="h-5 w-5" />
                  </a>
                  <a href="#help" className="group flex items-center justify-center px-3 py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-[#2D3748] hover:text-white">
                    <HelpCircle className="h-5 w-5" />
                  </a>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 w-full flex items-center justify-center text-gray-300 border-gray-600 hover:bg-transparent hover:text-white hover:border-white"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`flex flex-col w-0 flex-1 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="ml-2">
            <div className="bg-[#6366F1] p-1 rounded-lg">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="6" fill="#6366F1" />
                <path d="M7.5 7.5H12.5L16.5 12L12.5 16.5H7.5V7.5Z" fill="white" />
              </svg>
            </div>
          </div>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Navigation items
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Calendar", href: "#calendar", icon: Calendar },
  { name: "Task List", href: "#tasklist", icon: ListTodo },
  { name: "Deals", href: "/deals", icon: DollarSign },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Companies", href: "/companies", icon: Building2 },
];

export default DashboardLayout;
