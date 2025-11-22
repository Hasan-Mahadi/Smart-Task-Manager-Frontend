
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Filter, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle,
  Clock,
  PlayCircle,
  AlertTriangle
} from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useTeams } from '../../hooks/useTeams';
import { projectsAPI } from '../../services/api';
import { Task, TaskPriority, TaskStatus, Project } from '../../types';
import CreateTaskModal from './components/CreateTaskModal';
import EditTaskModal from './components/EditeTaskModal';
import TaskFilters from './components/TaskFilters';
import toast from 'react-hot-toast';

const Tasks: React.FC = () => {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
  const { teams } = useTeams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<{ projectId?: string; member?: string; status?: TaskStatus; priority?: TaskPriority }>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getProjects();
      setProjects(response.projects);
    } catch (error) {
      toast.error('Failed to load projects');
    }
  };

  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    projectId: string;
    assignedMember: string;
    priority: TaskPriority;
  }) => {
    try {
      const response = await createTask(taskData);
      if (response.isOverCapacity) {
        toast.success('Task created (member is over capacity)');
      } else {
        toast.success('Task created successfully');
      }
      setIsCreateModalOpen(false);
    } catch (error) {
      // Error handled in the hook
    }
  };

  const handleUpdateTask = async (updates: Partial<Task>) => {
    if (!editingTask) return;
    
    try {
      await updateTask(editingTask._id, updates);
      setEditingTask(null);
      toast.success('Task updated successfully');
    } catch (error) {
      // Error handled in the hook
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        toast.success('Task deleted successfully');
      } catch (error) {
        // Error handled in the hook
      }
    }
  };

  const handleStatusUpdate = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      toast.success('Task status updated');
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  // Filter tasks based on current filters and search term
  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !task.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Project filter
    if (filters.projectId && task.projectId !== filters.projectId) {
      return false;
    }

    // Member filter
    if (filters.member && task.assignedMember !== filters.member) {
      return false;
    }

    // Status filter
    if (filters.status && task.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    return true;
  });

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'In Progress':
        return <PlayCircle className="w-4 h-4 text-blue-600" />;
      case 'Done':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p._id === projectId);
    return project?.name || 'Unknown Project';
  };

  const getTeamForProject = (projectId: string) => {
    const project = projects.find(p => p._id === projectId);
    return teams.find(t => t._id === project?.teamId);
  };

  const isMemberOverCapacity = (task: Task) => {
    const team = getTeamForProject(task.projectId);
    const member = team?.members.find(m => m.name === task.assignedMember);
    return member && member.currentTasks > member.capacity;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage and track all your tasks</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <TaskFilters
            projects={projects}
            teams={teams}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
          </h3>
          <p className="text-gray-500 mb-4">
            {tasks.length === 0 
              ? 'Create your first task to get started.' 
              : 'Try adjusting your filters or search term.'
            }
          </p>
          {tasks.length === 0 && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project & Assignee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task) => {
                  const isOverCapacity = isMemberOverCapacity(task);
                  
                  return (
                    <tr key={task._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="flex items-center">
                            <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                              {isOverCapacity && (
                                <AlertTriangle className="w-4 h-4 text-red-500 ml-2" aria-label="Assignee is over capacity" role="img" />
                              )}
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getProjectName(task.projectId)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {task.assignedMember}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(task.status)}
                          <span className="text-sm text-gray-900 capitalize">{task.status.toLowerCase()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Status Update Buttons */}
                          {task.status !== 'Pending' && (
                            <button
                              onClick={() => handleStatusUpdate(task._id, 'Pending')}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Mark as Pending"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          )}
                          {task.status !== 'In Progress' && (
                            <button
                              onClick={() => handleStatusUpdate(task._id, 'In Progress')}
                              className="text-blue-600 hover:text-blue-900"
                              title="Mark as In Progress"
                            >
                              <PlayCircle className="w-4 h-4" />
                            </button>
                          )}
                          {task.status !== 'Done' && (
                            <button
                              onClick={() => handleStatusUpdate(task._id, 'Done')}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as Done"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Edit Button */}
                          <button
                            onClick={() => setEditingTask(task)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        projects={projects}
        teams={teams}
      />

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={handleUpdateTask}
          projects={projects}
          teams={teams}
        />
      )}
    </div>
  );
};

export default Tasks;


