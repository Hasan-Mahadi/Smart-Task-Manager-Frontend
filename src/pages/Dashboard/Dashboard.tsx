// src/pages/Dashboard/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  CheckSquare, 
  Users, 
  AlertTriangle,
  RefreshCw,
  Activity
} from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { useTeams } from '../../hooks/useTeams';
import { projectsAPI } from '../../services/api';
import { Project, ActivityLog } from '../../types';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { tasks, reassignTasks } = useTasks();
  const { teams } = useTeams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
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
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleReassignTasks = async () => {
    try {
      setReassigning(true);
      const reassignments = await reassignTasks();
      if (reassignments.length > 0) {
        toast.success(`Reassigned ${reassignments.length} tasks successfully`);
      } else {
        toast.success('All tasks are properly assigned');
      }
      await fetchDashboardData(); // Refresh data
    } catch (error) {
      toast.error('Failed to reassign tasks');
    } finally {
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

  const overloadedMembers = teams.flatMap(team => 
    team.members.filter(member => member.currentTasks > member.capacity)
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your projects and team workload</p>
        </div>
        <button
          onClick={handleReassignTasks}
          disabled={reassigning}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${reassigning ? 'animate-spin' : ''}`} />
          {reassigning ? 'Reassigning...' : 'Reassign Tasks'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Folder className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {teams.reduce((acc, team) => acc + team.members.length, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overloaded</p>
              <p className="text-2xl font-bold text-gray-900">{overloadedMembers.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Summary */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Team Workload</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {teams.map(team => (
                <div key={team._id}>
                  <h3 className="font-medium text-gray-900 mb-3">{team.name}</h3>
                  <div className="space-y-3">
                    {team.members.map(member => {
                      const isOverCapacity = member.currentTasks > member.capacity;
                      const utilization = (member.currentTasks / member.capacity) * 100;
                      
                      return (
                        <div key={member.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900">{member.name}</span>
                              <span className={`text-sm ${isOverCapacity ? 'text-red-600' : 'text-gray-600'}`}>
                                {member.currentTasks} / {member.capacity}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  isOverCapacity ? 'bg-red-600' : 
                                  utilization > 80 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(utilization, 100)}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>{member.role}</span>
                              {isOverCapacity && (
                                <span className="text-red-600 flex items-center">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Over capacity
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity & Task Status */}
        <div className="space-y-6">
          {/* Task Status */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Task Status</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{stats.pendingTasks}</div>
                  <div className="text-sm text-yellow-700">Pending</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.inProgressTasks}</div>
                  <div className="text-sm text-blue-700">In Progress</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
                  <div className="text-sm text-green-700">Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Reassignments */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Activity className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.details}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;