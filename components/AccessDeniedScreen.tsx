import React from 'react';

interface AccessDeniedScreenProps {
  onBack: () => void;
}

export const AccessDeniedScreen: React.FC<AccessDeniedScreenProps> = ({ onBack }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display animate-fade-in">
      <div className="flex flex-1 flex-col justify-center px-4 py-6">
        <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6 rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg border border-slate-100 dark:border-slate-700">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
            <span className="material-symbols-outlined text-5xl text-sbi-blue dark:text-blue-400">
              lock
            </span>
          </div>
          <div className="flex max-w-[480px] flex-col items-center gap-2">
            <h2 className="text-sbi-blue dark:text-white text-2xl font-bold leading-tight tracking-tight text-center">
              Access Restricted
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal text-center">
              Your current role does not grant you permission to view this content or use this feature. Access is managed by specific SBI Card SSO roles.
            </p>
          </div>
          <div className="flex w-full flex-col items-stretch gap-3 mt-2">
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-sbi-blue text-white text-base font-bold leading-normal tracking-wide transition-colors hover:bg-sbi-blue/90 shadow-sm active:scale-[0.98]">
              <span className="truncate">Request Additional Access</span>
            </button>
            <button
              onClick={onBack}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-transparent text-sbi-blue ring-1 ring-inset ring-slate-300 hover:bg-slate-50 dark:text-slate-300 dark:ring-slate-600 dark:hover:bg-slate-700/50 text-base font-bold leading-normal tracking-wide transition-colors active:scale-[0.98]"
            >
              <span className="truncate">Go Back</span>
            </button>
          </div>
        </div>
        <p className="text-slate-400 dark:text-slate-500 text-xs font-normal leading-normal pt-8 px-4 text-center">
          Protected by RAG and SBI Card SSO roles.
        </p>
      </div>
    </div>
  );
};
