import create from 'zustand'
import { persist } from 'zustand/middleware'
import AbstractSubmission from './models/AbstractSubmission'

export const useArticleStore = create((set) => ({
  // visible shadow cells according to Accordion
  visibleShadowCellsIdx: [],
  setVisibleShadowCell: (cellIdx, isVisible) => set((state) => {
    // const { visibleCellsIdx } = get()
    const copy = [...state.visibleShadowCellsIdx]
    const idx = copy.indexOf(cellIdx)
    if (idx === -1 && isVisible) {
      copy.push(cellIdx)
    } else if(idx > -1 && !isVisible){
      copy.splice(idx, 1)
    }
    copy.sort()
    return { visibleShadowCellsIdx: copy }
  }),

  // visible cell are in the current Viewoport
  visibleCellsIdx: [],
  setVisibleCell: (cellIdx, isVisible) => set((state) => {
    // const { visibleCellsIdx } = get()
    const copy = [...state.visibleCellsIdx]
    const idx = copy.indexOf(cellIdx)
    if (idx === -1 && isVisible) {
      copy.push(cellIdx)
    } else if(idx > -1 && !isVisible){
      copy.splice(idx, 1)
    }
    copy.sort()
    console.info('visibleCellsIdx', copy)
    return { visibleCellsIdx: copy }
  })
}))
export const useStore = create(persist(
  (set, get) => ({
    backgroundColor: '#ffffff',
    acceptAnalyticsCookies: true,
    acceptCookies: false, // cookies should be accepted, session is stored locally
    mode: 'dark', // or light
    displayLayer: 'narrative',
    temporaryAbstractSubmission: new AbstractSubmission(),
    abstractSubmitted: new AbstractSubmission(),
    changeBackgroundColor: (backgroundColor) => {
      // usage in components:
      //  const changeBackgroundColor = useStore(state => state.changeBackgroundColor)
      //  useEffect(() => {
      //    changeBackgroundColor(#ccffaa)
      //  }, [])
      //
      const header = document.getElementById('Header_background')
      document.body.style.backgroundColor = backgroundColor
      // change header backgroundColor too...
      if (header) {
        header.style.backgroundColor = backgroundColor
      }
      return set({ backgroundColor })
    },
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
    },
    setDisplayLayer: (value) => {
      const state = get();
      console.info('setDisplayLayer', value)
      set({ ...state, displayLayer: value })
    }
  }),
  {
    name: 'JournalOfDigitalHistory',
  }
))
