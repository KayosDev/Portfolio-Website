import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

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

    // --- Shooting Stars ---
    const tailLength = 50;
    const shootingStars = [];
    let shootingStarCooldown = 0;
    // Spawn a shooting star with a glowing tail
    function spawnShootingStar() {
      // Pick a random direction on the sphere for the spawn location
      const dir = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize();
      const minDist = starMaxDistance * 0.8;
      const maxDist = starMaxDistance * 1.0;
      const dist = minDist + Math.random() * (maxDist - minDist);
      // Place the star at the distant edge
      const spawnPos = dir.clone().multiplyScalar(dist);
      // Tangential velocity: perpendicular to dir
      let tangent = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1);
      tangent = tangent.sub(tangent.clone().projectOnVector(dir)).normalize();
      // Mix in a small radial component (inward or outward)
      const tangentialSpeed = starSpeed * (0.5 + Math.random() * 1.5);
      const radialSpeed = starSpeed * (Math.random() - 0.5) * 0.2; // small inward/outward
      const velocity = tangent.multiplyScalar(tangentialSpeed).add(dir.clone().multiplyScalar(radialSpeed));
      // Star color: random white/yellow/blue
      const colors = [0xffffee, 0xfff2cc, 0xcce6ff, 0xffffff];
      const color = colors[Math.floor(Math.random()*colors.length)];
      // Star brightness
      const brightness = 1.2 + Math.random()*1.5;
      const geo = new THREE.SphereGeometry(1.5 + Math.random(), 16, 16);
      const mat = new THREE.MeshBasicMaterial({ color: color });
      mat.opacity = 0.7 + Math.random()*0.3;
      mat.baseOpacity = mat.opacity; // Save for fade logic
      mat.transparent = true;
      const star = new THREE.Mesh(geo, mat);
      star.position.copy(spawnPos);
      star.velocity = velocity;
      star.normalizedLife = 0.0; // Start at 0, will increase to 1.0
      star.normalizedLifetime = 60 + Math.random() * 30; // Shorter normalizedLifetime: 60-90 frames
      star.age = 0; // Track age in frames
      // --- Realistic Meteor Tail (multi-point, gradient, fading) ---
      const trailSegments = 12;
      const trailPoints = [];
      for (let i = 0; i < trailSegments; i++) {
        trailPoints.push(star.position.clone());
      }
      const tailGeo = new THREE.BufferGeometry().setFromPoints(trailPoints);
      // Per-vertex color (alpha gradient)
      const tailColors = [];
      for (let i = 0; i < trailSegments; i++) {
        // Alpha fades out along the tail
        const alpha = (1 - i / (trailSegments - 1)) * 0.7;
        // Color shifts from head color to faint orange
        const gradientColor = i === 0 ? color : 0xffc080;
        tailColors.push((gradientColor >> 16 & 255) / 255, (gradientColor >> 8 & 255) / 255, (gradientColor & 255) / 255, alpha);
      }
      tailGeo.setAttribute('color', new THREE.Float32BufferAttribute(tailColors, 4));
      // Additive blending for glow
      const tailMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 1.0, blending: THREE.AdditiveBlending });
      const tail = new THREE.Line(tailGeo, tailMat);
      tail.position.copy(star.position);
      // Add to scene
      scene.add(star);
      scene.add(tail);
      shootingStars.push({ mesh: star, tail, velocity: star.velocity, dir, age: 0, normalizedLifetime: star.normalizedLifetime, trailPoints, color, brightness, hasFragmented: false });
    }

    const animate = () => {
      requestAnimationFrame(animate);
      camera.rotation.y += (targetY - camera.rotation.y) * damping;
      camera.translateZ(-starSpeed);

      // --- Shooting star spawning ---
      // DEV: Make shooting stars super common (spawn every frame if cooldown allows)
      if (shootingStarCooldown <= 0 && Math.random() < 1.0) { // Shooting Star Spawn Rate
        spawnShootingStar();
        shootingStarCooldown = 2 + Math.random() * 2; // Very short cooldown
      } else if (shootingStarCooldown > 0) {
        shootingStarCooldown--;
      }
      // Animate shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const obj = shootingStars[i];
        // --- Curved trajectory: add small perpendicular acceleration ---
        let perp = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5);
        perp = perp.sub(perp.clone().projectOnVector(obj.velocity)).normalize().multiplyScalar(0.003 + Math.random()*0.003);
        obj.velocity.add(perp);
        obj.velocity.normalize().multiplyScalar(obj.velocity.length()); // keep speed stable
        obj.mesh.position.add(obj.velocity);
        obj.tail.position.copy(obj.mesh.position);
        // --- Animate multi-point tail ---
        obj.age++;
        const normalizedLife = obj.age / obj.normalizedLifetime;
        // Shift trail points
        obj.trailPoints.pop();
        obj.trailPoints.unshift(obj.mesh.position.clone());
        // Animate tail grow: first 30% of life
        let tailGrow = Math.min(1, normalizedLife / 0.3);
        let activeSegments = Math.floor(obj.trailPoints.length * tailGrow);
        if (activeSegments < 2) activeSegments = 2;
        const visibleTrail = obj.trailPoints.slice(0, activeSegments);
        obj.tail.geometry.setFromPoints(visibleTrail);
        // Animate tail color/alpha gradient (rainbow + flicker + width taper)
        const tailColors = obj.tail.geometry.getAttribute('color');
        for (let j = 0; j < visibleTrail.length; j++) {
          // Alpha fades out along the tail, with high-freq flicker
          let alpha = (1 - j / (visibleTrail.length - 1)) * 0.7;
          alpha *= 0.8 + 0.2 * Math.sin(Date.now()*0.03 + j*0.8 + Math.random()*10);
          // Chromatic aberration: rainbow gradient
          let rainbow = [0xffc080, 0xffe080, 0xffff80, 0x80ffe6, 0x80c0ff, 0xc080ff];
          let gradColor = rainbow[j % rainbow.length];
          // Tail fades out after head: 20% lag
          if (normalizedLife > 0.7) alpha *= Math.max(0, 1 - (normalizedLife - 0.7 - 0.2) / 0.3);
          tailColors.setXYZW(j, (gradColor >> 16 & 255) / 255, (gradColor >> 8 & 255) / 255, (gradColor & 255) / 255, alpha);
        }
        tailColors.needsUpdate = true;
        // --- Animate head: color/size/brightness/flicker/DOF ---
        // Color: blue/white to yellow/orange, with flicker
        let headColor;
        if (normalizedLife < 0.5) {
          headColor = new THREE.Color(obj.color).lerp(new THREE.Color(0xffc080), normalizedLife*2);
        } else {
          headColor = new THREE.Color(0xffc080).lerp(new THREE.Color(0xff4000), (normalizedLife-0.5)*2);
        }
        // Flicker: add high-freq noise to color
        let flicker = 0.85 + 0.3 * Math.sin(Date.now()*0.09 + Math.random()*10);
        headColor.multiplyScalar(flicker);
        obj.mesh.material.color.copy(headColor);
        // Size/brightness: grows, then shrinks, DOF blur for close meteors
        let scale = 1 + 2 * Math.sin(Math.PI * normalizedLife);
        let distToCam = obj.mesh.position.length();
        let dofBlur = distToCam < starMaxDistance * 0.7 ? 0.7 : 1.0;
        obj.mesh.scale.set(scale * dofBlur, scale * dofBlur, scale * dofBlur);
        obj.mesh.material.opacity = (0.5 + 0.5 * Math.sin(Math.PI * normalizedLife)) * (obj.mesh.material.baseOpacity || 1) * dofBlur;
        obj.mesh.material.transparent = true;
        obj.mesh.material.blending = THREE.AdditiveBlending;
        obj.tail.material.blending = THREE.AdditiveBlending;
        // --- Fragmentation: rarely, spawn a fragment meteor ---
        if (!obj.hasFragmented && normalizedLife > 0.5 && Math.random() < 0.01) {
          const fragVel = obj.velocity.clone().applyAxisAngle(new THREE.Vector3(0,1,0), (Math.random()-0.5)*0.3);
          const fragStar = obj.mesh.clone();
          fragStar.position.copy(obj.mesh.position);
          fragStar.velocity = fragVel;
          fragStar.normalizedLife = normalizedLife;
          fragStar.normalizedLifetime = obj.normalizedLifetime * (0.5 + Math.random()*0.5);
          fragStar.age = obj.age;
          fragStar.material = obj.mesh.material.clone();
          // Shorter trail
          const fragTrailPoints = obj.trailPoints.slice();
          const fragTailGeo = new THREE.BufferGeometry().setFromPoints(fragTrailPoints);
          fragTailGeo.setAttribute('color', obj.tail.geometry.getAttribute('color').clone());
          const fragTailMat = obj.tail.material.clone();
          const fragTail = new THREE.Line(fragTailGeo, fragTailMat);
          fragTail.position.copy(fragStar.position);
          scene.add(fragStar);
          scene.add(fragTail);
          shootingStars.push({ mesh: fragStar, tail: fragTail, velocity: fragStar.velocity, dir: obj.dir, age: fragStar.age, normalizedLifetime: fragStar.normalizedLifetime, trailPoints: fragTrailPoints, color: obj.color, brightness: obj.brightness, hasFragmented: true });
          obj.hasFragmented = true;
        }
        // --- Spark burst: rare explosion at end of life ---
        if (!obj.hasSparked && normalizedLife > 0.95 && Math.random() < 0.1) {
          for (let s = 0; s < 8 + Math.floor(Math.random()*8); s++) {
            const sparkGeo = new THREE.SphereGeometry(0.5 + Math.random()*0.5, 8, 8);
            const sparkMat = new THREE.MeshBasicMaterial({ color: 0xfff6c0, transparent: true, opacity: 1, blending: THREE.AdditiveBlending });
            const spark = new THREE.Mesh(sparkGeo, sparkMat);
            spark.position.copy(obj.mesh.position);
            // Random velocity
            spark.sparkVel = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize().multiplyScalar(0.5 + Math.random()*1.2);
            spark.sparkLife = 12 + Math.random()*10;
            spark.sparkAge = 0;
            scene.add(spark);
            // Animate spark in main loop
            if (!window._starSparks) window._starSparks = [];
            window._starSparks.push(spark);
          }
          obj.hasSparked = true;
        }
        // --- Flash: rare bright sphere at endpoint ---
        if (!obj.hasFlashed && normalizedLife > 0.98 && Math.random() < 0.2) {
          const flashGeo = new THREE.SphereGeometry(1, 16, 16);
          const flashMat = new THREE.MeshBasicMaterial({ color: 0xffffee, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
          const flash = new THREE.Mesh(flashGeo, flashMat);
          flash.position.copy(obj.mesh.position);
          scene.add(flash);
          // Animate flash in main loop
          if (!window._starFlashes) window._starFlashes = [];
          window._starFlashes.push({ mesh: flash, age: 0 });
          obj.hasFlashed = true;
        }
        // Remove when normalizedLife is over or out of bounds
        const dist = obj.mesh.position.distanceTo(camera.position);
        if (normalizedLife >= 1.0 || dist > starMaxDistance || obj.mesh.material.opacity <= 0.01) {
          scene.remove(obj.mesh);
          scene.remove(obj.tail);
          shootingStars.splice(i, 1);
        }
      }
      // Animate sparks
      if (window._starSparks) {
        for (let i = window._starSparks.length - 1; i >= 0; i--) {
          const spark = window._starSparks[i];
          spark.position.add(spark.sparkVel);
          spark.sparkAge++;
          spark.material.opacity *= 0.85;
          if (spark.sparkAge > spark.sparkLife) {
            scene.remove(spark);
            window._starSparks.splice(i, 1);
          }
        }
      }
      // Animate flashes
      if (window._starFlashes) {
        for (let i = window._starFlashes.length - 1; i >= 0; i--) {
          const flash = window._starFlashes[i];
          flash.mesh.scale.multiplyScalar(1.15);
          flash.mesh.material.opacity *= 0.85;
          flash.age++;
          if (flash.age > 10) {
            scene.remove(flash.mesh);
            window._starFlashes.splice(i, 1);
          }
        }
      }

      // --- Starfield logic ---
      const posArr = geometry.attributes.position.array;
      const sqDist = starMaxDistance * starMaxDistance;
      for (let i = 0; i < posArr.length; i += 3) {
        const dx = posArr[i] - camera.position.x;
        const dy = posArr[i + 1] - camera.position.y;
        const dz = posArr[i + 2] - camera.position.z;
        if (dx*dx + dy*dy + dz*dz > sqDist) {
          const theta = Math.random() * 2 * Math.PI;
          const phi = Math.acos(2 * Math.random() - 1);
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
