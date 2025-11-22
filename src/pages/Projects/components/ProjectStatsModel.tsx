
import React, { useState, useEffect } from 'react';
import { X, Users, CheckCircle, Clock, PlayCircle, AlertTriangle } from 'lucide-react';
import { Project } from '../../../types';
import { projectsAPI } from '../../../services/api';

interface ProjectStatsModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectStats {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  completionRate: number;
  memberWorkload: Array<{
    name: string;
    role: string;
    assignedTasks: number;
    capacity: number;
    isOverCapacity: boolean;
  }>;
}

const ProjectStatsModal: React.FC<ProjectStatsModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const [stats, setStats] = useState<ProjectStats | null>(null);
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
    } catch (error) {
      console.error('Failed to fetch project stats');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Project Statistics - {project.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : stats ? (
          <div className="p-6 space-y-6">
            {/* Overall Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{stats.totalTasks}</div>
                <div className="text-sm text-blue-700">Total Tasks</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingTasks}</div>
                <div className="text-sm text-yellow-700">Pending</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{stats.inProgressTasks}</div>
                <div className="text-sm text-blue-700">In Progress</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{stats.doneTasks}</div>
                <div className="text-sm text-green-700">Completed</div>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Completion Rate</span>
                  <span>{stats.completionRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${stats.completionRate}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{stats.doneTasks} of {stats.totalTasks} tasks completed</span>
                  <span>{stats.pendingTasks + stats.inProgressTasks} remaining</span>
                </div>
              </div>
            </div>

            {/* Team Workload */}
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Team Workload</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.memberWorkload.map(member => {
                    const utilization = (member.assignedTasks / member.capacity) * 100;
                    
                    return (
                      <div key={member.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-medium text-gray-900">{member.name}</span>
                              <span className="text-sm text-gray-600 ml-2">({member.role})</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-medium ${
                                member.isOverCapacity ? 'text-red-600' : 'text-gray-900'
                              }`}>
                                {member.assignedTasks} / {member.capacity}
                              </span>
                              {member.isOverCapacity && (
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                member.isOverCapacity ? 'bg-red-600' : 
                                utilization > 80 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(utilization, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            Failed to load project statistics
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectStatsModal;