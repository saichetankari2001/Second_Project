import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

const COIL_HEIGHT = 12
const COIL_RADIUS = 1.5
const COIL_TURNS = 10
const STRANDS = 3
const COIL_OFFSET_X = 2.2
const TUBE_RADIUS = 0.02
const CURVE_SEGMENTS = 400

const AMBIENT_COUNT = 1000
const BASE_CAMERA = { x: 3.2, y: 1, z: 8.5 }

function buildStrandCurve(strandIndex) {
  const points = []
  for (let i = 0; i <= CURVE_SEGMENTS; i++) {
    const t = i / CURVE_SEGMENTS
    const y = (t - 0.5) * COIL_HEIGHT
    const angle =
      t * Math.PI * 2 * COIL_TURNS + (strandIndex / STRANDS) * Math.PI * 2
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * COIL_RADIUS,
        y,
        Math.sin(angle) * COIL_RADIUS
      )
    )
  }
  return new THREE.CatmullRomCurve3(points)
}

function CoilStrand({ strandIndex }) {
  const geometry = useMemo(() => {
    const curve = buildStrandCurve(strandIndex)
    return new THREE.TubeGeometry(curve, CURVE_SEGMENTS, TUBE_RADIUS, 6, false)
  }, [strandIndex])

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color="#7cf0ff" toneMapped={false} />
    </mesh>
  )
}

function ParticleCoil({ scrollProgress, pointer }) {
  const groupRef = useRef()

  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * (0.15 + scrollProgress.current * 0.4)

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      BASE_CAMERA.x + pointer.current.x * 0.7,
      0.05
    )
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      BASE_CAMERA.y + pointer.current.y * 0.5,
      0.05
    )
    state.camera.lookAt(COIL_OFFSET_X * 0.4, 0, 0)
  })

  return (
    <group ref={groupRef} position={[COIL_OFFSET_X, 0, 0]}>
      {Array.from({ length: STRANDS }, (_, i) => (
        <CoilStrand key={i} strandIndex={i} />
      ))}
    </group>
  )
}

function AmbientField() {
  const ref = useRef()

  const positions = useMemo(() => {
    const array = new Float32Array(AMBIENT_COUNT * 3)
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      array[i * 3] = (Math.random() - 0.5) * 24
      array[i * 3 + 1] = (Math.random() - 0.5) * 16
      array[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4
    }
    return array
  }, [])

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.015
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={AMBIENT_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#1c6a8a"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
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
      <Canvas camera={{ position: [BASE_CAMERA.x, BASE_CAMERA.y, BASE_CAMERA.z], fov: 55 }}>
        <fog attach="fog" args={['#05070d', 6, 26]} />
        <AmbientField />
        <ParticleCoil scrollProgress={scrollProgress} pointer={pointer} />
        <EffectComposer>
          <Bloom
            intensity={2.2}
            luminanceThreshold={0.05}
            luminanceSmoothing={0.6}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
