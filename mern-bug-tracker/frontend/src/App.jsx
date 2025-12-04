import React, { useEffect, useState } from 'react'
import axios from 'axios'

function BugForm({ onCreated }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/bugs', { title, description })
      onCreated(res.data)
      setTitle('')
      setDescription('')
    } catch (err) {
      console.error(err)
      alert('Failed to create bug')
    }
  }

  return (
    <form onSubmit={submit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <br />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <br />
      <button type="submit">Report Bug</button>
    </form>
  )
}

function BugList({ bugs, onDelete }) {
  if (!bugs || bugs.length === 0) return <div>No bugs reported</div>
  return (
    <ul>
      {bugs.map((b) => (
        <li key={b._id}>
          <strong>{b.title}</strong> - {b.status}
          <button onClick={() => onDelete(b._id)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}

export default function App() {
  const [bugs, setBugs] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get('/api/bugs')
        setBugs(res.data)
      } catch (err) {
        console.error('Failed to load bugs', err)
      }
    }
    load()
  }, [])

  const handleCreate = (bug) => setBugs((s) => [bug, ...s])
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/bugs/${id}`)
      setBugs((s) => s.filter((b) => b._id !== id))
    } catch (err) {
      console.error(err)
      alert('Delete failed')
    }
  }

  return (
    <div>
      <h1>MERN Bug Tracker</h1>
      <BugForm onCreated={handleCreate} />
      <hr />
      <BugList bugs={bugs} onDelete={handleDelete} />
    </div>
  )
}
