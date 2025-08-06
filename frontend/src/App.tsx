import { useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { PostComposer } from './components/forms/PostComposer';
import { AccountManagement } from './components/forms/AccountManagement';
import { MediaLibrary } from './components/forms/MediaLibrary';
import { AnalyticsDashboard } from './components/charts/AnalyticsDashboard';

type PageType = 'dashboard' | 'compose' | 'media' | 'analytics' | 'accounts';

function App() {
  const [currentPage] = useState<PageType>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'compose':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Compose Post</h1>
              <p className="text-gray-500">Create and schedule your social media content</p>
            </div>
            <PostComposer />
          </div>
        );
      case 'media':
        return <MediaLibrary />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'accounts':
        return <AccountManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <MainLayout>
      {renderPage()}
    </MainLayout>
  );
}

export default App;
