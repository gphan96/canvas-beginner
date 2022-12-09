const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particleArray = [];
let hue = 0;

const mouse = {
   x: undefined,
   y: undefined
}

window.addEventListener('resize', () => {
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
})

window.addEventListener('load', () => {
   window.addEventListener('click', function(e) {
      mouse.x = e.x;
      mouse.y = e.y;
      for (let i = 0; i < 10; i++) {
         particleArray.push(new Particle());
      }
   })

   window.addEventListener('mousemove', function(e) {
      mouse.x = e.x;
      mouse.y = e.y;
      for (let i = 0; i < 2; i++) {
         particleArray.push(new Particle());
      }
   })

   class Particle {
      constructor() {
         this.x = mouse.x;
         this.y = mouse.y;
         this.size = Math.random() * 20 + 1;
         this.speedX = Math.random() * 3 - 1;
         this.speedY = Math.random() * 3 - 1;
         this.color = 'hsl(' + hue + ', 100%, 50%)';
      }
      update() {
         this.x += this.speedX;
         this.y += this.speedY;
         if (this.size > 0.3) {
            this.size -= 0.2
         }
      }
      draw() {
         ctx.fillStyle = this.color;
         ctx.beginPath();
         ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
         ctx.fill();
      }
   }

   function handleParticle() {
      for (let i = 0; i < particleArray.length; i++) {
         particleArray[i].update();
         particleArray[i].draw();
         for (let j = 0; j < particleArray.length; j++) {
            const dx = particleArray[i].x - particleArray[j].x;
            const dy = particleArray[i].y - particleArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
               ctx.beginPath();
               ctx.strokeStyle = particleArray[i].color;
               ctx.lineWidth = 0.3;
               ctx.moveTo(particleArray[i].x, particleArray[i].y);
               ctx.lineTo(particleArray[j].x, particleArray[j].y);
               ctx.stroke();
            }
         }
         if (particleArray[i].size <= 0.3) {
            particleArray.splice(i, 1);
            i--;
         }
      }
   }

   function animate() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      handleParticle();
      hue += 2;
      requestAnimationFrame(animate);
   }
   animate();
})


