"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Link,
} from "lucide-react"
import { useState } from "react"

interface RichTextToolbarProps {
  onCommand: (command: string, value?: string) => void
}

export function RichTextToolbar({ onCommand }: RichTextToolbarProps) {
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

  const handleCommand = (command: string, value?: string) => {
    onCommand(command, value)

    // Update active formats
    const newActiveFormats = new Set(activeFormats)
    if (document.queryCommandState(command)) {
      newActiveFormats.add(command)
    } else {
      newActiveFormats.delete(command)
    }
    setActiveFormats(newActiveFormats)
  }

  const formatButtons = [
    { command: "bold", icon: Bold, label: "Bold" },
    { command: "italic", icon: Italic, label: "Italic" },
    { command: "underline", icon: Underline, label: "Underline" },
  ]

  const listButtons = [
    { command: "insertUnorderedList", icon: List, label: "Bullet List" },
    { command: "insertOrderedList", icon: ListOrdered, label: "Numbered List" },
  ]

  const alignButtons = [
    { command: "justifyLeft", icon: AlignLeft, label: "Align Left" },
    { command: "justifyCenter", icon: AlignCenter, label: "Align Center" },
    { command: "justifyRight", icon: AlignRight, label: "Align Right" },
  ]

  return (
    <div className="flex items-center space-x-1 p-2 border-b bg-gray-50 rounded-t-lg">
      {/* Text Formatting */}
      <div className="flex items-center space-x-1">
        {formatButtons.map(({ command, icon: Icon, label }) => (
          <Toggle
            key={command}
            pressed={activeFormats.has(command)}
            onPressedChange={() => handleCommand(command)}
            size="sm"
            aria-label={label}
          >
            <Icon className="h-4 w-4" />
          </Toggle>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists */}
      <div className="flex items-center space-x-1">
        {listButtons.map(({ command, icon: Icon, label }) => (
          <Toggle
            key={command}
            pressed={activeFormats.has(command)}
            onPressedChange={() => handleCommand(command)}
            size="sm"
            aria-label={label}
          >
            <Icon className="h-4 w-4" />
          </Toggle>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Alignment */}
      <div className="flex items-center space-x-1">
        {alignButtons.map(({ command, icon: Icon, label }) => (
          <Button key={command} variant="ghost" size="sm" onClick={() => handleCommand(command)} aria-label={label}>
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Additional Options */}
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={() => handleCommand("formatBlock", "blockquote")} aria-label="Quote">
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = prompt("Enter URL:")
            if (url) handleCommand("createLink", url)
          }}
          aria-label="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Font Size */}
      <select
        className="text-sm border rounded px-2 py-1 bg-white"
        onChange={(e) => handleCommand("fontSize", e.target.value)}
        defaultValue="3"
      >
        <option value="1">Small</option>
        <option value="3">Normal</option>
        <option value="5">Large</option>
        <option value="7">Extra Large</option>
      </select>
    </div>
  )
}
