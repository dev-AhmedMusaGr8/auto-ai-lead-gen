
import { Card, CardContent } from "@/components/ui/card";
import { Company } from "@/types/companies";
import { Globe, MapPin, Phone, Users } from "lucide-react";

interface CompanyCardProps {
  company: Company;
}

function getIndustryColor(industry: string) {
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

const CompanyCard = ({ company }: CompanyCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
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
  );
};

export default CompanyCard;
