import { useRef } from 'react'
import Orb from '../vendor/react-bits/Orb'
import { useDeviceOrientation } from '../hooks/useDeviceOrientation'

export function Hero3DScene() {
  const pointer = useRef({ x: 0, y: 0 })
  const { needsPermission, requestPermission } = useDeviceOrientation(pointer)

  function handlePointerMove(event) {
    pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1
  }

  return (
    <div className="hero-canvas-wrapper" onPointerMove={handlePointerMove}>
      <div className="hero-orb-frame">
        <Orb
          hue={0}
          hoverIntensity={0.3}
          rotateOnHover
          backgroundColor="#08090c"
          pointerRef={pointer}
        />
      </div>
      {needsPermission && (
        <button
          type="button"
          className="hero-motion-permission"
          onClick={requestPermission}
        >
          Enable motion
        </button>
      )}
    </div>
  )
}
