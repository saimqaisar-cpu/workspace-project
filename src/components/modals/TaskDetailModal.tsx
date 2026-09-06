'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setSelectedTaskId,
  addSubtaskToTask,
  toggleSubtask,
  removeSubtaskFromTask,
  updateTaskAccessRole,
  updateTaskStatus,
  addMemberToTask,
  removeMemberFromTask,
  deleteTask,
} from '@/store/slices/taskSlice';
import ConfirmModal from '@/components/ConfirmModal';
import { Status } from '@/types';
import {
  X,
  Plus,
  Trash2,
  CheckSquare,
  ShieldCheck,
  BarChart3,
  Clock,
  AlertCircle,
  Users,
  UserPlus,
  Check,
  Activity,
  AlertTriangle,
} from 'lucide-react';

export default function TaskDetailModal() {
  const dispatch = useAppDispatch();
  const selectedTaskId = useAppSelector((state) => state.tasks?.selectedTaskId);
  const task = useAppSelector((state) =>
    state.tasks?.items?.find((t) => t.id === selectedTaskId)
  );

  const [subtaskInput, setSubtaskInput] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  if (!selectedTaskId || !task) return null;

  const assignedMembers = task.assignedMembers || ['admin@workspace.com'];
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks =
    task.subtasks?.filter((s) => s.completed).length || 0;
  const progressPercent =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (subtaskInput.trim()) {
      dispatch(
        addSubtaskToTask({ taskId: task.id, title: subtaskInput.trim() })
      );
      setSubtaskInput('');
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (memberEmail.trim()) {
      dispatch(
        addMemberToTask({ taskId: task.id, email: memberEmail.trim() })
      );
      setMemberEmail('');
    }
  };

  const handleRemoveMember = (email: string) => {
    setMemberToRemove(email);
  };

  const handleDeleteTask = () => {
    setTaskToDelete(task.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-[12px] w-full max-w-2xl shadow-md overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F7F8FA] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#107C10] bg-[#EAF4EA] px-2 py-0.5 rounded-[6px] border border-[#107C10]/20">
                Full Progress & Access Control
              </span>
              <span className="text-[11px] font-semibold text-[#667085] bg-white px-2 py-0.5 rounded-[6px] border border-[#E5E7EB]">
                ID: {task.id.slice(-6)}
              </span>
            </div>
            <h2 className="text-base font-semibold text-[#111827] mt-1.5">
              {task.title}
            </h2>
          </div>
          <button
            onClick={() => dispatch(setSelectedTaskId(null))}
            className="p-1.5 text-[#98A2B3] hover:text-[#111827] rounded-[6px] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Progress Indicator */}
          <div className="p-4 bg-[#F7F8FA] rounded-[10px] border border-[#E5E7EB] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#111827]">
                <BarChart3 className="w-4 h-4 text-[#107C10]" />
                Task Completion Status
              </span>
              <span className="text-[#107C10] font-bold">
                {progressPercent}% Completed ({completedSubtasks}/{totalSubtasks} Checklist Items)
              </span>
            </div>
            
            <div className="w-full h-2.5 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#107C10] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Task Status Controls */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-[#F7F8FA] rounded-[8px] border border-[#E5E7EB] space-y-1">
              <label className="text-[10px] font-semibold uppercase text-[#98A2B3] flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#D97706]" />
                Current Status
              </label>
              <select
                value={task.status}
                onChange={(e) =>
                  dispatch(
                    updateTaskStatus({
                      taskId: task.id,
                      status: e.target.value as Status,
                    })
                  )
                }
                className="w-full bg-white text-xs font-semibold text-[#111827] border border-[#E5E7EB] rounded-[6px] py-1 px-1.5 focus:outline-none focus:border-[#107C10]"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">In Review</option>
                <option value="Done">Completed</option>
              </select>
            </div>

            <div className="p-3 bg-[#F7F8FA] rounded-[8px] border border-[#E5E7EB] space-y-1">
              <label className="text-[10px] font-semibold uppercase text-[#98A2B3] flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-[#D92D20]" />
                Priority
              </label>
              <div className="pt-0.5">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-[4px] border ${
                    task.priority === 'High'
                      ? 'bg-[#FFF1F3] text-[#D92D20] border-rose-200'
                      : task.priority === 'Medium'
                      ? 'bg-[#FEF0C7] text-[#D97706] border-amber-200'
                      : 'bg-white text-[#667085] border-[#E5E7EB]'
                  }`}
                >
                  {task.priority || 'Medium'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#F7F8FA] rounded-[8px] border border-[#E5E7EB] space-y-1">
              <label className="text-[10px] font-semibold uppercase text-[#98A2B3] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#107C10]" />
                Access Level
              </label>
              <select
                value={task.accessRole || 'Developer'}
                onChange={(e) =>
                  dispatch(
                    updateTaskAccessRole({
                      taskId: task.id,
                      accessRole: e.target.value,
                    })
                  )
                }
                className="w-full bg-white text-xs font-semibold text-[#111827] border border-[#E5E7EB] rounded-[6px] py-1 px-1.5 focus:outline-none focus:border-[#107C10]"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Developer">Developer Team</option>
                <option value="Designer">Design Team</option>
              </select>
            </div>
          </div>

          {/* Member Access Management */}
          <div className="space-y-2.5 p-4 bg-[#F7F8FA] rounded-[10px] border border-[#E5E7EB]">
            <label className="text-xs font-semibold text-[#111827] uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#107C10]" />
                Assign Persons & Grant Access
              </span>
              <span className="text-[11px] text-[#667085] font-normal">
                {assignedMembers.length} Members Granted
              </span>
            </label>

            <form onSubmit={handleAddMember} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter member email (e.g. john@team.com)..."
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                className="flex-1 bg-white border border-[#E5E7EB] rounded-[8px] px-3 py-1.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#107C10]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#107C10] hover:bg-[#0B6A0B] text-white font-medium text-xs rounded-[8px] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Grant Access</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-2 pt-1">
              {assignedMembers.map((email) => (
                <div
                  key={email}
                  className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-[6px] border border-[#E5E7EB] text-xs font-medium text-[#111827]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#107C10]" />
                  <span>{email}</span>
                  {email !== 'admin@workspace.com' && (
                    <button
                      onClick={() => handleRemoveMember(email)}
                      className="text-[#98A2B3] hover:text-[#D92D20] ml-1 cursor-pointer"
                      title="Remove Person"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Checklist & Subtasks */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#111827] uppercase tracking-wider flex items-center justify-between">
              <span>Subtasks & Action Checklist</span>
              <span className="text-[11px] text-[#667085] font-normal">
                Click item to mark Done / Pending
              </span>
            </label>

            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <input
                type="text"
                placeholder="Add subtask (e.g. Test API, Fix Error) and hit Enter..."
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                className="flex-1 bg-white border border-[#E5E7EB] rounded-[8px] px-3 py-1.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#107C10]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#107C10] hover:bg-[#0B6A0B] text-white font-medium text-xs rounded-[8px] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pt-1">
              {task.subtasks && task.subtasks.length > 0 ? (
                task.subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-2.5 bg-[#F7F8FA] rounded-[6px] border border-[#E5E7EB] text-xs text-[#1F2937]"
                  >
                    <div
                      onClick={() =>
                        dispatch(
                          toggleSubtask({ taskId: task.id, subtaskId: st.id })
                        )
                      }
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      <CheckSquare
                        className={`w-4 h-4 ${
                          st.completed ? 'text-[#107C10]' : 'text-[#98A2B3]'
                        }`}
                      />
                      <span className={st.completed ? 'line-through text-[#98A2B3]' : 'font-medium'}>
                        {st.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-[4px] border ${
                          st.completed
                            ? 'bg-[#EAF4EA] text-[#107C10] border-[#107C10]/20'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {st.completed ? 'DONE' : 'IN PROGRESS'}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(
                            removeSubtaskFromTask({
                              taskId: task.id,
                              subtaskId: st.id,
                            })
                          )
                        }
                        className="text-[#98A2B3] hover:text-[#D92D20] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 text-xs text-[#98A2B3] p-3 bg-[#F7F8FA] rounded-[6px] border border-dashed border-[#E5E7EB]">
                  <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                  <span>No subtasks added yet. Add subtasks above to track step-by-step progress.</span>
                </div>
              )}
            </div>
          </div>

          {/* Activity Log Feed */}
          <div className="pt-3 border-t border-[#E5E7EB] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#111827]">
              <Activity className="w-3.5 h-3.5 text-[#107C10]" />
              <span>Real-Time Activity Log</span>
            </div>
            <div className="text-[11px] text-[#667085] space-y-1 bg-[#F7F8FA] p-2.5 rounded-[6px] border border-[#E5E7EB]">
              <div>• Task current state: <strong className="text-[#111827]">{task.status}</strong></div>
              <div>• Assigned members count: <strong className="text-[#111827]">{assignedMembers.length}</strong></div>
              <div>• Subtasks completed: <strong className="text-[#107C10]">{completedSubtasks} / {totalSubtasks}</strong></div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E5E7EB] bg-[#F7F8FA] flex items-center justify-between shrink-0">
          <button
            onClick={handleDeleteTask}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#D92D20] hover:bg-[#FFF1F3] px-2.5 py-1.5 rounded-[6px] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Task</span>
          </button>

          <button
            onClick={() => dispatch(setSelectedTaskId(null))}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#107C10] hover:bg-[#0B6A0B] rounded-[8px] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save & Close</span>
          </button>
        </div>

      </div>

      <ConfirmModal
        isOpen={Boolean(memberToRemove)}
        title="Remove Access"
        message={`Are you sure you want to remove access for "${memberToRemove}"?`}
        confirmText="Remove Access"
        onConfirm={() => {
          if (memberToRemove) {
            dispatch(removeMemberFromTask({ taskId: task.id, email: memberToRemove }));
            setMemberToRemove(null);
          }
        }}
        onCancel={() => setMemberToRemove(null)}
      />

      <ConfirmModal
        isOpen={Boolean(taskToDelete)}
        title="Delete Task"
        message={`Are you sure you want to delete task "${task.title}"?`}
        confirmText="Delete Task"
        onConfirm={() => {
          if (taskToDelete) {
            dispatch(deleteTask(taskToDelete));
            dispatch(setSelectedTaskId(null));
            setTaskToDelete(null);
          }
        }}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
}