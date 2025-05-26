import { useEffect, useRef, useState } from "react";
import { Task } from "@/types/Task";
import ReminderSound from "@/assets/reminder.mp3"; // Adjust the path as necessary
interface TaskReminderProps {
  tasks: Task[];
}

export default function TaskReminder({ tasks }: TaskReminderProps) {
  const notifiedTaskIdsRef = useRef<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [permissionChecked, setPermissionChecked] = useState(false);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().finally(() =>
        setPermissionChecked(true)
      );
    } else {
      setPermissionChecked(true);
    }
  }, []);

  useEffect(() => {
    if (!permissionChecked) return;

    const interval = setInterval(() => {
      const now = new Date();

      tasks.forEach((task) => {
        if (
          task.deadline &&
          !task.completed &&
          task.deadline <= now &&
          !notifiedTaskIdsRef.current.has(task.id)
        ) {
          // Mark as notified
          notifiedTaskIdsRef.current.add(task.id);

          // Show Notification
          if (Notification.permission === "granted") {
            new Notification("Pending Task Reminder", {
              body: `“${task.title}” is overdue. Check it out.`,
              icon: "/icon.png", // optional
              silent: true,
            });
          }

          // Play sound
          if (!audioRef.current) {
            audioRef.current = new Audio(ReminderSound);
            audioRef.current.volume = 0.5;
          }

          audioRef.current.play().catch(console.error);
        }
      });
    }, 60 * 1000); // every 1 minute

    return () => clearInterval(interval);
  }, [tasks, permissionChecked]);

  return null;
}
