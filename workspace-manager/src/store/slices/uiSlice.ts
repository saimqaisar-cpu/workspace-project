import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ViewMode } from '@/types';

interface UIState {
  activeView: ViewMode;
  isCommandPaletteOpen: boolean;
  isTaskModalOpen: boolean;
}

const initialState: UIState = {
  activeView: 'kanban',
  isCommandPaletteOpen: false,
  isTaskModalOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveView: (state, action: PayloadAction<ViewMode>) => {
      state.activeView = action.payload;
    },
    toggleCommandPalette: (state) => {
      state.isCommandPaletteOpen = !state.isCommandPaletteOpen;
    },
    openTaskModal: (state) => {
      state.isTaskModalOpen = true;
    },
    closeTaskModal: (state) => {
      state.isTaskModalOpen = false;
    },
  },
});

export const { setActiveView, toggleCommandPalette, openTaskModal, closeTaskModal } = uiSlice.actions;
export default uiSlice.reducer;