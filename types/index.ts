interface Capsule {
    id: string;
    name: string;
    type: 'public' | 'private' | 'draft';
    status: 'active' | 'expired' | 'pending';
    ownerId: string;
    createdAt: string;
    expiresAt?: string;
  }
  
  interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
    status: 'active' | 'inactive';
    lastLogin: string;
  }
  
  // Confirmation Modal State Type
  interface ConfirmationModalState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    type: 'alert' | 'confirm';
  }
  