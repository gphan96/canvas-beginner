const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 900;
canvas.height = 400;

const characters = [1, 2, 4, 5, 6, 7];
const actions = ['/run/', '/roll/', '/jump/', '/KO/'];

let assetPath = 'free_assets/' + characters[2] + actions[3];

let images = [];
let frame = 0;
const frameRate = 30;

function loadAssets() {
	console.log(assetPath);
	fetch('/dir?path=' + assetPath)
		.then((response) => response.json())
		.then((files) => {
			for (let i = 0; i < files.length; i++) {
				let image = new Image();
				image.src = assetPath + (i + 1) + '.png';
				images.push(image);
			}
			animate();
		})
		.catch((error) => console.error(error));
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(images[frame], 100, canvas.height - images[frame].height - 50);
	if (frame === images.length - 1) {
		frame = 0;
	}
	frame++;
	
	setTimeout(() => {
		requestAnimationFrame(animate);
	}, 1000 / frameRate);
}

window.addEventListener('load', () => {
	loadAssets();
})
