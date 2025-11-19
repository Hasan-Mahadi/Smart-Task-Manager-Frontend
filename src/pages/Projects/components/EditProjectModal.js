import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
const EditProjectModal = ({ project, isOpen, onClose, onSubmit, }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, } = useForm({
        defaultValues: {
            name: project.name,
            description: project.description || '',
        }
    });
    const handleFormSubmit = (data) => {
        onSubmit(data);
        reset();
    };
    const handleClose = () => {
        reset({
            name: project.name,
            description: project.description || '',
        });
        onClose();
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-lg max-w-md w-full", children: [_jsxs("div", { className: "flex justify-between items-center p-6 border-b", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: "Edit Project" }), _jsx("button", { onClick: handleClose, className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "w-6 h-6" }) })] }), _jsxs("form", { onSubmit: handleSubmit(handleFormSubmit), className: "p-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700 mb-2", children: "Project Name *" }), _jsx("input", { ...register('name', { required: 'Project name is required' }), type: "text", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", placeholder: "Enter project name" }), errors.name && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.name.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { ...register('description'), rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500", placeholder: "Enter project description" })] }), _jsxs("div", { className: "flex justify-end space-x-3 pt-4", children: [_jsx("button", { type: "button", onClick: handleClose, className: "px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50", children: isSubmitting ? 'Updating...' : 'Update Project' })] })] })] }) }));
};
export default EditProjectModal;
