import { useState } from 'react';
import { User, LogOut, RotateCcw } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { signOut } from '../lib/api';
import { AuthModal } from './AuthModal';

interface HeaderProps {
  user: SupabaseUser | null;
  runNumber: number;
  onCollapseClick: () => void;
}

export function Header({ user, runNumber, onCollapseClick }: HeaderProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      <header className="bg-slate-900/50 border-b border-slate-700 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                TimeForge
              </h1>
              <p className="text-xs text-slate-500">Echoes of Infinity</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <div className="text-sm text-slate-400">Universe</div>
                <div className="text-xl font-bold text-purple-400">#{runNumber + 1}</div>
              </div>

              <button
                onClick={onCollapseClick}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <RotateCcw size={16} />
                <span className="hidden sm:inline">Collapse</span>
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden md:block text-right">
                    <div className="text-sm text-slate-300">{user.email}</div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all duration-200"
                    title="Sign Out"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <User size={16} />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
