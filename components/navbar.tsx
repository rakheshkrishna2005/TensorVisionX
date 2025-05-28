"use client"

import { useState } from "react"
import { Moon, Sun, Trash2, RotateCw, Menu, LogOut, Video } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      if (response.ok) {
        router.push('/auth/login')
        router.refresh()
      } else {
        toast({
          title: "Logout failed",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

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
    setOpen(false)
  }

  const handleReloadApp = () => {
    window.location.reload()
    setOpen(false)
  }

  const handleThemeChange = (theme: string) => {
    setTheme(theme)
    setOpen(false)
  }

  // Desktop controls component
  const DesktopControls = () => (
    <div className="hidden md:flex items-center gap-3">
      <FilterClasses
        allClasses={allClasses}
        selectedClasses={selectedClasses}
        setSelectedClasses={setSelectedClasses}
      />

      <Button variant="outline" size="icon" onClick={handleReloadApp} title="Reload application">
        <RotateCw className="h-4 w-4" />
      </Button>

      <Button variant="outline" size="icon" onClick={handleClearCache} title="Clear cache">
        <Trash2 className="h-4 w-4" />
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

      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleLogout} 
        title="Logout"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )

  // Mobile menu component
  const MobileMenu = () => (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[350px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-semibold">Menu</h2>
          </div>
          
          <div className="py-6 space-y-6 flex-1">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Filter Classes</h3>
              <div className="pl-1">
                <FilterClasses
                  allClasses={allClasses}
                  selectedClasses={selectedClasses}
                  setSelectedClasses={setSelectedClasses}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Actions</h3>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="icon" onClick={handleReloadApp} title="Reload application">
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleClearCache} title="Clear cache">
                  <Trash2 className="h-4 w-4" />
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
                    <DropdownMenuItem onClick={() => handleThemeChange("light")}>Light</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleThemeChange("dark")}>Dark</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleLogout} 
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex h-16 items-center justify-between px-6 md:px-8">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Video className="absolute inset-0 w-full h-full" />
          </div>
          <h1 className="text-xl font-bold">
            <span className="text-black dark:text-white">Tensor</span>
            <span className="text-red-600"> Vision X</span>
          </h1>
        </div>

        {/* Desktop controls */}
        <DesktopControls />
        
        {/* Mobile menu */}
        <MobileMenu />
      </div>
    </header>
  )
}
