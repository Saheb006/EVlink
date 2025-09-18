"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Car } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  const items = []

  return (
    <div className="hidden md:flex items-center gap-6">
      {items.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
