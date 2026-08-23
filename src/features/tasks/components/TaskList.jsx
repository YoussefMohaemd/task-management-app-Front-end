import TaskCard from './TaskCard';

export default function TaskList({ tasks, mutatingId, onEdit, onDelete, onStatusChange }) {
  return (
    <ul role="list" className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task, index) => (
        <li
          key={task._id}
          className="animate-fade-up"
          style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
        >
          <TaskCard
            task={task}
            busy={mutatingId === task._id}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        </li>
      ))}
    </ul>
  );
}
