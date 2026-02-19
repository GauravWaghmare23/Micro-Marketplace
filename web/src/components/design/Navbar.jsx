import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ThemeContext } from './ThemeProvider'
import { FiMenu, FiSun, FiMoon, FiHeart, FiSearch } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const { theme, toggle } = useContext(ThemeContext)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed w-full z-40 transition-all backdrop-blur-sm ${scrolled ? 'bg-white/80 dark:bg-gray-900/75 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg tracking-wide">Micro Marketplace</Link>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 gap-2">
            <FiSearch className="text-gray-500" />
            <input placeholder="Search products" className="bg-transparent outline-none text-sm w-48" />
          </div>
          <Link to="/favorites" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            <FiHeart />
          </Link>
          <button onClick={toggle} aria-label="Toggle theme" className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>
          <button className="p-2 rounded-md sm:hidden">
            <FiMenu />
          </button>
        </div>
      </div>
    </motion.header>
  )
}
