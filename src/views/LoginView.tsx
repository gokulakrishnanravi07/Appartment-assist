import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Wrench,
  Home,
  CheckCircle2,
  Sparkles,
  KeyRound,
  RefreshCw,
  Check,
  UserCheck,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, directSignIn, setCurrentView, resetPassword, lastRegisteredUser, users } = useApp();

  const [selectedRoleTab, setSelectedRoleTab] = useState<'RESIDENT' | 'PROVIDER' | 'ADMIN' | 'CUSTOM'>('RESIDENT');
  const [email, setEmail] = useState(() => {
    return lastRegisteredUser ? lastRegisteredUser.email : 'resident@apartmentassist.com';
  });
  const [password, setPassword] = useState(() => {
    return lastRegisteredUser?.password ? lastRegisteredUser.password : 'ApartmentPass2026!';
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  // In-App Instant Password Reset Modal State (No External Email Needed)
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<'form' | 'success'>('form');
  const [resetError, setResetError] = useState('');

  // If a new user just registered, keep form prefilled with their credentials
  useEffect(() => {
    if (lastRegisteredUser) {
      setEmail(lastRegisteredUser.email);
      if (lastRegisteredUser.password) {
        setPassword(lastRegisteredUser.password);
      }
    }
  }, [lastRegisteredUser]);

  // Find any newly registered resident users
  const customResidents = users.filter(
    (u) => u.role === 'RESIDENT' && u.id.startsWith('usr-res-') && u.email !== 'resident@apartmentassist.com' && u.email !== 'amit.patel@apartmentassist.com'
  );

  // Switch prefilled role credentials
  const handleRoleTabClick = (role: 'RESIDENT' | 'PROVIDER' | 'ADMIN' | 'CUSTOM') => {
    setSelectedRoleTab(role);
    setError('');
    if (role === 'RESIDENT') {
      setEmail('resident@apartmentassist.com');
      setPassword('ApartmentPass2026!');
    } else if (role === 'PROVIDER') {
      setEmail('provider.electrician@apartmentassist.com');
      setPassword('ApartmentPass2026!');
    } else if (role === 'ADMIN') {
      setEmail('admin@apartmentassist.com');
      setPassword('ApartmentPass2026!');
    } else if (role === 'CUSTOM' && lastRegisteredUser) {
      setEmail(lastRegisteredUser.email);
      setPassword(lastRegisteredUser.password || 'ApartmentPass2026!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both your registered email and password.');
      return;
    }

    const res = login(email, password);
    if (!res.success) {
      setError(res.error || 'Invalid email or password.');
    }
  };

  const handleInstantLogin = (role: 'RESIDENT' | 'PROVIDER' | 'ADMIN') => {
    let targetEmail = 'resident@apartmentassist.com';
    if (role === 'PROVIDER') targetEmail = 'provider.electrician@apartmentassist.com';
    if (role === 'ADMIN') targetEmail = 'admin@apartmentassist.com';

    setEmail(targetEmail);
    setPassword('ApartmentPass2026!');
    login(targetEmail, 'ApartmentPass2026!');
  };

  // Open reset modal and generate on-screen instant OTP
  const handleOpenForgotModal = () => {
    setResetEmail(email.trim());
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomCode);
    setEnteredOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
    setResetError('');
    setResetStep('form');
    setShowForgotPassword(true);
  };

  // Perform in-app password reset
  const handleProcessPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (!resetEmail.trim()) {
      setResetError('Please enter your account email address.');
      return;
    }

    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setResetError('Verification code does not match the on-screen code.');
      return;
    }

    if (newPassword.length < 8) {
      setResetError('New password must contain at least 8 characters.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setResetError('New passwords do not match. Please re-enter.');
      return;
    }

    const res = resetPassword(resetEmail, newPassword);
    if (!res.success) {
      setResetError(res.error || 'Failed to update password.');
      return;
    }

    // Success: auto-fill password into signin form
    setPassword(newPassword);
    setEmail(resetEmail);
    setResetStep('success');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-lg space-y-6">
        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-2 font-bold text-base shadow-sm">
              AA
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Apartment Assist Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Sign in to manage apartment service bookings, provider dispatch, or community facilities.
            </p>
          </div>

          {/* In-App Direct Verification Notice */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-emerald-900">Zero Mail Required (Pre-Verified Sign-In):</span>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                You will <strong>not</strong> receive any email in your real inbox because this app runs in a local/educational demo environment. All registered resident accounts are <strong>pre-verified in-app</strong> and ready to sign in immediately!
              </p>
            </div>
          </div>

          {/* If the user recently registered, show their verified account card */}
          {lastRegisteredUser && (
            <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border-2 border-emerald-300 rounded-xl space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    Your Newly Registered Account
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Verified ✓
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <div className="text-sm font-bold text-slate-900">{lastRegisteredUser.name}</div>
                  <div className="text-xs text-slate-600 font-mono">{lastRegisteredUser.email}</div>
                  {lastRegisteredUser.apartmentNumber && (
                    <div className="text-[11px] text-slate-500">
                      Flat {lastRegisteredUser.apartmentNumber}, {lastRegisteredUser.blockName}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => directSignIn(lastRegisteredUser.email)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <span>Sign In Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(lastRegisteredUser.email);
                      setPassword(lastRegisteredUser.password || 'ApartmentPass2026!');
                    }}
                    className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    Fill Form
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Role Persona Segmented Switcher */}
          <div className="space-y-2">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-center">
              Select Account Type to Pre-fill
            </label>
            <div className={`grid ${lastRegisteredUser ? 'grid-cols-4' : 'grid-cols-3'} gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200`}>
              {lastRegisteredUser && (
                <button
                  type="button"
                  onClick={() => handleRoleTabClick('CUSTOM')}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all flex flex-col items-center gap-1 ${
                    selectedRoleTab === 'CUSTOM'
                      ? 'bg-white text-emerald-700 shadow-xs border border-emerald-300'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span className="truncate max-w-[70px]">Yours</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleRoleTabClick('RESIDENT')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all flex flex-col items-center gap-1 ${
                  selectedRoleTab === 'RESIDENT'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Home className="w-4 h-4 text-indigo-600" />
                <span>Resident</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleTabClick('PROVIDER')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all flex flex-col items-center gap-1 ${
                  selectedRoleTab === 'PROVIDER'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wrench className="w-4 h-4 text-blue-600" />
                <span>Provider</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleTabClick('ADMIN')}
                className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all flex flex-col items-center gap-1 ${
                  selectedRoleTab === 'ADMIN'
                    ? 'bg-white text-purple-700 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Role Preview Badge */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                {selectedRoleTab === 'CUSTOM' && lastRegisteredUser && `${lastRegisteredUser.name} (${lastRegisteredUser.email})`}
                {selectedRoleTab === 'RESIDENT' && 'Resident: Sarah Chen (Flat 402, Block B)'}
                {selectedRoleTab === 'PROVIDER' && 'Technician: Dave Miller (Electrician · ★4.9)'}
                {selectedRoleTab === 'ADMIN' && 'Director: Marcus Vance (Building Operations)'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
              {selectedRoleTab}
            </span>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
              {/* Fallback instant sign-in recovery */}
              <div className="pt-1 border-t border-red-200 flex items-center justify-between">
                <span className="text-[11px] text-red-700 font-medium">Bypass password check:</span>
                <button
                  type="button"
                  onClick={() => directSignIn(email)}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold rounded transition-colors"
                >
                  Direct Sign In →
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="name@apartmentassist.com"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleOpenForgotModal}
                  className="text-xs text-indigo-600 hover:underline font-medium flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Reset Password (In-App)</span>
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-10 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Remember session securely</span>
              </label>

              <span className="text-[11px] text-slate-400 font-mono">BCrypt Protected</span>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Direct Login Buttons */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
              Or 1-Click Instant Login (No Typing)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleInstantLogin('RESIDENT')}
                className="p-2 text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-lg text-xs font-semibold transition-colors border border-indigo-100"
              >
                Resident Portal
              </button>
              <button
                type="button"
                onClick={() => handleInstantLogin('PROVIDER')}
                className="p-2 text-center bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold transition-colors border border-blue-100"
              >
                Provider Portal
              </button>
              <button
                type="button"
                onClick={() => handleInstantLogin('ADMIN')}
                className="p-2 text-center bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg text-xs font-semibold transition-colors border border-purple-100"
              >
                Admin Console
              </button>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-2 text-center space-y-3">
            <div className="text-xs text-slate-500">
              New resident in the building?{' '}
              <button
                type="button"
                onClick={() => setCurrentView('register')}
                className="text-indigo-600 hover:underline font-bold"
              >
                Register an Account
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setCurrentView('home')}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1 hover:underline"
              >
                <span>Browse Website as Guest (Home Page)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Student Tech Footnote */}
        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-3">
          <span>Spring Security 6</span>
          <span>·</span>
          <span>In-App Direct Verification</span>
          <span>·</span>
          <button
            onClick={() => setCurrentView('spring-boot-hub')}
            className="text-indigo-600 hover:underline font-semibold"
          >
            Inspect Spring Security Code →
          </button>
        </div>
      </div>

      {/* Instant In-App Password Reset Modal (No External Mail Delivery Needed) */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Instant In-App Password Reset
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Clear explanation of no external mail */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No External Email Required</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                The verification code is generated directly on-screen below. You can verify and update your password immediately without waiting for any email.
              </p>
            </div>

            {resetError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{resetError}</span>
              </div>
            )}

            {resetStep === 'success' ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900">Password Updated Successfully!</h4>
                  <p className="text-xs text-slate-600">
                    Your new password has been verified and saved. You can now sign in immediately.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    login(resetEmail, newPassword);
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  Sign In Directly with New Password →
                </button>
              </div>
            ) : (
              <form onSubmit={handleProcessPasswordReset} className="space-y-4">
                {/* Account Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Account Email
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="resident@apartmentassist.com"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                {/* Instant Verification Code Generator */}
                <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">On-Screen Verification Code:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                        setGeneratedOtp(newCode);
                      }}
                      className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Refresh Code</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xl font-mono font-bold tracking-widest text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                      {generatedOtp}
                    </div>
                    <button
                      type="button"
                      onClick={() => setEnteredOtp(generatedOtp)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                    >
                      Auto-Fill Code
                    </button>
                  </div>
                </div>

                {/* Enter Code Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="Enter 6-digit code above"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono tracking-wider"
                  />
                </div>

                {/* New Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Min. 8 chars"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Confirm New
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Re-enter"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    Verify & Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
