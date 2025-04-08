
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    stars: 5,
    quote: "AutoCRMAI has transformed how we handle customer leads. The AI-powered recommendations have increased our conversion rate by 35%.",
    author: "Michael Rodriguez",
    title: "Sales Manager, AutoWorld Dealership",
  },
  {
    stars: 5,
    quote: "The inventory integration lets us match customers with vehicles instantly. Our satisfaction rates have increased significantly since implementation.",
    author: "Sarah Chen",
    title: "Marketing Director, LuxCars",
  },
  {
    stars: 5,
    quote: "The automation tools have streamlined our follow-up process and freed up our sales team to focus on what matters most - selling cars.",
    author: "David Thompson",
    title: "Operations Manager, City Motors",
  },
  {
    stars: 5,
    quote: "Implementing AutoCRMAI was seamless. The customer support team guided us every step of the way with automotive-specific knowledge.",
    author: "Emily Johnson",
    title: "IT Director, Premium Auto Group",
  },
  {
    stars: 5,
    quote: "The insights we get from the analytics dashboard help us make data-driven decisions about our inventory and marketing strategy.",
    author: "Alex Rivera",
    title: "Business Analyst, ValueDrive",
  },
  {
    stars: 5,
    quote: "AutoCRMAI is intuitive and user-friendly. Our sales team needed minimal training to get started and saw benefits right away.",
    author: "Jessica Williams",
    title: "Team Lead, AutoExcellence",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-white py-20" id="testimonials">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-3xl font-bold text-kepli-darkGray md:text-4xl">
          What Our Dealerships Are Saying
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-center text-kepli-gray">
          Trusted by automotive businesses nationwide
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="mb-3 flex">
                  {Array(testimonial.stars).fill(null).map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mb-4 text-kepli-darkGray">"{testimonial.quote}"</blockquote>
                <div>
                  <p className="font-semibold text-kepli-darkGray">{testimonial.author}</p>
                  <p className="text-sm text-kepli-gray">{testimonial.title}</p>
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
