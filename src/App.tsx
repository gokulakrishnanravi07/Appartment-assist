/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { RegisterView } from './views/RegisterView';
import { LoginView } from './views/LoginView';
import { ResidentDashboardView } from './views/ResidentDashboardView';
import { ServiceBookingView } from './views/ServiceBookingView';
import { MyBookingsView } from './views/MyBookingsView';
import { ProviderDashboardView } from './views/ProviderDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { ProfileView } from './views/ProfileView';
import { ContactFeedbackView } from './views/ContactFeedbackView';
import { SpringBootHubView } from './views/SpringBootHubView';

const MainContent: React.FC = () => {
  const { currentView, currentUser, setCurrentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'register':
        return <RegisterView />;
      case 'login':
        return <LoginView />;
      case 'resident-dashboard':
        if (!currentUser) {
          return <LoginView />;
        }
        return <ResidentDashboardView />;
      case 'book-service':
        return <ServiceBookingView />;
      case 'my-bookings':
        return <MyBookingsView />;
      case 'provider-dashboard':
        if (!currentUser) {
          return <LoginView />;
        }
        return <ProviderDashboardView />;
      case 'admin-dashboard':
        if (!currentUser) {
          return <LoginView />;
        }
        return <AdminDashboardView />;
      case 'profile':
        if (!currentUser) {
          return <LoginView />;
        }
        return <ProfileView />;
      case 'contact-feedback':
        return <ContactFeedbackView />;
      case 'spring-boot-hub':
        return <SpringBootHubView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">{renderCurrentView()}</main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
