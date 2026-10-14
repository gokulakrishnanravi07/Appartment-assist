import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { BookingDetailsModal } from '../components/BookingDetailsModal';
import { ReviewModal } from '../components/ReviewModal';
import {
  Calendar,
  Clock,
  PlusCircle,
  FileText,
  User,
  Home,
  CheckCircle,
  Hourglass,
  ArrowRight,
  Star,
} from 'lucide-react';

export const ResidentDashboardView: React.FC = () => {
  const { currentUser, bookings, setCurrentView } = useApp();

  const [activeModalBooking, setActiveModalBooking] = useState<Booking | null>(null);
  const [reviewModalBooking, setReviewModalBooking] = useState<Booking | null>(null);

  // Filter bookings for this resident
  const residentBookings = bookings.filter(
    (b) => b.residentId === currentUser?.id || b.residentName === currentUser?.name
  );

  const totalCount = residentBookings.length;
  const pendingCount = residentBookings.filter((b) => b.status === 'PENDING').length;
  const inProgressCount = residentBookings.filter(
    (b) => b.status === 'IN_PROGRESS' || b.status === 'ACCEPTED'
  ).length;
  const completedCount = residentBookings.filter((b) => b.status === 'COMPLETED').length;

  const recentBookings = residentBookings.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome & Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Resident Portal
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">Active Lease Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Welcome back, {currentUser?.name || 'Resident'}!
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
            <span className="flex items-center gap-1.5 font-medium bg-slate-100 px-2.5 py-1 rounded-md">
              <Home className="w-3.5 h-3.5 text-slate-500" />
              Flat {currentUser?.apartmentNumber || '402'} · {currentUser?.blockName || 'Building B'}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {currentUser?.email}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentView('profile')}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Edit Profile
          </button>
          <button
            onClick={() => setCurrentView('book-service')}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book New Service</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Bookings
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalCount}
          </div>
          <p className="text-[11px] text-slate-500">All-time maintenance requests</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1">
            <Hourglass className="w-3.5 h-3.5" />
            Pending Dispatch
          </div>
          <div className="text-2xl font-bold text-amber-600 font-mono tabular-nums">
            {pendingCount}
          </div>
          <p className="text-[11px] text-slate-500">Awaiting provider confirmation</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
          <div className="text-xs font-semibold text-purple-700 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Active / In Progress
          </div>
          <div className="text-2xl font-bold text-purple-600 font-mono tabular-nums">
            {inProgressCount}
          </div>
          <p className="text-[11px] text-slate-500">Service scheduled or ongoing</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Completed
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">
            {completedCount}
          </div>
          <p className="text-[11px] text-slate-500">Successfully serviced jobs</p>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold">Have an immediate apartment maintenance issue?</h3>
          <p className="text-xs text-indigo-200 mt-1">
            Certified plumbers, electricians, housekeepers, and AC technicians are stationed within the complex.
          </p>
        </div>
        <button
          onClick={() => setCurrentView('book-service')}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap"
        >
          Book Now →
        </button>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Service Bookings</h2>
            <p className="text-xs text-slate-500 mt-0.5">Live tracking of your scheduled requests</p>
          </div>
          <button
            onClick={() => setCurrentView('my-bookings')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-700">No bookings yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't requested any services yet. Choose from house cleaning, plumbing, repairs, and more.
            </p>
            <button
              onClick={() => setCurrentView('book-service')}
              className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700"
            >
              Request Your First Service
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Schedule Date & Slot</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Estimated Fee</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">
                      {bk.bookingReference}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {bk.serviceName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{bk.preferredDate}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{bk.preferredTime}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {bk.providerName ? (
                        <span className="font-medium">{bk.providerName}</span>
                      ) : (
                        <span className="text-slate-400 italic">Assigning...</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={bk.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 tabular-nums">
                      ₹{bk.estimatedPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setActiveModalBooking(bk)}
                        className="px-2.5 py-1 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded font-medium transition-colors"
                      >
                        Details
                      </button>
                      {bk.status === 'COMPLETED' && !bk.hasReview && (
                        <button
                          onClick={() => setReviewModalBooking(bk)}
                          className="px-2.5 py-1 text-white bg-amber-600 hover:bg-amber-700 rounded font-medium transition-colors inline-flex items-center gap-1"
                        >
                          <Star className="w-3 h-3 fill-white" />
                          <span>Rate</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <BookingDetailsModal
        booking={activeModalBooking}
        onClose={() => setActiveModalBooking(null)}
        onOpenReview={(bk) => setReviewModalBooking(bk)}
      />

      <ReviewModal
        booking={reviewModalBooking}
        onClose={() => setReviewModalBooking(null)}
      />
    </div>
  );
};
