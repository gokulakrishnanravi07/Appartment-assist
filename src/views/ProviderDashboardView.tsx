import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking, BookingStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { BookingDetailsModal } from '../components/BookingDetailsModal';
import {
  Wrench,
  Star,
  CheckCircle2,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Play,
  Check,
  AlertCircle,
  Eye,
} from 'lucide-react';

export const ProviderDashboardView: React.FC = () => {
  const { currentUser, bookings, updateBookingStatus } = useApp();
  const [activeTab, setActiveTab] = useState<'assigned' | 'in_progress' | 'completed' | 'available'>('assigned');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const providerSpecialty = currentUser?.specialty || 'Electrician';

  // Relevant bookings for this provider
  const assignedBookings = bookings.filter(
    (b) => b.providerId === currentUser?.id || b.providerName === currentUser?.name
  );

  // Available unassigned bookings that match the provider's specialty
  const availableQueue = bookings.filter(
    (b) =>
      !b.providerId &&
      b.status === 'PENDING' &&
      b.serviceName.toLowerCase() === providerSpecialty.toLowerCase()
  );

  const pendingRequests = assignedBookings.filter((b) => b.status === 'PENDING' || b.status === 'ACCEPTED');
  const inProgressRequests = assignedBookings.filter((b) => b.status === 'IN_PROGRESS');
  const completedRequests = assignedBookings.filter((b) => b.status === 'COMPLETED');

  // Calculate earnings (80% provider payout of completed jobs)
  const totalEarnings = completedRequests.reduce((sum, b) => sum + b.estimatedPrice * 0.8, 0);

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    updateBookingStatus(bookingId, newStatus, currentUser?.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Provider Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Technician Portal
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">Verified Trade License</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {currentUser?.name || 'Service Technician'}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
            <span className="flex items-center gap-1.5 font-medium bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-md">
              <Wrench className="w-3.5 h-3.5 text-blue-600" />
              Specialty: {providerSpecialty}
            </span>
            <span className="flex items-center gap-1 text-amber-600 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {currentUser?.rating || 4.9} Overall Rating
            </span>
            <span className="text-slate-500">
              {currentUser?.phone || '+1 (555) 876-5432'}
            </span>
          </div>
        </div>

        {/* Quick Earnings Box */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-4">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Disbursed Earnings
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              ₹{Math.round(totalEarnings).toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-500">{completedRequests.length} completed jobs</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Available in Pool
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {availableQueue.length}
          </div>
          <p className="text-[11px] text-slate-500">Open {providerSpecialty} calls</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Accepted / Pending
          </div>
          <div className="text-2xl font-bold text-blue-600 font-mono tabular-nums">
            {pendingRequests.length}
          </div>
          <p className="text-[11px] text-slate-500">Scheduled for service</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
          <div className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
            In Progress
          </div>
          <div className="text-2xl font-bold text-purple-600 font-mono tabular-nums">
            {inProgressRequests.length}
          </div>
          <p className="text-[11px] text-slate-500">Currently executing work</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Jobs Completed
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">
            {completedRequests.length}
          </div>
          <p className="text-[11px] text-slate-500">Verified and closed</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 flex items-center gap-4 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('assigned')}
          className={`py-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'assigned'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Scheduled Jobs ({pendingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('in_progress')}
          className={`py-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'in_progress'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          In Progress ({inProgressRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('available')}
          className={`py-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'available'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Open Building Pool ({availableQueue.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`py-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'completed'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Completed History ({completedRequests.length})
        </button>
      </div>

      {/* Tab Content Display */}
      <div className="space-y-4">
        {activeTab === 'assigned' && (
          <div>
            {pendingRequests.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-xs text-slate-500">
                No pending or accepted service calls right now. Check the "Open Building Pool" tab to accept jobs!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingRequests.map((bk) => (
                  <div
                    key={bk.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 hover:border-slate-300 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-900">
                          {bk.bookingReference}
                        </span>
                        <span className="text-slate-300">·</span>
                        <h3 className="text-base font-bold text-slate-900">{bk.serviceName}</h3>
                      </div>
                      <StatusBadge status={bk.status} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-semibold text-slate-400">Resident</div>
                        <div className="font-semibold text-slate-900">{bk.residentName}</div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <Phone className="w-3 h-3" />
                          <span>{bk.residentPhone}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-semibold text-slate-400">Location</div>
                        <div className="font-medium text-slate-800">
                          Flat {bk.apartmentNumber}, {bk.blockName}
                        </div>
                        {bk.addressNotes && (
                          <div className="text-[11px] text-slate-500 italic">"{bk.addressNotes}"</div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-semibold text-slate-400">Appointment</div>
                        <div className="font-medium text-slate-800">{bk.preferredDate}</div>
                        <div className="text-[11px] text-slate-500">{bk.preferredTime}</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 bg-white p-2 rounded border border-slate-100">
                      <strong>Issue:</strong> {bk.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="text-xs font-mono font-semibold text-slate-900 tabular-nums">
                        Payout: ₹{Math.round(bk.estimatedPrice * 0.8).toLocaleString('en-IN')} (Estimated ₹{bk.estimatedPrice.toLocaleString('en-IN')})
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedBooking(bk)}
                          className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md font-medium"
                        >
                          View Details
                        </button>
                        {bk.status === 'PENDING' && (
                          <button
                            onClick={() => handleStatusChange(bk.id, 'ACCEPTED')}
                            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                          >
                            Accept Request
                          </button>
                        )}
                        {bk.status === 'ACCEPTED' && (
                          <button
                            onClick={() => handleStatusChange(bk.id, 'IN_PROGRESS')}
                            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-md flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            <span>Start Service</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'in_progress' && (
          <div>
            {inProgressRequests.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-xs text-slate-500">
                No active jobs currently in progress.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {inProgressRequests.map((bk) => (
                  <div
                    key={bk.id}
                    className="bg-white rounded-xl border border-purple-200 p-5 space-y-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-900">
                          {bk.bookingReference}
                        </span>
                        <span className="text-slate-300">·</span>
                        <h3 className="text-base font-bold text-slate-900">{bk.serviceName}</h3>
                      </div>
                      <StatusBadge status={bk.status} />
                    </div>

                    <div className="p-3 bg-purple-50/60 rounded-lg text-xs text-purple-950 space-y-1">
                      <div className="font-semibold">
                        Service Ongoing at Flat {bk.apartmentNumber}, {bk.blockName}
                      </div>
                      <p className="text-purple-800">
                        Resident: {bk.residentName} · {bk.residentPhone}
                      </p>
                    </div>

                    <p className="text-xs text-slate-700">
                      <strong>Problem Notes:</strong> {bk.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedBooking(bk)}
                        className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md font-medium"
                      >
                        Inspection Details
                      </button>

                      <button
                        onClick={() => handleStatusChange(bk.id, 'COMPLETED')}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Service as Completed</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'available' && (
          <div>
            {availableQueue.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-xs text-slate-500">
                No unassigned {providerSpecialty} requests in the pool. All requests are currently fulfilled!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {availableQueue.map((bk) => (
                  <div
                    key={bk.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 hover:border-indigo-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-900">
                          {bk.bookingReference}
                        </span>
                        <span className="text-slate-300">·</span>
                        <h3 className="text-base font-bold text-slate-900">{bk.serviceName}</h3>
                      </div>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        Available in Pool
                      </span>
                    </div>

                    <p className="text-xs text-slate-700">{bk.description}</p>

                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-4">
                      <span>Flat {bk.apartmentNumber}, {bk.blockName}</span>
                      <span>·</span>
                      <span>{bk.preferredDate} ({bk.preferredTime})</span>
                      <span>·</span>
                      <span className="font-mono font-semibold text-slate-900">
                        Est: ₹{bk.estimatedPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleStatusChange(bk.id, 'ACCEPTED')}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                      >
                        Claim & Accept Job
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div>
            {completedRequests.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-xs text-slate-500">
                No completed jobs recorded yet for this session.
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">Ref</th>
                      <th className="py-3 px-4">Resident</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Service Fee</th>
                      <th className="py-3 px-4 text-right">Provider Share (80%)</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {completedRequests.map((bk) => (
                      <tr key={bk.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                          {bk.bookingReference}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">{bk.residentName}</td>
                        <td className="py-3 px-4 text-slate-600">
                          Flat {bk.apartmentNumber}, {bk.blockName}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{bk.preferredDate}</td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600">
                          ₹{bk.estimatedPrice.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 tabular-nums">
                          ₹{Math.round(bk.estimatedPrice * 0.8).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-emerald-700 font-medium">✓ Closed</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <BookingDetailsModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
};
