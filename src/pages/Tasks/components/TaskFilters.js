// import { useState } from 'react';
// import { Filter, X } from 'lucide-react';

// type FilterKeys = 'projectId' | 'member' | 'status' | 'priority';

// export interface TaskFilter {
//   projectId?: string;
//   member?: string;
//   status?: string;
//   priority?: string;
// }

// interface Project {
//   _id: string;
//   name: string;
// }

// interface TeamMember {
//   name: string;
// }

// interface Team {
//   members: TeamMember[];
// }

// interface TaskFiltersProps {
//   projects: Project[];
//   teams: Team[];
//   filters: TaskFilter;
//   onFiltersChange: (filters: TaskFilter) => void;
// }

// const TaskFilters = ({
//   projects,
//   teams,
//   filters,
//   onFiltersChange
// }: TaskFiltersProps) => {
//   const [isFiltersOpen, setIsFiltersOpen] = useState(false);

//   const allMembers = teams.flatMap(team => team.members.map(m => m.name));
//   const uniqueMembers = Array.from(new Set(allMembers));

//   const updateFilter = (key: FilterKeys, value?: string) => {
//     const newFilters: TaskFilter = { ...filters };

//     if (value) {
//       newFilters[key] = value;
//     } else {
//       delete newFilters[key];
//     }

//     onFiltersChange(newFilters);
//   };

//   const clearAllFilters = () => {
//     onFiltersChange({});
//   };

//   const hasActiveFilters = Object.keys(filters).length > 0;

//   return (
//     <div className="relative">
//       {/* Button */}
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

//             {/* Header */}
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

//             {/* Body */}
//             <div className="space-y-4">

//               {/* Project Filter */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Project
//                 </label>

//                 <select
//                   value={filters.projectId || ''}
//                   onChange={e =>
//                     updateFilter('projectId', e.target.value || undefined)
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Assignee
//                 </label>

//                 <select
//                   value={filters.member || ''}
//                   onChange={e =>
//                     updateFilter('member', e.target.value || undefined)
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Status
//                 </label>

//                 <select
//                   value={filters.status || ''}
//                   onChange={e =>
//                     updateFilter('status', e.target.value || undefined)
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
//                 >
//                   <option value="">All Statuses</option>
//                   <option value="Pending">Pending</option>
//                   <option value="In Progress">In Progress</option>
//                   <option value="Done">Done</option>
//                 </select>
//               </div>

//               {/* Priority Filter */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Priority
//                 </label>

//                 <select
//                   value={filters.priority || ''}
//                   onChange={e =>
//                     updateFilter('priority', e.target.value || undefined)
//                   }
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
