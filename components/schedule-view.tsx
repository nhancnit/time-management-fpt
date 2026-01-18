"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"
import type { Task, Subject } from "@/lib/types"
import { storage } from "@/lib/store"

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6) // 6:00 - 22:00

export function ScheduleView() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    setTasks(storage.getTasks())
    setSubjects(storage.getSubjects())
  }, [])

  const weekDays = useMemo(() => {
    const start = new Date(currentDate)
    start.setDate(start.getDate() - start.getDay() + 1) // Monday
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      return date
    })
  }, [currentDate])

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return tasks.filter((t) => t.date === dateStr)
  }

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

  const getTaskPosition = (startTime: string, endTime: string) => {
    const [startH, startM] = startTime.split(":").map(Number)
    const [endH, endM] = endTime.split(":").map(Number)
    const top = ((startH - 6) * 60 + startM) * (64 / 60)
    const height = ((endH - startH) * 60 + (endM - startM)) * (64 / 60)
    return { top, height: Math.max(height, 30) }
  }

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + direction * 7)
    setCurrentDate(newDate)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const toggleTaskComplete = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      storage.updateTask(taskId, { completed: !task.completed })
      setTasks(storage.getTasks())
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lịch học</h1>
          <p className="text-muted-foreground">Xem và quản lý thời khóa biểu của bạn</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek(-1)}
            className="border-border text-foreground hover:bg-secondary"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentDate(new Date())}
            className="border-border text-foreground hover:bg-secondary"
          >
            Hôm nay
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek(1)}
            className="border-border text-foreground hover:bg-secondary"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--color-task-green)]" />
          <span className="text-sm text-muted-foreground">Hàng ngày</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--color-task-yellow)]" />
          <span className="text-sm text-muted-foreground">1 việc/ngày</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--color-task-red)]" />
          <span className="text-sm text-muted-foreground">1 việc/tuần</span>
        </div>
      </div>

      {/* Calendar */}
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="border-b border-border pb-4">
          <div className="grid grid-cols-8 gap-2">
            <div className="text-xs text-muted-foreground">Giờ</div>
            {weekDays.map((date) => (
              <div
                key={date.toISOString()}
                className={`text-center ${isToday(date) ? "text-primary" : "text-foreground"}`}
              >
                <p className="text-xs text-muted-foreground">
                  {date.toLocaleDateString("vi-VN", { weekday: "short" })}
                </p>
                <p
                  className={`text-lg font-semibold ${isToday(date) ? "bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto" : ""}`}
                >
                  {date.getDate()}
                </p>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto max-h-[600px]">
            <div className="grid grid-cols-8 min-w-[800px]">
              {/* Time column */}
              <div className="border-r border-border">
                {HOURS.map((hour) => (
                  <div key={hour} className="h-16 border-b border-border px-2 py-1">
                    <span className="text-xs text-muted-foreground">{hour.toString().padStart(2, "0")}:00</span>
                  </div>
                ))}
              </div>

              {/* Days columns */}
              {weekDays.map((date) => (
                <div
                  key={date.toISOString()}
                  className={`relative border-r border-border ${isToday(date) ? "bg-primary/5" : ""}`}
                >
                  {HOURS.map((hour) => (
                    <div key={hour} className="h-16 border-b border-border" />
                  ))}

                  {/* Tasks */}
                  {getTasksForDate(date).map((task) => {
                    const pos = getTaskPosition(task.startTime, task.endTime)
                    const subject = subjects.find((s) => s.id === task.subjectId)
                    return (
                      <div
                        key={task.id}
                        className={`absolute left-1 right-1 rounded-md p-1 cursor-pointer transition-opacity ${
                          task.completed ? "opacity-50" : ""
                        } ${getTaskTypeColor(task.type)}`}
                        style={{
                          top: pos.top,
                          height: pos.height,
                        }}
                        onClick={() => toggleTaskComplete(task.id)}
                      >
                        <div className="flex items-start gap-1">
                          {task.completed && <CheckCircle2 className="h-3 w-3 text-white shrink-0 mt-0.5" />}
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-white truncate">{task.title}</p>
                            {subject && <p className="text-xs text-white/80 truncate">{subject.code}</p>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
