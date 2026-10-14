import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, CheckCircle2, AlertCircle, Lock, Mail, Phone, Home, Building, User, ShieldCheck, ArrowRight, Sparkles, KeyRound } from 'lucide-react';

export const RegisterView: React.FC = () => {
  const { register, directSignIn, setCurrentView } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    apartmentNumber: '',
    blockName: 'Building A - Cedar Tower',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredData, setRegisteredData] = useState<{
    name: string;
    email: string;
    apartmentNumber: string;
    blockName: string;
    verificationCode: string;
  } | null>(null);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0 to 4
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Field validation
    if (!formData.name.trim()) {
      setError('Please enter your full legal name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    const phoneRegex = /^[\d\s+\-()]{7,20}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setError('Please enter a valid phone number with area code.');
      return;
    }

    if (!formData.apartmentNumber.trim()) {
      setError('Please specify your apartment / flat number (e.g. 402, 1105).');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must contain at least 8 characters with letters and numbers.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('The passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    const result = register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      apartmentNumber: formData.apartmentNumber,
      blockName: formData.blockName,
      password: formData.password,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Failed to create account.');
    } else {
      setRegisteredData({
        name: formData.name.trim(),
        email: formData.email.trim(),
        apartmentNumber: formData.apartmentNumber.trim(),
        blockName: formData.blockName,
        verificationCode: result.verificationCode || '849201',
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:px-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2 font-bold text-sm">
            AA
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Resident Registration
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Register your apartment residence to request maintenance, track bookings, and access on-site services.
          </p>
        </div>

        {/* Verification Guarantee Notice */}
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-emerald-900">Direct In-App Verification (Zero Mail Needed):</span>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              You do <strong>not</strong> need to receive any email to verify your account. In this environment, your registration is verified directly on-screen so you can sign in immediately!
            </p>
          </div>
        </div>

        {/* Error Banners */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {registeredData ? (
          /* Verification Success & Instant Activation Screen */
          <div className="p-6 bg-slate-50 border-2 border-emerald-400 rounded-2xl space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
                ✓
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Account Verified & Activated!
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Welcome, <strong>{registeredData.name}</strong>. Your resident profile has been successfully registered and pre-verified.
              </p>
            </div>

            {/* On-Screen Verification Code Showcase */}
            <div className="bg-white border border-emerald-200 rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>In-App Verification Token:</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  Verified ✓
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div className="text-2xl font-mono font-bold tracking-widest text-emerald-700">
                  {registeredData.verificationCode}
                </div>
                <div className="text-[11px] text-slate-500 font-medium text-right">
                  Auto-Confirmed In-App<br />
                  <span className="text-emerald-600 font-semibold">No Email Wait Needed</span>
                </div>
              </div>

              {/* Profile Recap */}
              <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Registered Email:</span>
                  <span className="font-semibold text-slate-800">{registeredData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Residence:</span>
                  <span className="font-semibold text-slate-800">
                    Flat {registeredData.apartmentNumber}, {registeredData.blockName}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => directSignIn(registeredData.email)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>Sign In Instantly as {registeredData.name} →</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('login')}
                className="w-full py-2.5 text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold rounded-xl transition-colors"
              >
                Go to Sign In Page (Credentials Pre-Filled)
              </button>
            </div>
          </div>
        ) : (
          /* Standard Registration Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Legal Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Chen or Gokulakrishnan"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="resident@apartment.com"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Apartment # & Building Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Apartment / Flat # <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Home className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.apartmentNumber}
                    onChange={(e) => setFormData({ ...formData, apartmentNumber: e.target.value })}
                    placeholder="e.g. 402 or B-1105"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Building / Block Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={formData.blockName}
                    onChange={(e) => setFormData({ ...formData, blockName: e.target.value })}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    <option value="Building A - Cedar Tower">Building A - Cedar Tower</option>
                    <option value="Building B - Maple Tower">Building B - Maple Tower</option>
                    <option value="Building C - Oak Residences">Building C - Oak Residences</option>
                    <option value="Building D - Pine Heights">Building D - Pine Heights</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min. 8 characters"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength meter */}
                {formData.password && (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-full flex-1 rounded-full transition-colors ${
                            strength >= step
                              ? strength >= 3
                                ? 'bg-emerald-500'
                                : 'bg-amber-500'
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {strength <= 1 && 'Weak: add numbers & special characters'}
                      {strength === 2 && 'Fair: add uppercase or symbols'}
                      {strength >= 3 && 'Strong password'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* In-App Verification Assurance */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                By registering, your account is immediately verified and active. No email confirmation link is required to log in.
              </span>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs"
              >
                {isSubmitting ? 'Verifying & Registering...' : 'Complete Resident Registration & Verify'}
              </button>
            </div>

            <div className="text-center pt-2 text-xs text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setCurrentView('login')}
                className="text-indigo-600 hover:underline font-semibold"
              >
                Sign In to Your Dashboard
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
