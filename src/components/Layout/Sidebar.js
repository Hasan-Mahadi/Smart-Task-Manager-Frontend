import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FolderKanban, CheckSquare, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Teams', href: '/teams', icon: Users },
        { name: 'Projects', href: '/projects', icon: FolderKanban },
        { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    ];
    const isActive = (path) => {
        return location.pathname === path;
    };
    return (_jsx("div", { className: "hidden md:flex md:w-64 md:flex-col", children: _jsx("div", { className: "flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r", children: _jsxs("div", { className: "flex-grow flex flex-col", children: [_jsx("nav", { className: "flex-1 px-4 pb-4 space-y-2", children: navigation.map((item) => {
                            const Icon = item.icon;
                            return (_jsxs(Link, { to: item.href, className: `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive(item.href)
                                    ? 'bg-primary-100 text-primary-900 border-r-2 border-primary-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`, children: [_jsx(Icon, { className: `mr-3 flex-shrink-0 h-6 w-6 ${isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}` }), item.name] }, item.name));
                        }) }), _jsx("div", { className: "flex-shrink-0 flex border-t border-gray-200 p-4", children: _jsx("button", { onClick: logout, className: "flex-shrink-0 w-full group block", children: _jsxs("div", { className: "flex items-center", children: [_jsx(LogOut, { className: "h-6 w-6 text-gray-400 group-hover:text-gray-500" }), _jsx("span", { className: "ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900", children: "Logout" })] }) }) })] }) }) }));
};
export default Sidebar;
