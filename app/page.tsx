"use client"

import { useState, useEffect } from "react"
import { OnboardingForm } from "@/components/onboarding-form"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { ScheduleView } from "@/components/schedule-view"
import { TaskManager } from "@/components/task-manager"
import { StudyTips } from "@/components/study-tips"
import { MaterialsManager } from "@/components/materials-manager"
import { Settings } from "@/components/settings"
import { NotificationSystem } from "@/components/notification-system"
import { FStore } from "@/components/fstore"
import { Leaderboard } from "@/components/leaderboard"
import type { User } from "@/lib/types"
import { storage } from "@/lib/store"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = storage.getUser()
    setUser(savedUser)
    setIsLoading(false)
  }, [])

  const handleLogout = async () => {
    storage.clearAll()
    await supabase.auth.signOut()
    setUser(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-muted rounded mb-4" />
          <div className="h-4 w-48 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <OnboardingForm onComplete={setUser} />
  }

  return (
    <div className="min-h-screen bg-background">
      <NotificationSystem />
      <Sidebar user={user} activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
      <main className="lg:ml-64 min-h-screen p-4 lg:p-8">
        <div className="max-w-6xl mx-auto pt-12 lg:pt-0">
          {activeTab === "dashboard" && <Dashboard user={user} />}
          {activeTab === "schedule" && <ScheduleView />}
          {activeTab === "tasks" && <TaskManager />}
          {activeTab === "fstore" && <FStore />}
          {activeTab === "leaderboard" && <Leaderboard user={user} />}
          {activeTab === "tips" && <StudyTips />}
          {activeTab === "materials" && <MaterialsManager />}
          {activeTab === "settings" && <Settings user={user} onUserUpdate={setUser} onLogout={handleLogout} />}
        </div>
      </main>
    </div>
  )
}
