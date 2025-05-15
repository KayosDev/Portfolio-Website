import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ShatterEffect = () => {
  const mountRef = useRef(null);
  const mousePosition = useRef({ x: 0.5, y: 0.5 });
  const clickPosition = useRef({ x: 0.5, y: 0.5 });
  const isDestroying = useRef(false);
  const destructionStartTime = useRef(0);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    camera.position.z = 1;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create a texture with a vibrant gradient background
    const canvasTexture = createGradientTexture();
    const texture = new THREE.CanvasTexture(canvasTexture);
    
    // Create a full-screen plane
    const geometry = new THREE.PlaneGeometry(2, 2);
    
    // Custom shader for the shattering effect
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uTexture: { value: texture },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uClick: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uProgress: { value: 0.0 },
        uIntensity: { value: 1.0 },
        uSeed: { value: Math.random() * 100 }
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform sampler2D uTexture;
        uniform vec2 uMouse;
        uniform vec2 uClick;
        uniform vec2 uResolution;
        uniform float uProgress;
        uniform float uIntensity;
        uniform float uSeed;
        
        varying vec2 vUv;
        
        // Random and noise functions
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        vec2 random2(vec2 st) {
          st = vec2(dot(st, vec2(127.1, 311.7)),
                    dot(st, vec2(269.5, 183.3)));
          return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
        }
        
        // Gradient noise
        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          
          vec2 u = f * f * (3.0 - 2.0 * f);
          
          return mix(mix(dot(random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                         dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
                     mix(dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                         dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
        }
        
        // Voronoi function for cell-based shattering
        vec3 voronoi(vec2 x, float seed) {
          vec2 n = floor(x);
          vec2 f = fract(x);

          vec3 m = vec3(8.0);
          for(int j=-1; j<=1; j++) {
            for(int i=-1; i<=1; i++) {
              vec2 g = vec2(float(i), float(j));
              vec2 o = random2(n + g + seed);
              
              // Animate the cells
              o = 0.5 + 0.5 * sin(uTime * 0.5 + 6.2831 * o);
              
              vec2 r = g + o - f;
              float d = dot(r, r);

              if(d < m.x) {
                m = vec3(d, o.x, o.y);
              }
            }
          }
          return m;
        }

        // Cubic pulse for smooth transitions
        float cubicPulse(float c, float w, float x) {
          x = abs(x - c);
          if (x > w) return 0.0;
          x /= w;
          return 1.0 - x * x * (3.0 - 2.0 * x);
        }
        
        void main() {
          // Normalized coordinates
          vec2 uv = vUv;
          vec2 ratio = uResolution / min(uResolution.x, uResolution.y);
          vec2 scaledUv = (uv - 0.5) * ratio + 0.5;
          
          // Get distance from click position
          vec2 clickPos = (uClick - 0.5) * ratio + 0.5;
          float dist = distance(scaledUv, clickPos);
          
          // Apply shattered effect based on distance and progress
          float cellSize = mix(0.05, 0.01, uProgress * 0.5);
          vec3 c = voronoi(scaledUv / cellSize + uSeed, uTime);
          
          // Edge detection for the cells
          float edges = 1.0 - smoothstep(0.02, 0.05, c.x);
          
          // Get the original texture
          vec4 texColor = texture2D(uTexture, uv);
          
          // Apply distortion to the UV coordinates
          float angle = atan(scaledUv.y - clickPos.y, scaledUv.x - clickPos.x);
          float distortionStrength = uProgress * 0.3 * (1.0 - smoothstep(0.0, 0.5, dist));
          float noiseValue = noise(scaledUv * 5.0 + uTime * 0.1) * 0.1;
          
          // Apply outward force from click point
          vec2 direction = normalize(scaledUv - clickPos);
          vec2 displacement = direction * distortionStrength * (1.0 + noiseValue) * uIntensity;
          
          // More intense displacement for pieces farther from center
          displacement *= mix(0.5, 3.0, smoothstep(0.1, 0.5, dist));
          
          // Apply cell-specific displacement
          displacement += vec2(c.y, c.z) * uProgress * 0.1;
          
          // Offset UVs based on calculated displacement
          vec2 distortedUv = uv + displacement;
          
          // Get new distorted color
          vec4 distortedColor = texture2D(uTexture, distortedUv);
          
          // Mix between original and distorted based on progress
          vec4 finalColor = mix(texColor, distortedColor, uProgress);
          
          // Add edge highlighting
          if (uProgress > 0.05) {
            float edgeBrightness = edges * uProgress * 2.0;
            finalColor.rgb += vec3(1.0, 1.0, 1.0) * edgeBrightness;
          }
          
          // Add breaking effect with cracks appearing
          float breakProgress = smoothstep(0.1, 0.3, uProgress);
          float cracksPattern = noise(scaledUv * 10.0) * noise(scaledUv * 20.0 + 0.5);
          float cracks = smoothstep(0.7 - breakProgress * 0.6, 0.75 - breakProgress * 0.6, cracksPattern);
          
          // Create illuminated edges along cracks
          float glowIntensity = cubicPulse(0.5, 0.4, uProgress) * 1.5;
          vec3 crackGlow = vec3(0.9, 0.4, 0.1) * cracks * glowIntensity;
          
          // Apply cracks and glow
          finalColor.rgb += crackGlow;
          
          // Add flying particles
          if (uProgress > 0.3) {
            float particles = smoothstep(0.95, 1.0, random(scaledUv + uTime * 0.1)) * uProgress;
            float particlesBrightness = particles * (1.0 - dist) * 2.0;
            finalColor.rgb += vec3(1.0, 0.7, 0.3) * particlesBrightness;
          }
          
          // Apply fade-out for completely destroyed regions
          float fadeOut = smoothstep(0.7, 0.9, uProgress) * smoothstep(0.0, 0.3, dist);
          finalColor.a = mix(finalColor.a, 0.0, fadeOut);
          
          gl_FragColor = finalColor;
        }
      `,
      transparent: true,
    });
    
    // Create the mesh with the plane and material
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    
    // Function to create gradient texture
    function createGradientTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      
      // Create a radial gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      
      // Add vibrant colors
      gradient.addColorStop(0, '#3a0ca3');
      gradient.addColorStop(0.4, '#4361ee');
      gradient.addColorStop(0.7, '#4cc9f0');
      gradient.addColorStop(1, '#4895ef');
      
      // Fill the canvas
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add some particle/star effects
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2 + 1;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
      }
      
      // Add some swirls
      for (let i = 0; i < 5; i++) {
        const centerX = Math.random() * canvas.width;
        const centerY = Math.random() * canvas.height;
        const radius = Math.random() * 100 + 50;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        
        for (let j = 0; j < 10; j++) {
          const angle = Math.random() * Math.PI * 2;
          const startX = centerX + Math.cos(angle) * radius * 0.5;
          const startY = centerY + Math.sin(angle) * radius * 0.5;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.bezierCurveTo(
            centerX + Math.cos(angle + 1) * radius,
            centerY + Math.sin(angle + 1) * radius,
            centerX + Math.cos(angle + 2) * radius,
            centerY + Math.sin(angle + 2) * radius,
            centerX + Math.cos(angle + 3) * radius * 0.8,
            centerY + Math.sin(angle + 3) * radius * 0.8
          );
          ctx.stroke();
        }
      }
      
      return canvas;
    }
    
    // Event handlers
    const handleMouseMove = (event) => {
      mousePosition.current.x = event.clientX / window.innerWidth;
      mousePosition.current.y = 1.0 - event.clientY / window.innerHeight;
      
      material.uniforms.uMouse.value.x = mousePosition.current.x;
      material.uniforms.uMouse.value.y = mousePosition.current.y;
    };
    
    const handleClick = (event) => {
      // Store click position
      clickPosition.current.x = event.clientX / window.innerWidth;
      clickPosition.current.y = 1.0 - event.clientY / window.innerHeight;
      
      material.uniforms.uClick.value.x = clickPosition.current.x;
      material.uniforms.uClick.value.y = clickPosition.current.y;
      
      // Start or reset destruction
      if (!isDestroying.current) {
        isDestroying.current = true;
        destructionStartTime.current = Date.now() / 1000;
        material.uniforms.uSeed.value = Math.random() * 100; // New seed for different pattern
      } else {
        isDestroying.current = false;
        material.uniforms.uProgress.value = 0;
      }
    };
    
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      
      material.uniforms.uResolution.value.x = width;
      material.uniforms.uResolution.value.y = height;
    };
    
    // Animation loop
    let animationFrame;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      
      // Update time uniform
      material.uniforms.uTime.value = Date.now() / 1000;
      
      // Update destruction progress
      if (isDestroying.current) {
        const elapsedTime = Date.now() / 1000 - destructionStartTime.current;
        const progress = Math.min(elapsedTime / 3.0, 1.0); // Complete in 3 seconds
        material.uniforms.uProgress.value = progress;
        
        // Reset after completion
        if (progress >= 1.0) {
          setTimeout(() => {
            isDestroying.current = false;
            material.uniforms.uProgress.value = 0;
            material.uniforms.uSeed.value = Math.random() * 100;
          }, 1000);
        }
      }
      
      renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
    
    // Auto-start destruction after 1 second
    setTimeout(() => {
      material.uniforms.uClick.value.x = 0.5;
      material.uniforms.uClick.value.y = 0.5;
      isDestroying.current = true;
      destructionStartTime.current = Date.now() / 1000;
    }, 1000);
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.remove(plane);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);
  
  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};

export default ShatterEffect; 