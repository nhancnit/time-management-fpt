"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Lightbulb,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
} from "lucide-react"
import type { User } from "@/lib/types"
import Image from "next/image"

interface SidebarProps {
  user: User
  activeTab: string
  onTabChange: (tab: string) => void
  onLogout: () => void
}

const menuItems = [
  { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { id: "schedule", label: "Lịch học", icon: Calendar },
  { id: "tasks", label: "Công việc", icon: BookOpen },
  { id: "fstore", label: "F-Store", icon: Store },
  { id: "tips", label: "Phương pháp học", icon: Lightbulb },
  { id: "materials", label: "Tài liệu", icon: FileText },
  { id: "settings", label: "Cài đặt", icon: Settings },
]

export function Sidebar({ user, activeTab, onTabChange, onLogout }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden text-foreground"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <Image src="/images/logo.png" alt="F-Timers Logo" width={48} height={48} className="rounded-full" />
              <div>
                <h2 className="font-bold text-foreground">F-Timers</h2>
                <p className="text-xs text-muted-foreground">Think Fast, Act Smart</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-secondary",
                  activeTab === item.id && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary",
                )}
                onClick={() => {
                  onTabChange(item.id)
                  setMobileOpen(false)
                }}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-semibold">{user.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.major}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
              onClick={onLogout}
            >
              <LogOut className="h-5 w-5" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
