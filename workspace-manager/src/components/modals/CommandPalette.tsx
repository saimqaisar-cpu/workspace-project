'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchQuery, setSelectedTaskId, selectFilteredTasks } from '@/store/slices/taskSlice';
import { setActiveWorkspace, setActiveProject } from '@/store/slices/workspaceSlice';
import { Search, Command, X, CheckCircle, Folder, Layers } from 'lucide-react';

export default function CommandPalette() {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const tasks = useAppSelector(selectFilteredTasks);
  const { workspaces, projects } = useAppSelector((state) => state.workspaces);

  // Robust Global Keydown Listener with Event Capture
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      // Intercept Ctrl+K OR Ctrl+Shift+K OR Ctrl+J
      if ((isCmdOrCtrl && key === 'k') || (isCmdOrCtrl && e.shiftKey && key === 'k') || (isCmdOrCtrl && key === 'j')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setIsOpen((prev) => !prev);
      }

      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    // 'true' uses Capture Phase to intercept before Chrome browser handles it
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  if (!isOpen) return null;

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );
  const filteredWorkspaces = workspaces.filter((w) =>
    w.name.toLowerCase().includes(query.toLowerCase())
  );
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-[12px] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3 border-b border-[#E5E7EB] bg-[#F7F8FA]">
          <Search className="w-4 h-4 text-[#107C10] mr-2 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search tasks, projects, workspaces..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              dispatch(setSearchQuery(e.target.value));
            }}
            className="w-full bg-transparent text-xs text-[#111827] font-medium placeholder:text-[#98A2B3] focus:outline-none"
          />
          <kbd className="text-[10px] font-semibold text-[#667085] bg-white border border-[#E5E7EB] px-1.5 py-0.5 rounded shadow-2xs shrink-0">
            ESC
          </kbd>
          <button
            onClick={() => setIsOpen(false)}
            className="ml-2 text-[#98A2B3] hover:text-[#111827] p-1 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Stream */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          
          {/* Tasks Section */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase text-[#98A2B3] px-2 py-1">
                Tasks
              </div>
              {filteredTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    dispatch(setSelectedTaskId(task.id));
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between p-2 rounded-[6px] hover:bg-[#EAF4EA] text-xs font-medium text-[#111827] cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle className="w-3.5 h-3.5 text-[#107C10]" />
                    <span className="truncate">{task.title}</span>
                  </div>
                  <span className="text-[10px] text-[#667085] bg-white px-1.5 py-0.5 rounded border border-[#E5E7EB]">
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Workspaces Section */}
          {filteredWorkspaces.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase text-[#98A2B3] px-2 py-1">
                Workspaces
              </div>
              {filteredWorkspaces.map((ws) => (
                <div
                  key={ws.id}
                  onClick={() => {
                    dispatch(setActiveWorkspace(ws.id));
                    dispatch(setActiveProject(null));
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-[6px] hover:bg-[#F7F8FA] text-xs font-medium text-[#111827] cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-[#107C10]" />
                  <span>{ws.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Projects Section */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase text-[#98A2B3] px-2 py-1">
                Projects
              </div>
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    dispatch(setActiveWorkspace(proj.workspaceId));
                    dispatch(setActiveProject(proj.id));
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 p-2 rounded-[6px] hover:bg-[#F7F8FA] text-xs font-medium text-[#111827] cursor-pointer"
                >
                  <Folder className="w-3.5 h-3.5 text-[#107C10]" />
                  <span>{proj.name}</span>
                </div>
              ))}
            </div>
          )}

          {filteredTasks.length === 0 && filteredWorkspaces.length === 0 && filteredProjects.length === 0 && (
            <div className="p-6 text-center text-xs text-[#98A2B3]">
              No matching tasks or workspaces found.
            </div>
          )}

        </div>

        {/* Footer Shortcut Info */}
        <div className="px-4 py-2 border-t border-[#E5E7EB] bg-[#F7F8FA] flex items-center justify-between text-[11px] text-[#667085]">
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3 text-[#107C10]" />
            Quick Navigation Palette Active
          </span>
          <span>Press <kbd className="bg-white border border-[#E5E7EB] px-1 rounded text-[10px]">ESC</kbd> to close</span>
        </div>

      </div>
    </div>
  );
}