import { useState } from 'react';
import { TaskService } from '@/services/TaskService';
import { useAuth } from '@/contexts/AuthContext';
import { NewTask } from '@/types/Task';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface TaskFormProps {
  onTaskAdded?: () => void;
}

export default function TaskForm({ onTaskAdded }: TaskFormProps) {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    if (!currentUser) {
      setError('You must be logged in to create tasks');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let deadline: Date | null = null;

      if (deadlineDate) {
        deadline = new Date(`${deadlineDate}T${deadlineTime || '23:59'}`);
      }

      const newTask: NewTask = {
        title: title.trim(),
        description: description.trim() || undefined,
        deadline,
        completed: false,
        userId: currentUser.uid,
      };

      await TaskService.createTask(newTask);

      // Reset form
      setTitle('');
      setDescription('');
      setDeadlineDate('');
      setDeadlineTime('');

      // Notify parent component
      if (onTaskAdded) {
        onTaskAdded();
      }
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-sm text-sm w-full">
      {error && (
        <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Task Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description (optional)
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deadline-date">
              Deadline Date (optional)
            </Label>
            <Input
              type="date"
              id="deadline-date"
              value={deadlineDate}

              onChange={(e) => setDeadlineDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline-time">
              Deadline Time (optional)
            </Label>
            <Input
              type="time"
              id="deadline-time"
              value={deadlineTime}
              onChange={(e) => setDeadlineTime(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Adding Task...' : 'Add Task'}
        </Button>
      </form>
    </div>
  );
}
