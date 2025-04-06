
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "AutoCRMAI has completely transformed how we manage customer relationships. The predictive insights have helped us increase our sales by 27% in just three months.",
    author: "Michael Rodriguez",
    title: "General Manager, Premium AutoGroup",
  },
  {
    quote: "The service scheduling feature has eliminated double bookings and reduced our no-shows by 42%. It's like having an extra service advisor without the overhead.",
    author: "Sarah Chen",
    title: "Service Director, Pacific Motors",
  },
  {
    quote: "The AI-powered lead scoring has been a game-changer for our sales team. We're focusing on the right prospects at the right time, and our conversion rate has never been higher.",
    author: "David Thompson",
    title: "Sales Director, Eastside Automotive",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-automotive-blue py-20 text-white">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-3xl font-bold tracking-tight md:text-4xl">
          Trusted by Industry Leaders
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-center text-lg opacity-80">
          Hear what automotive professionals have to say about AutoCRMAI
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white/10 border-none">
              <CardContent className="p-6">
                <blockquote className="mb-4 text-lg italic">"{testimonial.quote}"</blockquote>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm opacity-80">{testimonial.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
