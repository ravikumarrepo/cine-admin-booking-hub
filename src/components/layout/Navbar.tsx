
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Film, User, LogIn, LogOut, Menu, X } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link 
      to={to} 
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-cinema-primary hover:text-white",
        location.pathname === to ? "bg-cinema-primary text-white" : "text-gray-700"
      )}
      onClick={() => setMobileMenuOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Film className="h-8 w-8 text-cinema-primary" />
              <span className="ml-2 text-xl font-bold text-cinema-dark">CineAdmin</span>
            </Link>
          </div>
          
          {/* Desktop navigation links */}
          <div className="hidden sm:flex sm:items-center sm:ml-6 space-x-4">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/movies">Movies</NavLink>
            {isAuthenticated && <NavLink to="/bookings">My Bookings</NavLink>}
            {isAdmin && <NavLink to="/admin">Admin Dashboard</NavLink>}

            <div className="ml-4 flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">{user?.username}</span>
                  </Button>
                  <Button 
                    onClick={handleLogout} 
                    variant="ghost" 
                    className="flex items-center gap-2 text-red-500 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden md:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => navigate('/login')} variant="ghost" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                  <Button onClick={() => navigate('/register')} variant="default" className="bg-cinema-primary hover:bg-cinema-secondary">
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/movies">Movies</NavLink>
            {isAuthenticated && <NavLink to="/bookings">My Bookings</NavLink>}
            {isAdmin && <NavLink to="/admin">Admin Dashboard</NavLink>}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-4 flex items-center">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2 w-full">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-cinema-primary" />
                    <span className="ml-2 text-sm font-medium">{user?.username}</span>
                  </div>
                  <Button 
                    onClick={handleLogout} 
                    variant="outline" 
                    className="w-full justify-start text-red-500 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 w-full">
                  <Button onClick={() => navigate('/login')} variant="outline" className="w-full justify-start">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                  <Button onClick={() => navigate('/register')} variant="default" className="w-full bg-cinema-primary hover:bg-cinema-secondary">
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
