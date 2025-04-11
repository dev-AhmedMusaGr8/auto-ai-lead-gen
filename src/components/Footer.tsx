
import { Facebook, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white py-12 px-4 md:px-8 lg:px-16 xl:px-24">
      <div className="container mx-auto max-w-[1920px]">
        <div className="bg-kepli-darkBlue rounded-2xl py-12 px-6 md:px-10 lg:px-16">
          <div className="grid gap-8 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="flex items-center">
                <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="6" fill="#6366F1" />
                  <path d="M7.5 7.5H12.5L16.5 12L12.5 16.5H7.5V7.5Z" fill="white" />
                </svg>
                <span className="text-2xl font-bold text-white">Kepli</span>
              </div>
              <p className="mt-4 text-sm text-gray-300 max-w-xs">
                The all-in-one customer communication platform that helps businesses deliver exceptional experiences across every channel.
              </p>
              <div className="mt-6 flex space-x-4">
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
                  {/* Modern X (Twitter) Logo */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
                  </svg>
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
              <h4 className="mb-4 font-semibold text-white">Product</h4>
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
              <h4 className="mb-4 font-semibold text-white">Company</h4>
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
              <h4 className="mb-4 font-semibold text-white">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white hover:underline">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:underline">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:underline">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white hover:underline">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8 text-sm text-gray-400">
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
              <p>© {new Date().getFullYear()} Kepli. All rights reserved.</p>
              <div className="flex space-x-6">
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
