import { useState } from 'react';

function TodoItem({ task, onDelete, onToggle, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.text);

  // Allows toggle for task to be edited
  const handleEdit = () => {
    if (editing) {
      onEdit(task.id, editValue);
    }
    setEditing(!editing);
  };

  return (
    // Displays each task with the optin to edit or delete
    <li
      style={{
        textDecoration: task.completed ? 'line-through' : 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.5rem',
        cursor: 'pointer',
      }}
      onClick={() => !editing && onToggle(task.id)}
    >
      {editing ? (
        <input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span>{task.text}</span>
      )}
      <div>
        <button onClick={(e) => {
          e.stopPropagation();
          handleEdit();
        }}>{editing ? '💾' : '✏️'}</button>
        <button onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}>❌</button>
      </div>
    </li>
  );
}

export default TodoItem;
