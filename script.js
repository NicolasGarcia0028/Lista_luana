(() => {
  const envelope = document.getElementById('envelope');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const fullscreenLetter = document.getElementById('fullscreen-letter');
  const closeBtn = document.getElementById('close-btn');
  const canvas = document.getElementById('fx-canvas');
  const ctx = canvas.getContext('2d');
  const heartsContainer = document.getElementById('hearts-container');
  const floatingHearts = document.getElementById('floating-hearts');

  let open = false;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(innerWidth * dpr);
    canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener('resize', resize);
  resize();

  const particles = [];

  //  Dibuja un pétalo en el Canvas
  function drawPetal(x, y, size, rot, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(size / 100, size / 100);
    ctx.fillStyle = color;
    ctx.beginPath();
    // Forma de pétalo estilizada
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(40, -40, 0, -80);
    ctx.quadraticCurveTo(-40, -40, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  function spawnParticle(type, opts = {}) {
    const x = opts.x ?? Math.random() * innerWidth;
    const y = opts.y ?? -20;
    const size = opts.size ?? (10 + Math.random() * 14);
    const vx = (Math.random() - 0.5) * 0.4;
    const vy = 0.25 + Math.random() * 0.45;
    const rot = Math.random() * Math.PI * 2;
    const vr = (Math.random() - 0.5) * 0.05; // Más rotación para pétalos
    const opacity = 0.6 + Math.random() * 0.4;
    const hue = 340 + Math.random() * 30; // Tonos entre rosado y rojo
    particles.push({ type, x, y, size, vx, vy, rot, vr, opacity, hue });
  }

  let last = 0;
  function loop(ts) {
    requestAnimationFrame(loop);
    const dt = Math.min((ts - last) / 16.67, 2);
    last = ts;

    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt * 1.2 + Math.sin((p.y + ts * 0.05) * 0.03) * 0.4;
      p.y += p.vy * dt * 1.2;
      p.rot += p.vr * dt;

      const color = `hsla(${p.hue}, 85%, 70%, ${p.opacity})`;
      drawPetal(p.x, p.y, p.size, p.rot, color);

      if (p.y > innerHeight + 40) particles.splice(i, 1);
    }
  }
  requestAnimationFrame(loop);

  function fireBurst(x, y) {
    const count = 20;
    for (let i = 0; i < count; i++) {
      const flower = document.createElement('i');
      // CAMBIO: Ahora lanza flores al abrir el sobre
      flower.className = 'fas fa-seedling heart-explosion'; 
      flower.style.left = `${x}px`;
      flower.style.top = `${y}px`;
      flower.style.color = '#ff69b4';
      const tx = (Math.random() - 0.5) * 250;
      const ty = (Math.random() - 0.5) * 200;
      flower.style.setProperty('--tx', `${tx}px`);
      flower.style.setProperty('--ty', `${ty}px`);
      flower.style.position = 'fixed';
      flower.style.zIndex = '60';
      heartsContainer.appendChild(flower);
      flower.addEventListener('animationend', () => flower.remove());
    }
  }

  // --- Funciones de interacción del sobre ---
  function openLetter() {
    if (open) return;
    open = true;
    envelope.classList.add('open');
    const rect = envelope.getBoundingClientRect();
    fireBurst(rect.left + rect.width / 2, rect.top + rect.height * 0.3);
    setTimeout(() => {
      fullscreenLetter.removeAttribute('hidden');
      fullscreenLetter.classList.add('active');
      closeBtn?.focus();
      startFallingElements();
    }, 550);
  }

  function closeLetter() {
    fullscreenLetter.classList.remove('active');
    setTimeout(() => {
      fullscreenLetter.setAttribute('hidden', '');
      envelope.classList.remove('open');
      open = false;
      stopFallingElements();
    }, 350);
  }

  envelopeWrapper?.addEventListener('click', openLetter);
  closeBtn?.addEventListener('click', closeLetter);

  // cursor dibuja pétalos 
  function createPetalAt(x, y) {
    const petal = document.createElement('i');
    petal.className = 'fas fa-leaf floating-heart'; 
    petal.style.left = `${x}px`;
    petal.style.top = `${y}px`;
    petal.style.color = '#f615b6'; // Color pétalo de cerezo
    petal.style.position = 'fixed';
    petal.style.transform = `rotate(${Math.random() * 360}deg)`;
    petal.style.animationDuration = `${1000 + Math.random() * 1000}ms`;
    floatingHearts.appendChild(petal);
    setTimeout(() => petal.remove(), 5000);
  }
function createFallingBouquet() {
    const bouquet = document.createElement('div');
    bouquet.className = 'bouquet-fall';
    
    // Combinación de iconos para formar el ramo
    bouquet.innerHTML = `
      <i class="fas fa-fan" style="color: #ff1493; font-size: 1.2em;"></i>
      <div style="display: flex; margin-top: -8px;">
        <i class="fas fa-fan" style="color: #ff69b4; font-size: 0.9em;"></i>
        <i class="fas fa-fan" style="color: #ffb7c5; font-size: 0.9em; margin-left: -5px;"></i>
      </div>
      <i class="fas fa-seedling" style="color: #2e7d32; margin-top: -5px;"></i>
    `;

    bouquet.style.left = Math.random() * 100 + 'vw';
    const scale = 0.7 + Math.random() * 0.8;
    bouquet.style.transform = `scale(${scale})`;
    bouquet.style.animationDuration = 7 + Math.random() * 8 + 's';
    
    heartsContainer.appendChild(bouquet);
    bouquet.addEventListener('animationend', () => bouquet.remove());
  }
  function onPointerMove(e) {
    if (e.touches) { 
      for (const t of e.touches) createPetalAt(t.clientX, t.clientY); 
    } else { 
      createPetalAt(e.clientX, e.clientY); 
    }
  }
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  let fallInterval = null;
  function startFallingElements() { 
    if (!fallInterval) fallInterval = setInterval(createFallingFlower, 500); 
  }
  function stopFallingElements() { 
    if (fallInterval) { clearInterval(fallInterval); fallInterval = null; } 
  }

  window.addEventListener('load', () => { startFallingElements(); });
})();
