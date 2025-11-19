// src/hooks/useTasks.ts
import { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useTasks = (filters?: { projectId?: string; member?: string }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async (newFilters?: { projectId?: string; member?: string }) => {
    try {
      setLoading(true);
      const currentFilters = newFilters || filters;
      const response = await tasksAPI.getTasks(currentFilters);
      setTasks(response.tasks);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: {
    title: string;
    description: string;
    projectId: string;
    assignedMember: string;
    priority: TaskPriority;
  }) => {
    try {
      const response = await tasksAPI.createTask(taskData);
      setTasks(prev => [...prev, response.task]);
      toast.success('Task created successfully');
      return response;
    } catch (err: any) {
      toast.error('Failed to create task');
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await tasksAPI.updateTask(id, updates);
      setTasks(prev => prev.map(task => task._id === id ? response.task : task));
      toast.success('Task updated successfully');
      return response.task;
    } catch (err: any) {
      toast.error('Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await tasksAPI.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
      toast.success('Task deleted successfully');
    } catch (err: any) {
      toast.error('Failed to delete task');
      throw err;
    }
  };

  const reassignTasks = async () => {
    try {
      const response = await tasksAPI.reassignTasks();
      await fetchTasks(); // Refresh tasks after reassignment
      toast.success(response.message);
      return response.reassignments;
    } catch (err: any) {
      toast.error('Failed to reassign tasks');
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters?.projectId, filters?.member]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    reassignTasks,
  };
};