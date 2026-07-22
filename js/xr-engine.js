/**
 * AR/VR Research Lab - Spatial Computing XR OS Engine
 * Inspired by VisionOS, Meta Quest Horizon OS, & High-End Sci-Fi Interfaces
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. WEB AUDIO API SPATIAL UI SOUND SYNTHESIZER (ZERO EXTERNAL ASSETS)
  // =========================================================================
  class XRSoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.initialized = false;
    }

    init() {
      if (this.initialized) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
          this.initialized = true;
        }
      } catch (e) {
        console.warn('Web Audio API not supported', e);
      }
    }

    playHover() {
      if (this.muted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.03);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    }

    playClick() {
      if (this.muted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    }

    playSwoosh() {
      if (this.muted || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    }

    toggleMute() {
      this.muted = !this.muted;
      return this.muted;
    }
  }

  const xrSound = new XRSoundEngine();

  // Initialize AudioContext on first user interaction
  const unlockAudio = () => {
    xrSound.init();
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
  };
  document.addEventListener('click', unlockAudio);
  document.addEventListener('keydown', unlockAudio);


  // =========================================================================
  // 2. 3D SPATIAL BACKGROUND CANVAS ENGINE WITH SCROLL EXPANSION ANIMATION
  // =========================================================================
  // =========================================================================
  // =========================================================================
  // 2. 3D SPATIAL XR HEADSET CANVAS ENGINE WITH SCROLL EXPANSION ANIMATION
  // =========================================================================
  function init3DBackgroundScene() {
    const container = document.getElementById('canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    // Check if canvas already initialized
    if (container.querySelector('canvas')) return;

    const scene = new THREE.Scene();

    const rect = container.getBoundingClientRect();
    const width = rect.width || (window.innerWidth * 0.46);
    const height = rect.height || (window.innerHeight * 0.8);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create 3D XR Visor Headset Group
    const xrHeadsetGroup = new THREE.Group();

    // 1. Visor Main Frame Shield (Soft Lavender Wireframe)
    const visorGeo = new THREE.BoxGeometry(3.6, 1.8, 1.3, 6, 4, 4);
    const visorMat = new THREE.MeshBasicMaterial({
      color: 0xC5B3D3,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    xrHeadsetGroup.add(visorMesh);

    // 2. Visor Front Glass Shield (Soft Pastel Pink Tinted Translucent Front Plate)
    const shieldGeo = new THREE.PlaneGeometry(3.4, 1.6, 4, 4);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0xFFE2E2,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldMesh.position.z = 0.66;
    xrHeadsetGroup.add(shieldMesh);

    // 3. Dual Spatial Optical Lens Rings (Left & Right Eye Display Lenses)
    const lensGeo = new THREE.TorusGeometry(0.52, 0.07, 16, 32);
    const lensMat = new THREE.MeshBasicMaterial({
      color: 0xC5B3D3,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });

    const leftLens = new THREE.Mesh(lensGeo, lensMat);
    leftLens.position.set(-0.85, 0, 0.67);
    xrHeadsetGroup.add(leftLens);

    const rightLens = new THREE.Mesh(lensGeo, lensMat);
    rightLens.position.set(0.85, 0, 0.67);
    xrHeadsetGroup.add(rightLens);

    // 4. Ergonomic Headband Strap Ring (Rose Blush Primary)
    const strapGeo = new THREE.TorusGeometry(2.1, 0.1, 16, 48);
    const strapMat = new THREE.MeshBasicMaterial({
      color: 0xF5CBCB,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const strapMesh = new THREE.Mesh(strapGeo, strapMat);
    strapMesh.rotation.x = Math.PI / 2;
    strapMesh.position.z = -0.4;
    xrHeadsetGroup.add(strapMesh);

    // 5. 6DOF Spatial Tracking Sensors (Glowing Lavender Corner Cameras)
    const sensorGeo = new THREE.OctahedronGeometry(0.14, 1);
    const sensorMat = new THREE.MeshBasicMaterial({
      color: 0xC5B3D3,
      wireframe: true,
      transparent: true,
      opacity: 0.9
    });

    const sensorPositions = [
      [-1.7, 0.8, 0.65],
      [1.7, 0.8, 0.65],
      [-1.7, -0.8, 0.65],
      [1.7, -0.8, 0.65]
    ];

    sensorPositions.forEach(pos => {
      const sensor = new THREE.Mesh(sensorGeo, sensorMat);
      sensor.position.set(...pos);
      xrHeadsetGroup.add(sensor);
    });

    // 6. Floating Spatial Orbit Ring surrounding Headset
    const orbitGeo = new THREE.TorusGeometry(3.3, 0.03, 16, 64);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0xC5B3D3,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
    orbitMesh.rotation.x = 1.1;
    orbitMesh.rotation.y = 0.5;
    xrHeadsetGroup.add(orbitMesh);

    scene.add(xrHeadsetGroup);

    // Floating Particles System in Soft Lavender & White
    const particleCount = 220;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 16;
      positions[i + 2] = (Math.random() - 0.5) * 16;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMat = new THREE.PointsMaterial({
      color: 0xC5B3D3,
      size: 0.055,
      transparent: true,
      opacity: 0.6
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // Interactive Mouse Parallax
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // 3D Scroll Expansion Physics Engine (Expands headset object as user moves down)
    let targetScale = 1.0;
    let currentScale = 1.0;
    let targetRotSpeed = 1.0;
    let currentRotSpeed = 1.0;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY || window.pageYOffset;
      // Object expands smoothly as user scrolls down the page
      targetScale = 1.0 + Math.min(scrollY / 320, 2.5);
      targetRotSpeed = 1.0 + Math.min(scrollY / 600, 2.0);
    });

    // Wireframe Color / Speed Toggle Button (HUD Button)
    let speedMultiplier = 1;
    const toggleBtn = document.getElementById('toggle-canvas-wireframe');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        speedMultiplier = speedMultiplier === 1 ? 2.5 : 1;
        visorMat.color.setHex(speedMultiplier > 1 ? 0xF5CBCB : 0xC5B3D3);
        lensMat.color.setHex(speedMultiplier > 1 ? 0xF5CBCB : 0xC5B3D3);
      });
    }

    const hudCoords = document.getElementById('hud-coords');

    // Handle Window Resize
    window.addEventListener('resize', () => {
      const r = container.getBoundingClientRect();
      const w = r.width || window.innerWidth;
      const h = r.height || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);

      // Lerp scale expansion for fluid organic response to scrolling down
      currentScale += (targetScale - currentScale) * 0.07;
      currentRotSpeed += (targetRotSpeed - currentRotSpeed) * 0.07;

      xrHeadsetGroup.scale.set(currentScale, currentScale, currentScale);
      particleSystem.scale.set(1 + (currentScale - 1) * 0.5, 1 + (currentScale - 1) * 0.5, 1 + (currentScale - 1) * 0.5);

      const effectiveSpeed = speedMultiplier * currentRotSpeed;
      xrHeadsetGroup.rotation.y += 0.006 * effectiveSpeed;
      xrHeadsetGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.15;

      orbitMesh.rotation.z += 0.008 * effectiveSpeed;
      leftLens.rotation.z += 0.01 * effectiveSpeed;
      rightLens.rotation.z -= 0.01 * effectiveSpeed;

      particleSystem.rotation.y += 0.001 * effectiveSpeed;

      camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 1.2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      if (hudCoords && Math.random() > 0.85) {
        const posX = Math.floor(xrHeadsetGroup.rotation.x * 100);
        const posY = Math.floor(xrHeadsetGroup.rotation.y * 100);
        const posZ = Math.floor(currentScale * 100);
        hudCoords.innerText = `X:${posX} Y:${posY} SCALE:${posZ}%`;
      }

      renderer.render(scene, camera);
    }
    animate();
  }


  // =========================================================================
  // 3. 3D SPATIAL PARALLAX & VOLUMETRIC SPECULAR TILT ENGINE
  // =========================================================================
  function initSpatialTiltEngine() {
    const tiltSelector = '.glass-card, .info-card, .member-card, .hero-statement-card, .quote-banner, .vm-card, .philo-card, .lead-card, .grid5 .cell';
    const tiltElements = document.querySelectorAll(tiltSelector);

    tiltElements.forEach(el => {
      // Inject Specular Sheen element if missing
      if (!el.querySelector('.specular-sheen')) {
        const sheen = document.createElement('div');
        sheen.className = 'specular-sheen';
        el.appendChild(sheen);
      }

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const elX = (mouseX / rect.width) - 0.5;
        const elY = (mouseY / rect.height) - 0.5;

        // 3D Parallax Rotation Pitch & Yaw
        const rotX = -elY * 16; // 16 deg max pitch tilt
        const rotY = elX * 16;  // 16 deg max yaw tilt

        el.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(16px) scale(1.025)`;
        el.style.borderColor = 'rgba(197, 179, 211, 0.55)';
        el.style.boxShadow = `0 24px 50px rgba(197, 179, 211, 0.25), 0 0 30px rgba(245, 203, 203, 0.3)`;

        // Update Dynamic Holographic Specular Light Sheen Coordinates
        const percentX = ((mouseX / rect.width) * 100).toFixed(1);
        const percentY = ((mouseY / rect.height) * 100).toFixed(1);
        el.style.setProperty('--sheen-x', `${percentX}%`);
        el.style.setProperty('--sheen-y', `${percentY}%`);
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
        el.style.borderColor = '';
        el.style.boxShadow = '';
      });
    });
  }


  // =========================================================================
  // 4. HEADSET BOOT SEQUENCE LOADING SCREEN CONTROLLER
  // =========================================================================
  function initBootSequence() {
    // Inject Boot Screen HTML if missing
    let bootScreen = document.getElementById('xr-boot-screen');
    if (!bootScreen) {
      bootScreen = document.createElement('div');
      bootScreen.id = 'xr-boot-screen';
      bootScreen.innerHTML = `
        <div class="boot-content">
          <div class="simple-3d-spinner">
            <div class="spinner-ring ring-1"></div>
            <div class="spinner-ring ring-2"></div>
            <div class="spinner-ring ring-3"></div>
            <div class="spinner-core"></div>
          </div>
          <h2 class="boot-title"><span class="w-cyan">AR/VR</span> <span class="w-white">RESEARCH</span> <span class="w-coral">LAB</span></h2>
          <div class="boot-progress-bar">
            <div class="boot-progress-fill" id="boot-fill"></div>
          </div>
          <div class="boot-ticker" id="boot-ticker">LOADING...</div>
        </div>
      `;
      document.body.prepend(bootScreen);
    }

    const fill = document.getElementById('boot-fill');
    const ticker = document.getElementById('boot-ticker');
    const steps = [
      "LOADING...",
      "PREPARING EXPERIENCE...",
      "READY"
    ];

    let progress = 0;
    let stepIdx = 0;

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 30) + 20;
      if (progress > 100) progress = 100;

      if (fill) fill.style.width = progress + '%';

      if (ticker && stepIdx < steps.length) {
        ticker.innerText = steps[stepIdx];
        stepIdx = Math.min(stepIdx + 1, steps.length - 1);
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          bootScreen.classList.add('boot-done');
          xrSound.playSwoosh();
          setTimeout(() => {
            if (bootScreen.parentNode) bootScreen.parentNode.removeChild(bootScreen);
          }, 400);
        }, 150);
      }
    }, 80);
  }


  // =========================================================================
  // 5. VISIONOS FLOATING NAVIGATION BAR SCROLL CONTROLLER
  // =========================================================================
  function initSpatialHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    // Inject Audio Mute Toggle Button into header-bottom
    const headerBottom = header.querySelector('.header-bottom');
    if (headerBottom && !document.getElementById('audio-toggle-btn')) {
      const audioBtn = document.createElement('button');
      audioBtn.id = 'audio-toggle-btn';
      audioBtn.className = 'audio-toggle-btn';
      audioBtn.setAttribute('title', 'Toggle Spatial UI Audio');
      audioBtn.innerHTML = '<span class="audio-lbl">AUDIO ON</span>';

      audioBtn.addEventListener('click', () => {
        const isMuted = xrSound.toggleMute();
        audioBtn.innerHTML = isMuted ? '<span class="audio-lbl">AUDIO OFF</span>' : '<span class="audio-lbl">AUDIO ON</span>';
        if (!isMuted) xrSound.playClick();
      });

      headerBottom.appendChild(audioBtn);
    }

    // Shrink and blur on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }


  // =========================================================================
  // 6. VISIONOS FLOATING SPATIAL MODAL (PROJECT SHOWCASE)
  // =========================================================================
  function initSpatialModal() {
    let modal = document.getElementById('xr-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'xr-modal';
      modal.className = 'xr-modal';
      modal.innerHTML = `
        <div class="xr-modal-backdrop"></div>
        <div class="xr-modal-window">
          <button class="xr-modal-close" id="xr-modal-close" aria-label="Close Window">✕</button>
          <div class="xr-modal-header">
            <span class="xr-modal-tag" id="modal-tag">SPATIAL PROJECT</span>
            <h2 class="xr-modal-title" id="modal-title">Project Title</h2>
          </div>
          <div class="xr-modal-body" id="modal-body">
            Project description text...
          </div>
          <div class="xr-modal-footer">
            <button class="btn-primary" id="modal-action-btn">Launch Preview →</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const backdrop = modal.querySelector('.xr-modal-backdrop');
    const closeBtn = document.getElementById('xr-modal-close');

    const closeModal = () => {
      modal.classList.remove('open');
      xrSound.playClick();
    };

    if (backdrop) backdrop.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Attach click listeners to work cards
    const workCells = document.querySelectorAll('.grid5 .cell, .glass-card');
    workCells.forEach((cell, idx) => {
      cell.addEventListener('click', (e) => {
        // Prevent if clicking links directly
        if (e.target.tagName.toLowerCase() === 'a') return;

        const title = cell.querySelector('h3, .card-title')?.innerText || 'AR/VR Research Project';
        const num = cell.querySelector('.num, .card-num')?.innerText || 'PROJECT Showcase';
        const desc = cell.querySelector('p, .card-desc')?.innerText || 'Full interactive spatial preview.';

        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-tag').innerText = num;
        document.getElementById('modal-body').innerHTML = `
          <p style="font-size:16px; line-height:1.7; color:var(--text-main); margin-bottom:16px;">${desc}</p>
          <div style="background:rgba(8,9,14,0.8); border:1px solid var(--border-glass); border-radius:12px; padding:16px; margin-top:14px;">
            <div style="font-family:var(--font-mono); font-size:12px; color:var(--cyan-glow); margin-bottom:6px;">TECHNICAL SPECIFICATIONS</div>
            <div style="font-size:13.5px; color:var(--text-muted);">
              • Spatial Tracking: 6 Degrees of Freedom (6DOF)<br>
              • Engine Architecture: Unity XR Interaction Toolkit / Three.js<br>
              • Target Platform: Meta Quest 3, Apple VisionOS, WebXR
            </div>
          </div>
        `;
        modal.classList.add('open');
        xrSound.playSwoosh();
      });
    });
  }


  // =========================================================================
  // 7. INITIALIZE XR ENGINE UPON DOM READY
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initBootSequence();
    init3DBackgroundScene();
    initSpatialTiltEngine();
    initSpatialHeader();
    initSpatialModal();
  });

})();
