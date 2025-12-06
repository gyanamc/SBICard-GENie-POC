import React from 'react';
import { User, Workspace } from '../types';

interface SidebarProps {
  user: User;
  workspaces: Workspace[];
  onSelectWorkspace: (id: string) => void;
  onNewChat: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, workspaces, onSelectWorkspace, onNewChat, className = '' }) => {
  return (
    <div className={`flex flex-col bg-slate-900 text-white shrink-0 h-full border-r border-slate-800 ${className}`}>
      {/* User Profile Card */}
      <div className="p-4 pb-2">
        <div className="p-3 mb-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 shrink-0 border-2 border-slate-600 group-hover:border-slate-500 transition-colors" 
              style={{ backgroundImage: `url("${user.avatarUrl}")` }}
            ></div>
            <div className="flex flex-col overflow-hidden">
              <h3 className="text-sm font-bold text-white truncate">{user.name}</h3>
              <p className="text-xs text-slate-400 truncate">Employee ID: {user.id}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">{user.department}</p>
            {user.isAdmin && (
               <div className="relative group/tooltip inline-block">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400 border border-blue-500/20">
                  <span className="material-symbols-outlined text-[12px]">shield_person</span>
                  Admin
                </span>
             </div>
            )}
          </div>
        </div>

        {/* New Chat Button */}
        <button 
          onClick={onNewChat}
          className="flex items-center justify-between w-full h-11 px-4 mb-4 text-sm font-medium rounded-lg bg-primary hover:bg-blue-600 text-white transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
        >
          <span>New Chat</span>
          <span className="material-symbols-outlined text-[18px]">edit_square</span>
        </button>
      </div>

      {/* Navigation & History */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="px-4 pb-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">search</span>
            <input 
              className="w-full bg-slate-950/50 border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-1 focus:ring-primary focus:border-primary transition-all" 
              placeholder="Search conversations..." 
              type="search" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="px-2 pt-2 pb-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">Recent</div>
          <button className="w-full flex items-center p-2 rounded-lg bg-slate-800/80 text-left group transition-colors">
            <span className="material-symbols-outlined text-slate-400 text-[18px] mr-2">chat_bubble</span>
            <span className="text-sm font-medium text-white truncate">Market trend analysis for Q3</span>
          </button>
          <button className="w-full flex items-center p-2 rounded-lg hover:bg-slate-800/50 text-left group transition-colors">
             <span className="material-symbols-outlined text-slate-500 group-hover:text-slate-400 text-[18px] mr-2">chat_bubble_outline</span>
            <span className="text-sm text-slate-400 group-hover:text-slate-200 truncate">Content strategy for new credit card</span>
          </button>
           <button className="w-full flex items-center p-2 rounded-lg hover:bg-slate-800/50 text-left group transition-colors">
             <span className="material-symbols-outlined text-slate-500 group-hover:text-slate-400 text-[18px] mr-2">chat_bubble_outline</span>
            <span className="text-sm text-slate-400 group-hover:text-slate-200 truncate">Internal process documentation</span>
          </button>
        </div>

        <div className="p-4 border-t border-slate-800">
           <h4 className="px-1 mb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">Workspaces</h4>
           <div className="space-y-1">
             {workspaces.map(ws => (
               <button 
                key={ws.id}
                onClick={() => onSelectWorkspace(ws.id)}
                className={`w-full flex items-center justify-between p-2 rounded-lg group transition-all ${ws.status === 'Locked' ? 'opacity-60 cursor-not-allowed hover:bg-transparent' : 'hover:bg-slate-800 cursor-pointer'}`}
               >
                 <span className="text-sm text-slate-300 group-hover:text-white">{ws.name}</span>
                 {ws.status === 'Locked' ? (
                   <span className="material-symbols-outlined text-slate-500 text-[16px]">lock</span>
                 ) : (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      ws.color === 'teal' ? 'text-teal-400 bg-teal-500/10 border border-teal-500/20' : 
                      'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                    }`}>
                      {ws.status}
                    </span>
                 )}
               </button>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};
