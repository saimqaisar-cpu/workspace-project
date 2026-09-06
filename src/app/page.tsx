'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import KanbanView from '@/components/views/KanbanView';
import ListView from '@/components/views/ListView';
import TaskModal from '@/components/modals/TaskModal';
import TaskDetailModal from '@/components/modals/TaskDetailModal';
import CommandPalette from '@/components/modals/CommandPalette';
import MembersModal from '@/components/modals/MembersModal';
import ConfirmModal from '@/components/ConfirmModal';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  addWorkspace,
  setActiveWorkspace,
  addProject,
  setActiveProject,
  deleteWorkspace,
  deleteProject,
} from '@/store/slices/workspaceSlice';
import { openTaskModal } from '@/store/slices/uiSlice';
import { clearToast, selectFilteredTasks } from '@/store/slices/taskSlice';
import { Layers, Folder, Plus, ArrowRight, UserPlus, Trash2, CheckCircle, X, Users } from 'lucide-react';

export default function Home() {
  const dispatch = useAppDispatch();
  const activeView = useAppSelector((state) => state.ui.activeView);
  const toast = useAppSelector((state) => state.tasks?.toast);
  const tasks = useAppSelector(selectFilteredTasks);
  const { workspaces, projects, activeWorkspaceId, activeProjectId } = useAppSelector(
    (state) => state.workspaces
  );

  const [wsInput, setWsInput] = useState('');
  const [projInput, setProjInput] = useState('');
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<{ id: string; name: string } | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);

  const currentWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const currentProject = projects.find((p) => p.id === activeProjectId);
  const activeWsProjects = projects.filter((p) => p.workspaceId === activeWorkspaceId);

  // Count unique members in current project
  const memberSet = new Set<string>();
  tasks.forEach((t) => {
    (t.assignedMembers || ['admin@workspace.com']).forEach((m) => memberSet.add(m));
  });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    if (wsInput.trim()) {
      dispatch(addWorkspace({ name: wsInput.trim() }));
      setWsInput('');
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (projInput.trim()) {
      dispatch(addProject({ name: projInput.trim() }));
      setProjInput('');
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
    <div className="h-screen w-screen bg-[#F7F8FA] text-[#1F2937] flex flex-col font-sans antialiased overflow-hidden relative">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-[#EAF4EA] border border-[#107C10] text-[#107C10] px-4 py-3 rounded-[10px] shadow-md flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-[#107C10]" />
          <span className="text-xs font-bold">{toast.message}</span>
          <button onClick={() => dispatch(clearToast())} className="ml-2 cursor-pointer">
            <X className="w-4 h-4 text-[#107C10]" />
          </button>
        </div>
      )}

      <Navbar />
      <div className="flex flex-1 overflow-hidden w-full relative">
        <Sidebar />
        <main className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F7F8FA] border-l border-[#E5E7EB] min-w-0">
          <div className="w-full max-w-[1600px] mx-auto space-y-6">

            {/* LEVEL 1: ALL WORKSPACES DASHBOARD */}
            {!activeWorkspaceId && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
                  <div>
                    <h1 className="text-2xl font-bold text-[#111827]">All Workspaces</h1>
                    <p className="text-xs text-[#667085] mt-0.5">
                      Select a workspace to view its projects and tasks.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleCreateWorkspace} className="flex gap-2 max-w-md bg-white p-3 rounded-[10px] border border-[#E5E7EB] shadow-xs">
                  <input
                    type="text"
                    required
                    placeholder="Enter new workspace name..."
                    value={wsInput}
                    onChange={(e) => setWsInput(e.target.value)}
                    className="flex-1 text-xs border border-[#E5E7EB] rounded-[6px] px-3 py-2 focus:outline-none focus:border-[#107C10]"
                  />
                  <button
                    type="submit"
                    className="bg-[#107C10] hover:bg-[#0B6A0B] text-white text-xs font-semibold px-4 py-2 rounded-[6px] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Workspace</span>
                  </button>
                </form>

                {workspaces.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workspaces.map((ws) => {
                      const count = projects.filter((p) => p.workspaceId === ws.id).length;
                      return (
                        <div
                          key={ws.id}
                          onClick={() => {
                            dispatch(setActiveWorkspace(ws.id));
                            dispatch(setActiveProject(null));
                          }}
                          className="p-5 bg-white border border-[#E5E7EB] hover:border-[#107C10] rounded-[12px] shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-3 relative"
                        >
                          <div className="flex items-center justify-between">
                            <div className="h-10 w-10 rounded-[8px] bg-[#EAF4EA] flex items-center justify-center text-[#107C10]">
                              <Layers className="w-5 h-5" />
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => handleDeleteWorkspace(ws.id, ws.name, e)}
                                className="p-1 text-[#98A2B3] hover:text-[#D92D20] hover:bg-[#FFF1F3] rounded-[4px] transition-colors cursor-pointer"
                                title="Delete Workspace"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <span className="text-xs font-bold text-[#107C10] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                <span>Open</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[#111827]">{ws.name}</h3>
                            <p className="text-xs text-[#667085] mt-1">{count} Projects in workspace</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white rounded-[12px] border border-[#E5E7EB] space-y-2">
                    <Layers className="w-8 h-8 text-[#98A2B3] mx-auto" />
                    <h3 className="text-sm font-bold text-[#111827]">No Workspaces Created Yet</h3>
                    <p className="text-xs text-[#667085]">
                      Create your first workspace above to organize your projects.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* LEVEL 2: PROJECTS INSIDE ACTIVE WORKSPACE */}
            {activeWorkspaceId && !activeProjectId && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dispatch(setActiveWorkspace(null))}
                        className="text-xs font-semibold text-[#107C10] hover:underline cursor-pointer"
                      >
                        ← All Workspaces
                      </button>
                      <span className="text-xs text-[#98A2B3]">/</span>
                      <span className="text-xs font-bold text-[#111827]">{currentWorkspace?.name}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#111827] mt-1">
                      {currentWorkspace?.name} - Projects
                    </h1>
                  </div>
                </div>

                <form onSubmit={handleCreateProject} className="flex gap-2 max-w-md bg-white p-3 rounded-[10px] border border-[#E5E7EB] shadow-xs">
                  <input
                    type="text"
                    required
                    placeholder="Enter project name (e.g. Coding Night)..."
                    value={projInput}
                    onChange={(e) => setProjInput(e.target.value)}
                    className="flex-1 text-xs border border-[#E5E7EB] rounded-[6px] px-3 py-2 focus:outline-none focus:border-[#107C10]"
                  />
                  <button
                    type="submit"
                    className="bg-[#107C10] hover:bg-[#0B6A0B] text-white text-xs font-semibold px-4 py-2 rounded-[6px] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Project</span>
                  </button>
                </form>

                {activeWsProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeWsProjects.map((proj) => (
                      <div
                        key={proj.id}
                        onClick={() => dispatch(setActiveProject(proj.id))}
                        className="p-5 bg-white border border-[#E5E7EB] hover:border-[#107C10] rounded-[12px] shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-3 relative"
                      >
                        <div className="flex items-center justify-between">
                          <div className="h-10 w-10 rounded-[8px] bg-[#F7F8FA] flex items-center justify-center text-[#111827]">
                            <Folder className="w-5 h-5 text-[#107C10]" />
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleDeleteProject(proj.id, proj.name, e)}
                              className="p-1 text-[#98A2B3] hover:text-[#D92D20] hover:bg-[#FFF1F3] rounded-[4px] transition-colors cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-bold text-[#107C10] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                              <span>Open Tasks</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[#111827]">{proj.name}</h3>
                          <p className="text-xs text-[#667085] mt-1">Click to view project tasks</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white rounded-[12px] border border-[#E5E7EB] space-y-2">
                    <Folder className="w-8 h-8 text-[#98A2B3] mx-auto" />
                    <h3 className="text-sm font-bold text-[#111827]">No Projects In This Workspace</h3>
                    <p className="text-xs text-[#667085]">
                      Create a project above to start assigning tasks to team members.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* LEVEL 3: TASKS BOARD */}
            {activeWorkspaceId && activeProjectId && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#667085]">
                      <button
                        onClick={() => dispatch(setActiveWorkspace(null))}
                        className="font-semibold text-[#107C10] hover:underline cursor-pointer"
                      >
                        All Workspaces
                      </button>
                      <span>/</span>
                      <button
                        onClick={() => dispatch(setActiveProject(null))}
                        className="font-semibold text-[#107C10] hover:underline cursor-pointer"
                      >
                        {currentWorkspace?.name}
                      </button>
                      <span>/</span>
                      <span className="font-bold text-[#111827]">{currentProject?.name}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-[#111827] mt-1">
                      {currentProject?.name}
                    </h1>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Members List Button */}
                    <button
                      onClick={() => setIsMembersModalOpen(true)}
                      className="bg-white hover:bg-[#F7F8FA] border border-[#E5E7EB] text-[#111827] text-xs font-bold px-3 py-2 rounded-[8px] flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Users className="w-4 h-4 text-[#107C10]" />
                      <span>Members ({memberSet.size})</span>
                    </button>

                    {/* Assign Task Button */}
                    <button
                      onClick={() => dispatch(openTaskModal())}
                      className="bg-[#107C10] hover:bg-[#0B6A0B] text-white text-xs font-bold px-3.5 py-2 rounded-[8px] flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>+ Assign Task to Person</span>
                    </button>
                  </div>
                </div>

                {/* Views Render */}
                {activeView === 'kanban' && <KanbanView />}
                {activeView === 'list' && <ListView />}
                {activeView === 'calendar' && (
                  <div className="p-12 text-center text-[#667085] bg-white rounded-[10px] border border-[#E5E7EB]">
                    <p className="text-sm font-medium">Calendar View active for {currentProject?.name}</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </main>
      </div>

      <TaskModal />
      <TaskDetailModal />
      <CommandPalette />
      <MembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        membersWithTasks={tasks.map((task) => ({
          id: task.id,
          memberEmail: (task.assignedMembers && task.assignedMembers[0]) || 'admin@workspace.com',
          taskTitle: task.title,
          status: (task.status as 'To Do' | 'In Progress' | 'Completed') || 'To Do',
        }))}
      />

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
    </div>
  );
}