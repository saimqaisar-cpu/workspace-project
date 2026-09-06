import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './slices/taskSlice';
import uiReducer from './slices/uiSlice';
import workspaceReducer from './slices/workspaceSlice';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    ui: uiReducer,
    workspaces: workspaceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;