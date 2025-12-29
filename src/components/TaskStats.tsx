import { Clock, PlayCircle, CheckCircle, ListTodo } from 'lucide-react';

interface TaskStatsProps {
  pending: number;
  inProgress: number;
  completed: number;
  total: number;
}

export function TaskStats({ pending, inProgress, completed, total }: TaskStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-900">{total}</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">
            <ListTodo size={24} className="text-gray-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-700 mb-1">Pending</p>
            <p className="text-3xl font-bold text-amber-600">{pending}</p>
          </div>
          <div className="bg-amber-100 p-3 rounded-lg">
            <Clock size={24} className="text-amber-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700 mb-1">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">{inProgress}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <PlayCircle size={24} className="text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-green-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-700 mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-600">{completed}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <CheckCircle size={24} className="text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
