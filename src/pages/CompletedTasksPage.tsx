import { TaskList } from '../components/TaskList';

export function CompletedTasksPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Completed Tasks</h1>
        <p className="text-gray-600">View all your accomplished tasks</p>
      </div>
      <TaskList showOnlyCompleted={true} />
    </div>
  );
}
