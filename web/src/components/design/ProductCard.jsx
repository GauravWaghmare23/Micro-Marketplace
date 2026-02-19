import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'
import { AiFillHeart } from 'react-icons/ai'
import api from '../../api/axios'

export default function ProductCard({ p, onToggle }) {
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('favs') || '[]')
      setLiked(favs.includes(p._id))
    } catch (e) {}
  }, [p._id])

  const toggle = async () => {
    if (!localStorage.getItem('token')) return (window.location.href = '/login')

    try {
      if (!liked) {
        await api.post(`/favorites/${p._id}`)
        // persist locally for quick UI toggle
        const favs = JSON.parse(localStorage.getItem('favs') || '[]')
        if (!favs.includes(p._id)) favs.push(p._id)
        localStorage.setItem('favs', JSON.stringify(favs))
        setLiked(true)
      } else {
        await api.delete(`/favorites/${p._id}`)
        const favs = JSON.parse(localStorage.getItem('favs') || '[]')
        const updated = favs.filter((id) => id !== p._id)
        localStorage.setItem('favs', JSON.stringify(updated))
        setLiked(false)
      }
      onToggle && onToggle()
    } catch (e) {
      console.error('Failed to toggle favorite', e)
    }
  }

  return (
    <motion.article whileHover={{ y: -6 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-soft overflow-hidden">
      <div className="relative">
        <Link to={`/products/${p._id}`}>
          <motion.img
            layout
            src={p.image}
            alt={p.title}
            className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </Link>
        <button
          onClick={toggle}
          aria-label="favorite"
          aria-pressed={liked}
          className={`absolute right-3 top-3 p-2 rounded-full bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm`}
        >
          {liked ? (
            <AiFillHeart className="text-red-600" />
          ) : (
            <FiHeart className="text-red-400 opacity-70" />
          )}
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{p.title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">${p.price}</div>
          <Link to={`/products/${p._id}`} className="text-sm text-brand hover:underline">View</Link>
        </div>
      </div>
    </motion.article>
  )
}
