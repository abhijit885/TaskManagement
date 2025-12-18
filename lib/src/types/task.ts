export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}
export interface User {
  uid: string;
  email: string;
  displayName?: string;
}