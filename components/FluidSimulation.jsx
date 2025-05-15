import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const FluidSimulation = () => {
  const mountRef = useRef(null);
  const mousePosition = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create a full screen quad
    const geometry = new THREE.PlaneGeometry(2, 2);
    
    // Shader material for fluid simulation
    const fluidMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        mouse: { value: new THREE.Vector2(0.5, 0.5) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform vec2 mouse;
        varying vec2 vUv;
        
        // Pseudo-random function
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        // Value noise function
        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          
          // Four corners
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          
          // Smooth interpolation
          vec2 u = smoothstep(0.0, 1.0, f);
          
          // Mix
          return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
        }
        
        // Fractal Brownian Motion
        float fbm(vec2 st) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 0.0;
          
          // Octaves
          for (int i = 0; i < 6; i++) {
            value += amplitude * noise(st);
            st *= 2.0;
            amplitude *= 0.5;
          }
          
          return value;
        }
        
        // Distance field
        float sdCircle(vec2 p, float r) {
          return length(p) - r;
        }
        
        void main() {
          // Normalized coordinates
          vec2 uv = vUv;
          vec2 aspect = resolution / min(resolution.x, resolution.y);
          vec2 st = uv * aspect;
          
          // Mouse position
          vec2 m = mouse * aspect;
          
          // Time-based animation
          float t = time * 0.2;
          
          // Distortion from mouse
          float distToMouse = length(st - m);
          float mouseInfluence = smoothstep(0.4, 0.0, distToMouse);
          
          // Flow direction based on mouse
          vec2 flow = normalize(st - m) * 0.05;
          
          // Animate UVs
          vec2 uvT = st + flow * mouseInfluence;
          
          // Create fluid noise patterns
          float f1 = fbm(uvT * 3.0 + vec2(t * 0.5, t * -0.5));
          float f2 = fbm(uvT * 2.0 - vec2(t * -0.5, t * 0.5));
          float f3 = fbm(uvT * 4.0 + vec2(t * -0.2, t * 0.2));
          
          // Combine noise patterns for fluid-like effect
          float fluid = f1 * f2 + f3;
          
          // Create color gradient
          vec3 color1 = vec3(0.1, 0.3, 0.9); // Deep blue
          vec3 color2 = vec3(0.0, 0.8, 0.8); // Cyan
          vec3 color3 = vec3(0.9, 0.3, 0.8); // Purple
          
          // Create final color
          vec3 finalColor = mix(
            mix(color1, color2, fluid),
            color3,
            f3 * mouseInfluence
          );
          
          // Add glow around mouse
          float glow = smoothstep(0.4, 0.0, distToMouse) * 1.5;
          finalColor += vec3(0.9, 0.7, 1.0) * glow;
          
          // Apply vignette
          float vignette = smoothstep(1.2, 0.5, length(uv * 2.0 - 1.0));
          finalColor *= vignette;
          
          // Output with transparency
          float alpha = 0.8;
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      depthTest: false
    });
    
    // Create mesh
    const quad = new THREE.Mesh(geometry, fluidMaterial);
    scene.add(quad);
    
    // Animation variables
    let time = 0;
    let frame = 0;
    
    // Handle mouse movement
    const handleMouseMove = (event) => {
      mousePosition.current.x = event.clientX / window.innerWidth;
      mousePosition.current.y = 1.0 - event.clientY / window.innerHeight;
    };
    
    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      renderer.setSize(width, height);
      fluidMaterial.uniforms.resolution.value.set(width, height);
    };
    
    // Animation loop
    const animate = () => {
      frame = requestAnimationFrame(animate);
      time += 0.01;
      
      // Update uniforms
      fluidMaterial.uniforms.time.value = time;
      fluidMaterial.uniforms.mouse.value.set(mousePosition.current.x, mousePosition.current.y);
      
      renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frame);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.remove(quad);
      geometry.dispose();
      fluidMaterial.dispose();
      renderer.dispose();
    };
  }, []);
  
  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};

export default FluidSimulation; 