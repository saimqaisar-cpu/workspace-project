'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeTaskModal } from '@/store/slices/uiSlice';
import { addTask } from '@/store/slices/taskSlice';
import { Priority } from '@/types';
import { X, UserPlus, Calendar } from 'lucide-react';

export default function TaskModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isTaskModalOpen);
  const { activeWorkspaceId, activeProjectId } = useAppSelector((state) => state.workspaces);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeEmail, setAssigneeEmail] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('High');
  const [accessRole, setAccessRole] = useState('Manager');

  if (!isOpen || !activeWorkspaceId || !activeProjectId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch(
      addTask({
        workspaceId: activeWorkspaceId,
        projectId: activeProjectId,
        title,
        description,
        status: 'To Do',
        dueDate,
        priority,
        accessRole,
        assignedMembers: assigneeEmail.trim() ? [assigneeEmail.trim()] : ['admin@workspace.com'],
        subtasks: [],
      })
    );

    setTitle('');
    setDescription('');
    setAssigneeEmail('');
    setDueDate('');
    setPriority('High');
    setAccessRole('Manager');
    dispatch(closeTaskModal());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-[12px] w-full max-w-md shadow-md overflow-hidden">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F7F8FA]">
          <h2 className="text-base font-semibold text-[#111827]">Create New Task</h2>
          <button
            onClick={() => dispatch(closeTaskModal())}
            className="p-1.5 text-[#98A2B3] hover:text-[#111827] rounded-[6px]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
              Task Name / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. neha"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-[8px] px-3 py-2 text-xs font-medium text-[#1F2937] focus:outline-none focus:border-[#107C10]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
              Task Details / Description
            </label>
            <textarea
              rows={2}
              placeholder="food management"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-[8px] px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#107C10]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1 flex items-center gap-1">
              <UserPlus className="w-3.5 h-3.5 text-[#107C10]" />
              Assign To (Employee Email)
            </label>
            <input
              type="email"
              placeholder="qrssaimqaisar@gmail.com"
              value={assigneeEmail}
              onChange={(e) => setAssigneeEmail(e.target.value)}
              className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-[8px] px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#107C10]"
            />
          </div>

          {/* Due Date Input Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
              Due / Expiry Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-[8px] px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#107C10]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-[#98A2B3] uppercase mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-[6px] px-2 py-1.5 text-xs font-semibold"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#98A2B3] uppercase mb-1">
                Role Access
              </label>
              <select
                value={accessRole}
                onChange={(e) => setAccessRole(e.target.value)}
                className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-[6px] px-2 py-1.5 text-xs font-semibold"
              >
                <option value="Manager">Manager</option>
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => dispatch(closeTaskModal())}
              className="px-3 py-1.5 text-xs font-semibold text-[#667085] hover:text-[#111827]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#107C10] hover:bg-[#0B6A0B] rounded-[8px]"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}