// src/services/api.ts
import axios from "axios";
import toast from "react-hot-toast";
const API_BASE_URL = "/api";
// Create axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Response interceptor for error handling
api.interceptors.response.use((response) => response, (error) => {
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
});
// Auth API
export const authAPI = {
    login: async (credentials) => {
        const response = await api.post("/auth/login", credentials);
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post("/auth/register", userData);
        return response.data;
    },
    getMe: async () => {
        const response = await api.get("/auth/me");
        return response.data;
    },
};
// Teams API
export const teamsAPI = {
    getTeams: async () => {
        const response = await api.get("/teams");
        return response.data;
    },
    getTeam: async (id) => {
        const response = await api.get(`/teams/${id}`);
        return response.data;
    },
    createTeam: async (teamData) => {
        const response = await api.post("/teams", teamData);
        return response.data;
    },
    updateTeam: async (id, teamData) => {
        const response = await api.put(`/teams/${id}`, teamData);
        return response.data;
    },
    deleteTeam: async (id) => {
        const response = await api.delete(`/teams/${id}`);
        return response.data;
    },
};
// Tasks API
export const tasksAPI = {
    getTasks: async (filters) => {
        const params = new URLSearchParams();
        if (filters?.projectId)
            params.append("projectId", filters.projectId);
        if (filters?.member)
            params.append("member", filters.member);
        const response = await api.get(`/tasks?${params.toString()}`);
        return response.data;
    },
    createTask: async (taskData) => {
        const response = await api.post("/tasks", taskData);
        return response.data;
    },
    updateTask: async (id, taskData) => {
        const response = await api.put(`/tasks/${id}`, taskData);
        return response.data;
    },
    deleteTask: async (id) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    },
    reassignTasks: async () => {
        const response = await api.post("/tasks/reassign");
        return response.data;
    },
    autoAssignTask: async (projectId) => {
        const response = await api.post("/tasks/auto-assign", { projectId });
        return response.data;
    },
};
// Projects API (You'll need to create these endpoints in backend)
export const projectsAPI = {
    getProjectStats: async (projectId) => {
        const response = await api.get(`/projects/${projectId}/stats`);
        return response.data;
    },
    getProjects: async () => {
        const response = await api.get("/projects");
        return response.data;
    },
    getProject: async (id) => {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },
    createProject: async (projectData) => {
        const response = await api.post("/projects", projectData);
        return response.data;
    },
    updateProject: async (id, projectData) => {
        const response = await api.put(`/projects/${id}`, projectData);
        return response.data;
    },
    deleteProject: async (id) => {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    },
};
