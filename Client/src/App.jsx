import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Homepage from './Components/Homepage/Homepage';
import Layout from './Components/layout/Layout';
import './global.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />

      <Route path="/home" element={
        <Layout toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}>
          <Homepage initialTab="daily" />
        </Layout>
      } />
      <Route path="/tasks" element={
        <Layout toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}>
          <Homepage initialTab="calendar" />
        </Layout>
      } />
      <Route path="/custom" element={
        <Layout toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}>
          <Homepage initialTab="custom" />
        </Layout>
      } />
      <Route path="/performance" element={
        <Layout toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}>
          <Homepage initialTab="performance" />
        </Layout>
      } />

      <Route path="*" element={
        <div className="flex items-center justify-center h-screen bg-gray-900">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">404</h1>
            <p className="text-gray-300 mb-6">Page not found</p>
            <Link to="/home" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500">
              Go Home
            </Link>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;
