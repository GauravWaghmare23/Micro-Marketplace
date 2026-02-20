import { motion } from 'framer-motion';
import { useAuthStore, useUIStore } from '../context/store';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/admin';
import { FiMenu, FiChevronDown, FiSun, FiMoon, FiUser } from 'react-icons/fi';
import { useState } from 'react';

export function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const toggleDarkMode = useUIStore((state) => state.toggleDarkMode);
  const isDarkMode = useUIStore((state) => state.isDarkMode);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // ignore
    }
    logout();
    navigate('/login');
  };

  return (
    <motion.header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b z-40 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
          <FiMenu />
        </button>
        <h1 className="text-lg font-semibold">Micro Admin</h1>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={toggleDarkMode} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
          {isDarkMode ? <FiSun /> : <FiMoon />}
        </button>

        <div className="relative">
          {user ? (
            <>
              <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <FiUser />
                <span className="text-sm">{user?.email?.split('@')[0] || 'Admin'}</span>
                <FiChevronDown />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2">
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                </div>
              )}
            </>
          ) : (
            <button onClick={() => navigate('/login')} className="px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">Login</button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
