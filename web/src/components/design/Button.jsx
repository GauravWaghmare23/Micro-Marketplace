import React from 'react'
import { motion } from 'framer-motion'

export default function Button({ children, className = '', ...rest }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      className={`inline-flex items-center justify-center px-4 py-2 bg-brand text-white rounded-xl shadow-soft hover:brightness-95 focus:outline-none ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
