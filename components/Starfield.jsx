import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

const Starfield = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    mount.style.position = 'fixed'
    mount.style.top = '0'
    mount.style.left = '0'
    mount.style.width = '100%'
    mount.style.height = '100%'
    mount.style.zIndex = '-1'

    // Scene & Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    mount.appendChild(renderer.domElement)

    // Starfield
    const starCount = 10000
    const starMaxDistance = 1000
    const starSpeed = 1
    const geometry = new THREE.BufferGeometry()
    const positions = []
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)
      const r = Math.random() * starMaxDistance
      positions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      )
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

    const palette = [
      [1.0, 0.5, 0.5],
      [1.0, 0.75, 0.4],
      [1.0, 1.0, 0.9],
      [1.0, 1.0, 1.0],
      [0.4, 0.5, 1.0],
    ]
    const colors = []
    for (let i = 0; i < starCount; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)]
      colors.push(...c)
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const originalColors = geometry.attributes.color.array.slice()
    const timers = new Float32Array(starCount)
    const sparkColors = new Float32Array(starCount * 3)
    const sparkleDuration = 180

    const material = new THREE.PointsMaterial({ size: 1, sizeAttenuation: true, vertexColors: true })
    const stars = new THREE.Points(geometry, material)
    scene.add(stars)

    let targetY = 0
    const damping = 0.05
    const onScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      targetY = pct * Math.PI * 2
    }
    window.addEventListener('scroll', onScroll)

    const tailLength = 50
    const shootingStars = []
    let shootingStarCooldown = 0; // Prevent too many at once
    // Enhanced shooting star effect
    function spawnShootingStar() {
      // Spawn farther away from camera, in the distance, and not directly in front
      const minAngle = Math.PI / 10; // 18 degrees away from camera center
      const maxAngle = Math.PI / 3;  // up to 60 degrees from camera center
      const minDistance = 400; // never closer than this
      const cameraDir = new THREE.Vector3();
      camera.getWorldDirection(cameraDir);
      let spawnDir, angleFromCenter;
      do {
        // Random angle between minAngle and maxAngle from camera direction
        angleFromCenter = minAngle + (maxAngle - minAngle) * Math.random();
        // Random azimuth
        const azimuth = Math.random() * 2 * Math.PI;
        // Spherical coordinates
        spawnDir = cameraDir.clone();
        // Rotate spawnDir by angleFromCenter around a random perpendicular axis
        const axis = new THREE.Vector3(Math.cos(azimuth), Math.sin(azimuth), 0).normalize();
        spawnDir.applyAxisAngle(axis, angleFromCenter).normalize();
      } while (spawnDir.dot(cameraDir) > Math.cos(minAngle));
      const distance = minDistance + Math.random() * (starMaxDistance - minDistance);
      const startPos = camera.position.clone().add(spawnDir.clone().multiplyScalar(distance));
      // Ensure direction is always away from camera
      const away = spawnDir;
      // Add a small random perpendicular component for variety
      let perp = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1);
      perp = perp.sub(perp.clone().projectOnVector(away)).normalize();
      const dir = away.clone().add(perp.multiplyScalar(Math.random() * 0.5)).normalize();
      // Make the speed much slower
      const speed = starSpeed * (10 + Math.random() * 10); // 10-20 units per frame
      const geo = new THREE.SphereGeometry(1, 8, 8); // Smaller, more distant
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffee, emissive: 0xffffee, emissiveIntensity: 2 });
      const star = new THREE.Mesh(geo, mat);
      star.position.copy(startPos);
      star.velocity = dir.clone().multiplyScalar(speed);
      star.life = 1.0;

      // Pretty, glowing tail using points (sprites) instead of a line
      const tailLen = 200 + Math.random() * 100;
      const tailSegments = 24;
      const tailPoints = [];
      const tailColors = [];
      for (let i = 0; i < tailSegments; i++) {
        // Position along the tail
        const t = i / (tailSegments - 1);
        // Position fades away from the star
        tailPoints.push(dir.clone().negate().multiplyScalar(tailLen * t));
        // Color/alpha: bright at head, fades at tail
        const alpha = (1 - t) * 0.7;
        // Soft yellow-white gradient
        tailColors.push(1.0, 1.0, 0.85, alpha);
      }
      const tailGeo = new THREE.BufferGeometry();
      tailGeo.setFromPoints(tailPoints);
      tailGeo.setAttribute('color', new THREE.Float32BufferAttribute(tailColors, 4));
      // Use a round sprite for each point
      const sprite = new THREE.TextureLoader().load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/sprites/circle.png');
      const tailMat = new THREE.PointsMaterial({
        size: 16,
        map: sprite,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const tail = new THREE.Points(tailGeo, tailMat);
      tail.position.copy(star.position);
      tail.life = 1.0;
      scene.add(star);
      scene.add(tail);
      shootingStars.push({ mesh: star, tail, velocity: star.velocity, dir, fade: false, tailPoints });
    }

    const animate = () => {
      requestAnimationFrame(animate)
      camera.rotation.y += (targetY - camera.rotation.y) * damping
      camera.translateZ(-starSpeed)

      // Spawn shooting star occasionally, but not too frequently
      // Decrease shooting star frequency for a more subtle effect
      if (shootingStarCooldown <= 0 && Math.random() < 0.05) { // 5% chance per frame
        spawnShootingStar();
        shootingStarCooldown = 30 + Math.random() * 40; // 0.5-1.2 seconds
      } else if (shootingStarCooldown > 0) {
        shootingStarCooldown--;
      }

      const posArr = geometry.attributes.position.array
      const sqDist = starMaxDistance * starMaxDistance
      for (let i = 0; i < posArr.length; i += 3) {
        const dx = posArr[i] - camera.position.x
        const dy = posArr[i + 1] - camera.position.y
        const dz = posArr[i + 2] - camera.position.z
        if (dx*dx + dy*dy + dz*dz > sqDist) {
          const theta = Math.random() * 2 * Math.PI
          const phi = Math.acos(2 * Math.random() - 1)
          posArr[i] = camera.position.x + starMaxDistance * Math.sin(phi) * Math.cos(theta)
          posArr[i+1] = camera.position.y + starMaxDistance * Math.sin(phi) * Math.sin(theta)
          posArr[i+2] = camera.position.z + starMaxDistance * Math.cos(phi)
        }
      }
      geometry.attributes.position.needsUpdate = true

      const colArr = geometry.attributes.color.array
      for (let i = 0; i < posArr.length; i += 3) {
        const idx = i/3
        const dist = Math.sqrt(posArr[i]*posArr[i] + posArr[i+1]*posArr[i+1] + posArr[i+2]*posArr[i+2])
        if (timers[idx] > 0) timers[idx]--
        else if (dist > starMaxDistance*0.3 && Math.random() < 0.05) {
          timers[idx] = sparkleDuration
          const c = palette[Math.floor(Math.random()*palette.length)]
          sparkColors[i] = c[0]; sparkColors[i+1] = c[1]; sparkColors[i+2] = c[2]
        }
        if (timers[idx] > 0) {
          colArr[i] = sparkColors[i]; colArr[i+1] = sparkColors[i+1]; colArr[i+2] = sparkColors[i+2]
        } else {
          colArr[i] = originalColors[i]; colArr[i+1] = originalColors[i+1]; colArr[i+2] = originalColors[i+2]
        }
      }
      geometry.attributes.color.needsUpdate = true

      stars.rotation.x += 0.0001
      stars.rotation.y += 0.00015

      // Remove extra random spawn for shooting stars
      // (no additional random spawns, only above logic)
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const obj = shootingStars[i];
        // Move shooting star in world space, independent of camera
        obj.mesh.position.add(obj.velocity);
        // Update tail points to follow star's path in world space
        for (let j = obj.tailPoints.length - 1; j > 0; j--) {
          obj.tailPoints[j].copy(obj.tailPoints[j - 1]);
        }
        obj.tailPoints[0] = obj.mesh.position.clone();
        obj.tail.geometry.setFromPoints(obj.tailPoints);
        // Update tail alpha gradient
        const colors = obj.tail.geometry.attributes.color.array;
        for (let j = 0; j < obj.tailPoints.length; j++) {
          // Alpha fades out with both tail position and star life
          colors[j * 4 + 3] = (1 - j / (obj.tailPoints.length - 1)) * 0.7 * Math.max(0, obj.mesh.life);
        }
        obj.tail.geometry.attributes.color.needsUpdate = true;
        obj.tail.position.set(0, 0, 0); // tail points are absolute
        obj.tail.life -= 0.01;
        obj.mesh.life -= 0.01;
        // Fade the tail smoothly based on life
        obj.tail.material.opacity = 1.0;
        if (obj.mesh.life <= 0) {
          scene.remove(obj.mesh);
          scene.remove(obj.tail);
          shootingStars.splice(i, 1);
        }
      }

      const cam = camera.position.clone()
      for (let i = 0; i < posArr.length; i += 3) {
        posArr[i] -= cam.x; posArr[i+1] -= cam.y; posArr[i+2] -= cam.z
      }
      geometry.attributes.position.needsUpdate = true
      shootingStars.forEach(obj => {
        obj.mesh.position.sub(cam);
        obj.tail.position.sub(cam);
      })
      camera.position.set(0, 0, 0)
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} />
}

export default Starfield
