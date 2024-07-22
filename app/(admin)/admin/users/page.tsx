'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface User {
  id: string
  email: string
  name: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    }

    fetchUsers()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm('Вы точно хотите удалить?')) {
      await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })
      setUsers(users.filter((user) => user.id !== id))
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
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
              <p>ID пользователя: {selectedUser.id}</p>
              <p>Email: {selectedUser.email}</p>
              <p>Имя: {selectedUser.name}</p>
              {/* Добавьте поля для редактирования пользователя */}
              <Button
                onClick={closeModal}
                className="mt-4">
                Закрыть
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
