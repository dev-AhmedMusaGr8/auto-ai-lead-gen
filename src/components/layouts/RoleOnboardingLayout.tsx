
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const RoleOnboardingLayout = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  if (!profile) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="py-4 px-6 border-b bg-white">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="6" fill="#6366F1" />
                <path d="M7.5 7.5H12.5L16.5 12L12.5 16.5H7.5V7.5Z" fill="white" />
              </svg>
              <span className="text-xl font-bold text-gray-800">AutoCRMAI</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-xl shadow-sm"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default RoleOnboardingLayout;
