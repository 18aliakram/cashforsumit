---
name: web3d-integration-patterns
description: Meta-skill for combining Three.js, GSAP ScrollTrigger, React Three Fiber, Motion, and React Spring for complex 3D web experiences. Use when building applications that integrate multiple 3D and animation libraries, requiring architecture patterns, state management, and performance optimization across the stack. Triggers on tasks involving library integration, multi-library architectures, scroll-driven 3D experiences, physics-based 3D animations, or complex interactive 3D applications.
---

# Web 3D Integration Patterns

## Overview

This meta-skill provides architectural patterns, best practices, and integration strategies for combining multiple 3D and animation libraries in web applications. It synthesizes knowledge from threejs-webgl, gsap-scrolltrigger, react-three-fiber, motion-framer, and react-spring-physics into cohesive patterns for building complex, performant 3D web experiences.

**When to use this skill:**
- Building complex 3D applications that combine multiple libraries
- Creating scroll-driven 3D experiences with animation orchestration
- Implementing physics-based interactions with 3D scenes
- Managing state across 3D rendering and UI animations
- Optimizing performance in multi-library architectures
- Designing reusable component architectures for 3D applications

**Core Integration Combinations:**
1. **Three.js + GSAP** - Scroll-driven 3D animations, timeline orchestration
2. **React Three Fiber + Motion** - State-based 3D with declarative animations
3. **React Three Fiber + GSAP** - Complex 3D sequences in React
4. **React Three Fiber + React Spring** - Physics-based 3D interactions
5. **Three.js + GSAP + React** - Hybrid imperative/declarative 3D

## Architecture Patterns

### Pattern 1: Layered Separation (Three.js + GSAP + React UI)

**Use case:** 3D scene with overlaid UI, scroll-driven animations

```javascript
// App.jsx - React root
import { useEffect, useRef } from 'react'
import { initThreeScene } from './three/scene'
import { initScrollAnimations } from './animations/scroll'
import { motion } from 'framer-motion'

function App() {
  const canvasRef = useRef()
  const sceneRef = useRef()

  useEffect(() => {
    // Initialize Three.js scene
    sceneRef.current = initThreeScene(canvasRef.current)

    // Initialize GSAP ScrollTrigger animations
    initScrollAnimations(sceneRef.current)

    return () => {
      sceneRef.current.dispose()
    }
  }, [])

  return (
    <div className="app">
      <canvas ref={canvasRef} />

      <motion.div
        className="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <section className="hero">
          <h1>3D Experience</h1>
        </section>
      </motion.div>
    </div>
  )
}
```

### Pattern 2: Declarative React 3D (React Three Fiber + Motion)

```javascript
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion-3d'

function AnimatedBox() {
  return (
    <motion.mesh
      animate={{ rotateY: Math.PI * 2 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </motion.mesh>
  )
}
```

### Performance Optimization Guidelines

1. **Render Loop Control**: Only render frames when scene updates or during active animations.
2. **Asset Management**: Preload 3D assets (`.gltf`, `.glb`) with loading fallbacks.
3. **GPU Memory Cleanup**: Dispose geometries, materials, and textures on unmount.
