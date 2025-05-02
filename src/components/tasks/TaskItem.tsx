import { useState } from 'react';
import { Task } from '@/types/Task';
import { TaskService } from '@/services/TaskService';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface TaskItemProps {
  task: Task;
  onTaskUpdated: () => void;
}

export default function TaskItem({ task, onTaskUpdated }: TaskItemProps) {
  const [loading, setLoading] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return 'No deadline';

    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      await TaskService.toggleTaskCompletion(task.id, !task.completed);
      onTaskUpdated();
    } catch (error) {
      console.error('Error toggling task completion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setLoading(true);
    try {
      await TaskService.deleteTask(task.id);
      onTaskUpdated();
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };

  const isOverdue = task.deadline && !task.completed && task.deadline < new Date();

  return (
    <div className={`border rounded-md p-4 mb-3 transition-colors ${
      task.completed 
        ? 'bg-muted/50 border-border' 
        : isOverdue 
          ? 'bg-destructive/5 border-destructive/20' 
          : 'bg-card border-border'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => handleToggleComplete()}
            disabled={loading}
            className="mt-1"
          />
          <div>
            <h3 className={`font-medium ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`mt-1 text-sm ${task.completed ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                {task.description}
              </p>
            )}
            <p className={`mt-1 text-xs ${
              isOverdue 
                ? 'text-destructive font-medium' 
                : task.completed 
                  ? 'text-muted-foreground/70' 
                  : 'text-muted-foreground'
            }`}>
              {isOverdue ? '⚠ Overdue: ' : 'Deadline: '}
              {formatDate(task.deadline)}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={loading}
          className="text-muted-foreground hover:text-destructive h-8 w-8"
          aria-label="Delete task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
