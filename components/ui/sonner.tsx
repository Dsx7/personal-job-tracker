"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          // Added Flex properties (flex, items-start) to ensure the layout never overlaps
          toast:
            "group toast group-[.toaster]:bg-white/70 group-[.toaster]:dark:bg-slate-950/70 group-[.toaster]:backdrop-blur-xl group-[.toaster]:border-slate-200/50 group-[.toaster]:dark:border-slate-800/50 group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:flex group-[.toaster]:items-start",
          title:
            "group-[.toast]:text-slate-900 group-[.toast]:dark:text-slate-100 group-[.toast]:font-semibold group-[.toast]:text-sm",
          description:
            "group-[.toast]:text-slate-500 group-[.toast]:dark:text-slate-400 group-[.toast]:text-xs mt-0.5",
          actionButton:
            "group-[.toast]:bg-blue-600 group-[.toast]:text-white group-[.toast]:dark:bg-blue-600 group-[.toast]:dark:text-white group-[.toast]:rounded-lg group-[.toast]:font-medium transition-colors hover:group-[.toast]:bg-blue-700",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 group-[.toast]:dark:bg-slate-800 group-[.toast]:dark:text-slate-400 group-[.toast]:rounded-lg group-[.toast]:font-medium transition-colors hover:group-[.toast]:bg-slate-200",
          // Reset internal icon margin so our custom wrapper handles it
          icon: "group-[.toast]:m-0 group-[.toast]:p-0",
        },
      }}
      icons={{
        // ADDED: mr-3 (for spacing) and shrink-0 (to prevent squishing) to all custom icons
        success: (
          <div className="mr-3 flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100/80 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <CircleCheckIcon className="size-4" strokeWidth={2.5} />
          </div>
        ),
        info: (
          <div className="mr-3 flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100/80 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <InfoIcon className="size-4" strokeWidth={2.5} />
          </div>
        ),
        warning: (
          <div className="mr-3 flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100/80 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <TriangleAlertIcon className="size-4" strokeWidth={2.5} />
          </div>
        ),
        error: (
          <div className="mr-3 flex size-8 shrink-0 items-center justify-center rounded-full bg-rose-100/80 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <OctagonXIcon className="size-4" strokeWidth={2.5} />
          </div>
        ),
        loading: (
          <div className="mr-3 flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100/80 text-slate-600 dark:bg-slate-800/80 dark:text-slate-400">
            <Loader2Icon className="size-4 animate-spin" strokeWidth={2.5} />
          </div>
        ),
      }}
      {...props}
    />
  )
}

export { Toaster }