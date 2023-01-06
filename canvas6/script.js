const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const characters = [1, 2, 3, 4, 5, 6, 7];
const actions = ['/run/', '/roll/', '/jump/', '/KO/'];

let assetPath = 'free_assets/' + characters[0] + actions[0];

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
	ctx.drawImage(images[frame], 0, canvas.height - images[frame].height);
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
