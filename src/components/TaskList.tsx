import { useState } from 'react';
import { Plus, Filter, ArrowUpDown } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { TaskStats } from './TaskStats';
import { useTaskContext, Task, TaskStatus } from '../context/TaskContext';

interface TaskListProps {
  showOnlyCompleted?: boolean;
}

export function TaskList({ showOnlyCompleted = false }: TaskListProps) {
  const { tasks, loading, error, deleteTask, filterByStatus, sortByDueDate, getTaskStats } = useTaskContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'All'>('All');
  const [sortAscending, setSortAscending] = useState(true);

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditTask(null);
  };

  const getFilteredAndSortedTasks = () => {
    let filteredTasks = showOnlyCompleted
      ? tasks.filter(task => task.status === 'Completed')
      : filterByStatus(filterStatus);

    return sortByDueDate(filteredTasks, sortAscending);
  };

  const displayedTasks = getFilteredAndSortedTasks();
  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <TaskStats {...stats} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
            {!showOnlyCompleted && (
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'All')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            )}

            <button
              onClick={() => setSortAscending(!sortAscending)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowUpDown size={20} />
              <span>{sortAscending ? 'Earliest First' : 'Latest First'}</span>
            </button>
          </div>

          {!showOnlyCompleted && (
            <button
              onClick={() => {
                setEditTask(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium w-full sm:w-auto justify-center"
            >
              <Plus size={20} />
              Add Task
            </button>
          )}
        </div>
      </div>

      {displayedTasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-sm mx-auto">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ListTodo size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {showOnlyCompleted ? 'No completed tasks yet' : 'No tasks found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {showOnlyCompleted
                ? 'Complete some tasks to see them here'
                : filterStatus === 'All'
                  ? 'Get started by adding your first task'
                  : `No tasks with status "${filterStatus}"`
              }
            </p>
            {!showOnlyCompleted && filterStatus === 'All' && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus size={20} />
                Add Your First Task
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editTask={editTask}
      />
    </div>
  );
}

function ListTodo({ size, className }: { size: number; className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
