'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import UserManagement from '@/components/admin/UserManagement';
import ProductManagement from '@/components/admin/ProductManagement';
import { isAdminRole } from '@/lib/constants/roles';

type Tab = 'users' | 'products';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [initials] = useState(() => {
    const first = typeof window !== 'undefined' ? localStorage.getItem('firstName') || '' : '';
    const last = typeof window !== 'undefined' ? localStorage.getItem('lastName') || '' : '';
    return (((first[0] || '') + (last[0] || '')).toUpperCase() || 'U');
  });
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    try {
      localStorage.clear();
    } catch (e) {
      // ignore
    }
    router.push('/login');
  };

  useEffect(() => {
    const roleId = localStorage.getItem('roleId');
    if (!isAdminRole(roleId)) {
      router.push('/unauthorize');
    }
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-foreground">Admin Backoffice</h1>
            <div className="flex items-center gap-4 relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen((s) => !s)}
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold shadow"
                title="User menu"
              >
                {initials}
              </button>

              {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-44 bg-white border border-border rounded-md shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      router.push('/products');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    Products
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-red-100 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'users'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'products'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              Product Management
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'products' && <ProductManagement />}
      </main>
    </div>
  );
}

