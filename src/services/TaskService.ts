import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Task, NewTask } from '@/types/Task';

const COLLECTION_NAME = 'tasks';

export const TaskService = {
  // Create a new task

  async createTask(task: NewTask): Promise<string> {
    try {
      const taskWithTimestamp = {
        ...task,
        title: task.title ?? '',
        description: task.description ?? '', // fallback to empty string if undefined
        deadline: task.deadline ? Timestamp.fromDate(task.deadline) : null,
        completed: task.completed ?? false,
        userId: task.userId ?? '',
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), taskWithTimestamp);
      return docRef.id;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },


  // Get all tasks for a user
  async getTasks(userId: string): Promise<Task[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          deadline: data.deadline ? (data.deadline as Timestamp).toDate() : null,
          completed: data.completed,
          userId: data.userId,
          createdAt: (data.createdAt as Timestamp).toDate(),
        };
      });
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  },

  // Update a task
  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      const taskRef = doc(db, COLLECTION_NAME, taskId);
      
      // Convert Date objects to Firestore Timestamps
      const updatesWithTimestamp = { ...updates };
      if (updates.deadline instanceof Date) {
        // @ts-ignore
        updatesWithTimestamp.deadline = Timestamp.fromDate(updates.deadline);
      }
      
      await updateDoc(taskRef, updatesWithTimestamp);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete a task
  async deleteTask(taskId: string): Promise<void> {
    try {
      const taskRef = doc(db, COLLECTION_NAME, taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Toggle task completion status
  async toggleTaskCompletion(taskId: string, completed: boolean): Promise<void> {
    try {
      await this.updateTask(taskId, { completed });
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw error;
    }
  }
};