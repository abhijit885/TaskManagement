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
export interface textFields {
  email: string;
  password?: any;
}
export interface UserInputFormProps {
  name: string;
  age: string;
  onNameChange: (text: string) => void;
  onAgeChange: (text: string) => void;
}
