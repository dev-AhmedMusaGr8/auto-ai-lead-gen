
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "We'll be in touch with you shortly.",
      });
      setFormData({
        name: "",
        email: "",
        company: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-2 text-center text-3xl font-bold tracking-tight text-automotive-blue md:text-4xl">
            Ready to Transform Your Automotive Business?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-lg text-gray-600">
            Get in touch with our team to schedule a personalized demo
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  Your Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full"
                  placeholder="john@yourdealership.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="company" className="mb-2 block text-sm font-medium">
                Dealership / Company
              </label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="w-full"
                placeholder="Your Dealership Name"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full"
                placeholder="Tell us about your business needs"
              ></Textarea>
            </div>
            <div className="text-center">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="bg-automotive-accent hover:bg-automotive-accent/90"
              >
                {isSubmitting ? "Sending..." : "Request Demo"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
