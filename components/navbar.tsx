"use client"

import { Moon, Sun, Trash2, RotateCw } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FilterClasses } from "@/components/filter-classes"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface NavbarProps {
  selectedClasses: string[]
  setSelectedClasses: (classes: string[]) => void
  allClasses: string[]
  clearCache: () => void
}

export function Navbar({ selectedClasses, setSelectedClasses, allClasses, clearCache }: NavbarProps) {
  const { setTheme } = useTheme()

  const handleClearCache = () => {
    clearCache()
    toast({
      title: "Cache Cleared Successfully",
      variant: "default",
      className: "pr-8 bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-800",
      action: (
        <ToastAction 
          altText="Dismiss" 
          className="bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-800 dark:hover:bg-emerald-700 border-emerald-200 dark:border-emerald-700"
        >
          Dismiss
        </ToastAction>
      ),
    })
  }

  const handleReloadApp = () => {
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex h-16 items-center justify-between px-6 md:px-8">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <svg className="text-primary" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="8" width="24" height="16" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="16" cy="16" r="6" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="16" cy="16" r="3" fill="currentColor" fillOpacity="0.4"/>
              <rect x="20" y="10" width="4" height="2" rx="1" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold">
            <span className="text-black">Tensor</span>
            <span className="text-red-600">VisionX</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <FilterClasses
            allClasses={allClasses}
            selectedClasses={selectedClasses}
            setSelectedClasses={setSelectedClasses}
          />

          <Button variant="outline" size="icon" onClick={handleReloadApp} title="Reload application">
            <RotateCw className="h-4 w-4" />
            <span className="sr-only">Reload app</span>
          </Button>

          <Button variant="outline" size="icon" onClick={handleClearCache} title="Clear cache">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Clear cache</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
