// src/pages/Tasks/components/CreateTaskModal.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Users, AlertTriangle, Zap } from 'lucide-react';
import { TaskPriority, Project, Team } from '../../../types';
import { tasksAPI } from '../../../services/api';
import toast from 'react-hot-toast';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    projectId: string;
    assignedMember: string;
    priority: TaskPriority;
  }) => void;
  projects: Project[];
  teams: Team[];
}

interface FormData {
  title: string;
  description: string;
  projectId: string;
  assignedMember: string;
  priority: TaskPriority;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projects,
  teams,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<FormData>();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [showCapacityWarning, setShowCapacityWarning] = useState(false);
  const [warningMember, setWarningMember] = useState<any>(null);

  const watchProjectId = watch('projectId');
  const watchAssignedMember = watch('assignedMember');
  const watchPriority = watch('priority');

  // Update team members when project changes
  useEffect(() => {
    if (watchProjectId) {
      const project = projects.find(p => p._id === watchProjectId);
      setSelectedProject(project || null);
      
      if (project) {
        const team = teams.find(t => t._id === project.teamId);
        setTeamMembers(team?.members || []);
      } else {
        setTeamMembers([]);
      }
      
      // Reset assigned member when project changes
      setValue('assignedMember', '');
    }
  }, [watchProjectId, projects, teams, setValue]);

  // Check capacity when member or priority changes
  useEffect(() => {
    if (watchAssignedMember && watchProjectId) {
      const member = teamMembers.find(m => m.name === watchAssignedMember);
      if (member && member.currentTasks >= member.capacity) {
        setWarningMember(member);
        setShowCapacityWarning(true);
      } else {
        setShowCapacityWarning(false);
        setWarningMember(null);
      }
    }
  }, [watchAssignedMember, watchProjectId, teamMembers, watchPriority]);

  const handleAutoAssign = async () => {
    if (!watchProjectId) {
      toast.error('Please select a project first');
      return;
    }

    try {
      const response = await tasksAPI.autoAssignTask(watchProjectId);
      setValue('assignedMember', response.assignedMember);
      toast.success(`Auto-assigned to ${response.assignedMember}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to auto-assign task');
    }
  };

  const handleFormSubmit = (data: FormData) => {
    if (showCapacityWarning && !window.confirm(
      `${warningMember.name} has ${warningMember.currentTasks} tasks but capacity is ${warningMember.capacity}. Assign anyway?`
    )) {
      return;
    }

    onSubmit(data);
    reset();
    setSelectedProject(null);
    setTeamMembers([]);
    setShowCapacityWarning(false);
    setWarningMember(null);
  };

  const handleClose = () => {
    reset();
    setSelectedProject(null);
    setTeamMembers([]);
    setShowCapacityWarning(false);
    setWarningMember(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Basic Task Info */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                {...register('title', { required: 'Task title is required' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter task description"
              />
            </div>
          </div>

          {/* Project Selection */}
          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
              Project *
            </label>
            <select
              {...register('projectId', { required: 'Please select a project' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select a project</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="mt-1 text-sm text-red-600">{errors.projectId.message}</p>
            )}
          </div>

          {/* Assignment Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="assignedMember" className="block text-sm font-medium text-gray-700">
                  Assign To *
                </label>
                <button
                  type="button"
                  onClick={handleAutoAssign}
                  className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Auto-assign
                </button>
              </div>
              <select
                {...register('assignedMember', { required: 'Please select an assignee' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a team member</option>
                {teamMembers.map(member => {
                  const isOverCapacity = member.currentTasks >= member.capacity;
                  return (
                    <option key={member.name} value={member.name}>
                      {member.name} ({member.currentTasks}/{member.capacity}) {member.role}
                      {isOverCapacity ? ' ⚠️' : ''}
                    </option>
                  );
                })}
              </select>
              {errors.assignedMember && (
                <p className="mt-1 text-sm text-red-600">{errors.assignedMember.message}</p>
              )}

              {/* Capacity Warning */}
              {showCapacityWarning && warningMember && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                    <span className="text-sm text-red-700 font-medium">
                      Capacity Warning
                    </span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">
                    {warningMember.name} has {warningMember.currentTasks} tasks but capacity is {warningMember.capacity}.
                    They may be overloaded.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                {...register('priority', { required: 'Please select priority' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
                <option value="High">High</option>
              </select>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
              )}
            </div>
          </div>

          {/* Team Members Overview */}
          {selectedProject && teamMembers.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Team Capacity Overview</h4>
              <div className="grid grid-cols-1 gap-2">
                {teamMembers.map(member => {
                  const utilization = (member.currentTasks / member.capacity) * 100;
                  const isOverCapacity = member.currentTasks > member.capacity;
                  const isSelected = watchAssignedMember === member.name;
                  
                  return (
                    <div
                      key={member.name}
                      className={`p-3 rounded-lg border ${
                        isSelected 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm text-gray-900">
                          {member.name}
                        </span>
                        <span className={`text-sm ${
                          isOverCapacity ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {member.currentTasks} / {member.capacity}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            isOverCapacity ? 'bg-red-600' : 
                            utilization > 80 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(utilization, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{member.role}</span>
                        {isOverCapacity && (
                          <span className="text-red-600">Over capacity</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;