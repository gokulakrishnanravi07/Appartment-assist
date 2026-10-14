import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceItem, User, Booking } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { BookingDetailsModal } from '../components/BookingDetailsModal';
import {
  Users,
  Wrench,
  Layers,
  CalendarCheck,
  Star,
  Plus,
  CheckCircle,
  XCircle,
  Edit2,
  Search,
  Filter,
  Check,
  UserPlus,
  Shield,
  Download,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    users,
    services,
    bookings,
    reviews,
    addService,
    updateService,
    toggleServiceStatus,
    addProvider,
    toggleProviderStatus,
    assignProviderToBooking,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'bookings' | 'providers' | 'residents' | 'services' | 'feedback'
  >('bookings');

  const [bookingFilter, setBookingFilter] = useState<string>('ALL');
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<Booking | null>(null);

  // New Service Modal state
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('349');
  const [newServiceDuration, setNewServiceDuration] = useState('1 - 2 hours');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // Editing service state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');

  // New Provider Modal state
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [provName, setProvName] = useState('');
  const [provEmail, setProvEmail] = useState('');
  const [provPhone, setProvPhone] = useState('');
  const [provSpecialty, setProvSpecialty] = useState('Electrician');

  // Stats
  const totalResidents = users.filter((u) => u.role === 'RESIDENT').length;
  const totalProviders = users.filter((u) => u.role === 'PROVIDER').length;
  const totalServices = services.length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'PENDING').length;
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED').length;
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  const residentsList = users.filter((u) => u.role === 'RESIDENT');
  const providersList = users.filter((u) => u.role === 'PROVIDER');

  // Filtered bookings
  const filteredBookings = bookings.filter((bk) => {
    if (bookingFilter === 'PENDING' && bk.status !== 'PENDING') return false;
    if (bookingFilter === 'ACCEPTED' && bk.status !== 'ACCEPTED') return false;
    if (bookingFilter === 'IN_PROGRESS' && bk.status !== 'IN_PROGRESS') return false;
    if (bookingFilter === 'COMPLETED' && bk.status !== 'COMPLETED') return false;
    if (bookingFilter === 'CANCELLED' && bk.status !== 'CANCELLED') return false;
    return true;
  });

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    addService({
      name: newServiceName.trim(),
      category: newServiceCategory.trim() || 'General',
      description: newServiceDesc.trim() || 'Apartment residential maintenance service.',
      basePrice: parseFloat(newServicePrice) || 40,
      estimatedDuration: newServiceDuration.trim() || '1 hour',
      active: true,
      image: '/src/assets/images/service_technician_repair_1791955632815.jpg',
    });

    setNewServiceName('');
    setNewServiceCategory('');
    setNewServiceDesc('');
    setShowAddService(false);
  };

  const handleSaveServicePrice = (id: string) => {
    const val = parseFloat(editPrice);
    if (!isNaN(val) && val > 0) {
      updateService(id, { basePrice: val });
    }
    setEditingServiceId(null);
  };

  const handleCreateProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provName.trim() || !provEmail.trim()) return;

    addProvider({
      name: provName.trim(),
      email: provEmail.trim(),
      phone: provPhone.trim() || '+1 (555) 000-0000',
      specialty: provSpecialty,
    });

    setProvName('');
    setProvEmail('');
    setProvPhone('');
    setShowAddProvider(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1 text-white">
            Apartment Assist System Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Centralized monitoring of residents, service dispatch, vendor licenses, bookings lifecycle, and quality ratings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ bookings, users, reviews, services }, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute('href', dataStr);
              downloadAnchor.setAttribute('download', 'apartment_assist_report.json');
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data JSON</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Residents
          </span>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            {totalResidents}
          </div>
          <span className="text-[10px] text-slate-500">Verified leases</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Active Providers
          </span>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            {totalProviders}
          </div>
          <span className="text-[10px] text-slate-500">Certified trade staff</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Catalog Services
          </span>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            {totalServices}
          </div>
          <span className="text-[10px] text-slate-500">Available offerings</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Bookings
          </span>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            {totalBookings}
          </div>
          <span className="text-[10px] text-slate-500">All historical logs</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider">
            Pending Action
          </span>
          <div className="text-xl font-bold text-amber-600 font-mono tabular-nums">
            {pendingBookings}
          </div>
          <span className="text-[10px] text-amber-700">Needs dispatch</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
            Avg Resident Rating
          </span>
          <div className="text-xl font-bold text-emerald-600 font-mono tabular-nums">
            ★ {avgRating}
          </div>
          <span className="text-[10px] text-slate-500">{reviews.length} total reviews</span>
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('bookings')}
          className={`py-3 px-1 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'bookings'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Bookings & Dispatch ({totalBookings})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('providers')}
          className={`py-3 px-1 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'providers'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Provider Management ({totalProviders})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('residents')}
          className={`py-3 px-1 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'residents'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Resident Accounts ({totalResidents})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('services')}
          className={`py-3 px-1 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'services'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Service Catalog ({totalServices})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('feedback')}
          className={`py-3 px-1 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeAdminTab === 'feedback'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Feedback & Quality ({reviews.length})</span>
        </button>
      </div>

      {/* Admin Tab 1: Bookings Management */}
      {activeAdminTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-lg">
              {['ALL', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setBookingFilter(tab)}
                  className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                    bookingFilter === tab
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'ALL' ? 'All Requests' : tab.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500">
              Showing <strong>{filteredBookings.length}</strong> matching bookings
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Ref</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Resident</th>
                    <th className="py-3 px-4">Apartment</th>
                    <th className="py-3 px-4">Scheduled Slot</th>
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Price</th>
                    <th className="py-3 px-4 text-right">Dispatch Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((bk) => (
                    <tr key={bk.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        {bk.bookingReference}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{bk.serviceName}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{bk.residentName}</td>
                      <td className="py-3 px-4 text-slate-600">
                        Flat {bk.apartmentNumber}, {bk.blockName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div>{bk.preferredDate}</div>
                        <div className="text-[10px] text-slate-500">{bk.preferredTime}</div>
                      </td>
                      <td className="py-3 px-4">
                        {bk.providerName ? (
                          <span className="text-slate-800 font-medium">{bk.providerName}</span>
                        ) : (
                          <span className="text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={bk.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900 font-semibold">
                        ₹{bk.estimatedPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedBookingForModal(bk)}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded transition-colors"
                        >
                          Manage / Dispatch
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Admin Tab 2: Provider Management */}
      {activeAdminTab === 'providers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Service Provider Roster</h2>
            <button
              onClick={() => setShowAddProvider(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Enroll New Provider</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Provider Name</th>
                  <th className="py-3 px-4">Trade Specialty</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Jobs</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {providersList.map((prov) => (
                  <tr key={prov.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{prov.name}</td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-700">
                        {prov.specialty || 'General Trade'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{prov.email}</div>
                      <div className="text-[11px] text-slate-500">{prov.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-amber-600">
                      ★ {prov.rating || 5.0}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                      {prov.totalJobs || 0}
                    </td>
                    <td className="py-3 px-4">
                      {prov.status === 'ACTIVE' ? (
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                          Active & Approved
                        </span>
                      ) : (
                        <span className="text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded">
                          Deactivated
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleProviderStatus(prov.id)}
                        className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
                          prov.status === 'ACTIVE'
                            ? 'text-red-700 border-red-200 hover:bg-red-50'
                            : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                        }`}
                      >
                        {prov.status === 'ACTIVE' ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Tab 3: Resident Management */}
      {activeAdminTab === 'residents' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">Registered Resident Directory</h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Resident Name</th>
                  <th className="py-3 px-4">Apartment & Block</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Bookings Count</th>
                  <th className="py-3 px-4">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {residentsList.map((res) => {
                  const resBookingCount = bookings.filter((b) => b.residentId === res.id).length;
                  return (
                    <tr key={res.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{res.name}</td>
                      <td className="py-3 px-4 text-slate-700">
                        Flat {res.apartmentNumber || '402'}, {res.blockName || 'Tower B'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{res.email}</td>
                      <td className="py-3 px-4 text-slate-600">{res.phone}</td>
                      <td className="py-3 px-4 font-mono font-semibold tabular-nums text-slate-900">
                        {resBookingCount}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(res.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin Tab 4: Service Catalog Management */}
      {activeAdminTab === 'services' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Active Service Offerings</h2>
            <button
              onClick={() => setShowAddService(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((srv) => (
              <div
                key={srv.id}
                className={`p-4 bg-white rounded-xl border transition-all space-y-3 ${
                  srv.active ? 'border-slate-200' : 'border-slate-200 bg-slate-50 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{srv.name}</h3>
                    <span className="text-[11px] text-slate-500">{srv.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {srv.active ? (
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-600 font-semibold bg-slate-200 px-2 py-0.5 rounded">
                        Disabled
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600">{srv.description}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Base Price: </span>
                    {editingServiceId === srv.id ? (
                      <div className="inline-flex items-center gap-1">
                        <span className="text-slate-500">₹</span>
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-16 p-1 text-xs border rounded bg-white text-slate-900 font-mono"
                        />
                        <button
                          onClick={() => handleSaveServicePrice(srv.id)}
                          className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="font-mono font-bold text-slate-900">
                        ₹{srv.basePrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingServiceId(srv.id);
                        setEditPrice(srv.basePrice.toString());
                      }}
                      className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Price</span>
                    </button>
                    <button
                      onClick={() => toggleServiceStatus(srv.id)}
                      className="text-xs text-slate-600 hover:text-slate-900 underline"
                    >
                      {srv.active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Tab 5: Feedback Management */}
      {activeAdminTab === 'feedback' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Resident Feedback & Star Ratings</h2>
            <span className="text-xs text-slate-500 font-medium">
              Average Score: <strong>★ {avgRating} / 5.0</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-5 rounded-xl border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{rev.residentName}</h3>
                    <span className="text-[11px] text-slate-500">
                      Ref: {rev.bookingReference} · {rev.serviceName}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg leading-relaxed italic">
                  "{rev.feedback}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  {rev.providerName && (
                    <span className="text-slate-600 font-medium">
                      Technician: {rev.providerName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Enroll Provider */}
      {showAddProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <form
            onSubmit={handleCreateProvider}
            className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4"
          >
            <h3 className="text-base font-bold text-slate-900">Enroll New Service Technician</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={provName}
                onChange={(e) => setProvName(e.target.value)}
                placeholder="e.g. Liam Anderson"
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Work Email
              </label>
              <input
                type="email"
                required
                value={provEmail}
                onChange={(e) => setProvEmail(e.target.value)}
                placeholder="provider.liam@apartmentassist.com"
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={provPhone}
                onChange={(e) => setProvPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Trade Specialty
              </label>
              <select
                value={provSpecialty}
                onChange={(e) => setProvSpecialty(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddProvider(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg"
              >
                Save & Approve Provider
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add Service */}
      {showAddService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <form
            onSubmit={handleCreateService}
            className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4"
          >
            <h3 className="text-base font-bold text-slate-900">Add New Service Category</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Service Name
              </label>
              <input
                type="text"
                required
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                placeholder="e.g. Pest Control"
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Category
              </label>
              <input
                type="text"
                value={newServiceCategory}
                onChange={(e) => setNewServiceCategory(e.target.value)}
                placeholder="e.g. Sanitation"
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Base Price (₹)
                </label>
                <input
                  type="number"
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={newServiceDuration}
                  onChange={(e) => setNewServiceDuration(e.target.value)}
                  placeholder="1 - 2 hours"
                  className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={newServiceDesc}
                onChange={(e) => setNewServiceDesc(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddService(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg"
              >
                Add Service
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Booking Details & Reassign */}
      <BookingDetailsModal
        booking={selectedBookingForModal}
        onClose={() => setSelectedBookingForModal(null)}
      />
    </div>
  );
};
