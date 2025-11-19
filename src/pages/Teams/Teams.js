import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Teams/Teams.tsx
import { useState } from 'react';
import { Plus, Users, Edit2, Trash2 } from 'lucide-react';
import { useTeams } from '../../hooks/useTeams';
import CreateTeamModal from './components/CreateTeamModal';
import EditTeamModal from './components/EditTeamModal';
import toast from 'react-hot-toast';
const Teams = () => {
    const { teams, loading, error, createTeam, deleteTeam, fetchTeams } = useTeams();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const handleCreateTeam = async (teamData) => {
        try {
            await createTeam(teamData);
            setIsCreateModalOpen(false);
        }
        catch (error) {
            // Error handled in the hook
        }
    };
    const handleUpdateTeam = async (teamData) => {
        if (!editingTeam)
            return;
        try {
            // The hook doesn't expose updateTeam; perform the update request here and then refresh via fetchTeams.
            const res = await fetch(`/api/teams/${editingTeam._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(teamData),
            });
            if (!res.ok) {
                const message = await res.text();
                toast.error(`Failed to update team: ${message}`);
                return;
            }
            if (typeof fetchTeams === 'function') {
                await fetchTeams();
            }
            toast.success('Team updated');
            setEditingTeam(null);
        }
        catch (error) {
            toast.error('Failed to update team');
        }
    };
    const handleDeleteTeam = async (teamId) => {
        if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
            try {
                await deleteTeam(teamId);
            }
            catch (error) {
                // Error handled in the hook
            }
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Teams" }), _jsx("p", { className: "text-gray-600", children: "Manage your teams and team members" })] }), _jsxs("button", { onClick: () => setIsCreateModalOpen(true), className: "flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Create Team"] })] }), teams.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Users, { className: "w-24 h-24 text-gray-300 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No teams yet" }), _jsx("p", { className: "text-gray-500 mb-4", children: "Create your first team to get started with project management." }), _jsxs("button", { onClick: () => setIsCreateModalOpen(true), className: "inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Create Team"] })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: teams.map(team => (_jsx("div", { className: "bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: team.name }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { type: "button", onClick: () => setEditingTeam(team), className: "p-1 text-gray-400 hover:text-gray-600", "aria-label": `Edit ${team.name}`, title: `Edit ${team.name}`, children: _jsx(Edit2, { className: "w-4 h-4" }) }), _jsx("button", { type: "button", onClick: () => handleDeleteTeam(team._id), className: "p-1 text-gray-400 hover:text-red-600", "aria-label": `Delete ${team.name}`, title: `Delete ${team.name}`, children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }), _jsx("div", { className: "space-y-3", children: team.members.map(member => {
                                    const isOverCapacity = member.currentTasks > member.capacity;
                                    return (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: member.name }), _jsx("p", { className: "text-sm text-gray-600", children: member.role })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: `text-sm font-medium ${isOverCapacity ? 'text-red-600' : 'text-gray-900'}`, children: [member.currentTasks, " / ", member.capacity] }), _jsx("p", { className: "text-xs text-gray-500", children: "tasks" })] })] }, member.name));
                                }) }), _jsxs("div", { className: "mt-4 pt-4 border-t border-gray-200", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600", children: [_jsx("span", { children: "Total Capacity" }), _jsx("span", { className: "font-medium", children: team.members.reduce((sum, member) => sum + member.capacity, 0) })] }), _jsxs("div", { className: "flex justify-between text-sm text-gray-600", children: [_jsx("span", { children: "Current Load" }), _jsx("span", { className: "font-medium", children: team.members.reduce((sum, member) => sum + member.currentTasks, 0) })] })] })] }) }, team._id))) })), _jsx(CreateTeamModal, { isOpen: isCreateModalOpen, onClose: () => setIsCreateModalOpen(false), onSubmit: handleCreateTeam }), editingTeam && (_jsx(EditTeamModal, { team: editingTeam, isOpen: !!editingTeam, onClose: () => setEditingTeam(null), onSubmit: handleUpdateTeam }))] }));
};
export default Teams;
