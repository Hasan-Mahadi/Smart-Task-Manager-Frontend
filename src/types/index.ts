
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface TeamMember {
  name: string;
  role: string;
  capacity: number;
  currentTasks: number;
}

export interface Team {
  _id: string;
  name: string;
  createdBy: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Done';

export interface Task {
  _id: string;
  title: string;
  description: string;
  projectId: string;
  assignedMember: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  project?: {
    name: string;
  };
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  teamId: string;
  createdBy: string;
  tasks: string[];
  createdAt: string;
  updatedAt: string;
  team?: Team;
}

export interface ActivityLog {
  _id: string;
  action: string;
  details: string;
  timestamp: string;
  userId: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateTeamFormData {
  name: string;
  members: Omit<TeamMember, 'currentTasks'>[];
}

export interface CreateProjectFormData {
  name: string;
  description: string;
  teamId: string;
}

export interface CreateTaskFormData {
  title: string;
  description: string;
  projectId: string;
  assignedMember: string;
  priority: TaskPriority;
}