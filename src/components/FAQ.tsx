
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Kepli and how does it work?",
    answer:
      "Kepli is a customer communication platform that helps businesses manage all their customer conversations in one place. It integrates with multiple channels like email, chat, social media, and more to provide a unified inbox and customer view.",
  },
  {
    question: "How does the multichannel messaging work?",
    answer:
      "Kepli connects to all your communication channels (email, live chat, social media, SMS, etc.) and brings all messages into one unified inbox. Your team can respond to customers from any channel without switching between different tools.",
  },
  {
    question: "Is Kepli suitable for my business size?",
    answer:
      "Yes! Kepli offers flexible plans designed for businesses of all sizes - from small startups to large enterprises. Our pricing scales based on your needs, and you can upgrade or downgrade at any time.",
  },
  {
    question: "How secure is my customer data with Kepli?",
    answer:
      "We take security seriously. Kepli uses bank-level encryption, regular security audits, and strict access controls. We're GDPR compliant and follow industry best practices for data protection.",
  },
  {
    question: "Can I try Kepli before committing?",
    answer:
      "Absolutely! All our plans come with a 14-day free trial that gives you full access to the platform's features. No credit card is required to start your trial.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="bg-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-3xl font-bold text-kepli-darkGray md:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-kepli-gray">
          Everything you need to know about Kepli
        </p>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                <AccordionTrigger className="text-left text-lg font-medium text-kepli-darkGray py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-kepli-gray pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-kepli-gray">
            Don't see your question here?{" "}
            <a
              href="#contact"
              className="font-medium text-kepli-purple hover:underline"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
