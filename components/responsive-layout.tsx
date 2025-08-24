"use client"

import { useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ResponsiveSidebar } from "./responsive-sidebar"
import { MediaUploadDemo } from "./media-upload-demo"
import { TouchFriendlyControls } from "./touch-friendly-controls"
import { Menu, Upload, Settings, Home, Users, BarChart3 } from "lucide-react"

export function ResponsiveLayout() {
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      {isMobile && (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <ResponsiveSidebar onItemClick={() => setSidebarOpen(false)} />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
        </header>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-background">
            <ResponsiveSidebar />
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${!isMobile ? "ml-64" : ""}`}>
          <div className="container mx-auto p-4 space-y-6">
            {/* Responsive Grid */}
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base md:text-lg">Mobile-First Design</CardTitle>
                  <CardDescription className="text-sm">
                    This layout adapts seamlessly across all screen sizes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Responsive components</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base md:text-lg">Touch-Friendly</CardTitle>
                  <CardDescription className="text-sm">
                    Optimized for touch interactions on mobile devices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">44px minimum touch targets</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base md:text-lg">Breakpoint Optimized</CardTitle>
                  <CardDescription className="text-sm">
                    Tailored experiences for mobile, tablet, and desktop
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">sm: 640px, md: 768px, lg: 1024px</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Touch-Friendly Controls Demo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Touch-Friendly Controls
                </CardTitle>
                <CardDescription>Interactive elements optimized for mobile touch</CardDescription>
              </CardHeader>
              <CardContent>
                <TouchFriendlyControls />
              </CardContent>
            </Card>

            {/* Media Upload Demo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Mobile-Optimized Media Upload
                </CardTitle>
                <CardDescription>Drag & drop with mobile-friendly fallbacks</CardDescription>
              </CardHeader>
              <CardContent>
                <MediaUploadDemo />
              </CardContent>
            </Card>

            {/* Responsive Typography Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Responsive Typography</CardTitle>
                <CardDescription>Text scales appropriately across devices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Responsive Heading</h1>
                <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed">
                  This paragraph demonstrates responsive text sizing. On mobile, it uses smaller text for better
                  readability on small screens. On tablets and desktop, it scales up appropriately while maintaining
                  optimal line height for comfortable reading.
                </p>
                <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="p-3 md:p-4 bg-muted rounded-lg">
                    <h3 className="font-medium text-sm md:text-base">Mobile First</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      Designed for mobile, enhanced for larger screens
                    </p>
                  </div>
                  <div className="p-3 md:p-4 bg-muted rounded-lg">
                    <h3 className="font-medium text-sm md:text-base">Flexible Grid</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      Adapts from 1 to 3 columns based on screen size
                    </p>
                  </div>
                  <div className="p-3 md:p-4 bg-muted rounded-lg sm:col-span-2 lg:col-span-1">
                    <h3 className="font-medium text-sm md:text-base">Consistent UX</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      Same functionality, optimized presentation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
