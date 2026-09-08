"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type {
  ComponentType,
  Dispatch,
  FormEvent,
  PointerEvent as ReactPointerEvent,
  SetStateAction,
} from "react"
import {
  Award,
  Bold,
  BriefcaseBusiness,
  Camera,
  Check,
  Cpu,
  Crop,
  FolderKanban,
  Heading3,
  Highlighter,
  ImageUp,
  Italic,
  KeyRound,
  Layers3,
  Link,
  List,
  Plus,
  Quote,
  Save,
  Tag,
  Trash2,
  UserRound,
  Wrench,
  X,
} from "lucide-react"
import Image from "next/image"
import type { AdminContentBundle } from "@/lib/admin/content"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ABOUT_HIGHLIGHTS,
  AboutRichText,
  type AboutHighlightTone,
} from "@/components/profile/about-rich-text"
import { Badge } from "@/components/ui/badge"
import { getSimpleIconUrl } from "@/lib/tech-icons"

type SectionId =
  | "profile"
  | "about"
  | "textTags"
  | "projects"
  | "techStack"
  | "achievements"
  | "experience"
  | "certificates"
  | "photography"
  | "utilities"

type FormState = Record<string, string | boolean>

const sections: {
  id: SectionId
  label: string
  icon: ComponentType<{ className?: string }>
}[] = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "about", label: "About", icon: Layers3 },
  { id: "textTags", label: "Text Tags", icon: Tag },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "techStack", label: "Tech Stack", icon: Cpu },
  { id: "achievements", label: "Achievements", icon: Award },
  { id: "experience", label: "Experience", icon: BriefcaseBusiness },
  { id: "certificates", label: "Certificates", icon: ImageUp },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "utilities", label: "Utilities", icon: Wrench },
]

const ADMIN_STORAGE_KEY = "portfolio-admin-password"

const defaultProject = {
  name: "",
  coverimage: "",
  description: "",
  githuburl: "",
  previewurl: "",
  tools: "",
}

const defaultAchievement = {
  title: "",
  year: "",
  issuer: "",
  sort_order: "0",
}

const defaultExperience = {
  title: "",
  company: "",
  type: "Experience",
  logo: "",
  from_date: "",
  to_date: "",
  description_list: "",
  skills: "",
  is_expanded: false,
  sort_order: "0",
}

const defaultCertificate = {
  title: "",
  issueddate: "",
  orgname: "",
  orglogo: "",
  url: "",
  pinned: false,
}

const defaultPhotography = {
  image_url: "",
  sort_order: "0",
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

type CropSelection = {
  fileName: string
  objectUrl: string
}

function ProfileCropper({
  selection,
  uploading,
  onCancel,
  onUpload,
}: {
  selection: CropSelection
  uploading: boolean
  onCancel: () => void
  onUpload: (file: File) => Promise<void>
}) {
  const imageRef = useRef<HTMLImageElement | null>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const dragRef = useRef<{ x: number; y: number } | null>(null)
  const [zoom, setZoom] = useState(1)
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [cropError, setCropError] = useState("")
  const [imageReady, setImageReady] = useState(false)

  useEffect(() => {
    const image = imageRef.current
    const canvas = previewCanvasRef.current
    const context = canvas?.getContext("2d")

    if (!imageReady || !image || !canvas || !context) return

    const size = canvas.width
    const baseScale = Math.max(
      size / image.naturalWidth,
      size / image.naturalHeight
    )
    const scale = baseScale * zoom
    const drawWidth = image.naturalWidth * scale
    const drawHeight = image.naturalHeight * scale
    const maxOffsetX = Math.max(0, (drawWidth - size) / 2)
    const maxOffsetY = Math.max(0, (drawHeight - size) / 2)

    context.clearRect(0, 0, size, size)
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = "high"
    context.drawImage(
      image,
      (size - drawWidth) / 2 + (positionX / 100) * maxOffsetX,
      (size - drawHeight) / 2 + (positionY / 100) * maxOffsetY,
      drawWidth,
      drawHeight
    )
  }, [imageReady, positionX, positionY, zoom])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { x: event.clientX, y: event.clientY }
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const previous = dragRef.current
    if (!previous) return

    const deltaX = event.clientX - previous.x
    const deltaY = event.clientY - previous.y
    dragRef.current = { x: event.clientX, y: event.clientY }
    setPositionX((value) => clamp(value + deltaX * 0.8, -100, 100))
    setPositionY((value) => clamp(value + deltaY * 0.8, -100, 100))
  }

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragRef.current = null
  }

  const createCroppedFile = async () => {
    const image = imageRef.current
    if (!image || !image.naturalWidth || !image.naturalHeight) {
      throw new Error("The selected image is not ready yet.")
    }

    const size = 512
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext("2d")

    if (!context) {
      throw new Error("Your browser could not prepare the cropped image.")
    }

    const baseScale = Math.max(
      size / image.naturalWidth,
      size / image.naturalHeight
    )
    const scale = baseScale * zoom
    const drawWidth = image.naturalWidth * scale
    const drawHeight = image.naturalHeight * scale
    const maxOffsetX = Math.max(0, (drawWidth - size) / 2)
    const maxOffsetY = Math.max(0, (drawHeight - size) / 2)
    const offsetX = (positionX / 100) * maxOffsetX
    const offsetY = (positionY / 100) * maxOffsetY

    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = "high"
    context.drawImage(
      image,
      (size - drawWidth) / 2 + offsetX,
      (size - drawHeight) / 2 + offsetY,
      drawWidth,
      drawHeight
    )

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.9)
    )

    if (!blob) {
      throw new Error("The cropped image could not be created.")
    }

    const baseName = selection.fileName.replace(/\.[^.]+$/, "") || "avatar"
    return new File([blob], `${baseName}-cropped.webp`, {
      type: "image/webp",
    })
  }

  const handleApply = async () => {
    setProcessing(true)
    setCropError("")
    try {
      await onUpload(await createCroppedFile())
    } catch (error) {
      setCropError(
        error instanceof Error ? error.message : "Could not crop this image."
      )
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="border-edge bg-background grid gap-4 rounded-md border p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-pixelify text-lg font-bold">Crop picture</h3>
          <p className="text-muted-foreground text-sm">
            Drag with a mouse or finger, then fine-tune with the controls.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
          disabled={uploading || processing}
          aria-label="Cancel crop"
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(260px,420px)_1fr]">
        <div
          className="border-edge bg-muted relative mx-auto aspect-square w-full max-w-[420px] cursor-grab touch-none overflow-hidden overscroll-contain rounded-md border active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={selection.objectUrl}
            alt="Profile crop preview"
            draggable={false}
            className="hidden"
            onLoad={() => setImageReady(true)}
          />
          <canvas
            ref={previewCanvasRef}
            width={512}
            height={512}
            className="pointer-events-none h-full w-full"
            aria-label="Profile crop preview"
          />
          <div className="pointer-events-none absolute inset-0 rounded-full border-[3px] border-white/90 shadow-[0_0_0_999px_rgba(0,0,0,0.42)]" />
          <div className="pointer-events-none absolute inset-1/3 border border-white/45" />
        </div>

        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-muted-foreground font-mono text-[11px] uppercase">
              Zoom
            </span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="h-10 w-full touch-pan-x"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-muted-foreground font-mono text-[11px] uppercase">
              Horizontal position
            </span>
            <input
              type="range"
              min="-100"
              max="100"
              value={positionX}
              onChange={(event) => setPositionX(Number(event.target.value))}
              className="h-10 w-full touch-pan-x"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-muted-foreground font-mono text-[11px] uppercase">
              Vertical position
            </span>
            <input
              type="range"
              min="-100"
              max="100"
              value={positionY}
              onChange={(event) => setPositionY(Number(event.target.value))}
              className="h-10 w-full touch-pan-x"
            />
          </label>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setZoom(1)
                setPositionX(0)
                setPositionY(0)
              }}
              disabled={uploading || processing}
            >
              Reset
            </Button>
            <Button
              type="button"
              onClick={() => void handleApply()}
              disabled={uploading || processing}
            >
              <Check className="size-4" />
              {uploading || processing ? "Preparing..." : "Crop & upload"}
            </Button>
          </div>
          {cropError && (
            <p className="text-destructive text-sm" role="alert">
              {cropError}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-muted-foreground font-mono text-[11px] uppercase">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        className="border-edge bg-background text-primary focus:border-primary/40 focus:ring-primary/10 h-10 min-w-0 rounded-md border px-3 text-sm transition outline-none focus:ring-2"
      />
    </label>
  )
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  textAreaRef,
  onSelect,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  textAreaRef?: React.RefObject<HTMLTextAreaElement | null>
  onSelect?: () => void
}) {
  return (
    <label className="grid min-w-0 gap-1.5">
      <span className="text-muted-foreground font-mono text-[11px] uppercase">
        {label}
      </span>
      <textarea
        ref={textAreaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onSelect={onSelect}
        onKeyUp={onSelect}
        onClick={onSelect}
        placeholder={placeholder}
        rows={rows}
        className="border-edge bg-background text-primary focus:border-primary/40 focus:ring-primary/10 min-h-28 min-w-0 rounded-md border px-3 py-2 text-sm leading-relaxed transition outline-none focus:ring-2"
      />
    </label>
  )
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="border-edge flex min-h-10 items-center gap-2 rounded-md border px-3 py-2 text-sm">
      <input
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
        className="size-4"
      />
      {label}
    </label>
  )
}

function DeleteButton({
  onClick,
  disabled,
}: {
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      disabled={disabled}
      onClick={onClick}
      title={disabled ? "Synced after database setup" : "Delete"}
      className="text-muted-foreground hover:text-destructive shrink-0"
    >
      <Trash2 className="size-4" />
      <span className="sr-only">Delete</span>
    </Button>
  )
}

function ImageField({
  label,
  value,
  onChange,
  uploading,
  onUpload,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  uploading: boolean
  onUpload: (file: File, onUrl: (url: string) => void) => void
}) {
  return (
    <div className="grid min-w-0 gap-1.5">
      <span className="text-muted-foreground font-mono text-[11px] uppercase">
        {label}
      </span>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://res.cloudinary.com/..."
          className="border-edge bg-background text-primary focus:border-primary/40 focus:ring-primary/10 h-10 min-w-0 rounded-md border px-3 text-sm transition outline-none focus:ring-2"
        />
        <label className="border-edge bg-secondary hover:bg-accent inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition">
          <ImageUp className="size-4" />
          {uploading ? "Uploading" : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) onUpload(file, onChange)
            }}
          />
        </label>
      </div>
    </div>
  )
}

export function AdminDashboard({
  initialContent,
}: {
  initialContent: AdminContentBundle
}) {
  const [content, setContent] = useState(initialContent)
  const [activeSection, setActiveSection] = useState<SectionId>("profile")
  const [password, setPassword] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [profileAvatarUrl, setProfileAvatarUrl] = useState(
    initialContent.profile.avatarUrl
  )
  const [cropSelection, setCropSelection] = useState<CropSelection | null>(null)
  const [aboutMarkdown, setAboutMarkdown] = useState(
    initialContent.about.markdown
  )
  const aboutTextAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [aboutSelection, setAboutSelection] = useState({ start: 0, end: 0 })
  const [focusAreas, setFocusAreas] = useState(
    initialContent.about.focusAreas.join(", ")
  )
  const [resumeUrl, setResumeUrl] = useState(initialContent.about.resumeUrl)
  const [resumeLabel, setResumeLabel] = useState(
    initialContent.about.resumeLabel
  )
  const [secondaryLinkUrl, setSecondaryLinkUrl] = useState(
    initialContent.about.secondaryLinkUrl
  )
  const [secondaryLinkLabel, setSecondaryLinkLabel] = useState(
    initialContent.about.secondaryLinkLabel
  )
  const [tagText, setTagText] = useState("")
  const [techStackName, setTechStackName] = useState("")
  const [projectForm, setProjectForm] = useState<FormState>(defaultProject)
  const [achievementForm, setAchievementForm] =
    useState<FormState>(defaultAchievement)
  const [experienceForm, setExperienceForm] =
    useState<FormState>(defaultExperience)
  const [certificateForm, setCertificateForm] =
    useState<FormState>(defaultCertificate)
  const [photographyForm, setPhotographyForm] =
    useState<FormState>(defaultPhotography)
  const [categoryForm, setCategoryForm] = useState<FormState>({
    id: "",
    title: "",
    description: "",
    sort_order: "0",
  })
  const [utilityItemForm, setUtilityItemForm] = useState<FormState>({
    category_id: initialContent.utilities[0]?.id ?? "",
    key: "",
    name: "",
    description: "",
    url: "",
    sort_order: "0",
  })

  const locked = !password

  const counts = useMemo(
    () => ({
      textTags: content.textTags.length,
      projects: content.projects.length,
      techStack: content.techStack.length,
      achievements: content.achievements.length,
      experience: content.experience.length,
      certificates: content.certificates.length,
      photography: content.photography.length,
      utilities: content.utilities.reduce(
        (total, category) => total + category.items.length,
        content.utilities.length
      ),
    }),
    [content]
  )

  useEffect(() => {
    const storedPassword = window.sessionStorage.getItem(ADMIN_STORAGE_KEY)
    if (storedPassword) {
      setPassword(storedPassword)
      setPasswordInput(storedPassword)
    }
  }, [])

  useEffect(() => {
    if (!cropSelection) return

    return () => URL.revokeObjectURL(cropSelection.objectUrl)
  }, [cropSelection])

  const updateForm = (
    setter: Dispatch<SetStateAction<FormState>>,
    key: string,
    value: string | boolean
  ) => {
    setter((current) => ({ ...current, [key]: value }))
  }

  const uploadImage = async (file: File, onUrl: (url: string) => void) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      setMessage("Cloudinary cloud name and upload preset are not configured.")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)

    setUploading(true)
    setMessage("")

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      )
      const result = (await response.json()) as { secure_url?: string }

      if (!response.ok || !result.secure_url) {
        throw new Error("Cloudinary upload failed.")
      }

      onUrl(result.secure_url)
      setMessage("Image uploaded.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.")
    } finally {
      setUploading(false)
    }
  }

  const uploadProfileImage = async (file: File) => {
    const formData = new FormData()
    formData.append("password", password)
    formData.append("file", file)

    setUploading(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/profile-image", {
        method: "POST",
        body: formData,
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Profile image upload failed.")
      }

      const nextContent = result as AdminContentBundle
      setContent(nextContent)
      setProfileAvatarUrl(nextContent.profile.avatarUrl)
      setCropSelection(null)
      setMessage("Profile picture updated.")
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Profile image upload failed."
      )
    } finally {
      setUploading(false)
    }
  }

  const selectProfileImage = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"]

    if (!allowedTypes.includes(file.type)) {
      setMessage("Use a JPG, PNG, WebP, or AVIF image.")
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      setMessage("Choose an image smaller than 15 MB.")
      return
    }

    setMessage("")
    setCropSelection({
      fileName: file.name,
      objectUrl: URL.createObjectURL(file),
    })
  }

  const callAdmin = async (
    method: "POST" | "DELETE",
    section: string,
    data?: Record<string, unknown>,
    id?: string
  ) => {
    setBusy(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/content", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, section, data, id }),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Admin action failed.")
      }

      setContent(result as AdminContentBundle)
      setMessage(method === "DELETE" ? "Deleted." : "Saved.")
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Admin action failed."
      )
    } finally {
      setBusy(false)
    }
  }

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPassword(passwordInput)
    window.sessionStorage.setItem(ADMIN_STORAGE_KEY, passwordInput)
  }

  const handleAboutSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void callAdmin("POST", "about", {
      markdown: aboutMarkdown,
      paragraphs: aboutMarkdown.split(/\n{2,}/).map((item) => item.trim()),
      focusAreas,
      resumeUrl,
      resumeLabel,
      secondaryLinkUrl,
      secondaryLinkLabel,
    })
  }

  const syncAboutSelection = () => {
    const textarea = aboutTextAreaRef.current

    if (!textarea) {
      return
    }

    setAboutSelection({
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    })
  }

  const updateAboutSelection = (start: number, end: number) => {
    window.requestAnimationFrame(() => {
      const textarea = aboutTextAreaRef.current
      textarea?.focus()
      textarea?.setSelectionRange(start, end)
      setAboutSelection({ start, end })
    })
  }

  const formatAboutSelection = ({
    prefix,
    suffix = "",
    placeholder,
    block = false,
  }: {
    prefix: string
    suffix?: string
    placeholder: string
    block?: boolean
  }) => {
    const start = aboutSelection.start
    const end = aboutSelection.end
    const selectedText = aboutMarkdown.slice(start, end) || placeholder
    const before = aboutMarkdown.slice(0, start)
    const after = aboutMarkdown.slice(end)
    const leadingBreak = block && before && !before.endsWith("\n") ? "\n" : ""
    const trailingBreak = block && after && !after.startsWith("\n") ? "\n" : ""
    const replacement = `${leadingBreak}${prefix}${selectedText}${suffix}${trailingBreak}`
    const nextValue = `${before}${replacement}${after}`
    const selectionStart = start + leadingBreak.length + prefix.length
    const selectionEnd = selectionStart + selectedText.length

    setAboutMarkdown(nextValue)
    updateAboutSelection(selectionStart, selectionEnd)
  }

  const formatAboutLink = () => {
    const start = aboutSelection.start
    const end = aboutSelection.end
    const selectedText = aboutMarkdown.slice(start, end) || "linked word"
    const before = aboutMarkdown.slice(0, start)
    const after = aboutMarkdown.slice(end)
    const replacement = `[${selectedText}](https://example.com)`
    const nextValue = `${before}${replacement}${after}`
    const urlStart = start + selectedText.length + 3
    const urlEnd = urlStart + "https://example.com".length

    setAboutMarkdown(nextValue)
    updateAboutSelection(urlStart, urlEnd)
  }

  const formatAboutHighlight = (tone: AboutHighlightTone) => {
    const start = aboutSelection.start
    const end = aboutSelection.end
    const selectedText = aboutMarkdown.slice(start, end) || "highlighted words"
    const before = aboutMarkdown.slice(0, start)
    const after = aboutMarkdown.slice(end)
    const replacement = selectedText
      .split(/\r?\n/)
      .map((line) => (line ? `==${tone}:${line}==` : line))
      .join("\n")
    const nextValue = `${before}${replacement}${after}`

    setAboutMarkdown(nextValue)
    updateAboutSelection(start, start + replacement.length)
  }

  const handleCategoryTitle = (value: string) => {
    updateForm(setCategoryForm, "title", value)
    updateForm(setCategoryForm, "id", slugify(value))
  }

  return (
    <main className="bg-background min-h-screen overflow-x-hidden">
      <div className="border-edge border-b">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-3 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-muted-foreground font-mono text-xs uppercase">
              Portfolio Control Room
            </p>
            <h1 className="font-pixelify text-primary mt-1 text-2xl font-bold sm:text-4xl">
              Admin Board
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3 xl:grid-cols-6">
            {Object.entries(counts).map(([key, value]) => (
              <div
                key={key}
                className="border-edge min-w-0 rounded-md border px-2 py-2 text-center sm:px-3"
              >
                <div className="text-primary font-mono text-base">{value}</div>
                <div className="text-muted-foreground text-[10px] leading-tight break-words capitalize sm:text-[11px]">
                  {key.replace(/([A-Z])/g, " $1")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {locked ? (
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-3 sm:px-4">
          <form
            onSubmit={handleLogin}
            className="border-edge bg-card grid w-full gap-4 rounded-lg border p-5 shadow-sm"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="border-edge bg-secondary flex size-10 items-center justify-center rounded-md border">
                <KeyRound className="size-5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-pixelify text-xl font-bold">Unlock</h2>
                <p className="text-muted-foreground text-sm">
                  Enter the permanent admin password.
                </p>
              </div>
            </div>
            <Field
              label="Password"
              type="password"
              value={passwordInput}
              onChange={setPasswordInput}
            />
            <Button type="submit" className="w-full">
              Open Admin Board
            </Button>
          </form>
        </div>
      ) : (
        <div className="mx-auto grid max-w-7xl gap-4 px-3 py-4 sm:px-6 sm:py-5 lg:grid-cols-[220px_1fr]">
          <aside className="border-edge bg-card h-fit overflow-x-auto rounded-lg border p-2 lg:overflow-visible">
            <nav className="grid min-w-max auto-cols-[minmax(7.5rem,1fr)] grid-flow-col gap-1 lg:min-w-0 lg:auto-cols-auto lg:grid-flow-row">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm transition lg:justify-start lg:text-left",
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-primary"
                    )}
                  >
                    <Icon className="size-4" />
                    {section.label}
                  </button>
                )
              })}
            </nav>
          </aside>

          <section className="border-edge bg-card min-w-0 rounded-lg border">
            <div className="border-edge flex min-h-12 flex-wrap items-center justify-between gap-2 border-b px-3 py-2 sm:px-4">
              <h2 className="font-pixelify min-w-0 text-lg font-bold sm:text-xl">
                {sections.find((item) => item.id === activeSection)?.label}
              </h2>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setPassword("")
                  window.sessionStorage.removeItem(ADMIN_STORAGE_KEY)
                }}
              >
                Lock
              </Button>
            </div>

            {message && (
              <div className="border-edge border-b px-3 py-2 text-sm break-words sm:px-4">
                {message}
              </div>
            )}

            <div className="grid min-w-0 gap-5 p-3 sm:p-4">
              {activeSection === "profile" && (
                <div className="grid gap-5">
                  <div className="border-edge bg-background flex flex-col items-center gap-4 rounded-md border p-4 sm:flex-row sm:items-start">
                    <Image
                      src={profileAvatarUrl}
                      alt="Current profile picture"
                      width={160}
                      height={160}
                      unoptimized
                      className="ring-border size-32 rounded-full object-cover object-center ring-1 sm:size-40"
                    />
                    <div className="grid flex-1 gap-2 text-center sm:text-left">
                      <h3 className="font-pixelify text-lg font-bold">
                        Profile picture
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Choose a JPG, PNG, WebP, or AVIF image, crop it, then
                        upload. The new picture will be used everywhere,
                        including MDX profile images.
                      </p>
                      <label className="border-edge bg-secondary hover:bg-accent mt-2 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition sm:w-fit">
                        <Crop className="size-4" />
                        {uploading ? "Uploading..." : "Choose & crop picture"}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          disabled={uploading}
                          className="sr-only"
                          onChange={(event) => {
                            const file = event.target.files?.[0]
                            if (file) selectProfileImage(file)
                            event.currentTarget.value = ""
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  {cropSelection && (
                    <ProfileCropper
                      selection={cropSelection}
                      uploading={uploading}
                      onCancel={() => setCropSelection(null)}
                      onUpload={uploadProfileImage}
                    />
                  )}
                </div>
              )}

              {activeSection === "about" && (
                <form onSubmit={handleAboutSave} className="grid gap-4">
                  <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-7">
                    <Button
                      type="button"
                      variant="outline"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() =>
                        formatAboutSelection({
                          prefix: "**",
                          suffix: "**",
                          placeholder: "bold words",
                        })
                      }
                    >
                      <Bold className="size-4" />
                      Bold
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() =>
                        formatAboutSelection({
                          prefix: "*",
                          suffix: "*",
                          placeholder: "italic words",
                        })
                      }
                    >
                      <Italic className="size-4" />
                      Italic
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={formatAboutLink}
                    >
                      <Link className="size-4" />
                      Link
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() =>
                        formatAboutSelection({
                          prefix: "### ",
                          placeholder: "Small heading",
                          block: true,
                        })
                      }
                    >
                      <Heading3 className="size-4" />
                      Heading
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() =>
                        formatAboutSelection({
                          prefix: "- ",
                          placeholder: "New highlight",
                          block: true,
                        })
                      }
                    >
                      <List className="size-4" />
                      Bullet
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() =>
                        formatAboutSelection({
                          prefix: "> ",
                          placeholder: "Short note",
                          block: true,
                        })
                      }
                    >
                      <Quote className="size-4" />
                      Quote
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() =>
                        formatAboutSelection({
                          prefix: "",
                          placeholder: "<ProfileImage />",
                          block: true,
                        })
                      }
                    >
                      <ImageUp className="size-4" />
                      Profile
                    </Button>
                  </div>
                  <div className="border-edge bg-background flex flex-col gap-3 rounded-md border p-3 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 items-center gap-2">
                      <Highlighter className="text-muted-foreground size-4 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium">Text highlight</p>
                        <p className="text-muted-foreground text-xs">
                          Select a word or sentence, then choose a color.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:ml-auto sm:flex sm:flex-wrap">
                      {(
                        Object.entries(ABOUT_HIGHLIGHTS) as [
                          AboutHighlightTone,
                          (typeof ABOUT_HIGHLIGHTS)[AboutHighlightTone],
                        ][]
                      ).map(([tone, highlight]) => (
                        <Button
                          key={tone}
                          type="button"
                          variant="outline"
                          size="sm"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => formatAboutHighlight(tone)}
                          className="justify-start sm:justify-center"
                          title={`Highlight selected text in ${highlight.label.toLowerCase()}`}
                        >
                          <span
                            className={cn(
                              "ring-edge size-3 rounded-sm ring-1",
                              highlight.swatchClassName
                            )}
                            aria-hidden
                          />
                          {highlight.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <TextArea
                    label="About Body"
                    value={aboutMarkdown}
                    onChange={setAboutMarkdown}
                    rows={12}
                    textAreaRef={aboutTextAreaRef}
                    onSelect={syncAboutSelection}
                  />
                  <Field
                    label="Focus Areas"
                    value={focusAreas}
                    onChange={setFocusAreas}
                    placeholder="AI Agents, LLMs, RAG"
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field
                      label="Primary Link Label"
                      value={resumeLabel}
                      onChange={setResumeLabel}
                    />
                    <Field
                      label="Primary Link URL"
                      value={resumeUrl}
                      onChange={setResumeUrl}
                    />
                    <Field
                      label="Secondary Link Label"
                      value={secondaryLinkLabel}
                      onChange={setSecondaryLinkLabel}
                    />
                    <Field
                      label="Secondary Link URL"
                      value={secondaryLinkUrl}
                      onChange={setSecondaryLinkUrl}
                    />
                  </div>
                  <div className="border-edge bg-background grid gap-3 rounded-md border p-3">
                    <AboutRichText
                      markdown={aboutMarkdown}
                      profileAvatarUrl={profileAvatarUrl}
                    />
                    {focusAreas.trim() && (
                      <div className="flex flex-wrap gap-1.5">
                        {focusAreas
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean)
                          .map((item) => (
                            <Badge key={item} variant="outline">
                              {item}
                            </Badge>
                          ))}
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={busy}
                    className="w-full sm:w-fit"
                  >
                    <Save className="size-4" />
                    Save About
                  </Button>
                </form>
              )}

              {activeSection === "textTags" && (
                <>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault()
                      void callAdmin("POST", "textTags", {
                        text: tagText,
                        sort_order: content.textTags.length,
                      })
                      setTagText("")
                    }}
                    className="grid gap-3 sm:grid-cols-[1fr_auto]"
                  >
                    <Field
                      label="New Text Tag"
                      value={tagText}
                      onChange={setTagText}
                    />
                    <Button
                      type="submit"
                      disabled={busy}
                      className="w-full self-end sm:w-fit"
                    >
                      <Plus className="size-4" />
                      Add
                    </Button>
                  </form>
                  <div className="grid gap-2">
                    {content.textTags.map((tag) => (
                      <div
                        key={tag.id}
                        className="border-edge flex min-w-0 items-center justify-between gap-2 rounded-md border px-3 py-2"
                      >
                        <span className="min-w-0 text-sm break-words">
                          {tag.text}
                        </span>
                        <DeleteButton
                          disabled={tag.id.startsWith("fallback-")}
                          onClick={() =>
                            void callAdmin(
                              "DELETE",
                              "textTags",
                              undefined,
                              tag.id
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeSection === "projects" && (
                <>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault()
                      void callAdmin("POST", "projects", projectForm)
                      setProjectForm(defaultProject)
                    }}
                    className="grid gap-4"
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field
                        label="Name"
                        value={String(projectForm.name)}
                        onChange={(value) =>
                          updateForm(setProjectForm, "name", value)
                        }
                      />
                      <Field
                        label="GitHub URL"
                        value={String(projectForm.githuburl)}
                        onChange={(value) =>
                          updateForm(setProjectForm, "githuburl", value)
                        }
                      />
                      <Field
                        label="Preview URL"
                        value={String(projectForm.previewurl)}
                        onChange={(value) =>
                          updateForm(setProjectForm, "previewurl", value)
                        }
                      />
                      <Field
                        label="Tools"
                        value={String(projectForm.tools)}
                        onChange={(value) =>
                          updateForm(setProjectForm, "tools", value)
                        }
                        placeholder="Next.js, Supabase, Docker"
                      />
                    </div>
                    <ImageField
                      label="Cover Image"
                      value={String(projectForm.coverimage)}
                      uploading={uploading}
                      onUpload={uploadImage}
                      onChange={(value) =>
                        updateForm(setProjectForm, "coverimage", value)
                      }
                    />
                    <TextArea
                      label="Description"
                      value={String(projectForm.description)}
                      onChange={(value) =>
                        updateForm(setProjectForm, "description", value)
                      }
                    />
                    <Button
                      type="submit"
                      disabled={busy}
                      className="w-full sm:w-fit"
                    >
                      <Plus className="size-4" />
                      Add Project
                    </Button>
                  </form>
                  <div className="grid gap-2">
                    {content.projects.map((project) => (
                      <div
                        key={project.id}
                        className="border-edge flex items-center justify-between gap-3 rounded-md border px-3 py-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {project.title}
                          </p>
                          <p className="text-muted-foreground truncate text-xs">
                            {project.githubLink}
                          </p>
                        </div>
                        <DeleteButton
                          onClick={() =>
                            void callAdmin(
                              "DELETE",
                              "projects",
                              undefined,
                              project.id
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeSection === "techStack" && (
                <>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault()
                      void callAdmin("POST", "techStack", {
                        name: techStackName,
                        sort_order: content.techStack.length,
                      })
                      setTechStackName("")
                    }}
                    className="grid gap-3 sm:grid-cols-[1fr_auto]"
                  >
                    <Field
                      label="Technology Name"
                      value={techStackName}
                      onChange={setTechStackName}
                      placeholder="Next.js"
                    />
                    <Button
                      type="submit"
                      disabled={busy}
                      className="w-full self-end sm:w-fit"
                    >
                      <Plus className="size-4" />
                      Add
                    </Button>
                  </form>

                  {techStackName.trim() && (
                    <div className="border-edge bg-background flex min-w-0 items-center gap-3 rounded-md border px-3 py-2">
                      <img
                        src={getSimpleIconUrl(techStackName)}
                        alt=""
                        width={32}
                        height={32}
                        className="size-8 shrink-0 object-contain dark:invert"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium">Logo preview</p>
                        <p className="text-muted-foreground text-xs break-all">
                          {getSimpleIconUrl(techStackName)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {content.techStack.map((item) => (
                      <div
                        key={item.id ?? item.key}
                        className="border-edge flex min-w-0 items-center justify-between gap-3 rounded-md border px-3 py-2"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <img
                            src={item.icon}
                            alt=""
                            width={32}
                            height={32}
                            className="size-8 shrink-0 object-contain dark:invert"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {item.title}
                            </p>
                            <p className="text-muted-foreground truncate text-xs">
                              {item.key}
                            </p>
                          </div>
                        </div>
                        <DeleteButton
                          disabled={!item.id}
                          onClick={() =>
                            item.id &&
                            void callAdmin(
                              "DELETE",
                              "techStack",
                              undefined,
                              item.id
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeSection === "achievements" && (
                <>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault()
                      void callAdmin("POST", "achievements", achievementForm)
                      setAchievementForm(defaultAchievement)
                    }}
                    className="grid gap-3 md:grid-cols-4"
                  >
                    <Field
                      label="Title"
                      value={String(achievementForm.title)}
                      onChange={(value) =>
                        updateForm(setAchievementForm, "title", value)
                      }
                    />
                    <Field
                      label="Year"
                      value={String(achievementForm.year)}
                      onChange={(value) =>
                        updateForm(setAchievementForm, "year", value)
                      }
                    />
                    <Field
                      label="Issuer"
                      value={String(achievementForm.issuer)}
                      onChange={(value) =>
                        updateForm(setAchievementForm, "issuer", value)
                      }
                    />
                    <Button
                      type="submit"
                      disabled={busy}
                      className="w-full self-end sm:w-fit"
                    >
                      <Plus className="size-4" />
                      Add
                    </Button>
                  </form>
                  <div className="grid gap-2">
                    {content.achievements.map((achievement, index) => (
                      <div
                        key={achievement.id ?? `${achievement.title}-${index}`}
                        className="border-edge flex min-w-0 items-center justify-between gap-2 rounded-md border px-3 py-2"
                      >
                        <span className="min-w-0 text-sm break-words">
                          {achievement.title} - {achievement.year}
                        </span>
                        <DeleteButton
                          disabled={!achievement.id}
                          onClick={() =>
                            achievement.id &&
                            void callAdmin(
                              "DELETE",
                              "achievements",
                              undefined,
                              achievement.id
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeSection === "experience" && (
                <>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault()
                      void callAdmin("POST", "experience", experienceForm)
                      setExperienceForm(defaultExperience)
                    }}
                    className="grid gap-4"
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field
                        label="Title"
                        value={String(experienceForm.title)}
                        onChange={(value) =>
                          updateForm(setExperienceForm, "title", value)
                        }
                      />
                      <Field
                        label="Company"
                        value={String(experienceForm.company)}
                        onChange={(value) =>
                          updateForm(setExperienceForm, "company", value)
                        }
                      />
                      <Field
                        label="Type"
                        value={String(experienceForm.type)}
                        onChange={(value) =>
                          updateForm(setExperienceForm, "type", value)
                        }
                      />
                      <ImageField
                        label="Logo"
                        value={String(experienceForm.logo)}
                        uploading={uploading}
                        onUpload={uploadImage}
                        onChange={(value) =>
                          updateForm(setExperienceForm, "logo", value)
                        }
                      />
                      <Field
                        label="From"
                        type="date"
                        value={String(experienceForm.from_date)}
                        onChange={(value) =>
                          updateForm(setExperienceForm, "from_date", value)
                        }
                      />
                      <Field
                        label="To"
                        type="date"
                        value={String(experienceForm.to_date)}
                        onChange={(value) =>
                          updateForm(setExperienceForm, "to_date", value)
                        }
                      />
                    </div>
                    <TextArea
                      label="Description Lines"
                      value={String(experienceForm.description_list)}
                      onChange={(value) =>
                        updateForm(setExperienceForm, "description_list", value)
                      }
                    />
                    <Field
                      label="Skills"
                      value={String(experienceForm.skills)}
                      onChange={(value) =>
                        updateForm(setExperienceForm, "skills", value)
                      }
                      placeholder="AWS, Docker, CI/CD"
                    />
                    <CheckboxField
                      label="Expanded by default"
                      checked={Boolean(experienceForm.is_expanded)}
                      onChange={(value) =>
                        updateForm(setExperienceForm, "is_expanded", value)
                      }
                    />
                    <Button
                      type="submit"
                      disabled={busy}
                      className="w-full sm:w-fit"
                    >
                      <Plus className="size-4" />
                      Add Experience
                    </Button>
                  </form>
                  <div className="grid gap-2">
                    {content.experience.map((item, index) => (
                      <div
                        key={
                          item.id ?? `${item.company}-${item.title}-${index}`
                        }
                        className="border-edge flex min-w-0 items-center justify-between gap-2 rounded-md border px-3 py-2"
                      >
                        <span className="min-w-0 text-sm break-words">
                          {item.title} - {item.company}
                        </span>
                        <DeleteButton
                          disabled={!item.id}
                          onClick={() =>
                            item.id &&
                            void callAdmin(
                              "DELETE",
                              "experience",
                              undefined,
                              item.id
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeSection === "certificates" && (
                <>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault()
                      void callAdmin("POST", "certificates", certificateForm)
                      setCertificateForm(defaultCertificate)
                    }}
                    className="grid gap-4"
                  >
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field
                        label="Title"
                        value={String(certificateForm.title)}
                        onChange={(value) =>
                          updateForm(setCertificateForm, "title", value)
                        }
                      />
                      <Field
                        label="Issued Date"
                        type="date"
                        value={String(certificateForm.issueddate)}
                        onChange={(value) =>
                          updateForm(setCertificateForm, "issueddate", value)
                        }
                      />
                      <Field
                        label="Organization"
                        value={String(certificateForm.orgname)}
                        onChange={(value) =>
                          updateForm(setCertificateForm, "orgname", value)
                        }
                      />
                      <Field
                        label="Certificate URL"
                        value={String(certificateForm.url)}
                        onChange={(value) =>
                          updateForm(setCertificateForm, "url", value)
                        }
                      />
                    </div>
                    <ImageField
                      label="Organization Logo"
                      value={String(certificateForm.orglogo)}
                      uploading={uploading}
                      onUpload={uploadImage}
                      onChange={(value) =>
                        updateForm(setCertificateForm, "orglogo", value)
                      }
                    />
                    <CheckboxField
                      label="Pinned"
                      checked={Boolean(certificateForm.pinned)}
                      onChange={(value) =>
                        updateForm(setCertificateForm, "pinned", value)
                      }
                    />
                    <Button
                      type="submit"
                      disabled={busy}
                      className="w-full sm:w-fit"
                    >
                      <Plus className="size-4" />
                      Add Certificate
                    </Button>
                  </form>
                  <div className="grid gap-2">
                    {content.certificates.map((certificate) => (
                      <div
                        key={certificate.id}
                        className="border-edge flex min-w-0 items-center justify-between gap-2 rounded-md border px-3 py-2"
                      >
                        <span className="min-w-0 text-sm break-words">
                          {certificate.title} - {certificate.orgname}
                        </span>
                        <DeleteButton
                          onClick={() =>
                            void callAdmin(
                              "DELETE",
                              "certificates",
                              undefined,
                              certificate.id
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeSection === "photography" && (
                <>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault()
                      void callAdmin("POST", "photography", {
                        ...photographyForm,
                        sort_order: content.photography.length,
                      })
                      setPhotographyForm(defaultPhotography)
                    }}
                    className="grid gap-4"
                  >
                    <ImageField
                      label="Photo"
                      value={String(photographyForm.image_url)}
                      uploading={uploading}
                      onUpload={uploadImage}
                      onChange={(value) =>
                        updateForm(setPhotographyForm, "image_url", value)
                      }
                    />
                    <Button
                      type="submit"
                      disabled={busy || uploading}
                      className="w-full sm:w-fit"
                    >
                      <Plus className="size-4" />
                      Add Photo
                    </Button>
                  </form>

                  <div className="grid gap-2">
                    {content.photography.length === 0 && (
                      <div className="border-edge text-muted-foreground rounded-md border px-3 py-4 text-sm">
                        Upload a photo and it will appear on the public
                        Photography page.
                      </div>
                    )}
                    {content.photography.map((photo) => (
                      <div
                        key={photo.id}
                        className="border-edge flex min-w-0 items-center justify-between gap-3 rounded-md border p-2"
                      >
                        <div className="relative aspect-video min-h-16 flex-1 overflow-hidden rounded-md border">
                          <Image
                            src={photo.image_url}
                            alt="Photography upload"
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <DeleteButton
                          onClick={() =>
                            void callAdmin(
                              "DELETE",
                              "photography",
                              undefined,
                              photo.id
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeSection === "utilities" && (
                <>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault()
                      void callAdmin("POST", "utilityCategories", categoryForm)
                      setCategoryForm({
                        id: "",
                        title: "",
                        description: "",
                        sort_order: "0",
                      })
                    }}
                    className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
                  >
                    <Field
                      label="Category Title"
                      value={String(categoryForm.title)}
                      onChange={handleCategoryTitle}
                    />
                    <Field
                      label="Description"
                      value={String(categoryForm.description)}
                      onChange={(value) =>
                        updateForm(setCategoryForm, "description", value)
                      }
                    />
                    <Button
                      type="submit"
                      disabled={busy}
                      className="w-full self-end sm:w-fit"
                    >
                      <Plus className="size-4" />
                      Add Category
                    </Button>
                  </form>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault()
                      void callAdmin("POST", "utilityItems", utilityItemForm)
                      setUtilityItemForm((current) => ({
                        ...current,
                        key: "",
                        name: "",
                        description: "",
                        url: "",
                        sort_order: "0",
                      }))
                    }}
                    className="grid gap-3"
                  >
                    <div className="grid gap-3 md:grid-cols-3">
                      <label className="grid min-w-0 gap-1.5">
                        <span className="text-muted-foreground font-mono text-[11px] uppercase">
                          Category
                        </span>
                        <select
                          value={String(utilityItemForm.category_id)}
                          onChange={(event) =>
                            updateForm(
                              setUtilityItemForm,
                              "category_id",
                              event.target.value
                            )
                          }
                          className="border-edge bg-background text-primary h-10 min-w-0 rounded-md border px-3 text-sm outline-none"
                        >
                          {content.utilities.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.title}
                            </option>
                          ))}
                        </select>
                      </label>
                      <Field
                        label="Icon Key"
                        value={String(utilityItemForm.key)}
                        onChange={(value) =>
                          updateForm(setUtilityItemForm, "key", value)
                        }
                      />
                      <Field
                        label="Name"
                        value={String(utilityItemForm.name)}
                        onChange={(value) =>
                          updateForm(setUtilityItemForm, "name", value)
                        }
                      />
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field
                        label="Description"
                        value={String(utilityItemForm.description)}
                        onChange={(value) =>
                          updateForm(setUtilityItemForm, "description", value)
                        }
                      />
                      <Field
                        label="URL"
                        value={String(utilityItemForm.url)}
                        onChange={(value) =>
                          updateForm(setUtilityItemForm, "url", value)
                        }
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={busy}
                      className="w-full sm:w-fit"
                    >
                      <Plus className="size-4" />
                      Add Utility
                    </Button>
                  </form>
                  <div className="grid gap-3">
                    {content.utilities.map((category) => (
                      <div
                        key={category.id}
                        className="border-edge rounded-md border"
                      >
                        <div className="border-edge flex min-w-0 items-center justify-between gap-2 border-b px-3 py-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium break-words">
                              {category.title}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {category.items.length} utilities
                            </p>
                          </div>
                          <DeleteButton
                            disabled={typeof category.sort_order !== "number"}
                            onClick={() =>
                              void callAdmin(
                                "DELETE",
                                "utilityCategories",
                                undefined,
                                category.id
                              )
                            }
                          />
                        </div>
                        <div className="grid gap-2 p-2">
                          {category.items.map((item) => (
                            <div
                              key={item.id ?? item.key}
                              className="bg-background flex min-w-0 items-center justify-between gap-2 rounded-md px-3 py-2"
                            >
                              <span className="min-w-0 text-sm break-words">
                                {item.name}
                              </span>
                              <DeleteButton
                                disabled={!item.id}
                                onClick={() =>
                                  item.id &&
                                  void callAdmin(
                                    "DELETE",
                                    "utilityItems",
                                    undefined,
                                    item.id
                                  )
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
