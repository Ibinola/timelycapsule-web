'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LockIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-2 h-6 w-6"
    >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

export default function AdminLoginPage() {
    // State for email, password, and current time
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [time, setTime] = useState(new Date());
    const [error, setError] = useState('');

    const router = useRouter()
    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timerId);
    }, []);

    // Handle form submission
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }

        // --- Backend Integration Placeholder ---
        // Here you would typically make an API call to your backend
        // to authenticate the user and check for admin role.
        try {
            // Mock API call
            const response: { ok: boolean; json: () => Promise<{ token: string; user: { role: string } }> } = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (email === 'admin@example.com' && password === 'password') {
                        resolve({
                            ok: true,
                            json: () => Promise.resolve({
                                token: 'fake-admin-session-token',
                                user: { role: 'admin' },
                            }),
                        });
                    } else if (email === 'user@example.com' && password === 'password') {
                        resolve({
                            ok: true,
                            json: () => Promise.resolve({
                                token: 'fake-user-session-token',
                                user: { role: 'user' },
                            }),
                        });
                    } else {
                        reject(new Error('Invalid credentials'));
                    }
                }, 1000);
            });

            if (response.ok) {
                const data = await response.json();

                // Role-based authentication check
                if (data.user.role === 'admin') {

                    localStorage.setItem('adminToken', data.token);
                    console.log('Admin login successful!');

                    router.push('/dashboard')
                    alert('Admin login successful! Redirecting to dashboard...');
                } else {
                    setError('Access denied. You do not have admin privileges.');
                }
            } else {
                setError('Invalid email or password.');
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'An error occurred during login.'
            );
        }
        // --- End of Backend Integration Placeholder ---
    };

    // Format the time for the clock display
    const formatTime = (date: Date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white font-sans">
            <div className="relative flex w-full max-w-4xl overflow-hidden rounded-lg shadow-2xl">
                {/* Background clock image section */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1590422248244-045d0ba662f3?q=80&w=1974&auto=format&fit=crop')",
                    }}
                ></div>

                {/* Overlay */}
                <div className="absolute inset-0 z-10 bg-black opacity-50"></div>

                {/* Login form container */}
                <div className="relative z-20 w-full p-8 md:w-1/2">
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold tracking-wider">ADMIN ACCESS</h1>
                        <p className="text-gray-400">Secure Authentication Required</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-300"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-300"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-900/50 p-3 text-center text-sm text-red-300">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-3 text-base font-bold text-white shadow-sm transition-all duration-300 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                            >
                                <LockIcon />
                                PROCEED
                            </button>
                        </div>
                    </form>
                </div>

                {/* Clock display section */}
                <div className="relative z-20 hidden w-1/2 items-center justify-center bg-green-900/20 p-8 md:flex md:flex-col">
                    <div className="text-center">
                        <h2 className="text-6xl font-black tracking-widest text-green-300 opacity-80">
                            {formatTime(time)}
                        </h2>
                        <p className="mt-2 font-light text-gray-300">
                            Coordinated Universal Time
                        </p>
                    </div>
                    <div className="mt-8 border-t border-green-700 pt-4 text-center">
                        <p className="text-sm text-gray-400">
                            All access attempts are logged and monitored.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
