import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Task } from '@/types';
import { RootState } from '../index';
import { playNotificationSound } from '@/utils/audio';

export interface ExtendedTask extends Omit<Task, 'tags'> {
  workspaceId: string;
  projectId: string;
  dueDate?: string;
  accessRole?: string;
  assignedMembers?: string[];
  notification?: {
    message: string;
    type: 'success' | 'error' | 'info';
  } | null;
}

interface TaskState {
  items: ExtendedTask[];
  selectedTaskId: string | null;
  searchQuery: string;
  history: ExtendedTask[][];
  historyIndex: number;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}

const initialState: TaskState = {
  items: [],
  selectedTaskId: null,
  searchQuery: '',
  history: [[]],
  historyIndex: 0,
  toast: null,
};

const saveToHistory = (state: TaskState) => {
  state.history = state.history.slice(0, state.historyIndex + 1);
  state.history.push(JSON.parse(JSON.stringify(state.items)));
  state.historyIndex = state.history.length - 1;
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedTaskId: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskId = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<{ taskId: string; status: any }>
    ) => {
      const task = state.items.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.status;
        if (action.payload.status === 'Done') {
          playNotificationSound('success');
          state.toast = {
            message: `Task "${task.title}" has been completed successfully!`,
            type: 'success',
          };
        }
        saveToHistory(state);
      }
    },
    addTask: (state, action: PayloadAction<Omit<ExtendedTask, 'id'>>) => {
      const newTask: ExtendedTask = {
        ...action.payload,
        id: `task-${Date.now()}`,
        status: 'To Do',
        dueDate: action.payload.dueDate || '',
        subtasks: action.payload.subtasks || [],
        accessRole: action.payload.accessRole || 'Developer',
        assignedMembers: action.payload.assignedMembers || ['admin@workspace.com'],
      };
      state.items.push(newTask);
      playNotificationSound('info');
      state.toast = {
        message: `New task "${newTask.title}" created and assigned.`,
        type: 'info',
      };
      saveToHistory(state);
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
      if (state.selectedTaskId === action.payload) {
        state.selectedTaskId = null;
      }
      playNotificationSound('warning');
      saveToHistory(state);
    },
    toggleSubtask: (
      state,
      action: PayloadAction<{ taskId: string; subtaskId: string }>
    ) => {
      const task = state.items.find((t) => t.id === action.payload.taskId);
      if (task && task.subtasks) {
        const sub = task.subtasks.find((s) => s.id === action.payload.subtaskId);
        if (sub) {
          sub.completed = !sub.completed;
          const allCompleted = task.subtasks.every((s) => s.completed);
          if (allCompleted && task.subtasks.length > 0) {
            task.status = 'Done';
            playNotificationSound('success');
            state.toast = {
              message: `All subtasks completed! Task "${task.title}" is now DONE!`,
              type: 'success',
            };
          } else {
            playNotificationSound('info');
          }
          saveToHistory(state);
        }
      }
    },
    addMemberToTask: (
      state,
      action: PayloadAction<{ taskId: string; email: string }>
    ) => {
      const task = state.items.find((t) => t.id === action.payload.taskId);
      if (task) {
        if (!task.assignedMembers) task.assignedMembers = [];
        if (!task.assignedMembers.includes(action.payload.email)) {
          task.assignedMembers.push(action.payload.email);
          saveToHistory(state);
        }
      }
    },
    removeMemberFromTask: (
      state,
      action: PayloadAction<{ taskId: string; email: string }>
    ) => {
      const task = state.items.find((t) => t.id === action.payload.taskId);
      if (task && task.assignedMembers) {
        task.assignedMembers = task.assignedMembers.filter(
          (m) => m !== action.payload.email
        );
        saveToHistory(state);
      }
    },
    addSubtaskToTask: (
      state,
      action: PayloadAction<{ taskId: string; title: string }>
    ) => {
      const task = state.items.find((t) => t.id === action.payload.taskId);
      if (task) {
        if (!task.subtasks) task.subtasks = [];
        task.subtasks.push({
          id: `sub-${Date.now()}`,
          title: action.payload.title,
          completed: false,
        });
        saveToHistory(state);
      }
    },
    removeSubtaskFromTask: (
      state,
      action: PayloadAction<{ taskId: string; subtaskId: string }>
    ) => {
      const task = state.items.find((t) => t.id === action.payload.taskId);
      if (task && task.subtasks) {
        task.subtasks = task.subtasks.filter((s) => s.id !== action.payload.subtaskId);
        saveToHistory(state);
      }
    },
    updateTaskAccessRole: (
      state,
      action: PayloadAction<{ taskId: string; accessRole: string }>
    ) => {
      const task = state.items.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.accessRole = action.payload.accessRole;
        saveToHistory(state);
      }
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1;
        state.items = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1;
        state.items = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
      }
    },
  },
});

export const {
  setSearchQuery,
  setSelectedTaskId,
  clearToast,
  updateTaskStatus,
  addTask,
  deleteTask,
  addMemberToTask,
  removeMemberFromTask,
  addSubtaskToTask,
  toggleSubtask,
  removeSubtaskFromTask,
  updateTaskAccessRole,
  undo,
  redo,
} = taskSlice.actions;

export const selectAllTasks = (state: RootState) => state.tasks?.items || [];
export const selectSearchQuery = (state: RootState) => state.tasks?.searchQuery || '';
export const selectActiveWorkspaceId = (state: RootState) => state.workspaces?.activeWorkspaceId;
export const selectActiveProjectId = (state: RootState) => state.workspaces?.activeProjectId;

export const selectFilteredTasks = createSelector(
  [selectAllTasks, selectSearchQuery, selectActiveWorkspaceId, selectActiveProjectId],
  (tasks, query, activeWorkspaceId, activeProjectId) => {
    return tasks.filter(
      (t) =>
        t.workspaceId === activeWorkspaceId &&
        t.projectId === activeProjectId &&
        t.title.toLowerCase().includes(query.toLowerCase())
    );
  }
);

export default taskSlice.reducer;