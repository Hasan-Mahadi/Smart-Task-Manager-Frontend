import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../../contexts/AuthContext';
const Header = () => {
    const { user } = useAuth();
    return (_jsx("header", { className: "bg-white shadow-sm border-b", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center h-16", children: [_jsx("div", { className: "flex items-center", children: _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Smart Task Manager" }) }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "text-sm text-gray-700", children: ["Welcome, ", _jsx("span", { className: "font-semibold", children: user?.name })] }), _jsx("div", { className: "h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center", children: _jsx("span", { className: "text-sm font-medium text-white", children: user?.name?.charAt(0).toUpperCase() }) })] })] }) }) }));
};
export default Header;
