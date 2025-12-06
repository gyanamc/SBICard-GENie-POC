import React from 'react';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark transition-colors duration-300">
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-xl bg-white dark:bg-gray-800 p-8 shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <h1 className="text-slate-900 dark:text-white tracking-tight text-2xl font-bold leading-tight">
              SBI Card GenAI Assistant
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-base font-normal leading-normal">
              Secure role-based access to enterprise knowledge
            </p>
            <p className="mt-4 text-slate-500 dark:text-slate-500 text-sm font-normal leading-normal">
              Access is granted via the standard, secure SBI Card employee SSO system. Please sign in to continue.
            </p>
          </div>
          <div className="mt-8">
            <button
              onClick={onLogin}
              className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-sbi-blue hover:bg-blue-800 text-white gap-2.5 text-base font-bold leading-normal tracking-[0.015em] transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-white" style={{ fontSize: '20px' }}>
                lock
              </span>
              <span className="truncate">Sign in with SBI Card SSO</span>
            </button>
          </div>
          <p className="mt-6 text-slate-400 dark:text-slate-600 text-xs font-normal leading-normal text-center">
            By signing in, you agree to the terms and conditions of the access policy.
          </p>
        </div>
      </main>
      <footer className="w-full shrink-0 p-4">
        <div className="flex flex-col items-center justify-center gap-2 text-center text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:justify-between max-w-7xl mx-auto w-full">
          <p className="text-xs">© 2024 SBI Card. All rights reserved.</p>
          <a className="text-xs font-medium text-teal-600 hover:text-teal-700 hover:underline dark:text-teal-400" href="#">
            View access policy
          </a>
        </div>
      </footer>
    </div>
  );
};
