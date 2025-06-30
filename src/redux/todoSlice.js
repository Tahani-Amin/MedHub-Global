import { createSlice } from '@reduxjs/toolkit';

const loadFromLocalStorage = () => {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    const parsed = JSON.parse(saved);
    return parsed.map(task => ({
      ...task,
      completed: task.completed === true || task.completed === 'true',
    }));
  }
  return [];
};

const todoSlice = createSlice({
  name: 'todos',
  initialState: loadFromLocalStorage(),
  reducers: {
    addTask: (state, action) => {
      state.push({
        id: Date.now(),
        text: action.payload,
        completed: false
      });
    },
    deleteTask: (state, action) => {
      return state.filter(task => task.id !== action.payload);
    },
    toggleTask: (state, action) => {
      return state.map(task =>
        task.id === action.payload
          ? { ...task, completed: !task.completed }
          : task
      );
    },
    editTask: (state, action) => {
      const { id, newText } = action.payload;
      return state.map(task =>
        task.id === id ? { ...task, text: newText } : task
      );
    }
  }
});

export const { addTask, deleteTask, toggleTask, editTask } = todoSlice.actions;
export default todoSlice.reducer;
