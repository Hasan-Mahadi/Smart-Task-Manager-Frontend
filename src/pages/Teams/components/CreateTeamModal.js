import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Teams/components/CreateTeamModal.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Trash2 } from 'lucide-react';
const CreateTeamModal = ({ isOpen, onClose, onSubmit, }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue, } = useForm();
    const [members, setMembers] = useState([
        { name: '', role: '', capacity: 3 },
    ]);
    const addMember = () => {
        setMembers([...members, { name: '', role: '', capacity: 3 }]);
    };
    const removeMember = (index) => {
        if (members.length > 1) {
            setMembers(members.filter((_, i) => i !== index));
        }
    };
    const updateMember = (index, field, value) => {
        const updatedMembers = [...members];
        updatedMembers[index] = { ...updatedMembers[index], [field]: value };
        setMembers(updatedMembers);
    };
    const handleFormSubmit = (data) => {
        // Validate members
        const validMembers = members.filter(member => member.name.trim() && member.role.trim() && member.capacity > 0);
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
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center p-6 border-b", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Create New Team" }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "w-6 h-6" }) })] }), _jsxs("form", { onSubmit: handleSubmit(handleFormSubmit), className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700 mb-2", children: "Team Name" }), _jsx("input", { ...register('name', { required: 'Team name is required' }), type: "text", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", placeholder: "Enter team name" }), errors.name && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.name.message }))] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Team Members" }), _jsxs("button", { type: "button", onClick: addMember, className: "flex items-center text-sm text-primary-600 hover:text-primary-700", children: [_jsx(Plus, { className: "w-4 h-4 mr-1" }), "Add Member"] })] }), _jsx("div", { className: "space-y-4", children: members.map((member, index) => (_jsxs("div", { className: "p-4 border border-gray-200 rounded-lg space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("h4", { className: "text-sm font-medium text-gray-700", children: ["Member ", index + 1] }), members.length > 1 && (_jsx("button", { type: "button", onClick: () => removeMember(index), className: "text-red-600 hover:text-red-700", children: _jsx(Trash2, { className: "w-4 h-4" }) }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-600 mb-1", children: "Name" }), _jsx("input", { type: "text", value: member.name, onChange: (e) => updateMember(index, 'name', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", placeholder: "Member name" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs text-gray-600 mb-1", children: "Role" }), _jsx("input", { type: "text", value: member.role, onChange: (e) => updateMember(index, 'role', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", placeholder: "Role" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: `capacity-${index}`, className: "block text-xs text-gray-600 mb-1", children: "Capacity (0-5)" }), _jsx("select", { id: `capacity-${index}`, "aria-label": `Capacity for member ${index + 1}`, value: member.capacity, onChange: (e) => updateMember(index, 'capacity', parseInt(e.target.value)), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", children: [0, 1, 2, 3, 4, 5].map(num => (_jsxs("option", { value: num, children: [num, " tasks"] }, num))) })] })] }, index))) })] }), _jsxs("div", { className: "flex justify-end space-x-3 pt-6 border-t", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50", children: isSubmitting ? 'Creating...' : 'Create Team' })] })] })] }) }));
};
export default CreateTeamModal;
