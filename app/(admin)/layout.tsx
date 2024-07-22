'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const navItems = [
  { name: 'Главная', href: '/admin' },
  { name: 'Пользователи', href: '/admin/users' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white h-screen">
        <nav className="p-4">
          <ul>
            {navItems.map((item) => (
              <li
                key={item.name}
                className={pathname === item.href ? 'bg-gray-700' : ''}>
                <Link
                  href={item.href}
                  className="block p-2">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  )
}
