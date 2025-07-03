"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Briefcase, GraduationCap, Heart, Gift, Star, Plus } from "lucide-react"

interface Template {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
  suggestedDuration: string
  defaultEmails: string[]
  prompts: string[]
  color: string
}

const templates: Template[] = [
  {
    id: "team-retrospective",
    name: "Team Retrospective",
    description: "Capture team achievements, learnings, and goals for the future",
    icon: <Briefcase className="h-6 w-6" />,
    category: "Work",
    suggestedDuration: "1 year",
    defaultEmails: [],
    prompts: [
      "What was our biggest achievement this year?",
      "What challenge did we overcome together?",
      "What are our goals for next year?",
      "Share a memorable team moment",
    ],
    color: "bg-blue-500",
  },
  {
    id: "graduation-memories",
    name: "Graduation Memories",
    description: "Preserve memories from your graduation class",
    icon: <GraduationCap className="h-6 w-6" />,
    category: "Education",
    suggestedDuration: "5 years",
    defaultEmails: [],
    prompts: [
      "What are you most proud of from your time here?",
      "Share your favorite memory from school",
      "What are your plans after graduation?",
      "A message to your future self",
    ],
    color: "bg-green-500",
  },
  {
    id: "wedding-wishes",
    name: "Wedding Wishes",
    description: "Collect heartfelt messages for the happy couple",
    icon: <Heart className="h-6 w-6" />,
    category: "Personal",
    suggestedDuration: "1 year",
    defaultEmails: [],
    prompts: [
      "Share a funny memory with the couple",
      "What advice do you have for their marriage?",
      "Describe what makes their love special",
      "Your wishes for their future together",
    ],
    color: "bg-pink-500",
  },
  {
    id: "birthday-surprise",
    name: "Birthday Surprise",
    description: "Create a surprise birthday capsule with friends and family",
    icon: <Gift className="h-6 w-6" />,
    category: "Personal",
    suggestedDuration: "6 months",
    defaultEmails: [],
    prompts: [
      "Share a funny memory with the birthday person",
      "What do you admire most about them?",
      "Your favorite photo together",
      "Birthday wishes and hopes for their year ahead",
    ],
    color: "bg-purple-500",
  },
  {
    id: "project-milestone",
    name: "Project Milestone",
    description: "Document a significant project completion with your team",
    icon: <Star className="h-6 w-6" />,
    category: "Work",
    suggestedDuration: "2 years",
    defaultEmails: [],
    prompts: [
      "What was the most challenging part of this project?",
      "Highlight a team member's contribution",
      "What did we learn from this experience?",
      "How will this impact our future work?",
    ],
    color: "bg-orange-500",
  },
]

interface CapsuleTemplatesProps {
  onTemplateSelect?: (template: Template) => void
}

export function CapsuleTemplates({ onTemplateSelect }: CapsuleTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = ["all", ...Array.from(new Set(templates.map((t) => t.category)))]
  const filteredTemplates =
    selectedCategory === "all" ? templates : templates.filter((t) => t.category === selectedCategory)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose a Template</h2>
        <p className="text-gray-600">Start with a pre-designed template to make creation easier</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${template.color} text-white`}>{template.icon}</div>
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Suggested: {template.suggestedDuration}</span>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Sample Prompts:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {template.prompts.slice(0, 2).map((prompt, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-gray-400">•</span>
                      <span>{prompt}</span>
                    </li>
                  ))}
                  {template.prompts.length > 2 && (
                    <li className="text-gray-400">+{template.prompts.length - 2} more prompts</li>
                  )}
                </ul>
              </div>

              <Button className="w-full" onClick={() => onTemplateSelect?.(template)}>
                Use This Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Template Option */}
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="text-center py-12">
          <Plus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Create Custom Template</h3>
          <p className="text-gray-600 mb-4">Start from scratch with your own custom design</p>
          <Button variant="outline">Create Custom</Button>
        </CardContent>
      </Card>
    </div>
  )
}
