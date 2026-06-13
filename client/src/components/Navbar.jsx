import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Gem, Menu, X, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex flex-shrink-0 items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-gem-primary)] to-[var(--color-gem-secondary)] flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <Gem className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">Lumina<span className="gradient-text">Gems</span></span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              <Link to="/catalog" className="text-gray-500 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
                Catalog
              </Link>
              <Link to="/recommend" className="text-gray-500 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
                AI Recommend
              </Link>
              {isAuthenticated && (
                <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors flex items-center gap-1.5">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-gem-primary)] to-[var(--color-gem-secondary)] flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <button onClick={() => { handleLogout(); setShowDropdown(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Log out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-500 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="px-5 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[var(--color-gem-primary)] to-blue-700 hover:shadow-lg transition-all">
                  Sign up
                </Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="pt-2 pb-3 space-y-1 px-3">
            <Link to="/catalog" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50">Catalog</Link>
            <Link to="/recommend" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50">AI Recommend</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50">Dashboard</Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50">Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50">Log in</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-white bg-[var(--color-gem-primary)] text-center">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
