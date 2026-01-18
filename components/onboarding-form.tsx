"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, X, Sparkles } from "lucide-react"
import type { User, Subject } from "@/lib/types"
import { storage } from "@/lib/store"
import Image from "next/image"

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

const COMMON_SUBJECTS = [
  { name: "Toán cao cấp", code: "MAE101" },
  { name: "Toán rời rạc", code: "MAD101" },
  { name: "Vật lý đại cương", code: "PHY101" },
  { name: "Lập trình cơ bản", code: "PRF192" },
  { name: "Cơ sở dữ liệu", code: "DBI202" },
  { name: "Cấu trúc dữ liệu", code: "CSD201" },
  { name: "Tiếng Anh 1", code: "ENG101" },
  { name: "Tiếng Anh 2", code: "ENG102" },
  { name: "Kỹ năng mềm", code: "SSG101" },
  { name: "Võ cổ truyền", code: "VOV114" },
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

interface OnboardingFormProps {
  onComplete: (user: User) => void
}

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentYear: "",
    major: "",
  })
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [newSubject, setNewSubject] = useState({ name: "", code: "" })

  const handleAddSubject = (name: string, code: string) => {
    if (name && code && !subjects.find((s) => s.code === code)) {
      const newSub: Subject = {
        id: crypto.randomUUID(),
        name,
        code,
        credits: 3,
        color: SUBJECT_COLORS[subjects.length % SUBJECT_COLORS.length],
      }
      setSubjects([...subjects, newSub])
      setNewSubject({ name: "", code: "" })
    }
  }

  const handleRemoveSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id))
  }

  const handleComplete = () => {
    const user: User = {
      id: crypto.randomUUID(),
      name: formData.name,
      email: formData.email,
      studentYear: Number.parseInt(formData.studentYear),
      major: formData.major,
      subjects,
      createdAt: new Date(),
    }
    storage.setUser(user)
    storage.setSubjects(subjects)
    onComplete(user)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image src="/images/logo.png" alt="F-Timers Logo" width={80} height={80} className="rounded-full" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">F-Timers</h1>
          <p className="text-muted-foreground">Think Fast, Act Smart - Quản lý thời gian cho sinh viên FPT</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-2 w-20 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        {step === 1 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Thông tin cá nhân
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Cho chúng tôi biết về bạn để cá nhân hóa trải nghiệm
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Họ và tên
                </Label>
                <Input
                  id="name"
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email FPT
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="anv@fpt.edu.vn"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Năm học</Label>
                  <Select
                    value={formData.studentYear}
                    onValueChange={(value) => setFormData({ ...formData, studentYear: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border text-foreground">
                      <SelectValue placeholder="Chọn năm" />
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
                      <SelectValue placeholder="Chọn ngành" />
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
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.email || !formData.studentYear || !formData.major}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Tiếp tục
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Môn học của bạn
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Thêm các môn bạn đang học trong kỳ này
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick add from common subjects */}
              <div className="space-y-2">
                <Label className="text-foreground text-sm">Môn học phổ biến</Label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SUBJECTS.filter((cs) => !subjects.find((s) => s.code === cs.code)).map((subject) => (
                    <Badge
                      key={subject.code}
                      variant="outline"
                      className="cursor-pointer border-border text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
                      onClick={() => handleAddSubject(subject.name, subject.code)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {subject.code}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Custom subject input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Tên môn học"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground flex-1"
                />
                <Input
                  placeholder="Mã môn"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value.toUpperCase() })}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground w-28"
                />
                <Button
                  variant="outline"
                  onClick={() => handleAddSubject(newSubject.name, newSubject.code)}
                  disabled={!newSubject.name || !newSubject.code}
                  className="border-border text-foreground hover:bg-primary/10 hover:text-primary"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Selected subjects */}
              {subjects.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-foreground text-sm">Môn đã chọn ({subjects.length})</Label>
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
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-border text-foreground hover:bg-secondary"
                >
                  Quay lại
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={subjects.length === 0}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Hoàn tất
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
