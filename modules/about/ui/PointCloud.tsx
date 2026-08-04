'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface PointCloudProps {
  activeTexture: string;
}

export function PointCloud({ activeTexture }: PointCloudProps) {
  const meshRef = useRef<THREE.Points>(null);
  const tex = useTexture(activeTexture);

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: tex },
    },
    vertexShader: `
      varying vec2 vUv;
      varying float vDepth;
      uniform sampler2D uTexture;
      uniform float uTime;

      void main() {
        vUv = uv;
        vec4 texData = texture2D(uTexture, vUv);
        vDepth = texData.r; 

        vec3 pos = position;
        
        // Displacement: Push vertices out based on brightness
        // This creates the 3D shape from a flat image
        pos.z += texData.r * 2.5; 

        // Lusion Scan Line logic
        float scan = mod(uTime * 0.4, 3.0) - 1.5;
        float dist = smoothstep(0.2, 0.0, abs(pos.y - scan));
        pos.z += dist * 0.3;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = (2.0 + dist * 4.0) * (15.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying float vDepth;
      uniform float uTime;

      void main() {
        // Discard the black background of the image
        if(vDepth < 0.05) discard;

        // Lusion digital cyan color
        vec3 color = vec3(0.3, 0.8, 1.0);
        
        // Add a flicker/glitch effect
        float brightness = sin(uTime * 2.0 + vUv.y * 10.0) * 0.1 + 0.9;
        
        gl_FragColor = vec4(color * brightness, vDepth);
      }
    `,
  }), [tex]);

  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.getElapsedTime();
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTexture.value = tex;
    }
  });

  return (
    <points ref={meshRef} rotation={[0, -0.2, 0]}>
      <planeGeometry args={[4, 5, 256, 256]} />
      <shaderMaterial args={[shaderArgs]} transparent depthTest={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}