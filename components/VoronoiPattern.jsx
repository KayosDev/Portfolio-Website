import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const VoronoiPattern = () => {
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
    
    // Shader material for Voronoi diagram
    const voronoiMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        mouse: { value: new THREE.Vector2(0.5, 0.5) },
        cellCount: { value: 12.0 }
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
        uniform float cellCount;
        varying vec2 vUv;
        
        // Function to generate random value
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        // 2D Noise for movement
        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          
          // Four corners
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        
        // Voronoi function
        vec3 voronoi(vec2 uv, float time, float cellDensity) {
          vec2 cellCoords = uv * cellDensity;
          vec2 i_st = floor(cellCoords);
          vec2 f_st = fract(cellCoords);
          
          float minDist = 1.0;
          vec2 minPoint;
          
          // Check surrounding cells
          for (int y = -1; y <= 1; y++) {
            for (int x = -1; x <= 1; x++) {
              vec2 neighbor = vec2(float(x), float(y));
              
              // Random point position
              vec2 point = neighbor + vec2(
                0.5 + 0.4 * sin(time + 5.0 * random(i_st + neighbor)),
                0.5 + 0.4 * cos(time + 6.2 * random(i_st + neighbor + vec2(42.0, 17.0)))
              );
              
              // Calculate distance
              float dist = length(point - f_st);
              
              // Keep the closest point
              if (dist < minDist) {
                minDist = dist;
                minPoint = point;
              }
            }
          }
          
          // Color based on distance and point
          vec3 color = vec3(0.0);
          
          // Distance gradient for cell edges
          float cellEdge = 1.0 - smoothstep(0.01, 0.05, minDist);
          
          // Random color for each cell
          vec3 cellColor = 0.5 + 0.5 * cos(time * 0.2 + vec3(
            random(i_st + minPoint) * 10.0,
            random(i_st + minPoint + vec2(12.34, 56.78)) * 10.0,
            random(i_st + minPoint + vec2(90.12, 34.56)) * 10.0
          ));
          
          // Add color variation based on mouse position
          float mouseDist = length(uv - mouse);
          float mouseInfluence = smoothstep(0.5, 0.0, mouseDist);
          
          cellColor = mix(
            cellColor,
            vec3(1.0, 0.8, 0.2),
            mouseInfluence
          );
          
          // Cell interior fill
          color = mix(
            cellColor * 0.6,
            cellColor,
            smoothstep(0.01, 0.6, minDist)
          );
          
          // Add glow to edges
          color += cellEdge * vec3(0.9, 0.4, 0.1) * 1.5;
          
          // Add slight ambient light gradient
          color += vec3(0.1, 0.0, 0.2) * (1.0 - uv.y);
          
          return color;
        }
        
        void main() {
          // Calculate aspect-correct UVs
          vec2 uv = vUv;
          vec2 aspect = resolution / min(resolution.x, resolution.y);
          vec2 uv2 = (vUv - 0.5) * aspect + 0.5;
          
          // Dynamic cell count affected by mouse
          float dist = length(uv - mouse);
          float dynamicCellCount = cellCount * (1.0 + 3.0 * (1.0 - smoothstep(0.0, 0.8, dist)));
          
          // Generate Voronoi pattern
          vec3 color = voronoi(uv2, time, dynamicCellCount);
          
          // Add time pulse to the pattern
          float pulse = 0.5 + 0.5 * sin(time * 0.5);
          color *= 0.8 + 0.2 * pulse;
          
          // Add vignette
          float vignette = smoothstep(1.0, 0.3, length((uv - 0.5) * 1.5));
          color *= vignette;
          
          // Output
          gl_FragColor = vec4(color, 0.9);
        }
      `,
      transparent: true,
      depthTest: false
    });
    
    // Create mesh
    const quad = new THREE.Mesh(geometry, voronoiMaterial);
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
      voronoiMaterial.uniforms.resolution.value.set(width, height);
    };
    
    // Animation loop
    const animate = () => {
      frame = requestAnimationFrame(animate);
      time += 0.01;
      
      // Update uniforms
      voronoiMaterial.uniforms.time.value = time;
      voronoiMaterial.uniforms.mouse.value.set(mousePosition.current.x, mousePosition.current.y);
      
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
      voronoiMaterial.dispose();
      renderer.dispose();
    };
  }, []);
  
  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};

export default VoronoiPattern; 