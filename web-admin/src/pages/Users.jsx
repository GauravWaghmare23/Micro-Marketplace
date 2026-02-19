import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { useUIStore } from '../context/store';
import { usersAPI } from '../api/admin';
import { showToast } from '../components/Toast';

export function Users() {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null, userName: '' });

  const limit = 20;

  useEffect(() => {
    fetchUsers();
  }, [page, searchQuery]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await usersAPI.listUsers(page, limit, searchQuery);
      setUsers(response.data.users);
      setTotal(response.data.total);
    } catch (error) {
      showToast('Failed to fetch users', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await usersAPI.deleteUser(deleteModal.userId);
      showToast('User deleted successfully', 'success');
      setDeleteModal({ isOpen: false, userId: null, userName: '' });
      setPage(1);
      fetchUsers();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-dark-900">
      <Header />
      <Sidebar isOpen={isSidebarOpen} />

      <main className={`pt-20 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-0'}`}>
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-dark-100">Users Management</h2>
              <span className="text-dark-400">Total: {total}</span>
            </div>

            <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="bg-dark-800 p-8 rounded-lg border border-dark-700 text-center">
                <p className="text-dark-400">No users found</p>
              </div>
            ) : (
              <>
                <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-dark-700 bg-dark-700">
                          <th className="px-6 py-3 text-left text-sm font-semibold text-dark-300">Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-dark-300">Email</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-dark-300">Role</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-dark-300">Joined</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-dark-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <motion.tr
                            key={user._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-b border-dark-700 hover:bg-dark-700 transition-colors"
                          >
                            <td className="px-6 py-4 text-dark-100">{user.name}</td>
                            <td className="px-6 py-4 text-dark-300 text-sm">{user.email}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                user.role === 'admin'
                                  ? 'bg-purple-900 text-purple-200'
                                  : 'bg-blue-900 text-blue-200'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-dark-400 text-sm">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() =>
                                  setDeleteModal({
                                    isOpen: true,
                                    userId: user._id,
                                    userName: user.name
                                  })
                                }
                              >
                                Delete
                              </Button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-dark-400 text-sm">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </main>

      <Modal
        isOpen={deleteModal.isOpen}
        title="Delete User"
        onClose={() => setDeleteModal({ isOpen: false, userId: null, userName: '' })}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, userId: null, userName: '' })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteUser}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-dark-300">
          Are you sure you want to delete user <strong>{deleteModal.userName}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
