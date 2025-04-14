
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Users
} from "lucide-react";
import { Contact } from "@/types/contacts";

interface ContactFormProps {
  onSubmit: (contact: Omit<Contact, "id">) => void;
  onCancel: () => void;
}

const ContactForm = ({ onSubmit, onCancel }: ContactFormProps) => {
  const [newContact, setNewContact] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    title: "",
    type: "Lead"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newContact);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <ScrollArea className="flex-grow px-6 py-4">
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
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-2 border-t bg-background sticky bottom-0">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
          Create Contact
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
