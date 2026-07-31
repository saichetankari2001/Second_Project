import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDeviceOrientation } from './useDeviceOrientation'

describe('useDeviceOrientation', () => {
  const originalDeviceOrientationEvent = window.DeviceOrientationEvent

  afterEach(() => {
    window.DeviceOrientationEvent = originalDeviceOrientationEvent
  })

  it('does nothing when DeviceOrientationEvent is unsupported', () => {
    delete window.DeviceOrientationEvent
    const pointerRef = { current: { x: 0, y: 0 } }
    const { result } = renderHook(() => useDeviceOrientation(pointerRef))
    expect(result.current.needsPermission).toBe(false)
  })

  it('listens immediately and updates the pointer ref when no permission is required', () => {
    window.DeviceOrientationEvent = function DeviceOrientationEvent() {}
    const pointerRef = { current: { x: 0, y: 0 } }
    const { result } = renderHook(() => useDeviceOrientation(pointerRef))
    expect(result.current.needsPermission).toBe(false)

    act(() => {
      window.dispatchEvent(
        Object.assign(new Event('deviceorientation'), { beta: 22.5, gamma: -22.5 })
      )
    })

    expect(pointerRef.current.x).toBeCloseTo(-0.5)
    expect(pointerRef.current.y).toBeCloseTo(0.5)
  })

  it('requires a permission request on iOS-style browsers, and attaches the listener once granted', async () => {
    window.DeviceOrientationEvent = function DeviceOrientationEvent() {}
    window.DeviceOrientationEvent.requestPermission = vi.fn().mockResolvedValue('granted')
    const pointerRef = { current: { x: 0, y: 0 } }
    const { result } = renderHook(() => useDeviceOrientation(pointerRef))
    expect(result.current.needsPermission).toBe(true)

    await act(async () => {
      await result.current.requestPermission()
    })

    expect(window.DeviceOrientationEvent.requestPermission).toHaveBeenCalled()
    expect(result.current.needsPermission).toBe(false)

    act(() => {
      window.dispatchEvent(
        Object.assign(new Event('deviceorientation'), { beta: 45, gamma: 45 })
      )
    })
    expect(pointerRef.current.x).toBeCloseTo(1)
    expect(pointerRef.current.y).toBeCloseTo(1)
  })
})
