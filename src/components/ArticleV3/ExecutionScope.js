import create from 'zustand'

function mapObject(obj, fn) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]))
}

function resolveExecuteErrors(result) {
  if (result?.error) return result.error
  return undefined // just for readability
}

export const useExecutionScope = create((set, get) => ({
  cells: {},
  attached: false,
  executing: false,
  restarting: false,
  errors: undefined,
  updateCellSource: (id, source) => {
    const cell = get().cells[id]
    // NOTE: latest source is in state hre and we are using the cell[*].thebe.source to store the original
    // if this becomes confusing, we can store the original in state and use thebe.source for the latest or ignore
    // and pass latest to thebe.execute as we do now
    set(({ cells }) => ({
      cells: { ...cells, [id]: { ...cell, source } },
    }))
  },
  resetCellSource: (id) => {
    const cell = get().cells[id]
    set(({ cells }) => ({
      cells: { ...cells, [id]: { ...cell, source: cell.thebe.source } },
    }))
  },

  //  Set the cell in pending state
  scheduleCell: (id) => {
    const cell = get().cells[id];
    set(({ cells }) => ({
      cells: { ...cells, [id]: { ...cell, scheduled: true }}
    }));
  },

  executeCell: async (id) => {
    const cell = get().cells[id]
    set(({ cells }) => ({
      executing: true,
      cells: { ...cells, [id]: { ...cell, executing: true, scheduled: false } },
    }))
    const errors = resolveExecuteErrors(await cell.thebe.execute(cell.source)) // execute the latest source from state, this does not update thebe.source
    if (errors) console.error(`[useExecutionScope] executeCell error: ${errors}`)
    set(({ cells }) => {
       
      const { [id]: current, ...others } = cells
      return {
        executing: Object.values(others).some((c) => c.executing),
        cells: {
          ...cells,
          [id]: {
            ...cell,
            executing: false,
            scheduled: false,
            success: !errors,
            errors,
            outputs: errors ? [] : cell.thebe.outputs, // on error clear outputs?
          },
        },
        errors,
      }
    })
  },
  executeAll: async () => {
    set(({ cells }) => ({
      executing: true,
      cells: mapObject(cells, (cell) => ({ ...cell, pending: true, errors: undefined })),
    }))
    // caution -  we are relying on a id being stable, sortable and
    // corresponding to the correct cell order for execution
    const orderedKeys = Object.keys(get().cells).map((k) => parseInt(k, 10))
    orderedKeys.sort((a, b) => a - b)

    for (const id of orderedKeys) {
      const cell = get().cells[id]
      set(({ cells }) => ({
        executing: true,
        cells: {
          ...cells, [id]: {
            ...cell,
            executing: true,
            pending: false 
          }
        },
      }))

      const errors = resolveExecuteErrors(await cell.thebe.execute(cell.source)) // execute the latest source from state, this does not update thebe.source

      if (errors) {
        set(({ cells }) => {
          return {
            executing: false,
            cells: {
              ...mapObject(cells, (c) => ({ ...c, executing: false, pending: false })),
              [id]: {
                ...cell,
                executing: false,
                pending: false,
                success: false,
                errors,
                outputs: errors ? [] : cell.thebe.outputs, // on error clear outputs?
              },
            },
            errors,
          }
        })
        break // stop execution
      }

      // success - update cell state
      set(({ cells }) => {
         
        const { [id]: current, ...others } = cells
        return {
          executing: Object.values(others).some((c) => c.executing),
          cells: {
            ...cells,
            [id]: {
              ...cell,
              executing: false,
              pending: false,
              success: true,
              outputs: cell.thebe.outputs,
            },
          },
          errors,
        }
      })
    }
  },
  clearCell: (id) => {
    const cell = get().cells[id]
    cell.thebe.clear() // also clear thebe cell outputs, in case thebe is rendering
    set(({ cells }) => ({
      cells: { ...cells, [id]: { ...cell, errors: undefined, outputs: [] } },
    }))
  },
  clearAll: () => {
    set(({ cells }) => ({
      cells: mapObject(cells, (cell) => {
        return { ...cell, errors: undefined, outputs: [] }
      }),
    }))
  },
  resetCell: (id) => {
    set(({ cells }) => ({
      cells: {
        ...cells,
        [id]: {
          ...cells[id],
          errors: undefined,
          success: false,
          outputs: cells[id].originals,
          source: cells[id].thebe.source,
        },
      },
    }))
  },
  resetAll: () => {
    set(({ cells }) => ({
      cells: mapObject(cells, (cell) => {
        return { ...cell, errors: undefined, outputs: cell.originals, source: cell.thebe.source, success: false }
      }),
    }))
  },
  restartSession: async () => {
    set({ restarting: true })
    await get().session.restart()
    set({ restarting: false })
  },
  attachSession: (session) => {
    set(({ cells }) => ({
      session,
      cells: mapObject(cells, (cell) => {
        // side effect
        cell.session = session
        cell.thebe.attachSession(session)
        return { ...cell, attached: true }
      }),
    }))
  },
  initialise: (executables) =>
    set({
      cells: executables
        ? mapObject(executables, (v) => ({
            id: v.id,
            thebe: v.thebe,
            source: v.source, // typeof v.source === 'string'
            outputs: v.outputs,
            originals: v.outputs, // restore outputs feature?
            attached: false,
            executing: false,
            pending: false,
            scheduled: false,
            success: false,
            errors: undefined,
          }))
        : {},
      attached: false,
      executing: false,
      restarting: false,
      errors: undefined,
    }),
}))
