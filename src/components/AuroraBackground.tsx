'use client';

import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Shader for the aurora effect
const auroraVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const auroraFragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;

  varying vec2 vUv;
  varying vec3 vPosition;

  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec2 uv = vUv;

    // Mouse influence
    vec2 mouseInfluence = (uMouse - 0.5) * 0.3;

    // Create flowing aurora effect
    float noise1 = snoise(vec3(uv.x * 2.0 + mouseInfluence.x, uv.y * 2.0 + uTime * 0.1, uTime * 0.05));
    float noise2 = snoise(vec3(uv.x * 3.0 - mouseInfluence.y, uv.y * 1.5 + uTime * 0.08, uTime * 0.03 + 100.0));
    float noise3 = snoise(vec3(uv.x * 1.5 + mouseInfluence.x * 0.5, uv.y * 2.5 + uTime * 0.12, uTime * 0.04 + 200.0));

    // Lavender color
    vec3 lavender = vec3(0.72, 0.58, 0.96);
    // Sage color
    vec3 sage = vec3(0.66, 0.79, 0.66);
    // Rose color
    vec3 rose = vec3(1.0, 0.69, 0.77);
    // Cream color
    vec3 cream = vec3(0.98, 0.97, 0.95);

    // Mix colors based on noise
    vec3 color1 = mix(lavender, sage, noise1 * 0.5 + 0.5);
    vec3 color2 = mix(rose, cream, noise2 * 0.5 + 0.5);
    vec3 finalColor = mix(color1, color2, noise3 * 0.5 + 0.5);

    // Add some brightness variation
    float brightness = 0.85 + noise1 * 0.15;
    finalColor *= brightness;

    // Subtle vignette
    float vignette = 1.0 - length((uv - 0.5) * 0.8);
    vignette = smoothstep(0.0, 1.0, vignette);
    finalColor = mix(cream, finalColor, vignette * 0.7 + 0.3);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function AuroraMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    []
  );

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x: e.clientX / window.innerWidth,
      y: 1 - e.clientY / window.innerHeight,
    };
  }, []);

  // Add mouse listener
  useMemo(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [handleMouseMove]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;

      // Smooth mouse lerp
      material.uniforms.uMouse.value.x += (mouseRef.current.x - material.uniforms.uMouse.value.x) * 0.05;
      material.uniforms.uMouse.value.y += (mouseRef.current.y - material.uniforms.uMouse.value.y) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={auroraVertexShader}
        fragmentShader={auroraFragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

// Floating orbs for depth
function FloatingOrbs() {
  const groupRef = useRef<THREE.Group>(null);

  const orbs = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        -2 - Math.random() * 3,
      ] as [number, number, number],
      scale: 0.2 + Math.random() * 0.5,
      speed: 0.2 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
      color: i % 3 === 0
        ? '#B794F6'
        : i % 3 === 1
        ? '#A8C9A8'
        : '#FFB0C4',
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const orb = orbs[i];
        child.position.y = orb.position[1] + Math.sin(state.clock.elapsedTime * orb.speed + orb.offset) * 0.5;
        child.position.x = orb.position[0] + Math.cos(state.clock.elapsedTime * orb.speed * 0.5 + orb.offset) * 0.3;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb) => (
        <mesh key={orb.id} position={orb.position}>
          <sphereGeometry args={[orb.scale, 16, 16]} />
          <meshBasicMaterial
            color={orb.color}
            transparent
            opacity={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <AuroraMesh />
        <FloatingOrbs />
      </Canvas>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
