// Three.js background starfield setup
const canvas = document.getElementById('bg');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Infinite starfield setup
const starMaxDistance = 1000;
const starSpeed = 1;
const starGeometry = new THREE.BufferGeometry();
const starCount = 10000;
const starVertices = [];
// distribute stars uniformly within sphere
for (let i = 0; i < starCount; i++) {
  const theta = Math.random() * 2 * Math.PI;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = Math.random() * starMaxDistance;
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);
  starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

// Star color palette
const starColorPalette = [
  [1.0, 0.5, 0.5],   // soft red
  [1.0, 0.75, 0.4],  // soft orange
  [1.0, 1.0, 0.9],   // soft yellow-white
  [1.0, 1.0, 1.0],   // white
  [0.4, 0.5, 1.0]    // stronger blue
];
// Add initial color attribute for twinkle effect
const starColors = [];
for (let i = 0; i < starCount; i++) {
  const color = starColorPalette[Math.floor(Math.random() * starColorPalette.length)];
  starColors.push(...color);
}
starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));

// Sparkle support arrays for prolonged twinkle
const starOriginalColors = starGeometry.attributes.color.array.slice();
const starTimers = new Float32Array(starCount);
const starSparkColors = new Float32Array(starCount * 3);
const sparkleDuration = 180; // frames to sustain twinkle (extended)

const starMaterial = new THREE.PointsMaterial({ vertexColors: true, size: 1, sizeAttenuation: true });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Smooth scroll-based camera rotation
let targetRotationY = 0;
const rotationDamping = 0.05;
window.addEventListener('scroll', () => {
  const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  targetRotationY = scrollPercent * Math.PI * 2;
});

// Function to spawn a shooting star
function spawnShootingStar() {
  const sGeo = new THREE.SphereGeometry(1, 8, 8);
  const sMat = new THREE.MeshBasicMaterial({ color: 0xffffaa });
  const sk = new THREE.Mesh(sGeo, sMat);
  const dirVec = new THREE.Vector3();
  camera.getWorldDirection(dirVec);
  const sideVec = new THREE.Vector3().crossVectors(dirVec, new THREE.Vector3(0,1,0)).normalize();
  const upVec = new THREE.Vector3().crossVectors(sideVec, dirVec).normalize();
  const spread = window.innerWidth * 0.3;
  const offset = sideVec.multiplyScalar((Math.random() - 0.5) * spread)
    .add(upVec.multiplyScalar((Math.random() - 0.5) * spread));
  sk.position.copy(camera.position)
    .add(dirVec.clone().multiplyScalar(starMaxDistance))
    .add(offset);
  sk.velocity = dirVec.clone().multiplyScalar(-starSpeed * 50);
  scene.add(sk);
  shootingStars.push(sk);
}

// Container for shooting stars
const shootingStars = [];

// Animate infinite zoom and shooting stars
function animateStars() {
  requestAnimationFrame(animateStars);
  // Smooth camera turn towards scroll position
  camera.rotation.y += (targetRotationY - camera.rotation.y) * rotationDamping;
  // Move camera forward along its local Z axis
  camera.translateZ(-starSpeed);
  // Reposition stars in a sphere around camera for continuous field
  const positions = starGeometry.attributes.position.array;
  const sqDist = starMaxDistance * starMaxDistance;
  for (let i = 0; i < positions.length; i += 3) {
    const dx = positions[i] - camera.position.x;
    const dy = positions[i + 1] - camera.position.y;
    const dz = positions[i + 2] - camera.position.z;
    if (dx * dx + dy * dy + dz * dz > sqDist) {
      // place star randomly on sphere shell
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i]     = camera.position.x + starMaxDistance * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = camera.position.y + starMaxDistance * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = camera.position.z + starMaxDistance * Math.cos(phi);
    }
  }
  starGeometry.attributes.position.needsUpdate = true;

  // Color sparkle for distant stars
  const colors = starGeometry.attributes.color.array;
  // reuse positions array declared earlier for repositioning
  // sparkle settings
  const sparkleThreshold = starMaxDistance * 0.3;
  const sparkleChance = 0.05;
  for (let i = 0; i < positions.length; i += 3) {
    const idx = i / 3;
    const dx = positions[i], dy = positions[i + 1], dz = positions[i + 2];
    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
    if (starTimers[idx] > 0) {
      starTimers[idx]--;
    } else if (dist > sparkleThreshold && Math.random() < sparkleChance) {
      starTimers[idx] = sparkleDuration;
      const c = starColorPalette[Math.floor(Math.random() * starColorPalette.length)];
      starSparkColors[i] = c[0]; starSparkColors[i+1] = c[1]; starSparkColors[i+2] = c[2];
    }
    if (starTimers[idx] > 0) {
      colors[i] = starSparkColors[i]; colors[i+1] = starSparkColors[i+1]; colors[i+2] = starSparkColors[i+2];
    } else {
      colors[i] = starOriginalColors[i]; colors[i+1] = starOriginalColors[i+1]; colors[i+2] = starOriginalColors[i+2];
    }
  }
  starGeometry.attributes.color.needsUpdate = true;

  // slowly rotate starfield
  stars.rotation.x += 0.0001;
  stars.rotation.y += 0.00015;

  // Continuous shooting star spawn
  if (Math.random() < 0.02) spawnShootingStar();

  // Update shooting stars and remove near camera
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const m = shootingStars[i];
    m.position.add(m.velocity);
    if (m.position.distanceTo(camera.position) < 5) {
      scene.remove(m);
      shootingStars.splice(i, 1);
    }
  }
  // Recenter world around camera to prevent drift
  const camPos = camera.position.clone();
  // Shift star positions
  const posArray = starGeometry.attributes.position.array;
  for (let i = 0; i < posArray.length; i += 3) {
    posArray[i]   -= camPos.x;
    posArray[i+1] -= camPos.y;
    posArray[i+2] -= camPos.z;
  }
  starGeometry.attributes.position.needsUpdate = true;
  // Shift shooting stars accordingly
  shootingStars.forEach(m => m.position.sub(camPos));
  // Reset camera position to origin
  camera.position.set(0, 0, 0);
  renderer.render(scene, camera);
}
animateStars();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-links li');
const burger = document.querySelector('.burger');
const sections = document.querySelectorAll('.section');

// Nav scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Burger toggle
burger.addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('active');
  burger.classList.toggle('toggle');
  navLinks.forEach((link, index) => {
    link.style.animation = link.style.animation
      ? ''
      : `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
  });
});

// Section reveal
const revealSections = () => {
  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    const revealPoint = 150;
    if (sectionTop < window.innerHeight - revealPoint) {
      section.classList.add('show');
    }
  });
};
window.addEventListener('scroll', revealSections);


// Overscroll shake effect
window.addEventListener('wheel', (e) => {
  const atTop = window.scrollY === 0 && e.deltaY < 0;
  const atBottom = window.scrollY + window.innerHeight >= document.body.scrollHeight && e.deltaY > 0;
  if (atTop || atBottom) {
    document.body.classList.add('overscroll-shake');
    setTimeout(() => document.body.classList.remove('overscroll-shake'), 500);
  }
});

// Smooth scroll offset fix for header
const smoothScroll = (event) => {
  if (event.target.hash) {
    event.preventDefault();
    const hash = event.target.hash;
    const target = document.querySelector(hash);
    const offset = nav.offsetHeight;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  }
};

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', smoothScroll);
});