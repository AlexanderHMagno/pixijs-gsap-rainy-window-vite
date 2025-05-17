import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import { Lightning } from './components/Lightning';
import { Background } from './components/Background';
import { RainDrop } from './components/RainDrop';
import { Sound } from './components/Sound';

// Initialize application using the new API
const app = new PIXI.Application();
await app.init({
  resizeTo: window,
  backgroundColor: 0x000000,
});
document.body.appendChild(app.canvas);

// Load textures
await PIXI.Assets.load([
  'images/raindrop.png',
  'images/heart.png',
  'images/background.png',
  'images/house.png',
  'images/lightning.png'
]);

const textures = {
  raindrop: PIXI.Assets.get('images/raindrop.png'),
  heart: PIXI.Assets.get('images/heart.png'),
  background: PIXI.Assets.get('images/background.png'),
  house: PIXI.Assets.get('images/house.png'),
  lightning: PIXI.Assets.get('images/lightning.png')
};

// Initialize components
const lightning = new Lightning(app, textures.lightning);
const background = new Background(app, textures.house);
const rainDrop = new RainDrop(app, textures.raindrop);
const rainSound = new Sound('sounds/rain.mp3', true);

// Start visual effects
rainDrop.createMultiple(50);
lightning.startWeatherEffects();

// Create controls container
const controls = document.createElement('div');
controls.style.position = 'absolute';
controls.style.bottom = '10%';
controls.style.right = '10%';
controls.style.display = 'flex';
controls.style.flexDirection = 'column';
controls.style.alignItems = 'center';
controls.style.padding = '20px';
document.body.appendChild(controls);

// Create play button
const startButton = document.createElement('button');
startButton.textContent = 'Play Sound';
startButton.style.background = 'linear-gradient(to right, #000000, #000000, #8A2BE2)';
startButton.style.border = '1px solid black';
startButton.style.borderRadius = '50%';
startButton.style.width = '100px';
startButton.style.height = '100px';
startButton.style.fontSize = '18px';
startButton.style.color = 'white';
startButton.style.cursor = 'pointer';
controls.appendChild(startButton);

// Event handler
startButton.onclick = () => {
    rainSound.play();
    startButton.textContent = rainSound.isCurrentlyPlaying() ? 'Pause Sound' : 'Play Sound';
};

// Heart click handler
app.stage.eventMode = 'static';
app.stage.on('pointerdown', async (event) => {
  const heart = new PIXI.Sprite(textures.heart);
  heart.zIndex = 1000;
  heart.anchor.set(0.5);
  heart.position.copyFrom(event.global);
  heart.scale.set(100);
  heart.alpha = 1;
  heart.tint = 0xFF0000;
  app.stage.addChild(heart);

  gsap.to(heart, {
    alpha: 0.5,
    scale: 1,
    duration: 0.1,
    ease: 'power1.out',
    onComplete: () => {
      setTimeout(() => {
        app.stage.removeChild(heart);
      }, 1000);
    }
  });
});
