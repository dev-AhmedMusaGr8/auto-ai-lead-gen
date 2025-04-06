
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the AI in AutoCRMAI work?",
    answer:
      "Our AI analyzes your customer data, market trends, and industry patterns to provide predictive insights and automate routine tasks. It learns from your business operations to become smarter and more tailored to your specific needs over time.",
  },
  {
    question: "Can I integrate AutoCRMAI with my DMS?",
    answer:
      "Yes, AutoCRMAI integrates seamlessly with most popular Dealer Management Systems, including CDK, Reynolds & Reynolds, Dealertrack, and more. Our team can help set up custom integrations for other systems if needed.",
  },
  {
    question: "Is my data secure with AutoCRMAI?",
    answer:
      "Absolutely. We implement bank-level encryption, regular security audits, and strict access controls. We're GDPR compliant and follow industry best practices for data protection. Your customers' information is always safe with us.",
  },
  {
    question: "How long does implementation take?",
    answer:
      "Most dealerships are up and running within 2-4 weeks. Our implementation team handles data migration, staff training, and system configuration. We have a proven onboarding process that ensures minimal disruption to your business.",
  },
  {
    question: "Do you offer training for my team?",
    answer:
      "Yes, all plans include comprehensive training sessions for your staff. Our Professional and Enterprise plans also include ongoing training resources and regular check-ins to ensure your team is maximizing the system's potential.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-3xl font-bold tracking-tight text-automotive-blue md:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-gray-600">
          Everything you need to know about AutoCRMAI
        </p>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium text-automotive-blue">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Don't see your question here?{" "}
            <a
              href="#contact"
              className="font-medium text-automotive-lightBlue hover:underline"
            >
              Contact our team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
