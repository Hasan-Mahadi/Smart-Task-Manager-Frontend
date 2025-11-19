// src/pages/Tasks/components/EditTaskModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Users, AlertTriangle } from 'lucide-react';
import { Task, TaskPriority, TaskStatus, Project, Team } from '../../../types';

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updates: Partial<Task>) => void;
  projects: Project[];
  teams: Team[];
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSubmit,
  projects,
  teams,
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [projectId, setProjectId] = useState(task.projectId);
  const [assignedMember, setAssignedMember] = useState(task.assignedMember);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [status, setStatus] = useState<TaskStatus>(task.status);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [showCapacityWarning, setShowCapacityWarning] = useState(false);
  const [warningMember, setWarningMember] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
      setDescription(task.description);
      setProjectId(task.projectId);
      setAssignedMember(task.assignedMember);
      setPriority(task.priority);
      setStatus(task.status);
      
      const project = projects.find(p => p._id === task.projectId);
      setSelectedProject(project || null);
      
      if (project) {
        const team = teams.find(t => t._id === project.teamId);
        setTeamMembers(team?.members || []);
      }
    }
  }, [isOpen, task, projects, teams]);

  useEffect(() => {
    if (assignedMember && projectId) {
      const member = teamMembers.find(m => m.name === assignedMember);
      if (member && member.currentTasks >= member.capacity && assignedMember !== task.assignedMember) {
        setWarningMember(member);
        setShowCapacityWarning(true);
      } else {
        setShowCapacityWarning(false);
        setWarningMember(null);
      }
    }
  }, [assignedMember, projectId, teamMembers, task.assignedMember]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    if (showCapacityWarning && !window.confirm(
      `${warningMember.name} has ${warningMember.currentTasks} tasks but capacity is ${warningMember.capacity}. Assign anyway?`
    )) {
      return;
    }

    const updates: Partial<Task> = {
      title: title.trim(),
      description: description.trim(),
      projectId,
      assignedMember,
      priority,
      status,
    };

    onSubmit(updates);
  };

  const handleProjectChange = (newProjectId: string) => {
    setProjectId(newProjectId);
    const project = projects.find(p => p._id === newProjectId);
    setSelectedProject(project || null);
    
    if (project) {
      const team = teams.find(t => t._id === project.teamId);
      const newTeamMembers = team?.members || [];
      setTeamMembers(newTeamMembers);
      
      // Reset assigned member if not in new team
      if (!newTeamMembers.some(m => m.name === assignedMember)) {
        setAssignedMember('');
      }
    } else {
      setTeamMembers([]);
      setAssignedMember('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Task Info */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              id="projectId"
              title="Project"
              aria-label="Project"
              value={projectId}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Assignment Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="assignedMember" className="block text-sm font-medium text-gray-700 mb-2">
                Assign To *
              </label>
              <select
                id="assignedMember"
                title="Assign To"
                aria-label="Assign To"
                value={assignedMember}
                onChange={(e) => setAssignedMember(e.target.value)}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  id="priority"
                  title="Priority"
                  aria-label="Priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  title="Status"
                  aria-label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;