'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<string>('Checking...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/health')
      .then((res) => res.json())
      .then((data) => {
        setApiStatus(`✅ Online: ${data.timestamp}`);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setApiStatus('❌ Offline (Check console)');
        setLoading(false);
      });
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">ourKairos Monolith</h1>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <div className="p-6 border rounded-lg shadow-sm min-w-75">
            <h2 className="text-xl font-semibold mb-2">System Status</h2>

            <div className="flex items-center gap-2">
              <span className="font-medium">API Service:</span>
              <span
                className={`px-2 py-1 rounded text-sm ${loading ? 'bg-yellow-100 text-yellow-800' : apiStatus.includes('Online') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {apiStatus}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="font-medium">Database:</span>
              <span className="text-gray-500 text-sm">(Check API Logs)</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
