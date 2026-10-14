import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceItem } from '../types';
import { Calendar, Clock, Home, Building, FileText, CheckCircle2, AlertCircle, DollarSign, ArrowLeft } from 'lucide-react';

export const ServiceBookingView: React.FC = () => {
  const {
    services,
    currentUser,
    selectedServiceForBooking,
    setSelectedServiceForBooking,
    createBooking,
    setCurrentView,
  } = useApp();

  // Find initial selected service or first available
  const initialService =
    selectedServiceForBooking || services.find((s) => s.active) || services[0];

  const [selectedService, setSelectedService] = useState<ServiceItem>(initialService);
  const [description, setDescription] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState(currentUser?.apartmentNumber || '402');
  const [blockName, setBlockName] = useState(currentUser?.blockName || 'Building B - Maple Tower');
  
  // Prevent past dates: minimum date is tomorrow or today
  const todayStr = new Date().toISOString().split('T')[0];
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  const [preferredTime, setPreferredTime] = useState('Morning (09:00 - 12:00)');
  const [addressNotes, setAddressNotes] = useState('');
  const [error, setError] = useState('');
  const [confirmedBookingRef, setConfirmedBookingRef] = useState<string | null>(null);

  useEffect(() => {
    if (selectedServiceForBooking) {
      setSelectedService(selectedServiceForBooking);
    }
  }, [selectedServiceForBooking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!description.trim()) {
      setError('Please provide a short description of the problem or service requirements.');
      return;
    }

    if (!apartmentNumber.trim()) {
      setError('Apartment/Flat number is required.');
      return;
    }

    if (preferredDate < todayStr) {
      setError('Preferred booking date cannot be in the past.');
      return;
    }

    const newBooking = createBooking({
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      description: description.trim(),
      preferredDate,
      preferredTime,
      apartmentNumber: apartmentNumber.trim(),
      blockName: blockName.trim(),
      addressNotes: addressNotes.trim() || undefined,
      estimatedPrice: selectedService.basePrice,
    });

    setConfirmedBookingRef(newBooking.bookingReference);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6">
      {confirmedBookingRef ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            ✓
          </div>
          <div className="space-y-2">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Booking Confirmed & Dispatched
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Appointment Scheduled Successfully!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Your service request has been logged into the apartment facilities database. You can track its status live from your portal.
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500">Booking Reference:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {confirmedBookingRef}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Service:</span>
              <span className="font-medium text-slate-900">{selectedService.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Scheduled:</span>
              <span className="text-slate-800">
                {preferredDate} · {preferredTime}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Location:</span>
              <span className="text-slate-800">
                Flat {apartmentNumber}, {blockName}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-500 font-semibold">Estimated Price:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                ₹{selectedService.basePrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedServiceForBooking(null);
                setCurrentView('my-bookings');
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Go to My Bookings
            </button>
            <button
              onClick={() => {
                setConfirmedBookingRef(null);
                setDescription('');
              }}
              className="px-4 py-2.5 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 text-xs font-medium rounded-lg transition-colors"
            >
              Book Another Service
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                Appointment Schedule
              </span>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">Book a Household Service</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Reliable, building-verified specialists scheduled at your convenience.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Category Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Service Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {services.map((srv) => (
                  <button
                    type="button"
                    key={srv.id}
                    onClick={() => setSelectedService(srv)}
                    className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                      selectedService.id === srv.id
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900">{srv.name}</span>
                    <span className="text-[11px] font-mono text-slate-500 mt-1 tabular-nums">
                      From ₹{srv.basePrice}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Service Details summary */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-800">
                  {selectedService.name} ({selectedService.category})
                </span>
                <p className="text-slate-500 text-[11px] mt-0.5">{selectedService.description}</p>
              </div>
              <div className="text-right pl-3 shrink-0">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Base Price</span>
                <span className="font-bold text-slate-900 font-mono text-sm tabular-nums">
                  ₹{selectedService.basePrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Problem Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>2. Description of the Issue / Requested Work</span> <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Master bathroom faucet dripping constantly; need washer replaced. Kitchen switchboard smells warm..."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none"
              />
            </div>

            {/* Location (Apartment # and Block) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-slate-400" />
                  <span>Apartment / Flat #</span> <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={apartmentNumber}
                  onChange={(e) => setApartmentNumber(e.target.value)}
                  placeholder="e.g. 402"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Building / Block</span> <span className="text-red-500">*</span>
                </label>
                <select
                  value={blockName}
                  onChange={(e) => setBlockName(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="Building A - Cedar Tower">Building A - Cedar Tower</option>
                  <option value="Building B - Maple Tower">Building B - Maple Tower</option>
                  <option value="Building C - Oak Residences">Building C - Oak Residences</option>
                  <option value="Building D - Pine Heights">Building D - Pine Heights</option>
                </select>
              </div>
            </div>

            {/* Date & Time Slot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preferred Date</span> <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preferred Time Slot</span> <span className="text-red-500">*</span>
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="Morning (09:00 - 12:00)">Morning (09:00 - 12:00)</option>
                  <option value="Afternoon (13:00 - 16:00)">Afternoon (13:00 - 16:00)</option>
                  <option value="Evening (17:00 - 20:00)">Evening (17:00 - 20:00)</option>
                </select>
              </div>
            </div>

            {/* Location / Entry Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Address / Access Notes (Optional)
              </label>
              <input
                type="text"
                value={addressNotes}
                onChange={(e) => setAddressNotes(e.target.value)}
                placeholder="e.g. Ring intercom 402; leave shoes in vestibule; pets in living room"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            {/* Estimated Price & Booking Action */}
            <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Estimated Total</span>
                <div className="text-2xl font-bold font-mono tabular-nums text-white">
                  ₹{selectedService.basePrice.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-slate-400">Standard resident booking fee</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
              >
                Confirm & Dispatch Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
