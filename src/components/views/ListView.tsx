'use client';

import React from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateTaskStatus, deleteTask, selectFilteredTasks } from '@/store/slices/taskSlice';
import { Status } from '@/types';
import { CheckSquare, Trash2 } from 'lucide-react';

export default function ListView() {
  const dispatch = useAppDispatch();
  const filteredTasks = useAppSelector(selectFilteredTasks);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Task Name</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Members</th>
              <th className="py-3.5 px-4">Subtasks</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900">
                    <div>{task.title}</div>
                    <div className="text-xs font-normal text-slate-500 line-clamp-1 mt-0.5">
                      {task.description}
                    </div>
                  </td>
                  <td className="py-4 px-4">
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
                      className="bg-gray-100 text-xs font-bold text-slate-800 rounded-lg px-2.5 py-1 border border-gray-300 focus:outline-none focus:border-[#2A7C13]"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">In Review</option>
                      <option value="Done">Completed</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        task.priority === 'High'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : task.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {(task.assignedMembers ?? ['admin@workspace.com']).map((member) => (
                        <span
                          key={member}
                          className="text-[10px] font-bold text-[#2A7C13] bg-[#2A7C13]/10 px-2 py-0.5 rounded-md border border-[#2A7C13]/20"
                        >
                          {member.split('@')[0]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-[#2A7C13]" />
                      <span>
                        {task.subtasks?.filter((s) => s.completed).length || 0} /{' '}
                        {task.subtasks?.length || 0}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => dispatch(deleteTask(task.id))}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                  No tasks found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}