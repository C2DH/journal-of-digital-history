import create from 'zustand'
import { persist } from 'zustand/middleware'
import { produce } from 'immer'
import { DisplayLayerNarrative } from './constants/globalConstants'

export const useArticleCellExplainerStore = create((set) => ({
  cellIdx: null,
  lock: (cellIdx) =>
    set(() => ({
      cellIdx,
    })),
  free: () => set(() => ({ cellIdx: null })),
}))

export const useIssueStore = create((set) => ({
  issue: null,
  setIssue: (issue) => set(() => ({ issue })),
}))

export const useArticleToCStore = create((set) => ({
  visibleCellsIdx: [],
  clearVisibleCellsIdx: () => set(() => ({ visibleCellsIdx: [] })),
  setVisibleCell: (cellIdx, isVisible) =>
    set((state) => {
      const copy = [...state.visibleCellsIdx]
      const idx = copy.indexOf(cellIdx)
      if (idx === -1 && isVisible) {
        copy.push(cellIdx)
      } else if (idx > -1 && !isVisible) {
        copy.splice(idx, 1)
      }
      copy.sort((a, b) => a - b)
      // console.debug('[useArticleToCStore] visibleCellsIdx:', copy)
      return { visibleCellsIdx: copy }
    }),
  setVisibleCellsIdx: (visibleCellsIdx = []) =>
    set((state) => {
      const copy = state.visibleCellsIdx.join('-')
      const newCopy = visibleCellsIdx.join('-')
      // compare the two strings
      if (copy !== newCopy) {
        return { visibleCellsIdx }
      }
    }),
  selectedCellIdx: -1,
  setSelectedCellIdx: (selectedCellIdx) => set(() => ({ selectedCellIdx })),
}))

export const useArticleStore = create((set) => ({
  selectedCellIdx: -1,
  setSelectedCellIdx: (selectedCellIdx) => set(() => ({ selectedCellIdx })),
  selectedDataHref: null,
  setSelectedDataHref: (selectedDataHref) => set(() => ({ selectedDataHref })),
  // visible shadow cells according to Accordion
  visibleShadowCellsIdx: [],
  setVisibleShadowCell: (cellIdx, isVisible) =>
    set((state) => {
      // const { visibleCellsIdx } = get()
      const copy = [...state.visibleShadowCellsIdx]
      const idx = copy.indexOf(cellIdx)
      if (idx === -1 && isVisible) {
        copy.push(cellIdx)
      } else if (idx > -1 && !isVisible) {
        copy.splice(idx, 1)
      }
      copy.sort()
      return { visibleShadowCellsIdx: copy }
    }),

  // visible cell are in the current Viewoport
  visibleCellsIdx: [],
  setVisibleCell: (cellIdx, currentDisplayLayer, isVisible) =>
    set((state) => {
      // use state displayLayer to filter visibl cells accordin to the layer we're in.
      if (currentDisplayLayer !== state.displayLayer) {
        return { visibleCellsIdx: state.visibleCellsIdx }
      }
      // const { visibleCellsIdx } = get()
      const copy = [...state.visibleCellsIdx]
      const idx = copy.indexOf(cellIdx)
      if (idx === -1 && isVisible) {
        copy.push(cellIdx)
      } else if (idx > -1 && !isVisible) {
        copy.splice(idx, 1)
      }
      copy.sort()
      // console.info('visibleCellsIdx', copy)
      return { visibleCellsIdx: copy }
    }),
  displayLayer: DisplayLayerNarrative,
  setDisplayLayer: (displayLayer) => set({ displayLayer, visibleCellsIdx: [] }),

  //  issue #681: isolate the cells
  iframeHeader: [],
  addIframeHeader: (iframeHeader) =>
    set((state) => {
      if (!state.iframeHeader.includes(iframeHeader)) {
        return { iframeHeader: [...state.iframeHeader, iframeHeader] }
      }
    }),
  clearIframeHeader: () => set(() => ({ iframeHeader: [] })),

  articleVersion: 2,
  setArticleVersion: (articleVersion) => set(() => ({ articleVersion })),
}))

export const useStore = create(
  persist(
    produce(
      (set, get) => ({
        backgroundColor: '#ffffff',
        acceptAnalyticsCookies: true,
        acceptCookies: false, // cookies should be accepted, session is stored locally
        releaseNotified: false,
        mode: 'dark', // or light
        displayLayer: 'narrative',
        changeBackgroundColor: (backgroundColor) => {
          const header = document.getElementById('Header_background')
          document.body.style.backgroundColor = backgroundColor
          // change header backgroundColor too...
          if (header) {
            header.style.backgroundColor = backgroundColor
          }
          return set({ backgroundColor })
        },
        setAcceptCookies: () => {
          const state = get()
          set({ ...state, acceptCookies: true })
        },
        setAcceptAnalyticsCookies: (value) => {
          const state = get()
          set({ ...state, acceptAnalyticsCookies: Boolean(value) })
        },
        getPersistentState: () => {
          const state = get()
          return { ...state }
        },
        setDisplayLayer: (value) => {
          const state = get()
          console.info('setDisplayLayer', value)
          set({ ...state, displayLayer: value })
        },
        setReleaseNotified: (releaseNotifiedDate = new Date()) => {
          const state = get()
          set({
            ...state,
            releaseNotified: releaseNotifiedDate.toISOString(),
          })
        },
      }),
      {
        name: 'JournalOfDigitalHistory',
      },
    ),
  ),
)

/**
 * A store for dummy props
 */
export const usePropsStore = create((set) => ({
  loadingProgress: 0,
  loadingLabel: '',
  setLoadingProgress: (loadingProgress, loadingLabel = '') =>
    set({ loadingProgress, loadingLabel }),
  setLoadingProgressFromEvent: (e, loadingLabel = '', ratio = 1, initial = 0) => {
    const { total, loaded } = e
    const loadingProgress = Math.max(1, initial + ratio * (total ? loaded / total : 0))
    set({ loadingProgress, loadingLabel })
  },
}))

export const useWindowStore = create((set) => ({
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
  setWindowDimensions: (windowWidth, windowHeight) => set({ windowWidth, windowHeight }),
  scrollY: 0,
  scrollX: 0,
  setScrollPosition: (scrollX, scrollY) => set({ scrollX, scrollY }),
}))
