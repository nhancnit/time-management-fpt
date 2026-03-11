"use client"

import type { User, Task, Subject, StudyMaterial, RecurringSchedule, UserFStore } from "./types"

const STORAGE_KEYS = {
  USER: "fpt_study_user",
  TASKS: "fpt_study_tasks",
  SUBJECTS: "fpt_study_subjects",
  MATERIALS: "fpt_study_materials",
  RECURRING: "fpt_study_recurring",
  FSTORE: "fpt_study_fstore",
}

export const storage = {
  getUser: (): User | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(STORAGE_KEYS.USER)
    return data ? JSON.parse(data) : null
  },

  setUser: (user: User): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },

  getTasks: (): Task[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.TASKS)
    return data ? JSON.parse(data) : []
  },

  setTasks: (tasks: Task[]): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
  },

  addTask: (task: Task): void => {
    const tasks = storage.getTasks()
    tasks.push(task)
    storage.setTasks(tasks)
  },

  updateTask: (taskId: string, updates: Partial<Task>): void => {
    const tasks = storage.getTasks()
    const index = tasks.findIndex((t) => t.id === taskId)
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates }
      storage.setTasks(tasks)
    }
  },

  deleteTask: (taskId: string): void => {
    const tasks = storage.getTasks().filter((t) => t.id !== taskId)
    storage.setTasks(tasks)
  },

  getSubjects: (): Subject[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS)
    return data ? JSON.parse(data) : []
  },

  setSubjects: (subjects: Subject[]): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects))
  },

  getMaterials: (): StudyMaterial[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.MATERIALS)
    return data ? JSON.parse(data) : []
  },

  setMaterials: (materials: StudyMaterial[]): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials))
  },

  addMaterial: (material: StudyMaterial): void => {
    const materials = storage.getMaterials()
    materials.push(material)
    storage.setMaterials(materials)
  },

  deleteMaterial: (materialId: string): void => {
    const materials = storage.getMaterials().filter((m) => m.id !== materialId)
    storage.setMaterials(materials)
  },

  getRecurringSchedules: (): RecurringSchedule[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.RECURRING)
    return data ? JSON.parse(data) : []
  },

  setRecurringSchedules: (schedules: RecurringSchedule[]): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(schedules))
  },

  addRecurringSchedule: (schedule: RecurringSchedule): void => {
    const schedules = storage.getRecurringSchedules()
    schedules.push(schedule)
    storage.setRecurringSchedules(schedules)
  },

  deleteRecurringSchedule: (scheduleId: string): void => {
    const schedules = storage.getRecurringSchedules().filter((s) => s.id !== scheduleId)
    storage.setRecurringSchedules(schedules)
    // Xóa luôn các tasks liên quan
    const tasks = storage.getTasks().filter((t) => t.recurringId !== scheduleId)
    storage.setTasks(tasks)
  },

  getFStore: (): UserFStore => {
    if (typeof window === "undefined") return getDefaultFStore()
    const data = localStorage.getItem(STORAGE_KEYS.FSTORE)
    return data ? JSON.parse(data) : getDefaultFStore()
  },

  setFStore: (fstore: UserFStore): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.FSTORE, JSON.stringify(fstore))
  },

  addFCoins: (amount: number): void => {
    const fstore = storage.getFStore()
    fstore.fCoins += amount
    storage.setFStore(fstore)
  },

  spendFCoins: (amount: number): boolean => {
    const fstore = storage.getFStore()
    if (fstore.fCoins < amount) return false
    fstore.fCoins -= amount
    storage.setFStore(fstore)
    return true
  },

  buyItem: (itemId: string, price: number): boolean => {
    const fstore = storage.getFStore()
    if (fstore.fCoins < price) return false
    if (fstore.ownedItems.includes(itemId)) return false
    fstore.fCoins -= price
    fstore.ownedItems.push(itemId)
    storage.setFStore(fstore)
    return true
  },

  equipItem: (itemId: string, slot: "body" | "accessory" | "handheld" | "background"): void => {
    const fstore = storage.getFStore()
    fstore.equippedItems[slot] = itemId
    storage.setFStore(fstore)
  },

  checkInAndCalculateBonus: (): { bonus: number; alreadyCheckedIn: boolean } => {
    const fstore = storage.getFStore()
    const today = new Date().toDateString()

    if (fstore.lastCheckIn === today) return { bonus: 0, alreadyCheckedIn: true }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    if (fstore.lastCheckIn === yesterday.toDateString()) {
      fstore.streakDays += 1
    } else {
      fstore.streakDays = 1
    }

    fstore.lastCheckIn = today

    // Base Check-in Reward: 20 F-Coins
    let bonus = 20

    // Early Bird bonus: Check-in trước 7h sáng (+5 F-Coins)
    const hour = new Date().getHours()
    if (hour < 7) {
       bonus += 5
    }

    // Combo chăm chỉ: 3 ngày liên tiếp = 50 bonus
    if (fstore.streakDays >= 3 && fstore.streakDays % 3 === 0) {
      bonus += 50
    }

    fstore.fCoins += bonus
    storage.setFStore(fstore)
    return { bonus, alreadyCheckedIn: false }
  },

  clearAll: (): void => {
    if (typeof window === "undefined") return
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  },
}

function getDefaultFStore(): UserFStore {
  return {
    fCoins: 0,
    ownedItems: ["ao-cam", "bg-default"],
    equippedItems: {
      body: "ao-cam",
      accessory: "",
      handheld: "",
      background: "bg-default",
    },
    streakDays: 0,
    completedBossToday: false,
  }
}
