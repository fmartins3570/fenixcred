import { useState, useCallback, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'fenix_lead_data'

let listeners = []

function subscribe(listener) {
  listeners = [...listeners, listener]
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY)
}

function notify() {
  listeners.forEach((l) => l())
}

/**
 * Hook para compartilhar dados do lead entre popup e seção personalizada.
 * Persiste em localStorage para sobreviver ao redirect do WhatsApp.
 */
export function useLeadData() {
  const raw = useSyncExternalStore(subscribe, getSnapshot)
  const data = raw ? JSON.parse(raw) : null

  const saveLead = useCallback((leadData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leadData))
    notify()
  }, [])

  const firstName = data?.name
    ? data.name.trim().split(/\s+/)[0]
    : null

  return {
    leadData: data,
    firstName,
    isCaptured: !!data,
    saveLead,
  }
}
