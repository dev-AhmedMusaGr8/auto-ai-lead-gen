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
import ContactTable from "@/components/contacts/ContactTable";
import ContactForm from "@/components/contacts/ContactForm";
import ContactFilter from "@/components/contacts/ContactFilter";
import { Contact } from "@/types/contacts";

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
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [open, setOpen] = useState(false);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(search.toLowerCase()) || 
                          contact.email.toLowerCase().includes(search.toLowerCase()) ||
                          contact.company.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || contact.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSubmit = (newContact: Omit<Contact, "id">) => {
    setContacts([
      ...contacts,
      {
        id: contacts.length + 1,
        ...newContact
      }
    ]);
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <ContactForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <ContactFilter
        search={search}
        typeFilter={typeFilter}
        onSearchChange={setSearch}
        onTypeFilterChange={setTypeFilter}
      />

      <ContactTable contacts={filteredContacts} />
    </div>
  );
};

export default Contacts;
