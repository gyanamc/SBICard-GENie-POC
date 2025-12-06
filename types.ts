export enum ViewState {
  LOGIN = 'LOGIN',
  CHAT = 'CHAT',
  ACCESS_DENIED = 'ACCESS_DENIED',
}

export interface User {
  name: string;
  id: string;
  department: string;
  avatarUrl: string;
  isAdmin: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isLoading?: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  status: 'Available' | 'Locked';
  color?: string;
  requiresClearance?: boolean;
}
