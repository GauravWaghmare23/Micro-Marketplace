import React, {useState} from 'react'
import api from '../api/axios'

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const submit = async e => {
    e.preventDefault();
    try{
      const {data} = await api.post('/auth/register', {name, email, password});
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    }catch(err){ setMsg(err.response?.data?.message || 'Registration failed') }
  }
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full p-2 border" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full p-2 border" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-green-600 text-white px-4 py-2">Register</button>
        {msg && <div className="text-red-600">{msg}</div>}
      </form>
    </div>
  )
}
