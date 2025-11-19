import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Tasks/components/CreateTaskModal.tsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, AlertTriangle, Zap } from 'lucide-react';
import { tasksAPI } from '../../../services/api';
import toast from 'react-hot-toast';
const CreateTaskModal = ({ isOpen, onClose, onSubmit, projects, teams, }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue, } = useForm();
    const [selectedProject, setSelectedProject] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [showCapacityWarning, setShowCapacityWarning] = useState(false);
    const [warningMember, setWarningMember] = useState(null);
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
            }
            else {
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
            }
            else {
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
        }
        catch (error) {
            toast.error(error.response?.data?.message || 'Failed to auto-assign task');
        }
    };
    const handleFormSubmit = (data) => {
        if (showCapacityWarning && !window.confirm(`${warningMember.name} has ${warningMember.currentTasks} tasks but capacity is ${warningMember.capacity}. Assign anyway?`)) {
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
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center p-6 border-b", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Create New Task" }), _jsx("button", { onClick: handleClose, className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "w-6 h-6" }) })] }), _jsxs("form", { onSubmit: handleSubmit(handleFormSubmit), className: "p-6 space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 gap-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700 mb-2", children: "Task Title *" }), _jsx("input", { ...register('title', { required: 'Task title is required' }), type: "text", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", placeholder: "Enter task title" }), errors.title && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.title.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { ...register('description'), rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", placeholder: "Enter task description" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "projectId", className: "block text-sm font-medium text-gray-700 mb-2", children: "Project *" }), _jsxs("select", { ...register('projectId', { required: 'Please select a project' }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", children: [_jsx("option", { value: "", children: "Select a project" }), projects.map(project => (_jsx("option", { value: project._id, children: project.name }, project._id)))] }), errors.projectId && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.projectId.message }))] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("label", { htmlFor: "assignedMember", className: "block text-sm font-medium text-gray-700", children: "Assign To *" }), _jsxs("button", { type: "button", onClick: handleAutoAssign, className: "flex items-center text-sm text-primary-600 hover:text-primary-700", children: [_jsx(Zap, { className: "w-4 h-4 mr-1" }), "Auto-assign"] })] }), _jsxs("select", { ...register('assignedMember', { required: 'Please select an assignee' }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", children: [_jsx("option", { value: "", children: "Select a team member" }), teamMembers.map(member => {
                                                    const isOverCapacity = member.currentTasks >= member.capacity;
                                                    return (_jsxs("option", { value: member.name, children: [member.name, " (", member.currentTasks, "/", member.capacity, ") ", member.role, isOverCapacity ? ' ⚠️' : ''] }, member.name));
                                                })] }), errors.assignedMember && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.assignedMember.message })), showCapacityWarning && warningMember && (_jsxs("div", { className: "mt-2 p-3 bg-red-50 border border-red-200 rounded-md", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(AlertTriangle, { className: "w-4 h-4 text-red-600 mr-2" }), _jsx("span", { className: "text-sm text-red-700 font-medium", children: "Capacity Warning" })] }), _jsxs("p", { className: "text-sm text-red-600 mt-1", children: [warningMember.name, " has ", warningMember.currentTasks, " tasks but capacity is ", warningMember.capacity, ". They may be overloaded."] })] }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "priority", className: "block text-sm font-medium text-gray-700 mb-2", children: "Priority *" }), _jsxs("select", { ...register('priority', { required: 'Please select priority' }), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", children: [_jsx("option", { value: "Medium", children: "Medium" }), _jsx("option", { value: "Low", children: "Low" }), _jsx("option", { value: "High", children: "High" })] }), errors.priority && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.priority.message }))] })] }), selectedProject && teamMembers.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-medium text-gray-700 mb-3", children: "Team Capacity Overview" }), _jsx("div", { className: "grid grid-cols-1 gap-2", children: teamMembers.map(member => {
                                        const utilization = (member.currentTasks / member.capacity) * 100;
                                        const isOverCapacity = member.currentTasks > member.capacity;
                                        const isSelected = watchAssignedMember === member.name;
                                        return (_jsxs("div", { className: `p-3 rounded-lg border ${isSelected
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-200 bg-gray-50'}`, children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("span", { className: "font-medium text-sm text-gray-900", children: member.name }), _jsxs("span", { className: `text-sm ${isOverCapacity ? 'text-red-600' : 'text-gray-600'}`, children: [member.currentTasks, " / ", member.capacity] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: `h-2 rounded-full ${isOverCapacity ? 'bg-red-600' :
                                                            utilization > 80 ? 'bg-yellow-500' : 'bg-green-500'}`, style: { width: `${Math.min(utilization, 100)}%` } }) }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500 mt-1", children: [_jsx("span", { children: member.role }), isOverCapacity && (_jsx("span", { className: "text-red-600", children: "Over capacity" }))] })] }, member.name));
                                    }) })] })), _jsxs("div", { className: "flex justify-end space-x-3 pt-6 border-t", children: [_jsx("button", { type: "button", onClick: handleClose, className: "px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50", children: isSubmitting ? 'Creating...' : 'Create Task' })] })] })] }) }));
};
export default CreateTaskModal;
