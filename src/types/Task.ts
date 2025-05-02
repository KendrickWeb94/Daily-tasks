export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: Date | null;
  completed: boolean;
  userId: string;
  createdAt: Date;
}

export type NewTask = Omit<Task, 'id' | 'createdAt'>;