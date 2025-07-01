import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, onSnapshot, doc, getDoc, setDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

// Define types for data
interface Capsule {
  id: string;
  name: string;
  status: 'public' | 'private' | 'expired';
  createdAt: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  type: 'active' | 'guest';
  lastLogin: number;
}

// Utility for generating unique IDs (for dummy data)
const generateId = () => Math.random().toString(36).substring(2, 11);

// Dummy Data (will be replaced by Firestore data)
const initialCapsules: Capsule[] = [
  { id: generateId(), name: 'Project Alpha', status: 'public', createdAt: Date.now() - 86400000 * 5 },
  { id: generateId(), name: 'Internal Docs', status: 'private', createdAt: Date.now() - 86400000 * 10 },
  { id: generateId(), name: 'Old Archive', status: 'expired', createdAt: Date.now() - 86400000 * 30 },
  { id: generateId(), name: 'Marketing Campaign', status: 'public', createdAt: Date.now() - 86400000 * 2 },
  { id: generateId(), name: 'Client Proposal', status: 'private', createdAt: Date.now() - 86400000 * 7 },
  { id: generateId(), name: 'Expired Report', status: 'expired', createdAt: Date.now() - 86400000 * 40 },
];

const initialUsers: User[] = [
  { id: generateId(), name: 'Alice Smith', email: 'alice@example.com', type: 'active', lastLogin: Date.now() - 86400000 * 1 },
  { id: generateId(), name: 'Bob Johnson', email: 'bob@example.com', type: 'guest', lastLogin: Date.now() - 86400000 * 3 },
  { id: generateId(), name: 'Charlie Brown', email: 'charlie@example.com', type: 'active', lastLogin: Date.now() - 86400000 * 0.5 },
  { id: generateId(), name: 'Diana Prince', email: 'diana@example.com', type: 'guest', lastLogin: Date.now() - 86400000 * 15 },
];

// Reusable Button Component
const Button: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string }> = ({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200 ease-in-out
                bg-blue-600 hover:bg-blue-700 text-white font-semibold
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75
                ${className}`}
  >
    {children}
  </button>
);

// Stat Card Component
const StatCard: React.FC<{ title: string; value: number | string; description: string }> = ({ title, value, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center">
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    <p className="text-5xl font-bold text-blue-600 mb-2">{value}</p>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

// Modal Component
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 opacity-0 animate-scale-in">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl font-light leading-none">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent: React.FC<{ capsules: Capsule[]; users: User[] }> = ({ capsules, users }) => {
  const totalCapsules = capsules.length;
  const publicCapsules = capsules.filter(c => c.status === 'public').length;
  const privateCapsules = capsules.filter(c => c.status === 'private').length;
  const expiredCapsules = capsules.filter(c => c.status === 'expired').length;

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.type === 'active').length;
  const guestUsers = users.filter(u => u.type === 'guest').length;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Dashboard Overview</h1>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Capsule Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Capsules" value={totalCapsules} description="All capsules on the platform" />
          <StatCard title="Public Capsules" value={publicCapsules} description="Accessible to everyone" />
          <StatCard title="Private Capsules" value={privateCapsules} description="Restricted access" />
          <StatCard title="Expired Capsules" value={expiredCapsules} description="No longer active or accessible" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">User Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Users" value={totalUsers} description="All registered and guest users" />
          <StatCard title="Active Users" value={activeUsers} description="Users with recent activity" />
          <StatCard title="Guest Users" value={guestUsers} description="Non-registered or temporary users" />
        </div>
      </section>
    </div>
  );
};

// Capsule Management Content Component
const CapsuleManagement: React.FC<{ capsules: Capsule[]; updateCapsule: (id: string, data: Partial<Capsule>) => Promise<void>; deleteCapsule: (id: string) => Promise<void>; addCapsule: (capsule: Omit<Capsule, 'id'>) => Promise<void> }> = ({ capsules, updateCapsule, deleteCapsule, addCapsule }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCapsules, setSelectedCapsules] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCapsuleName, setNewCapsuleName] = useState('');
  const [newCapsuleStatus, setNewCapsuleStatus] = useState<'public' | 'private' | 'expired'>('public');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<(() => void) | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const filteredCapsules = capsules.filter(capsule => {
    const matchesStatus = filterStatus === 'all' || capsule.status === filterStatus;
    const matchesSearch = capsule.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedCapsules(filteredCapsules.map(c => c.id));
    } else {
      setSelectedCapsules([]);
    }
  };

  const handleSelectCapsule = (id: string) => {
    setSelectedCapsules(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedCapsules.length === 0) return;
    setConfirmationMessage(`Are you sure you want to delete ${selectedCapsules.length} selected capsules? This action cannot be undone.`);
    setConfirmationAction(() => async () => {
      for (const id of selectedCapsules) {
        await deleteCapsule(id);
      }
      setSelectedCapsules([]);
      setShowConfirmation(false);
    });
    setShowConfirmation(true);
  };

  const handleBulkChangeStatus = async (status: 'public' | 'private' | 'expired') => {
    if (selectedCapsules.length === 0) return;
    setConfirmationMessage(`Are you sure you want to change the status of ${selectedCapsules.length} selected capsules to '${status}'?`);
    setConfirmationAction(() => async () => {
      for (const id of selectedCapsules) {
        await updateCapsule(id, { status });
      }
      setSelectedCapsules([]);
      setShowConfirmation(false);
    });
    setShowConfirmation(true);
  };

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Status', 'Created At'];
    const rows = filteredCapsules.map(c => [
      c.id,
      c.name,
      c.status,
      new Date(c.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) { // feature detection
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'capsules_report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleAddCapsule = async () => {
    if (!newCapsuleName.trim()) return;
    await addCapsule({ name: newCapsuleName, status: newCapsuleStatus, createdAt: Date.now() });
    setNewCapsuleName('');
    setNewCapsuleStatus('public');
    setIsAddModalOpen(false);
  };

  const handleConfirm = () => {
    if (confirmationAction) {
      confirmationAction();
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Capsule Management</h1>

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="expired">Expired</option>
        </select>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <Button onClick={() => setIsAddModalOpen(true)}>Add New Capsule</Button>
        <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">Export CSV</Button>
      </div>

      {/* Bulk Actions */}
      {selectedCapsules.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-blue-50 rounded-lg shadow-inner">
          <span className="text-blue-800 font-medium">{selectedCapsules.length} capsules selected</span>
          <Button onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">Bulk Delete</Button>
          <select
            onChange={(e) => handleBulkChangeStatus(e.target.value as 'public' | 'private' | 'expired')}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Change Status</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      )}

      {/* Capsule Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedCapsules.length === filteredCapsules.length && filteredCapsules.length > 0}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCapsules.map(capsule => (
              <tr key={capsule.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedCapsules.includes(capsule.id)}
                    onChange={() => handleSelectCapsule(capsule.id)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{capsule.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${capsule.status === 'public' ? 'bg-green-100 text-green-800' : ''}
                    ${capsule.status === 'private' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${capsule.status === 'expired' ? 'bg-red-100 text-red-800' : ''}`}
                  >
                    {capsule.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(capsule.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button onClick={() => {
                    setConfirmationMessage(`Are you sure you want to delete capsule "${capsule.name}"?`);
                    setConfirmationAction(() => () => { deleteCapsule(capsule.id); setShowConfirmation(false); });
                    setShowConfirmation(true);
                  }} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs mr-2">Delete</Button>
                  <Button onClick={() => {
                    const newStatus = capsule.status === 'public' ? 'private' : 'public';
                    setConfirmationMessage(`Change status of "${capsule.name}" to "${newStatus}"?`);
                    setConfirmationAction(() => () => { updateCapsule(capsule.id, { status: newStatus }); setShowConfirmation(false); });
                    setShowConfirmation(true);
                  }} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 text-xs">Toggle Status</Button>
                </td>
              </tr>
            ))}
            {filteredCapsules.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No capsules found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Capsule Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Capsule">
        <div className="space-y-4">
          <div>
            <label htmlFor="capsuleName" className="block text-sm font-medium text-gray-700 mb-1">Capsule Name</label>
            <input
              type="text"
              id="capsuleName"
              value={newCapsuleName}
              onChange={(e) => setNewCapsuleName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Q3 Financial Report"
            />
          </div>
          <div>
            <label htmlFor="capsuleStatus" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="capsuleStatus"
              value={newCapsuleStatus}
              onChange={(e) => setNewCapsuleStatus(e.target.value as 'public' | 'private' | 'expired')}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <Button onClick={handleAddCapsule} className="w-full">Create Capsule</Button>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirmation} onClose={() => setShowConfirmation(false)} title="Confirm Action">
        <div className="space-y-4">
          <p className="text-gray-700">{confirmationMessage}</p>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setShowConfirmation(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Cancel</Button>
            <Button onClick={handleConfirm} className="bg-red-600 hover:bg-red-700">Confirm</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// User Management Content Component
const UserManagement: React.FC<{ users: User[]; updateUser: (id: string, data: Partial<User>) => Promise<void>; deleteUser: (id: string) => Promise<void>; addUser: (user: Omit<User, 'id'>) => Promise<void> }> = ({ users, updateUser, deleteUser, addUser }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserType, setNewUserType] = useState<'active' | 'guest'>('active');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<(() => void) | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const filteredUsers = users.filter(user => {
    const matchesType = filterType === 'all' || user.type === filterType;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleAddUser = async () => {
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    await addUser({ name: newUserName, email: newUserEmail, type: newUserType, lastLogin: Date.now() });
    setNewUserName('');
    setNewUserEmail('');
    setNewUserType('active');
    setIsAddModalOpen(false);
  };

  const handleConfirm = () => {
    if (confirmationAction) {
      confirmationAction();
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">User Management</h1>

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Types</option>
          <option value="active">Active</option>
          <option value="guest">Guest</option>
        </select>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <Button onClick={() => setIsAddModalOpen(true)}>Add New User</Button>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${user.type === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {user.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.lastLogin).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button onClick={() => setSelectedUser(user)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs mr-2">View Profile</Button>
                  <Button onClick={() => {
                    setConfirmationMessage(`Are you sure you want to delete user "${user.name}"?`);
                    setConfirmationAction(() => () => { deleteUser(user.id); setShowConfirmation(false); });
                    setShowConfirmation(true);
                  }} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs">Delete</Button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* User Profile Modal */}
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Profile">
        {selectedUser && (
          <div className="space-y-4 text-gray-700">
            <p><strong>ID:</strong> {selectedUser.id}</p>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Type:</strong> {selectedUser.type}</p>
            <p><strong>Last Login:</strong> {new Date(selectedUser.lastLogin).toLocaleString()}</p>
          </div>
        )}
      </Modal>

      {/* Add User Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New User">
        <div className="space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
            <input
              type="text"
              id="userName"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Jane Doe"
            />
          </div>
          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="userEmail"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., jane.doe@example.com"
            />
          </div>
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              id="userType"
              value={newUserType}
              onChange={(e) => setNewUserType(e.target.value as 'active' | 'guest')}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="guest">Guest</option>
            </select>
          </div>
          <Button onClick={handleAddUser} className="w-full">Create User</Button>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirmation} onClose={() => setShowConfirmation(false)} title="Confirm Action">
        <div className="space-y-4">
          <p className="text-gray-700">{confirmationMessage}</p>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setShowConfirmation(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Cancel</Button>
            <Button onClick={handleConfirm} className="bg-red-600 hover:bg-red-700">Confirm</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'capsules' | 'users'>('dashboard');
  const [db, setDb] = useState<any>(null);
  const [auth, setAuth] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Firebase Initialization and Authentication
  useEffect(() => {
    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestore);
      setAuth(firebaseAuth);

      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          // Sign in anonymously if no user is logged in and no custom token is provided
          if (typeof __initial_auth_token === 'undefined') {
            await signInAnonymously(firebaseAuth);
          }
          setUserId(firebaseAuth.currentUser?.uid || crypto.randomUUID()); // Fallback for anonymous or if uid is somehow null
        }
        setIsAuthReady(true);
      });

      // Use custom token if available
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        signInWithCustomToken(firebaseAuth, __initial_auth_token)
          .catch((error) => {
            console.error("Error signing in with custom token:", error);
            // Fallback to anonymous if custom token fails
            signInAnonymously(firebaseAuth).then(userCred => setUserId(userCred.user.uid));
          });
      }

      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      setIsAuthReady(true); // Mark as ready even on error to unblock UI
    }
  }, []);

  // Firestore Data Listeners
  useEffect(() => {
    if (!db || !userId || !isAuthReady) return;

    // Capsule Listener
    const capsulesCollectionRef = collection(db, `artifacts/${__app_id}/public/data/capsules`);
    const unsubscribeCapsules = onSnapshot(capsulesCollectionRef, (snapshot) => {
      const fetchedCapsules: Capsule[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        fetchedCapsules.push({ id: doc.id, ...data } as Capsule);
      });
      // Sort by createdAt descending
      fetchedCapsules.sort((a, b) => b.createdAt - a.createdAt);
      setCapsules(fetchedCapsules);

      // If no capsules exist, add initial dummy data
      if (fetchedCapsules.length === 0) {
        initialCapsules.forEach(async (capsule) => {
          try {
            await addDoc(capsulesCollectionRef, capsule);
          } catch (e) {
            console.error("Error adding initial capsule: ", e);
          }
        });
      }
    }, (error) => {
      console.error("Error fetching capsules:", error);
    });

    // User Listener
    const usersCollectionRef = collection(db, `artifacts/${__app_id}/public/data/users`);
    const unsubscribeUsers = onSnapshot(usersCollectionRef, (snapshot) => {
      const fetchedUsers: User[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        fetchedUsers.push({ id: doc.id, ...data } as User);
      });
      // Sort by lastLogin descending
      fetchedUsers.sort((a, b) => b.lastLogin - a.lastLogin);
      setUsers(fetchedUsers);

      // If no users exist, add initial dummy data
      if (fetchedUsers.length === 0) {
        initialUsers.forEach(async (user) => {
          try {
            await addDoc(usersCollectionRef, user);
          } catch (e) {
            console.error("Error adding initial user: ", e);
          }
        });
      }
    }, (error) => {
      console.error("Error fetching users:", error);
    });

    return () => {
      unsubscribeCapsules();
      unsubscribeUsers();
    };
  }, [db, userId, isAuthReady]);

  // Firestore Operations for Capsules
  const updateCapsule = useCallback(async (id: string, data: Partial<Capsule>) => {
    if (!db || !userId) return;
    try {
      const capsuleRef = doc(db, `artifacts/${__app_id}/public/data/capsules`, id);
      await updateDoc(capsuleRef, data);
    } catch (e) {
      console.error("Error updating capsule: ", e);
    }
  }, [db, userId]);

  const deleteCapsule = useCallback(async (id: string) => {
    if (!db || !userId) return;
    try {
      const capsuleRef = doc(db, `artifacts/${__app_id}/public/data/capsules`, id);
      await deleteDoc(capsuleRef);
    } catch (e) {
      console.error("Error deleting capsule: ", e);
    }
  }, [db, userId]);

  const addCapsule = useCallback(async (capsule: Omit<Capsule, 'id'>) => {
    if (!db || !userId) return;
    try {
      await addDoc(collection(db, `artifacts/${__app_id}/public/data/capsules`), capsule);
    } catch (e) {
      console.error("Error adding capsule: ", e);
    }
  }, [db, userId]);

  // Firestore Operations for Users
  const updateUser = useCallback(async (id: string, data: Partial<User>) => {
    if (!db || !userId) return;
    try {
      const userRef = doc(db, `artifacts/${__app_id}/public/data/users`, id);
      await updateDoc(userRef, data);
    } catch (e) {
      console.error("Error updating user: ", e);
    }
  }, [db, userId]);

  const deleteUser = useCallback(async (id: string) => {
    if (!db || !userId) return;
    try {
      const userRef = doc(db, `artifacts/${__app_id}/public/data/users`, id);
      await deleteDoc(userRef);
    } catch (e) {
      console.error("Error deleting user: ", e);
    }
  }, [db, userId]);

  const addUser = useCallback(async (user: Omit<User, 'id'>) => {
    if (!db || !userId) return;
    try {
      await addDoc(collection(db, `artifacts/${__app_id}/public/data/users`), user);
    } catch (e) {
      console.error("Error adding user: ", e);
    }
  }, [db, userId]);

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-700">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-inter">
      {/* Tailwind CSS CDN */}
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
        `}
      </style>

      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-gray-900 text-white p-6 flex flex-col shadow-xl">
        <div className="flex items-center mb-10">
          <svg className="w-8 h-8 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <h2 className="text-2xl font-bold text-blue-400">Admin Dashboard</h2>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-4">
            <li>
              <a
                href="#"
                onClick={() => setActiveSection('dashboard')}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200
                  ${activeSection === 'dashboard' ? 'bg-blue-700 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => setActiveSection('capsules')}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200
                  ${activeSection === 'capsules' ? 'bg-blue-700 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4m0-10h.01"></path></svg>
                Capsule Management
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => setActiveSection('users')}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200
                  ${activeSection === 'users' ? 'bg-blue-700 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M17 20v-2c0-.653-.114-1.29-.322-1.879M17 20h-2.172a3 3 0 01-2.536-1.196L10 9.5l1.768-2.11C12.356 6.19 13.626 6 15 6h2m-6 0H9v10a1 1 0 01-1 1H7a1 1 0 01-1-1V6h3m0 0V4a2 2 0 012-2h4a2 2 0 012 2v2M7 6h10"></path></svg>
                User Management
              </a>
            </li>
          </ul>
        </nav>
        <div className="mt-auto text-sm text-gray-400">
          <p>Logged in as: {userId || 'Guest'}</p>
          <p>App ID: {typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 lg:p-8 overflow-y-auto">
        {activeSection === 'dashboard' && <DashboardContent capsules={capsules} users={users} />}
        {activeSection === 'capsules' && <CapsuleManagement capsules={capsules} updateCapsule={updateCapsule} deleteCapsule={deleteCapsule} addCapsule={addCapsule} />}
        {activeSection === 'users' && <UserManagement users={users} updateUser={updateUser} deleteUser={deleteUser} addUser={addUser} />}
      </main>
    </div>
  );
};

export default App;
