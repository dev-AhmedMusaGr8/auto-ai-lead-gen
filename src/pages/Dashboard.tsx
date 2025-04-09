
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Building2, TrendingUp } from "lucide-react";

const Dashboard = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome back, {JSON.parse(localStorage.getItem("user") || '{"name":"User"}').name}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Deals</CardTitle>
            <CardDescription>Latest deals that have been added</CardDescription>
          </CardHeader>
          <CardContent>
            {recentDeals.map((deal, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-800">{deal.name}</p>
                  <p className="text-sm text-gray-500">{deal.company}</p>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                    {deal.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">${deal.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{deal.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Contacts</CardTitle>
            <CardDescription>Latest contacts that have been added</CardDescription>
          </CardHeader>
          <CardContent>
            {recentContacts.map((contact, index) => (
              <div key={index} className="flex items-center py-2 border-b last:border-0">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center mr-3">
                  {contact.name.charAt(0)}
                </div>
                <div className="flex-grow">
                  <p className="font-medium text-gray-800">{contact.name}</p>
                  <p className="text-sm text-gray-500">{contact.company}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{contact.email}</p>
                  <p className="text-sm text-gray-500">{contact.phone}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
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
