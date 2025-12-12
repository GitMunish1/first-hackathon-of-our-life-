import React from 'react';
import { LayoutDashboard, MessageSquare, Activity, Settings, Hexagon } from 'lucide-react';
import { Agent, AgentRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  agents: Agent[];
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, agents }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'chat', icon: MessageSquare, label: 'Devil Chat' },
    { id: 'system', icon: Activity, label: 'AI Monitor' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <Hexagon className="text-blue-500 animate-pulse" size={28} />
        <h1 className="text-xl font-bold tracking-wider text-slate-100">DEVIL AI</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <h3 className="text-xs font-semibold text-slate-500 uppercase mb-4 tracking-widest">Active Agents</h3>
        <div className="space-y-3">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between group cursor-default">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${agent.status === 'busy' ? 'bg-amber-500' : agent.status === 'idle' ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{agent.name}</span>
              </div>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
                {agent.role.substring(0, 4)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;