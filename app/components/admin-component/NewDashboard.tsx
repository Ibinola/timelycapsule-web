"use client";
import { useEffect, useState } from "react";
import {
  MdOutlineInventory,
  MdOutlineInbox,
  MdSend,
  MdClose,
  MdMoreHoriz,
} from "react-icons/md";
import { FiCopy } from "react-icons/fi";
import { HiChevronRight } from "react-icons/hi";
import Image from "next/image";

type Capsule = {
  title: string;
  description: string;
  date: string;
};

type HistoryItem = {
  name: string;
  description: string;
  type: "Received" | "Send";
  date: string;
  revealsIn: string;
};

export default function DashboardMain() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setCapsules([
      {
        title: "Capsule Name",
        description: "Capsule description",
        date: "03/20/2025",
      },
      {
        title: "Capsule Name",
        description: "Capsule description",
        date: "03/20/2025",
      },
      {
        title: "Capsule Name",
        description: "Capsule description",
        date: "03/20/2025",
      },
    ]);
    setHistory([
      {
        name: "Capsule Name",
        description: "Description",
        type: "Received",
        date: "2nd March, 2025",
        revealsIn: "03/20/2025, 2:23 PM",
      },
      {
        name: "Capsule Name",
        description: "Description",
        type: "Received",
        date: "2nd March, 2025",
        revealsIn: "03/20/2025, 2:32 PM",
      },
      {
        name: "Capsule Name",
        description: "Description",
        type: "Send",
        date: "2nd March, 2025",
        revealsIn: "03/20/2025, 2:23 PM",
      },
    ]);
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-6">
      {/* Left Column */}
      <div className="xl:col-span-2 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          <StatCard title="Total Capsule" count={capsules.length} dark />
          <StatCard title="Received Capsule" count={capsules.length} />
          <StatCard
            title="Sent Capsule"
            count={history.filter((h) => h.type === "Send").length}
          />
        </div>

        {/* Capsules */}
        <div className="border border-gray-200 rounded-xl capsule-container">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Newly Received Capsule</h2>
              <select className="border rounded px-2 py-1 text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>

            {capsules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                {/* <img
                  src="/images/nothing.png"
                  alt="Nothing available"
                  className="w-28 h-28 mb-2"
                /> */}

                <Image
                  src="/images/nothing.png"
                  alt="Nothing available"
                  width={112}
                  height={112}
                  className="mb-2"
                />

                <p className="text-sm text-gray-500">
                  There’s nothing available in your capsule
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {capsules.map((c, i) => (
                  <div
                    key={i}
                    className="bg-white shadow rounded-xl p-4 text-sm space-y-2"
                  >
                    <Image
                      src="/images/pinkpulse.png"
                      alt="Capsule"
                      width={500}
                      height={96}
                      className="w-full h-24 object-cover rounded"
                    />

                    <div className="w-full flex items-center justify-start space-x-1 text-yellow-600 text-[10px]">
                      <MdOutlineInbox className="w-3 h-3" />
                      <p>Received</p>
                    </div>
                    <div className="font-medium">{c.title}</div>
                    <p className="text-gray-500 text-xs">{c.description}</p>
                    <p className="text-gray-400 text-xs">
                      Created on: {c.date}
                    </p>
                    <div className="flex gap-2 justify-between items-center">
                      <p className="text-[10px]">CountDown- 00:00:00</p>
                      <button className="bg-green-600 text-white px-1 text-[8px] rounded">
                        Open Capsule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* History */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">History</h2>
            <a
              href="#"
              className="text-sm text-green-600 flex items-center space-x-1"
            >
              <span className="text-sm">View All</span>
              <HiChevronRight className="w-4 h-4 text-green-600" />
            </a>
          </div>
          <div className="bg-white shadow rounded-xl overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Capsule Name</th>
                  <th className="px-4 py-2 text-left">TYPE</th>
                  <th className="px-4 py-2 text-left">DATE</th>
                  <th className="px-4 py-2 text-left">REVEALS IN</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-3">
                      <div className="flex items-start space-x-6">
                        <div className="w-8 h-8 bg-green-500 text-white flex items-center justify-center text-xs font-bold">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-xs">{item.name}</div>
                          <p className="text-gray-500 text-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          item.type === "Received"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">{item.date}</td>
                    <td className="px-4 py-3">{item.revealsIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Wallet */}
        <div className="flex flex-row justify-between items-center gap-4 mb-6">
          <button className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-lg text-sm transition duration-300 w-full sm:w-auto">
            Create New Capsule
          </button>
          <button className="border border-green-700 text-green-700 hover:bg-green-50 px-5 py-2 rounded-lg text-sm transition duration-300 w-full sm:w-auto">
            View Drafts
          </button>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xs font-semibold">Wallet Address</h2>
          <MdMoreHoriz className="cursor-pointer w-4 h-4" />
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <div className="border p-3 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xs">Wallet Details</h2>
              <MdClose className="cursor-pointer" />
            </div>
            <hr className="w-full mb-2 border-gray-200" />
            <div className="border rounded-lg p-4 flex flex-col items-center justify-center mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-red-400" />
                <span className="text-sm truncate">0x05Dc84...Ewae878312</span>
              </div>
              <button className="text-xs mb-2 flex items-center space-x-1">
                <FiCopy className="w-3 h-3" />
                <span>Copy address</span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">Connected with Metamask</p>
              <button className="bg-red-100 text-gray-600 px-2 py-1 rounded text-xs">
                Disconnect
              </button>
            </div>
          </div>
        </div>

        {/* Scheduled Capsules */}
        <div className="bg-white shadow rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-xs">Scheduled Capsules</h2>
            <a
              href="#"
              className="text-sm text-green-600 flex items-center space-x-1"
            >
              <span className="text-xs">View All</span>
              <HiChevronRight className="w-4 h-4 text-green-600" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  count,
  dark = false,
}: {
  title: string;
  count: number;
  dark?: boolean;
}) {
  return (
    <div
      className={`${dark ? "bg-gray-900 text-white" : "bg-white"} p-4 rounded-xl shadow w-full h-20 flex items-center`}
    >
      <div className="mr-4">
        {title === "Total Capsule" && (
          <MdOutlineInventory className="text-2xl text-blue-500" />
        )}
        {title === "Received Capsule" && (
          <MdOutlineInbox className="text-2xl text-green-500" />
        )}
        {title === "Sent Capsule" && (
          <MdSend className="text-2xl text-yellow-500" />
        )}
      </div>
      <div className="flex flex-col justify-between">
        <p className="text-sm">{title}</p>
        <h2 className="text-2xl font-bold">{count}</h2>
      </div>
    </div>
  );
}
