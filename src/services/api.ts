
import axios from "axios";
import toast from "react-hot-toast";
import {
  AuthResponse,
  CreateTaskFormData,
  Project,
  Task,
  Team,
  User,
} from "../types";

const API_BASE_URL = "https://smart-task-manager-rose.vercel.app/api";

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";

    // Don't show toast for authentication errors
    if (error.response?.status !== 401) {
      toast.error(message);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await api.post<AuthResponse>("/auth/register", userData);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get<{ user: User }>("/auth/me");
    return response.data;
  },
};

// Teams API
export const teamsAPI = {
  getTeams: async () => {
    const response = await api.get<{ teams: Team[] }>("/teams");
    return response.data;
  },

  getTeam: async (id: string) => {
    const response = await api.get<{ team: Team }>(`/teams/${id}`);
    return response.data;
  },

  createTeam: async (teamData: { name: string; members: any[] }) => {
    const response = await api.post<{ message: string; team: Team }>(
      "/teams",
      teamData
    );
    return response.data;
  },

  updateTeam: async (id: string, teamData: Partial<Team>) => {
    const response = await api.put<{ message: string; team: Team }>(
      `/teams/${id}`,
      teamData
    );
    return response.data;
  },

  deleteTeam: async (id: string) => {
    const response = await api.delete<{ message: string }>(`/teams/${id}`);
    return response.data;
  },
};

// Tasks API
export const tasksAPI = {
  getTasks: async (filters?: { projectId?: string; member?: string }) => {
    const params = new URLSearchParams();
    if (filters?.projectId) params.append("projectId", filters.projectId);
    if (filters?.member) params.append("member", filters.member);

    const response = await api.get<{ tasks: Task[] }>(
      `/tasks?${params.toString()}`
    );
    return response.data;
  },

  createTask: async (taskData: CreateTaskFormData) => {
    const response = await api.post<{
      message: string;
      task: Task;
      isOverCapacity?: boolean;
    }>("/tasks", taskData);
    return response.data;
  },

  updateTask: async (id: string, taskData: Partial<Task>) => {
    const response = await api.put<{ message: string; task: Task }>(
      `/tasks/${id}`,
      taskData
    );
    return response.data;
  },

  deleteTask: async (id: string) => {
    const response = await api.delete<{ message: string }>(`/tasks/${id}`);
    return response.data;
  },

  reassignTasks: async () => {
    const response = await api.post<{
      message: string;
      reassignments: string[];
    }>("/tasks/reassign");
    return response.data;
  },

  autoAssignTask: async (projectId: string) => {
    const response = await api.post<{
      assignedMember: string;
      currentTasks: number;
      capacity: number;
    }>("/tasks/auto-assign", { projectId });
    return response.data;
  },
};

// Projects API 
export const projectsAPI = {
  getProjectStats: async (projectId: string) => {
    const response = await api.get<{ stats: any }>(
      `/projects/${projectId}/stats`
    );
    return response.data;
  },

  
  getProjects: async () => {
    const response = await api.get<{ projects: Project[] }>("/projects");
    return response.data;
  },

  getProject: async (id: string) => {
    const response = await api.get<{ project: Project }>(`/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData: {
    name: string;
    description: string;
    teamId: string;
  }) => {
    const response = await api.post<{ message: string; project: Project }>(
      "/projects",
      projectData
    );
    return response.data;
  },

  updateProject: async (id: string, projectData: Partial<Project>) => {
    const response = await api.put<{ message: string; project: Project }>(
      `/projects/${id}`,
      projectData
    );
    return response.data;
  },

  deleteProject: async (id: string) => {
    const response = await api.delete<{ message: string }>(`/projects/${id}`);
    return response.data;
  },
};
