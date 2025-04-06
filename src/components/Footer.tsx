
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-automotive-dark py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-bold">AutoCRMAI</h3>
            <p className="mb-4 text-sm text-gray-300">
              The industry's first AI-powered CRM designed specifically for
              automotive dealerships and service centers.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 hover:bg-white/20"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 hover:bg-white/20"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 hover:bg-white/20"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 hover:bg-white/20"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Solution</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#features" className="hover:text-white hover:underline">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white hover:underline">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline">
                  Updates
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline">
                  Careers
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline">
                  Partners
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white hover:underline">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white hover:underline">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} AutoCRMAI. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-6">
            <a href="#" className="hover:text-white hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white hover:underline">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
