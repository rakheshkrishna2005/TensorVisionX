"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface ClassSelectorProps {
  allClasses: string[]
  selectedClasses: string[]
  setSelectedClasses: (classes: string[]) => void
}

export function ClassSelector({ allClasses, selectedClasses, setSelectedClasses }: ClassSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const toggleClass = (className: string) => {
    if (selectedClasses.includes(className)) {
      setSelectedClasses(selectedClasses.filter((c) => c !== className))
    } else {
      setSelectedClasses([...selectedClasses, className])
    }
  }

  const selectAll = () => {
    setSelectedClasses([...allClasses])
  }

  const clearAll = () => {
    setSelectedClasses([])
  }

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium leading-none text-white">Object Classes to Detect</label>
        <span className="text-xs text-white/80">
          {selectedClasses.length} of {allClasses.length} selected
        </span>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between h-auto min-h-10 py-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <div className="flex flex-wrap gap-1 max-w-[90%]">
              {selectedClasses.length === 0 ? (
                <span className="text-white/70">Select object classes to detect...</span>
              ) : selectedClasses.length > 5 ? (
                <span>{selectedClasses.length} classes selected</span>
              ) : (
                selectedClasses.slice(0, 5).map((className) => (
                  <Badge key={className} variant="secondary" className="mr-1 bg-white/20 text-white hover:bg-white/30">
                    {className}
                  </Badge>
                ))
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command className="overflow-hidden">
            <CommandInput placeholder="Search classes..." value={search} onValueChange={setSearch} />
            <div className="border rounded-md border-primary/20 mx-2 my-2">
              <div className="flex justify-center gap-2 p-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-primary/20 hover:bg-primary/10" 
                  onClick={selectAll}
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-primary/20 hover:bg-primary/10" 
                  onClick={clearAll}
                >
                  Clear All
                </Button>
              </div>
            </div>
            <CommandList>
              <CommandEmpty>No classes found.</CommandEmpty>
              <CommandGroup className="max-h-[250px] overflow-y-auto">
                {allClasses.map((className) => (
                  <CommandItem key={className} value={className} onSelect={() => toggleClass(className)}>
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selectedClasses.includes(className) ? "bg-primary text-primary-foreground" : "opacity-50",
                      )}
                    >
                      {selectedClasses.includes(className) && <Check className="h-3 w-3" />}
                    </div>
                    <span>{className}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}