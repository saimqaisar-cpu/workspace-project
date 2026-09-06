'use client';

import React, { useState } from 'react';
import { X, User, Mail, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface CustomSignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomSignUpModal({ isOpen, onClose }: CustomSignUpModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('New Password and Confirm Password do not match!');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    // Process Registration Data
    const userData = { firstName, lastName, email, role: 'Developer' };
    localStorage.setItem('LOGGED_IN_USER', JSON.stringify(userData));

    alert(`Account created successfully for ${firstName} ${lastName}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-[12px] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F7F8FA]">
          <div>
            <h2 className="text-base font-bold text-[#111827]">Create Your Account</h2>
            <p className="text-xs text-[#667085]">Fill in the details below to register.</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#98A2B3] hover:text-[#111827] rounded-[6px] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-[#FFF1F3] border-b border-rose-200 text-[#D92D20] text-xs font-semibold px-6 py-2.5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          {/* Name Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#111827] uppercase mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-[8px] px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#107C10]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#111827] uppercase mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-[8px] px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#107C10]"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-[11px] font-bold text-[#111827] uppercase mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#107C10]" /> Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-[8px] px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#107C10]"
            />
          </div>

          {/* New Password Input */}
          <div>
            <label className="block text-[11px] font-bold text-[#111827] uppercase mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#107C10]" /> New Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Create new password (min 8 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-[8px] px-3 py-2 pr-9 text-xs text-[#1F2937] focus:outline-none focus:border-[#107C10]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-[#98A2B3] hover:text-[#111827]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-[11px] font-bold text-[#111827] uppercase mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#107C10]" /> Confirm Password *
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-[8px] px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#107C10]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#107C10] hover:bg-[#0B6A0B] text-white text-xs font-bold rounded-[8px] cursor-pointer shadow-xs transition-colors"
            >
              Sign Up & Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}