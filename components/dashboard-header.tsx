"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

interface DashboardHeaderProps {
  onMenuButtonClick: () => void
}

export function DashboardHeader({ onMenuButtonClick }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="outline" size="icon" className="md:hidden" onClick={onMenuButtonClick}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      <div className="flex-1">
        <h1 className="text-xl font-semibold">Object Detection Dashboard</h1>
      </div>
      <ModeToggle />
    </header>
  )
}
