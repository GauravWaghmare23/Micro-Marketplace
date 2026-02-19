import { useEffect, useState } from 'react';
import { usersAPI, productsAPI } from '../api/admin';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useUIStore } from '../context/store';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function Dashboard() {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sample activity data for the last 7 days (used for chart)
  const chartData = [
    { day: 'Mon', users: 24, products: 40 },
    { day: 'Tue', users: 32, products: 45 },
    { day: 'Wed', users: 28, products: 50 },
    { day: 'Thu', users: 40, products: 55 },
    { day: 'Fri', users: 50, products: 60 },
    { day: 'Sat', users: 46, products: 58 },
    { day: 'Sun', users: 52, products: 62 }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersRes = await usersAPI.listUsers(1, 1);
        const productsRes = await productsAPI.listProducts(1, 1);

        setStats({
          totalUsers: usersRes.data.total,
          totalProducts: productsRes.data.total
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  // StatCard - small reusable stat card with optional sparkline
  function StatCard({ title, value, icon, children }) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-soft flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          </div>
          <div className="text-3xl text-gray-400">{icon}</div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      <Sidebar isOpen={isSidebarOpen} />

      <main style={{ paddingLeft: isSidebarOpen ? 256 : 72 }} className="pt-20 transition-all duration-300">
        <div className="p-6 max-w-7xl mx-auto">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-dark-100">Dashboard</motion.h2>

            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : (
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={<span className="text-2xl">👥</span>}>
                  <div className="mt-4 h-12">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="miniUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.06} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" hide />
                        <YAxis hide />
                        <Area type="monotone" dataKey="users" stroke="#60a5fa" fill="url(#miniUsers)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </StatCard>

                <StatCard title="Total Products" value={stats?.totalProducts || 0} icon={<span className="text-2xl">📦</span>} />

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-soft">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Activity (7d)</p>
                  <div className="mt-4 h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.04} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" tick={{ fill: '#9CA3AF' }} />
                        <YAxis tick={{ fill: '#9CA3AF' }} />
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
                        <Tooltip />
                        <Area type="monotone" dataKey="users" stroke="#60a5fa" fillOpacity={1} fill="url(#colorUsers)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="bg-dark-800 p-6 rounded-lg border border-dark-700">
              <h3 className="text-xl font-semibold text-dark-100 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href="/users" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center">Manage Users</a>
                <a href="/products" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center">Manage Products</a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
