import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import ProductCard from '../components/design/ProductCard'

export default function Favorites() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const { data } = await api.get('/favorites')
        // backend returns { items: [...] }
        if (mounted) setItems(data.items || [])
      } catch (e) {
        console.error('Failed to load favorites', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Favorites</h2>

      {loading ? (
        <div className="space-y-2">
          <div className="h-40 bg-white dark:bg-gray-800 rounded-xl animate-pulse" />
          <div className="h-40 bg-white dark:bg-gray-800 rounded-xl animate-pulse" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-gray-500">You have no favorite products yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <ProductCard key={p._id} p={p} onToggle={async () => {
              // refresh favorites after toggle
              try {
                const { data } = await api.get('/favorites')
                setItems(data.items || [])
              } catch (e) {
                console.error('Failed to refresh favorites', e)
              }
            }} />
          ))}
        </div>
      )}
    </div>
  )
}
