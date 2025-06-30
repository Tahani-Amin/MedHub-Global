import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';

const store = configureStore({
  reducer: {
    todos: todoReducer,
  }
});

// Save to local storage
store.subscribe(() => {
  localStorage.setItem('tasks', JSON.stringify(store.getState().todos));
});

export default store;
