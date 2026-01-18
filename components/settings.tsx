"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { User, Bell, BookOpen, Trash2, Plus, X, Save } from "lucide-react"
import type { User as UserType, Subject } from "@/lib/types"
import { storage } from "@/lib/store"

const FPT_MAJORS = [
  "Công nghệ thông tin",
  "Kỹ thuật phần mềm",
  "An toàn thông tin",
  "Trí tuệ nhân tạo",
  "Thiết kế đồ họa",
  "Quản trị kinh doanh",
  "Marketing",
  "Ngôn ngữ Anh",
  "Ngôn ngữ Nhật",
  "Ngôn ngữ Hàn",
]

const SUBJECT_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f97316",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
  "#6366f1",
  "#ef4444",
  "#84cc16",
]

interface SettingsProps {
  user: UserType
  onUserUpdate: (user: UserType) => void
  onLogout: () => void
}

export function Settings({ user, onUserUpdate, onLogout }: SettingsProps) {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    studentYear: user.studentYear.toString(),
    major: user.major,
  })
  const [newSubject, setNewSubject] = useState({ name: "", code: "" })
  const [notificationEnabled, setNotificationEnabled] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSubjects(storage.getSubjects())
  }, [])

  const handleSaveProfile = () => {
    const updatedUser: UserType = {
      ...user,
      name: formData.name,
      email: formData.email,
      studentYear: Number.parseInt(formData.studentYear),
      major: formData.major,
    }
    storage.setUser(updatedUser)
    onUserUpdate(updatedUser)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleAddSubject = () => {
    if (newSubject.name && newSubject.code) {
      const subject: Subject = {
        id: crypto.randomUUID(),
        name: newSubject.name,
        code: newSubject.code.toUpperCase(),
        credits: 3,
        color: SUBJECT_COLORS[subjects.length % SUBJECT_COLORS.length],
      }
      const updatedSubjects = [...subjects, subject]
      setSubjects(updatedSubjects)
      storage.setSubjects(updatedSubjects)
      setNewSubject({ name: "", code: "" })
    }
  }

  const handleRemoveSubject = (id: string) => {
    const updatedSubjects = subjects.filter((s) => s.id !== id)
    setSubjects(updatedSubjects)
    storage.setSubjects(updatedSubjects)
  }

  const handleClearAllData = () => {
    storage.clearAll()
    onLogout()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cài đặt</h1>
        <p className="text-muted-foreground">Quản lý thông tin và tùy chỉnh ứng dụng</p>
      </div>

      {/* Profile Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Thông tin cá nhân
          </CardTitle>
          <CardDescription className="text-muted-foreground">Cập nhật thông tin sinh viên của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Họ và tên</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-secondary border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Email FPT</Label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-secondary border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Năm học</Label>
              <Select
                value={formData.studentYear}
                onValueChange={(value) => setFormData({ ...formData, studentYear: value })}
              >
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="1">Năm 1</SelectItem>
                  <SelectItem value="2">Năm 2</SelectItem>
                  <SelectItem value="3">Năm 3</SelectItem>
                  <SelectItem value="4">Năm 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Ngành học</Label>
              <Select value={formData.major} onValueChange={(value) => setFormData({ ...formData, major: value })}>
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {FPT_MAJORS.map((major) => (
                    <SelectItem key={major} value={major}>
                      {major}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSaveProfile} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Save className="h-4 w-4 mr-2" />
            {saved ? "Đã lưu!" : "Lưu thay đổi"}
          </Button>
        </CardContent>
      </Card>

      {/* Subjects */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Môn học
          </CardTitle>
          <CardDescription className="text-muted-foreground">Quản lý danh sách môn học của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Tên môn học"
              value={newSubject.name}
              onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
              className="bg-secondary border-border text-foreground flex-1"
            />
            <Input
              placeholder="Mã môn"
              value={newSubject.code}
              onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value.toUpperCase() })}
              className="bg-secondary border-border text-foreground w-28"
            />
            <Button
              onClick={handleAddSubject}
              disabled={!newSubject.name || !newSubject.code}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

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
                <X
                  className="h-3 w-3 ml-2 cursor-pointer hover:opacity-70"
                  onClick={() => handleRemoveSubject(subject.id)}
                />
              </Badge>
            ))}
            {subjects.length === 0 && <p className="text-sm text-muted-foreground">Chưa có môn học nào</p>}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Thông báo
          </CardTitle>
          <CardDescription className="text-muted-foreground">Cài đặt nhắc nhở và thông báo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Thông báo trước giờ học</p>
              <p className="text-sm text-muted-foreground">Nhận thông báo trước khi công việc bắt đầu</p>
            </div>
            <Switch checked={notificationEnabled} onCheckedChange={setNotificationEnabled} />
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 Để nhận thông báo, hãy cho phép thông báo từ trình duyệt khi được hỏi.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-card border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Vùng nguy hiểm
          </CardTitle>
          <CardDescription className="text-muted-foreground">Các hành động không thể hoàn tác</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa tất cả dữ liệu
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-foreground">Xóa tất cả dữ liệu?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  Hành động này sẽ xóa toàn bộ dữ liệu bao gồm thông tin cá nhân, công việc, và tài liệu. Bạn sẽ cần
                  đăng ký lại từ đầu. Hành động này không thể hoàn tác!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-border text-foreground hover:bg-secondary">Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAllData}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Xóa tất cả
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
