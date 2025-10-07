"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigation } from "@/lib/navigation-context"

export function BackButton({ className = "" }) {
  const { goBack, navigationStack } = useNavigation()


  return (
    <Button variant="ghost" size="icon" onClick={goBack} className={`h-9 w-9 ${className}`}>
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Go back</span>
    </Button>
  )
}
