"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, Calendar, Users, Clock, CheckCircle, Lock, MoreHorizontal, Eye, Edit, Trash2, PackagePlus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CountdownTimer } from "@/components/countdown-timer"
import { getCapsules, Capsule } from "@/lib/api/capsules"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface GroupedCapsules {
  locked: Capsule[];
  unlocked: Capsule[];
}

export function CapsuleDashboard() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    const fetchCapsules = async () => {
      try {
        setLoading(true);
        const data = await getCapsules();
        setCapsules(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load capsules");
        console.error("Error fetching capsules:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCapsules();
  }, []);

  // Group capsules by status
  const groupedCapsules: GroupedCapsules = {
    locked: capsules.filter((capsule: Capsule) => capsule.status === "locked"),
    unlocked: capsules.filter((capsule: Capsule) => capsule.status === "unlocked")
  };

  // Apply filters to both groups
  const filteredGroups = {
    locked: groupedCapsules.locked.filter((capsule: Capsule) => {
      const matchesSearch =
        capsule.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || capsule.status === statusFilter;
      return matchesSearch && matchesStatus;
    }),
    unlocked: groupedCapsules.unlocked.filter((capsule: Capsule) => {
      const matchesSearch =
        capsule.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || capsule.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
  };

  // Calculate statistics
  const totalCapsules = capsules.length;
  const lockedCapsules = capsules.filter((c: Capsule) => c.status === "locked").length;
  const unlockedCapsules = capsules.filter((c: Capsule) => c.status === "unlocked").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "locked":
        return "bg-yellow-100 text-yellow-800";
      case "unlocked":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "locked":
        return <Lock className="h-4 w-4" />;
      case "unlocked":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3">Loading capsules...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive p-4 bg-destructive/10">
        <h3 className="font-medium text-destructive">Error loading capsules</h3>
        <p className="text-sm text-destructive/80">{error}</p>
        <Button 
          className="mt-3" 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Capsules</p>
                <p className="text-2xl font-bold">{totalCapsules}</p>
              </div>
              <PackagePlus className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Locked</p>
                <p className="text-2xl font-bold text-yellow-600">{lockedCapsules}</p>
              </div>
              <Lock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unlocked</p>
                <p className="text-2xl font-bold text-green-600">{unlockedCapsules}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ready to Open</p>
                <p className="text-2xl font-bold text-blue-600">
                  {groupedCapsules.locked.filter((c: Capsule) => {
                    const unlockDate = new Date(c.unlockDate).getTime();
                    const now = new Date().getTime();
                    return unlockDate <= now;
                  }).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search capsules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "locked" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("locked")}
              >
                Locked
              </Button>
              <Button
                variant={statusFilter === "unlocked" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("unlocked")}
              >
                Unlocked
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locked Capsules Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Lock className="h-5 w-5 text-yellow-600" />
          Locked Capsules ({filteredGroups.locked.length})
        </h2>
        
        {filteredGroups.locked.length > 0 ? (
          <div className="space-y-4">
            {filteredGroups.locked.map((capsule: Capsule) => (
              <Card 
                key={capsule.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/capsules/${capsule.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{capsule.title}</h3>
                        <Badge className={getStatusColor(capsule.status)}>
                          {getStatusIcon(capsule.status)}
                          <span className="ml-1 capitalize">{capsule.status}</span>
                        </Badge>
                      </div>

                      {capsule.description && (
                        <p className="text-gray-600 mb-4">{capsule.description}</p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Unlock Date: {new Date(capsule.unlockDate).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-600 mb-1">Time Until Unlock:</span>
                          <CountdownTimer 
                            deadline={new Date(capsule.unlockDate).getTime()} 
                          />
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Capsule
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No locked capsules</h3>
              <p className="text-gray-600">You don't have any locked capsules at the moment</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Unlocked Capsules Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Unlocked Capsules ({filteredGroups.unlocked.length})
        </h2>
        
        {filteredGroups.unlocked.length > 0 ? (
          <div className="space-y-4">
            {filteredGroups.unlocked.map((capsule: Capsule) => (
              <Card 
                key={capsule.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/capsules/${capsule.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{capsule.title}</h3>
                        <Badge className={getStatusColor(capsule.status)}>
                          {getStatusIcon(capsule.status)}
                          <span className="ml-1 capitalize">{capsule.status}</span>
                        </Badge>
                      </div>

                      {capsule.description && (
                        <p className="text-gray-600 mb-4">{capsule.description}</p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Unlocked: {new Date(capsule.unlockDate).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>Created: {new Date(capsule.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Capsule
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No unlocked capsules</h3>
              <p className="text-gray-600">You don't have any unlocked capsules at the moment</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Empty State for Overall */}
      {totalCapsules === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <PackagePlus className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No capsules yet</h3>
            <p className="text-gray-600 mb-4">You haven't created any capsules yet. Start by creating your first time-locked capsule.</p>
            <Button>
              <Link href="/create-capsule">Create Your First Capsule</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}