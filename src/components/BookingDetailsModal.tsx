import React, { useState } from 'react';
import { Booking, BookingStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { useApp } from '../context/AppContext';
import { X, Calendar, Clock, MapPin, User as UserIcon, Phone, FileText, DollarSign, AlertCircle } from 'lucide-react';

interface BookingDetailsModalProps {
  booking: Booking | null;
  onClose: () => void;
  onOpenReview?: (booking: Booking) => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  onClose,
  onOpenReview,
}) => {
  const { currentUser, cancelBooking, updateBookingStatus, assignProviderToBooking, users } = useApp();
  const [selectedProviderId, setSelectedProviderId] = useState<string>('');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (!booking) return null;

  const isResident = currentUser?.role === 'RESIDENT';
  const isProvider = currentUser?.role === 'PROVIDER';
  const isAdmin = currentUser?.role === 'ADMIN';

  const canCancel =
    (isResident && (booking.status === 'PENDING' || booking.status === 'ACCEPTED')) ||
    isAdmin;

  const handleStatusChange = (newStatus: BookingStatus) => {
    updateBookingStatus(booking.id, newStatus, currentUser?.id);
    onClose();
  };

  const handleCancel = () => {
    cancelBooking(booking.id, cancelReason);
    setConfirmCancel(false);
    onClose();
  };

  const handleAssignProvider = () => {
    if (selectedProviderId) {
      assignProviderToBooking(booking.id, selectedProviderId);
      setSelectedProviderId('');
      onClose();
    }
  };

  // List of active providers capable of handling this service
  const availableProviders = users.filter(
    (u) => u.role === 'PROVIDER' && u.status === 'ACTIVE'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">{booking.serviceName} Request</h2>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-xs text-slate-500 font-mono mt-1">Ref: {booking.bookingReference}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Main Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-slate-400" />
                Schedule
              </div>
              <p className="text-sm font-medium text-slate-900">{booking.preferredDate}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{booking.preferredTime}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-slate-400" />
                Apartment Location
              </div>
              <p className="text-sm font-medium text-slate-900">
                Flat {booking.apartmentNumber}, {booking.blockName}
              </p>
              {booking.addressNotes && (
                <p className="text-xs text-slate-500 italic">Notes: {booking.addressNotes}</p>
              )}
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <UserIcon className="w-4 h-4 text-slate-400" />
                Resident Details
              </div>
              <p className="text-sm font-medium text-slate-900">{booking.residentName}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{booking.residentPhone}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <DollarSign className="w-4 h-4 text-slate-400" />
                Billing & Pricing
              </div>
              <p className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                ₹{booking.estimatedPrice.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-slate-500">Standard residential service tariff</p>
            </div>
          </div>

          {/* Assigned Provider Box */}
          <div className="p-4 rounded-lg border border-slate-200 bg-white">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Assigned Service Provider
            </h3>
            {booking.providerName ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{booking.providerName}</p>
                  {booking.providerPhone && (
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" /> {booking.providerPhone}
                    </p>
                  )}
                </div>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                  Assigned & Verified
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>No specific provider assigned yet. Dispatch pool is evaluating.</span>
                {isAdmin && (
                  <span className="text-amber-700 font-medium">Pending Admin Action</span>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <FileText className="w-4 h-4 text-slate-400" />
              Service Notes & Problem Description
            </h3>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {booking.description}
            </div>
          </div>

          {booking.cancellationReason && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
              <strong>Cancellation Reason:</strong> {booking.cancellationReason}
            </div>
          )}

          {/* Admin Provider Assignment Interface */}
          {isAdmin && booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
            <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-lg space-y-3">
              <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                Admin Dispatch: Reassign or Dispatch Provider
              </h4>
              <div className="flex gap-2">
                <select
                  value={selectedProviderId}
                  onChange={(e) => setSelectedProviderId(e.target.value)}
                  className="flex-1 text-sm bg-white border border-indigo-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a provider...</option>
                  {availableProviders.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.name} ({prov.specialty || 'General'}) — ★{prov.rating}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssignProvider}
                  disabled={!selectedProviderId}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  Confirm Assign
                </button>
              </div>
            </div>
          )}

          {/* Cancellation Dialog State */}
          {confirmCancel && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-red-800 font-semibold text-sm">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Are you sure you want to cancel this booking?
              </div>
              <input
                type="text"
                placeholder="Brief reason (optional)..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs bg-white border border-red-200 rounded-md p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => setConfirmCancel(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-md"
                >
                  Back
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <div>
            {canCancel && !confirmCancel && (
              <button
                onClick={() => setConfirmCancel(true)}
                className="text-xs font-medium text-red-600 hover:text-red-800 hover:underline"
              >
                Cancel Booking
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Provider Actions */}
            {isProvider && (
              <>
                {booking.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleStatusChange('CANCELLED')}
                      className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleStatusChange('ACCEPTED')}
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      Accept Job
                    </button>
                  </>
                )}
                {booking.status === 'ACCEPTED' && (
                  <button
                    onClick={() => handleStatusChange('IN_PROGRESS')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  >
                    Start Service (In Progress)
                  </button>
                )}
                {booking.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => handleStatusChange('COMPLETED')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                  >
                    Mark Job as Completed
                  </button>
                )}
              </>
            )}

            {/* Resident Review action */}
            {isResident && booking.status === 'COMPLETED' && !booking.hasReview && onOpenReview && (
              <button
                onClick={() => {
                  onClose();
                  onOpenReview(booking);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
              >
                Write Rating & Feedback
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
