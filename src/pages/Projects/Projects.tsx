// // src/pages/Projects/Projects.tsx
// import React, { useState, useEffect } from 'react';
// import { Plus, Folder, Users, Edit2, Trash2, BarChart3 } from 'lucide-react';
// import { useTeams } from '../../hooks/useTeams';
// import { Project, Team } from '../../types';
// import { projectsAPI } from '../../services/api';
// import CreateProjectModal from './components/CreateProjectModal';
// import EditProjectModal from './components/EditProjectModal';
// import ProjectStatsModal from './components/ProjectStatsModel';
// import toast from 'react-hot-toast';

// const Projects: React.FC = () => {
//   const { teams } = useTeams();
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [editingProject, setEditingProject] = useState<Project | null>(null);
//   const [statsProject, setStatsProject] = useState<Project | null>(null);

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     try {
//       setLoading(true);
//       const response = await projectsAPI.getProjects();
//       setProjects(response.projects);
//     } catch (error) {
//       toast.error('Failed to load projects');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateProject = async (projectData: { name: string; description: string; teamId: string }) => {
//     try {
//       const response = await projectsAPI.createProject(projectData);
//       setProjects(prev => [...prev, response.project]);
//       setIsCreateModalOpen(false);
//       toast.success('Project created successfully');
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Failed to create project');
//     }
//   };

//   const handleUpdateProject = async (projectData: { name: string; description: string }) => {
//     if (!editingProject) return;
    
//     try {
//       const response = await projectsAPI.updateProject(editingProject._id, projectData);
//       setProjects(prev => prev.map(p => p._id === editingProject._id ? response.project : p));
//       setEditingProject(null);
//       toast.success('Project updated successfully');
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Failed to update project');
//     }
//   };

//   const handleDeleteProject = async (projectId: string) => {
//     if (window.confirm('Are you sure you want to delete this project? All associated tasks will also be deleted.')) {
//       try {
//         await projectsAPI.deleteProject(projectId);
//         setProjects(prev => prev.filter(p => p._id !== projectId));
//         toast.success('Project deleted successfully');
//       } catch (error: any) {
//         toast.error(error.response?.data?.message || 'Failed to delete project');
//       }
//     }
//   };

//   const getTeamName = (teamId: string) => {
//     const team = teams.find(t => t._id === teamId);
//     return team?.name || 'Unknown Team';
//   };

//   const getTeamMembersCount = (teamId: string) => {
//     const team = teams.find(t => t._id === teamId);
//     return team?.members.length || 0;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
//           <p className="text-gray-600">Manage your projects and their associated teams</p>
//         </div>
//         <button
//           onClick={() => setIsCreateModalOpen(true)}
//           className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           Create Project
//         </button>
//       </div>

//       {/* Projects Grid */}
//       {projects.length === 0 ? (
//         <div className="text-center py-12">
//           <Folder className="w-24 h-24 text-gray-300 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
//           <p className="text-gray-500 mb-4">Create your first project to start managing tasks.</p>
//           <button
//             onClick={() => setIsCreateModalOpen(true)}
//             className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Create Project
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {projects.map(project => (
//             <div key={project._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => setStatsProject(project)}
//                       className="p-1 text-gray-400 hover:text-blue-600"
//                       title="View Stats"
//                     >
//                       <BarChart3 className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() => setEditingProject(project)}
//                       className="p-1 text-gray-400 hover:text-gray-600"
//                     >
//                       <Edit2 className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() => handleDeleteProject(project._id)}
//                       className="p-1 text-gray-400 hover:text-red-600"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 {project.description && (
//                   <p className="text-gray-600 mb-4">{project.description}</p>
//                 )}

//                 <div className="space-y-3">
//                   <div className="flex items-center text-sm text-gray-600">
//                     <Users className="w-4 h-4 mr-2" />
//                     <span>{getTeamName(project.teamId)}</span>
//                     <span className="mx-2">•</span>
//                     <span>{getTeamMembersCount(project.teamId)} members</span>
//                   </div>

//                   <div className="flex items-center text-sm text-gray-600">
//                     <Folder className="w-4 h-4 mr-2" />
//                     <span>{project.tasks?.length || 0} tasks</span>
//                   </div>
//                 </div>

//                 <div className="mt-4 pt-4 border-t border-gray-200">
//                   <div className="text-xs text-gray-500">
//                     Created {new Date(project.createdAt).toLocaleDateString()}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modals */}
//       <CreateProjectModal
//         isOpen={isCreateModalOpen}
//         onClose={() => setIsCreateModalOpen(false)}
//         onSubmit={handleCreateProject}
//         teams={teams}
//       />

//       {editingProject && (
//         <EditProjectModal
//           project={editingProject}
//           isOpen={!!editingProject}
//           onClose={() => setEditingProject(null)}
//           onSubmit={handleUpdateProject}
//         />
//       )}

//       {statsProject && (
//         <ProjectStatsModal
//           project={statsProject}
//           isOpen={!!statsProject}
//           onClose={() => setStatsProject(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default Projects;


// src/pages/Projects/Projects.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Folder, Users, Edit2, Trash2, BarChart3, RefreshCw } from 'lucide-react';
import { useTeams } from '../../hooks/useTeams';
import { useProjects } from '../../hooks/useProjects';
import { Project } from '../../types';
import CreateProjectModal from './components/CreateProjectModal';
import EditProjectModal from './components/EditProjectModal';
import ProjectStatsModal from './components/ProjectStatsModel';
import toast from 'react-hot-toast';

const Projects: React.FC = () => {
  const { teams, loading: teamsLoading, refetch: refetchTeams } = useTeams();
  const { projects, loading: projectsLoading, createProject, updateProject, deleteProject, refetch: refetchProjects } = useProjects();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [statsProject, setStatsProject] = useState<Project | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await Promise.all([refetchTeams(), refetchProjects()]);
      toast.success('Data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateProject = async (projectData: { name: string; description: string; teamId: string }) => {
    try {
      await createProject(projectData);
      setIsCreateModalOpen(false);
      // Refresh teams to get updated member counts
      await refetchTeams();
    } catch (error) {
      // Error handled in the hook
    }
  };

  const handleUpdateProject = async (projectData: { name: string; description: string }) => {
    if (!editingProject) return;
    
    try {
      await updateProject(editingProject._id, projectData);
      setEditingProject(null);
    } catch (error) {
      // Error handled in the hook
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? All associated tasks will also be deleted.')) {
      try {
        await deleteProject(projectId);
        // Refresh teams to update member counts
        await refetchTeams();
      } catch (error) {
        // Error handled in the hook
      }
    }
  };

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t._id === teamId);
    return team?.name || 'Loading...';
  };

  const getTeamMembersCount = (teamId: string) => {
    const team = teams.find(t => t._id === teamId);
    return team ? team.members.length : 0;
  };

  const isLoading = teamsLoading || projectsLoading;

  if (isLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage your projects and their associated teams</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </button>
        </div>
      </div>

      {/* Error State */}
      {teams.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-yellow-800">No Teams Available</h3>
              <p className="text-yellow-700 mt-1">
                You need to create a team before you can create projects. 
                <a href="/teams" className="ml-1 text-yellow-800 underline font-medium">Create a team first</a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <Folder className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">
            {teams.length === 0 
              ? 'Create a team first, then you can create projects.' 
              : 'Create your first project to start managing tasks.'
            }
          </p>
          {teams.length > 0 && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => {
            const team = teams.find(t => t._id === project.teamId);
            
            return (
              <div key={project._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setStatsProject(project)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="View Stats"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingProject(project)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project._id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {project.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{team ? team.name : 'Loading team...'}</span>
                      <span className="mx-2">•</span>
                      <span>{team ? `${team.members.length} members` : 'Loading...'}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Folder className="w-4 h-4 mr-2" />
                      <span>{project.tasks?.length || 0} tasks</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
        teams={teams}
      />

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          onSubmit={handleUpdateProject}
        />
      )}

      {statsProject && (
        <ProjectStatsModal
          project={statsProject}
          isOpen={!!statsProject}
          onClose={() => setStatsProject(null)}
        />
      )}
    </div>
  );
};

export default Projects;