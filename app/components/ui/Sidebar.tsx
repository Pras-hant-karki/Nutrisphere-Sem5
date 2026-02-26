import React from 'react'
import {
  HomeIcon,
  ActivityIcon,
  CalendarIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
} from 'lucide-react'
export function Sidebar() {
  const navItems = [
    {
      name: 'Home',
      icon: HomeIcon,
      active: true,
    },
    {
      name: 'Fitness Post',
      icon: ActivityIcon,
      active: false,
    },
    {
      name: 'Appointment',
      icon: CalendarIcon,
      active: false,
    },
    {
      name: 'Profile',
      icon: UserIcon,
      active: false,
    },
  ]
  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-[#111118] border-r border-white/5 flex flex-col z-50">
      {/* User Profile Section */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-4 mb-1">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/20">
            P
          </div>
          <div>
            <h3 className="font-bold text-white text-lg leading-tight">
              Prashant
            </h3>
            <span className="text-xs font-medium text-orange-500 uppercase tracking-wider">
              Premium Member
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.name}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${item.active ? 'bg-orange-500/10 text-orange-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <item.icon
              size={20}
              className={`transition-colors ${item.active ? 'text-orange-500' : 'text-gray-500 group-hover:text-white'}`}
            />
            <span className="font-medium">{item.name}</span>
            {item.active && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200">
          <SettingsIcon
            size={20}
            className="text-gray-500 group-hover:text-white"
          />
          <span className="font-medium">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-red-400 transition-all duration-200 group">
          <LogOutIcon
            size={20}
            className="text-gray-500 group-hover:text-red-400"
          />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  )
}
