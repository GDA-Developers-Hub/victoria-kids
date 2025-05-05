import { RouterProvider } from 'react-router-dom'
import router from './routes'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import { useState, useEffect } from 'react'

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto dismiss after 5 seconds
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  }[type] || 'bg-gray-700';
  
  return (
    <div className={`${bgColor} text-white p-4 rounded-lg shadow-lg flex justify-between items-center mb-2`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white">
        &times;
      </button>
    </div>
  );
};

// Toast container component
const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  
  // Mount global event listeners for toast messages
  useEffect(() => {
    const handleSuccess = (e) => {
      setToasts(prev => [...prev, { id: Date.now(), message: e.detail, type: 'success' }]);
    };
    
    const handleError = (e) => {
      setToasts(prev => [...prev, { id: Date.now(), message: e.detail, type: 'error' }]);
    };
    
    const handleInfo = (e) => {
      setToasts(prev => [...prev, { id: Date.now(), message: e.detail, type: 'info' }]);
    };
    
    const handleWarning = (e) => {
      setToasts(prev => [...prev, { id: Date.now(), message: e.detail, type: 'warning' }]);
    };
    
    // Add event listeners
    window.addEventListener('toast:success', handleSuccess);
    window.addEventListener('toast:error', handleError);
    window.addEventListener('toast:info', handleInfo);
    window.addEventListener('toast:warning', handleWarning);
    
    // Clean up
    return () => {
      window.removeEventListener('toast:success', handleSuccess);
      window.removeEventListener('toast:error', handleError);
      window.removeEventListener('toast:info', handleInfo);
      window.removeEventListener('toast:warning', handleWarning);
    };
  }, []);
  
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  return (
    <div className="fixed top-4 right-4 z-50 w-72">
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="app-container min-h-screen bg-gray-50">
        <RouterProvider router={router} />
        <ToastContainer />
      </div>
    </AuthProvider>
  )
}

export default App
