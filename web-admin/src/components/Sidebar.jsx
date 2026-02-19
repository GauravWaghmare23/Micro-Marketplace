import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiUsers, FiBox, FiChevronLeft } from 'react-icons/fi';
import clsx from 'clsx';

const menuItems = [
  { label: 'Dashboard', href: '/', icon: <FiGrid /> },
  { label: 'Users', href: '/users', icon: <FiUsers /> },
  { label: 'Products', href: '/products', icon: <FiBox /> }
];

export function Sidebar({ isOpen }) {
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 72 }}
      className="fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r z-30 pt-16 overflow-hidden transition-width"
    >
      <div className="h-full flex flex-col justify-between">
        <div className="px-4 pb-2 flex items-center justify-between">
          <div className="text-lg font-bold text-dark-100">Micro Admin</div>
          <button aria-hidden className="p-1 rounded-md text-dark-300 hover:bg-dark-700">
            <FiChevronLeft />
          </button>
        </div>

        <nav className="px-2 py-6 space-y-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={clsx('flex items-center gap-3 px-3 py-2 rounded-lg transition-colors', {
                  'bg-blue-600 text-white': active,
                  'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800': !active
                })}
              >
                <div className="text-xl">{item.icon}</div>
                <span className={clsx('truncate', { 'hidden md:inline': !isOpen })}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <div className="text-xs text-gray-400 text-center">Micro Marketplace Admin</div>
        </div>
      </div>
    </motion.aside>
  );
}
