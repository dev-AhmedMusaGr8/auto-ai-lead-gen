
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, ArrowUpDown } from "lucide-react";

interface CompanyFilterProps {
  search: string;
  industryFilter: string;
  onSearchChange: (value: string) => void;
  onIndustryFilterChange: (value: string) => void;
}

const CompanyFilter = ({
  search,
  industryFilter,
  onSearchChange,
  onIndustryFilterChange,
}: CompanyFilterProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          className="pl-10"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select value={industryFilter} onValueChange={onIndustryFilterChange}>
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
  );
};

export default CompanyFilter;
