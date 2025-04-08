
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
          ? "bg-white shadow-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <a href="/" className="flex items-center">
          <span className="text-2xl font-bold text-kepli-darkGray flex items-center">
            <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="6" fill="#6366F1" />
              <path d="M7.5 7.5H12.5L16.5 12L12.5 16.5H7.5V7.5Z" fill="white" />
            </svg>
            AutoCRMAI
          </span>
        </a>
        
        <div className="hidden gap-6 md:flex">
          <a 
            href="#features"
            className="font-medium text-kepli-gray hover:text-kepli-purple"
          >
            Features
          </a>
          <a 
            href="#solutions"
            className="font-medium text-kepli-gray hover:text-kepli-purple"
          >
            Solutions
          </a>
          <a 
            href="#pricing"
            className="font-medium text-kepli-gray hover:text-kepli-purple"
          >
            Pricing
          </a>
          <a 
            href="#resources"
            className="font-medium text-kepli-gray hover:text-kepli-purple"
          >
            Resources
          </a>
        </div>
        
        <div className="hidden items-center gap-4 md:flex">
          <a 
            href="#" 
            className="font-medium text-kepli-gray hover:text-kepli-purple"
          >
            Login
          </a>
          <Button 
            className="bg-kepli-purple hover:bg-kepli-darkPurple text-white rounded-lg"
          >
            Sign Up Free
          </Button>
        </div>
        
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="text-kepli-darkGray" size={24} />
          ) : (
            <Menu className="text-kepli-darkGray" size={24} />
          )}
        </button>
      </div>
      
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 bg-white px-4 py-6 shadow-md md:hidden">
          <div className="flex flex-col space-y-4">
            <a href="#features" className="font-medium text-kepli-darkGray" onClick={() => setMobileMenuOpen(false)}>
              Features
            </a>
            <a href="#solutions" className="font-medium text-kepli-darkGray" onClick={() => setMobileMenuOpen(false)}>
              Solutions
            </a>
            <a href="#pricing" className="font-medium text-kepli-darkGray" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </a>
            <a href="#resources" className="font-medium text-kepli-darkGray" onClick={() => setMobileMenuOpen(false)}>
              Resources
            </a>
            <div className="flex flex-col gap-2 border-t border-gray-200 pt-2">
              <a href="#" className="font-medium text-kepli-darkGray">
                Login
              </a>
              <Button className="bg-kepli-purple hover:bg-kepli-darkPurple text-white w-full">
                Sign Up Free
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
