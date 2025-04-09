
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown,
  DollarSign,
  Calendar,
  User
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data for deals
const initialDeals = [
  { id: 1, name: 'Fleet Upgrade', company: 'ABC Motors', value: 75000, status: 'Negotiation', stage: 'Discovery', date: 'Apr 5, 2025' },
  { id: 2, name: 'Service Contract', company: 'XYZ Dealerships', value: 45000, status: 'Won', stage: 'Closed', date: 'Apr 4, 2025' },
  { id: 3, name: 'Software License', company: 'City Auto Group', value: 25000, status: 'Proposal', stage: 'Proposal', date: 'Apr 3, 2025' },
  { id: 4, name: 'Parts Supply', company: 'FastLane Auto', value: 35000, status: 'Lost', stage: 'Closed', date: 'Apr 2, 2025' },
  { id: 5, name: 'Marketing Campaign', company: 'Prestige Autos', value: 50000, status: 'Negotiation', stage: 'Negotiation', date: 'Apr 1, 2025' },
  { id: 6, name: 'CRM Implementation', company: 'Metro Car Sales', value: 120000, status: 'Qualified', stage: 'Qualification', date: 'Mar 31, 2025' },
  { id: 7, name: 'Training Program', company: 'Valley Motors', value: 15000, status: 'Proposal', stage: 'Proposal', date: 'Mar 30, 2025' },
  { id: 8, name: 'Consulting Services', company: 'Highway Dealerships', value: 65000, status: 'Discovery', stage: 'Discovery', date: 'Mar 29, 2025' },
];

const Deals = () => {
  const [deals, setDeals] = useState(initialDeals);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({
    name: "",
    company: "",
    value: "",
    status: "Qualified",
    stage: "Discovery",
    date: new Date().toISOString().split('T')[0]
  });

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.name.toLowerCase().includes(search.toLowerCase()) || 
                         deal.company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || deal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setDeals([
      ...deals,
      {
        id: deals.length + 1,
        name: newDeal.name,
        company: newDeal.company,
        value: parseInt(newDeal.value),
        status: newDeal.status,
        stage: newDeal.stage,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }
    ]);
    setNewDeal({
      name: "",
      company: "",
      value: "",
      status: "Qualified",
      stage: "Discovery",
      date: new Date().toISOString().split('T')[0]
    });
    setOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Deals</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
              <Plus className="mr-2 h-4 w-4" /> Add Deal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Deal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Deal Name</Label>
                <Input 
                  id="name" 
                  value={newDeal.name} 
                  onChange={(e) => setNewDeal({...newDeal, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  value={newDeal.company} 
                  onChange={(e) => setNewDeal({...newDeal, company: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Value ($)</Label>
                <Input 
                  id="value" 
                  type="number" 
                  value={newDeal.value} 
                  onChange={(e) => setNewDeal({...newDeal, value: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={newDeal.status}
                    onValueChange={(value) => setNewDeal({...newDeal, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Qualified">Qualified</SelectItem>
                      <SelectItem value="Discovery">Discovery</SelectItem>
                      <SelectItem value="Proposal">Proposal</SelectItem>
                      <SelectItem value="Negotiation">Negotiation</SelectItem>
                      <SelectItem value="Won">Won</SelectItem>
                      <SelectItem value="Lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stage">Stage</Label>
                  <Select 
                    value={newDeal.stage}
                    onValueChange={(value) => setNewDeal({...newDeal, stage: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Qualification">Qualification</SelectItem>
                      <SelectItem value="Discovery">Discovery</SelectItem>
                      <SelectItem value="Proposal">Proposal</SelectItem>
                      <SelectItem value="Negotiation">Negotiation</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
                  Create Deal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10"
            placeholder="Search deals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 bg-white">
              <div className="flex items-center">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Filter" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Qualified">Qualified</SelectItem>
              <SelectItem value="Discovery">Discovery</SelectItem>
              <SelectItem value="Proposal">Proposal</SelectItem>
              <SelectItem value="Negotiation">Negotiation</SelectItem>
              <SelectItem value="Won">Won</SelectItem>
              <SelectItem value="Lost">Lost</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-36 bg-white">
            <ArrowUpDown size={16} className="mr-2" /> Sort
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDeals.map((deal) => (
          <Card key={deal.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg truncate">{deal.name}</h3>
                  <p className="text-sm text-muted-foreground">{deal.company}</p>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                    {deal.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                  <span>${deal.value.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{deal.date}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span>John Smith</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
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
    case 'Discovery':
      return 'bg-indigo-100 text-indigo-800';
    case 'Qualified':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default Deals;
