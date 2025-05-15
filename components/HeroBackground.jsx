import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const HeroBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Camera position
    camera.position.z = 30;
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 600; // Doubled the particles
    
    const positionArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount);
    const colorArray = new Float32Array(particlesCount * 3);
    
    // Create color instances for gradient effect
    const color1 = new THREE.Color('#ff6b6b');
    const color2 = new THREE.Color('#ff8787');
    const color3 = new THREE.Color('#80ffea');
    
    for (let i = 0; i < particlesCount; i++) {
      // Position particles in a more interesting pattern - some in a sphere, some scattered
      const radius = Math.random() * 30 + 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      // 70% in sphere formation, 30% scattered
      if (Math.random() > 0.3) {
        positionArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positionArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positionArray[i * 3 + 2] = radius * Math.cos(phi);
      } else {
        positionArray[i * 3] = (Math.random() - 0.5) * 100;
        positionArray[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positionArray[i * 3 + 2] = (Math.random() - 0.5) * 100;
      }
      
      // Varied particle sizes
      scaleArray[i] = Math.random() * 2;
      
      // Assign colors for color gradient
      const mixRatio1 = Math.random();
      const mixRatio2 = Math.random();
      
      let particleColor;
      if (i % 3 === 0) {
        particleColor = color1.clone().lerp(color2, mixRatio1);
      } else if (i % 3 === 1) {
        particleColor = color2.clone().lerp(color3, mixRatio2);
      } else {
        particleColor = color3.clone().lerp(color1, mixRatio1);
      }
      
      colorArray[i * 3] = particleColor.r;
      colorArray[i * 3 + 1] = particleColor.g;
      colorArray[i * 3 + 2] = particleColor.b;
    }
    
    particlesGeometry.setAttribute(
      'position', 
      new THREE.BufferAttribute(positionArray, 3)
    );
    particlesGeometry.setAttribute(
      'scale',
      new THREE.BufferAttribute(scaleArray, 1)
    );
    particlesGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colorArray, 3)
    );
    
    // Create material with vertex colors
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.3,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    // Create points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Add point light for dramatic effect
    const pointLight = new THREE.PointLight(0xff6b6b, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Rotate particles
      particles.rotation.x = elapsedTime * 0.03;
      particles.rotation.y = elapsedTime * 0.02;
      
      // Create wave effect
      const positions = particlesGeometry.attributes.position.array;
      const scales = particlesGeometry.attributes.scale.array;
      
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        // Create wave effect on z-axis
        const x = positions[i3];
        const y = positions[i3 + 1];
        
        // Apply sine wave effect to particle positions
        positions[i3 + 2] += Math.sin(elapsedTime + x * 0.1) * 0.01;
        
        // Pulse size effect
        scales[i] = Math.abs(Math.sin(elapsedTime * 0.5 + i * 0.1)) * 1.5 + 0.5;
      }
      
      particlesGeometry.attributes.position.needsUpdate = true;
      particlesGeometry.attributes.scale.needsUpdate = true;
      
      // Light animation
      pointLight.position.x = Math.sin(elapsedTime * 0.5) * 20;
      pointLight.position.y = Math.cos(elapsedTime * 0.3) * 20;
      pointLight.intensity = 1 + Math.sin(elapsedTime) * 0.5;
      
      // Mouse move effect
      const parallaxX = (mouse.x * 0.5);
      const parallaxY = (mouse.y * 0.5);
      
      particles.position.x += (parallaxX - particles.position.x) * 0.02;
      particles.position.y += (parallaxY - particles.position.y) * 0.02;
      
      // Render
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    // Mouse tracking
    const mouse = { x: 0, y: 0 };
    
    document.addEventListener('mousemove', (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      });
      scene.remove(particles);
      scene.remove(pointLight);
      scene.remove(ambientLight);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="hero-background" 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1
      }}
    />
  );
};

export default HeroBackground; 