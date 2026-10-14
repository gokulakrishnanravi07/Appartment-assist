import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Phone, Home, Building, Mail, Shield, CheckCircle2, Lock } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, updateProfile, setCurrentView } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [apartmentNumber, setApartmentNumber] = useState(currentUser?.apartmentNumber || '');
  const [blockName, setBlockName] = useState(currentUser?.blockName || 'Building B - Maple Tower');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdateDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }

    updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      apartmentNumber: apartmentNumber.trim(),
      blockName: blockName.trim(),
    });

    setMessage({ type: 'success', text: 'Profile information updated successfully!' });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!currentPassword) {
      setMessage({ type: 'error', text: 'Please enter your current password.' });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must have at least 8 characters.' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setMessage({
      type: 'success',
      text: 'Password updated successfully! (Securely salted and hashed via Spring BCrypt simulation)',
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 space-y-8">
      <div>
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          Account Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Profile & Preferences</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your verified contact coordinates and resident residence details.
        </p>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-lg text-xs flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Account Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-base">
              {currentUser?.name.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{currentUser?.name}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span>Role: {currentUser?.role}</span>
                <span>·</span>
                <span>Status: {currentUser?.status}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (currentUser?.role === 'RESIDENT') setCurrentView('resident-dashboard');
              else if (currentUser?.role === 'PROVIDER') setCurrentView('provider-dashboard');
              else if (currentUser?.role === 'ADMIN') setCurrentView('admin-dashboard');
            }}
            className="text-xs text-indigo-600 hover:underline font-medium"
          >
            Go to Portal →
          </button>
        </div>

        <form onSubmit={handleUpdateDetails} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address (Primary Identity)</span>
              </label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full text-xs p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                title="Primary identity email cannot be changed without management validation"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Phone Number</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            {currentUser?.role === 'RESIDENT' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-slate-400" />
                    <span>Flat / Apartment #</span>
                  </label>
                  <input
                    type="text"
                    value={apartmentNumber}
                    onChange={(e) => setApartmentNumber(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Building Block</span>
                  </label>
                  <select
                    value={blockName}
                    onChange={(e) => setBlockName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Building A - Cedar Tower">Building A - Cedar Tower</option>
                    <option value="Building B - Maple Tower">Building B - Maple Tower</option>
                    <option value="Building C - Oak Residences">Building C - Oak Residences</option>
                    <option value="Building D - Pine Heights">Building D - Pine Heights</option>
                  </select>
                </div>
              </>
            )}

            {currentUser?.role === 'PROVIDER' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Assigned Specialty
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser.specialty || ''}
                  className="w-full text-xs p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password Update Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Lock className="w-4 h-4 text-slate-600" />
          <h2 className="text-base font-bold text-slate-900">Security & Password</h2>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 chars"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter new"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
