import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export type TaskInsert = Omit<Task, 'id' | 'created_at' | 'updated_at'>;
export type TaskUpdate = Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>;

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: TaskInsert) => Promise<void>;
  updateTask: (id: string, updates: TaskUpdate) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  filterByStatus: (status: TaskStatus | 'All') => Task[];
  sortByDueDate: (tasks: Task[], ascending?: boolean) => Task[];
  getTaskStats: () => { pending: number; inProgress: number; completed: number; total: number };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = 'tasks_storage';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const storedTasks = getTasks();
      setTasks(storedTasks.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: TaskInsert) => {
    try {
      setError(null);
      const now = new Date().toISOString();
      const newTask: Task = {
        ...task,
        id: generateId(),
        created_at: now,
        updated_at: now
      };
      const updatedTasks = [...tasks, newTask];
      saveTasks(updatedTasks);
      setTasks(updatedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
      throw err;
    }
  };

  const updateTask = async (id: string, updates: TaskUpdate) => {
    try {
      setError(null);
      const now = new Date().toISOString();
      const updatedTasks = tasks.map(task =>
        task.id === id
          ? { ...task, ...updates, updated_at: now }
          : task
      );
      saveTasks(updatedTasks);
      setTasks(updatedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setError(null);
      const updatedTasks = tasks.filter(task => task.id !== id);
      saveTasks(updatedTasks);
      setTasks(updatedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    }
  };

  const filterByStatus = (status: TaskStatus | 'All'): Task[] => {
    if (status === 'All') return tasks;
    return tasks.filter(task => task.status === status);
  };

  const sortByDueDate = (tasksToSort: Task[], ascending: boolean = true): Task[] => {
    return [...tasksToSort].sort((a, b) => {
      const dateA = new Date(a.due_date).getTime();
      const dateB = new Date(b.due_date).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  };

  const getTaskStats = () => {
    return {
      pending: tasks.filter(t => t.status === 'Pending').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      total: tasks.length
    };
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        filterByStatus,
        sortByDueDate,
        getTaskStats
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
