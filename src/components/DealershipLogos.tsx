
import { useEffect } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const dealerships = [
  { name: "AutoNation", logo: "https://via.placeholder.com/150x50/eeeeee/444444?text=AutoNation" },
  { name: "CarMax", logo: "https://via.placeholder.com/150x50/eeeeee/444444?text=CarMax" },
  { name: "Penske", logo: "https://via.placeholder.com/150x50/eeeeee/444444?text=Penske" },
  { name: "Group 1", logo: "https://via.placeholder.com/150x50/eeeeee/444444?text=Group+1" },
  { name: "Sonic", logo: "https://via.placeholder.com/150x50/eeeeee/444444?text=Sonic" },
  { name: "Hendrick", logo: "https://via.placeholder.com/150x50/eeeeee/444444?text=Hendrick" },
  { name: "Lithia", logo: "https://via.placeholder.com/150x50/eeeeee/444444?text=Lithia" },
  { name: "Autonovo", logo: "https://via.placeholder.com/150x50/eeeeee/444444?text=Autonovo" },
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
