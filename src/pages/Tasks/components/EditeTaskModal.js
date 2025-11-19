import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Tasks/components/EditTaskModal.tsx
import { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
const EditTaskModal = ({ task, isOpen, onClose, onSubmit, projects, teams, }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [projectId, setProjectId] = useState(task.projectId);
    const [assignedMember, setAssignedMember] = useState(task.assignedMember);
    const [priority, setPriority] = useState(task.priority);
    const [status, setStatus] = useState(task.status);
    const [selectedProject, setSelectedProject] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [showCapacityWarning, setShowCapacityWarning] = useState(false);
    const [warningMember, setWarningMember] = useState(null);
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
            }
            else {
                setShowCapacityWarning(false);
                setWarningMember(null);
            }
        }
    }, [assignedMember, projectId, teamMembers, task.assignedMember]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert('Please enter a task title');
            return;
        }
        if (showCapacityWarning && !window.confirm(`${warningMember.name} has ${warningMember.currentTasks} tasks but capacity is ${warningMember.capacity}. Assign anyway?`)) {
            return;
        }
        const updates = {
            title: title.trim(),
            description: description.trim(),
            projectId,
            assignedMember,
            priority,
            status,
        };
        onSubmit(updates);
    };
    const handleProjectChange = (newProjectId) => {
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
        }
        else {
            setTeamMembers([]);
            setAssignedMember('');
        }
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center p-6 border-b", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Edit Task" }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "w-6 h-6" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 gap-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700 mb-2", children: "Task Title *" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", placeholder: "Enter task title" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", placeholder: "Enter task description" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "projectId", className: "block text-sm font-medium text-gray-700 mb-2", children: "Project *" }), _jsx("select", { id: "projectId", title: "Project", "aria-label": "Project", value: projectId, onChange: (e) => handleProjectChange(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", children: projects.map(project => (_jsx("option", { value: project._id, children: project.name }, project._id))) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "assignedMember", className: "block text-sm font-medium text-gray-700 mb-2", children: "Assign To *" }), _jsxs("select", { id: "assignedMember", title: "Assign To", "aria-label": "Assign To", value: assignedMember, onChange: (e) => setAssignedMember(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", children: [_jsx("option", { value: "", children: "Select a team member" }), teamMembers.map(member => {
                                                    const isOverCapacity = member.currentTasks >= member.capacity;
                                                    return (_jsxs("option", { value: member.name, children: [member.name, " (", member.currentTasks, "/", member.capacity, ") ", member.role, isOverCapacity ? ' ⚠️' : ''] }, member.name));
                                                })] }), showCapacityWarning && warningMember && (_jsxs("div", { className: "mt-2 p-3 bg-red-50 border border-red-200 rounded-md", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(AlertTriangle, { className: "w-4 h-4 text-red-600 mr-2" }), _jsx("span", { className: "text-sm text-red-700 font-medium", children: "Capacity Warning" })] }), _jsxs("p", { className: "text-sm text-red-600 mt-1", children: [warningMember.name, " has ", warningMember.currentTasks, " tasks but capacity is ", warningMember.capacity, ". They may be overloaded."] })] }))] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "priority", className: "block text-sm font-medium text-gray-700 mb-2", children: "Priority *" }), _jsxs("select", { id: "priority", title: "Priority", "aria-label": "Priority", value: priority, onChange: (e) => setPriority(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", children: [_jsx("option", { value: "Low", children: "Low" }), _jsx("option", { value: "Medium", children: "Medium" }), _jsx("option", { value: "High", children: "High" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "status", className: "block text-sm font-medium text-gray-700 mb-2", children: "Status *" }), _jsxs("select", { id: "status", title: "Status", "aria-label": "Status", value: status, onChange: (e) => setStatus(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", children: [_jsx("option", { value: "Pending", children: "Pending" }), _jsx("option", { value: "In Progress", children: "In Progress" }), _jsx("option", { value: "Done", children: "Done" })] })] })] })] }), _jsxs("div", { className: "flex justify-end space-x-3 pt-6 border-t", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200", children: "Cancel" }), _jsx("button", { type: "submit", className: "px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700", children: "Update Task" })] })] })] }) }));
};
export default EditTaskModal;
