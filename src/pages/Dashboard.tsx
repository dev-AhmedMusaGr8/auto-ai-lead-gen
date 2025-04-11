import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Building2, TrendingUp, Search, Bell, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, TooltipProps } from "recharts";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("chart");
  const [date, setDate] = useState<Date>(new Date());

  const chartData = [
    { name: "Jan", revenue: 8500, earning: 5600 },
    { name: "Feb", revenue: 7800, earning: 5200 },
    { name: "Mar", revenue: 9200, earning: 6100 },
    { name: "Apr", revenue: 8700, earning: 5800 },
    { name: "May", revenue: 7900, earning: 5300 },
    { name: "Jun", revenue: 9100, earning: 6000 },
    { name: "Jul", revenue: 10200, earning: 6800 },
    { name: "Aug", revenue: 9700, earning: 6400 },
    { name: "Sep", revenue: 9300, earning: 6200 },
    { name: "Oct", revenue: 8900, earning: 5900 },
    { name: "Nov", revenue: 9500, earning: 6300 },
    { name: "Dec", revenue: 10500, earning: 7000 },
  ];

  const chartConfig = {
    revenue: {
      label: "Total Revenue",
      theme: {
        light: "#e2e8f0",
        dark: "#e2e8f0",
      },
    },
    earning: {
      label: "Total Earning",
      theme: {
        light: "#8B5CF6",
        dark: "#8B5CF6",
      },
    },
  };

  return (
    <div className="overflow-x-hidden">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="bg-gray-100 rounded-full p-2 flex items-center transition-all group-hover:w-48 w-10 duration-300">
              <Search className="h-5 w-5 text-gray-400 absolute left-2.5" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 bg-transparent w-full focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
          <div className="relative bg-gray-100 rounded-full p-2">
            <Bell className="h-5 w-5 text-gray-500 cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </div>
          <div className="bg-gray-100 rounded-full p-1">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(JSON.parse(localStorage.getItem("user") || '{"name":"User"}').name)}&background=8B5CF6&color=fff`} 
                alt="User"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard 
          title="Total Deals" 
          value="42" 
          description="6 new this month" 
          icon={<DollarSign className="h-6 w-6 text-emerald-500" />}
          trend="+12%"
        />
        <DashboardCard 
          title="Active Deals" 
          value="28" 
          description="4 closing soon" 
          icon={<TrendingUp className="h-6 w-6 text-blue-500" />}
          trend="+5%"
        />
        <DashboardCard 
          title="Contacts" 
          value="156" 
          description="12 new this month" 
          icon={<Users className="h-6 w-6 text-purple-500" />}
          trend="+8%"
        />
        <DashboardCard 
          title="Companies" 
          value="64" 
          description="3 new this month" 
          icon={<Building2 className="h-6 w-6 text-indigo-500" />}
          trend="+4%"
        />
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="pb-0 flex flex-col md:flex-row md:items-center md:justify-between">
          <Tabs defaultValue="chart" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full sm:w-auto bg-transparent p-0 h-auto space-x-6 mb-4">
              <TabsTrigger value="chart" className="flex-1 sm:flex-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:rounded-none px-0">Chart Summary</TabsTrigger>
              <TabsTrigger value="activities" className="flex-1 sm:flex-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:rounded-none px-0">Recent Activities</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="md:ml-auto flex items-center mb-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="border border-gray-200 flex items-center h-9 rounded-md">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{format(date, "MMMM yyyy")}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {activeTab === "chart" ? (
            <div className="flex flex-col w-full">
              <div className="h-[400px] w-full">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="revenue" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="earning" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="mt-4 flex justify-center">
                <div className="flex gap-6">
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-gray-300 rounded mr-2"></div>
                    <span className="text-sm">Total Revenue</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-purple-500 rounded mr-2"></div>
                    <span className="text-sm">Total Earning</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border rounded-lg shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">Recent Deals</CardTitle>
                    <div className="text-sm text-gray-500">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 border border-gray-200">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                            <span className="text-xs">{format(date, "MMM yyyy")}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={(date) => date && setDate(date)}
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentDeals.map((deal, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-800">{deal.name}</p>
                              <p className="text-sm text-gray-500">{deal.company}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                              {deal.status}
                            </span>
                          </TableCell>
                          <TableCell>${deal.value.toLocaleString()}</TableCell>
                          <TableCell>{deal.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card className="border rounded-lg shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">Recent Contacts</CardTitle>
                    <div className="text-sm text-gray-500">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 border border-gray-200">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                            <span className="text-xs">{format(date, "MMM yyyy")}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={(date) => date && setDate(date)}
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>S/N</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentContacts.map((contact, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center mr-3">
                                {contact.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{contact.name}</p>
                                <p className="text-sm text-gray-500">{contact.company}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>{contact.phone}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-lg text-sm">
        <p className="font-medium">{label}</p>
        <p className="text-purple-600">
          <span className="font-semibold">Revenue:</span> ${payload[0].value.toLocaleString()}
        </p>
        <p className="text-blue-600">
          <span className="font-semibold">Earning:</span> ${payload[1].value.toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
};

const DashboardCard = ({ title, value, description, icon, trend }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <div>
            {icon}
          </div>
        </div>
        <div className="mt-2 text-sm font-medium text-emerald-600">
          {trend}
        </div>
      </CardContent>
    </Card>
  );
};

function getStatusColor(status) {
  switch (status) {
    case 'Won':
      return 'bg-green-100 text-green-800';
    case 'Lost':
      return 'bg-red-100 text-red-800';
    case 'Negotiation':
      return 'bg-amber-100 text-amber-800';
    case 'Proposal':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

const recentDeals = [
  { name: 'Fleet Upgrade', company: 'ABC Motors', value: 75000, status: 'Negotiation', date: 'Apr 5, 2025' },
  { name: 'Service Contract', company: 'XYZ Dealerships', value: 45000, status: 'Won', date: 'Apr 4, 2025' },
  { name: 'Software License', company: 'City Auto Group', value: 25000, status: 'Proposal', date: 'Apr 3, 2025' },
  { name: 'Parts Supply', company: 'FastLane Auto', value: 35000, status: 'Lost', date: 'Apr 2, 2025' },
];

const recentContacts = [
  { name: 'John Smith', company: 'ABC Motors', email: 'john@abcmotors.com', phone: '(555) 123-4567' },
  { name: 'Sarah Johnson', company: 'XYZ Dealerships', email: 'sarah@xyzdealerships.com', phone: '(555) 234-5678' },
  { name: 'Michael Brown', company: 'City Auto Group', email: 'michael@cityauto.com', phone: '(555) 345-6789' },
  { name: 'Lisa Davis', company: 'FastLane Auto', email: 'lisa@fastlaneauto.com', phone: '(555) 456-7890' },
];

export default Dashboard;
