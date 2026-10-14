import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { User as UserIcon, LogOut, Code, ChevronDown, Menu, X, Shield, Wrench, Home as HomeIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, currentView, setCurrentView, logout, quickSwitchRole, lastRegisteredUser, directSignIn } = useApp();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardViewForRole = (role?: UserRole) => {
    switch (role) {
      case 'RESIDENT':
        return 'resident-dashboard';
      case 'PROVIDER':
        return 'provider-dashboard';
      case 'ADMIN':
        return 'admin-dashboard';
      default:
        return 'home';
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    quickSwitchRole(role);
    setRoleMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinkClass = (viewName: string) => {
    const isActive = currentView === viewName;
    return `text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
      isActive ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
    }`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner Notice for Student Learning */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 text-center border-b border-slate-800 flex items-center justify-center gap-2">
        <span className="font-semibold text-white">Full-Stack Architecture Demo:</span>
        <span>HTML/CSS/JS Frontend + Spring Boot & MySQL Backend Design.</span>
        <button
          onClick={() => setCurrentView('spring-boot-hub')}
          className="text-indigo-300 hover:text-white underline font-medium ml-1"
        >
          View Java Spring Boot Code & Schema →
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setCurrentView('home')}
            className="text-lg font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              AA
            </div>
            <span>Apartment Assist</span>
          </button>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setCurrentView('home')}
              className={navLinkClass('home')}
            >
              Home
            </button>

            <button
              onClick={() => {
                setCurrentView('home');
                setTimeout(() => {
                  document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Services
            </button>

            <button
              onClick={() => {
                setCurrentView('home');
                setTimeout(() => {
                  document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              How It Works
            </button>

            {currentUser && (
              <button
                onClick={() => setCurrentView(getDashboardViewForRole(currentUser.role))}
                className={navLinkClass(getDashboardViewForRole(currentUser.role))}
              >
                {currentUser.role === 'RESIDENT' && 'Resident Portal'}
                {currentUser.role === 'PROVIDER' && 'Provider Portal'}
                {currentUser.role === 'ADMIN' && 'Admin Portal'}
              </button>
            )}

            {currentUser?.role === 'RESIDENT' && (
              <button
                onClick={() => setCurrentView('my-bookings')}
                className={navLinkClass('my-bookings')}
              >
                My Bookings
              </button>
            )}

            <button
              onClick={() => setCurrentView('contact-feedback')}
              className={navLinkClass('contact-feedback')}
            >
              Contact & Feedback
            </button>

            <button
              onClick={() => setCurrentView('spring-boot-hub')}
              className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                currentView === 'spring-boot-hub'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Java & Spring Boot Hub
            </button>
          </nav>

          {/* Zone 3: 1 primary action or identity controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Persona Switcher for the Student/Reviewer */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors whitespace-nowrap"
                title="Switch between Resident, Provider, and Admin accounts"
              >
                {currentUser?.role === 'RESIDENT' && <HomeIcon className="w-3.5 h-3.5 text-indigo-600" />}
                {currentUser?.role === 'PROVIDER' && <Wrench className="w-3.5 h-3.5 text-blue-600" />}
                {currentUser?.role === 'ADMIN' && <Shield className="w-3.5 h-3.5 text-purple-600" />}
                <span>Role: {currentUser ? currentUser.role : 'Guest'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-100">
                    Switch Test Account
                  </div>
                  {lastRegisteredUser && (
                    <button
                      onClick={() => {
                        directSignIn(lastRegisteredUser.email);
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 bg-emerald-50/70 hover:bg-emerald-100/70 border-b border-emerald-100 flex items-center justify-between text-slate-700"
                    >
                      <div>
                        <div className="font-semibold text-emerald-950 flex items-center gap-1.5">
                          <span>{lastRegisteredUser.name}</span>
                          <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1 py-0.2 rounded font-bold">Yours</span>
                        </div>
                        <div className="text-[11px] text-emerald-700 font-mono truncate max-w-[150px]">
                          {lastRegisteredUser.email}
                        </div>
                      </div>
                      {currentUser?.email.toLowerCase() === lastRegisteredUser.email.toLowerCase() && (
                        <span className="text-emerald-600 font-bold">✓</span>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handleRoleSelect('RESIDENT')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Sarah Chen (Resident)</div>
                      <div className="text-[11px] text-slate-500">Flat 402, Block B</div>
                    </div>
                    {currentUser?.role === 'RESIDENT' && <span className="text-indigo-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => handleRoleSelect('PROVIDER')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Dave Miller (Provider)</div>
                      <div className="text-[11px] text-slate-500">Electrician · ★4.9</div>
                    </div>
                    {currentUser?.role === 'PROVIDER' && <span className="text-indigo-600 font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => handleRoleSelect('ADMIN')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Marcus Vance (Admin)</div>
                      <div className="text-[11px] text-slate-500">Building Manager</div>
                    </div>
                    {currentUser?.role === 'ADMIN' && <span className="text-indigo-600 font-bold">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('profile')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('login')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setCurrentView('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 text-sm">
          <button
            onClick={() => {
              setCurrentView('home');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-slate-700 font-medium"
          >
            Home
          </button>
          {currentUser && (
            <button
              onClick={() => {
                setCurrentView(getDashboardViewForRole(currentUser.role));
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-slate-700 font-medium"
            >
              {currentUser.role} Dashboard
            </button>
          )}
          {currentUser?.role === 'RESIDENT' && (
            <button
              onClick={() => {
                setCurrentView('my-bookings');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-slate-700 font-medium"
            >
              My Bookings
            </button>
          )}
          <button
            onClick={() => {
              setCurrentView('contact-feedback');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-slate-700 font-medium"
          >
            Contact & Feedback
          </button>
          <button
            onClick={() => {
              setCurrentView('profile');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-slate-700 font-medium"
          >
            Profile
          </button>
          <button
            onClick={() => {
              setCurrentView('spring-boot-hub');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-indigo-600 font-semibold"
          >
            Java & Spring Boot Hub
          </button>
        </div>
      )}
    </header>
  );
};
