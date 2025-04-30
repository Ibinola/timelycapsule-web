"use client";
import { useState, useEffect } from "react";
import { ChevronDown, Calendar, Loader2 } from "lucide-react";
import SortableTableHeader from "../sortable-table-header";
import Button from "../paginationButton";
import { mockCapsuleService } from "@/app/api/capsules/mock/service";

// Define the capsule type for better type safety
export interface Capsule {
  id: number;
  title: string;
  date: string;
  receiver: string;
  email: string;
  sender: string;
  type: string;
  expiry: string;
  status: string;
}

type SortDirection = "asc" | "desc" | null;
type SortField =
  | "title"
  | "receiver"
  | "sender"
  | "type"
  | "expiry"
  | "status"
  | null;

export default function AdminCapsulesTable() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [allCapsules, setAllCapsules] = useState<Capsule[]>([]);
  const [filteredData, setFilteredData] = useState<Capsule[]>([]);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Fetch mock data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await mockCapsuleService.getCapsules();
        setAllCapsules(data);
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching capsules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and sorting when values change
  useEffect(() => {
    if (allCapsules.length === 0) return;

    let result = [...allCapsules];

    // Filter by status
    if (selectedStatus !== "All") {
      result = result.filter((item) => item.status === selectedStatus);
    }

    // Filter by search keyword
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword) ||
          item.receiver.toLowerCase().includes(keyword) ||
          item.sender.toLowerCase().includes(keyword) ||
          item.type.toLowerCase().includes(keyword),
      );
    }

    // Apply sorting if active
    if (sortField && sortDirection) {
      result = [...result].sort((a, b) => {
        let valueA = a[sortField];
        let valueB = b[sortField];

        // Special case for title/date field
        if (sortField === "title") {
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
        }

        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    // Update filtered data
    setFilteredData(result);
  }, [selectedStatus, searchKeyword, allCapsules, sortField, sortDirection]);

  // Handle sorting
  const handleSort = (field: SortField, direction: SortDirection) => {
    setSortField(direction === null ? null : field);
    setSortDirection(direction);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-8">
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <div className="relative">
            <select
              className="w-full h-10 px-3 py-2 bg-white border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option>All</option>
              <option>Active</option>
              <option>Expired</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Start Date"
                className="w-full h-10 px-3 py-2 bg-white border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Calendar className="absolute right-3 top-3 w-4 h-4 pointer-events-none" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="End Date"
                className="w-full h-10 px-3 py-2 bg-white border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <Calendar className="absolute right-3 top-3 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              placeholder="Enter Search Keyword..."
              className="w-full h-10 px-3 py-2 bg-white border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <Button
            label="Filter"
            className="h-10 bg-emerald-800 hover:bg-emerald-500 text-white font-medium"
            disabled={filteredData.length === allCapsules.length}
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse">
          <thead className="font-ibmPlexSans text-[13px] text-sm font-normal">
            <tr className="bg-emerald-700 text-white">
              <SortableTableHeader
                label="Capsule Title/Date Sent"
                onSort={(direction) => handleSort("title", direction)}
                isActive={sortField === "title"}
                initialDirection={sortField === "title" ? sortDirection : null}
              />
              <SortableTableHeader
                label="Receiver's name/Email"
                onSort={(direction) => handleSort("receiver", direction)}
                isActive={sortField === "receiver"}
                initialDirection={
                  sortField === "receiver" ? sortDirection : null
                }
                className="hidden md:table-cell"
              />
              <SortableTableHeader
                label="Sender's Name"
                onSort={(direction) => handleSort("sender", direction)}
                isActive={sortField === "sender"}
                initialDirection={sortField === "sender" ? sortDirection : null}
                className="hidden md:table-cell"
              />
              <SortableTableHeader
                label="Type"
                onSort={(direction) => handleSort("type", direction)}
                isActive={sortField === "type"}
                initialDirection={sortField === "type" ? sortDirection : null}
              />
              <SortableTableHeader
                label="Expiring Day/Time"
                onSort={(direction) => handleSort("expiry", direction)}
                isActive={sortField === "expiry"}
                initialDirection={sortField === "expiry" ? sortDirection : null}
                className="hidden lg:table-cell"
              />
              <SortableTableHeader
                label="Status"
                onSort={(direction) => handleSort("status", direction)}
                isActive={sortField === "status"}
                initialDirection={sortField === "status" ? sortDirection : null}
              />
              <th className="px-4 py-3 text-left font-medium text-sm border-b">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((capsule) => (
                <tr key={capsule.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 last:border-r-0">
                    <div className="font-medium">{capsule.title}</div>
                    <div className="text-sm text-gray-500">{capsule.date}</div>
                  </td>
                  <td className="px-4 py-3 last:border-r-0 hidden md:table-cell">
                    <div className="font-medium">{capsule.receiver}</div>
                    <div className="text-sm text-gray-500">{capsule.email}</div>
                  </td>
                  <td className="px-4 py-3 last:border-r-0 hidden md:table-cell">
                    {capsule.sender}
                  </td>
                  <td className="px-4 py-3 text-gray-500 last:border-r-0">
                    {capsule.type}
                  </td>
                  <td className="text-sm text-gray-500 px-4 py-3 last:border-r-0 hidden lg:table-cell">
                    {capsule.expiry}
                  </td>
                  <td className="px-4 py-3 last:border-r-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        capsule.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {capsule.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative w-full sm:w-auto">
                      <select className="w-full text-sm sm:w-20 py-1 pl-2 pr-8 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Select</option>
                        <option>View</option>
                        <option className="text-red-500">Delete</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1.5 w-4 h-4 pointer-events-none" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No results found. Try adjusting your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 text-sm text-gray-500">
        <div className="mb-4 sm:mb-0">
          Showing 1 to {Math.min(filteredData.length, 12)} of{" "}
          {filteredData.length}
        </div>
        <div className="flex items-center gap-2">
          <Button label="Previous" variant="outline" size="sm" />
          <Button
            label="1"
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-600"
          />
          <Button label="2" size="sm" />
          <Button label="3" variant="outline" size="sm" />
          <Button label="Next" variant="outline" size="sm" />
        </div>
      </div>
    </div>
  );
}
