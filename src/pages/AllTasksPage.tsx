import { TaskList } from '../components/TaskList';

export function AllTasksPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Tasks</h1>
        <p className="text-gray-600">Manage all your tasks in one place</p>
      </div>
      <TaskList />
    </div>
  );
}
