export type Role = 'owner' | 'admin' | 'member' | 'viewer';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type Status = 'To Do' | 'In Progress' | 'Review' | 'Done';
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
  workspaceId: string;
  projectId: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  dueDate?: string;
  accessRole?: string;
  assignedMembers?: string[];
  subtasks?: Subtask[];
  tags?: string[];
  assigneeId?: string;
  labels?: string[];
  attachments?: { id: string; name: string; url: string }[];
  createdAt?: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  color?: string;
  members?: string[];
  isArchived?: boolean;
  defaultView?: ViewMode;
}

export interface Workspace {
  id: string;
  name: string;
  color?: string;
  description?: string;
  members?: { userId: string; role: Role }[];
  defaultView?: ViewMode;
}
