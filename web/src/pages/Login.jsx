import React, {useState} from 'react'
import api from '../api/axios'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const submit = async e => {
    e.preventDefault();
    try{
      const {data} = await api.post('/auth/login', {email, password});
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    }catch(err){
      // show detailed info for debugging server errors
      // eslint-disable-next-line no-console
      console.error('Login error', err);
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message || err.response?.data || err.message;
      setMsg(status ? `Error ${status}: ${serverMsg}` : serverMsg || 'Login failed');
    }
  }
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full p-2 border" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2">Login</button>
        {msg && <div className="text-red-600">{msg}</div>}
      </form>
    </div>
  )
}
