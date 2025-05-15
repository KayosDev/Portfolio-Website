import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const WaveParticles = () => {
  const mountRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create particles
    const particleCount = 5000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    // Wave parameters
    const waveHeight = 4;
    const waveFrequency = 0.5;
    const colorShift = 0.001;
    
    // Initialize particles with position, color, and size
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position particles in a grid pattern
      positions[i3] = (Math.random() - 0.5) * 100; // x
      positions[i3 + 1] = (Math.random() - 0.5) * 100; // y
      positions[i3 + 2] = (Math.random() - 0.5) * 100; // z
      
      // Generate colors based on position
      colors[i3] = 0.5 + Math.sin(positions[i3] * 0.01) * 0.5; // r
      colors[i3 + 1] = 0.5 + Math.sin(positions[i3 + 1] * 0.01) * 0.5; // g
      colors[i3 + 2] = 0.5 + Math.cos(positions[i3 + 2] * 0.01) * 0.5; // b
      
      // Varied sizes
      sizes[i] = Math.random() * 2 + 0.5;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Particle material
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mouseX: { value: 0 },
        mouseY: { value: 0 }
      },
      vertexShader: `
        uniform float time;
        uniform float mouseX;
        uniform float mouseY;
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          
          // Calculate wave effect
          float xDist = position.x - mouseX;
          float yDist = position.y - mouseY;
          float distance = sqrt(xDist * xDist + yDist * yDist);
          
          // Wave calculation
          float frequency = 0.5;
          float amplitude = 8.0;
          float phase = time * 2.0;
          
          // Apply wave offset to z position
          vec3 pos = position;
          pos.z += sin(distance * frequency - phase) * amplitude * exp(-distance * 0.1);
          
          // Apply size variation based on wave
          gl_PointSize = size * (1.0 + 0.5 * sin(distance * frequency - phase));
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          // Create a circular point
          float r = distance(gl_PointCoord, vec2(0.5, 0.5));
          if (r > 0.5) discard;
          
          // Apply soft edge
          float alpha = 1.0 - smoothstep(0.4, 0.5, r);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending
    });
    
    // Create the particle system
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    // Animation variables
    let time = 0;
    let frame = 0;
    
    // Handle mouse movement
    const handleMouseMove = (event) => {
      // Convert mouse position to Three.js coordinate system
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    // Animation loop
    const animate = () => {
      frame = requestAnimationFrame(animate);
      time += 0.01;
      
      // Update shader uniforms
      particleMaterial.uniforms.time.value = time;
      particleMaterial.uniforms.mouseX.value = mousePosition.current.x * 30;
      particleMaterial.uniforms.mouseY.value = mousePosition.current.y * 30;
      
      // Rotate particle system
      particleSystem.rotation.y += 0.001;
      particleSystem.rotation.x += 0.0005;
      
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
      scene.remove(particleSystem);
      particles.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);
  
  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};

export default WaveParticles; 