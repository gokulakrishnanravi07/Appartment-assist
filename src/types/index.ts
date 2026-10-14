export type UserRole = 'RESIDENT' | 'PROVIDER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  apartmentNumber?: string;
  blockName?: string;
  specialty?: string; // For providers: 'Electrician', 'Plumber', etc.
  rating?: number; // For providers
  totalJobs?: number; // For providers
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'DEACTIVATED';
  createdAt: string;
  password?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  estimatedDuration: string;
  active: boolean;
  image?: string;
}

export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
  id: string;
  bookingReference: string; // e.g. APT-2026-7841
  residentId: string;
  residentName: string;
  residentPhone: string;
  apartmentNumber: string;
  blockName: string;
  serviceId: string;
  serviceName: string;
  providerId?: string;
  providerName?: string;
  providerPhone?: string;
  description: string;
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string; // e.g. "Morning (09:00 - 12:00)"
  addressNotes?: string;
  estimatedPrice: number;
  status: BookingStatus;
  createdAt: string;
  completedAt?: string;
  cancellationReason?: string;
  hasReview?: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  bookingReference: string;
  residentId: string;
  residentName: string;
  serviceName: string;
  providerName?: string;
  rating: number; // 1 to 5
  feedback: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}
