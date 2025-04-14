
import { Phone, Mail, Building, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Contact } from "@/types/contacts";

interface ContactTableProps {
  contacts: Contact[];
}

const ContactTable = ({ contacts }: ContactTableProps) => {
  function getTypeColor(type: string) {
    switch (type) {
      case 'Lead':
        return 'bg-blue-100 text-blue-800';
      case 'Customer':
        return 'bg-green-100 text-green-800';
      case 'Partner':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  return (
    <div className="bg-white rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Phone</TableHead>
            <TableHead className="hidden md:table-cell">Company</TableHead>
            <TableHead className="hidden lg:table-cell">Title</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id} className="hover:bg-gray-50 cursor-pointer">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex-shrink-0 flex items-center justify-center text-[#8B5CF6]">
                    {contact.name.charAt(0)}
                  </div>
                  {contact.name}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400 hidden sm:block" />
                  <span>{contact.email}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{contact.phone}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{contact.company}</span>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">{contact.title}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(contact.type)}`}>
                  {contact.type}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContactTable;
