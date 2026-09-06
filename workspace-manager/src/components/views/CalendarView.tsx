'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSelectedTaskId, selectFilteredTasks } from '@/store/slices/taskSlice';
import { Calendar as CalendarIcon, CheckSquare } from 'lucide-react';

export default function CalendarView() {
  const dispatch = useAppDispatch();
  const filteredTasks = useAppSelector(selectFilteredTasks);

  // Group tasks by due date
  const tasksByDate = filteredTasks.reduce<Record<string, typeof filteredTasks>>((acc, task) => {
    const dateKey = task.dueDate || 'Unscheduled';
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(task);
    return acc;
  }, {});

  const dateKeys = Object.keys(tasksByDate).sort();

  return (
    <div className="space-y-4">
      {dateKeys.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-400">
          No scheduled tasks found for this project.
        </div>
      ) : (
        dateKeys.map((date) => (
          <div key={date} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
              <CalendarIcon className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                {date === 'Unscheduled' ? 'No Due Date' : date}
              </h3>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                {tasksByDate[date].length} tasks
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tasksByDate[date].map((task) => (
                <div
                  key={task.id}
                  onClick={() => dispatch(setSelectedTaskId(task.id))}
                  className="p-3 border border-gray-200 rounded-md hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer bg-gray-50/50"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        task.priority === 'Urgent'
                          ? 'bg-red-100 text-red-700'
                          : task.priority === 'High'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-[10px] capitalize text-gray-500 font-medium">
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">
                    {task.title}
                  </h4>

                  {(task.subtasks?.length ?? 0) > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-2">
                      <CheckSquare className="w-3 h-3" />
                      <span>
                        {(task.subtasks?.filter((s) => s.completed).length ?? 0)}/{task.subtasks?.length ?? 0}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}