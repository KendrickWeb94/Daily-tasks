import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import TaskForm from '@/components/tasks/TaskForm';
import TaskList from '@/components/tasks/TaskList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTaskAdded = () => {
    // Force refresh of task list when a new task is added
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Get current date for greeting
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'there';

  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{getCurrentGreeting()}, {userName}!</h1>
          <p className="text-muted-foreground text-sm">
            Here's an overview of your tasks for today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
              <CardDescription>Create a new task with deadline</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskForm onTaskAdded={handleTaskAdded} />
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>My Tasks</CardTitle>
                <CardDescription>Manage your active and completed tasks</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <TaskList key={refreshKey} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
