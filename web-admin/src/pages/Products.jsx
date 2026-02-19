import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { useUIStore } from '../context/store';
import { productsAPI } from '../api/admin';
import { showToast } from '../components/Toast';

export function Products() {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [editModal, setEditModal] = useState({ isOpen: false, product: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productTitle: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editData, setEditData] = useState({});

  const limit = 20;

  useEffect(() => {
    fetchProducts();
  }, [page, searchQuery]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productsAPI.listProducts(page, limit, searchQuery);
      setProducts(response.data.products);
      setTotal(response.data.total);
    } catch (error) {
      showToast('Failed to fetch products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEdit = (product) => {
    setEditModal({ isOpen: true, product });
    setEditData({
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.image
    });
  };

  const handleSaveEdit = async () => {
    setEditLoading(true);
    try {
      await productsAPI.updateProduct(editModal.product._id, editData);
      showToast('Product updated successfully', 'success');
      setEditModal({ isOpen: false, product: null });
      fetchProducts();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update product', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await productsAPI.deleteProduct(deleteModal.productId);
      showToast('Product deleted successfully', 'success');
      setDeleteModal({ isOpen: false, productId: null, productTitle: '' });
      setPage(1);
      fetchProducts();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete product', 'error');
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
              <h2 className="text-3xl font-bold text-dark-100">Products Management</h2>
              <span className="text-dark-400">Total: {total}</span>
            </div>

            <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
              <Input
                placeholder="Search by title or description..."
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
            ) : products.length === 0 ? (
              <div className="bg-dark-800 p-8 rounded-lg border border-dark-700 text-center">
                <p className="text-dark-400">No products found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden hover:border-blue-600"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-dark-100 mb-1 truncate">{product.title}</h3>
                        <p className="text-sm text-dark-400 mb-2 line-clamp-2">{product.description}</p>
                        <p className="text-lg font-bold text-green-600 mb-4">${product.price}</p>
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleOpenEdit(product)}
                            className="flex-1"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                productId: product._id,
                                productTitle: product.title
                              })
                            }
                            className="flex-1"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
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
        isOpen={editModal.isOpen}
        title="Edit Product"
        onClose={() => setEditModal({ isOpen: false, product: null })}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setEditModal({ isOpen: false, product: null })}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveEdit} isLoading={editLoading}>
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={editData.title || ''}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          />
          <Input
            label="Price"
            type="number"
            step="0.01"
            value={editData.price || ''}
            onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
          />
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1">Description</label>
            <textarea
              value={editData.description || ''}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              rows="4"
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Input
            label="Image URL"
            type="url"
            value={editData.image || ''}
            onChange={(e) => setEditData({ ...editData, image: e.target.value })}
          />
        </div>
      </Modal>

      <Modal
        isOpen={deleteModal.isOpen}
        title="Delete Product"
        onClose={() => setDeleteModal({ isOpen: false, productId: null, productTitle: '' })}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, productId: null, productTitle: '' })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-dark-300">
          Are you sure you want to delete product <strong>{deleteModal.productTitle}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
