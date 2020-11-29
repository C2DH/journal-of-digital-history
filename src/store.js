import create from 'zustand'
import { persist } from 'zustand/middleware'
import AbstractSubmission from './models/AbstractSubmission'

export const useStore = create(persist(
  (set, get) => ({
    backgroundColor: '#ffffff',
    acceptAnalyticsCookies: true,
    acceptCookies: false, // cookies should be accepted, session is stored locally
    mode: 'dark', // or light
    temporaryAbstractSubmission: new AbstractSubmission(),
    abstractSubmitted: new AbstractSubmission(),
    setTemporaryAbstractSubmission: (payload) => {
      const state = get();
      set({ ...state, temporaryAbstractSubmission: new AbstractSubmission(payload) });
    },
    setAbstractSubmitted: (payload) => {
      const state = get();
      set({
        ...state,
        temporaryAbstractSubmission: new AbstractSubmission(),
        abstractSubmitted: new AbstractSubmission(payload)
      });
    },
    setAcceptCookies: () => {
      const state = get();
      set({ ...state, acceptCookies:true })
    },
    setAcceptAnalyticsCookies: (value) => {
      const state = get();
      set({ ...state, acceptAnalyticsCookies: Boolean(value) })
    },
    getPersistentState: () => {
      const state = get();
      return {...state}
    }
  }),
  {
    name: 'JournalOfDigitalHistory',
  }
))
