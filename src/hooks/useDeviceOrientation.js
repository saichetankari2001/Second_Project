import { useEffect, useState, useCallback, useRef } from 'react'

const TILT_RANGE_DEGREES = 45

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function useDeviceOrientation(pointerRef) {
  const [needsPermission, setNeedsPermission] = useState(false)
  const handlerRef = useRef((event) => {
    if (event.beta == null || event.gamma == null) return
    pointerRef.current.x = clamp(event.gamma / TILT_RANGE_DEGREES, -1, 1)
    pointerRef.current.y = clamp(event.beta / TILT_RANGE_DEGREES, -1, 1)
  })

  useEffect(() => {
    if (typeof window.DeviceOrientationEvent === 'undefined') return
    if (typeof window.DeviceOrientationEvent.requestPermission === 'function') {
      setNeedsPermission(true)
      return
    }
    const handler = handlerRef.current
    window.addEventListener('deviceorientation', handler)
    return () => window.removeEventListener('deviceorientation', handler)
  }, [])

  const requestPermission = useCallback(async () => {
    const result = await window.DeviceOrientationEvent.requestPermission()
    if (result === 'granted') {
      setNeedsPermission(false)
      window.addEventListener('deviceorientation', handlerRef.current)
    }
  }, [])

  return { needsPermission, requestPermission }
}
