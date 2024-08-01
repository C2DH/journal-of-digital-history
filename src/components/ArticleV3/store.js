import create from 'zustand'

export const useToCStore = create((set) => ({
  latestVisibleCellIdx: -1,
  visibleCellsIdx: [],
  addVisibleCellIdx: (cellIdx) =>
    set((state) => {
      const copy = [...state.visibleCellsIdx]
      if (!copy.includes(cellIdx)) {
        copy.push(cellIdx)
      }
      return { visibleCellsIdx: copy, latestVisibleCellIdx: cellIdx }
    }),
  removeVisibleCellIdx: (cellIdx) =>
    set((state) => {
      const copy = [...state.visibleCellsIdx]
      const idx = copy.indexOf(cellIdx)
      if (idx > -1) {
        copy.splice(idx, 1)
      }
      return { visibleCellsIdx: copy }
    }),
}))
