let canvas;

window.addEventListener('load', function() {
   canvas = document.getElementById('canvasart');
   const ctx = canvas.getContext('2d');

   const generateButton = document.getElementById('generateButton');

   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;

   let sizePercent = 0.04;
   let size;
   let sides = 10;
   let branches = 1;
   let spread = 0;
   let scale = 0.7;
   let maxDepth = 10;
   let color = 'red';
   let direction;

   ctx.lineCap = 'round';
   ctx.lineWidth = 2;

   function drawBranch(depth) {
      if (depth > maxDepth) {
         return;
      }
      ctx.beginPath();
      ctx.moveTo(0, 0);
      // ctx.lineTo(size, 0);
      ctx.bezierCurveTo(size / 2, size * -3, size * 5, size * 10, size / 2, size / 2);
      ctx.strokeStyle = color;
      ctx.stroke();

      for (let i = 0; i < branches; i++) {
         ctx.save();
         ctx.translate(size - (size / branches) * i, 0);
         ctx.scale(scale, scale);

         let rotate = direction;
         
         if (direction === 0) {
            rotate = -1;
            // ctx.save();
            // ctx.rotate(-spread);
            // drawBranch(depth + 1);
            // ctx.restore();
         }

         ctx.save();
         ctx.rotate(rotate * spread * 5);
         drawBranch(depth + 1);
         ctx.restore();

         ctx.restore();
      }

      // ctx.beginPath();
      // ctx.arc(size / 3, 0, 10, 0, Math.PI * 2);
      // ctx.fillStyle = color;
      // ctx.fill();
   }

   function drawFractal(x, y) {
      ctx.save();
      ctx.translate(x, y);
      for (let i = 0; i < sides; i++) {
         ctx.rotate(Math.PI * 2 / sides * spread);
         drawBranch(0);
      }
      ctx.restore();
   }
   
   // drawFractal(0, 0);

   let maxPerLine = 5;
   let maxLine = 5;

   function generate() {
      for (let i = 0; i < maxLine; i++) {
         let maxJ = maxPerLine;
         let j = 0;
         if (i % 2 !== 0) {
            maxJ--;
            j += 0.5;
         }
         for (j; j < maxJ; j++) {
            color = 'hsl(' + Math.random() * 360 + ', 100%, 50%)';
            let x = (j + 0.5) * (canvas.width / maxPerLine);
            let y = (i + 0.5) * (canvas.height / maxLine);
            drawFractal(x, y);
         } 
      }
   }

   // generate();
   const step = 1 * Math.PI / 180;

   function animate() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      spread += step;
      generate();
      requestAnimationFrame(animate);
   }

   generateButton.addEventListener('click', function() {
      direction = Math.floor(Math.random() * 2);
      spread = 0;
      // sides = Math.floor(Math.random() * 5 + 3);
      // maxDepth = Math.floor(Math.random() * 2 + 3);
      color = 'hsl(' + Math.random() * 360 + ', 100%, 50%)';
      // maxPerLine = Math.floor(Math.random() * 3 + 2);
      // maxLine = Math.floor(Math.random() * 3 + 2);
      // if (direction === 0) {
      //    sizePercent = 0.1;
      //    sides = 3;
      //    maxDepth = 3;
      // }
      size = canvas.width < canvas.height ? canvas.width * sizePercent : canvas.height * sizePercent;
      cancelAnimationFrame(animate);
      animate();
   });
});


window.addEventListener('resize', function() {
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
})