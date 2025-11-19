import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Tasks/Tasks.tsx
import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, CheckCircle, Clock, PlayCircle, AlertTriangle } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useTeams } from '../../hooks/useTeams';
import { projectsAPI } from '../../services/api';
import CreateTaskModal from './components/CreateTaskModal';
import EditTaskModal from './components/EditeTaskModal';
import TaskFilters from './components/TaskFilters';
import toast from 'react-hot-toast';
const Tasks = () => {
    const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
    const { teams } = useTeams();
    const [projects, setProjects] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filters, setFilters] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        fetchProjects();
    }, []);
    const fetchProjects = async () => {
        try {
            const response = await projectsAPI.getProjects();
            setProjects(response.projects);
        }
        catch (error) {
            toast.error('Failed to load projects');
        }
    };
    const handleCreateTask = async (taskData) => {
        try {
            const response = await createTask(taskData);
            if (response.isOverCapacity) {
                toast.success('Task created (member is over capacity)');
            }
            else {
                toast.success('Task created successfully');
            }
            setIsCreateModalOpen(false);
        }
        catch (error) {
            // Error handled in the hook
        }
    };
    const handleUpdateTask = async (updates) => {
        if (!editingTask)
            return;
        try {
            await updateTask(editingTask._id, updates);
            setEditingTask(null);
            toast.success('Task updated successfully');
        }
        catch (error) {
            // Error handled in the hook
        }
    };
    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(taskId);
                toast.success('Task deleted successfully');
            }
            catch (error) {
                // Error handled in the hook
            }
        }
    };
    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            await updateTask(taskId, { status: newStatus });
            toast.success('Task status updated');
        }
        catch (error) {
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
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'text-red-600 bg-red-50 border-red-200';
            case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'Low': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending':
                return _jsx(Clock, { className: "w-4 h-4 text-yellow-600" });
            case 'In Progress':
                return _jsx(PlayCircle, { className: "w-4 h-4 text-blue-600" });
            case 'Done':
                return _jsx(CheckCircle, { className: "w-4 h-4 text-green-600" });
            default:
                return _jsx(Clock, { className: "w-4 h-4 text-gray-600" });
        }
    };
    const getProjectName = (projectId) => {
        const project = projects.find(p => p._id === projectId);
        return project?.name || 'Unknown Project';
    };
    const getTeamForProject = (projectId) => {
        const project = projects.find(p => p._id === projectId);
        return teams.find(t => t._id === project?.teamId);
    };
    const isMemberOverCapacity = (task) => {
        const team = getTeamForProject(task.projectId);
        const member = team?.members.find(m => m.name === task.assignedMember);
        return member && member.currentTasks > member.capacity;
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Tasks" }), _jsx("p", { className: "text-gray-600", children: "Manage and track all your tasks" })] }), _jsxs("button", { onClick: () => setIsCreateModalOpen(true), className: "flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Create Task"] })] }), _jsx("div", { className: "bg-white p-6 rounded-lg shadow-sm border", children: _jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0", children: [_jsx("div", { className: "flex-1 max-w-md", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), _jsx("input", { type: "text", placeholder: "Search tasks...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500" })] }) }), _jsx(TaskFilters, { projects: projects, teams: teams, filters: filters, onFiltersChange: setFilters })] }) }), filteredTasks.length === 0 ? (_jsxs("div", { className: "text-center py-12 bg-white rounded-lg shadow-sm border", children: [_jsx("div", { className: "w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(CheckCircle, { className: "w-12 h-12 text-gray-400" }) }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters' }), _jsx("p", { className: "text-gray-500 mb-4", children: tasks.length === 0
                            ? 'Create your first task to get started.'
                            : 'Try adjusting your filters or search term.' }), tasks.length === 0 && (_jsxs("button", { onClick: () => setIsCreateModalOpen(true), className: "inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Create Task"] }))] })) : (_jsx("div", { className: "bg-white rounded-lg shadow-sm border overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Task" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Project & Assignee" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Priority" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Created" }), _jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredTasks.map((task) => {
                                    const isOverCapacity = isMemberOverCapacity(task);
                                    return (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { children: [_jsxs("div", { className: "flex items-center", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900", children: task.title }), isOverCapacity && (_jsx(AlertTriangle, { className: "w-4 h-4 text-red-500 ml-2", "aria-label": "Assignee is over capacity", role: "img" }))] }), task.description && (_jsx("p", { className: "text-sm text-gray-500 mt-1 line-clamp-2", children: task.description }))] }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsx("div", { className: "text-sm text-gray-900", children: getProjectName(task.projectId) }), _jsx("div", { className: "text-sm text-gray-500", children: task.assignedMember })] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`, children: task.priority }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center space-x-2", children: [getStatusIcon(task.status), _jsx("span", { className: "text-sm text-gray-900 capitalize", children: task.status.toLowerCase() })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: new Date(task.createdAt).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsxs("div", { className: "flex items-center justify-end space-x-2", children: [task.status !== 'Pending' && (_jsx("button", { onClick: () => handleStatusUpdate(task._id, 'Pending'), className: "text-yellow-600 hover:text-yellow-900", title: "Mark as Pending", children: _jsx(Clock, { className: "w-4 h-4" }) })), task.status !== 'In Progress' && (_jsx("button", { onClick: () => handleStatusUpdate(task._id, 'In Progress'), className: "text-blue-600 hover:text-blue-900", title: "Mark as In Progress", children: _jsx(PlayCircle, { className: "w-4 h-4" }) })), task.status !== 'Done' && (_jsx("button", { onClick: () => handleStatusUpdate(task._id, 'Done'), className: "text-green-600 hover:text-green-900", title: "Mark as Done", children: _jsx(CheckCircle, { className: "w-4 h-4" }) })), _jsx("button", { onClick: () => setEditingTask(task), className: "text-gray-400 hover:text-gray-600", children: _jsx(Edit2, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDeleteTask(task._id), className: "text-gray-400 hover:text-red-600", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, task._id));
                                }) })] }) }) })), _jsx(CreateTaskModal, { isOpen: isCreateModalOpen, onClose: () => setIsCreateModalOpen(false), onSubmit: handleCreateTask, projects: projects, teams: teams }), editingTask && (_jsx(EditTaskModal, { task: editingTask, isOpen: !!editingTask, onClose: () => setEditingTask(null), onSubmit: handleUpdateTask, projects: projects, teams: teams }))] }));
};
export default Tasks;
