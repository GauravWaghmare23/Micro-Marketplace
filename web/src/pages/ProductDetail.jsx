import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import api from '../api/axios'

export default function ProductDetail(){
  const {id} = useParams();
  const [p,setP]=useState(null);
  useEffect(()=>{api.get(`/products/${id}`).then(r=>setP(r.data))},[id]);
  if(!p) return <div>Loading...</div>
  return (
    <div className="max-w-2xl mx-auto bg-white p-4 rounded shadow">
      <img src={p.image} alt="" className="w-full h-64 object-cover rounded" />
      <h2 className="text-2xl mt-2">{p.title}</h2>
      <p className="text-gray-700 mt-2">{p.description}</p>
      <p className="mt-2 font-bold">${p.price}</p>
    </div>
  )
}
