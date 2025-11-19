// src/pages/Teams/components/CreateTeamModal.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Trash2 } from 'lucide-react';
import { CreateTeamFormData, TeamMember } from '../../../types';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; members: Omit<TeamMember, 'currentTasks'>[] }) => void;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<CreateTeamFormData>();

  const [members, setMembers] = useState<Omit<TeamMember, 'currentTasks'>[]>([
    { name: '', role: '', capacity: 3 },
  ]);

  const addMember = () => {
    setMembers([...members, { name: '', role: '', capacity: 3 }]);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string | number) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setMembers(updatedMembers);
  };

  const handleFormSubmit = (data: { name: string }) => {
    // Validate members
    const validMembers = members.filter(member => 
      member.name.trim() && member.role.trim() && member.capacity > 0
    );

    if (validMembers.length === 0) {
      alert('Please add at least one team member');
      return;
    }

    onSubmit({
      name: data.name,
      members: validMembers,
    });
    reset();
    setMembers([{ name: '', role: '', capacity: 3 }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create New Team</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Team Name
            </label>
            <input
              {...register('name', { required: 'Team name is required' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter team name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Team Members
              </label>
              <button
                type="button"
                onClick={addMember}
                className="flex items-center text-sm text-primary-600 hover:text-primary-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Member
              </button>
            </div>

            <div className="space-y-4">
              {members.map((member, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-700">Member {index + 1}</h4>
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateMember(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Member name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Role</label>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => updateMember(index, 'role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Role"
                    />
                  </div>

                  <div>
                    <label htmlFor={`capacity-${index}`} className="block text-xs text-gray-600 mb-1">Capacity (0-5)</label>
                    <select
                      id={`capacity-${index}`}
                      aria-label={`Capacity for member ${index + 1}`}
                      value={member.capacity}
                      onChange={(e) => updateMember(index, 'capacity', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {[0, 1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>
                          {num} tasks
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamModal;