window.addEventListener('load', () => {
   const canvas = document.getElementById('canvas');
   const ctx = canvas.getContext('2d', {
      willReadFrequently: true
   });
   // const textInput = document.getElementById('textInput');

   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;

   // const text = 'abc def ghi klm nop qrt'
   // const textX = canvas.width / 2;
   // const textY = canvas.height / 2;

   class Particle {
      constructor(effect, x, y, color) {
         this.effect = effect;
         this.x = Math.random() * this.effect.canvasWidth;
         this.y = Math.random() * this.effect.canvasHeight;
         this.color = color;
         this.originalX = x;
         this.originalY = y;
         this.size = this.effect.gap / 5;
         this.dx = 0;
         this.dy = 0;
         this.vx = 0;
         this.vy = 0;
         this.force = 0;
         this.angle = 0;
         this.distance = 0;
         this.friction = 0.9;
         this.ease = 0.1;
      }
      draw() {
         this.effect.context.fillStyle = this.color;
         this.effect.context.beginPath();
         this.effect.context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
         this.effect.context.fill();
         // this.effect.context.fillRect(this.x, this.y, this.size, this.size);
      }
      update() {
         this.dx = this.effect.mouse.x - this.x;
         this.dy = this.effect.mouse.y - this.y;
         this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
         this.force = -this.effect.mouse.radius / this.distance;

         if (this.distance < this.effect.mouse.radius) {
            this.angle = Math.atan2(this.dy, this.dx);
            this.vx += this.force * Math.cos(this.angle);
            this.vy += this.force * Math.sin(this.angle);
         }

         this.x += (this.vx *= this.friction) + (this.originalX - this.x) * this.ease;
         this.y += (this.vy *= this.friction) + (this.originalY - this.y) * this.ease;
      }
   }

   class Effect {
      constructor(context, canvasWidth, canvasHeight) {
         this.context = context;
         this.canvasWidth = canvasWidth;
         this.canvasHeight = canvasHeight;
         this.textX = canvasWidth / 2;
         this.textY = canvasHeight / 2;
         this.fontSize = 350;
         this.lineHeight = this.fontSize;
         this.maxTextWidth = this.canvasWidth * 0.8;
         this.textInput = document.getElementById('textInput');
         this.textInput.addEventListener('keyup', (e) => {
            if (e.key !==  ' ') {
               this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
               this.wrapText(e.target.value);
            }
         });

         this.particles = [];
         this.gap = 20;
         this.mouse = {
            radius: 170,
            x: undefined, y: undefined
         }

         window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
         })
      }
      wrapText(text) {
         const gradient = this.context.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight);
         gradient.addColorStop(0.25, 'red');
         gradient.addColorStop(0.5, 'green');
         gradient.addColorStop(0.75, 'blue');
         this.context.fillStyle = gradient;
         // this.context.fillStyle = 'white';

         this.context.strokeStyle = 'white';
         this.context.lineWidth = 6;
         
         // this.context.font = 'bold ' + this.fontSize + 'px Bangers';
         this.context.font = 'bold ' + this.fontSize + 'px sans-serif';
         this.context.textAlign = 'center';
         this.context.textBaseline = 'middle';

         // this.context.fillText(text, this.textX, this.textY);
         // this.context.strokeText(text, this.textX, this.textY);


         let linesArray = [];
         let lineCounter = 0;
         let line = '';
         let words = text.split(' ');
         for (let i = 0; i < words.length; i++) {
            let testLine = line + words[i] + ' ';
            if (this.context.measureText(testLine).width > this.maxTextWidth) {
               line = words[i] + ' ';
               lineCounter++;
            } else {
               line = testLine;
            }
            linesArray[lineCounter] = line;
         }
         let textHeight = this.lineHeight * lineCounter;
         this.textY = this.canvasHeight / 2 - textHeight / 2;
         linesArray.forEach((line, index) => {
            this.context.fillText(line, this.textX, this.textY + index * this.lineHeight);
            // this.context.strokeText(line, this.textX, this.textY + index * this.lineHeight);
         });
         this.convertToParticle()
      }

      convertToParticle() {
         this.particles = [];
         const pixels = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight).data;
         this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
         for (let y = 0; y < this.canvasHeight; y += this.gap) {
            for (let x = 0; x < this.canvasWidth; x += this.gap) {
               const index = (y * this.canvasWidth + x) * 4;
               const alpha = pixels[index + 3];
               if (alpha > 0) {
                  const red = pixels[index];
                  const green = pixels[index + 1];
                  const blue = pixels[index + 2];
                  const color = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
                  this.particles.push(new Particle(this, x, y, color));
               }
            }
         }
      }
      render() {
         for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
            this.particles[i].draw();
            for (let j = 0; j < this.particles.length; j++) {
               const dx = this.particles[i].x - this.particles[j].x;
               const dy = this.particles[i].y - this.particles[j].y;
               const distance = Math.sqrt(dx * dx + dy * dy);
               if (distance <= 1.5 * this.gap) {
                  this.context.beginPath();
                  this.context.strokeStyle = this.particles[i].color;
                  this.context.lineWidth = 0.3;
                  this.context.moveTo(this.particles[i].x, this.particles[i].y);
                  this.context.lineTo(this.particles[j].x, this.particles[j].y);
                  this.context.stroke();
               }
            }
            // if (this.particles[i].size <= 0.3) {
            //    this.particles.splice(i, 1);
            //    i--;
            // }
         }
      }

      resize(width, height) {
         this.canvasWidth = width;
         this.canvasHeight = height;
         this.textX = this.canvasWidth / 2;
         this.textY = this.canvasHeight / 2;
         this.maxTextWidth = this.canvasWidth * 0.8;
      }
   }

   const effect = new Effect(ctx, canvas.width, canvas.height);
   effect.wrapText(effect.textInput.value);
   // effect.convertToParticle();

   function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      effect.render();
      requestAnimationFrame(animate);
   }
   animate();

   window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      effect.resize(canvas.width, canvas.height);
      effect.wrapText(effect.textInput.value);
   });
   // function drawAxis() {
   //    ctx.beginPath();
   //    ctx.strokeStyle = 'green';
   //    ctx.moveTo(textX, 0);
   //    ctx.lineTo(textX, canvas.height);
   //    ctx.stroke();
      
   //    ctx.beginPath();
   //    ctx.strokeStyle = 'white';
   //    ctx.moveTo(0, textY);
   //    ctx.lineTo(canvas.width, textY);
   //    ctx.stroke();
   // }
   // drawAxis();
   
   // const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
   // gradient.addColorStop(0.25, 'red');
   // gradient.addColorStop(0.5, 'purple');
   // gradient.addColorStop(0.75, 'blue');

   // ctx.font = '100px Helvetica1';
   // ctx.textAlign = 'center';
   // ctx.textBaseline = 'middle';
   // ctx.fillStyle = gradient;
   // // ctx.fillText(text, textX, textY);
   // ctx.lineWidth = 2;
   // ctx.strokeStyle = 'green';
   // // ctx.strokeText(text, textX, textY);

   // const maxTextWidth = canvas.width;
   // const lineHeight = 100;

   // function wrapText(text) {
   //    let linesArray = [];
   //    let lineCounter = 0;
   //    let line = '';
   //    let words = text.split(' ');
   //    let testLine;
   //    for (let i = 0; i < words.length; i++) {
   //       testLine = line + words[i] + ' ';
   //       if (ctx.measureText(testLine).width > maxTextWidth) {
   //          line = words[i] + ' ';
   //          lineCounter++;
   //       } else {
   //          line = testLine;
   //       }
   //       linesArray[lineCounter] = line;
   //       // ctx.fillText(testLine, textX, textY + i * 100);
   //    }
   //    let textHeight = lineHeight * lineCounter;
   //    let textY = canvas.height / 2 - textHeight / 2;
   //    linesArray.forEach((line, index) => {
   //       ctx.fillText(line, textX, textY + index * lineHeight);
   //    });
   // }

   // // wrapText(text);
   // textInput.addEventListener('keyup', function(e) {
   //    ctx.clearRect(0, 0, canvas.width, canvas.height);
   //    drawAxis();
   //    wrapText(e.target.value);
   // });
})

window.addEventListener('resize', function() {
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
})