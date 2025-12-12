import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import SystemMonitor from './components/SystemMonitor';
import Settings from './components/Settings';
import { Agent, AgentRole } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');

  // Initial Mock Agent Data
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: 'Alpha-1 (Overseer)', role: AgentRole.OVERSEER, status: 'busy', capabilities: ['Orchestration'] },
    { id: '2', name: 'Beta-Dev (Eng)', role: AgentRole.ENGINEER, status: 'idle', capabilities: ['React', 'TS'] },
    { id: '3', name: 'Gamma-Ops (Data)', role: AgentRole.ANALYST, status: 'idle', capabilities: ['Metrics'] },
    { id: '4', name: 'Delta-Sec (Sec)', role: AgentRole.ANALYST, status: 'offline', capabilities: ['Security'] },
  ]);

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'system':
      case 'dashboard':
        return <SystemMonitor agents={agents} />;
      case 'settings':
        return <Settings agents={agents} setAgents={setAgents} />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        agents={agents} 
      />
      <main className="flex-1 relative">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
        
        <div className="relative h-full z-10">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;