
import React, { useState } from 'react';
import { Plus, Users, Edit2, Trash2, UserPlus } from 'lucide-react';
import { useTeams } from '../../hooks/useTeams';
import { Team, TeamMember } from '../../types';
import CreateTeamModal from './components/CreateTeamModal';
import EditTeamModal from './components/EditTeamModal';
import toast from 'react-hot-toast';

const Teams: React.FC = () => {
  const { teams, loading, error, createTeam, deleteTeam, fetchTeams } = useTeams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const handleCreateTeam = async (teamData: { name: string; members: Omit<TeamMember, 'currentTasks'>[] }) => {
    try {
      await createTeam(teamData);
      setIsCreateModalOpen(false);
    } catch (error) {
      // Error handled in the hook
    }
  };

  const handleUpdateTeam = async (teamData: { name: string; members: Omit<TeamMember, 'currentTasks'>[] }) => {
    if (!editingTeam) return;

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
    } catch (error) {
      toast.error('Failed to update team');
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      try {
        await deleteTeam(teamId);
      } catch (error) {
        // Error handled in the hook
      }
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600">Manage your teams and team members</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </button>
      </div>

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No teams yet</h3>
          <p className="text-gray-500 mb-4">Create your first team to get started with project management.</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => (
            <div key={team._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingTeam(team)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      aria-label={`Edit ${team.name}`}
                      title={`Edit ${team.name}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTeam(team._id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      aria-label={`Delete ${team.name}`}
                      title={`Delete ${team.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {team.members.map(member => {
                    const isOverCapacity = member.currentTasks > member.capacity;
                    
                    return (
                      <div key={member.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            isOverCapacity ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {member.currentTasks} / {member.capacity}
                          </p>
                          <p className="text-xs text-gray-500">tasks</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Total Capacity</span>
                    <span className="font-medium">
                      {team.members.reduce((sum, member) => sum + member.capacity, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Current Load</span>
                    <span className="font-medium">
                      {team.members.reduce((sum, member) => sum + member.currentTasks, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTeam}
      />

      {editingTeam && (
        <EditTeamModal
          team={editingTeam}
          isOpen={!!editingTeam}
          onClose={() => setEditingTeam(null)}
          onSubmit={handleUpdateTeam}
        />
      )}
    </div>
  );
};

export default Teams;