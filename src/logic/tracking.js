import {useStore} from '../store'

// Getting non-reactive fresh state on demand
let persistentState = useStore.getState()
try {
  const localStorageState = JSON.parse(localStorage.getItem('JournalOfDigitalHistory'));
  if (localStorageState) {
    persistentState = localStorageState
  }
} catch(e) {
  console.warn(e)
}
export const AcceptAnalyticsCookies = Boolean(persistentState.state?.acceptAnalyticsCookies)
export const AcceptCookies = Boolean(persistentState.state?.acceptCookies)
