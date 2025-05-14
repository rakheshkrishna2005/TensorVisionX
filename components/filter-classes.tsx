"use client"

import { useState } from "react"
import { Check, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface FilterClassesProps {
  allClasses: string[]
  selectedClasses: string[]
  setSelectedClasses: (classes: string[]) => void
}

export function FilterClasses({ allClasses, selectedClasses, setSelectedClasses }: FilterClassesProps) {
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <Filter className="h-4 w-4" />
          Filter Classes
          {selectedClasses.length > 0 && (
            <Badge variant="secondary" className="ml-1 rounded-full px-1 font-normal">
              {selectedClasses.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Search classes..." value={search} onValueChange={setSearch} />
          <div className="flex justify-center gap-2 p-2 border-b">
            <Button variant="outline" size="sm" className="h-8 w-1/2 border-black-500" onClick={selectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-1/2 border-black-500" onClick={clearAll}>
              Clear All
            </Button>
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
  )
}