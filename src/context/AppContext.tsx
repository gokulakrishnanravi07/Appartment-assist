import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ServiceItem, Booking, Review, UserRole, BookingStatus } from '../types';
import { INITIAL_USERS, INITIAL_SERVICES, INITIAL_BOOKINGS, INITIAL_REVIEWS } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  services: ServiceItem[];
  bookings: Booking[];
  reviews: Review[];
  currentView: string;
  selectedServiceForBooking: ServiceItem | null;
  lastRegisteredUser: {
    name: string;
    email: string;
    password?: string;
    apartmentNumber?: string;
    blockName?: string;
  } | null;
  setCurrentView: (view: string) => void;
  setSelectedServiceForBooking: (service: ServiceItem | null) => void;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  directSignIn: (email: string) => { success: boolean; error?: string };
  register: (data: {
    name: string;
    email: string;
    phone: string;
    apartmentNumber: string;
    blockName: string;
    password: string;
  }) => { success: boolean; error?: string; verificationCode?: string };
  logout: () => void;
  quickSwitchRole: (role: UserRole) => void;
  createBooking: (data: {
    serviceId: string;
    serviceName: string;
    description: string;
    preferredDate: string;
    preferredTime: string;
    apartmentNumber: string;
    blockName: string;
    addressNotes?: string;
    estimatedPrice: number;
  }) => Booking;
  cancelBooking: (bookingId: string, reason?: string) => boolean;
  updateBookingStatus: (bookingId: string, status: BookingStatus, providerId?: string) => boolean;
  assignProviderToBooking: (bookingId: string, providerId: string) => boolean;
  submitReview: (bookingId: string, rating: number, feedback: string) => boolean;
  updateProfile: (data: Partial<User>) => boolean;
  addService: (service: Omit<ServiceItem, 'id'>) => boolean;
  updateService: (id: string, data: Partial<ServiceItem>) => boolean;
  toggleServiceStatus: (id: string) => boolean;
  addProvider: (data: {
    name: string;
    email: string;
    phone: string;
    specialty: string;
  }) => boolean;
  toggleProviderStatus: (providerId: string) => boolean;
  resetPassword: (email: string, newPass: string) => { success: boolean; error?: string };
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults with INR support
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('apt_assist_inr_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('apt_assist_inr_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('apt_assist_inr_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('apt_assist_inr_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('apt_assist_inr_curr_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [lastRegisteredUser, setLastRegisteredUser] = useState<{
    name: string;
    email: string;
    password?: string;
    apartmentNumber?: string;
    blockName?: string;
  } | null>(() => {
    const saved = localStorage.getItem('apt_assist_last_registered');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [currentView, setCurrentView] = useState<string>('login');
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('apt_assist_inr_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('apt_assist_inr_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('apt_assist_inr_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('apt_assist_inr_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('apt_assist_inr_curr_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('apt_assist_inr_curr_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (lastRegisteredUser) {
      localStorage.setItem('apt_assist_last_registered', JSON.stringify(lastRegisteredUser));
    }
  }, [lastRegisteredUser]);

  // Authentication
  const login = (email: string, pass: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!found) {
      return { success: false, error: 'No account found with this email address. Please register or check for typos.' };
    }
    if (found.status === 'DEACTIVATED') {
      return { success: false, error: 'This account has been deactivated. Contact management.' };
    }

    // Verify password: allow user's custom password, or demo master password
    if (found.password && found.password !== pass && pass !== 'ApartmentPass2026!') {
      return {
        success: false,
        error: 'Incorrect password. (Tip: You can use your custom password, reset password below in-app, or use "ApartmentPass2026!")',
      };
    }

    setCurrentUser(found);

    // Redirect to proper role dashboard
    if (found.role === 'RESIDENT') {
      setCurrentView('resident-dashboard');
    } else if (found.role === 'PROVIDER') {
      setCurrentView('provider-dashboard');
    } else if (found.role === 'ADMIN') {
      setCurrentView('admin-dashboard');
    }
    return { success: true };
  };

  // Direct instant sign-in without password prompts or email obstacles
  const directSignIn = (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!found) {
      return { success: false, error: 'Account not found. Please register first.' };
    }
    if (found.status === 'DEACTIVATED') {
      return { success: false, error: 'This account has been deactivated.' };
    }
    setCurrentUser(found);
    if (found.role === 'RESIDENT') {
      setCurrentView('resident-dashboard');
    } else if (found.role === 'PROVIDER') {
      setCurrentView('provider-dashboard');
    } else if (found.role === 'ADMIN') {
      setCurrentView('admin-dashboard');
    }
    return { success: true };
  };

  const register = (data: {
    name: string;
    email: string;
    phone: string;
    apartmentNumber: string;
    blockName: string;
    password: string;
  }) => {
    const normalizedEmail = data.email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists. You can sign in directly.' };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser: User = {
      id: `usr-res-${Date.now()}`,
      name: data.name.trim(),
      email: normalizedEmail,
      phone: data.phone.trim(),
      role: 'RESIDENT', // Public registration restricted to Resident by default
      apartmentNumber: data.apartmentNumber.trim(),
      blockName: data.blockName.trim(),
      status: 'ACTIVE',
      password: data.password,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setLastRegisteredUser({
      name: data.name.trim(),
      email: normalizedEmail,
      password: data.password,
      apartmentNumber: data.apartmentNumber.trim(),
      blockName: data.blockName.trim(),
    });

    return { success: true, verificationCode: code };
  };

  const resetPassword = (email: string, newPass: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!found) {
      return { success: false, error: 'No account found with this email address.' };
    }
    setUsers((prev) =>
      prev.map((u) => (u.email.toLowerCase() === normalizedEmail ? { ...u, password: newPass } : u))
    );
    if (lastRegisteredUser && lastRegisteredUser.email.toLowerCase() === normalizedEmail) {
      setLastRegisteredUser({ ...lastRegisteredUser, password: newPass });
    }
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  const quickSwitchRole = (role: UserRole) => {
    if (role === 'RESIDENT') {
      const res = users.find((u) => u.role === 'RESIDENT') || INITIAL_USERS[0];
      setCurrentUser(res);
      setCurrentView('resident-dashboard');
    } else if (role === 'PROVIDER') {
      const pro = users.find((u) => u.role === 'PROVIDER') || INITIAL_USERS[2];
      setCurrentUser(pro);
      setCurrentView('provider-dashboard');
    } else if (role === 'ADMIN') {
      const adm = users.find((u) => u.role === 'ADMIN') || INITIAL_USERS[5];
      setCurrentUser(adm);
      setCurrentView('admin-dashboard');
    }
  };

  // Bookings
  const createBooking = (data: {
    serviceId: string;
    serviceName: string;
    description: string;
    preferredDate: string;
    preferredTime: string;
    apartmentNumber: string;
    blockName: string;
    addressNotes?: string;
    estimatedPrice: number;
  }) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `APT-2026-${randomSuffix}`;

    // Auto-match an active provider for that specialty if available
    const matchedProvider = users.find(
      (u) => u.role === 'PROVIDER' && u.specialty === data.serviceName && u.status === 'ACTIVE'
    );

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingReference: bookingRef,
      residentId: currentUser?.id || 'usr-res-guest',
      residentName: currentUser?.name || 'Resident',
      residentPhone: currentUser?.phone || '555-0000',
      apartmentNumber: data.apartmentNumber,
      blockName: data.blockName,
      serviceId: data.serviceId,
      serviceName: data.serviceName,
      providerId: matchedProvider?.id,
      providerName: matchedProvider?.name,
      providerPhone: matchedProvider?.phone,
      description: data.description,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      addressNotes: data.addressNotes,
      estimatedPrice: data.estimatedPrice,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const cancelBooking = (bookingId: string, reason?: string) => {
    setBookings((prev) =>
      prev.map((bk) => {
        if (bk.id === bookingId) {
          return {
            ...bk,
            status: 'CANCELLED',
            cancellationReason: reason || 'Cancelled by resident',
          };
        }
        return bk;
      })
    );
    return true;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus, providerId?: string) => {
    setBookings((prev) =>
      prev.map((bk) => {
        if (bk.id === bookingId) {
          const updated: Booking = {
            ...bk,
            status,
            ...(status === 'COMPLETED' ? { completedAt: new Date().toISOString() } : {}),
          };
          if (providerId) {
            const prov = users.find((u) => u.id === providerId);
            if (prov) {
              updated.providerId = prov.id;
              updated.providerName = prov.name;
              updated.providerPhone = prov.phone;
            }
          }
          return updated;
        }
        return bk;
      })
    );
    return true;
  };

  const assignProviderToBooking = (bookingId: string, providerId: string) => {
    const prov = users.find((u) => u.id === providerId);
    if (!prov) return false;

    setBookings((prev) =>
      prev.map((bk) => {
        if (bk.id === bookingId) {
          return {
            ...bk,
            providerId: prov.id,
            providerName: prov.name,
            providerPhone: prov.phone,
            status: bk.status === 'PENDING' ? 'ACCEPTED' : bk.status,
          };
        }
        return bk;
      })
    );
    return true;
  };

  const submitReview = (bookingId: string, rating: number, feedback: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return false;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      bookingId,
      bookingReference: booking.bookingReference,
      residentId: currentUser?.id || booking.residentId,
      residentName: currentUser?.name || booking.residentName,
      serviceName: booking.serviceName,
      providerName: booking.providerName,
      rating,
      feedback,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);

    // Mark booking as having a review
    setBookings((prev) =>
      prev.map((bk) => (bk.id === bookingId ? { ...bk, hasReview: true } : bk))
    );
    return true;
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return false;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    return true;
  };

  const addService = (serviceData: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...serviceData,
      id: `srv-${Date.now()}`,
    };
    setServices((prev) => [...prev, newService]);
    return true;
  };

  const updateService = (id: string, data: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    return true;
  };

  const toggleServiceStatus = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
    return true;
  };

  const addProvider = (data: {
    name: string;
    email: string;
    phone: string;
    specialty: string;
  }) => {
    const newProvider: User = {
      id: `usr-pro-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      role: 'PROVIDER',
      specialty: data.specialty,
      rating: 5.0,
      totalJobs: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newProvider]);
    return true;
  };

  const toggleProviderStatus = (providerId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === providerId) {
          const nextStatus = u.status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    return true;
  };

  const resetAllData = () => {
    localStorage.removeItem('apt_assist_inr_users');
    localStorage.removeItem('apt_assist_inr_services');
    localStorage.removeItem('apt_assist_inr_bookings');
    localStorage.removeItem('apt_assist_inr_reviews');
    localStorage.removeItem('apt_assist_inr_curr_user');
    localStorage.removeItem('apt_assist_users');
    localStorage.removeItem('apt_assist_services');
    localStorage.removeItem('apt_assist_bookings');
    localStorage.removeItem('apt_assist_reviews');
    localStorage.removeItem('apt_assist_curr_user');
    setUsers(INITIAL_USERS);
    setServices(INITIAL_SERVICES);
    setBookings(INITIAL_BOOKINGS);
    setReviews(INITIAL_REVIEWS);
    setCurrentUser(null);
    setCurrentView('login');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        services,
        bookings,
        reviews,
        currentView,
        selectedServiceForBooking,
        lastRegisteredUser,
        setCurrentView,
        setSelectedServiceForBooking,
        login,
        directSignIn,
        register,
        logout,
        quickSwitchRole,
        createBooking,
        cancelBooking,
        updateBookingStatus,
        assignProviderToBooking,
        submitReview,
        updateProfile,
        addService,
        updateService,
        toggleServiceStatus,
        addProvider,
        toggleProviderStatus,
        resetPassword,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
