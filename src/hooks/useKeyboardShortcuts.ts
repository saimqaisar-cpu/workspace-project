'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { undo, redo } from '@/store/slices/taskSlice';
import { toggleCommandPalette, setActiveView } from '@/store/slices/uiSlice';

export const useKeyboardShortcuts = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + K -> Command Palette
      if (modifier && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        dispatch(toggleCommandPalette());
      }

      // Cmd/Ctrl + Z -> Undo
      if (modifier && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch(undo());
      }

      // Cmd/Ctrl + Shift + Z or Ctrl + Y -> Redo
      if ((modifier && e.shiftKey && e.key.toLowerCase() === 'z') || (modifier && e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        dispatch(redo());
      }

      // 1 -> Kanban, 2 -> List, 3 -> Calendar
      if (e.key === '1') dispatch(setActiveView('kanban'));
      if (e.key === '2') dispatch(setActiveView('list'));
      if (e.key === '3') dispatch(setActiveView('calendar'));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);
};