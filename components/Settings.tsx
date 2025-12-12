import React, { useState } from 'react';
import { Agent, AgentRole } from '../types';
import { Trash2, Plus, Save, ServerCog, ShieldAlert, Terminal, Activity } from 'lucide-react';

interface SettingsProps {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
}

const Settings: React.FC<SettingsProps> = ({ agents, setAgents }) => {
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    name: '',
    role: AgentRole.ENGINEER,
    status: 'idle',
    capabilities: []
  });

  const [capabilitiesInput, setCapabilitiesInput] = useState('');

  const handleAddAgent = () => {
    if (!newAgent.name) return;

    const agentToAdd: Agent = {
      id: Date.now().toString(),
      name: newAgent.name,
      role: newAgent.role as AgentRole,
      status: newAgent.status as 'idle' | 'busy' | 'offline',
      capabilities: capabilitiesInput.split(',').map(c => c.trim()).filter(c => c)
    };

    setAgents([...agents, agentToAdd]);
    setNewAgent({ name: '', role: AgentRole.ENGINEER, status: 'idle', capabilities: [] });
    setCapabilitiesInput('');
  };

  const removeAgent = (id: string) => {
    setAgents(agents.filter(a => a.id !== id));
  };

  const getRoleIcon = (role: AgentRole) => {
    switch (role) {
      case AgentRole.COORDINATOR: return <Activity size={16} className="text-blue-400" />;
      case AgentRole.ENGINEER: return <Terminal size={16} className="text-emerald-400" />;
      case AgentRole.ANALYST: return <ServerCog size={16} className="text-purple-400" />;
      default: return <ShieldAlert size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full">
      <header className="border-b border-slate-800 pb-6">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <ServerCog className="text-blue-500" />
          System Configuration
        </h2>
        <p className="text-slate-400 mt-1">Manage SwarmMind neural nodes and agent permissions.</p>
      </header>

      {/* Agent Roster */}
      <section className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-200">Active Neural Nodes</h3>
          <span className="text-xs font-mono text-slate-500">{agents.length} NODES ONLINE</span>
        </div>
        <div className="divide-y divide-slate-800">
          {agents.map((agent) => (
            <div key={agent.id} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 border border-slate-700`}>
                  {getRoleIcon(agent.role)}
                </div>
                <div>
                  <h4 className="font-medium text-slate-200">{agent.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {agent.role}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${
                      agent.status === 'busy' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                      agent.status === 'idle' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                      {agent.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => removeAgent(agent.id)}
                className="p-2 hover:bg-red-500/20 hover:text-red-400 text-slate-500 rounded transition-colors"
                title="Terminate Node"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Add Agent Form */}
      <section className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h3 className="font-semibold text-slate-200 mb-6 flex items-center gap-2">
          <Plus size={18} className="text-blue-500" />
          Deploy New Agent
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Designation (Name)</label>
            <input 
              type="text" 
              value={newAgent.name}
              onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
              placeholder="e.g. Omega-Red"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Role Protocol</label>
            <select 
              value={newAgent.role}
              onChange={(e) => setNewAgent({...newAgent, role: e.target.value as AgentRole})}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
            >
              {Object.values(AgentRole).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Initial Status</label>
            <select 
              value={newAgent.status}
              onChange={(e) => setNewAgent({...newAgent, status: e.target.value as any})}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
            >
              <option value="idle">IDLE (Ready)</option>
              <option value="busy">BUSY (Processing)</option>
              <option value="offline">OFFLINE (Disabled)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Capabilities (Comma separated)</label>
            <input 
              type="text" 
              value={capabilitiesInput}
              onChange={(e) => setCapabilitiesInput(e.target.value)}
              placeholder="e.g. Python, SQL, Docker"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <button 
          onClick={handleAddAgent}
          disabled={!newAgent.name}
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-3 rounded-lg transition-all"
        >
          <Save size={18} />
          Initialize Agent
        </button>
      </section>
    </div>
  );
};

export default Settings;