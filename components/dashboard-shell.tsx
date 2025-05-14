import type { ReactNode } from "react"

interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
}
