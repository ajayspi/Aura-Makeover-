"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Plus, Settings2, Play, MessageSquare, Zap, Clock, Save, Target } from 'lucide-react';

const INITIAL_NODES = [
  { id: 'trigger_1', type: 'trigger', label: 'Lead Captured', icon: Target, delay: 0 },
  { id: 'condition_1', type: 'condition', label: 'Score > 50?', icon: Settings2, delay: 0.2 },
  { id: 'action_1', type: 'action', label: 'Send WhatsApp: Welcome', icon: MessageSquare, delay: 0.4 },
  { id: 'wait_1', type: 'wait', label: 'Wait 24 Hours', icon: Clock, delay: 0.6 },
  { id: 'action_2', type: 'action', label: 'Send WhatsApp: Portfolio', icon: MessageSquare, delay: 0.8 },
];

export default function AutomationWorkflows() {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 5000);
  };

  return (
    <div className="p-8 bg-[#FAF8F5] min-h-screen relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C5A880]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#8A5836]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-10 relative z-10">
        <div>
          <h1 className="text-3xl font-black font-['Syne'] text-[#1C130B] tracking-tight">Automation Workflows</h1>
          <p className="text-[#8A5836] text-sm mt-1 font-bold">Design event-driven drip campaigns for AiSensy.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-[#C5A880]/30 text-[#1C130B] rounded-2xl text-sm font-bold hover:border-[#C5A880] transition-colors shadow-sm disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isSimulating ? 'animate-pulse text-[#C5A880]' : ''}`} /> 
            {isSimulating ? 'Simulating...' : 'Test Flow'}
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#1C130B] text-white rounded-2xl text-sm font-bold hover:bg-[#8A5836] transition-colors shadow-xl">
            <Save className="w-4 h-4" /> Save Workflow
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10 h-[calc(100vh-180px)]">
        {/* Canvas Area */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden flex flex-col relative">
          
          {/* Grid Background */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(#C5A880 1px, transparent 1px)', 
            backgroundSize: '24px 24px',
            opacity: 0.15
          }} />

          {/* Node Editor */}
          <div className="flex-1 overflow-y-auto p-12 relative flex flex-col items-center">
            <AnimatePresence>
              {nodes.map((node, index) => (
                <React.Fragment key={node.id}>
                  {/* The Node */}
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, delay: node.delay }}
                    onClick={() => setActiveNode(node.id)}
                    className={`relative z-10 w-80 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 backdrop-blur-md ${
                      activeNode === node.id 
                        ? 'border-[#C5A880] shadow-[0_0_30px_rgba(197,168,128,0.2)] bg-white' 
                        : 'border-transparent bg-white shadow-lg hover:border-[#C5A880]/50 hover:-translate-y-1'
                    }`}
                  >
                    {isSimulating && (
                      <motion.div 
                        className="absolute inset-0 bg-[#C5A880]/10 rounded-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, delay: index * 0.8, repeat: isSimulating ? Infinity : 0 }}
                      />
                    )}
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        node.type === 'trigger' ? 'bg-[#1C130B] text-[#C5A880]' :
                        node.type === 'action' ? 'bg-[#15803D]/10 text-[#15803D]' :
                        node.type === 'condition' ? 'bg-amber-50 text-amber-600' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        <node.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{node.type}</p>
                        <p className="text-sm font-bold text-[#1C130B]">{node.label}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Connecting Line */}
                  {index < nodes.length - 1 && (
                    <div className="w-0.5 h-12 relative my-1">
                      <div className="absolute inset-0 bg-gray-200" />
                      {isSimulating && (
                        <motion.div
                          className="absolute top-0 left-0 w-full bg-[#C5A880]"
                          initial={{ height: '0%' }}
                          animate={{ height: '100%' }}
                          transition={{ duration: 0.5, delay: index * 0.8 }}
                        />
                      )}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </AnimatePresence>

            {/* Add Node Button */}
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 w-12 h-12 rounded-full bg-white border-2 border-dashed border-[#C5A880]/50 text-[#C5A880] flex items-center justify-center hover:bg-[#FAF8F5] hover:border-[#C5A880] transition-all hover:scale-110 shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Properties Sidebar */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 overflow-y-auto">
          <h3 className="font-bold text-[#1C130B] mb-6 font-['Syne'] text-xl flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-[#8A5836]" />
            Node Configuration
          </h3>

          <AnimatePresence mode="wait">
            {activeNode ? (
              <motion.div
                key={activeNode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {nodes.find(n => n.id === activeNode)?.type === 'action' && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Action Type</label>
                      <select className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1C130B] focus:outline-none focus:border-[#C5A880]">
                        <option>AiSensy WhatsApp Template</option>
                        <option>Internal Email Alert</option>
                        <option>Update Lead Stage</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Template ID (AiSensy)</label>
                      <input type="text" defaultValue="welcome_portfolio_v2" className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1C130B] focus:outline-none focus:border-[#C5A880]" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Variables (JSON)</label>
                      <textarea rows={4} defaultValue={'{\n  "name": "{{customer.name}}",\n  "tier": "{{lead.scoreTier}}"\n}'} className="w-full bg-[#1C130B] text-[#C5A880] font-mono text-xs border border-[#1C130B] rounded-xl px-4 py-3 focus:outline-none focus:border-[#C5A880]" />
                    </div>
                  </>
                )}

                {nodes.find(n => n.id === activeNode)?.type === 'condition' && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Logic Property</label>
                      <select className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1C130B] focus:outline-none focus:border-[#C5A880]">
                        <option>Lead Score</option>
                        <option>Lifecycle Stage</option>
                        <option>City</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Operator</label>
                      <select className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1C130B] focus:outline-none focus:border-[#C5A880]">
                        <option>Greater Than (&gt;)</option>
                        <option>Equals (==)</option>
                        <option>Less Than (&lt;)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Value</label>
                      <input type="text" defaultValue="50" className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1C130B] focus:outline-none focus:border-[#C5A880]" />
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-gray-400"
              >
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-sm font-medium">Select a node to configure its properties.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
