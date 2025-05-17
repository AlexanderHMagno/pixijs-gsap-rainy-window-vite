import * as PIXI from 'pixi.js';
import gsap from 'gsap';


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

const raindropTexture = PIXI.Assets.get('images/raindrop.png');
const heartTexture = PIXI.Assets.get('images/heart.png');
const backgroundTexture = PIXI.Assets.get('images/background.png');
const houseTexture = PIXI.Assets.get('images/house.png');
const lightningTexture = PIXI.Assets.get('images/lightning.png');

// Add a white overlay for lightning
const lightning = new PIXI.Sprite(lightningTexture);
lightning.width = app.screen.width;
lightning.height = app.screen.height;
lightning.alpha = 0;
app.stage.addChild(lightning);

// Add background
const background = new PIXI.Sprite(houseTexture);
background.width = app.screen.width;
background.height = app.screen.height;
app.stage.addChild(background);

// Raindrop animation
function createRaindrop(texture: PIXI.Texture) {
  const drop = new PIXI.Sprite(texture);
  drop.x = Math.random() * app.screen.width;
  drop.y = -Math.random() * 200;
  drop.alpha = 0.5 + Math.random() * 0.5;
  drop.scale.set(0.05 + Math.random() * 0.1);
  app.stage.addChild(drop);

  gsap.to(drop, {
    y: app.screen.height + 100,
    duration: 2 + Math.random() * 2,
    ease: 'none',
    repeat: -1,
    delay: Math.random() * 5,
    onRepeat: () => {
      drop.x = Math.random() * app.screen.width;
      drop.y = -Math.random() * 200;
    }
  });
}

for (let i = 0; i < 50; i++) createRaindrop(raindropTexture);


// Modify the pointerdown event handler
app.stage.eventMode = 'static';
app.stage.on('pointerdown', async (event) => {
  console.log('Pointer down event triggered:', event.global);
  const heartTexture = await PIXI.Assets.load('images/heart.png');
  const heart = new PIXI.Sprite(heartTexture);
  heart.zIndex = 1000;
  heart.anchor.set(0.5);
  heart.position.copyFrom(event.global);
  heart.scale.set(100);  // Larger initial scale
  heart.alpha = 1;
  heart.tint = 0xFF0000;  // Make it red to be more visible
  app.stage.addChild(heart);

  // Simpler animation to test visibility
  gsap.to(heart, {
    alpha: 0.5,
    scale: 1,
    duration: 0.1,
    ease: 'power1.out',
    onComplete: () => {
      console.log('Animation complete, removing heart');
      setTimeout(() => {
        app.stage.removeChild(heart);
      }, 1000);
    }
  });
});

// Remove the heart rain for now to simplify debugging
// for (let i = 0; i < 50; i++) createRaindrop(heartTexture);

// Lightning and thunder effect
function createLightningEffect() {
  // Flash effect
  gsap.timeline()
    .to(lightning, {
      alpha: 1,
      duration: 1,
      ease: 'power1.in'
    })
    .to(lightning, {
      alpha: 0,
      duration: 1,
      ease: 'power1.out'
    });

  // Screen shake
  gsap.to(app.stage, {
    x: 10,
    duration: 0.1,
    ease: 'steps(2)',
    yoyo: true,
    repeat: 5,
    onComplete: () => {
      app.stage.x = 0; // Reset position
    }
  });
}

// Trigger lightning randomly every ~15 seconds
function startWeatherEffects() {
  const triggerLightning = () => {
    const delay = 5000 + Math.random() * 5000; // 15-20 seconds
    setTimeout(() => {
      console.log('Triggering lightning');
      createLightningEffect();
      triggerLightning(); // Schedule next lightning
    }, delay);
  };

  triggerLightning(); // Start the cycle
}

startWeatherEffects();
