
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
    <section id="contact" className="bg-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-3xl font-bold text-kepli-darkGray md:text-4xl">
          Get in Touch with Us
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-center text-kepli-gray">
          Have questions or ready to get started? Our team is here to help!
        </p>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-kepli-darkGray">
                  Your Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border-gray-200"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-kepli-darkGray">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border-gray-200"
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label htmlFor="company" className="mb-2 block text-sm font-medium text-kepli-darkGray">
                  Company
                </label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full border-gray-200"
                  placeholder="Your Company"
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-kepli-darkGray">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border-gray-200"
                  placeholder="How can we help you?"
                ></Textarea>
              </div>
              <div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-kepli-purple hover:bg-kepli-darkPurple text-white"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </div>

          <div className="flex items-center justify-center">
            <div className="max-w-md">
              <h3 className="mb-4 text-2xl font-bold text-kepli-darkGray">
                Let's Connect
              </h3>
              <p className="mb-6 text-kepli-gray">
                Our team is ready to answer your questions and help you get the most out of Kepli. Reach out to us anytime.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-kepli-purple/10 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-kepli-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-kepli-gray">Email</p>
                    <p className="font-medium text-kepli-darkGray">hello@kepli.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-kepli-purple/10 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-kepli-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-kepli-gray">Phone</p>
                    <p className="font-medium text-kepli-darkGray">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="rounded-full bg-kepli-purple/10 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-kepli-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-kepli-gray">Location</p>
                    <p className="font-medium text-kepli-darkGray">San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
