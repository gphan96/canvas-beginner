const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let select = document.getElementById('select');

canvas.width = 1500;
canvas.height = 550;

class Background {
	constructor() {
		this.src = 'free_assets/backgroundLayers';
		this.backgroundImages = [];
		this.backgroundSpd = 0;
		this.width = 1833;
		this.speed = 0.7;
	}
	loadBackground() {
		fetch('/dir?path=' + this.src)
			.then((response) => response.json())
			.then((files) => {
				for (let i = 1; i <= files.length; i++) {
					let image = new Image();
					image.src = this.src + '/layer-' + i + '.png';
					this.backgroundImages.push(image);
				}
			})
			.catch((error) => console.error(error));
	}
	animateBackground() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.backgroundImages.forEach((image, index) => {
			let dx = index * index * this.speed * this.backgroundSpd % image.width;
			ctx.drawImage(image, dx, canvas.height - image.height);
			ctx.drawImage(image, dx + image.width - 1, canvas.height - image.height);
		});
	}
}

class Character {
	constructor(id) {
		this.id = id;
		this.src = 'free_assets/character_' + this.id + '/';
		this.actionImages = [];
		this.frame = 0;
		this.action;
		this.animate;
		this.previousFrameTime = 0;
		this.background = new Background();
	}
	run() {
		this.action = 'run';
		this.background.loadBackground();
		this.loadAction()
			 .then(() => {
					this.animateAction(0);
			 })
			 .catch((error) => console.error(error));
	}
	loadAction() {
		return fetch('/dir?path=' + this.src + this.action)
			.then((response) => response.json())
			.then((files) => {
				for (let i = 1; i <= files.length; i++) {
					let image = new Image();
					image.src = this.src + this.action + '/' + i + '.png';
					this.actionImages.push(image);
				}
			})
	}
	animateAction(currentTime) {
		let eslapsedTime = currentTime - this.previousFrameTime;
		if (eslapsedTime >= 1000 / FPS) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			this.background.animateBackground();
			ctx.drawImage(this.actionImages[this.frame], 300, canvas.height - this.actionImages[this.frame].height - 75);
			if (this.frame === this.actionImages.length - 1) {
				this.frame = 0;
			}
			this.frame++;
			this.background.backgroundSpd--;
			this.previousFrameTime = currentTime;
		}
		this.animate = requestAnimationFrame(this.animateAction.bind(this));
	}
	animateCancel() {
		cancelAnimationFrame(this.animate);
	}
}

const FPS = 30;
let character;

window.addEventListener('load', () => {
	character = new Character(select.value);
	character.run();
	console.log(character);
})

select.addEventListener('change', () => {
	if(character) {
		character.animateCancel();
	}
	character = new Character(select.value);
	character.run();
	console.log(character);
})