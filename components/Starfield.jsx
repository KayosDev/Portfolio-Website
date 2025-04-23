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
      const dir = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize();
      const speed = starSpeed * (300 + Math.random() * 200); // Faster, random speed
      const geo = new THREE.SphereGeometry(2, 16, 16); // Slightly larger
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffee, emissive: 0xffffee, emissiveIntensity: 2 });
      const star = new THREE.Mesh(geo, mat);
      star.position.copy(camera.position);
      star.velocity = dir.clone().multiplyScalar(speed);
      star.life = 1.0; // For fading

      // Long, glowing tail
      const tailLen = tailLength * 3 + Math.random() * 50;
      const points = [new THREE.Vector3(0,0,0), dir.clone().negate().multiplyScalar(tailLen)];
      const tailGeo = new THREE.BufferGeometry().setFromPoints(points);
      const tailMat = new THREE.LineBasicMaterial({ color: 0xffffee, transparent: true, opacity: 0.9 });
      const tail = new THREE.Line(tailGeo, tailMat);
      tail.position.copy(star.position);
      tail.life = 1.0;
      scene.add(star);
      scene.add(tail);
      shootingStars.push({ mesh: star, tail, velocity: star.velocity, dir, fade: false });
    }

    const animate = () => {
      requestAnimationFrame(animate)
      camera.rotation.y += (targetY - camera.rotation.y) * damping
      camera.translateZ(-starSpeed)

      // Spawn shooting star occasionally, but not too frequently
      if (shootingStarCooldown <= 0 && Math.random() < 0.08) { // much more common
        spawnShootingStar();
        shootingStarCooldown = 15 + Math.random() * 20; // 0.25-0.5 seconds
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

      if (Math.random() < 0.02) spawnShootingStar()
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const obj = shootingStars[i];
        obj.mesh.position.add(obj.velocity);
        obj.tail.position.copy(obj.mesh.position);
        // Update tail to always point opposite of velocity
        const tailLen = tailLength * 3;
        obj.tail.geometry.setFromPoints([
          new THREE.Vector3(0,0,0),
          obj.velocity.clone().normalize().multiplyScalar(-tailLen)
        ]);
        // Fade out as it gets far away
        const dist = obj.mesh.position.distanceTo(camera.position);
        const fadeStart = starMaxDistance * 0.5;
        if (dist > fadeStart) {
          const fade = 1 - (dist - fadeStart) / (starMaxDistance - fadeStart);
          obj.mesh.material.opacity = Math.max(0, fade);
          obj.mesh.material.transparent = true;
          obj.tail.material.opacity = Math.max(0, fade * 0.8);
          obj.tail.material.transparent = true;
        }
        // Remove when out of bounds or fully faded
        if (dist > starMaxDistance || obj.mesh.material.opacity <= 0.01) {
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
