'use client';

import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  addWorkspace,
  setActiveWorkspace,
  addProject,
  setActiveProject,
  deleteWorkspace,
  deleteProject,
} from '@/store/slices/workspaceSlice';
import ConfirmModal from '@/components/ConfirmModal';
import { Folder, Plus, LayoutGrid, Home, Trash2 } from 'lucide-react';

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const { workspaces, projects, activeWorkspaceId, activeProjectId } = useAppSelector(
    (state) => state.workspaces
  );

  const [wsInput, setWsInput] = useState('');
  const [projInput, setProjInput] = useState('');
  const [showWsForm, setShowWsForm] = useState(false);
  const [showProjForm, setShowProjForm] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<{ id: string; name: string } | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);

  // Filter projects ONLY for the currently selected active workspace
  const activeWsProjects = activeWorkspaceId
    ? projects.filter((p) => p.workspaceId === activeWorkspaceId)
    : [];

  const currentWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (wsInput.trim()) {
      dispatch(addWorkspace({ name: wsInput.trim() }));
      setWsInput('');
      setShowWsForm(false);
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (projInput.trim() && activeWorkspaceId) {
      dispatch(addProject({ name: projInput.trim() }));
      setProjInput('');
      setShowProjForm(false);
    }
  };

  const handleDeleteWorkspace = (wsId: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWorkspaceToDelete({ id: wsId, name });
  };

  const handleDeleteProject = (projId: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToDelete({ id: projId, name });
  };

  return (
    <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col justify-between p-4 text-[#1F2937] h-full hidden md:flex shrink-0">
      <div className="space-y-5">
        
        {/* ALL WORKSPACES MAIN BUTTON (NO ALL PROJECTS BELOW) */}
        <button
          onClick={() => {
            dispatch(setActiveWorkspace(null));
            dispatch(setActiveProject(null));
          }}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-xs font-bold border transition-all cursor-pointer ${
            !activeWorkspaceId
              ? 'bg-[#EAF4EA] text-[#107C10] border-[#107C10]/30 shadow-xs'
              : 'bg-[#F7F8FA] hover:bg-[#EAF4EA]/50 text-[#111827] border-[#E5E7EB]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-[#107C10]" />
            <span>All Workspaces</span>
          </div>
          <span className="bg-white border border-[#E5E7EB] text-[10px] font-bold px-1.5 py-0.5 rounded text-[#667085]">
            {workspaces.length}
          </span>
        </button>

        {/* WORKSPACES LIST SECTION */}
        <div className="space-y-2 pt-2 border-t border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3]">
              Workspaces List
            </h3>
            <button
              onClick={() => setShowWsForm(!showWsForm)}
              className="p-1 hover:bg-[#EAF4EA] text-[#107C10] rounded-[4px] cursor-pointer"
              title="Add Workspace"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showWsForm && (
            <form onSubmit={handleCreateWorkspace} className="flex gap-1 mb-2">
              <input
                type="text"
                placeholder="Workspace name..."
                value={wsInput}
                onChange={(e) => setWsInput(e.target.value)}
                className="w-full text-xs p-1.5 border border-[#E5E7EB] rounded-[6px] focus:outline-none focus:border-[#107C10]"
              />
            </form>
          )}

          <div className="space-y-1 max-h-48 overflow-y-auto">
            {workspaces.length > 0 ? (
              workspaces.map((ws) => (
                <div
                  key={ws.id}
                  className={`group flex items-center justify-between px-2.5 py-2 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${
                    activeWorkspaceId === ws.id
                      ? 'bg-[#EAF4EA] text-[#107C10]'
                      : 'text-[#667085] hover:bg-[#F7F8FA] hover:text-[#111827]'
                  }`}
                  onClick={() => {
                    dispatch(setActiveWorkspace(ws.id));
                    dispatch(setActiveProject(null));
                  }}
                >
                  <div className="flex items-center gap-2 truncate">
                    <LayoutGrid className="w-4 h-4 shrink-0" />
                    <span className="truncate">{ws.name}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteWorkspace(ws.id, ws.name, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#98A2B3] hover:text-[#D92D20] transition-opacity cursor-pointer"
                    title="Delete Workspace"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-[11px] text-[#98A2B3] italic p-2 bg-[#F7F8FA] rounded-[6px] border border-dashed border-[#E5E7EB]">
                No workspace. Click + above.
              </div>
            )}
          </div>
        </div>

        {/* PROJECTS SECTION - VISIBLE ONLY WHEN A WORKSPACE IS OPENED */}
        {activeWorkspaceId && (
          <div className="space-y-2 pt-2 border-t border-[#E5E7EB] animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#98A2B3] truncate">
                {currentWorkspace?.name} Projects
              </h3>
              <button
                onClick={() => setShowProjForm(!showProjForm)}
                className="flex items-center gap-1 text-[11px] font-bold text-[#107C10] hover:bg-[#EAF4EA] px-2 py-0.5 rounded-[6px] cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Project</span>
              </button>
            </div>

            {/* Create Project Input */}
            {showProjForm && (
              <form onSubmit={handleCreateProject} className="flex gap-1 mb-2">
                <input
                  type="text"
                  placeholder="New project name..."
                  value={projInput}
                  onChange={(e) => setProjInput(e.target.value)}
                  className="w-full text-xs p-1.5 border border-[#E5E7EB] rounded-[6px] focus:outline-none focus:border-[#107C10]"
                />
              </form>
            )}

            {/* Only Currently Active Workspace's Projects Are Displayed Here */}
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {activeWsProjects.length > 0 ? (
                activeWsProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => dispatch(setActiveProject(proj.id))}
                    className={`group flex items-center justify-between px-2.5 py-2 rounded-[8px] text-xs font-semibold transition-colors cursor-pointer ${
                      activeProjectId === proj.id
                        ? 'bg-[#107C10] text-white shadow-xs'
                        : 'text-[#667085] hover:bg-[#F7F8FA] hover:text-[#111827]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Folder className="w-4 h-4 shrink-0" />
                      <span className="truncate">{proj.name}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteProject(proj.id, proj.name, e)}
                      className={`opacity-0 group-hover:opacity-100 p-1 transition-opacity cursor-pointer ${
                        activeProjectId === proj.id ? 'text-white/80 hover:text-white' : 'text-[#98A2B3] hover:text-[#D92D20]'
                      }`}
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-[11px] text-[#98A2B3] italic p-2 bg-[#F7F8FA] rounded-[6px] border border-dashed border-[#E5E7EB]">
                  No projects yet. Click + Project above.
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      <ConfirmModal
        isOpen={Boolean(workspaceToDelete)}
        title="Delete Workspace"
        message={`Are you sure you want to delete workspace "${workspaceToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Workspace"
        onConfirm={() => {
          if (workspaceToDelete) {
            dispatch(deleteWorkspace(workspaceToDelete.id));
            setWorkspaceToDelete(null);
          }
        }}
        onCancel={() => setWorkspaceToDelete(null)}
      />

      <ConfirmModal
        isOpen={Boolean(projectToDelete)}
        title="Delete Project"
        message={`Are you sure you want to delete project "${projectToDelete?.name}"? All associated tasks will be removed.`}
        confirmText="Delete Project"
        onConfirm={() => {
          if (projectToDelete) {
            dispatch(deleteProject(projectToDelete.id));
            setProjectToDelete(null);
          }
        }}
        onCancel={() => setProjectToDelete(null)}
      />
    </aside>
  );
}