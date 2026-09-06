'use client';

import React, { useState } from 'react';
import { SignInButton, UserButton, Show } from '@clerk/nextjs';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setActiveView, openTaskModal } from '@/store/slices/uiSlice';
import { setSearchQuery, undo, redo } from '@/store/slices/taskSlice';
import { LayoutGrid, List, Calendar, Search, Plus, Undo2, Redo2, Menu, X } from 'lucide-react';
import { ViewMode } from '@/types';
import CustomSignUpModal from '@/components/modals/CustomSignUpModal';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const activeView = useAppSelector((state) => state.ui.activeView);
  const searchQuery = useAppSelector((state) => state.tasks?.searchQuery || '');
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const views: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'kanban', label: 'Kanban Board', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'list', label: 'List View', icon: <List className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar View', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <>
      <header className="h-16 border-b border-[#E5E7EB] bg-white px-4 md:px-6 flex items-center justify-between shadow-xs text-[#1F2937] gap-4 sticky top-0 z-40">
        
        {/* Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-[8px] bg-[#107C10] flex items-center justify-center text-white font-bold text-base shadow-xs">
              W
            </div>
            <span className="font-semibold text-lg text-[#111827] tracking-tight">
              Workspace Pro
            </span>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-[#667085] hover:bg-[#F7F8FA] rounded-[8px] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Global Search & History Undo/Redo Controls */}
        <div className={`${mobileMenuOpen ? 'flex absolute top-16 left-0 right-0 bg-white p-4 border-b border-[#E5E7EB] shadow-md flex-col' : 'hidden'} md:flex items-center gap-3 flex-1 max-w-xl mx-4`}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#98A2B3]" />
            <input
              type="text"
              placeholder="Search tasks, tags..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full bg-[#F7F8FA] text-[#1F2937] text-sm rounded-[8px] pl-9 pr-20 py-1.5 border border-[#E5E7EB] focus:outline-none focus:border-[#107C10] focus:ring-1 focus:ring-[#107C10] transition-colors placeholder:text-[#98A2B3]"
            />
            <span className="absolute right-2.5 top-2 text-[10px] font-semibold text-[#667085] bg-white px-1.5 py-0.5 rounded border border-[#E5E7EB] hidden sm:inline-block">
              Ctrl + K
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => dispatch(undo())}
              title="Undo Action"
              className="p-2 bg-white hover:bg-[#F7F8FA] border border-[#E5E7EB] text-[#667085] hover:text-[#111827] rounded-[8px] transition-colors cursor-pointer"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => dispatch(redo())}
              title="Redo Action"
              className="p-2 bg-white hover:bg-[#F7F8FA] border border-[#E5E7EB] text-[#667085] hover:text-[#111827] rounded-[8px] transition-colors cursor-pointer"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Switchers, New Task & Authentication Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(openTaskModal())}
            className="flex items-center gap-1.5 bg-[#107C10] hover:bg-[#0B6A0B] text-white px-3.5 py-2 rounded-[8px] font-medium text-sm shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>

          <div className="hidden lg:flex items-center gap-1 bg-[#F7F8FA] p-1 rounded-[8px] border border-[#E5E7EB]">
            {views.map((v) => (
              <button
                key={v.id}
                onClick={() => dispatch(setActiveView(v.id))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors cursor-pointer ${
                  activeView === v.id
                    ? 'bg-[#EAF4EA] text-[#107C10] font-semibold'
                    : 'text-[#667085] hover:text-[#111827] hover:bg-white'
                }`}
              >
                {v.icon}
                <span>{v.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-[#E5E7EB]">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-xs font-medium text-[#667085] hover:text-[#111827] px-2.5 py-1.5 transition-colors cursor-pointer">
                  Sign In
                </button>
              </SignInButton>

              <button
                onClick={() => setIsSignUpOpen(true)}
                className="text-xs font-semibold bg-[#107C10] hover:bg-[#0B6A0B] text-white px-3 py-1.5 rounded-[8px] transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </Show>

            <Show when="signed-in">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8 rounded-full border border-[#E5E7EB]',
                  },
                }}
              />
            </Show>
          </div>
        </div>
      </header>

      {/* Custom Detailed Sign Up Modal */}
      <CustomSignUpModal 
        isOpen={isSignUpOpen} 
        onClose={() => setIsSignUpOpen(false)} 
      />
    </>
  );
}