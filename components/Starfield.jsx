import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ChromaticAberrationPass } from './ChromaticAberrationPass';

const Starfield = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    // Defensive: always use .current for refs
    if (!mountRef.current) return;
    const mount = mountRef.current
    mount.style.position = 'fixed'
    mount.style.top = '0'
    mount.style.left = '0'
    mount.style.width = '100%'
    mount.style.height = '100%'
    mount.style.zIndex = '0'

    // Scene & Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000)
    camera.position.set(0, 0, 0);
    // Virtual position to simulate infinite travel
    let virtualCameraPos = new THREE.Vector3(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 1);
    mount.appendChild(renderer.domElement)

    // --- POSTPROCESSING ---
    // Composer
    const composer = new EffectComposer(renderer);
    composer.setSize(window.innerWidth, window.innerHeight);
    // Render pass
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    // Unreal Bloom Pass
    // --- BLOOM (MAX) ---
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      2.5, // strength (max)
      1.2, // radius (max)
      0.12 // threshold (lower = more)
    );
    composer.addPass(bloomPass);

    // --- CLOSE STARS: Separate Scene for Chromatic Aberration ---
    const closeStarsScene = new THREE.Scene();
    const caPass = new ChromaticAberrationPass(new THREE.Vector2(0.0002, 0.0002)); // barely visible
    const caComposer = new EffectComposer(renderer);
    caComposer.setSize(window.innerWidth, window.innerHeight);
    const caRenderPass = new RenderPass(closeStarsScene, camera);
    caComposer.addPass(caRenderPass);
    caComposer.addPass(caPass);

    // --- HANDLE RESIZE AND FULLSCREEN ---
    function resizeAll() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      caComposer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', resizeAll);
    window.addEventListener('fullscreenchange', resizeAll);

    // Starfield
    const starCount = 2000
    const starMaxDistance = 2000
    const starSpeed = 1
    const geometry = new THREE.BufferGeometry()
    const closeGeometry = new THREE.BufferGeometry();
    const positions = [];
    const closePositions = [];
    let starsPlaced = 0;
    while (starsPlaced < starCount) {
      // With 1% chance, spawn a star cluster (10-30 stars)
      if (Math.random() < 0.01 && starsPlaced < starCount - 10) {
        const clusterTheta = Math.random() * 2 * Math.PI;
        const clusterPhi = Math.acos(2 * Math.random() - 1);
        const clusterR = Math.random() * starMaxDistance;
        const clusterCenter = [
          clusterR * Math.sin(clusterPhi) * Math.cos(clusterTheta),
          clusterR * Math.sin(clusterPhi) * Math.sin(clusterTheta),
          clusterR * Math.cos(clusterPhi)
        ];
        const clusterSize = 10 + Math.floor(Math.random() * 20); // 10-30 stars
        for (let c = 0; c < clusterSize && starsPlaced < starCount; c++) {
          // Each star in cluster is within 30 units of center
          const offsetTheta = Math.random() * 2 * Math.PI;
          const offsetPhi = Math.acos(2 * Math.random() - 1);
          const offsetR = Math.random() * 30; // cluster radius
          positions.push(
            clusterCenter[0] + offsetR * Math.sin(offsetPhi) * Math.cos(offsetTheta),
            clusterCenter[1] + offsetR * Math.sin(offsetPhi) * Math.sin(offsetTheta),
            clusterCenter[2] + offsetR * Math.cos(offsetPhi)
          );
          starsPlaced++;
        }
      } else {
        // Normal single star
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = Math.random() * starMaxDistance;
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        positions.push(x, y, z);
        // If close, also add to closePositions
        if (r < 400) {
          closePositions.push(x, y, z);
        }
        starsPlaced++;
      }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    if (closePositions.length > 0) {
      closeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(closePositions, 3));
    }

    // CRAZY BLOOM: All stars are extremely bright (color intensity >1)
    const palette = [
      [3.0, 1.5, 1.5],
      [3.0, 2.25, 1.2],
      [3.0, 3.0, 2.7],
      [3.0, 3.0, 3.0],
      [1.2, 1.5, 3.0],
    ];
    const colors = [];
    for (let i = 0; i < starCount; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors.push(...c);
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const originalColors = geometry.attributes.color.array.slice()
    const timers = new Float32Array(starCount)
    const sparkColors = new Float32Array(starCount * 3)
    const sparkleDuration = 180

    // --- SQUARE STARS USING POINTS ---
const material = new THREE.PointsMaterial({ size: 3.5, sizeAttenuation: true, vertexColors: true });
const stars = new THREE.Points(geometry, material);
scene.add(stars);
// Add glow sprites to each star and animate them based on distance
const glowMap = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/sprites/glow.png');
const glowSprites = [];
const glowMaterial = new THREE.SpriteMaterial({ map: glowMap, color: 0xffffff, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false });
for (let i = 0; i < starCount; i++) {
  const glow = new THREE.Sprite(glowMaterial.clone());
  glow.position.set(positions[i*3], positions[i*3+1], positions[i*3+2]);
  glow.scale.set(10, 10, 1);
  scene.add(glow);
  glowSprites.push(glow);
}
// Add close stars to separate scene
let closeStars;
if (closePositions.length > 0) {
  closeStars = new THREE.Points(closeGeometry, material.clone());
  closeStarsScene.add(closeStars);
}

    let targetY = 0
    const damping = 0.05
    const onScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      targetY = pct * Math.PI * 2
    }
    window.addEventListener('scroll', onScroll)


    // --- Shooting Stars ---
    const tailLength = 32; // Increase for longer tails
    const shootingStars = [];
    let shootingStarCooldown = 0;
    // Spawn a shooting star with a stunning glowing tail
    function spawnShootingStar() {
      // Pick a random direction on the sphere for the spawn location
      const dir = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1).normalize();
      // Ensure shooting stars never spawn close to the camera (at least 70% of max distance)
      const minDist = starMaxDistance * 0.7;
      const maxDist = starMaxDistance * 1.0;
      const dist = minDist + Math.random() * (maxDist - minDist);
      const spawnPos = dir.clone().multiplyScalar(dist);
      // Tangential velocity: perpendicular to dir
      let tangent = new THREE.Vector3(Math.random()*2-1, Math.random()*2-1, Math.random()*2-1);
      tangent = tangent.sub(tangent.clone().projectOnVector(dir)).normalize();
      // Mix in a small radial component (inward or outward)
      const tangentialSpeed = starSpeed * (2.5 + Math.random() * 2.5); // much faster
      const radialSpeed = starSpeed * (Math.random() - 0.5) * 0.3; // more dramatic
      const velocity = tangent.multiplyScalar(tangentialSpeed).add(dir.clone().multiplyScalar(radialSpeed));

      // Stunning color gradient for the head
      const vibrantColors = [0xffe066, 0xff66cc, 0x66ccff, 0xffffff, 0x80ffea, 0xfff2cc, 0xffc080, 0x80c0ff, 0xff80b3];
      const color = vibrantColors[Math.floor(Math.random()*vibrantColors.length)];
      // Star brightness and size (always small and subtle)
      const brightness = 2.5 + Math.random()*1.5;
      const geo = new THREE.SphereGeometry(0.7 + Math.random()*0.5, 16, 16); // Small sphere
      const mat = new THREE.MeshPhysicalMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 14.0, // Intense bloom
        metalness: 0.7,
        roughness: 0.3,
        transmission: 0.7,
        opacity: 0.98,
        transparent: true,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
      });
      const star = new THREE.Mesh(geo, mat);
      // Add a large, intense bloom sprite for extra bloom
      const spriteMap = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/sprites/glow.png');
      const spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff, opacity: 1.0, blending: THREE.AdditiveBlending });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(70, 70, 1); // Large for bloom
      sprite.position.copy(star.position);
      star.add(sprite);
      // Add a colored sprite for color pop
      const colorSpriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: color, opacity: 0.6, blending: THREE.AdditiveBlending });
      const colorSprite = new THREE.Sprite(colorSpriteMaterial);
      colorSprite.scale.set(34, 34, 1);
      colorSprite.position.copy(star.position);
      star.add(colorSprite);
      // Add dynamic spark burst at the head
      const sparkCount = 18 + Math.floor(Math.random()*8);
      const sparkGroup = new THREE.Group();
      for (let i = 0; i < sparkCount; i++) {
        const sparkMat = new THREE.MeshBasicMaterial({ color: vibrantColors[Math.floor(Math.random()*vibrantColors.length)], transparent: true, opacity: 0.8 });
        const sparkGeo = new THREE.SphereGeometry(0.07 + Math.random()*0.06, 8, 8);
        const spark = new THREE.Mesh(sparkGeo, sparkMat);
        const angle = (i / sparkCount) * Math.PI * 2;
        spark.position.set(Math.cos(angle)*1.2, Math.sin(angle)*1.2, Math.random()*0.4-0.2);
        sparkGroup.add(spark);
      }
      sparkGroup.name = 'sparkBurst';
      star.add(sparkGroup);
      star.position.copy(spawnPos);
      star.velocity = velocity;
      star.normalizedLife = 0.0;
      star.normalizedLifetime = 80 + Math.random() * 80; // Longer, more dramatic
      star.age = 0;
      // --- Stunning Meteor Tail (very long, multi-color, glowing, fading, and 3D curve) ---
      const trailSegments = tailLength * 3; // Even longer tail
      const trailPoints = [];
      for (let i = 0; i < trailSegments; i++) {
        // Add a 3D spiral/curve for more depth
        const spiral = Math.sin(i * 0.25) * 8;
        const curve = Math.cos(i * 0.15) * 4;
        const pt = star.position.clone().add(new THREE.Vector3(spiral, curve, -i * 3));
        trailPoints.push(pt);
      }
      const tailGeo = new THREE.BufferGeometry().setFromPoints(trailPoints);
      // Per-vertex color (multi-color rainbow gradient)
      const tailColors = [];
      for (let i = 0; i < trailSegments; i++) {
        // Alpha fades out along the tail
        const alpha = (1 - i / (trailSegments - 1)) * 0.99;
        // Rainbow gradient
        const rainbow = [0xffe066, 0xff66cc, 0x66ccff, 0xffffff, 0x80ffea, 0xfff2cc, 0xffc080, 0x80c0ff, 0xff80b3];
        const gradColor = rainbow[Math.floor((i / trailSegments) * rainbow.length)];
        tailColors.push((gradColor >> 16 & 255) / 255, (gradColor >> 8 & 255) / 255, (gradColor & 255) / 255, alpha);
      }
      tailGeo.setAttribute('color', new THREE.Float32BufferAttribute(tailColors, 4));
      // Additive blending for glow + BLOOMED TAIL
      const tailMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 1.0, blending: THREE.AdditiveBlending });
      const tail = new THREE.Line(tailGeo, tailMat);
      tail.position.copy(star.position);
      // Add a bloom sprite to the tail's head for extra glow
      const tailGlowMap = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/sprites/glow.png');
      const tailGlowMat = new THREE.SpriteMaterial({ map: tailGlowMap, color: 0xffffff, opacity: 0.88, blending: THREE.AdditiveBlending });
      const tailGlow = new THREE.Sprite(tailGlowMat);
      tailGlow.scale.set(50, 50, 1); // Larger for more bloom
      tailGlow.position.copy(star.position);
      star.add(tailGlow); // Attach to star so it follows head
      // Add to scene
      scene.add(star);
      scene.add(tail);
      shootingStars.push({ mesh: star, tail, velocity: star.velocity, dir, age: 0, normalizedLifetime: star.normalizedLifetime, trailPoints, color, brightness, hasFragmented: false });
    }

    const animate = () => {
      try {
      requestAnimationFrame(animate);
      // Render main scene with bloom
      composer.render();
      // Overlay close stars with chromatic aberration (only close stars get CA)
      if (closeStars) {
        caComposer.render();
      }

      camera.rotation.y += (targetY - camera.rotation.y) * damping;
      // Move the virtual camera position in the direction the camera is facing
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      virtualCameraPos.add(forward.multiplyScalar(starSpeed));
      // Offset all stars by -virtualCameraPos (floating origin)
      for (let i = 0; i < positions.length; i += 3) {
        geometry.attributes.position.array[i] = positions[i] - virtualCameraPos.x;
        geometry.attributes.position.array[i+1] = positions[i+1] - virtualCameraPos.y;
        geometry.attributes.position.array[i+2] = positions[i+2] - virtualCameraPos.z;
        // Animate glow sprite for distant/close effect
        const glow = glowSprites[i/3];
        const starPos = new THREE.Vector3(positions[i] - virtualCameraPos.x, positions[i+1] - virtualCameraPos.y, positions[i+2] - virtualCameraPos.z);
        const dist = starPos.length();
        // If close, reduce/hide glow, if far, make glow big and bright
        if (dist < 400) {
          glow.material.opacity = 0.06 + 0.08 * Math.random(); // subtle flicker
          glow.scale.set(7, 7, 1);
        } else if (dist > 1200) {
          glow.material.opacity = 0.38 + 0.18 * Math.random(); // intense
          glow.scale.set(32, 32, 1);
        } else {
          // interpolate
          const t = (dist-400)/(1200-400);
          glow.material.opacity = 0.08 + 0.3*t + 0.08 * Math.random();
          const s = 7 + (32-7)*t;
          glow.scale.set(s, s, 1);
        }
        glow.position.copy(starPos);
      }
      if (closeStars && closeGeometry && closePositions.length > 0) {
        for (let i = 0; i < closePositions.length; i += 3) {
          closeGeometry.attributes.position.array[i] = closePositions[i] - virtualCameraPos.x;
          closeGeometry.attributes.position.array[i+1] = closePositions[i+1] - virtualCameraPos.y;
          closeGeometry.attributes.position.array[i+2] = closePositions[i+2] - virtualCameraPos.z;
        }
        closeGeometry.attributes.position.needsUpdate = true;
      }
      geometry.attributes.position.needsUpdate = true;

      // --- Shooting star spawning ---
      if (shootingStarCooldown <= 0 && Math.random() < 0.1) {
        spawnShootingStar();
        if (camera) {
          const shakeStrength = 0.06 + Math.random()*0.04;
          camera.position.x += (Math.random()-0.5)*shakeStrength;
          camera.position.y += (Math.random()-0.5)*shakeStrength;
        }
        shootingStarCooldown = 10 + Math.random() * 10;
      } else if (shootingStarCooldown > 0) {
        shootingStarCooldown--;
      }
      // Animate and clean up shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const obj = shootingStars[i];
        // Animate spark burst (fade and expand)
        if (obj.mesh.children) {
          const sparks = obj.mesh.children.find(child => child.name === 'sparkBurst');
          if (sparks) {
            for (let j = 0; j < sparks.children.length; j++) {
              const spark = sparks.children[j];
              spark.material.opacity *= 0.96; // Fade
              spark.scale.multiplyScalar(1.03); // Expand
            }
          }
        }
        // Animate tail shimmer and color cycling
        if (obj.tail && obj.trailPoints) {
          const time = performance.now() * 0.001;
          const tailGeo = obj.tail.geometry;
          const tailColors = tailGeo.getAttribute('color');
          for (let k = 0; k < tailColors.count; k++) {
            // Cycle hue
            let r = tailColors.getX(k), g = tailColors.getY(k), b = tailColors.getZ(k);
            // Convert to HSL
            const max = Math.max(r,g,b), min = Math.min(r,g,b);
            let h,s,l;
            l = (max+min)/2;
            if (max === min) {h = s = 0;} else {
              const d = max-min;
              s = l > 0.5 ? d/(2-max-min) : d/(max+min);
              switch(max){
                case r: h = (g-b)/d + (g<b?6:0); break;
                case g: h = (b-r)/d + 2; break;
                case b: h = (r-g)/d + 4; break;
              }
              h/=6;
            }
            h = (h + 0.25*Math.sin(time + k*0.2)) % 1.0; // Animate hue
            // Convert back to RGB
            let q = l < 0.5 ? l*(1+s) : l+s-l*s;
            let p = 2*l-q;
            let tr = h+1/3, tg = h, tb = h-1/3;
            const hue2rgb = (p,q,t) => {
              if (t<0) t+=1; if (t>1) t-=1;
              if (t<1/6) return p+(q-p)*6*t;
              if (t<1/2) return q;
              if (t<2/3) return p+(q-p)*(2/3-t)*6;
              return p;
            };
            tailColors.setX(k, hue2rgb(p,q,tr));
            tailColors.setY(k, hue2rgb(p,q,tg));
            tailColors.setZ(k, hue2rgb(p,q,tb));
            // Shimmer: modulate alpha
            tailColors.setW(k, tailColors.getW(k) * (0.97 + 0.03*Math.sin(time*8 + k)));
          }
          tailColors.needsUpdate = true;
        }
        // Straight-line trajectory
        obj.mesh.position.add(obj.velocity);
        obj.tail.position.copy(obj.mesh.position);
        // Animate tail (no lerp, just drag)
        obj.age++;
        const normalizedLife = obj.age / obj.normalizedLifetime;
        obj.trailPoints.unshift(obj.mesh.position.clone());
        if (obj.trailPoints.length > tailLength * 3) obj.trailPoints.pop();
        let tailGrow = Math.min(1, normalizedLife / 0.3);
        let activeSegments = Math.floor(obj.trailPoints.length * tailGrow);
        if (activeSegments < 2) activeSegments = 2;
        const visibleTrail = obj.trailPoints.slice(0, activeSegments);
        obj.tail.geometry.setFromPoints(visibleTrail);
        const tailColors = obj.tail.geometry.getAttribute('color');
        for (let j = 0; j < visibleTrail.length; j++) {
          let alpha = (1 - j / (visibleTrail.length - 1)) * 0.95;
          alpha *= 0.92 + 0.08 * Math.sin(Date.now()*0.015 + j*0.5);
          let rainbow = [0xffc080, 0xffe080, 0xffff80, 0x80ffe6, 0x80c0ff, 0xc080ff];
          let gradColor = rainbow[j % rainbow.length];
          if (normalizedLife > 0.7) alpha *= Math.max(0, 1 - (normalizedLife - 0.7 - 0.2) / 0.3);
          tailColors.setXYZW(j, (gradColor >> 16 & 255) / 255, (gradColor >> 8 & 255) / 255, (gradColor & 255) / 255, alpha);
        }
        tailColors.needsUpdate = true;
        // Animate head
        let headColor;
        if (normalizedLife < 0.5) {
          headColor = new THREE.Color(obj.color).lerp(new THREE.Color(0xffc080), normalizedLife*2);
        } else {
          headColor = new THREE.Color(0xffc080).lerp(new THREE.Color(0xff4000), (normalizedLife-0.5)*2);
        }
        let flicker = 0.95 + 0.13 * Math.sin(Date.now()*0.07 + Math.random()*10);
        headColor.multiplyScalar(flicker);
        obj.mesh.material.color.copy(headColor);
        let scale = 1 + 2.2 * Math.sin(Math.PI * normalizedLife);
        let distToCam = obj.mesh.position.length();
        let dofBlur = distToCam < starMaxDistance * 0.7 ? 0.7 : 1.0;
        obj.mesh.scale.set(scale * dofBlur, scale * dofBlur, scale * dofBlur);
        // Sparkle burst
        if (normalizedLife >= 1 && !obj.hasFragmented) {
          // --- SPECTACULAR EXPLOSION (very rare) ---
          const spectacular = Math.random() < 0.02; // 2% chance
          const burstCount = spectacular ? 120 + Math.floor(Math.random()*60) : 18 + Math.floor(Math.random()*8);
          const palette = spectacular
            ? [0xffe066, 0xff66cc, 0x66ccff, 0xffffff, 0x80ffea, 0xfff2cc, 0xffc080, 0x80c0ff, 0xff80b3, 0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0x00ffff, 0xff00ff, 0xff8800, 0x00ff88, 0x8800ff]
            : [0xffffff, 0xfff6c0, 0xffe066, 0xffc080, 0x80c0ff];
          for (let s = 0; s < burstCount; s++) {
            const color = palette[Math.floor(Math.random()*palette.length)];
            const size = spectacular ? (1.2 + Math.random()*2.2) : (0.7 + Math.random()*0.8);
            const sparkleGeo = new THREE.SphereGeometry(size, 8, 8);
            const sparkleMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: spectacular ? 0.92 : 0.7, blending: THREE.AdditiveBlending });
            const sparkle = new THREE.Mesh(sparkleGeo, sparkleMat);
            sparkle.position.copy(obj.mesh.position);
            // Spectacular: huge, fast, random directions; normal: moderate
            const spd = spectacular ? (4 + Math.random()*8) : (2 + Math.random()*2);
            const sparkleVel = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize().multiplyScalar(spd);
            sparkle.userData = { velocity: sparkleVel, age: 0, spectacular, maxAge: spectacular ? 80 + Math.random()*40 : 40 + Math.random()*20 }; // <-- LONGER LIFE
            scene.add(sparkle);
            if (!window._sparkles) window._sparkles = [];
            window._sparkles.push(sparkle);
          }
          if (spectacular) {
            // Add a big flash
            const flashGeo = new THREE.SphereGeometry(6, 24, 24);
            const flashMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
            const flash = new THREE.Mesh(flashGeo, flashMat);
            flash.position.copy(obj.mesh.position);
            scene.add(flash);
            if (!window._starFlashes) window._starFlashes = [];
            window._starFlashes.push({ mesh: flash, age: 0 });
          }
          // Fragmented trail logic (keep as before)
          const fragVel = obj.velocity.clone().applyAxisAngle(new THREE.Vector3(0,1,0), (Math.random()-0.5)*0.3);
          const fragStar = obj.mesh.clone();
          fragStar.position.copy(obj.mesh.position);
          fragStar.velocity = fragVel;
          fragStar.normalizedLife = normalizedLife;
          fragStar.normalizedLifetime = obj.normalizedLifetime * (0.5 + Math.random()*0.5);
          fragStar.age = obj.age;
          fragStar.material = obj.mesh.material.clone();
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
        // Spark burst
        if (!obj.hasSparked && normalizedLife > 0.95 && Math.random() < 0.1) {
          for (let s = 0; s < 8 + Math.floor(Math.random()*8); s++) {
            const sparkGeo = new THREE.SphereGeometry(0.5 + Math.random()*0.5, 8, 8);
            const sparkMat = new THREE.MeshBasicMaterial({ color: 0xfff6c0, transparent: true, opacity: 1, blending: THREE.AdditiveBlending });
            const spark = new THREE.Mesh(sparkGeo, sparkMat);
            spark.position.copy(obj.mesh.position);
            spark.sparkVel = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize().multiplyScalar(0.5 + Math.random()*1.2);
            spark.sparkLife = 12 + Math.random()*10;
            spark.sparkAge = 0;
            scene.add(spark);
            if (!window._starSparks) window._starSparks = [];
            window._starSparks.push(spark);
          }
          obj.hasSparked = true;
        }
        // Flash
        if (!obj.hasFlashed && normalizedLife > 0.98 && Math.random() < 0.2) {
          const flashGeo = new THREE.SphereGeometry(1, 16, 16);
          const flashMat = new THREE.MeshBasicMaterial({ color: 0xffffee, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
          const flash = new THREE.Mesh(flashGeo, flashMat);
          flash.position.copy(obj.mesh.position);
          scene.add(flash);
          if (!window._starFlashes) window._starFlashes = [];
          window._starFlashes.push({ mesh: flash, age: 0 });
          obj.hasFlashed = true;
        }
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
        // Remove when out of bounds or fully faded or life ended
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
          spark.material.opacity *= 0.92;
          if (spark.sparkAge > spark.sparkLife) {
            scene.remove(spark);
            window._starSparks.splice(i, 1);
          }
        }
      }
      // Animate explosion particles (sparkles)
      if (window._sparkles) {
        for (let i = window._sparkles.length - 1; i >= 0; i--) {
          const sparkle = window._sparkles[i];
          sparkle.position.add(sparkle.userData.velocity);
          sparkle.userData.age++;
          sparkle.material.opacity *= 0.97;
          if (sparkle.userData.age > (sparkle.userData.maxAge || 40)) {
            scene.remove(sparkle);
            window._sparkles.splice(i, 1);
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
      const sqDist = starMaxDistance * starMaxDistance;
      for (let i = 0; i < positions.length; i += 3) {
        const dx = positions[i] - virtualCameraPos.x;
        const dy = positions[i + 1] - virtualCameraPos.y;
        const dz = positions[i + 2] - virtualCameraPos.z;
        if (dx*dx + dy*dy + dz*dz > sqDist) {
          // Place in a thick spherical shell around the virtual camera, never too close
          const minRadius = starMaxDistance * 0.8;
          const maxRadius = starMaxDistance;
          const r = minRadius + Math.random() * (maxRadius - minRadius);
          const theta = Math.random() * 2 * Math.PI;
          const phi = Math.acos(2 * Math.random() - 1);
          positions[i] = virtualCameraPos.x + r * Math.sin(phi) * Math.cos(theta);
          positions[i+1] = virtualCameraPos.y + r * Math.sin(phi) * Math.sin(theta);
          positions[i+2] = virtualCameraPos.z + r * Math.cos(phi);
        }
      }
      // geometry.attributes.position.needsUpdate = true; // Already set above

      // Robust starfield color update to prevent stuck white dots
      const colArr = geometry.attributes.color.array;
      for (let i = 0; i < positions.length; i += 3) {
        const idx = i / 3;
        const dx = positions[i] - virtualCameraPos.x;
        const dy = positions[i + 1] - virtualCameraPos.y;
        const dz = positions[i + 2] - virtualCameraPos.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (timers[idx] > 0) {
          timers[idx]--;
          if (timers[idx] === 0) {
            // Timer expired, restore color
            sparkColors[i] = originalColors[i];
            sparkColors[i+1] = originalColors[i+1];
            sparkColors[i+2] = originalColors[i+2];
            colArr[i] = originalColors[i];
            colArr[i+1] = originalColors[i+1];
            colArr[i+2] = originalColors[i+2];
          } else {
            colArr[i] = sparkColors[i];
            colArr[i+1] = sparkColors[i+1];
            colArr[i+2] = sparkColors[i+2];
          }
        } else if (dist > starMaxDistance * 0.3 && Math.random() < 0.05) {
          timers[idx] = sparkleDuration;
          const c = palette[Math.floor(Math.random() * palette.length)];
          sparkColors[i] = c[0];
          sparkColors[i+1] = c[1];
          sparkColors[i+2] = c[2];
          colArr[i] = sparkColors[i];
          colArr[i+1] = sparkColors[i+1];
          colArr[i+2] = sparkColors[i+2];
        } else {
          sparkColors[i] = originalColors[i];
          sparkColors[i+1] = originalColors[i+1];
          sparkColors[i+2] = originalColors[i+2];
          colArr[i] = originalColors[i];
          colArr[i+1] = originalColors[i+1];
          colArr[i+2] = originalColors[i+2];
        }
      }
      geometry.attributes.color.needsUpdate = true;
        composer.render();
      } catch (err) {
        // Defensive: log error with context
        console.error('Starfield animation error:', err);
      }
    }
    
    animate(); // Start the render loop

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
  }, [])

  return <div ref={mountRef} />
}
export default Starfield

