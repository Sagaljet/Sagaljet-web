"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, MeshDistortMaterial, Sphere } from "@react-three/drei"
import type * as THREE from "three"

function CMYKSpheres() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.1
    }
  })

  const spheres = useMemo(
    () => [
      { position: [-2, 0, 0], color: "#00FFFF", name: "cyan" }, // Cyan
      { position: [2, 0, 0], color: "#FF00FF", name: "magenta" }, // Magenta
      { position: [0, 2, 0], color: "#FFFF00", name: "yellow" }, // Yellow
      { position: [0, -2, 0], color: "#000000", name: "black" }, // Black (Key)
    ],
    [],
  )

  return (
    <group ref={groupRef}>
      {spheres.map((sphere) => (
        <Sphere key={sphere.name} args={[1, 64, 64]} position={sphere.position as [number, number, number]}>
          <MeshDistortMaterial
            color={sphere.color}
            attach="material"
            distort={0.3}
            speed={1.5}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      ))}
    </group>
  )
}

function PrinterGeometry() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2
    }
  })

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1.5, 0.4, 128, 16]} />
      <meshStandardMaterial
        color="#2f3292"
        metalness={0.8}
        roughness={0.2}
        emissive="#e20613"
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

export default function Hero3D() {
  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#2f3292] to-[#e20613] opacity-90">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full bg-white/10 backdrop-blur-sm" />
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000", 0)
        }}
      >
        <color attach="background" args={["#2f3292"]} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#e20613" />
        <pointLight position={[0, 0, 5]} intensity={1} color="#ffffff" />

        {/* 3D Elements */}
        <CMYKSpheres />
        <PrinterGeometry />

        {/* Controls - disabled for auto-rotation only */}
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2f3292]/80 to-[#e20613]/80 pointer-events-none" />
    </div>
  )
}
