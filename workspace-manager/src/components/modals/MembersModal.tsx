"use client";

import React, { useState } from "react";
import { X, Trash2, CheckSquare, Clock, CheckCircle2 } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";

interface TaskMember {
  id: string;
  memberEmail: string;
  taskTitle: string;
  status: "To Do" | "In Progress" | "Completed";
}

interface TeamTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  membersWithTasks: TaskMember[];
  onDeleteTask?: (id: string) => void;
}

export default function MembersModal({
  isOpen,
  onClose,
  membersWithTasks = [],
  onDeleteTask,
}: TeamTasksModalProps) {
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  if (!isOpen) return null;

  const handleDeleteTrigger = (id: string) => {
    setSelectedDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (selectedDeleteId) {
      onDeleteTask?.(selectedDeleteId);
      setSelectedDeleteId(null);
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <>
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-800 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">Task successfully deleted!</span>
        </div>
      )}

      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors">
          
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Project Team Members & Tasks
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Total Assigned Members:{" "}
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  {membersWithTasks.length}
                </span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="border border-gray-200/80 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/30 dark:bg-gray-900/50">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200/80 dark:border-gray-800 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 bg-gray-50/80 dark:bg-gray-800/60">
                    <th className="py-3.5 px-6">Member Email</th>
                    <th className="py-3.5 px-6">Task Name</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/60 dark:divide-gray-800 bg-white dark:bg-gray-900">
                  {membersWithTasks.length > 0 ? (
                    membersWithTasks.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors"
                      >
                        <td className="py-4 px-6 text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {item.memberEmail}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span>{item.taskTitle || "No Task Title"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60">
                            <Clock className="w-3.5 h-3.5" />
                            {item.status || "To Do"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-right">
                          <button
                            onClick={() => handleDeleteTrigger(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                            title="Delete Task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        No tasks or members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end px-6 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white font-medium text-sm rounded-xl shadow-sm transition-colors"
            >
              Close List
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(selectedDeleteId)}
        title="Delete Confirmation"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete Task"
        onConfirm={handleConfirmDelete}
        onCancel={() => setSelectedDeleteId(null)}
      />
    </>
  );
}