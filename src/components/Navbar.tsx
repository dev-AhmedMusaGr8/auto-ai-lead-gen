
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <a href="/" className="flex items-center">
          <span 
            className={`text-2xl font-bold ${
              isScrolled ? "text-automotive-blue" : "text-white"
            }`}
          >
            AutoCRM<span className="text-automotive-lightBlue">AI</span>
          </span>
        </a>
        
        <div className="hidden gap-6 md:flex">
          <a 
            href="#features"
            className={`font-medium hover:text-automotive-lightBlue ${
              isScrolled ? "text-automotive-dark" : "text-white"
            }`}
          >
            Features
          </a>
          <a 
            href="#pricing"
            className={`font-medium hover:text-automotive-lightBlue ${
              isScrolled ? "text-automotive-dark" : "text-white"
            }`}
          >
            Pricing
          </a>
          <a 
            href="#faq"
            className={`font-medium hover:text-automotive-lightBlue ${
              isScrolled ? "text-automotive-dark" : "text-white"
            }`}
          >
            FAQ
          </a>
          <a 
            href="#contact"
            className={`font-medium hover:text-automotive-lightBlue ${
              isScrolled ? "text-automotive-dark" : "text-white"
            }`}
          >
            Contact
          </a>
        </div>
        
        <div className="hidden items-center gap-4 md:flex">
          <a 
            href="#" 
            className={`font-medium hover:text-automotive-lightBlue ${
              isScrolled ? "text-automotive-dark" : "text-white"
            }`}
          >
            Login
          </a>
          <Button 
            variant={isScrolled ? "default" : "outline"} 
            className={
              isScrolled 
                ? "bg-automotive-accent hover:bg-automotive-accent/90" 
                : "border-white text-white hover:bg-white/10"
            }
          >
            Get Started
          </Button>
        </div>
        
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className={isScrolled ? "text-automotive-blue" : "text-white"} size={24} />
          ) : (
            <Menu className={isScrolled ? "text-automotive-blue" : "text-white"} size={24} />
          )}
        </button>
      </div>
      
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 bg-white px-4 py-6 shadow-md md:hidden">
          <div className="flex flex-col space-y-4">
            <a href="#features" className="font-medium text-automotive-blue" onClick={() => setMobileMenuOpen(false)}>
              Features
            </a>
            <a href="#pricing" className="font-medium text-automotive-blue" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </a>
            <a href="#faq" className="font-medium text-automotive-blue" onClick={() => setMobileMenuOpen(false)}>
              FAQ
            </a>
            <a href="#contact" className="font-medium text-automotive-blue" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </a>
            <div className="flex flex-col gap-2 border-t border-gray-200 pt-2">
              <a href="#" className="font-medium text-automotive-blue">
                Login
              </a>
              <Button className="bg-automotive-accent hover:bg-automotive-accent/90 w-full">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
