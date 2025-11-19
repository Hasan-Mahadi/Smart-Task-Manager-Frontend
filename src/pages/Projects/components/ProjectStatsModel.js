import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
// src/pages/Projects/components/ProjectStatsModal.tsx
import { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { projectsAPI } from '../../../services/api';
const ProjectStatsModal = ({ project, isOpen, onClose, }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (isOpen) {
            fetchProjectStats();
        }
    }, [isOpen, project]);
    const fetchProjectStats = async () => {
        try {
            setLoading(true);
            const response = await projectsAPI.getProjectStats(project._id);
            setStats(response.stats);
        }
        catch (error) {
            console.error('Failed to fetch project stats');
        }
        finally {
            setLoading(false);
        }
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center p-6 border-b", children: [_jsxs("h2", { className: "text-xl font-semibold text-gray-900", children: ["Project Statistics - ", project.name] }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "w-6 h-6" }) })] }), loading ? (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }) })) : stats ? (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-blue-50 p-4 rounded-lg border border-blue-200", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: stats.totalTasks }), _jsx("div", { className: "text-sm text-blue-700", children: "Total Tasks" })] }), _jsxs("div", { className: "bg-yellow-50 p-4 rounded-lg border border-yellow-200", children: [_jsx("div", { className: "text-2xl font-bold text-yellow-600", children: stats.pendingTasks }), _jsx("div", { className: "text-sm text-yellow-700", children: "Pending" })] }), _jsxs("div", { className: "bg-blue-50 p-4 rounded-lg border border-blue-200", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: stats.inProgressTasks }), _jsx("div", { className: "text-sm text-blue-700", children: "In Progress" })] }), _jsxs("div", { className: "bg-green-50 p-4 rounded-lg border border-green-200", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: stats.doneTasks }), _jsx("div", { className: "text-sm text-green-700", children: "Completed" })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg border", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Completion Progress" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600", children: [_jsx("span", { children: "Completion Rate" }), _jsxs("span", { children: [stats.completionRate.toFixed(1), "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-3", children: _jsx("div", { className: "bg-green-500 h-3 rounded-full transition-all duration-300", style: { width: `${stats.completionRate}%` } }) }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [_jsxs("span", { children: [stats.doneTasks, " of ", stats.totalTasks, " tasks completed"] }), _jsxs("span", { children: [stats.pendingTasks + stats.inProgressTasks, " remaining"] })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg border", children: [_jsx("div", { className: "p-6 border-b", children: _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Team Workload" }) }), _jsx("div", { className: "p-6", children: _jsx("div", { className: "space-y-4", children: stats.memberWorkload.map(member => {
                                            const utilization = (member.assignedTasks / member.capacity) * 100;
                                            return (_jsx("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-900", children: member.name }), _jsxs("span", { className: "text-sm text-gray-600 ml-2", children: ["(", member.role, ")"] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("span", { className: `text-sm font-medium ${member.isOverCapacity ? 'text-red-600' : 'text-gray-900'}`, children: [member.assignedTasks, " / ", member.capacity] }), member.isOverCapacity && (_jsx(AlertTriangle, { className: "w-4 h-4 text-red-500" }))] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: `h-2 rounded-full ${member.isOverCapacity ? 'bg-red-600' :
                                                                    utilization > 80 ? 'bg-yellow-500' : 'bg-green-500'}`, style: { width: `${Math.min(utilization, 100)}%` } }) })] }) }, member.name));
                                        }) }) })] })] })) : (_jsx("div", { className: "p-6 text-center text-gray-500", children: "Failed to load project statistics" }))] }) }));
};
export default ProjectStatsModal;
