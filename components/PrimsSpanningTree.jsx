import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';

const CosmicNebula = () => {
  const mountRef = useRef(null);
  const requestRef = useRef(null);
  const timeRef = useRef(0);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const materialsRef = useRef([]);
  const particleSystemsRef = useRef([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Performance detection for auto config
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const performanceMode = isMobile ? 'low' : 'high';
    
    const config = {
      low: {
        particleCount: 10000,
        nebulaClouds: 2,
        starCount: 500,
        pixelRatio: 0.75
      },
      high: {
        particleCount: 25000, 
        nebulaClouds: 5,
        starCount: 1500,
        pixelRatio: Math.min(window.devicePixelRatio, 1.5)
      }
    };
    
    const settings = config[performanceMode];
    console.log(`Running in ${performanceMode} performance mode`);

    // Scene setup with fog for depth
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Deep space background color
    const bgColor = new THREE.Color('#020410');
    scene.background = bgColor;
    scene.fog = new THREE.FogExp2(bgColor, 0.001);
    
    // Camera with wide field of view for immersive feel
    const camera = new THREE.PerspectiveCamera(
      60, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      2000
    );
    camera.position.set(0, 0, 70);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer with antialiasing and high precision for better colors
    const renderer = new THREE.WebGLRenderer({ 
      antialias: performanceMode === 'high',
      powerPreference: 'high-performance',
      precision: performanceMode === 'high' ? 'highp' : 'mediump',
      stencil: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(settings.pixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create a subtle ambient light
    const ambientLight = new THREE.AmbientLight(0x222266, 0.5);
    scene.add(ambientLight);
    
    // Add a key light to highlight the particles
    const mainLight = new THREE.DirectionalLight(0x6666ff, 1.5);
    mainLight.position.set(100, 100, 100);
    scene.add(mainLight);
    
    // Add fill light from another angle
    const fillLight = new THREE.DirectionalLight(0xff6688, 1.0);
    fillLight.position.set(-100, -50, -100);
    scene.add(fillLight);

    // Create starfield for background
    const createStars = () => {
      const starsGeometry = new THREE.BufferGeometry();
      const starPositions = [];
      const starSizes = [];
      const starColors = [];
      
      // Create random star positions in a spherical distribution
      for (let i = 0; i < settings.starCount; i++) {
        // Use spherical distribution for stars
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 50 + Math.random() * 950; // Stars from 50 to 1000 units away
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        starPositions.push(x, y, z);
        
        // Vary the star sizes
        const size = Math.random() * 3 + 0.5;
        starSizes.push(size);
        
        // Create different colored stars - mostly white/blue but some yellow and red
        let color = new THREE.Color();
        const colorRoll = Math.random();
        
        if (colorRoll > 0.92) {
          // Red giant
          color.setHSL(0.05, 1.0, 0.7); 
        } else if (colorRoll > 0.8) {
          // Yellow star
          color.setHSL(0.15, 1.0, 0.7);
        } else if (colorRoll > 0.4) {
          // White star
          color.setHSL(0.6, 0.2, 0.7);
        } else {
          // Blue star
          color.setHSL(0.6, 1.0, 0.7);
        }
        
        starColors.push(color.r, color.g, color.b);
      }
      
      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
      starsGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
      starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
      
      // Create a texture for the stars
      const starTexture = createPointTexture();
      
      // Star material with custom shader for better looking stars
      const starsMaterial = new THREE.ShaderMaterial({
        uniforms: {
          pointTexture: { value: starTexture }
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / length(mvPosition.xyz));
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform sampler2D pointTexture;
          varying vec3 vColor;
          void main() {
            gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
          }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true,
        vertexColors: true
      });
      
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);
      materialsRef.current.push(starsMaterial);
      
      return stars;
    };
    
    // Create cosmic cloud/nebula particles
    const createNebulaClouds = () => {
      const cloudSystems = [];
      
      // Multiple cloud systems with different colors and behaviors
      const cloudConfigs = [
        { color: new THREE.Color('#4169E1'), scale: 70, speed: 0.03, name: 'blue' },
        { color: new THREE.Color('#DA70D6'), scale: 85, speed: 0.05, name: 'purple' },
        { color: new THREE.Color('#FF6347'), scale: 90, speed: 0.04, name: 'red' },
        { color: new THREE.Color('#00CED1'), scale: 60, speed: 0.06, name: 'teal' },
        { color: new THREE.Color('#FFD700'), scale: 75, speed: 0.02, name: 'gold' }
      ];
      
      // Create the configured number of cloud systems
      for (let i = 0; i < settings.nebulaClouds; i++) {
        const config = cloudConfigs[i % cloudConfigs.length];
        cloudSystems.push(createNebulaCloud(config));
      }
      
      return cloudSystems;
    };
    
    const createNebulaCloud = (config) => {
      const particleCount = Math.floor(settings.particleCount / settings.nebulaClouds);
      const geometry = new THREE.BufferGeometry();
      
      // Create positions, sizes and opacities for particles
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const opacities = new Float32Array(particleCount);
      const angles = new Float32Array(particleCount);
      
      // Fill arrays with initial values
      for (let i = 0; i < particleCount; i++) {
        // Position particles within a 3D shape (ellipsoid)
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = config.scale * Math.cbrt(Math.random());
        
        // Some randomness in the distribution
        const jitter = 0.2;
        const jx = (Math.random() - 0.5) * jitter * r;
        const jy = (Math.random() - 0.5) * jitter * r;
        const jz = (Math.random() - 0.5) * jitter * r;
        
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) + jx;
        positions[i * 3 + 1] = (r * 0.5) * Math.sin(phi) * Math.sin(theta) + jy; // Flatter in Y
        positions[i * 3 + 2] = r * Math.cos(phi) + jz;
        
        // Color each particle with the base color plus some variation
        const colorVariation = 0.15;
        colors[i * 3] = config.color.r * (1 - colorVariation * Math.random());
        colors[i * 3 + 1] = config.color.g * (1 - colorVariation * Math.random());
        colors[i * 3 + 2] = config.color.b * (1 - colorVariation * Math.random());
        
        // Vary the particle sizes
        sizes[i] = Math.random() * 8 + 2;
        
        // Set initial opacity
        opacities[i] = Math.random() * 0.5 + 0.5;
        
        // Set initial angle for rotation
        angles[i] = Math.random() * Math.PI * 2;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
      geometry.setAttribute('angle', new THREE.BufferAttribute(angles, 1));
      
      // Create a texture for the nebula particles
      const cloudTexture = createCloudTexture();
      
      // Material with custom shader for better-looking particles
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          pointTexture: { value: cloudTexture }
        },
        vertexShader: `
          attribute float size;
          attribute vec3 customColor;
          attribute float opacity;
          attribute float angle;
          varying vec3 vColor;
          varying float vOpacity;
          varying float vAngle;
          uniform float time;
          
          void main() {
            vColor = customColor;
            vOpacity = opacity;
            vAngle = angle;
            
            // Add some movement to the particles
            vec3 pos = position;
            float noise = sin(time * 0.2 + pos.x * 0.3) * cos(time * 0.2 + pos.y * 0.3) * sin(time * 0.2 + pos.z * 0.3);
            pos.x += sin(time * 0.5 + pos.y * 0.1) * 2.0;
            pos.y += cos(time * 0.4 + pos.z * 0.1) * 2.0;
            pos.z += noise * 3.0;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (40.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform sampler2D pointTexture;
          varying vec3 vColor;
          varying float vOpacity;
          varying float vAngle;
          
          void main() {
            // Rotate the texture coordinates
            vec2 coords = gl_PointCoord - 0.5;
            float s = sin(vAngle);
            float c = cos(vAngle);
            coords = vec2(coords.x * c - coords.y * s, coords.x * s + coords.y * c) + 0.5;
            
            vec4 texColor = texture2D(pointTexture, coords);
            gl_FragColor = vec4(vColor, vOpacity) * texColor;
          }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true,
      });
      
      const cloud = new THREE.Points(geometry, material);
      cloud.frustumCulled = false;
      cloud.renderOrder = 10;
      
      // Add some random rotation and offset
      cloud.rotation.x = Math.random() * Math.PI;
      cloud.rotation.y = Math.random() * Math.PI;
      cloud.rotation.z = Math.random() * Math.PI;
      
      const offsetRange = 40;
      cloud.position.set(
        (Math.random() - 0.5) * offsetRange,
        (Math.random() - 0.5) * offsetRange * 0.5,
        (Math.random() - 0.5) * offsetRange
      );
      
      // Store the configuration for animation
      cloud.userData = {
        config,
        initialRotation: {
          x: cloud.rotation.x,
          y: cloud.rotation.y,
          z: cloud.rotation.z
        }
      };
      
      scene.add(cloud);
      materialsRef.current.push(material);
      
      return cloud;
    };
    
    // Helper function to create a point texture
    function createPointTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      
      const context = canvas.getContext('2d');
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = canvas.width / 3;
      
      // Create a radial gradient
      const gradient = context.createRadialGradient(
        centerX, centerY, 0, centerX, centerY, radius
      );
      
      // Add color stops
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.15, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.35, 'rgba(255, 255, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      // Fill with gradient
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Create some star spikes
      context.save();
      context.globalCompositeOperation = 'screen';
      
      for (let i = 0; i < 4; i++) {
        context.save();
        context.translate(centerX, centerY);
        context.rotate(i * Math.PI / 4);
        
        context.beginPath();
        context.moveTo(-radius * 1.5, 0);
        context.lineTo(radius * 1.5, 0);
        context.lineWidth = 1;
        
        const spikeGradient = context.createLinearGradient(
          -radius * 1.5, 0, radius * 1.5, 0
        );
        spikeGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        spikeGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        spikeGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        context.strokeStyle = spikeGradient;
        context.stroke();
        context.restore();
      }
      
      context.restore();
      
      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    }
    
    // Helper function to create a cloud texture
    function createCloudTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      
      const context = canvas.getContext('2d');
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Create a soft cloud shape
      const gradient = context.createRadialGradient(
        centerX, centerY, 0, centerX, centerY, canvas.width / 2
      );
      
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.6)');
      gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Create soft, nebulous texture
      context.globalCompositeOperation = 'screen';
      
      // Add some "wisps" to make it cloudy
      for (let i = 0; i < 7; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = 10 + Math.random() * 30;
        
        const wispGradient = context.createRadialGradient(
          x, y, 0, x, y, radius
        );
        
        wispGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        wispGradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
        
        context.fillStyle = wispGradient;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }
      
      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    }
    
    // Initialize the scene
    const stars = createStars();
    const nebulaClouds = createNebulaClouds();
    particleSystemsRef.current = [stars, ...nebulaClouds];
    
    // Show loading spinner until everything is ready
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Animation loop
    const animate = () => {
      const time = performance.now() * 0.001; // time in seconds
      
      // Gentle camera movement
      const cameraRadius = 80;
      const cameraSpeed = 0.05;
      const cameraHeight = Math.sin(time * 0.1) * 10;
      
      camera.position.x = Math.cos(time * cameraSpeed) * cameraRadius;
      camera.position.z = Math.sin(time * cameraSpeed) * cameraRadius;
      camera.position.y = cameraHeight;
      camera.lookAt(0, 0, 0);
      
      // Rotate nebula clouds
      nebulaClouds.forEach(cloud => {
        const { config, initialRotation } = cloud.userData;
        
        // Slowly rotate the clouds
        cloud.rotation.x = initialRotation.x + time * config.speed * 0.1;
        cloud.rotation.y = initialRotation.y + time * config.speed * 0.2;
        cloud.rotation.z = initialRotation.z + time * config.speed * 0.15;
        
        // Update the time uniform for particle movement
        cloud.material.uniforms.time.value = time;
        
        // Pulse the opacity of particles
        const opacities = cloud.geometry.attributes.opacity.array;
        const positions = cloud.geometry.attributes.position.array;
        
        for (let i = 0; i < opacities.length; i++) {
          const idx = i * 3;
          if (idx < positions.length) {
            const x = positions[idx];
            const y = positions[idx + 1];
            const z = positions[idx + 2];
            
            // Make the particles pulse with different frequencies
            opacities[i] = (
              0.5 + 0.5 * Math.sin(time + x * 0.1) *
              Math.cos(time * 0.7 + y * 0.1) *
              Math.sin(time * 0.5 + z * 0.1)
            );
          }
        }
        
        cloud.geometry.attributes.opacity.needsUpdate = true;
      });
      
      // Render the scene
      renderer.render(scene, camera);
      
      // Request next frame
      requestRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    requestRef.current = requestAnimationFrame(animate);
    
    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      setIsLoading(true);
      window.removeEventListener('resize', handleResize);
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      
      // Dispose of materials, geometries, and textures
      materialsRef.current.forEach(material => {
        if (material.uniforms && material.uniforms.pointTexture) {
          material.uniforms.pointTexture.value.dispose();
        }
        material.dispose();
      });
      
      particleSystemsRef.current.forEach(system => {
        if (system.geometry) {
          system.geometry.dispose();
        }
      });
      
      if (sceneRef.current) {
        // Remove all objects from the scene
        while(sceneRef.current.children.length > 0) { 
          const object = sceneRef.current.children[0];
          sceneRef.current.remove(object);
        }
      }
      
      renderer.dispose();
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return (
    <>
      <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#020410',
          zIndex: 100
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '5px solid rgba(100, 100, 200, 0.1)',
            borderTop: '5px solid rgba(100, 100, 255, 0.8)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      )}
    </>
  );
};

export default CosmicNebula; 