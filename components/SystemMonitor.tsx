import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { MetricPoint, Agent } from '../types';

interface SystemMonitorProps {
  agents: Agent[];
}

const SystemMonitor: React.FC<SystemMonitorProps> = ({ agents }) => {
  // Initialize with some history
  const [data, setData] = useState<MetricPoint[]>(() => {
    const points: MetricPoint[] = [];
    const now = new Date();
    for (let i = 20; i >= 0; i--) {
      points.push({
        time: new Date(now.getTime() - i * 2000).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' }),
        load: Math.floor(Math.random() * 30) + 40,
        tokens: Math.floor(Math.random() * 1000) + 500,
      });
    }
    return points;
  });

  const [memoryUsage, setMemoryUsage] = useState(45);
  const [tasksPending, setTasksPending] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const lastPoint = prevData[prevData.length - 1];
        const now = new Date();
        
        // Random walk for load
        let newLoad = lastPoint.load + (Math.random() * 10 - 5);
        newLoad = Math.max(10, Math.min(95, newLoad)); // Clamp between 10 and 95

        // Random walk for tokens
        let newTokens = lastPoint.tokens + (Math.random() * 400 - 200);
        newTokens = Math.max(100, Math.min(4000, newTokens));

        const newPoint: MetricPoint = {
          time: now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second:'2-digit' }),
          load: Math.round(newLoad),
          tokens: Math.round(newTokens)
        };

        return [...prevData.slice(1), newPoint];
      });

      // Fluctuate other stats
      setMemoryUsage(prev => {
        const change = Math.random() * 2 - 1;
        return Math.max(20, Math.min(80, prev + change));
      });

      setTasksPending(prev => {
        return Math.max(0, prev + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0));
      });

    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const activeAgentCount = agents.filter(a => a.status !== 'offline').length;

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">AI Telemetry</h2>
          <p className="text-slate-400">Real-time metrics from the Devil AI neural fabric.</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="relative flex h-3 w-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
           </span>
           <span className="text-xs font-mono text-emerald-400">LIVE FEED</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Load Chart */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-200">Neural Load Capacity</h3>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">Operational</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} interval={4} />
                <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#e2e8f0' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area type="monotone" dataKey="load" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorLoad)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Token Usage Chart */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-200">Token Consumption Rate</h3>
            <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-1 rounded border border-amber-500/20">Moderate</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} interval={4} />
                <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 'auto']} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#e2e8f0' }}
                   itemStyle={{ color: '#fbbf24' }}
                />
                <Line type="monotone" dataKey="tokens" stroke="#fbbf24" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
           <p className="text-slate-500 text-sm mb-1">Active Agents</p>
           <p className="text-2xl font-bold text-blue-400">{activeAgentCount}</p>
           <p className="text-slate-600 text-xs mt-2">{agents.length} Total Nodes</p>
         </div>
         
         <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
           <p className="text-slate-500 text-sm mb-1">Uptime</p>
           <p className="text-2xl font-bold text-emerald-400">99.9%</p>
           <p className="text-slate-600 text-xs mt-2">Stable</p>
         </div>

         <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
           <p className="text-slate-500 text-sm mb-1">Tasks Pending</p>
           <p className="text-2xl font-bold text-amber-400">{tasksPending}</p>
           <p className="text-slate-600 text-xs mt-2">Queue Processing</p>
         </div>

         <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
           <p className="text-slate-500 text-sm mb-1">Memory Usage</p>
           <p className="text-2xl font-bold text-purple-400">{memoryUsage.toFixed(1)}%</p>
           <p className="text-slate-600 text-xs mt-2">{(memoryUsage * 0.08).toFixed(1)}GB / 8GB</p>
         </div>
      </div>
    </div>
  );
};

export default SystemMonitor;