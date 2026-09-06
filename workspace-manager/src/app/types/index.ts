export type Role = 'owner' | 'admin' | 'member' | 'viewer';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'todo' | 'in_progress' | 'review' | 'done';
export type ViewMode = 'kanban' | 'list' | 'calendar';

export interface UserProfile {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: string;
  assigneeId: string;
  labels: string[];
  subtasks: Subtask[];
  attachments: { id: string; name: string; url: string }[];
  createdAt: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  color: string;
  members: string[];
  isArchived: boolean;
  defaultView: ViewMode;
}

export interface Workspace {
  id: string;
  name: string;
  color: string;
  members: { userId: string; role: Role }[];
  defaultView: ViewMode;
}