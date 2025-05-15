import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const MarchingCubesDestruction = () => {
  const mountRef = useRef(null);
  const mousePosition = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    
    // Add ambient and directional lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(1, 2, 3);
    scene.add(directionalLight);
    
    // Add point lights for dramatic effect
    const pointLight1 = new THREE.PointLight(0xff3366, 1.5, 8);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x3366ff, 1.5, 8);
    pointLight2.position.set(-2, -2, 2);
    scene.add(pointLight2);

    // Resolution of the marching cubes field
    const resolution = 48;
    
    // Create a 3D grid to hold scalar field values
    const createScalarField = (resolution) => {
      const field = new Float32Array(resolution * resolution * resolution);
      const center = resolution / 2;
      const radius = resolution * 0.3;
      
      // Initialize with a sphere
      for (let z = 0; z < resolution; z++) {
        for (let y = 0; y < resolution; y++) {
          for (let x = 0; x < resolution; x++) {
            const idx = x + y * resolution + z * resolution * resolution;
            const dx = x - center;
            const dy = y - center;
            const dz = z - center;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            field[idx] = radius - distance; // Positive inside, negative outside
          }
        }
      }
      
      return field;
    };

    // Initial scalar field
    let scalarField = createScalarField(resolution);
    let originalField = [...scalarField];
    
    // Create geometry with the marching cubes algorithm
    const createMarchingCubesGeometry = (field, resolution, isolevel) => {
      // Lookup tables for marching cubes algorithm
      const edgeTable = [
        0x0, 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c,
        0x80c, 0x905, 0xa0f, 0xb06, 0xc0a, 0xd03, 0xe09, 0xf00,
        0x190, 0x99, 0x393, 0x29a, 0x596, 0x49f, 0x795, 0x69c,
        0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90,
        0x230, 0x339, 0x33, 0x13a, 0x636, 0x73f, 0x435, 0x53c,
        0xa3c, 0xb35, 0x83f, 0x936, 0xe3a, 0xf33, 0xc39, 0xd30,
        0x3a0, 0x2a9, 0x1a3, 0xaa, 0x7a6, 0x6af, 0x5a5, 0x4ac,
        0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0,
        0x460, 0x569, 0x663, 0x76a, 0x66, 0x16f, 0x265, 0x36c,
        0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a, 0x963, 0xa69, 0xb60,
        0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6, 0xff, 0x3f5, 0x2fc,
        0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0,
        0x650, 0x759, 0x453, 0x55a, 0x256, 0x35f, 0x55, 0x15c,
        0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53, 0x859, 0x950,
        0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5, 0xcc,
        0xfcc, 0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0,
        0x8c0, 0x9c9, 0xac3, 0xbca, 0xcc6, 0xdcf, 0xec5, 0xfcc,
        0xcc, 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9, 0x7c0,
        0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c,
        0x15c, 0x55, 0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650,
        0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6, 0xfff, 0xcf5, 0xdfc,
        0x2fc, 0x3f5, 0xff, 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0,
        0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c,
        0x36c, 0x265, 0x16f, 0x66, 0x76a, 0x663, 0x569, 0x460,
        0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af, 0xaa5, 0xbac,
        0x4ac, 0x5a5, 0x6af, 0x7a6, 0xaa, 0x1a3, 0x2a9, 0x3a0,
        0xd30, 0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c,
        0x53c, 0x435, 0x73f, 0x636, 0x13a, 0x33, 0x339, 0x230,
        0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895, 0x99c,
        0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393, 0x99, 0x190,
        0xf00, 0xe09, 0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c,
        0x70c, 0x605, 0x50f, 0x406, 0x30a, 0x203, 0x109, 0x0
      ];
      
      // Extended triangulation table (partial)
      const triTable = [
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [0, 1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [9, 2, 10, 0, 2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [2, 8, 3, 2, 10, 8, 10, 9, 8, -1, -1, -1, -1, -1, -1, -1],
        [3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [1, 11, 2, 1, 9, 11, 9, 8, 11, -1, -1, -1, -1, -1, -1, -1],
        [3, 10, 1, 11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1, -1, -1, -1, -1, -1],
        [3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, -1],
        [9, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [4, 3, 0, 7, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1, -1, -1, -1, -1],
        [1, 2, 10, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [3, 4, 7, 3, 0, 4, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1],
        [9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1],
        [2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1, -1],
        [8, 4, 7, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [11, 4, 7, 11, 2, 4, 2, 0, 4, -1, -1, -1, -1, -1, -1, -1],
        [9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1],
        [4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, -1],
        [3, 10, 1, 3, 11, 10, 7, 8, 4, -1, -1, -1, -1, -1, -1, -1],
        [1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, -1, -1, -1, -1],
        [4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1, -1],
        [4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, -1],
        // More cases would normally follow for a complete implementation
      ];
      
      // Default triangulation for cases not in the partial table
      const defaultTriangulation = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
      
      // Data structures for the resulting mesh
      const vertices = [];
      const normals = [];
      const indices = [];
      
      // Helper to get field value at a position
      const getField = (x, y, z) => {
        if (x < 0 || y < 0 || z < 0 || 
            x >= resolution || y >= resolution || z >= resolution) {
          return -1; // Outside bounds
        }
        return field[x + y * resolution + z * resolution * resolution];
      };
      
      // Vertex interpolation function
      const vertexInterp = (isolevel, p1, p2, valp1, valp2) => {
        if (Math.abs(isolevel - valp1) < 0.00001) return p1;
        if (Math.abs(isolevel - valp2) < 0.00001) return p2;
        if (Math.abs(valp1 - valp2) < 0.00001) return p1;
        
        const mu = (isolevel - valp1) / (valp2 - valp1);
        return [
          p1[0] + mu * (p2[0] - p1[0]),
          p1[1] + mu * (p2[1] - p1[1]),
          p1[2] + mu * (p2[2] - p1[2])
        ];
      };
      
      // Simplified marching cubes implementation (for demonstration)
      for (let z = 0; z < resolution - 1; z++) {
        for (let y = 0; y < resolution - 1; y++) {
          for (let x = 0; x < resolution - 1; x++) {
            // Calculate cube index based on corner values
            let cubeindex = 0;
            
            // 8 corners of a cube
            const cornerPositions = [
              [x, y, z],
              [x + 1, y, z],
              [x + 1, y, z + 1],
              [x, y, z + 1],
              [x, y + 1, z],
              [x + 1, y + 1, z],
              [x + 1, y + 1, z + 1],
              [x, y + 1, z + 1]
            ];
            
            const cornerValues = cornerPositions.map(pos => 
              getField(pos[0], pos[1], pos[2])
            );
            
            // Determine which vertices are inside/outside the isosurface
            for (let i = 0; i < 8; i++) {
              if (cornerValues[i] > isolevel) {
                cubeindex |= (1 << i);
              }
            }
            
            // If the cube is entirely inside or outside the isosurface, skip it
            if (edgeTable[cubeindex] === 0) continue;
            
            // 12 edges of a cube
            const edgePairs = [
              [0, 1], [1, 2], [2, 3], [3, 0],
              [4, 5], [5, 6], [6, 7], [7, 4],
              [0, 4], [1, 5], [2, 6], [3, 7]
            ];
            
            // Calculate vertex positions on edges where the isosurface cuts through
            const edgeVertices = [];
            for (let i = 0; i < 12; i++) {
              if (edgeTable[cubeindex] & (1 << i)) {
                const [a, b] = edgePairs[i];
                const p1 = cornerPositions[a];
                const p2 = cornerPositions[b];
                const val1 = cornerValues[a];
                const val2 = cornerValues[b];
                
                // Interpolate vertex position
                const vertex = vertexInterp(isolevel, p1, p2, val1, val2);
                
                // Scale to proper coordinates in scene space
                const scaledVertex = [
                  (vertex[0] / resolution - 0.5) * 4,
                  (vertex[1] / resolution - 0.5) * 4,
                  (vertex[2] / resolution - 0.5) * 4
                ];
                
                edgeVertices.push(scaledVertex);
              } else {
                edgeVertices.push(null);
              }
            }
            
            // Get triangulation for current cube index, defaulting to empty if not in our table
            const triangulation = triTable[cubeindex] || defaultTriangulation;
            
            // Create triangles according to the lookup table
            for (let i = 0; triangulation[i] !== -1 && i < triangulation.length; i += 3) {
              // Make sure we have valid indices before accessing
              if (i + 2 < triangulation.length) {
                const triangle = [
                  edgeVertices[triangulation[i]],
                  edgeVertices[triangulation[i + 1]],
                  edgeVertices[triangulation[i + 2]]
                ];
                
                // Make sure all vertices are valid before creating the triangle
                if (triangle.every(v => v !== null)) {
                  const vertexIndexBase = vertices.length / 3;
                  
                  // Add vertices
                  triangle.forEach(v => {
                    vertices.push(v[0], v[1], v[2]);
                  });
                  
                  // Calculate normals (simplified)
                  const [a, b, c] = triangle;
                  const edge1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
                  const edge2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
                  const normal = [
                    edge1[1] * edge2[2] - edge1[2] * edge2[1],
                    edge1[2] * edge2[0] - edge1[0] * edge2[2],
                    edge1[0] * edge2[1] - edge1[1] * edge2[0]
                  ];
                  
                  // Normalize
                  const len = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
                  if (len > 0) {
                    normal[0] /= len;
                    normal[1] /= len;
                    normal[2] /= len;
                  }
                  
                  normals.push(...normal, ...normal, ...normal);
                  
                  // Add triangle indices
                  indices.push(
                    vertexIndexBase,
                    vertexIndexBase + 1,
                    vertexIndexBase + 2
                  );
                }
              }
            }
          }
        }
      }
      
      // Create geometry from generated vertices and faces
      const geometry = new THREE.BufferGeometry();
      
      // Only create the geometry if we have valid data
      if (vertices.length > 0 && normals.length > 0) {
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setIndex(indices);
      } else {
        // Return an empty geometry if no vertices were generated
        console.warn('No vertices generated for marching cubes');
      }
      
      return geometry;
    };
    
    // Create material with iridescent appearance
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.0,
      side: THREE.DoubleSide
    });
    
    // Initial geometry
    let geometry = createMarchingCubesGeometry(scalarField, resolution, 0.0);
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Destruction parameters
    const destructionParams = {
      erosionSpeed: 0.015,
      noiseFrequency: 0.1,
      distortionIntensity: 0.8,
      destroyRadius: 0.25,
      maxDestruction: 0.75
    };

    // Destruction progress
    let destructionProgress = 0;
    let isDestroying = false;
    
    // Noise function for erosion
    const noise3D = (x, y, z) => {
      const p = new THREE.Vector3(x, y, z);
      return 0.5 * (1.0 + Math.sin(p.x * 5.3 + p.y * 1.7 + p.z * 2.5 + destructionProgress * 3.0));
    };
    
    // Update scalar field with erosion
    const updateScalarField = () => {
      if (!isDestroying) return;
      
      // Update destruction progress
      destructionProgress += destructionParams.erosionSpeed;
      destructionProgress = Math.min(destructionProgress, destructionParams.maxDestruction);
      
      const center = resolution / 2;
      
      // Apply erosion to scalar field
      for (let z = 0; z < resolution; z++) {
        for (let y = 0; y < resolution; y++) {
          for (let x = 0; x < resolution; x++) {
            const idx = x + y * resolution + z * resolution * resolution;
            
            // Distance from center
            const dx = (x - center) / center;
            const dy = (y - center) / center;
            const dz = (z - center) / center;
            const distFromCenter = Math.sqrt(dx*dx + dy*dy + dz*dz);
            
            // Generate noise value
            const noiseVal = noise3D(
              x * destructionParams.noiseFrequency,
              y * destructionParams.noiseFrequency,
              z * destructionParams.noiseFrequency
            );
            
            // Apply erosion based on noise and distance
            const erosionFactor = destructionProgress * 
                                 noiseVal * 
                                 Math.max(0, 1 - distFromCenter / destructionParams.destroyRadius);
            
            // Update scalar field
            scalarField[idx] = originalField[idx] - erosionFactor * 20;
          }
        }
      }
      
      try {
        // Re-create the mesh with the updated scalar field
        scene.remove(mesh);
        geometry.dispose();
        
        geometry = createMarchingCubesGeometry(scalarField, resolution, 0.0);
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
      } catch (error) {
        console.error("Error updating marching cubes:", error);
      }
    };
    
    // Toggle destruction state
    const toggleDestruction = () => {
      isDestroying = !isDestroying;
      if (!isDestroying) {
        // Reset when toggled off
        destructionProgress = 0;
        scalarField = [...originalField];
        updateScalarField();
      }
    };
    
    // Start destruction automatically
    setTimeout(() => {
      isDestroying = true;
    }, 1000);
    
    // Handle mouse movement
    const handleMouseMove = (event) => {
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    // Handle click for toggling destruction
    const handleClick = () => {
      toggleDestruction();
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
    let animationFrame;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      
      // Update scalar field for destruction effect
      updateScalarField();
      
      // Rotate the mesh slightly
      if (mesh) {
        mesh.rotation.y += 0.005;
        mesh.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
        
        // Move lights
        pointLight1.position.x = Math.sin(Date.now() * 0.001) * 3;
        pointLight1.position.y = Math.cos(Date.now() * 0.001) * 3;
        
        pointLight2.position.x = -Math.sin(Date.now() * 0.0012) * 3;
        pointLight2.position.y = -Math.cos(Date.now() * 0.0012) * 3;
        
        // Make colors pulse slightly
        const hue = (Date.now() * 0.0002) % 1;
        const color1 = new THREE.Color().setHSL(hue, 0.8, 0.6);
        const color2 = new THREE.Color().setHSL((hue + 0.5) % 1, 0.8, 0.6);
        
        pointLight1.color.set(color1);
        pointLight2.color.set(color2);
      }
      
      renderer.render(scene, camera);
    };
    
    // Start animation
    animate();
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    window.addEventListener('click', handleClick);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrame);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);
  
  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};

export default MarchingCubesDestruction; 