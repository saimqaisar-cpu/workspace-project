'use client';

import React from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  updateTaskStatus,
  deleteTask,
  setSelectedTaskId,
  selectFilteredTasks,
} from '@/store/slices/taskSlice';
import { Status } from '@/types';
import { Trash2, Shield, CheckSquare, Users, BarChart2 } from 'lucide-react';

const columns: { id: Status; title: string; headerColor: string; badgeBg: string }[] = [
  { id: 'To Do', title: 'TO DO', headerColor: 'text-[#667085]', badgeBg: 'bg-[#F7F8FA] text-[#667085] border-[#E5E7EB]' },
  { id: 'In Progress', title: 'IN PROGRESS', headerColor: 'text-[#107C10]', badgeBg: 'bg-[#EAF4EA] text-[#107C10] border-[#107C10]/20' },
  { id: 'Review', title: 'IN REVIEW', headerColor: 'text-[#D97706]', badgeBg: 'bg-[#FEF0C7] text-[#D97706] border-[#FEF0C7]' },
  { id: 'Done', title: 'COMPLETED', headerColor: 'text-[#107C10]', badgeBg: 'bg-[#EAF4EA] text-[#107C10] border-[#107C10]/20' },
];

export default function KanbanView() {
  const dispatch = useAppDispatch();
  const filteredTasks = useAppSelector(selectFilteredTasks);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      dispatch(updateTaskStatus({ taskId, status }));
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 min-w-[700px] lg:min-w-0">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="flex flex-col rounded-[10px] bg-[#F7F8FA] border border-[#E5E7EB] p-2.5 min-h-[550px] w-full min-w-0"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#E5E7EB] shrink-0">
                <span className={`text-[10px] font-bold tracking-wider truncate ${col.headerColor}`}>
                  {col.title}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-[6px] border shrink-0 ${col.badgeBg}`}>
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards Container */}
              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {colTasks.length > 0 ? (
                  colTasks.map((task) => {
                    const totalSubtasks = task.subtasks?.length || 0;
                    const completedSubtasks =
                      task.subtasks?.filter((s) => s.completed).length || 0;
                    const progressPercent =
                      totalSubtasks > 0
                        ? Math.round((completedSubtasks / totalSubtasks) * 100)
                        : 0;

                    const assignedMembers = task.assignedMembers || ['admin@workspace.com'];

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
                        onClick={() => dispatch(setSelectedTaskId(task.id))}
                        className="p-3 bg-white border border-[#E5E7EB] hover:border-[#107C10] rounded-[10px] transition-all shadow-xs hover:shadow-sm group space-y-2 cursor-grab active:cursor-grabbing relative"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <h3 className="text-xs font-bold text-[#111827] group-hover:text-[#107C10] transition-colors leading-snug break-words">
                            {task.title}
                          </h3>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(deleteTask(task.id));
                            }}
                            className="p-1 text-[#98A2B3] hover:text-[#D92D20] hover:bg-[#FFF1F3] rounded-[4px] transition-colors opacity-0 group-hover:opacity-100 shrink-0 cursor-pointer"
                            title="Delete Task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-[#667085] line-clamp-2 leading-normal break-words">
                            {task.description}
                          </p>
                        )}

                        {totalSubtasks > 0 && (
                          <div className="space-y-1 pt-0.5">
                            <div className="flex items-center justify-between text-[10px] text-[#667085] font-medium">
                              <span className="flex items-center gap-1">
                                <BarChart2 className="w-3 h-3 text-[#107C10]" />
                                Progress
                              </span>
                              <span className="font-bold text-[#107C10]">{progressPercent}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#107C10] transition-all"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-1 text-[10px] text-[#667085] pt-0.5">
                          <Users className="w-3 h-3 text-[#107C10] shrink-0" />
                          <div className="flex flex-wrap gap-1 overflow-hidden">
                            {assignedMembers.map((email) => (
                              <span
                                key={email}
                                className="bg-[#F7F8FA] border border-[#E5E7EB] px-1.5 py-0.5 rounded text-[10px] font-medium text-[#1F2937] truncate max-w-[90px]"
                                title={email}
                              >
                                {email.split('@')[0]}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1.5 border-t border-[#E5E7EB] gap-1">
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-[#107C10] bg-[#EAF4EA] px-1.5 py-0.5 rounded-[4px] border border-[#107C10]/20">
                              <Shield className="w-3 h-3" />
                              {task.accessRole || 'Admin'}
                            </span>

                            {totalSubtasks > 0 && (
                              <span className="flex items-center gap-1 text-[10px] font-medium text-[#667085]">
                                <CheckSquare className="w-3 h-3 text-[#107C10]" />
                                {completedSubtasks}/{totalSubtasks}
                              </span>
                            )}
                          </div>

                          <select
                            value={task.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              dispatch(
                                updateTaskStatus({
                                  taskId: task.id,
                                  status: e.target.value as Status,
                                })
                              )
                            }
                            className="bg-white text-[10px] text-[#1F2937] font-semibold rounded-[4px] px-1 py-0.5 border border-[#E5E7EB] focus:outline-none focus:border-[#107C10] cursor-pointer shrink-0"
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Review">Review</option>
                            <option value="Done">Done</option>
                          </select>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-[#98A2B3] text-xs font-medium">
                    No tasks in this column.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}