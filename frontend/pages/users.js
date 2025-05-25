import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [me, setMe] = useState(null)
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'VIEW' })
  const router = useRouter()
  const [editingUser, setEditingUser] = useState(null)

  const fetchUsers = () => {
    fetch('http://localhost:3001/users', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized')
        return res.json()
      })
      .then(data => {
        setUsers(data.users)
        setMe(data.me)
      })
      .catch(() => router.push('/login'))
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreateUser = async (e) => {
    e.preventDefault()
    const res = await fetch('http://localhost:3001/users', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
    if (res.ok) {
      setNewUser({ name: '', email: '', password: '', role: 'VIEW' })
      fetchUsers()
    } else {
      alert('Failed to create user')
    }
  }

  const handleLogout = async () => {
    await fetch('http://localhost:3001/logout', {
      method: 'POST',
      credentials: 'include',
    })
    router.push('/login')
  }

  const handleUpdateUser = async () => {
    const res = await fetch(`http://localhost:3001/users/${editingUser.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingUser),
    })
    if (res.ok) {
      setEditingUser(null)
      fetchUsers()
    } else {
      alert('Failed to update user')
    }
  }

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return
    const res = await fetch(`http://localhost:3001/users/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (res.ok) fetchUsers()
    else alert('Delete failed')
  }

  return (
    <div className="container mt-5">
      <h2>User List</h2>
      <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>

      {me?.role === 'ADMIN' && (
        <form onSubmit={handleCreateUser} className="border p-3 mb-4">
          <h4>Add New User</h4>
          <div className="row mb-2">
            <div className="col">
              <input className="form-control" placeholder="Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
            </div>
            <div className="col">
              <input className="form-control" placeholder="Email" type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
            </div>
            <div className="col">
              <input className="form-control" placeholder="Password" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
            </div>
            <div className="col">
              <select className="form-select" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="VIEW">VIEW</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="col">
              <button type="submit" className="btn btn-primary w-100">Create</button>
            </div>
          </div>
        </form>
      )}

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {users.map(user => (
          editingUser?.id === user.id ? (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td><input className="form-control" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} /></td>
              <td><input className="form-control" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} /></td>
              <td>
                <select className="form-select" value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}>
                  <option value="VIEW">VIEW</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td>
                <button className="btn btn-sm btn-success me-2" onClick={handleUpdateUser}>Save</button>
                <button className="btn btn-sm btn-secondary" onClick={() => setEditingUser(null)}>Cancel</button>
              </td>
            </tr>
          ) : (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {me?.role === 'ADMIN' && (
                  <>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => setEditingUser(user)}>📝</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(user.id)}>🗑</button>
                  </>
                )}
              </td>
            </tr>
          )
        ))}
        </tbody>
      </table>
    </div>
  )
}