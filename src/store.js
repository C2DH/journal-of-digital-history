import create from 'zustand'
import { persist } from 'zustand/middleware'
import AbstractSubmission from './models/AbstractSubmission'

export const useStore = create(persist(
  (set, get) => ({
    backgroundColor: '#ffffff',
    mode: 'dark', // or light
    temporaryAbstractSubmission: new AbstractSubmission(),
    setTemporaryAbstractSubmission: (payload) => {
      const state = get();
      set({ ...state, temporaryAbstractSubmission: new AbstractSubmission(payload) });
    },
  }),
  {
    name: 'JournalOfDigitalHistory',
  }
))
