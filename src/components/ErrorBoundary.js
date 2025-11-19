import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ErrorBoundary.tsx
import React from 'react';
class ErrorBoundary extends React.Component {
    state = {
        hasError: false
    };
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "max-w-md w-full bg-white p-6 rounded-lg shadow-sm border", children: [_jsx("h2", { className: "text-xl font-bold text-red-600 mb-4", children: "Something went wrong" }), _jsx("p", { className: "text-gray-600 mb-4", children: "There was an error loading this page. Please try refreshing." }), _jsx("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700", children: "Refresh Page" })] }) }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
