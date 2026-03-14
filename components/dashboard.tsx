"use client"

import { useMemo, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, Target, TrendingUp, Bell, Calendar, Coins } from "lucide-react"
import type { Task, User, Subject } from "@/lib/types"
import { storage } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import { useFrogLevel } from "@/hooks/use-frog-level"
import { FrogAvatarModal } from "@/components/frog-avatar-modal"
import { LevelUpModal } from "@/components/level-up-modal"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"

interface DashboardProps {
  user: User
}

export function Dashboard({ user }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [fCoins, setFCoins] = useState(0)
  const [showAvatarModal, setShowAvatarModal] = useState(false)

  // Frog level system
  const {
    currentAvatarLevel,
    unlockedLevels,
    avatarImage,
    setAvatarLevel,
    nextLevelInfo,
    levelUpInfo,
    dismissLevelUp,
  } = useFrogLevel(fCoins)

  const { width, height } = useWindowSize()
  const [showWelcomeConfetti, setShowWelcomeConfetti] = useState(false)

  // Fire welcome confetti once per session when user visits the site
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome")
    if (!hasSeenWelcome) {
       setShowWelcomeConfetti(true)
       sessionStorage.setItem("hasSeenWelcome", "true")
       setTimeout(() => setShowWelcomeConfetti(false), 5000)
    }
  }, [])

  useEffect(() => {
    setTasks(storage.getTasks())
    setSubjects(storage.getSubjects())

    const fetchCoins = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const { data, error } = await supabase
            .from('profiles')
            .select('f_coins')
            .eq('id', session.user.id)
            .single()

          if (data && !error) {
            setFCoins(data.f_coins || 0)
            
            // Sync fallback to local storage
            const fstore = storage.getFStore()
            fstore.fCoins = data.f_coins || 0
            storage.setFStore(fstore)
          } else {
             // Fallback local if error
            const fstore = storage.getFStore()
            if (fstore) {
              setFCoins(fstore.fCoins)
            }
          }
        }
      } catch (err) {
        // Fallback local
        const fstore = storage.getFStore()
        if (fstore) {
          setFCoins(fstore.fCoins)
        }
      }
    }

    fetchCoins()
    
    // Listen for custom event emitted when user gets coins in TaskManager
    const handleCoinsUpdate = () => {
      const fstore = storage.getFStore()
      if (fstore) {
        setFCoins(fstore.fCoins)
      }
    }

    window.addEventListener('fcoins-updated', handleCoinsUpdate)

    return () => {
      window.removeEventListener('fcoins-updated', handleCoinsUpdate)
    }
  }, [])

  const today = new Date().toISOString().split("T")[0]

  const stats = useMemo(() => {
    const todayTasks = tasks.filter((t) => t.date === today)
    const completedToday = todayTasks.filter((t) => t.completed).length
    const greenTasks = tasks.filter((t) => t.type === "green").length
    const yellowTasks = tasks.filter((t) => t.type === "yellow").length
    const redTasks = tasks.filter((t) => t.type === "red").length

    return {
      todayTotal: todayTasks.length,
      completedToday,
      greenTasks,
      yellowTasks,
      redTasks,
      completionRate: todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0,
    }
  }, [tasks, today])

  const upcomingTasks = useMemo(() => {
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

    return tasks
      .filter((t) => t.date === today && !t.completed && t.startTime > currentTime)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .slice(0, 5)
  }, [tasks, today])

  const getTaskTypeColor = (type: Task["type"]) => {
    switch (type) {
      case "green":
        return "bg-[var(--color-task-green)]"
      case "yellow":
        return "bg-[var(--color-task-yellow)]"
      case "red":
        return "bg-[var(--color-task-red)]"
    }
  }

  const getSubjectColor = (subjectId?: string) => {
    if (!subjectId) return "#6b7280"
    const subject = subjects.find((s) => s.id === subjectId)
    return subject?.color || "#6b7280"
  }

  return (
    <div className="space-y-6">
      {/* Welcome Confetti */}
      {showWelcomeConfetti && (
        <Confetti
          width={width}
          height={height}
          colors={["#F27024", "#10B981", "#FF8C42", "#FFD700", "#3B82F6"]}
          numberOfPieces={300}
          recycle={false}
          gravity={0.12}
          style={{ position: 'fixed', zIndex: 99999, top: 0, left: 0 }}
        />
      )}

      {/* Level-Up Modal */}
      <LevelUpModal levelInfo={levelUpInfo} onDismiss={dismissLevelUp} />

      {/* Avatar Selection Modal */}
      <FrogAvatarModal
        open={showAvatarModal}
        onOpenChange={setShowAvatarModal}
        currentAvatarLevel={currentAvatarLevel}
        unlockedLevels={unlockedLevels}
        onSelectAvatar={(level) => {
          setAvatarLevel(level)
          setShowAvatarModal(false)
        }}
        nextLevelInfo={nextLevelInfo}
        fCoins={fCoins}
      />

      {/* Welcome with Frog Avatar */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Frog Level Avatar - Clickable */}
          <div
            className="relative cursor-pointer group"
            onClick={() => setShowAvatarModal(true)}
            title="Click để chọn avatar Cóc"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-[#F27024]/60 shadow-lg transition-all group-hover:border-[#F27024] group-hover:shadow-[0_0_20px_rgba(242,112,36,0.3)] group-hover:scale-105">
              <img
                src={avatarImage}
                alt={`Cóc Level ${currentAvatarLevel}`}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Level badge */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#F27024] border-2 border-background flex items-center justify-center">
              <span className="text-white text-xs font-bold">{currentAvatarLevel}</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Xin chào, {user.name.split(" ").pop()}!</h1>
            <p className="text-muted-foreground">Hãy cùng có một ngày học tập hiệu quả nhé!</p>
            <div className="flex items-center gap-2 mt-2">
              <Coins className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-foreground">{fCoins} F-Coins</span>
            </div>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-muted-foreground">Hôm nay</p>
          <p className="text-lg font-semibold text-foreground">
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.todayTotal}</p>
                <p className="text-xs text-muted-foreground">Công việc hôm nay</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--color-task-green)]/10 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-[var(--color-task-green)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completedToday}</p>
                <p className="text-xs text-muted-foreground">Đã hoàn thành</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.todayTotal - stats.completedToday}</p>
                <p className="text-xs text-muted-foreground">Còn lại</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completionRate}%</p>
                <p className="text-xs text-muted-foreground">Tỉ lệ hoàn thành</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Task Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Phân loại công việc
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--color-task-green)]" />
                  <span className="text-sm text-foreground">Hàng ngày (Xanh)</span>
                </div>
                <span className="text-sm font-medium text-foreground">{stats.greenTasks}</span>
              </div>
              <Progress
                value={tasks.length > 0 ? (stats.greenTasks / tasks.length) * 100 : 0}
                className="h-2 bg-secondary [&>div]:bg-[var(--color-task-green)]"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--color-task-yellow)]" />
                  <span className="text-sm text-foreground">1 việc/ngày (Vàng)</span>
                </div>
                <span className="text-sm font-medium text-foreground">{stats.yellowTasks}</span>
              </div>
              <Progress
                value={tasks.length > 0 ? (stats.yellowTasks / tasks.length) * 100 : 0}
                className="h-2 bg-secondary [&>div]:bg-[var(--color-task-yellow)]"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--color-task-red)]" />
                  <span className="text-sm text-foreground">1 việc/tuần (Đỏ)</span>
                </div>
                <span className="text-sm font-medium text-foreground">{stats.redTasks}</span>
              </div>
              <Progress
                value={tasks.length > 0 ? (stats.redTasks / tasks.length) * 100 : 0}
                className="h-2 bg-secondary [&>div]:bg-[var(--color-task-red)]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Sắp tới
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <div className={`w-2 h-full min-h-[40px] rounded-full ${getTaskTypeColor(task.type)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{task.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {task.startTime} - {task.endTime}
                        {task.subjectId && (
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: getSubjectColor(task.subjectId),
                              color: getSubjectColor(task.subjectId),
                            }}
                            className="text-xs"
                          >
                            {subjects.find((s) => s.id === task.subjectId)?.code}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">Không có công việc sắp tới</p>
                <p className="text-xs text-muted-foreground">Thêm công việc mới trong tab Công việc</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subjects */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-lg">Môn học của bạn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <Badge
                key={subject.id}
                style={{
                  backgroundColor: subject.color + "20",
                  color: subject.color,
                  borderColor: subject.color,
                }}
                className="border"
              >
                {subject.code} - {subject.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
