import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, PhoneCall, Mail, RotateCcw, Code } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, resetAllData } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                AA
              </div>
              <span className="text-white font-bold text-base tracking-tight">Apartment Assist</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your Apartment, Our Responsibility. Seamless residential household service booking, certified maintenance technicians, and community property management.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified building security & licensed trade partners</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Platform Pages
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentView('home')}
                  className="hover:text-white transition-colors"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('book-service')}
                  className="hover:text-white transition-colors"
                >
                  Book a Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('my-bookings')}
                  className="hover:text-white transition-colors"
                >
                  My Bookings & Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('contact-feedback')}
                  className="hover:text-white transition-colors"
                >
                  Contact & Community Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Student & Academic Context */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Full-Stack Architecture
            </h4>
            <p className="text-xs text-slate-400 mb-2">
              Designed as a reference system for college students learning Java Spring Boot, MySQL JPA, and secure session authentication.
            </p>
            <button
              onClick={() => setCurrentView('spring-boot-hub')}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              <Code className="w-3.5 h-3.5" />
              Explore Spring Boot Source & DDL
            </button>
          </div>

          {/* Building Management & Help Desk */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Apartment Help Desk
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                <span>Facilities Desk: +1 (555) 019-2834</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>concierge@apartmentassist.com</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={resetAllData}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
                  title="Reset localStorage seed state to default"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Sample Data
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Apartment Assist Resident Services. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Spring Boot 3.3.x</span>
            <span>·</span>
            <span>Spring Security</span>
            <span>·</span>
            <span>MySQL InnoDB</span>
            <span>·</span>
            <span>Hibernate JPA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
