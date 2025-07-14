import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

interface PageContentProps {
  children: React.ReactNode;
  maxWidth?: number;
}

const PageContent: React.FC<PageContentProps> = ({ children, maxWidth = 800 }) => (
  <Layout style={{ minHeight: '100vh', padding: 24, backgroundColor: '#f0f2f5' }}>
    <Content
      style={{
        width: '100%',
        backgroundColor: '#fff',
        padding: 24,
        maxWidth: 1200,
        margin: '0 auto',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      {children}
    </Content>
  </Layout>
);

export default PageContent;
