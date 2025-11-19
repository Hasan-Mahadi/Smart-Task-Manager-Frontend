// // src/pages/Projects/components/CreateProjectModal.tsx
// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { X } from 'lucide-react';
// import { Team } from '../../../types';

// interface CreateProjectModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (data: { name: string; description: string; teamId: string }) => void;
//   teams: Team[];
// }

// interface FormData {
//   name: string;
//   description: string;
//   teamId: string;
// }

// const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   teams,
// }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm<FormData>();

//   const handleFormSubmit = (data: FormData) => {
//     onSubmit(data);
//     reset();
//   };

//   const handleClose = () => {
//     reset();
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-md w-full">
//         <div className="flex justify-between items-center p-6 border-b">
//           <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
//           <button
//             onClick={handleClose}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//               Project Name *
//             </label>
//             <input
//               {...register('name', { required: 'Project name is required' })}
//               type="text"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//               placeholder="Enter project name"
//             />
//             {errors.name && (
//               <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//               Description
//             </label>
//             <textarea
//               {...register('description')}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//               placeholder="Enter project description"
//             />
//           </div>

//           <div>
//             <label htmlFor="teamId" className="block text-sm font-medium text-gray-700 mb-2">
//               Team *
//             </label>
//             <select
//               {...register('teamId', { required: 'Please select a team' })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//             >
//               <option value="">Select a team</option>
//               {teams.map(team => (
//                 <option key={team._id} value={team._id}>
//                   {team.name} ({team.members.length} members)
//                 </option>
//               ))}
//             </select>
//             {errors.teamId && (
//               <p className="mt-1 text-sm text-red-600">{errors.teamId.message}</p>
//             )}
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={handleClose}
//               className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
//             >
//               {isSubmitting ? 'Creating...' : 'Create Project'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateProjectModal;



// src/pages/Projects/components/CreateProjectModal.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Users, AlertCircle } from 'lucide-react';
import { Team } from '../../../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; teamId: string }) => void;
  teams: Team[];
}

interface FormData {
  name: string;
  description: string;
  teamId: string;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  teams,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormData>();

  const selectedTeamId = watch('teamId');
  const selectedTeam = teams.find(team => team._id === selectedTeamId);

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              {...register('name', { required: 'Project name is required' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter project name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter project description"
            />
          </div>

          <div>
            <label htmlFor="teamId" className="block text-sm font-medium text-gray-700 mb-2">
              Team *
            </label>
            {teams.length === 0 ? (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                  <span className="text-sm text-yellow-700">No teams available. Please create a team first.</span>
                </div>
              </div>
            ) : (
              <>
                <select
                  {...register('teamId', { required: 'Please select a team' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select a team</option>
                  {teams.map(team => (
                    <option key={team._id} value={team._id}>
                      {team.name} ({team.members.length} members)
                    </option>
                  ))}
                </select>
                {errors.teamId && (
                  <p className="mt-1 text-sm text-red-600">{errors.teamId.message}</p>
                )}
              </>
            )}
          </div>

          {/* Team Info Preview */}
          {selectedTeam && (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Team</h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{selectedTeam.name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {selectedTeam.members.length} team members
                </div>
                <div className="text-xs text-gray-500">
                  Capacity: {selectedTeam.members.reduce((sum, m) => sum + m.capacity, 0)} total tasks
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || teams.length === 0}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;