import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import ProjectFormPage from './pages/project/ProjectFormPage';
import ProjectSearchPage from './pages/project/ProjectSearchPage';
import ProjectDashboard from './pages/project/ProjectDashboard';
import ProjectDetailPage from './pages/project/ProjectDetailPage';
import LineMessagesPage from './pages/LineMessagesPage';
import TestPage from './pages/Test';
const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Navbar />
        <Layout >
          <Content>
            <Routes>
              <Route path="/" element={<HomePage />} />
              
              <Route path="/dashboard" element={<ProjectDashboard />} />

              {/* project */}
              <Route path="/project/search" element={<ProjectSearchPage />} />
              <Route path="/project/add" element={<ProjectFormPage />} />
              <Route path="/project/detail" element={<ProjectDetailPage />} />
              {/* Line */}
              <Route path="/line-messages" element={<LineMessagesPage />} />
              {/* เพิ่มหน้าอื่นได้ตามต้องการ */}
              <Route path="/test-page" element={<TestPage />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
