import { firestore } from '../firebase/config';
import { Task } from '../types/task';

export const addTask = async (task: Task) => {
  try {
    await firestore().collection('tasks').add(task);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getTasks = async (): Promise<Task[]> => {
  try {
    const snapshot = await firestore().collection('tasks').get();
    return snapshot.docs.map(doc => doc.data() as Task);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateTask = async (taskId: string, task: Partial<Task>) => {
  try {
    await firestore().collection('tasks').doc(taskId).update(task);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    await firestore().collection('tasks').doc(taskId).delete();
  } catch (error: any) {
    throw new Error(error.message);
  }
};
