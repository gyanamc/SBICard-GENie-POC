import React, { useState } from 'react';
import { ViewState, User } from './types';
import { LoginScreen } from './components/LoginScreen';
import { ChatScreen } from './components/ChatScreen';
import { AccessDeniedScreen } from './components/AccessDeniedScreen';

const SAMPLE_USER: User = {
  name: "Anjali Sharma",
  id: "123456",
  department: "Digital Transformation",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHPwDLNNETUpdFZBNS42OhwNZfno_jA97lPwUzrLr6sHzk4h5l0SJLxjUJV01pgijJb1sh0irI-5UQHD209LeQAJGwwTm5FeIvVYjfhC9LAWVhmDfr37fFfntJFV8FWlFMjE8qZsSwtLx9Y1GLEOKto5f-e5-4KfFyvLOuZoeDRQPAHkbIUc4mYA2nQFgsrnFKk_3KQBTaFll6IhGx-xO_uBj89XiETDgBILI_P1w_4FmD3W-XJuu70X_2ozxWCTVlVMR1iYMG9uvo",
  isAdmin: true
};

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LOGIN);

  const handleLogin = () => {
    // Simulate API delay
    setTimeout(() => {
      setViewState(ViewState.CHAT);
    }, 600);
  };

  const handleLogout = () => {
      setViewState(ViewState.LOGIN);
  };

  const handleRequestAccess = () => {
    setViewState(ViewState.ACCESS_DENIED);
  };

  const handleBackToChat = () => {
    setViewState(ViewState.CHAT);
  };

  return (
    <>
      {viewState === ViewState.LOGIN && (
        <LoginScreen onLogin={handleLogin} />
      )}
      
      {viewState === ViewState.CHAT && (
        <ChatScreen 
          user={SAMPLE_USER} 
          onLogout={handleLogout}
          onRequestAccess={handleRequestAccess}
        />
      )}
      
      {viewState === ViewState.ACCESS_DENIED && (
        <AccessDeniedScreen onBack={handleBackToChat} />
      )}
    </>
  );
};

export default App;
