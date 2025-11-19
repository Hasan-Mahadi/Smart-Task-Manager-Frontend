import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Tasks/components/TaskFilters.tsx
import { useState } from 'react';
import { Filter, X } from 'lucide-react';
const TaskFilters = ({ projects, teams, filters, onFiltersChange, }) => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const allMembers = teams.flatMap(team => team.members.map(member => member.name));
    const uniqueMembers = Array.from(new Set(allMembers));
    const updateFilter = (key, value) => {
        const newFilters = { ...filters };
        if (value) {
            newFilters[key] = value;
        }
        else {
            delete newFilters[key];
        }
        onFiltersChange(newFilters);
    };
    const clearAllFilters = () => {
        onFiltersChange({});
    };
    const hasActiveFilters = Object.keys(filters).length > 0;
    return (_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setIsFiltersOpen(!isFiltersOpen), className: `flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 ${hasActiveFilters
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 text-gray-700'}`, children: [_jsx(Filter, { className: "w-4 h-4 mr-2" }), "Filters", hasActiveFilters && (_jsx("span", { className: "ml-2 bg-primary-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center", children: Object.keys(filters).length }))] }), isFiltersOpen && (_jsx("div", { className: "absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-10", children: _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Filters" }), _jsxs("div", { className: "flex items-center space-x-2", children: [hasActiveFilters && (_jsx("button", { onClick: clearAllFilters, className: "text-sm text-primary-600 hover:text-primary-700", children: "Clear all" })), _jsx("button", { onClick: () => setIsFiltersOpen(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "project-select", className: "block text-sm font-medium text-gray-700 mb-2", children: "Project" }), _jsxs("select", { id: "project-select", value: filters.projectId || '', onChange: (e) => updateFilter('projectId', e.target.value || undefined), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", children: [_jsx("option", { value: "", children: "All Projects" }), projects.map(project => (_jsx("option", { value: project._id, children: project.name }, project._id)))] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "member-select", className: "block text-sm font-medium text-gray-700 mb-2", children: "Assignee" }), _jsxs("select", { id: "member-select", value: filters.member || '', onChange: (e) => updateFilter('member', e.target.value || undefined), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", children: [_jsx("option", { value: "", children: "All Members" }), uniqueMembers.map(member => (_jsx("option", { value: member, children: member }, member)))] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "status-select", className: "block text-sm font-medium text-gray-700 mb-2", children: "Status" }), _jsxs("select", { id: "status-select", value: filters.status || '', onChange: (e) => updateFilter('status', e.target.value || undefined), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", children: [_jsx("option", { value: "", children: "All Statuses" }), _jsx("option", { value: "Pending", children: "Pending" }), _jsx("option", { value: "In Progress", children: "In Progress" }), _jsx("option", { value: "Done", children: "Done" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "priority-select", className: "block text-sm font-medium text-gray-700 mb-2", children: "Priority" }), _jsxs("select", { id: "priority-select", value: filters.priority || '', onChange: (e) => updateFilter('priority', e.target.value || undefined), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", children: [_jsx("option", { value: "", children: "All Priorities" }), _jsx("option", { value: "Low", children: "Low" }), _jsx("option", { value: "Medium", children: "Medium" }), _jsx("option", { value: "High", children: "High" })] })] })] })] }) }))] }));
};
export default TaskFilters;
