import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuthStore } from '../context/store';
import { authAPI } from '../api/admin';
import { showToast } from '../components/Toast';

export function Login() {
  const [email, setEmail] = useState('gauravwaghmare17384@gmail.com');
  const [password, setPassword] = useState('123456789');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;

      if (user.role !== 'admin') {
        showToast('Only admins can access this dashboard', 'error');
        return;
      }

      setAuth(user, token);
      showToast('Login successful!', 'success');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-dark-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-dark-800 rounded-lg shadow-2xl p-8 border border-dark-700">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center mb-2 text-dark-100"
          >
            Micro Admin
          </motion.h1>
          <p className="text-center text-dark-400 mb-8">Admin Dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="admin@example.com"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 p-4 bg-dark-700 rounded-lg border border-dark-600">
            <p className="text-sm text-dark-300 mb-2"><strong>Demo Credentials:</strong></p>
            <p className="text-xs text-dark-400">Email: gauravwaghmare17384@gmail.com</p>
            <p className="text-xs text-dark-400">Password: 123456789</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
