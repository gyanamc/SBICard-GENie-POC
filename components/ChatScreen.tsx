import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { User, Message, Workspace } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface ChatScreenProps {
  user: User;
  onLogout: () => void;
  onRequestAccess: () => void;
}

const SAMPLE_WORKSPACES: Workspace[] = [
  { id: 'customer-insights', name: 'Customer Insights', status: 'Available', color: 'teal' },
  { id: 'fraud-analytics', name: 'Fraud Analytics', status: 'Available', color: 'amber' },
  { id: 'risk-management', name: 'Risk Management', status: 'Locked', requiresClearance: true },
];

export const ChatScreen: React.FC<ChatScreenProps> = ({ user, onLogout, onRequestAccess }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open on desktop
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Welcome to the SBI Card GenAI Assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for API (excluding the just added message for the 'history' param, API call handles the new prompt)
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await sendMessageToGemini(userMsg.text, history);

    const modelMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleWorkspaceSelect = (id: string) => {
    const ws = SAMPLE_WORKSPACES.find(w => w.id === id);
    if (ws?.requiresClearance) {
      onRequestAccess();
    }
  };

  const handleNewChat = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      text: 'Starting a new session. How can I assist you?',
      timestamp: new Date()
    }]);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Sidebar - Desktop */}
      <div className={`hidden md:block transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-80' : 'w-0 overflow-hidden'}`}>
        <Sidebar 
          user={user} 
          workspaces={SAMPLE_WORKSPACES} 
          onSelectWorkspace={handleWorkspaceSelect}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        
        {/* Mobile Sidebar Overlay */}
        <div className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>
        <div className={`md:hidden fixed inset-y-0 left-0 w-80 z-50 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <Sidebar 
            user={user} 
            workspaces={SAMPLE_WORKSPACES} 
            onSelectWorkspace={(id) => {
              handleWorkspaceSelect(id);
              setIsSidebarOpen(false);
            }}
            onNewChat={() => {
              handleNewChat();
              setIsSidebarOpen(false);
            }}
          />
        </div>

        {/* Top App Bar */}
        <div className="flex items-center bg-white dark:bg-slate-900 px-4 py-3 justify-between shadow-sm z-10 shrink-0 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <div className="flex items-center gap-3">
              <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">GENie</h2>
              <div className="rounded-full bg-teal-100 dark:bg-teal-900/50 border border-teal-200 dark:border-teal-800 px-2.5 py-0.5">
                <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wide">Production</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end">
             <div className="flex items-center gap-3">
                 <button className="hidden sm:flex items-center justify-center h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                     <span className="material-symbols-outlined text-[20px]">notifications</span>
                 </button>
                 <button className="hidden sm:flex items-center justify-center h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors" onClick={onLogout}>
                     <span className="material-symbols-outlined text-[20px]">logout</span>
                 </button>
                 <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-9 w-9 border border-slate-200 dark:border-slate-700" 
                  style={{ backgroundImage: `url("${user.avatarUrl}")` }}
                  title={user.name}
                ></div>
             </div>
          </div>
        </div>

        {/* Segmented Control */}
        <div className="flex px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shrink-0 z-0">
          <div className="flex h-10 w-full max-w-sm mx-auto items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
            <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 has-[:checked]:bg-white has-[:checked]:dark:bg-slate-700 has-[:checked]:shadow-sm has-[:checked]:text-primary dark:has-[:checked]:text-white text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal transition-all duration-200">
              <span className="truncate">Chat</span>
              <input defaultChecked className="hidden" name="view-toggle" type="radio" value="Chat" />
            </label>
            <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 has-[:checked]:bg-white has-[:checked]:dark:bg-slate-700 has-[:checked]:shadow-sm has-[:checked]:text-primary dark:has-[:checked]:text-white text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal transition-all duration-200">
              <span className="truncate">Context</span>
              <input className="hidden" name="view-toggle" type="radio" value="Context" />
            </label>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto pb-4 px-2 sm:px-4 bg-background-light dark:bg-background-dark">
            <div className="max-w-3xl mx-auto flex flex-col pt-4">
              {messages.map((msg, index) => (
                <div key={msg.id} className={`flex items-end gap-3 p-2 sm:p-4 ${msg.role === 'user' ? 'justify-end' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  {msg.role === 'model' && (
                    <div 
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 h-8 sm:w-10 sm:h-10 shrink-0 border border-slate-200 dark:border-slate-700 bg-white" 
                      style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCkBh57bxhmkGVVEu8CqZZiftNIM3PpK-tpUlh_YtyI1k1tsSPP2j-krGPvZCk5urrtaRl3gYZ4qCawRIltVAt6cg1QpvcbtC1Pq_Rp7VL8iuzgpwaxP58X4p0qOMr5Ch3VXfoqOVG69QI6_gGzorpPBX0FxL7YRtT5yWGSHfiddOMgpFHeM7BFqACubJoToVchfoIzUoGpJPue6XNpvz0kWqrtYHr7reP6NjxEoaSNiduG-iFahJR3PcfySmNd6jQq-8ZTbj4sWKN7")' }}
                    ></div>
                  )}
                  
                  <div className={`flex flex-1 flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 px-1">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-[13px] font-medium">
                            {msg.role === 'user' ? user.name : 'GenAI Assistant'}
                        </span>
                    </div>
                    <div className={`text-sm sm:text-base font-normal leading-relaxed max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-primary text-white rounded-br-sm' 
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm border border-slate-100 dark:border-slate-700'
                    }`}>
                      {msg.text}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                     <div 
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 h-8 sm:w-10 sm:h-10 shrink-0 border border-slate-200 dark:border-slate-700" 
                      style={{ backgroundImage: `url("${user.avatarUrl}")` }}
                    ></div>
                  )}
                </div>
              ))}

              {isLoading && (
                 <div className="flex items-end gap-3 p-4 animate-pulse">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0 border border-slate-200 dark:border-slate-700 bg-white" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCkBh57bxhmkGVVEu8CqZZiftNIM3PpK-tpUlh_YtyI1k1tsSPP2j-krGPvZCk5urrtaRl3gYZ4qCawRIltVAt6cg1QpvcbtC1Pq_Rp7VL8iuzgpwaxP58X4p0qOMr5Ch3VXfoqOVG69QI6_gGzorpPBX0FxL7YRtT5yWGSHfiddOMgpFHeM7BFqACubJoToVchfoIzUoGpJPue6XNpvz0kWqrtYHr7reP6NjxEoaSNiduG-iFahJR3PcfySmNd6jQq-8ZTbj4sWKN7")' }}></div>
                    <div className="flex flex-1 flex-col gap-1 items-start">
                        <span className="text-slate-500 dark:text-slate-400 text-[13px] font-medium">GenAI Assistant</span>
                        <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm px-4 py-4 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                             <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                             <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                             <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                        </div>
                    </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 pb-6 sm:pb-4">
             <div className="max-w-3xl mx-auto">
                <div className="relative flex items-center w-full">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything..." 
                        className="w-full h-12 pl-5 pr-24 rounded-full bg-slate-100 dark:bg-slate-800 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white placeholder-slate-500 transition-all shadow-sm"
                    />
                    <div className="absolute right-2 flex items-center gap-1">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                             <span className="material-symbols-outlined text-[20px]">attach_file</span>
                        </button>
                        <button 
                            onClick={handleSendMessage}
                            disabled={!input.trim() || isLoading}
                            className={`flex items-center justify-center w-9 h-9 rounded-full text-white transition-all ${!input.trim() || isLoading ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' : 'bg-primary hover:bg-blue-600 shadow-md'}`}
                        >
                             <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
                        </button>
                    </div>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-slate-400 dark:text-slate-600">
                        GenAI can make mistakes. Verify important information.
                    </p>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};
