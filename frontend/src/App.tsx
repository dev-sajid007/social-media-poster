import { useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { PostComposer } from './components/forms/PostComposer';
import { AccountManagement } from './components/forms/AccountManagement';
import { MediaLibrary } from './components/forms/MediaLibrary';
import { AnalyticsDashboard } from './components/charts/AnalyticsDashboard';

type PageType = 'dashboard' | 'compose' | 'media' | 'analytics' | 'accounts' | 'templates' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
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
      case 'templates':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Templates</h1>
            <p className="text-gray-500">Manage your post templates (Coming Soon)</p>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>
            <p className="text-gray-500">Configure your application settings (Coming Soon)</p>
          </div>
        );
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <MainLayout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </MainLayout>
  );
}

export default App;
