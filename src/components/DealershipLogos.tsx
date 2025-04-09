
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const dealerships = [
  { name: "AutoNation", logo: "https://logo.clearbit.com/autonation.com" },
  { name: "CarMax", logo: "https://logo.clearbit.com/carmax.com" },
  { name: "Penske", logo: "https://logo.clearbit.com/penskeautomotive.com" },
  { name: "Group 1", logo: "https://logo.clearbit.com/group1auto.com" },
  { name: "Sonic", logo: "https://logo.clearbit.com/sonicautomotive.com" },
  { name: "Hendrick", logo: "https://logo.clearbit.com/hendrickauto.com" },
  { name: "Lithia", logo: "https://logo.clearbit.com/lithiamotors.com" },
  { name: "Autonovo", logo: "https://logo.clearbit.com/autonovo.com" },
];

const DealershipLogos = () => {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-kepli-gray mb-8 uppercase tracking-wider font-medium">
          Trusted by leading dealerships nationwide
        </p>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
            skipSnaps: true,
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="animate-slide">
            {dealerships.map((dealership, index) => (
              <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 pl-4">
                <div className="flex items-center justify-center p-4 opacity-80 hover:opacity-100 transition-opacity">
                  <img 
                    src={dealership.logo} 
                    alt={`${dealership.name} logo`} 
                    className="h-8 md:h-10 w-auto object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/150x50/eeeeee/444444?text=${dealership.name}`;
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default DealershipLogos;
