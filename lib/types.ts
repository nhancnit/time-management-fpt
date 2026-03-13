export interface User {
  id: string
  name: string
  email: string
  studentId?: string
  studentYear: number
  major: string
  subjects: Subject[]
  createdAt: Date
  fStore: UserFStore // Thêm fStore vào User interface
}

export interface Subject {
  id: string
  name: string
  code: string
  credits: number
  color: string
}

export interface Task {
  id: string
  title: string
  description?: string
  subjectId?: string
  type: "green" | "yellow" | "red"
  startTime: string
  endTime: string
  date: string
  notifyBefore: number
  completed: boolean
  createdAt: Date
  recurringId?: string
}

export interface RecurringSchedule {
  id: string
  title: string
  subjectId?: string
  type: "green" | "yellow" | "red"
  startTime: string
  endTime: string
  daysOfWeek: number[]
  notifyBefore: number
  createdAt: Date
}

export interface StudyMaterial {
  id: string
  title: string
  subjectId: string
  type: "document" | "video" | "link" | "note" | "file"
  url?: string
  content?: string
  fileName?: string
  fileSize?: number
  fileType?: string
  createdAt: Date
}

export interface StudyTip {
  id: string
  title: string
  content: string
  category:
    | "pomodoro"
    | "active-recall"
    | "spaced-repetition"
    | "time-management"
    | "focus"
    | "optimal-time"
    | "deep-work"
    | "note-taking"
}

export interface TimeSlot {
  period: string
  timeRange: string
  startTime: string
  endTime: string
}

export interface SubjectStudyTime {
  subjectCode: string
  subjectName: string
  category: "logic" | "memory" | "creative" | "practice"
  studyDuration: string
  breakSuggestion: string
  tips: string[]
}

export interface FStoreItem {
  id: string
  name: string
  description: string
  price: number
  slot: "body" | "accessory" | "handheld" | "background"
  image: string
  isDefault?: boolean
  isLimited?: boolean
}

export interface UserFStore {
  fCoins: number
  ownedItems: string[]
  equippedItems: {
    body: string
    accessory: string
    handheld: string
    background: string
  }
  lastCheckIn?: string
  streakDays: number
  completedBossToday: boolean
  currentAvatarLevel: number   // which level avatar user is currently displaying
  unlockedLevels: number[]     // levels that have been unlocked
}
