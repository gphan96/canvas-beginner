let canvas;
let ctx;
let flowField;
let animation;

window.onload = function() {
   canvas = document.getElementById('canvas1');
   ctx = canvas.getContext('2d');

   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;

   flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
   flowField.animate();
}

window.addEventListener('resize', function() {
   cancelAnimationFrame(animation);
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
   flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
   flowField.animate();
})

const mouse = {
   x: undefined,
   y: undefined
}
window.addEventListener('mousemove', function(e) {
   mouse.x = e.x;
   mouse.y = e.y;
})

class FlowFieldEffect {
   #ctx;
   #width;
   #height;

   constructor(ctx, width, height) {
      this.#ctx = ctx;
      this.#width = width;
      this.#height = height;
      // this.x = 0;
      // this.y = 0;
      // this.angle = 0;
      // this.count = 0;
      // this.radius = 30;
      this.cellSize = 13;
      this.lineLength;

      this.interval = 1000/60;
      this.then = Date.now();
      this.now;
      this.delta;

      this.radius = 0;
      this.vr = 0.1;
      this.gap = 10;

      this.gradient;
      this.#createGradient();
      this.#ctx.strokeStyle = this.gradient;
   }

   #createGradient(){
      this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
      this.gradient.addColorStop("0.1", "#ff5c33");
      this.gradient.addColorStop("0.2", "#ff66b3");
      this.gradient.addColorStop("0.4", "#ccccff");
      this.gradient.addColorStop("0.6", "#b3ffff");
      this.gradient.addColorStop("0.8", "#80ff80");
      this.gradient.addColorStop("0.9", "#ffff33");
   }

   #draw(x, y, angle) {
      let positionX = x;
      let positionY = y;
      let dx = mouse.x - positionX;
      let dy = mouse.y - positionY;
      let distance = dx * dx + dy * dy;
      if (distance < 50000) {
         this.lineLength = distance / 2000;
      } else {
         this.lineLength = 20;
      }
      
      // this.#ctx.strokeStyle = 'white';
      this.#ctx.lineWidth = 1;
      this.#ctx.beginPath();
      // this.#ctx.moveTo(x + Math.sin(this.angle) * 2 * this.radius, y + Math.cos(this.angle) * 2 *  this.radius);
      // this.#ctx.lineTo(x + Math.sin(this.angle) * 200, y + Math.cos(this.angle) * 200);
      this.#ctx.moveTo(x, y);
      this.#ctx.lineTo(x + Math.cos(angle) * this.lineLength, y + Math.sin(angle) * this.lineLength);
      this.#ctx.stroke();
      console.log(this.#ctx);
      
      // this.#ctx.fillStyle = 'red';
      // this.#ctx.beginPath();
      // this.#ctx.arc(x, y, this.radius, 0, Math.PI *2)
      // this.#ctx.fill();

      // this.count ++;
   }

   animate() {
      // this.angle += 0.1;
      // if (this.count % 63 === 0) {
      //    this.#ctx.clearRect(0, 0, this.#width, this.#height);
      // }
      this.#ctx.clearRect(0, 0, this.#width, this.#height);
      this.radius += this.vr;
      if (this.radius > this.gap || this.radius < -this.gap) {
         this.vr *= -1;
      }
      // this.#draw(this.x, this.y);
      // this.x += 3;
      // this.y += 5;
      for (let x = 0; x < this.#width; x += this.cellSize) {
         for (let y = 0; y < this.#height; y += this.cellSize) {
            const angle = (Math.cos(mouse.x * x * 0.0001) + Math.sin(mouse.y * y * 0.0001)) * this.radius;
            this.#draw(x, y, angle);
         }
      }
      // this.#draw(this.#width / 2, this.#height / 2);
      // setTimeout(() => {
      //    animation = requestAnimationFrame(this.animate.bind(this));
      // }, 1000);
      animation = requestAnimationFrame(this.animate.bind(this));
      this.now = Date.now();
      this.delta = this.now - this.then;
      if (this.delta > this.interval) {
         this.then = this.now - (this.delta % this.interval);
      }
   }
}