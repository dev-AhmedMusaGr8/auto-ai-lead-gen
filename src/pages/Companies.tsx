import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CompanyFilter from "@/components/companies/CompanyFilter";
import CompanyForm from "@/components/companies/CompanyForm";
import CompanyCard from "@/components/companies/CompanyCard";
import { Company } from "@/types/companies";

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
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [open, setOpen] = useState(false);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase()) || 
                          company.location.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industryFilter === "all" || company.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  const handleSubmit = (newCompany: Omit<Company, "id">) => {
    setCompanies([
      ...companies,
      {
        id: companies.length + 1,
        ...newCompany
      }
    ]);
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
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
            </DialogHeader>
            <CompanyForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <CompanyFilter
        search={search}
        industryFilter={industryFilter}
        onSearchChange={setSearch}
        onIndustryFilterChange={setIndustryFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </div>
  );
};

export default Companies;
