const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', {
   willReadFrequently: true
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let textInput;

addEventListener('resize', function() {
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
   new TextEffect(textInput, ctx, canvas.width, canvas.height).animate();
})

const mouse = {
   x: undefined,
   y: undefined,
   radius: 150
}

addEventListener('mousemove', function(event) {
   mouse.x = event.x;
   mouse.y = event.y;
})

addEventListener('load', function() {
   // textInput = document.getElementById('textInput').value;
   textInput = 'Ass';
   new TextEffect(textInput, ctx, canvas.width, canvas.height).animate();
})


class TextEffect{
   constructor(input, context, canvaswidth, canvasheight) {
      this.input = input;
      this.context = context;
      this.canvaswidth = canvaswidth;
      this.canvasheight = canvasheight;
      this.originX = canvaswidth / 2;
      this.originY = 100;
      this.textWidth;
      this.fontSize = 30;
      this.particles = [];
      this.textBox;
      this.scaleUp = 20;
      this.minRange = 40;
      this.maxRange = 70;
      this.opacity = 0.07;

      this.textToParticle();
   }
   wrapText() {
      this.context.fillStyle = 'red';
      this.context.font = this.fontSize + 'px Verdana';
      this.textWidth = this.context.measureText(this.input).width + 5;
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.fillText(this.input, this.originX, this.originY);

      this.textBox = this.context.getImageData(this.originX - this.textWidth / 2, this.originY - this.fontSize / 2, this.textWidth, this.fontSize);
   }
   textToParticle() {
      this.wrapText();
      for (let y = 0; y < this.textBox.height; y++) {
         for (let x = 0; x < this.textBox.width; x++) {
            if (this.textBox.data[(y * 4 * this.textBox.width) + (x * 4) + 3] > 128) {
               this.particles.push(new Particle(this, this.canvaswidth / 2 + (x - this.textWidth / 2) * this.scaleUp, this.canvasheight / 2 + (y - this.fontSize / 2) * this.scaleUp));
            }
         }
      }
   }
   connectParticle() {
      for (let i = 0; i < this.particles.length; i++) {
         for (let j = 0; j < this.particles.length; j++) {
            let dx = this.particles[i].x - this.particles[j].x;
            let dy = this.particles[i].y - this.particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (this.minRange < distance && distance < this.maxRange) {
               this.context.strokeStyle = 'rgba(255,255,255,' + this.opacity + ')';
               this.context.lineWidth = 1;
               this.context.beginPath();
               this.context.moveTo(this.particles[i].x, this.particles[i].y);
               this.context.lineTo(this.particles[j].x, this.particles[j].y);
               this.context.stroke();
            }
         }
      }
   }
   animate() {
      this.context.clearRect(0, 0, this.canvaswidth, this.canvasheight);
      this.particles.forEach(particle => {
         particle.update();
         particle.draw();
      })
      this.connectParticle();
      requestAnimationFrame(this.animate.bind(this));
   }
}

class Particle {
   constructor(effect, x, y) {
      this.effect = effect;
      this.x = x;
      this.y = y;
      this.size = 5;
      this.originX = this.x;
      this.originY = this.y;
      this.density = Math.random() * 40 + 10;
   }
   draw() {
      this.effect.context.fillStyle = 'rgba(255,255,255,0.9)';
      this.effect.context.beginPath();
      this.effect.context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      this.effect.context.fill();
   }
   update() {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceX = dx / distance;
      let forceY = dy / distance;
      let force = (mouse.radius - distance) / mouse.radius;

      if (distance < mouse.radius) {
         this.x -= forceX * force * this.density;
         this.y -= forceY * force * this.density;
      } else {
         if (this.x !== this.originX) {
            let dx = this.x - this.originX;
            this.x -= dx/5;
         }
         if (this.y !== this.originY) {
            let dy = this.y - this.originY;
            this.y -= dy/5;
         }
      }
   }
}