import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 2000
const TUNNEL_LENGTH = 40
const TUNNEL_RADIUS = 3

function ParticleTunnel({ scrollProgress, pointer }) {
  const pointsRef = useRef()

  const positions = useMemo(() => {
    const array = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = TUNNEL_RADIUS * (0.6 + Math.random() * 0.4)
      const z = (Math.random() - 0.5) * TUNNEL_LENGTH
      array[i * 3] = Math.cos(angle) * radius
      array[i * 3 + 1] = Math.sin(angle) * radius
      array[i * 3 + 2] = z
    }
    return array
  }, [])

  useFrame((state, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.z += delta * 0.05

    const targetZ = scrollProgress.current * TUNNEL_LENGTH
    pointsRef.current.position.z = THREE.MathUtils.lerp(
      pointsRef.current.position.z,
      targetZ,
      0.05
    )

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      pointer.current.x * 0.3,
      0.05
    )
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      pointer.current.y * 0.3,
      0.05
    )
    state.camera.lookAt(0, 0, targetZ - 10)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#38e0ff"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.85}
      />
    </points>
  )
}

export function Hero3DScene({ scrollProgress }) {
  const pointer = useRef({ x: 0, y: 0 })

  function handlePointerMove(event) {
    pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1
  }

  return (
    <div className="hero-canvas-wrapper" onPointerMove={handlePointerMove}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ParticleTunnel scrollProgress={scrollProgress} pointer={pointer} />
      </Canvas>
    </div>
  )
}
