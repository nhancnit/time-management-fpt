"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
  FileText,
  Video,
  Link2,
  StickyNote,
  Trash2,
  ExternalLink,
  Search,
  FolderOpen,
  Upload,
  File,
  FileImage,
  FileArchive,
  X,
  Download,
} from "lucide-react"
import type { StudyMaterial, Subject } from "@/lib/types"
import { storage } from "@/lib/store"

const MATERIAL_TYPES = [
  { value: "document", label: "Tài liệu", icon: FileText },
  { value: "video", label: "Video", icon: Video },
  { value: "link", label: "Link", icon: Link2 },
  { value: "note", label: "Ghi chú", icon: StickyNote },
  { value: "file", label: "Tệp đính kèm", icon: Upload },
]

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith("image/")) return FileImage
  if (fileType.includes("zip") || fileType.includes("rar") || fileType.includes("7z")) return FileArchive
  if (fileType.includes("pdf")) return FileText
  if (fileType.includes("video")) return Video
  return File
}

export function MaterialsManager() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteMaterialId, setDeleteMaterialId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSubject, setFilterSubject] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileDataUrl, setFileDataUrl] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: "",
    subjectId: "",
    type: "document" as StudyMaterial["type"],
    url: "",
    content: "",
  })

  useEffect(() => {
    setMaterials(storage.getMaterials())
    setSubjects(storage.getSubjects())
  }, [])

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = filterSubject === "all" || m.subjectId === filterSubject
    const matchesType = filterType === "all" || m.type === filterType
    return matchesSearch && matchesSubject && matchesType
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Limit file size to 5MB for localStorage
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước tệp không được vượt quá 5MB")
        return
      }
      setSelectedFile(file)
      setFormData({ ...formData, title: formData.title || file.name })

      // Convert file to base64 for storage
      const reader = new FileReader()
      reader.onload = (e) => {
        setFileDataUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearSelectedFile = () => {
    setSelectedFile(null)
    setFileDataUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAddMaterial = () => {
    if (!formData.title || !formData.subjectId) return

    const newMaterial: StudyMaterial = {
      id: crypto.randomUUID(),
      title: formData.title,
      subjectId: formData.subjectId,
      type: formData.type,
      url: formData.type === "file" ? fileDataUrl : formData.url || undefined,
      content: formData.content || undefined,
      fileName: selectedFile?.name,
      fileSize: selectedFile?.size,
      fileType: selectedFile?.type,
      createdAt: new Date(),
    }

    storage.addMaterial(newMaterial)
    setMaterials(storage.getMaterials())
    setIsDialogOpen(false)
    setFormData({
      title: "",
      subjectId: "",
      type: "document",
      url: "",
      content: "",
    })
    clearSelectedFile()
  }

  const handleDeleteMaterial = () => {
    if (deleteMaterialId) {
      storage.deleteMaterial(deleteMaterialId)
      setMaterials(storage.getMaterials())
      setDeleteMaterialId(null)
    }
  }

  const handleDownloadFile = (material: StudyMaterial) => {
    if (material.url && material.fileName) {
      const link = document.createElement("a")
      link.href = material.url
      link.download = material.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getSubject = (subjectId: string) => {
    return subjects.find((s) => s.id === subjectId)
  }

  const getTypeConfig = (type: StudyMaterial["type"]) => {
    return MATERIAL_TYPES.find((t) => t.value === type)
  }

  const groupedMaterials = subjects.reduce(
    (acc, subject) => {
      const subjectMaterials = filteredMaterials.filter((m) => m.subjectId === subject.id)
      if (subjectMaterials.length > 0) {
        acc[subject.id] = subjectMaterials
      }
      return acc
    },
    {} as Record<string, StudyMaterial[]>,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tài liệu học tập</h1>
          <p className="text-muted-foreground">Quản lý tài liệu, ghi chú và tệp đính kèm của bạn</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) clearSelectedFile()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Thêm tài liệu
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Thêm tài liệu mới</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Thêm tài liệu, video, link, ghi chú hoặc tệp đính kèm
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Tiêu đề</Label>
                <Input
                  placeholder="Ví dụ: Slide bài giảng tuần 1"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-secondary border-border text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Môn học</Label>
                  <Select
                    value={formData.subjectId}
                    onValueChange={(value) => setFormData({ ...formData, subjectId: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border text-foreground">
                      <SelectValue placeholder="Chọn môn" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.code} - {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Loại</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => {
                      setFormData({ ...formData, type: value as StudyMaterial["type"] })
                      if (value !== "file") clearSelectedFile()
                    }}
                  >
                    <SelectTrigger className="bg-secondary border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {MATERIAL_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.type === "file" && (
                <div className="space-y-2">
                  <Label className="text-foreground">Tệp đính kèm</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z,.png,.jpg,.jpeg,.gif"
                  />
                  {!selectedFile ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Nhấp để chọn tệp hoặc kéo thả vào đây</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, Word, Excel, PowerPoint, hình ảnh, ZIP (tối đa 5MB)
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                      {(() => {
                        const FileIcon = getFileIcon(selectedFile.type)
                        return <FileIcon className="h-8 w-8 text-primary" />
                      })()}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={clearSelectedFile}
                        className="text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {(formData.type === "document" || formData.type === "video" || formData.type === "link") && (
                <div className="space-y-2">
                  <Label className="text-foreground">URL / Đường dẫn</Label>
                  <Input
                    placeholder="https://..."
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
              )}

              {formData.type === "note" && (
                <div className="space-y-2">
                  <Label className="text-foreground">Nội dung ghi chú</Label>
                  <Textarea
                    placeholder="Ghi chú của bạn..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="bg-secondary border-border text-foreground resize-none"
                    rows={5}
                  />
                </div>
              )}

              <Button
                onClick={handleAddMaterial}
                disabled={!formData.title || !formData.subjectId || (formData.type === "file" && !selectedFile)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Thêm tài liệu
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tài liệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-secondary border-border text-foreground"
          />
        </div>
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-full sm:w-48 bg-secondary border-border text-foreground">
            <SelectValue placeholder="Lọc theo môn" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">Tất cả môn học</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-40 bg-secondary border-border text-foreground">
            <SelectValue placeholder="Lọc theo loại" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">Tất cả loại</SelectItem>
            {MATERIAL_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Materials by Subject */}
      {Object.keys(groupedMaterials).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedMaterials).map(([subjectId, subjectMaterials]) => {
            const subject = getSubject(subjectId)
            if (!subject) return null
            return (
              <Card key={subjectId} className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
                    {subject.code} - {subject.name}
                    <Badge variant="secondary" className="ml-2 bg-secondary text-muted-foreground">
                      {subjectMaterials.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {subjectMaterials.map((material) => {
                      const typeConfig = getTypeConfig(material.type)
                      const Icon =
                        material.type === "file" && material.fileType
                          ? getFileIcon(material.fileType)
                          : typeConfig?.icon || FileText
                      return (
                        <div key={material.id} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground">{material.title}</h4>
                            {material.content && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{material.content}</p>
                            )}
                            {material.type === "file" && material.fileName && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {material.fileName} {material.fileSize && `(${formatFileSize(material.fileSize)})`}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                                {typeConfig?.label}
                              </Badge>
                              {material.type === "file" && material.url && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownloadFile(material)}
                                  className="h-auto py-0.5 px-2 text-xs text-primary hover:text-primary/80"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Tải xuống
                                </Button>
                              )}
                              {material.type !== "file" && material.url && (
                                <a
                                  href={material.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  Mở link
                                </a>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteMaterialId(material.id)}
                            className="text-muted-foreground hover:text-destructive shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">Chưa có tài liệu nào</p>
            <p className="text-sm text-muted-foreground">Nhấn "Thêm tài liệu" để bắt đầu</p>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteMaterialId} onOpenChange={() => setDeleteMaterialId(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Xóa tài liệu?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Bạn có chắc muốn xóa tài liệu này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-foreground hover:bg-secondary">Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMaterial}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
