import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking, BookingStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { BookingDetailsModal } from '../components/BookingDetailsModal';
import { ReviewModal } from '../components/ReviewModal';
import {
  Calendar,
  Clock,
  PlusCircle,
  FileText,
  Search,
  Filter,
  Star,
  CheckCircle,
} from 'lucide-react';

export const MyBookingsView: React.FC = () => {
  const { currentUser, bookings, cancelBooking, setCurrentView } = useApp();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  // Resident's bookings
  const residentBookings = bookings.filter(
    (b) => b.residentId === currentUser?.id || b.residentName === currentUser?.name
  );

  // Filter by tab
  const filteredBookings = residentBookings.filter((bk) => {
    // Tab filter
    if (activeTab === 'PENDING' && bk.status !== 'PENDING') return false;
    if (activeTab === 'ACTIVE' && bk.status !== 'ACCEPTED' && bk.status !== 'IN_PROGRESS')
      return false;
    if (activeTab === 'COMPLETED' && bk.status !== 'COMPLETED') return false;
    if (activeTab === 'CANCELLED' && bk.status !== 'CANCELLED') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        bk.bookingReference.toLowerCase().includes(q) ||
        bk.serviceName.toLowerCase().includes(q) ||
        (bk.providerName && bk.providerName.toLowerCase().includes(q)) ||
        bk.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Booking History & Status
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            My Service Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor real-time repair progress, review assigned technicians, or cancel appointments.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('book-service')}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Service Booking</span>
        </button>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200">
        {/* Filter controls complying with Anti-Slop (functional buttons, not static candy pills) */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-lg shrink-0">
          {[
            { id: 'ALL', label: 'All Bookings' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'ACTIVE', label: 'Active & In Progress' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'CANCELLED', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ref #, service, provider..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">No bookings match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try switching the filter tab or clear your search term.
          </p>
          <button
            onClick={() => {
              setActiveTab('ALL');
              setSearchQuery('');
            }}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((bk) => (
            <div
              key={bk.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-xs transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-900">
                      {bk.bookingReference}
                    </span>
                    <span className="text-slate-300">·</span>
                    <h3 className="text-base font-bold text-slate-900">{bk.serviceName}</h3>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 max-w-xl">
                    {bk.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={bk.status} />
                  <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                    ₹{bk.estimatedPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {bk.preferredDate} · {bk.preferredTime}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400">Assigned Tech: </span>
                  <span className="font-medium text-slate-800">
                    {bk.providerName || 'Pending assignment'}
                  </span>
                </div>

                <div className="flex items-center justify-start sm:justify-end gap-2">
                  <button
                    onClick={() => setSelectedBooking(bk)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    View Details
                  </button>

                  {(bk.status === 'PENDING' || bk.status === 'ACCEPTED') && (
                    <button
                      onClick={() => cancelBooking(bk.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  )}

                  {bk.status === 'COMPLETED' && !bk.hasReview && (
                    <button
                      onClick={() => setReviewBooking(bk)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md transition-colors inline-flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5 fill-white" />
                      <span>Review Service</span>
                    </button>
                  )}

                  {bk.status === 'COMPLETED' && bk.hasReview && (
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Reviewed</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <BookingDetailsModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onOpenReview={(bk) => setReviewBooking(bk)}
      />

      <ReviewModal
        booking={reviewBooking}
        onClose={() => setReviewBooking(null)}
      />
    </div>
  );
};
