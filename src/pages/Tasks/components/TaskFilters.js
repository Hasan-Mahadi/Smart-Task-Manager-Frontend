import { jsx as _jsx } from "react/jsx-runtime";
// // src/pages/Tasks/components/TaskFilters.tsx
// import React, { useState } from 'react';
// import { Filter, X } from 'lucide-react';
// import { TaskPriority, TaskStatus, Project, Team } from '../../../types';
// interface TaskFiltersProps {
//   projects: Project[];
//   teams: Team[];
//   filters: {
//     projectId?: string;
//     member?: string;
//     status?: TaskStatus;
//     priority?: TaskPriority;
//   };
//   onFiltersChange: (filters: any) => void;
// }
// const TaskFilters: React.FC<TaskFiltersProps> = ({
//   projects,
//   teams,
//   filters,
//   onFiltersChange,
// }) => {
//   const [isFiltersOpen, setIsFiltersOpen] = useState(false);
//   const allMembers = teams.flatMap(team => 
//     team.members.map(member => member.name)
//   );
//   const uniqueMembers = Array.from(new Set(allMembers));
//   const updateFilter = (key: string, value: string | undefined) => {
//     const newFilters = { ...filters };
//     if (value) {
//       newFilters[key as keyof typeof filters] = value as any;
//     } else {
//       delete newFilters[key as keyof typeof filters];
//     }
//     onFiltersChange(newFilters);
//   };
//   const clearAllFilters = () => {
//     onFiltersChange({});
//   };
//   const hasActiveFilters = Object.keys(filters).length > 0;
//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsFiltersOpen(!isFiltersOpen)}
//         className={`flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50 ${
//           hasActiveFilters 
//             ? 'border-primary-500 bg-primary-50 text-primary-700' 
//             : 'border-gray-300 text-gray-700'
//         }`}
//       >
//         <Filter className="w-4 h-4 mr-2" />
//         Filters
//         {hasActiveFilters && (
//           <span className="ml-2 bg-primary-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
//             {Object.keys(filters).length}
//           </span>
//         )}
//       </button>
//       {isFiltersOpen && (
//         <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-10">
//           <div className="p-4">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-medium text-gray-900">Filters</h3>
//               <div className="flex items-center space-x-2">
//                 {hasActiveFilters && (
//                   <button
//                     onClick={clearAllFilters}
//                     className="text-sm text-primary-600 hover:text-primary-700"
//                   >
//                     Clear all
//                   </button>
//                 )}
//                 <button
//                   onClick={() => setIsFiltersOpen(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//             <div className="space-y-4">
//               {/* Project Filter */}
//               <div>
//                 <label htmlFor="project-select" className="block text-sm font-medium text-gray-700 mb-2">
//                   Project
//                 </label>
//                 <select
//                   id="project-select"
//                   value={filters.projectId || ''}
//                   onChange={(e) => updateFilter('projectId', e.target.value || undefined)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 >
//                   <option value="">All Projects</option>
//                   {projects.map(project => (
//                     <option key={project._id} value={project._id}>
//                       {project.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               {/* Member Filter */}
//               <div>
//                 <label htmlFor="member-select" className="block text-sm font-medium text-gray-700 mb-2">
//                   Assignee
//                 </label>
//                 <select
//                   id="member-select"
//                   value={filters.member || ''}
//                   onChange={(e) => updateFilter('member', e.target.value || undefined)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 >
//                   <option value="">All Members</option>
//                   {uniqueMembers.map(member => (
//                     <option key={member} value={member}>
//                       {member}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               {/* Status Filter */}
//               <div>
//                 <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-2">
//                   Status
//                 </label>
//                 <select
//                   id="status-select"
//                   value={filters.status || ''}
//                   onChange={(e) => updateFilter('status', e.target.value || undefined)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 >
//                   <option value="">All Statuses</option>
//                   <option value="Pending">Pending</option>
//                   <option value="In Progress">In Progress</option>
//                   <option value="Done">Done</option>
//                 </select>
//               </div>
//               {/* Priority Filter */}
//               <div>
//                 <label htmlFor="priority-select" className="block text-sm font-medium text-gray-700 mb-2">
//                   Priority
//                 </label>
//                 <select
//                   id="priority-select"
//                   value={filters.priority || ''}
//                   onChange={(e) => updateFilter('priority', e.target.value || undefined)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//                 >
//                   <option value="">All Priorities</option>
//                   <option value="Low">Low</option>
//                   <option value="Medium">Medium</option>
//                   <option value="High">High</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// export default TaskFilters;
const TaskFilters = () => {
    return (_jsx("div", { children: "ss" }));
};
export default TaskFilters;
