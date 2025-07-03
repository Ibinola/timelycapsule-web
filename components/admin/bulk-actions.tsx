"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserCheck, UserX, Ban, Trash2, Download, ChevronDown } from "lucide-react"
import type { UserStatus } from "@/types/admin"

interface BulkActionsProps {
  selectedCount: number
  onStatusChange: (status: UserStatus) => void
  onDelete: () => void
  onExport: () => void
}

export function BulkActions({ selectedCount, onStatusChange, onDelete, onExport }: BulkActionsProps) {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {selectedCount} user{selectedCount !== 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Change Status
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onStatusChange("active")}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Activate Users
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange("inactive")}>
                  <UserX className="mr-2 h-4 w-4" />
                  Deactivate Users
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange("banned")}>
                  <Ban className="mr-2 h-4 w-4" />
                  Ban Users
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Selected
            </Button>

            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
