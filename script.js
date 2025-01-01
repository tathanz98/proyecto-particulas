const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const circleRadius = Math.min(canvas.width, canvas.height) / 3; // Radio del planetario
let particles = [];

class Particle {
  constructor() {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * circleRadius;

    this.x = centerX + radius * Math.cos(angle);
    this.y = centerY + radius * Math.sin(angle);
    this.speedX = (Math.random() - 0.5) * 2;
    this.speedY = (Math.random() - 0.5) * 2;
    this.size = Math.random() * 2 + 1;
    this.color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.8)`;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Rebote dentro del círculo
    const dx = this.x - centerX;
    const dy = this.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > circleRadius) {
      const angle = Math.atan2(dy, dx);
      this.x = centerX + circleRadius * Math.cos(angle);
      this.y = centerY + circleRadius * Math.sin(angle);
      this.speedX *= -1;
      this.speedY *= -1;
    }
  }
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function initParticles(count) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar el círculo central
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(18, 38, 216, 0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  connectParticles();
  requestAnimationFrame(animate);
}

// Inicializar y animar
initParticles(100);
animate();
