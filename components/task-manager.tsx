"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Clock,
  Trash2,
  CheckCircle2,
  Circle,
  Bell,
  AlertTriangle,
  Info,
  BookOpen,
  Repeat,
  Star,
} from "lucide-react"
import { toast } from "sonner"
import type { Task, Subject, RecurringSchedule, TimeSlot } from "@/lib/types"
import { storage } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import {
  subjectStudyTimes,
  commonTimeSlots,
  getRecommendedTimeSlots,
  guessCategoryFromSubjectCode,
} from "@/lib/study-tips"

const TASK_TYPES = [
  {
    value: "green",
    label: "Xanh - Hàng ngày",
    description: "Việc bắt buộc làm hàng ngày",
    color: "var(--color-task-green)",
  },
  {
    value: "yellow",
    label: "Vàng - 1 việc/ngày",
    description: "Chỉ được làm 1 việc loại này mỗi ngày",
    color: "var(--color-task-yellow)",
  },
  {
    value: "red",
    label: "Đỏ - 1 việc/tuần",
    description: "Chỉ được làm 1 việc loại này mỗi tuần",
    color: "var(--color-task-red)",
  },
]

const DAYS_OF_WEEK = [
  { value: 1, label: "T2" },
  { value: 2, label: "T3" },
  { value: 3, label: "T4" },
  { value: 4, label: "T5" },
  { value: 5, label: "T6" },
  { value: 6, label: "T7" },
  { value: 0, label: "CN" },
]

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "green" | "yellow" | "red">("all")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subjectId: "",
    type: "green" as Task["type"],
    date: new Date().toISOString().split("T")[0],
    selectedTimeSlot: "",
    notifyBefore: 15,
    isRecurring: false,
    selectedDays: [] as number[],
  })
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    setTasks(storage.getTasks())
    setSubjects(storage.getSubjects())
  }, [])

  const selectedSubjectInfo = useMemo(() => {
    if (!formData.subjectId || formData.subjectId === "none") return null
    const subject = subjects.find((s) => s.id === formData.subjectId)
    if (!subject) return null

    // Tìm trong danh sách đã định nghĩa
    let studyTime = subjectStudyTimes.find((st) => st.subjectCode === subject.code)

    // Nếu không có, tạo mới dựa vào mã môn
    if (!studyTime) {
      const guessedCategory = guessCategoryFromSubjectCode(subject.code)
      studyTime = {
        subjectCode: subject.code,
        subjectName: subject.name,
        category: guessedCategory,
        studyDuration:
          guessedCategory === "logic"
            ? "45-60 phút mỗi session"
            : guessedCategory === "memory"
              ? "30-45 phút mỗi session"
              : guessedCategory === "creative"
                ? "45-60 phút mỗi session"
                : "60-90 phút mỗi session",
        breakSuggestion: "Nghỉ 10-15 phút giữa các session",
        tips: ["Áp dụng phương pháp Pomodoro", "Ghi chú những điểm quan trọng", "Ôn lại sau mỗi buổi học"],
      }
    }

    const timeSlots = getRecommendedTimeSlots(studyTime.category)
    return {
      subject,
      studyTime,
      timeSlots,
    }
  }, [formData.subjectId, subjects])

  const getSelectedTimeSlotDetails = (): TimeSlot | null => {
    if (!formData.selectedTimeSlot) return null
    const [startTime, endTime] = formData.selectedTimeSlot.split("-")
    return commonTimeSlots.find((slot) => slot.startTime === startTime && slot.endTime === endTime) || null
  }

  const filteredTasks = useMemo(() => {
    let filtered = tasks
    if (filter !== "all") {
      filtered = filtered.filter((t) => t.type === filter)
    }
    return filtered.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.startTime.localeCompare(b.startTime)
    })
  }, [tasks, filter])

  const validateTask = (): boolean => {
    if (selectedSubjectInfo && !formData.selectedTimeSlot) {
      setValidationError("Vui lòng chọn một khung giờ học cho môn này!")
      return false
    }

    if (formData.isRecurring && formData.selectedDays.length === 0) {
      setValidationError("Vui lòng chọn ít nhất một ngày trong tuần!")
      return false
    }

    if (formData.type === "yellow" && !formData.isRecurring) {
      const existingYellow = tasks.find((t) => t.type === "yellow" && t.date === formData.date)
      if (existingYellow) {
        setValidationError(
          `Bạn đã có công việc Vàng vào ngày này: "${existingYellow.title}". Chỉ được 1 việc Vàng mỗi ngày!`,
        )
        return false
      }
    }

    if (formData.type === "red" && !formData.isRecurring) {
      const taskDate = new Date(formData.date)
      const weekStart = new Date(taskDate)
      weekStart.setDate(taskDate.getDate() - taskDate.getDay() + 1)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)

      const existingRed = tasks.find((t) => {
        if (t.type !== "red") return false
        const tDate = new Date(t.date)
        return tDate >= weekStart && tDate <= weekEnd
      })

      if (existingRed) {
        setValidationError(
          `Bạn đã có công việc Đỏ trong tuần này: "${existingRed.title}". Chỉ được 1 việc Đỏ mỗi tuần!`,
        )
        return false
      }
    }

    return true
  }

  const generateRecurringTasks = (
    title: string,
    description: string | undefined,
    subjectId: string | undefined,
    type: Task["type"],
    startTime: string,
    endTime: string,
    daysOfWeek: number[],
    notifyBefore: number,
    recurringId: string,
  ): Task[] => {
    const tasks: Task[] = []
    const today = new Date()
    const oneMonthLater = new Date(today)
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)

    const currentDate = new Date(today)
    while (currentDate <= oneMonthLater) {
      const dayOfWeek = currentDate.getDay()
      if (daysOfWeek.includes(dayOfWeek)) {
        tasks.push({
          id: crypto.randomUUID(),
          title,
          description,
          subjectId,
          type,
          date: currentDate.toISOString().split("T")[0],
          startTime,
          endTime,
          notifyBefore,
          completed: false,
          createdAt: new Date(),
          recurringId,
        })
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return tasks
  }

  const handleAddTask = () => {
    if (!formData.title) {
      setValidationError("Vui lòng nhập tiêu đề!")
      return
    }

    if (!formData.isRecurring && !formData.date) {
      setValidationError("Vui lòng chọn ngày!")
      return
    }

    if (!validateTask()) return

    let startTime = "08:00"
    let endTime = "08:30"

    if (formData.selectedTimeSlot) {
      const [start, end] = formData.selectedTimeSlot.split("-")
      startTime = start
      endTime = end
    }

    if (formData.isRecurring) {
      const recurringId = crypto.randomUUID()

      const schedule: RecurringSchedule = {
        id: recurringId,
        title: formData.title,
        subjectId: formData.subjectId === "none" ? undefined : formData.subjectId,
        type: formData.type,
        startTime,
        endTime,
        daysOfWeek: formData.selectedDays,
        notifyBefore: formData.notifyBefore,
        createdAt: new Date(),
      }
      storage.addRecurringSchedule(schedule)

      const newTasks = generateRecurringTasks(
        formData.title,
        formData.description || undefined,
        formData.subjectId === "none" ? undefined : formData.subjectId,
        formData.type,
        startTime,
        endTime,
        formData.selectedDays,
        formData.notifyBefore,
        recurringId,
      )

      newTasks.forEach((task) => storage.addTask(task))
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: formData.title,
        description: formData.description || undefined,
        subjectId: formData.subjectId === "none" ? undefined : formData.subjectId,
        type: formData.type,
        date: formData.date,
        startTime,
        endTime,
        notifyBefore: formData.notifyBefore,
        completed: false,
        createdAt: new Date(),
      }
      storage.addTask(newTask)
    }

    setTasks(storage.getTasks())
    setIsDialogOpen(false)
    setValidationError(null)
    setFormData({
      title: "",
      description: "",
      subjectId: "",
      type: "green",
      date: new Date().toISOString().split("T")[0],
      selectedTimeSlot: "",
      notifyBefore: 15,
      isRecurring: false,
      selectedDays: [],
    })
  }

  const handleDeleteTask = () => {
    if (deleteTaskId) {
      storage.deleteTask(deleteTaskId)
      setTasks(storage.getTasks())
      setDeleteTaskId(null)
    }
  }

  const toggleTaskComplete = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      if (!task.completed) {
        // Anti-Farming Logic: Check if task was created less than 5 minutes ago
        const createdAt = new Date(task.createdAt).getTime()
        const now = new Date().getTime()
        const diffMs = now - createdAt
        
        if (diffMs < 5 * 60 * 1000) { // 5 minutes
          toast.error("Làm việc gì mà nhanh thế?", {
            description: "Cần làm tối thiểu 5 phút mới nhận được F-Coins nhé!",
            duration: 4000,
          })
          return // Prevent marking as complete
        }

        // Call Supabase RPC
        try {
          const { data, error } = await supabase.rpc('reward_task_fcoins', {
            p_task_id: task.id,
            p_task_type: task.type
          })

          if (error) {
            if (error.message.includes('Task already rewarded')) {
              toast.error("Bạn đã nhận thưởng cho công việc này rồi!")
            } else if (error.message.includes('Not authenticated')) {
               toast.error("Vui lòng đăng nhập lại để nhận F-Coins.")
            } else {
              console.error("RPC Error:", error)
              toast.error("Lỗi khi cộng F-Coins", { description: error.message })
            }
          } else if (data !== null) {
            // Success
            const rewardAmount = task.type === 'green' ? 50 : task.type === 'yellow' ? 100 : 200
            toast.success(`🎉 Tuyệt vời! Bạn nhận được +${rewardAmount} F-Coins`)
            
            // Sync local storage for optimistic UI updates elsewhere
            const fstore = storage.getFStore()
            fstore.fCoins = data
            storage.setFStore(fstore)
            
            // Emit custom event so other components (Dashboard) can update immediately
            window.dispatchEvent(new Event('fcoins-updated'))
          }
        } catch (err) {
          console.error("Failed to reward F-Coins:", err)
        }
      }

      storage.updateTask(taskId, { completed: !task.completed })
      setTasks(storage.getTasks())
    }
  }

  const toggleDay = (day: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day],
    }))
    setValidationError(null)
  }

  const getTaskTypeConfig = (type: Task["type"]) => {
    return TASK_TYPES.find((t) => t.value === type)
  }

  const getSubject = (subjectId?: string) => {
    if (!subjectId) return null
    return subjects.find((s) => s.id === subjectId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý công việc</h1>
          <p className="text-muted-foreground">Thêm và theo dõi công việc học tập</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setValidationError(null)
              setFormData({
                title: "",
                description: "",
                subjectId: "",
                type: "green",
                date: new Date().toISOString().split("T")[0],
                selectedTimeSlot: "",
                notifyBefore: 15,
                isRecurring: false,
                selectedDays: [],
              })
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Thêm công việc
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">Thêm công việc mới</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Chọn môn học để xem khung giờ học tối ưu
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {validationError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{validationError}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-foreground">Tiêu đề</Label>
                <Input
                  placeholder="Ví dụ: Học Toán cao cấp"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-secondary border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Mô tả (tùy chọn)</Label>
                <Textarea
                  placeholder="Mô tả chi tiết công việc..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-secondary border-border text-foreground resize-none"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Môn học
                </Label>
                <Select
                  value={formData.subjectId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, subjectId: value, selectedTimeSlot: "" })
                    setValidationError(null)
                  }}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue placeholder="Chọn môn học để xem khung giờ gợi ý" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="none">Không chọn môn (tự nhập giờ)</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.code} - {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSubjectInfo && (
                <div className="space-y-3">
                  {/* Thông tin nghiên cứu khoa học */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          Nghiên cứu khoa học cho môn{" "}
                          {selectedSubjectInfo.studyTime.category === "logic"
                            ? "tư duy logic"
                            : selectedSubjectInfo.studyTime.category === "memory"
                              ? "ghi nhớ"
                              : selectedSubjectInfo.studyTime.category === "creative"
                                ? "sáng tạo"
                                : "thực hành"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{selectedSubjectInfo.timeSlots.research.reason}</p>
                      <p className="text-xs text-muted-foreground/80 italic">
                        {selectedSubjectInfo.timeSlots.research.researchSource}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    <Label className="text-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Chọn khung giờ học <span className="text-destructive">*</span>
                    </Label>

                    {/* Khung giờ được đề xuất */}
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        Khung giờ được đề xuất (tối ưu nhất)
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedSubjectInfo.timeSlots.recommended.map((slot) => (
                          <button
                            key={`${slot.startTime}-${slot.endTime}`}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, selectedTimeSlot: `${slot.startTime}-${slot.endTime}` })
                              setValidationError(null)
                            }}
                            className={`p-2 rounded-lg text-xs font-medium transition-all border ${
                              formData.selectedTimeSlot === `${slot.startTime}-${slot.endTime}`
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-secondary/50 text-foreground border-primary/30 hover:bg-primary/10"
                            }`}
                          >
                            <div>{slot.timeRange}</div>
                            <div className="text-[10px] opacity-70">{slot.period}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Khung giờ khác */}
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Khung giờ khác</p>
                      <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto">
                        {selectedSubjectInfo.timeSlots.other.map((slot) => (
                          <button
                            key={`${slot.startTime}-${slot.endTime}`}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, selectedTimeSlot: `${slot.startTime}-${slot.endTime}` })
                              setValidationError(null)
                            }}
                            className={`p-1.5 rounded text-xs transition-all border ${
                              formData.selectedTimeSlot === `${slot.startTime}-${slot.endTime}`
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-secondary/30 text-muted-foreground border-border hover:bg-secondary/50"
                            }`}
                          >
                            {slot.timeRange}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hiển thị khung giờ đã chọn */}
                    {formData.selectedTimeSlot && getSelectedTimeSlotDetails() && (
                      <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          Đã chọn: {getSelectedTimeSlotDetails()?.timeRange} ({getSelectedTimeSlotDetails()?.period})
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    <strong>Thời lượng:</strong> {selectedSubjectInfo.studyTime.studyDuration} | <strong>Nghỉ:</strong>{" "}
                    {selectedSubjectInfo.studyTime.breakSuggestion}
                  </p>
                </div>
              )}

              {/* Nếu không chọn môn thì cho nhập giờ tự do */}
              {(!formData.subjectId || formData.subjectId === "none") && (
                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Chọn khung giờ
                  </Label>
                  <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto">
                    {commonTimeSlots.map((slot) => (
                      <button
                        key={`${slot.startTime}-${slot.endTime}`}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, selectedTimeSlot: `${slot.startTime}-${slot.endTime}` })
                          setValidationError(null)
                        }}
                        className={`p-1.5 rounded text-xs transition-all border ${
                          formData.selectedTimeSlot === `${slot.startTime}-${slot.endTime}`
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary/30 text-foreground border-border hover:bg-secondary/50"
                        }`}
                      >
                        {slot.timeRange}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 p-3 bg-secondary/50 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="recurring"
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) => {
                      setFormData({ ...formData, isRecurring: checked === true, selectedDays: [] })
                      setValidationError(null)
                    }}
                  />
                  <Label htmlFor="recurring" className="text-foreground flex items-center gap-2 cursor-pointer">
                    <Repeat className="h-4 w-4" />
                    Lặp lại hàng tuần
                  </Label>
                </div>

                {formData.isRecurring && (
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Chọn các ngày trong tuần:</Label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS_OF_WEEK.map((day) => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleDay(day.value)}
                          className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                            formData.selectedDays.includes(day.value)
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Công việc sẽ được tạo tự động cho 1 tháng tới</p>
                  </div>
                )}
              </div>

              {!formData.isRecurring && (
                <div className="space-y-2">
                  <Label className="text-foreground">Ngày cụ thể</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-foreground">Loại công việc</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => {
                    setFormData({ ...formData, type: value as Task["type"] })
                    setValidationError(null)
                  }}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {TASK_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">{getTaskTypeConfig(formData.type)?.description}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Nhắc trước (phút)
                </Label>
                <Select
                  value={formData.notifyBefore.toString()}
                  onValueChange={(value) => setFormData({ ...formData, notifyBefore: Number.parseInt(value) })}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="5">5 phút</SelectItem>
                    <SelectItem value="10">10 phút</SelectItem>
                    <SelectItem value="15">15 phút</SelectItem>
                    <SelectItem value="30">30 phút</SelectItem>
                    <SelectItem value="60">1 giờ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddTask} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                {formData.isRecurring ? "Tạo lịch lặp lại" : "Thêm công việc"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-primary" : ""}
        >
          Tất cả
        </Button>
        {TASK_TYPES.map((type) => (
          <Button
            key={type.value}
            variant={filter === type.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(type.value as typeof filter)}
            className="flex items-center gap-2"
            style={filter === type.value ? { backgroundColor: type.color } : {}}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }} />
            {type.label.split(" - ")[0]}
          </Button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card className="bg-card/50 border-border">
            <CardContent className="p-8 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Chưa có công việc nào</h3>
              <p className="text-muted-foreground">Bấm "Thêm công việc" để bắt đầu lên lịch học tập</p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => {
            const typeConfig = getTaskTypeConfig(task.type)
            const subject = getSubject(task.subjectId)
            return (
              <Card
                key={task.id}
                className={`bg-card border-border transition-all ${task.completed ? "opacity-60" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className="mt-1 shrink-0 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium text-foreground ${task.completed ? "line-through" : ""}`}>
                          {task.title}
                        </h3>
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: typeConfig?.color }}
                        />
                        {task.recurringId && (
                          <Badge variant="outline" className="text-xs">
                            <Repeat className="h-3 w-3 mr-1" />
                            Lặp lại
                          </Badge>
                        )}
                      </div>
                      {task.description && <p className="text-sm text-muted-foreground mb-2">{task.description}</p>}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.startTime} - {task.endTime}
                        </span>
                        <span>•</span>
                        <span>{new Date(task.date).toLocaleDateString("vi-VN")}</span>
                        {subject && (
                          <>
                            <span>•</span>
                            <Badge
                              variant="outline"
                              className="text-xs"
                              style={{ borderColor: subject.color, color: subject.color }}
                            >
                              {subject.code}
                            </Badge>
                          </>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Bell className="h-3 w-3" />
                          {task.notifyBefore} phút
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteTaskId(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTaskId} onOpenChange={() => setDeleteTaskId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Bạn có chắc chắn muốn xóa công việc này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary text-foreground hover:bg-secondary/80">Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
