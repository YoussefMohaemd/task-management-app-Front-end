import TaskCard from './TaskCard';

export default function TaskList({ tasks, mutatingId, onEdit, onDelete, onStatusChange }) {
  return (
    <ul role="list" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task) => (
        <li key={task._id}>
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
