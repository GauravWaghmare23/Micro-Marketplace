import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

export function Modal({ isOpen, title, children, onClose, actions, size = 'md' }) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`bg-dark-800 rounded-lg shadow-xl w-full ${sizes[size]}`}
            >
              <div className="flex items-center justify-between p-6 border-b border-dark-700">
                <h2 className="text-xl font-semibold text-dark-100">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-dark-400 hover:text-dark-100"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">{children}</div>
              {actions && (
                <div className="flex justify-end gap-3 p-6 border-t border-dark-700">
                  {actions}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
