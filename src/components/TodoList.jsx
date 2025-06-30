import TodoItem from './TodoItem';

function TodoList({ tasks, onDelete, onToggle, onEdit }) {
  if (tasks.length === 0) {
    return (
      <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center' }}>
        No tasks yet. Start by adding one!
      </p>
    );
  }

  // display the list of tasks 
  return (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onToggle={onToggle}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

export default TodoList;
