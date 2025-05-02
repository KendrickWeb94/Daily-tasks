import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import {ModeToggle} from "@/components/mode-toggle.tsx";

export default function Header() {
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/*<Link to="/" className="text-xl font-bold text-indigo-600">*/}
        {/*  Daily Tasks*/}
        {/*</Link>*/}
        <div></div>

        <div className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <>
              {/*<span className="text-sm text-gray-600">*/}
              {/*  {currentUser.email || 'Guest User'}*/}
              {/*</span>*/}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Logout
              </button>
              <ModeToggle />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>


</div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-4 space-y-1 sm:px-3 border-t">
          {currentUser ? (
            <>
              <div className="px-4 py-2 text-sm text-gray-600">
                {currentUser.email || 'Guest User'}
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}