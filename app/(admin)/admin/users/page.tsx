'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface User {
  id: number
  email: string
  name: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '' })

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    }

    fetchUsers()
  }, [])

  const handleDelete = async (id: number) => {
    if (confirm('Вы точно хотите удалить?')) {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id))
      } else {
        alert('Ошибка при удалении пользователя')
      }
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setFormData({ name: user.name || '', email: user.email })
    setIsDialogOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (!selectedUser) return

    const response = await fetch(`/api/users/${selectedUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? { ...user, ...formData } : user
        )
      )
      setIsDialogOpen(false)
    } else {
      alert('Ошибка при сохранении изменений')
    }
  }

  const closeModal = () => {
    setIsDialogOpen(false)
    setSelectedUser(null)
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Пользователи</h1>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className="flex justify-between items-center mb-2">
            <span>
              {user.email} - {user.name}
            </span>
            <div>
              <Button onClick={() => handleEdit(user)}>Редактировать</Button>
              <Button
                onClick={() => handleDelete(user.id)}
                className="ml-2">
                Удалить
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать пользователя</DialogTitle>
            </DialogHeader>
            <div>
              <label className="block mb-2">
                Имя:
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full mt-1"
                />
              </label>
              <label className="block mb-2">
                Email:
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full mt-1"
                />
              </label>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={closeModal}
                  className="mr-2">
                  Закрыть
                </Button>
                <Button onClick={handleSave}>Сохранить</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
