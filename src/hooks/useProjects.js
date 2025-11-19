// // src/hooks/useProjects.ts
// import { useState, useEffect } from 'react';
// import { Project } from '../types';
// import { projectsAPI } from '../services/api';
// import toast from 'react-hot-toast';
// export const useProjects = () => {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const fetchProjects = async () => {
//     try {
//       setLoading(true);
//       const response = await projectsAPI.getProjects();
//       setProjects(response.projects);
//       setError(null);
//     } catch (err: any) {
//       setError(err.message);
//       toast.error('Failed to fetch projects');
//     } finally {
//       setLoading(false);
//     }
//   };
//   const createProject = async (projectData: { name: string; description: string; teamId: string }) => {
//     try {
//       const response = await projectsAPI.createProject(projectData);
//       setProjects(prev => [...prev, response.project]);
//       toast.success('Project created successfully');
//       return response.project;
//     } catch (err: any) {
//       toast.error('Failed to create project');
//       throw err;
//     }
//   };
//   const updateProject = async (id: string, projectData: Partial<Project>) => {
//     try {
//       const response = await projectsAPI.updateProject(id, projectData);
//       setProjects(prev => prev.map(project => project._id === id ? response.project : project));
//       toast.success('Project updated successfully');
//       return response.project;
//     } catch (err: any) {
//       toast.error('Failed to update project');
//       throw err;
//     }
//   };
//   const deleteProject = async (id: string) => {
//     try {
//       await projectsAPI.deleteProject(id);
//       setProjects(prev => prev.filter(project => project._id !== id));
//       toast.success('Project deleted successfully');
//     } catch (err: any) {
//       toast.error('Failed to delete project');
//       throw err;
//     }
//   };
//   useEffect(() => {
//     fetchProjects();
//   }, []);
//   return {
//     projects,
//     loading,
//     error,
//     fetchProjects,
//     createProject,
//     updateProject,
//     deleteProject,
//   };
// };
// src/hooks/useProjects.ts
import { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';
import toast from 'react-hot-toast';
export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await projectsAPI.getProjects();
            console.log('Fetched projects:', response.projects); // Debug log
            setProjects(response.projects || []);
        }
        catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to fetch projects';
            setError(errorMessage);
            toast.error(errorMessage);
            setProjects([]); // Reset to empty array on error
        }
        finally {
            setLoading(false);
        }
    };
    const createProject = async (projectData) => {
        try {
            const response = await projectsAPI.createProject(projectData);
            setProjects(prev => [...prev, response.project]);
            toast.success('Project created successfully');
            return response.project;
        }
        catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to create project';
            toast.error(errorMessage);
            throw err;
        }
    };
    const updateProject = async (id, projectData) => {
        try {
            const response = await projectsAPI.updateProject(id, projectData);
            setProjects(prev => prev.map(project => project._id === id ? response.project : project));
            toast.success('Project updated successfully');
            return response.project;
        }
        catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update project';
            toast.error(errorMessage);
            throw err;
        }
    };
    const deleteProject = async (id) => {
        try {
            await projectsAPI.deleteProject(id);
            setProjects(prev => prev.filter(project => project._id !== id));
            toast.success('Project deleted successfully');
        }
        catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to delete project';
            toast.error(errorMessage);
            throw err;
        }
    };
    useEffect(() => {
        fetchProjects();
    }, []);
    return {
        projects,
        loading,
        error,
        fetchProjects,
        createProject,
        updateProject,
        deleteProject,
        refetch: fetchProjects, // Add refetch function
    };
};
