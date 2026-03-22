import { useEffect, useRef, useState, useCallback } from 'react'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function useAutoSave<T>(
  data: T,
  saveFn: (data: T) => Promise<void>,
  delay: number = 1500
) {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const isFirstRender = useRef(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  const saveFnRef = useRef(saveFn)
  useEffect(() => {
    saveFnRef.current = saveFn
  }, [saveFn])

  const flush = useCallback(async (dataToSave: T) => {
    setStatus('saving')
    try {
      await saveFnRef.current(dataToSave)
      setStatus('saved')
      
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
      savedTimerRef.current = setTimeout(() => {
        setStatus('idle')
      }, 2000)
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (timerRef.current) clearTimeout(timerRef.current)
    
    setStatus('idle') // show pending while timer runs

    timerRef.current = setTimeout(() => {
      flush(data)
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [data, delay, flush])

  // Ability to force a save immediately
  const manualSave = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    await flush(data)
  }, [data, flush])

  return { status, manualSave }
}
