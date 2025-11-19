import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Dashboard/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Folder, CheckSquare, Users, AlertTriangle, RefreshCw, Activity } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useTeams } from '../../hooks/useTeams';
import { projectsAPI } from '../../services/api';
import toast from 'react-hot-toast';
const Dashboard = () => {
    const { tasks, reassignTasks } = useTasks();
    const { teams } = useTeams();
    const [projects, setProjects] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reassigning, setReassigning] = useState(false);
    useEffect(() => {
        fetchDashboardData();
    }, []);
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [projectsResponse, activityResponse] = await Promise.all([
                projectsAPI.getProjects(),
                // This would be your activity logs API
                Promise.resolve({ logs: [] }) // Placeholder
            ]);
            setProjects(projectsResponse.projects);
            setRecentActivity(activityResponse.logs);
        }
        catch (error) {
            toast.error('Failed to load dashboard data');
        }
        finally {
            setLoading(false);
        }
    };
    const handleReassignTasks = async () => {
        try {
            setReassigning(true);
            const reassignments = await reassignTasks();
            if (reassignments.length > 0) {
                toast.success(`Reassigned ${reassignments.length} tasks successfully`);
            }
            else {
                toast.success('All tasks are properly assigned');
            }
            await fetchDashboardData(); // Refresh data
        }
        catch (error) {
            toast.error('Failed to reassign tasks');
        }
        finally {
            setReassigning(false);
        }
    };
    const stats = {
        totalProjects: projects.length,
        totalTasks: tasks.length,
        pendingTasks: tasks.filter(task => task.status === 'Pending').length,
        inProgressTasks: tasks.filter(task => task.status === 'In Progress').length,
        completedTasks: tasks.filter(task => task.status === 'Done').length,
    };
    const overloadedMembers = teams.flatMap(team => team.members.filter(member => member.currentTasks > member.capacity));
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Dashboard" }), _jsx("p", { className: "text-gray-600", children: "Overview of your projects and team workload" })] }), _jsxs("button", { onClick: handleReassignTasks, disabled: reassigning, className: "flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(RefreshCw, { className: `w-4 h-4 mr-2 ${reassigning ? 'animate-spin' : ''}` }), reassigning ? 'Reassigning...' : 'Reassign Tasks'] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsx("div", { className: "bg-white p-6 rounded-lg shadow-sm border", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-blue-100 rounded-lg", children: _jsx(Folder, { className: "w-6 h-6 text-blue-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Projects" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stats.totalProjects })] })] }) }), _jsx("div", { className: "bg-white p-6 rounded-lg shadow-sm border", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-green-100 rounded-lg", children: _jsx(CheckSquare, { className: "w-6 h-6 text-green-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Tasks" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stats.totalTasks })] })] }) }), _jsx("div", { className: "bg-white p-6 rounded-lg shadow-sm border", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-purple-100 rounded-lg", children: _jsx(Users, { className: "w-6 h-6 text-purple-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Team Members" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: teams.reduce((acc, team) => acc + team.members.length, 0) })] })] }) }), _jsx("div", { className: "bg-white p-6 rounded-lg shadow-sm border", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-2 bg-red-100 rounded-lg", children: _jsx(AlertTriangle, { className: "w-6 h-6 text-red-600" }) }), _jsxs("div", { className: "ml-4", children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Overloaded" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: overloadedMembers.length })] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm border", children: [_jsx("div", { className: "p-6 border-b", children: _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Team Workload" }) }), _jsx("div", { className: "p-6", children: _jsx("div", { className: "space-y-4", children: teams.map(team => (_jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900 mb-3", children: team.name }), _jsx("div", { className: "space-y-3", children: team.members.map(member => {
                                                    const isOverCapacity = member.currentTasks > member.capacity;
                                                    const utilization = (member.currentTasks / member.capacity) * 100;
                                                    return (_jsx("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "font-medium text-gray-900", children: member.name }), _jsxs("span", { className: `text-sm ${isOverCapacity ? 'text-red-600' : 'text-gray-600'}`, children: [member.currentTasks, " / ", member.capacity] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: `h-2 rounded-full ${isOverCapacity ? 'bg-red-600' :
                                                                            utilization > 80 ? 'bg-yellow-500' : 'bg-green-500'}`, style: { width: `${Math.min(utilization, 100)}%` } }) }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500 mt-1", children: [_jsx("span", { children: member.role }), isOverCapacity && (_jsxs("span", { className: "text-red-600 flex items-center", children: [_jsx(AlertTriangle, { className: "w-3 h-3 mr-1" }), "Over capacity"] }))] })] }) }, member.name));
                                                }) })] }, team._id))) }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-sm border", children: [_jsx("div", { className: "p-6 border-b", children: _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Task Status" }) }), _jsx("div", { className: "p-6", children: _jsxs("div", { className: "grid grid-cols-3 gap-4 text-center", children: [_jsxs("div", { className: "p-4 bg-yellow-50 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-yellow-600", children: stats.pendingTasks }), _jsx("div", { className: "text-sm text-yellow-700", children: "Pending" })] }), _jsxs("div", { className: "p-4 bg-blue-50 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: stats.inProgressTasks }), _jsx("div", { className: "text-sm text-blue-700", children: "In Progress" })] }), _jsxs("div", { className: "p-4 bg-green-50 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: stats.completedTasks }), _jsx("div", { className: "text-sm text-green-700", children: "Completed" })] })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border", children: [_jsx("div", { className: "p-6 border-b", children: _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Recent Activity" }) }), _jsx("div", { className: "p-6", children: recentActivity.length > 0 ? (_jsx("div", { className: "space-y-4", children: recentActivity.map((activity, index) => (_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Activity, { className: "w-5 h-5 text-gray-400" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm text-gray-900", children: activity.details }), _jsx("p", { className: "text-xs text-gray-500", children: new Date(activity.timestamp).toLocaleString() })] })] }, index))) })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx(Activity, { className: "w-12 h-12 text-gray-300 mx-auto mb-3" }), _jsx("p", { className: "text-gray-500", children: "No recent activity" })] })) })] })] })] })] }));
};
export default Dashboard;
