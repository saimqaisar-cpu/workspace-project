import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Project {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
}

interface WorkspaceState {
  workspaces: Workspace[];
  projects: Project[];
  activeWorkspaceId: string | null;
  activeProjectId: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  projects: [],
  activeWorkspaceId: null,
  activeProjectId: null,
};

export const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    addWorkspace: (state, action: PayloadAction<{ name: string; description?: string }>) => {
      const newWs: Workspace = {
        id: `ws-${Date.now()}`,
        name: action.payload.name,
        description: action.payload.description,
      };
      state.workspaces.push(newWs);
      state.activeWorkspaceId = newWs.id;
      state.activeProjectId = null;
    },
    setActiveWorkspace: (state, action: PayloadAction<string | null>) => {
      state.activeWorkspaceId = action.payload;
      state.activeProjectId = null;
    },
    addProject: (state, action: PayloadAction<{ name: string; description?: string }>) => {
      if (!state.activeWorkspaceId) return;
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        name: action.payload.name,
        description: action.payload.description,
        workspaceId: state.activeWorkspaceId,
      };
      state.projects.push(newProj);
      state.activeProjectId = newProj.id;
    },
    setActiveProject: (state, action: PayloadAction<string | null>) => {
      state.activeProjectId = action.payload;
    },
    deleteWorkspace: (state, action: PayloadAction<string>) => {
      state.workspaces = state.workspaces.filter((w) => w.id !== action.payload);
      state.projects = state.projects.filter((p) => p.workspaceId !== action.payload);
      if (state.activeWorkspaceId === action.payload) {
        state.activeWorkspaceId = null;
        state.activeProjectId = null;
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
      if (state.activeProjectId === action.payload) {
        state.activeProjectId = null;
      }
    },
  },
});

export const {
  addWorkspace,
  setActiveWorkspace,
  addProject,
  setActiveProject,
  deleteWorkspace,
  deleteProject,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;