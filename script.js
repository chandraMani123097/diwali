const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.targetY = Math.random() * (canvas.height / 2);
    this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    this.exploded = false;
    this.particles = [];
  }

  rise() {
    this.y -= 4;
    if (this.y <= this.targetY) {
      this.explode();
    }
  }

  explode() {
    this.exploded = true;
    for (let i = 0; i < 100; i++) {
      this.particles.push(new Particle(this.x, this.y, this.color));
    }
  }

  draw() {
    if (!this.exploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.speed = Math.random() * 4 + 2;
    this.angle = Math.random() * 2 * Math.PI;
    this.radius = Math.random() * 2 + 1;
    this.color = color;
    this.alpha = 1;
    this.life = 100;
  }

  move() {
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);
    this.alpha -= 0.02;
    this.life--;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

let fireworks = [];

function launchFirework() {
  const x = Math.random() * canvas.width;
  const y = canvas.height;
  fireworks.push(new Firework(x, y));
}

function updateFireworks() {
  fireworks = fireworks.filter(
    (firework) =>
      !firework.exploded || firework.particles.some((p) => p.life > 0)
  );

  fireworks.forEach((firework) => {
    if (!firework.exploded) {
      firework.rise();
    } else {
      firework.particles.forEach((p) => p.move());
    }
  });
}

function drawFireworks() {
  fireworks.forEach((firework) => {
    if (!firework.exploded) {
      firework.draw();
    } else {
      firework.particles.forEach((p) => {
        if (p.life > 0) p.draw();
      });
    }
  });
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateFireworks();
  drawFireworks();
  requestAnimationFrame(loop);
}

setInterval(launchFirework, 900);
loop();
