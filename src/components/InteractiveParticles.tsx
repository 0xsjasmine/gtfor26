'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  originalPosition: THREE.Vector3;
  size: number;
  color: THREE.Color;
}

function ParticleSystem() {
  const { viewport } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const targetMouseRef = useRef(new THREE.Vector2(0, 0));

  const particleCount = 80;
  const connectionDistance = 1.5;
  const mouseInfluenceRadius = 2;

  // Initialize particles
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: particleCount }, () => {
      const x = (Math.random() - 0.5) * viewport.width * 1.5;
      const y = (Math.random() - 0.5) * viewport.height * 1.5;
      const z = (Math.random() - 0.5) * 2;

      const colors = [
        new THREE.Color('#B794F6'), // lavender
        new THREE.Color('#A8C9A8'), // sage
        new THREE.Color('#FFB0C4'), // rose
      ];

      return {
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          0
        ),
        originalPosition: new THREE.Vector3(x, y, z),
        size: 0.03 + Math.random() * 0.05,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });
  }, [viewport.width, viewport.height]);

  // Create geometry
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    particles.forEach((particle, i) => {
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;
      colors[i * 3] = particle.color.r;
      colors[i * 3 + 1] = particle.color.g;
      colors[i * 3 + 2] = particle.color.b;
      sizes[i] = particle.size;
    });

    return { positions, colors, sizes };
  }, [particles, particleCount]);

  // Mouse tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    targetMouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;

    // Smooth mouse lerp
    mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.1;
    mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.1;

    const mousePos3D = new THREE.Vector3(
      mouseRef.current.x * viewport.width * 0.5,
      mouseRef.current.y * viewport.height * 0.5,
      0
    );

    const positionsAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;

    // Update particles
    particles.forEach((particle, i) => {
      // Apply velocity
      particle.position.add(particle.velocity);

      // Mouse attraction/repulsion
      const distToMouse = particle.position.distanceTo(mousePos3D);
      if (distToMouse < mouseInfluenceRadius) {
        const force = (1 - distToMouse / mouseInfluenceRadius) * 0.02;
        const direction = new THREE.Vector3()
          .subVectors(particle.position, mousePos3D)
          .normalize();
        particle.velocity.add(direction.multiplyScalar(force));
      }

      // Return to original position
      const returnForce = new THREE.Vector3()
        .subVectors(particle.originalPosition, particle.position)
        .multiplyScalar(0.001);
      particle.velocity.add(returnForce);

      // Damping
      particle.velocity.multiplyScalar(0.98);

      // Boundary wrapping
      const halfWidth = viewport.width * 0.75;
      const halfHeight = viewport.height * 0.75;
      if (particle.position.x < -halfWidth) particle.position.x = halfWidth;
      if (particle.position.x > halfWidth) particle.position.x = -halfWidth;
      if (particle.position.y < -halfHeight) particle.position.y = halfHeight;
      if (particle.position.y > halfHeight) particle.position.y = -halfHeight;

      // Update buffer
      positionsAttr.array[i * 3] = particle.position.x;
      positionsAttr.array[i * 3 + 1] = particle.position.y;
      positionsAttr.array[i * 3 + 2] = particle.position.z;
    });

    positionsAttr.needsUpdate = true;

    // Update connections
    const linePositions: number[] = [];
    const lineColors: number[] = [];

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = particles[i].position.distanceTo(particles[j].position);
        if (dist < connectionDistance) {
          const opacity = 1 - dist / connectionDistance;

          linePositions.push(
            particles[i].position.x, particles[i].position.y, particles[i].position.z,
            particles[j].position.x, particles[j].position.y, particles[j].position.z
          );

          // Mix colors
          const mixedColor = new THREE.Color().lerpColors(
            particles[i].color,
            particles[j].color,
            0.5
          );

          lineColors.push(
            mixedColor.r, mixedColor.g, mixedColor.b,
            mixedColor.r, mixedColor.g, mixedColor.b
          );
        }
      }
    }

    linesRef.current.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
    linesRef.current.geometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(lineColors, 3)
    );
  });

  return (
    <>
      {/* Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
}

export function InteractiveParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ParticleSystem />
      </Canvas>
    </div>
  );
}
