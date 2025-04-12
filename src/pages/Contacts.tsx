
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown,
  Phone,
  Mail,
  Building,
  Star,
  User,
  Briefcase,
  Users
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for contacts
const initialContacts = [
  { id: 1, name: 'John Smith', company: 'ABC Motors', email: 'john@abcmotors.com', phone: '(555) 123-4567', title: 'Sales Manager', type: 'Customer' },
  { id: 2, name: 'Sarah Johnson', company: 'XYZ Dealerships', email: 'sarah@xyzdealerships.com', phone: '(555) 234-5678', title: 'Owner', type: 'Customer' },
  { id: 3, name: 'Michael Brown', company: 'City Auto Group', email: 'michael@cityauto.com', phone: '(555) 345-6789', title: 'Marketing Director', type: 'Lead' },
  { id: 4, name: 'Lisa Davis', company: 'FastLane Auto', email: 'lisa@fastlaneauto.com', phone: '(555) 456-7890', title: 'CEO', type: 'Partner' },
  { id: 5, name: 'David Wilson', company: 'Prestige Autos', email: 'david@prestigeautos.com', phone: '(555) 567-8901', title: 'Operations Manager', type: 'Customer' },
  { id: 6, name: 'Emily Taylor', company: 'Metro Car Sales', email: 'emily@metrocarsales.com', phone: '(555) 678-9012', title: 'Sales Representative', type: 'Lead' },
  { id: 7, name: 'Robert Johnson', company: 'Valley Motors', email: 'robert@valleymotors.com', phone: '(555) 789-0123', title: 'Service Manager', type: 'Customer' },
  { id: 8, name: 'Jennifer Adams', company: 'Highway Dealerships', email: 'jennifer@highwaydealerships.com', phone: '(555) 890-1234', title: 'CFO', type: 'Partner' },
];

const Contacts = () => {
  const [contacts, setContacts] = useState(initialContacts);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    title: "",
    type: "Lead"
  });

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(search.toLowerCase()) || 
                          contact.email.toLowerCase().includes(search.toLowerCase()) ||
                          contact.company.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || contact.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setContacts([
      ...contacts,
      {
        id: contacts.length + 1,
        name: newContact.name,
        company: newContact.company,
        email: newContact.email,
        phone: newContact.phone,
        title: newContact.title,
        type: newContact.type
      }
    ]);
    setNewContact({
      name: "",
      company: "",
      email: "",
      phone: "",
      title: "",
      type: "Lead"
    });
    setOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
              <Plus className="mr-2 h-4 w-4" /> Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <ScrollArea className="flex-grow px-6 py-4 max-h-[60vh]">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input 
                        id="name" 
                        className="pl-10"
                        value={newContact.name} 
                        onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input 
                        id="email" 
                        type="email"
                        className="pl-10"
                        value={newContact.email} 
                        onChange={(e) => setNewContact({...newContact, email: e.target.value})}
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
                        value={newContact.phone} 
                        onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input 
                        id="company" 
                        className="pl-10"
                        value={newContact.company} 
                        onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input 
                        id="title" 
                        className="pl-10"
                        value={newContact.title} 
                        onChange={(e) => setNewContact({...newContact, title: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Contact Type</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 text-gray-500 h-4 w-4 z-10" />
                      <Select 
                        value={newContact.type}
                        onValueChange={(value) => setNewContact({...newContact, type: value})}
                        required
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Lead">Lead</SelectItem>
                          <SelectItem value="Customer">Customer</SelectItem>
                          <SelectItem value="Partner">Partner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
                  Create Contact
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36 bg-white">
              <div className="flex items-center">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Filter" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Lead">Leads</SelectItem>
              <SelectItem value="Customer">Customers</SelectItem>
              <SelectItem value="Partner">Partners</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-36 bg-white">
            <ArrowUpDown size={16} className="mr-2" /> Sort
          </Button>
        </div>
      </div>

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
            {filteredContacts.map((contact) => (
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
    </div>
  );
};

function getTypeColor(type) {
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

export default Contacts;
