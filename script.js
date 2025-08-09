// Simple interactive demos: fluid particles + 1D quantum wave packet
// Lightweight, designed to run in any modern browser.
const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d', { alpha: true });

let DPR = Math.max(1, window.devicePixelRatio || 1);
function resizeCanvas(){
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(300, Math.floor(rect.width * DPR));
  canvas.height = Math.max(200, Math.floor(rect.height * DPR));
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
window.addEventListener('resize', resizeCanvas);
// initial resize (defer a little to allow CSS to settle)
setTimeout(resizeCanvas, 50);

// UI
const select = document.getElementById('demo-select');
const caption = document.getElementById('caption');
const resetBtn = document.getElementById('btn-reset');

let currentDemo = 'fluid';
select.addEventListener('change', e => {
  currentDemo = e.target.value;
  caption.textContent = currentDemo === 'fluid' ? 'Demo: Fluidodinamica — usa il mouse per spostare le particelle.' : 'Demo: Meccanica quantistica — onda 1D che si propaga.';
  resetAll();
});

resetBtn.addEventListener('click', resetAll);

// Mouse interaction
const mouse = {x:-9999,y:-9999,down:false};
canvas.addEventListener('mousemove', (e)=>{
  const r = canvas.getBoundingClientRect();
  mouse.x = (e.clientX - r.left);
  mouse.y = (e.clientY - r.top);
});
canvas.addEventListener('mouseleave', ()=>{ mouse.x = -9999; mouse.y = -9999; });
canvas.addEventListener('mousedown', ()=>{ mouse.down = true });
canvas.addEventListener('mouseup', ()=>{ mouse.down = false });

// --------------------------- Fluid demo ---------------------------
class Particle {
  constructor(w,h){
    this.reset(w,h);
  }
  reset(w,h){
    this.x = Math.random()*w;
    this.y = Math.random()*h;
    this.vx = (Math.random()-0.5)*0.8;
    this.vy = (Math.random()-0.5)*0.8;
    this.r = 1 + Math.random()*1.8;
  }
  step(w,h,t){
    // simple time-varying flow field
    const fx = Math.sin((this.y*0.008) + t*0.0009);
    const fy = Math.cos((this.x*0.008) - t*0.0012);
    this.vx += fx*0.12;
    this.vy += fy*0.12;

    // mouse influence (repel when clicking, attract otherwise)
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const d2 = dx*dx + dy*dy;
    if (d2 < 20000){
      const force = (20000 - d2) / 20000;
      const sign = mouse.down ? 1 : -1; // click to push away
      this.vx += (dx * 0.0006) * force * sign;
      this.vy += (dy * 0.0006) * force * sign;
    }

    // friction and integrate
    this.vx *= 0.995;
    this.vy *= 0.995;
    this.x += this.vx;
    this.y += this.vy;

    // wrap
    if (this.x < -10) this.x = w + 10;
    if (this.x > w + 10) this.x = -10;
    if (this.y < -10) this.y = h + 10;
    if (this.y > h + 10) this.y = -10;
  }
}

let particles = [];
function initParticles(){
  particles = [];
  const area = canvas.width * canvas.height;
  // scale particle count by area but keep it reasonable
  const count = Math.min(800, Math.max(120, Math.floor(area / 9000)));
  for (let i=0;i<count;i++) particles.push(new Particle(canvas.width, canvas.height));
}

// --------------------------- Quantum demo (wave packet, visual) ---------------------------
let qX0 = 0;
let qSpeed = 1.3;
const qK = 0.06;
const qOmega = 0.018;
function drawQuantum(t){
  // clear with subtle background
  ctx.fillStyle = '#071026';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  const N = Math.min(600, Math.floor(canvas.width/2));
  const sigma = canvas.width * 0.07;
  const centerY = canvas.height * 0.5;
  // move packet, wrap around
  qX0 += qSpeed;
  if (qX0 > canvas.width + 200) qX0 = -200;

  // draw baseline
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.moveTo(0, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.stroke();

  // draw density as vertical bars
  const colW = canvas.width / N;
  for (let i=0;i<N;i++){
    const x = i/(N-1) * canvas.width;
    const dx = x - qX0;
    const psi = Math.exp(- (dx*dx) / (2*sigma*sigma)) * Math.cos(qK * dx - qOmega * t * 0.6);
    const density = psi * psi; // |psi|^2
    const h = density * (canvas.height * 0.7);
    // color map based on density
    const alpha = Math.min(1, 0.35 + density*2.5);
    ctx.fillStyle = `rgba(120,200,255,${alpha})`;
    ctx.fillRect(x - colW*0.5, centerY - h/2, colW, h);
  }

  // small caption inside canvas
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(12,12,220,36);
  ctx.fillStyle = '#e9f7ff';
  ctx.font = '13px system-ui, Arial';
  ctx.fillText('Meccanica quantistica — distribuzione |ψ|² (demo semplificata)', 18, 34);
}

// --------------------------- Main loop ---------------------------
let last = performance.now();
let rafId = null;
function loop(now){
  const dt = now - last;
  last = now;

  if (currentDemo === 'fluid'){
    // painting fade
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(6,10,18,0.14)'; // fade so particles leave trails
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    for (let p of particles){
      p.step(canvas.width, canvas.height, now);
      // draw particle
      ctx.beginPath();
      ctx.fillStyle = 'rgba(140,220,255,0.85)';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }

    // small overlay text
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(10,10,310,30);
    ctx.fillStyle = '#e6eef6';
    ctx.font = '13px system-ui, Arial';
    ctx.fillText('Fluidodinamica (demo semplificata) — clicca per respingere le particelle', 16, 32);

  } else {
    drawQuantum(now);
  }

  rafId = requestAnimationFrame(loop);
}

function resetAll(){
  resizeCanvas();
  initParticles();
  qX0 = -100;
}

// start
resetAll();
rafId = requestAnimationFrame(loop);

// expose a tiny API for debugging in console
window._demo = {
  setDemo: (d) => { select.value = d; select.dispatchEvent(new Event('change')); },
  reset: resetAll
};
