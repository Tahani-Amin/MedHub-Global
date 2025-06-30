import { useSelector, useDispatch } from 'react-redux';
import TodoInput from './components/todoin';
import TodoList from './components/TodoList';
import { addTask, deleteTask, toggleTask, editTask } from './redux/todoSlice';
import { useState } from 'react';

function App() {
  const tasks = useSelector(state => state.todos);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📝 My ToDo List</h1>
      <p style={{ fontStyle: 'italic', color: '#666' }}>{today}</p>
      <TodoInput onAdd={(text) => dispatch(addTask(text))} />
      <div style={{ margin: '1rem 0' }}>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
      </div>
      <h2>Total Tasks: {tasks.length}</h2>
      <TodoList
        tasks={filteredTasks}
        onDelete={(id) => dispatch(deleteTask(id))}
        onToggle={(id) => dispatch(toggleTask(id))}
        onEdit={(id, text) => dispatch(editTask({ id, newText: text }))}
      />
    </div>
  );
}

export default App;
