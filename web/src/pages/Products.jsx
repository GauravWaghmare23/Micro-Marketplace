import React, { useEffect, useState, useCallback } from 'react'
import api from '../api/axios'
import ProductCard from '../components/design/ProductCard'
import { motion } from 'framer-motion'

export default function Products() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const limit = 9

  const fetchList = useCallback(async (pageNum = page) => {
    setLoading(true)
    try {
      const { data } = await api.get('/products', { params: { q, page: pageNum, limit } })
      // adapt to backend payload
      setItems(data.products || data.items || [])
      setTotal(data.total || 0)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [q, page])

  useEffect(() => { fetchList(page) }, [page, fetchList])

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1 max-w-2xl">
          <motion.input
            whileFocus={{ scale: 1.01 }}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm focus:outline-none"
          />
        </div>
        <button onClick={() => { setPage(1); fetchList(1) }} className="px-4 py-2 bg-brand text-white rounded-xl">Search</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-white dark:bg-gray-800 rounded-xl animate-pulse" />
          ))
        ) : (
          items.map((p) => <ProductCard key={p._id} p={p} />)
        )}
      </div>

      <div className="mt-8 flex justify-center items-center gap-3">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-2 rounded-md bg-white dark:bg-gray-800">Prev</button>
        <div className="px-3 py-2">{page}</div>
        <button disabled={page * limit >= total} onClick={() => setPage((p) => p + 1)} className="px-3 py-2 rounded-md bg-white dark:bg-gray-800">Next</button>
      </div>
    </div>
  )
}
