
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Globe, Users, MapPin, Phone, Building, FileText } from "lucide-react";
import { useState } from "react";
import { Company } from "@/types/companies";

interface CompanyFormProps {
  onSubmit: (company: Omit<Company, "id">) => void;
  onCancel: () => void;
}

const CompanyForm = ({ onSubmit, onCancel }: CompanyFormProps) => {
  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "Dealership",
    website: "",
    employees: "10-50",
    location: "",
    phone: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newCompany);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <ScrollArea className="flex-grow px-6 py-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="name"
                className="pl-10"
                value={newCompany.name}
                onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 text-gray-500 h-4 w-4 z-10" />
              <Select
                value={newCompany.industry}
                onValueChange={(value) => setNewCompany({...newCompany, industry: value})}
                required
              >
                <SelectTrigger className="pl-10">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="website"
                className="pl-10"
                value={newCompany.website}
                onChange={(e) => setNewCompany({...newCompany, website: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employees">Number of Employees</Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 text-gray-500 h-4 w-4 z-10" />
              <Select
                value={newCompany.employees}
                onValueChange={(value) => setNewCompany({...newCompany, employees: value})}
                required
              >
                <SelectTrigger className="pl-10">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="location"
                className="pl-10"
                value={newCompany.location}
                onChange={(e) => setNewCompany({...newCompany, location: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="phone"
                className="pl-10"
                value={newCompany.phone}
                onChange={(e) => setNewCompany({...newCompany, phone: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-500 h-4 w-4" />
              <Textarea
                id="description"
                className="pl-10 pt-2"
                value={newCompany.description}
                onChange={(e) => setNewCompany({...newCompany, description: e.target.value})}
                rows={3}
                required
              />
            </div>
          </div>
        </div>
      </ScrollArea>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
          Create Company
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CompanyForm;
