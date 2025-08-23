import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { ScheduleView } from '@/components/schedule/ScheduleView';
import { ManagementView } from '@/components/management/ManagementView';
import { IdeasBank } from '@/components/ideas/IdeasBank';

type ViewType = 'kanban' | 'schedule' | 'management' | 'ideas';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('ideas');

  const renderView = () => {
    switch (currentView) {
      case 'ideas':
        return <IdeasBank />;
      case 'kanban':
        return <KanbanBoard />;
      case 'schedule':
        return <ScheduleView />;
      case 'management':
        return <ManagementView />;
      default:
        return <IdeasBank />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1 flex flex-col">
        <Header currentView={currentView} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="fade-in">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;