import create from 'zustand';

export const useStore = create((set) => ({
  backgroundColor: '#ffffff',
  mode: 'dark', // or dark
}));
