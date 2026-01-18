"use client"

import { useEffect, useCallback, useState } from "react"
import type { Task } from "@/lib/types"
import { storage } from "@/lib/store"

export function NotificationSystem() {
  const [permissionGranted, setPermissionGranted] = useState(false)

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.log("[v0] Notifications not supported")
      return
    }

    if (Notification.permission === "granted") {
      setPermissionGranted(true)
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      setPermissionGranted(permission === "granted")
    }
  }, [])

  const sendNotification = useCallback(
    (task: Task) => {
      if (!permissionGranted) return

      const notification = new Notification(`📚 Sắp đến giờ: ${task.title}`, {
        body: `Bắt đầu lúc ${task.startTime}. Hãy chuẩn bị nhé!`,
        icon: "/favicon.ico",
        tag: task.id,
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }
    },
    [permissionGranted],
  )

  useEffect(() => {
    requestPermission()
  }, [requestPermission])

  useEffect(() => {
    if (!permissionGranted) return

    const checkTasks = () => {
      const tasks = storage.getTasks()
      const now = new Date()
      const today = now.toISOString().split("T")[0]
      const currentMinutes = now.getHours() * 60 + now.getMinutes()

      tasks.forEach((task) => {
        if (task.date !== today || task.completed) return

        const [hours, minutes] = task.startTime.split(":").map(Number)
        const taskMinutes = hours * 60 + minutes
        const notifyMinutes = taskMinutes - task.notifyBefore

        // Check if we should notify (within 1 minute window)
        if (currentMinutes >= notifyMinutes && currentMinutes < notifyMinutes + 1) {
          sendNotification(task)
        }
      })
    }

    // Check every minute
    const interval = setInterval(checkTasks, 60000)
    checkTasks() // Initial check

    return () => clearInterval(interval)
  }, [permissionGranted, sendNotification])

  return null
}
