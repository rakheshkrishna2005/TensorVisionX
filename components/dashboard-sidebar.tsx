"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { BarChart3, Camera, History, Home, Settings, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DashboardSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DashboardSidebar({ open, onOpenChange }: DashboardSidebarProps) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-20 bg-background/80 backdrop-blur-sm transition-all duration-100 lg:hidden",
          open ? "block" : "hidden",
        )}
        onClick={() => onOpenChange(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r bg-background transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <Camera className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">TensorFlow Detect</span>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            <NavLink href="#" icon={<Home className="h-4 w-4" />}>
              Dashboard
            </NavLink>
            <NavLink href="#" icon={<Camera className="h-4 w-4" />}>
              Detection
            </NavLink>
            <NavLink href="#" icon={<BarChart3 className="h-4 w-4" />}>
              Analytics
            </NavLink>
            <NavLink href="#" icon={<History className="h-4 w-4" />}>
              History
            </NavLink>
            <NavLink href="#" icon={<Settings className="h-4 w-4" />}>
              Settings
            </NavLink>
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">TD</span>
            </div>
            <div>
              <p className="text-sm font-medium">TensorFlow Detect</p>
              <p className="text-xs text-muted-foreground">v1.0.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

interface NavLinkProps {
  href: string
  icon: ReactNode
  children: ReactNode
}

function NavLink({ href, icon, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
    >
      {icon}
      {children}
    </Link>
  )
}
