
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown,
  Globe,
  Users,
  MapPin,
  Phone
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
import { Card, CardContent } from "@/components/ui/card";

// Mock data for companies
const initialCompanies = [
  { 
    id: 1, 
    name: 'ABC Motors', 
    industry: 'Dealership', 
    website: 'www.abcmotors.com', 
    employees: '50-100', 
    location: 'New York, NY', 
    phone: '(555) 123-4567',
    description: 'Leading automotive dealership in the Northeast region.'
  },
  { 
    id: 2, 
    name: 'XYZ Dealerships', 
    industry: 'Dealership', 
    website: 'www.xyzdealerships.com', 
    employees: '100-250', 
    location: 'Los Angeles, CA', 
    phone: '(555) 234-5678',
    description: 'Multi-location dealership group specializing in luxury vehicles.'
  },
  { 
    id: 3, 
    name: 'City Auto Group', 
    industry: 'Dealership', 
    website: 'www.cityautogroup.com', 
    employees: '50-100', 
    location: 'Chicago, IL', 
    phone: '(555) 345-6789',
    description: 'Family-owned dealership group serving the Midwest for over 30 years.'
  },
  { 
    id: 4, 
    name: 'FastLane Auto', 
    industry: 'Service', 
    website: 'www.fastlaneauto.com', 
    employees: '10-50', 
    location: 'Miami, FL', 
    phone: '(555) 456-7890',
    description: 'Automotive service and parts provider with quick turnaround times.'
  },
  { 
    id: 5, 
    name: 'Prestige Autos', 
    industry: 'Dealership', 
    website: 'www.prestigeautos.com', 
    employees: '10-50', 
    location: 'Dallas, TX', 
    phone: '(555) 567-8901',
    description: 'Exclusive luxury vehicle dealership with premium service offerings.'
  },
  { 
    id: 6, 
    name: 'Metro Car Sales', 
    industry: 'Dealership', 
    website: 'www.metrocarsales.com', 
    employees: '10-50', 
    location: 'Philadelphia, PA', 
    phone: '(555) 678-9012',
    description: 'Urban dealership focusing on compact and economical vehicles.'
  },
  { 
    id: 7, 
    name: 'Valley Motors', 
    industry: 'Dealership', 
    website: 'www.valleymotors.com', 
    employees: '10-50', 
    location: 'Phoenix, AZ', 
    phone: '(555) 789-0123',
    description: 'Southwest dealership specializing in trucks and SUVs.'
  },
  { 
    id: 8, 
    name: 'Highway Dealerships', 
    industry: 'Dealership', 
    website: 'www.highwaydealerships.com', 
    employees: '250+', 
    location: 'Atlanta, GA', 
    phone: '(555) 890-1234',
    description: 'Large automotive group with multiple locations across the Southeast.'
  },
];

const Companies = () => {
  const [companies, setCompanies] = useState(initialCompanies);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "Dealership",
    website: "",
    employees: "10-50",
    location: "",
    phone: "",
    description: ""
  });

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase()) || 
                          company.location.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industryFilter === "all" || company.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setCompanies([
      ...companies,
      {
        id: companies.length + 1,
        name: newCompany.name,
        industry: newCompany.industry,
        website: newCompany.website,
        employees: newCompany.employees,
        location: newCompany.location,
        phone: newCompany.phone,
        description: newCompany.description
      }
    ]);
    setNewCompany({
      name: "",
      industry: "Dealership",
      website: "",
      employees: "10-50",
      location: "",
      phone: "",
      description: ""
    });
    setOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Companies</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
              <Plus className="mr-2 h-4 w-4" /> Add Company
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input 
                  id="name" 
                  value={newCompany.name} 
                  onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select 
                  value={newCompany.industry}
                  onValueChange={(value) => setNewCompany({...newCompany, industry: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dealership">Dealership</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                    <SelectItem value="Parts">Parts</SelectItem>
                    <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  value={newCompany.website} 
                  onChange={(e) => setNewCompany({...newCompany, website: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employees">Number of Employees</Label>
                <Select 
                  value={newCompany.employees}
                  onValueChange={(value) => setNewCompany({...newCompany, employees: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10</SelectItem>
                    <SelectItem value="10-50">10-50</SelectItem>
                    <SelectItem value="50-100">50-100</SelectItem>
                    <SelectItem value="100-250">100-250</SelectItem>
                    <SelectItem value="250+">250+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={newCompany.location} 
                  onChange={(e) => setNewCompany({...newCompany, location: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={newCompany.phone} 
                  onChange={(e) => setNewCompany({...newCompany, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newCompany.description} 
                  onChange={(e) => setNewCompany({...newCompany, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="pt-4 flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
                  Create Company
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
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-36 bg-white">
              <div className="flex items-center">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Filter" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Dealership">Dealership</SelectItem>
              <SelectItem value="Service">Service</SelectItem>
              <SelectItem value="Parts">Parts</SelectItem>
              <SelectItem value="Manufacturer">Manufacturer</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-36 bg-white">
            <ArrowUpDown size={16} className="mr-2" /> Sort
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg truncate w-3/4">{company.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getIndustryColor(company.industry)}`}>
                    {company.industry}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{company.description}</p>
              </div>
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{company.website}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{company.location}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{company.phone}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{company.employees} employees</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

function getIndustryColor(industry) {
  switch (industry) {
    case 'Dealership':
      return 'bg-blue-100 text-blue-800';
    case 'Service':
      return 'bg-green-100 text-green-800';
    case 'Parts':
      return 'bg-amber-100 text-amber-800';
    case 'Manufacturer':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default Companies;
