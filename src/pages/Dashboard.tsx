
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Building2, TrendingUp, Search, Bell } from "lucide-react";
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
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("chart");

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-2.5 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-500 cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </div>
          <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(JSON.parse(localStorage.getItem("user") || '{"name":"User"}').name)}&background=8B5CF6&color=fff`} 
              alt="User" 
              className="h-full w-full object-cover"
            />
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

      <Card>
        <CardHeader className="pb-0">
          <Tabs defaultValue="chart" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="chart" className="flex-1 sm:flex-none">Chart Summary</TabsTrigger>
              <TabsTrigger value="activities" className="flex-1 sm:flex-none">Recent Activities</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-6">
          {activeTab === "chart" ? (
            <div className="h-[400px] w-full">
              <ChartContainer config={chartConfig}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="earning" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Deals</h3>
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
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Contacts</h3>
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
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
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
