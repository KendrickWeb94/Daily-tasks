import { useState, useEffect } from 'react';
import { Task } from '@/types/Task';
import { TaskService } from '@/services/TaskService';
import { useAuth } from '@/contexts/AuthContext';
import TaskItem from './TaskItem';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';

export default function TaskList() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);

  const fetchTasks = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const fetchedTasks = await TaskService.getTasks(currentUser.uid);
      setTasks(fetchedTasks);
      setError('');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentUser]);

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (!currentUser) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Please sign in to view your tasks.</p>
      </div>
    );
  }

  if (loading && tasks.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm bg-destructive/10 text-destructive rounded-md mb-4">
        {error}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">You don't have any tasks yet. Add your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Active Tasks ({activeTasks.length})</h3>
        </div>

        {activeTasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No active tasks. All done!</p>
        ) : (
          <div className="space-y-2">
            {activeTasks.map(task => (
              <TaskItem key={task.id} task={task} onTaskUpdated={fetchTasks} />
            ))}
          </div>
        )}
      </div>

      <Separator />

      <Collapsible open={showCompleted} onOpenChange={setShowCompleted}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Completed Tasks ({completedTasks.length})</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {showCompleted ? 'Hide' : 'Show'}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="mt-2">
          {completedTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No completed tasks yet.</p>
          ) : (
            <div className="space-y-2 mt-2">
              {completedTasks.map(task => (
                <TaskItem key={task.id} task={task} onTaskUpdated={fetchTasks} />
              ))}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
